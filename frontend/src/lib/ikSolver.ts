import * as THREE from 'three';

/**
 * Analytical 2-bone IK solver with pole vector.
 * Ported 1:1 from app.js.
 */
export function solve2BoneIK(
  rootPos: THREE.Vector3,
  targetPos: THREE.Vector3,
  upperLen: number,
  lowerLen: number,
  polePos: THREE.Vector3
): THREE.Vector3 {
  const toTarget = targetPos.clone().sub(rootPos);
  let dist = toTarget.length();

  const maxReach = upperLen + lowerLen - 0.001;
  const minReach = Math.abs(upperLen - lowerLen) + 0.001;
  dist = Math.min(Math.max(dist, minReach), maxReach);

  const dir = toTarget.clone().normalize();

  const cosA =
    (upperLen * upperLen + dist * dist - lowerLen * lowerLen) /
    (2 * upperLen * dist);
  const angleA = Math.acos(Math.min(Math.max(cosA, -1), 1));

  const toPole = polePos.clone().sub(rootPos);
  const poleOnAxis = dir.clone().multiplyScalar(toPole.dot(dir));
  const polePerp = toPole.clone().sub(poleOnAxis);

  let bendDir: THREE.Vector3;
  if (polePerp.lengthSq() < 0.0001) {
    const fallback = new THREE.Vector3(0, -1, 0);
    const fallbackOnAxis = dir.clone().multiplyScalar(fallback.dot(dir));
    bendDir = fallback.clone().sub(fallbackOnAxis).normalize();
  } else {
    bendDir = polePerp.normalize();
  }

  const elbowDir = dir
    .clone()
    .multiplyScalar(Math.cos(angleA))
    .add(bendDir.clone().multiplyScalar(Math.sin(angleA)));

  return rootPos.clone().add(elbowDir.multiplyScalar(upperLen));
}

/**
 * Rotate a bone so its child-pointing direction aims at a world target.
 */
export function aimBoneAt(bone: THREE.Bone, targetWorldPos: THREE.Vector3): void {
  if (!bone || bone.children.length === 0) return;

  bone.updateMatrixWorld(true);

  const boneWPos = new THREE.Vector3();
  bone.getWorldPosition(boneWPos);

  const childBone = bone.children.find((c): c is THREE.Bone => (c as THREE.Bone).isBone);
  if (!childBone) return;

  const childWPos = new THREE.Vector3();
  childBone.getWorldPosition(childWPos);

  const currentDir = childWPos.clone().sub(boneWPos).normalize();
  const desiredDir = targetWorldPos.clone().sub(boneWPos).normalize();

  if (currentDir.distanceTo(desiredDir) < 0.0001) return;

  const worldRot = new THREE.Quaternion().setFromUnitVectors(currentDir, desiredDir);

  const boneWorldQ = new THREE.Quaternion();
  bone.getWorldQuaternion(boneWorldQ);

  const newWorldQ = worldRot.clone().multiply(boneWorldQ);

  const parentWorldQ = new THREE.Quaternion();
  if (bone.parent) {
    bone.parent.getWorldQuaternion(parentWorldQ);
  }
  bone.quaternion.copy(parentWorldQ.clone().invert().multiply(newWorldQ));
  bone.updateMatrixWorld(true);
}

export interface ArmData {
  upperLen: number;
  lowerLen: number;
}

export interface BodyLandmarks {
  head: THREE.Vector3;
  neck: THREE.Vector3;
  chest: THREE.Vector3;
  spine: THREE.Vector3;
  hips: THREE.Vector3;
  rShoulder: THREE.Vector3;
  lShoulder: THREE.Vector3;
  rHand: THREE.Vector3;
  lHand: THREE.Vector3;
}

export type LandmarkKey = keyof BodyLandmarks;

/**
 * Constrain hand target to avoid body clipping.
 */
export function constrainHandTarget(
  side: 'Right' | 'Left',
  handTarget: THREE.Vector3,
  lm: BodyLandmarks,
  armData: { right: ArmData; left: ArmData }
): THREE.Vector3 {
  const target = handTarget.clone();
  const torsoCenter = lm.chest.clone().lerp(lm.spine, 0.35);
  const shoulderSpan = Math.max(lm.rShoulder.distanceTo(lm.lShoulder), 0.24);
  const sideSign = side === 'Right' ? -1 : 1;
  const torsoHalfWidth = shoulderSpan * 0.34;
  const torsoHalfHeight = Math.max((lm.neck.y - lm.hips.y) * 0.34, 0.18);
  const torsoHalfDepth = 0.2;
  const ownSideMin = torsoHalfWidth * 0.45;
  const torsoMinY = lm.hips.y + 0.04;
  const torsoMaxY = lm.neck.y + 0.04;

  if (target.y >= torsoMinY && target.y <= torsoMaxY) {
    const local = target.clone().sub(torsoCenter);
    local.x = sideSign * Math.max(sideSign * local.x, ownSideMin);

    const normalized =
      (local.x * local.x) / (torsoHalfWidth * torsoHalfWidth) +
      (local.y * local.y) / (torsoHalfHeight * torsoHalfHeight) +
      (local.z * local.z) / (torsoHalfDepth * torsoHalfDepth);

    if (normalized < 1) {
      const push = new THREE.Vector3(
        local.x + sideSign * torsoHalfWidth * 0.8,
        local.y * 0.35,
        Math.max(local.z, torsoHalfDepth * 1.4)
      ).normalize();
      local.copy(
        push.multiply(
          new THREE.Vector3(
            torsoHalfWidth * 1.08,
            torsoHalfHeight * 1.02,
            torsoHalfDepth * 1.22
          )
        )
      );
    }

    local.z = Math.max(local.z, torsoHalfDepth * 0.92 - Math.abs(local.y) * 0.05);
    target.copy(torsoCenter.clone().add(local));
  }

  const shoulderPos = side === 'Right' ? lm.rShoulder : lm.lShoulder;
  const fromShoulder = target.clone().sub(shoulderPos);
  const shoulderBuffer = armData[side.toLowerCase() as 'right' | 'left'].upperLen * 0.3;
  if (fromShoulder.length() < shoulderBuffer) {
    fromShoulder.setLength(shoulderBuffer);
    target.copy(shoulderPos.clone().add(fromShoulder));
  }

  const torsoCenter2 = lm.chest.clone().lerp(lm.spine, 0.35);
  target.x =
    torsoCenter2.x +
    sideSign * Math.max(sideSign * (target.x - torsoCenter2.x), ownSideMin * 0.75);

  return target;
}

/**
 * Apply full arm IK: reset → constrain → solve → aim bones.
 */
export function applyArmIK(
  side: 'Right' | 'Left',
  handTarget: THREE.Vector3,
  bones: Record<string, THREE.Bone>,
  restPose: Record<string, THREE.Quaternion>,
  lm: BodyLandmarks,
  armData: { right: ArmData; left: ArmData }
): void {
  const armBone = bones[side + 'Arm'];
  const forearmBone = bones[side + 'ForeArm'];
  const handBone = bones[side + 'Hand'];
  if (!armBone || !forearmBone || !handBone) return;

  armBone.quaternion.copy(restPose[side + 'Arm']);
  forearmBone.quaternion.copy(restPose[side + 'ForeArm']);
  handBone.quaternion.copy(restPose[side + 'Hand']);
  armBone.updateMatrixWorld(true);

  const target = constrainHandTarget(side, handTarget, lm, armData);

  const shoulderPos = new THREE.Vector3();
  armBone.getWorldPosition(shoulderPos);

  const data = armData[side.toLowerCase() as 'right' | 'left'];
  const midpoint = shoulderPos.clone().add(target).multiplyScalar(0.5);
  const sideDir = side === 'Right' ? -1 : 1;
  const polePos = midpoint.clone().add(new THREE.Vector3(sideDir * 0.3, -0.5, 0.0));

  const elbowTarget = solve2BoneIK(shoulderPos, target, data.upperLen, data.lowerLen, polePos);

  aimBoneAt(armBone, elbowTarget);
  aimBoneAt(forearmBone, target);
  handBone.quaternion.copy(restPose[side + 'Hand']);
  handBone.updateMatrixWorld(true);
}

/** Ease in-out curve. */
export function easeIO(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Resolve a keyframe hand target [landmark, [x,y,z]] into a world Vector3.
 */
export function resolveTarget(
  ref: [string, [number, number, number]],
  lm: BodyLandmarks
): THREE.Vector3 {
  const landmark = lm[ref[0] as LandmarkKey] ?? lm.chest;
  const [x, y, z] = ref[1];
  return landmark.clone().add(new THREE.Vector3(x, y, z));
}

/**
 * Generate a fingerspelling position for a character.
 */
export function getAlphaTarget(ch: string, lm: BodyLandmarks): THREE.Vector3 {
  const i = ch.charCodeAt(0) - 97; // a=0
  const angle = (i / 26) * Math.PI * 2;
  return lm.head
    .clone()
    .add(
      new THREE.Vector3(
        Math.sin(angle) * 0.15,
        -0.05 + Math.cos(angle) * 0.1,
        0.2 + Math.sin(angle + 1) * 0.05
      )
    );
}
