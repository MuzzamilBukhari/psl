'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslatorStore } from '@/store/translatorStore';
import {
  applyArmIK,
  BodyLandmarks,
  ArmData,
  easeIO,
  resolveTarget,
} from '@/lib/ikSolver';
import {
  HANDSHAPES,
  ALPHA_SHAPES,
  CurlAxisInfo,
  detectCurlAxis,
  applyFingerCurls,
  shapeToCurlTargets,
} from '@/lib/handshapes';
import type { Sign, Keyframe } from '@/lib/api';

const AVATAR_PATH = '/avatar.glb';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getBoneByName(
  root: THREE.Object3D,
  names: string[]
): THREE.Bone | null {
  for (const name of names) {
    let found: THREE.Bone | null = null;
    root.traverse((n) => {
      if (!found && n instanceof THREE.Bone && n.name === name) found = n;
    });
    if (found) return found;
  }
  return null;
}

function getWorldPos(bone: THREE.Bone | null): THREE.Vector3 {
  if (!bone) return new THREE.Vector3();
  const p = new THREE.Vector3();
  bone.getWorldPosition(p);
  return p;
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AvatarModel() {
  const { scene } = useGLTF(AVATAR_PATH);

  // Mutable refs (no re-renders)
  const bonesRef = useRef<Record<string, THREE.Bone>>({});
  const restPoseRef = useRef<Record<string, THREE.Quaternion>>({});
  const lmRef = useRef<BodyLandmarks>({
    head: new THREE.Vector3(),
    neck: new THREE.Vector3(),
    chest: new THREE.Vector3(),
    spine: new THREE.Vector3(),
    hips: new THREE.Vector3(),
    rShoulder: new THREE.Vector3(),
    lShoulder: new THREE.Vector3(),
    rHand: new THREE.Vector3(),
    lHand: new THREE.Vector3(),
  });
  const armDataRef = useRef<{ right: ArmData; left: ArmData }>({
    right: { upperLen: 0.3, lowerLen: 0.28 },
    left: { upperLen: 0.3, lowerLen: 0.28 },
  });

  // Animation queue state (all mutable, no re-render needed)
  const isPlayingRef = useRef(false);
  const pendingTokensRef = useRef<string[]>([]);
  const pendingSignsRef = useRef<Sign[]>([]);
  const dirtyBonesRef = useRef(new Set<string>());

  // Handshape state: detected curl axes + current per-bone curl amounts
  const curlAxisRef = useRef<{ Right: CurlAxisInfo; Left: CurlAxisInfo }>({
    Right: { axis: new THREE.Vector3(0, 0, 1), thumbAxis: new THREE.Vector3(0, 0, 1) },
    Left: { axis: new THREE.Vector3(0, 0, -1), thumbAxis: new THREE.Vector3(0, 0, -1) },
  });
  const fingerCurlsRef = useRef<Record<string, number>>({});

  // Store access
  const { tokens, signs, speed, status, setAvatarReady, setStatus, setActiveTokenIndex } =
    useTranslatorStore();

  // ── Setup on mount ──────────────────────────────────────────────────────────

  useEffect(() => {
    const bones: Record<string, THREE.Bone> = {};

    scene.traverse((node) => {
      if (node instanceof THREE.Bone) {
        bones[node.name] = node;
      }
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        // Hide tiny tracking dots
        if (node.geometry) {
          const box = new THREE.Box3().setFromBufferAttribute(
            node.geometry.attributes.position as THREE.BufferAttribute
          );
          const sz = box.getSize(new THREE.Vector3());
          if (sz.x < 0.03 && sz.y < 0.03 && sz.z < 0.03) node.visible = false;
        }
        if (node.material && !Array.isArray(node.material)) {
          const mat = node.material as THREE.MeshStandardMaterial;
          if (mat.color && mat.color.r > 0.8 && mat.color.g < 0.3 && mat.color.b < 0.3) {
            node.visible = false;
          }
        }
      }
    });

    bonesRef.current = bones;
    scene.updateMatrixWorld(true);

    // Store rest poses
    const restPose: Record<string, THREE.Quaternion> = {};
    for (const [name, bone] of Object.entries(bones)) {
      restPose[name] = bone.quaternion.clone();
    }
    restPoseRef.current = restPose;

    // Compute body landmarks
    const get = (...names: string[]): THREE.Vector3 => {
      for (const n of names) {
        if (bones[n]) return getWorldPos(bones[n]);
      }
      return new THREE.Vector3();
    };

    lmRef.current = {
      head: get('Head'),
      neck: get('Neck'),
      chest: get('Spine2', 'Spine1', 'Spine'),
      spine: get('Spine1', 'Spine'),
      hips: get('Hips'),
      rShoulder: get('RightArm'),
      lShoulder: get('LeftArm'),
      rHand: get('RightHand'),
      lHand: get('LeftHand'),
    };

    // Measure arm lengths
    const measureArm = (side: 'Right' | 'Left') => {
      const shoulder = bones[side + 'Arm'];
      const elbow = bones[side + 'ForeArm'];
      const hand = bones[side + 'Hand'];
      if (!shoulder || !elbow || !hand)
        return { upperLen: 0.3, lowerLen: 0.28 };
      const sPos = getWorldPos(shoulder);
      const ePos = getWorldPos(elbow);
      const hPos = getWorldPos(hand);
      return {
        upperLen: sPos.distanceTo(ePos),
        lowerLen: ePos.distanceTo(hPos),
      };
    };

    armDataRef.current = {
      right: measureArm('Right'),
      left: measureArm('Left'),
    };

    // Detect finger curl axes (rig-dependent) and start from the rest shape
    curlAxisRef.current = {
      Right: detectCurlAxis('Right', bones, restPose),
      Left: detectCurlAxis('Left', bones, restPose),
    };
    const initialCurls: Record<string, number> = {
      ...shapeToCurlTargets('Right', HANDSHAPES.rest),
      ...shapeToCurlTargets('Left', HANDSHAPES.rest),
    };
    fingerCurlsRef.current = initialCurls;
    applyFingerCurls('Right', initialCurls, bones, restPose, curlAxisRef.current.Right);
    applyFingerCurls('Left', initialCurls, bones, restPose, curlAxisRef.current.Left);

    setAvatarReady(true);
    console.log(
      '[AvatarModel] Ready. Bones:',
      Object.keys(bones).length,
      'curl axes:',
      curlAxisRef.current.Right.axis.toArray(),
      curlAxisRef.current.Left.axis.toArray()
    );

    // Dev-only inspection hook (used for debugging/verification)
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as Record<string, unknown>).__V2PSL_DEBUG = {
        bones,
        curls: fingerCurlsRef.current,
        curlAxes: curlAxisRef.current,
      };
    }
  }, [scene, setAvatarReady]);

  // ── Watch token changes → trigger sign sequence ─────────────────────────────

  useEffect(() => {
    if (!tokens.length || status !== 'idle') return;
    pendingTokensRef.current = [...tokens];
    pendingSignsRef.current = [...signs];
    playSequence();
  }, [tokens]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Animation helpers ───────────────────────────────────────────────────────

  const getCurrentHandPos = useCallback((side: 'Right' | 'Left') => {
    const hand = bonesRef.current[side + 'Hand'];
    if (!hand) return side === 'Right' ? lmRef.current.rHand.clone() : lmRef.current.lHand.clone();
    return getWorldPos(hand);
  }, []);

  /** Lerp one hand's finger curls toward a named handshape at progress t. */
  const lerpHandshape = useCallback(
    (
      side: 'Right' | 'Left',
      startCurls: Record<string, number>,
      targets: Record<string, number>,
      t: number
    ) => {
      for (const [name, target] of Object.entries(targets)) {
        const start = startCurls[name] ?? 0;
        fingerCurlsRef.current[name] = start + (target - start) * t;
      }
      applyFingerCurls(
        side,
        fingerCurlsRef.current,
        bonesRef.current,
        restPoseRef.current,
        curlAxisRef.current[side]
      );
      dirtyBonesRef.current.add(side);
    },
    []
  );

  const animateKeyframe = useCallback(
    (kf: Keyframe, spd: number): Promise<void> => {
      const duration = kf.d / spd;
      const startRH = kf.rh ? getCurrentHandPos('Right') : null;
      const startLH = kf.lh ? getCurrentHandPos('Left') : null;

      // Handshape targets (optional per keyframe)
      const startCurls = { ...fingerCurlsRef.current };
      const rhShape = kf.rhs ? HANDSHAPES[kf.rhs] : null;
      const lhShape = kf.lhs ? HANDSHAPES[kf.lhs] : null;
      const rhCurlTargets = rhShape ? shapeToCurlTargets('Right', rhShape) : null;
      const lhCurlTargets = lhShape ? shapeToCurlTargets('Left', lhShape) : null;

      const startHeadX =
        kf.headX !== undefined && bonesRef.current['Head']
          ? new THREE.Euler().setFromQuaternion(bonesRef.current['Head'].quaternion).x
          : null;
      const startHeadY =
        kf.headY !== undefined && bonesRef.current['Head']
          ? new THREE.Euler().setFromQuaternion(bonesRef.current['Head'].quaternion).y
          : null;

      const targetRH = kf.rh ? resolveTarget(kf.rh, lmRef.current) : null;
      const targetLH = kf.lh ? resolveTarget(kf.lh, lmRef.current) : null;

      const t0 = performance.now();

      return new Promise<void>((resolve) => {
        const step = (now: number) => {
          let t = Math.min((now - t0) / duration, 1);
          t = easeIO(t);

          if (targetRH && startRH) {
            applyArmIK('Right', startRH.clone().lerp(targetRH, t), bonesRef.current, restPoseRef.current, lmRef.current, armDataRef.current);
            dirtyBonesRef.current.add('Right');
          }
          if (targetLH && startLH) {
            applyArmIK('Left', startLH.clone().lerp(targetLH, t), bonesRef.current, restPoseRef.current, lmRef.current, armDataRef.current);
            dirtyBonesRef.current.add('Left');
          }

          if (rhCurlTargets) lerpHandshape('Right', startCurls, rhCurlTargets, t);
          if (lhCurlTargets) lerpHandshape('Left', startCurls, lhCurlTargets, t);

          const headBone = bonesRef.current['Head'];
          const headRest = restPoseRef.current['Head'];
          if (kf.headX !== undefined && headBone && headRest) {
            const angle = (startHeadX ?? 0) + (kf.headX - (startHeadX ?? 0)) * t;
            headBone.quaternion.copy(headRest);
            headBone.rotateX(angle);
            dirtyBonesRef.current.add('Head');
          }
          if (kf.headY !== undefined && headBone && headRest) {
            const angle = (startHeadY ?? 0) + (kf.headY - (startHeadY ?? 0)) * t;
            headBone.quaternion.copy(headRest);
            headBone.rotateY(angle);
            if (kf.headX !== undefined) {
              const xAngle = (startHeadX ?? 0) + (kf.headX - (startHeadX ?? 0)) * t;
              headBone.rotateX(xAngle);
            }
            dirtyBonesRef.current.add('Head');
          }

          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    },
    [getCurrentHandPos, lerpHandshape]
  );

  const animateToRest = useCallback((duration: number): Promise<void> => {
    const startQ: Record<string, THREE.Quaternion> = {};
    const targetQ: Record<string, THREE.Quaternion> = {};
    const allDirty = new Set<string>();

    dirtyBonesRef.current.forEach((side) => {
      if (side === 'Right' || side === 'Left') {
        ['Arm', 'ForeArm', 'Hand'].forEach((part) => {
          const name = side + part;
          if (bonesRef.current[name] && restPoseRef.current[name]) {
            startQ[name] = bonesRef.current[name].quaternion.clone();
            targetQ[name] = restPoseRef.current[name].clone();
            allDirty.add(name);
          }
        });
      } else if (side === 'Head') {
        if (bonesRef.current['Head'] && restPoseRef.current['Head']) {
          startQ['Head'] = bonesRef.current['Head'].quaternion.clone();
          targetQ['Head'] = restPoseRef.current['Head'].clone();
          allDirty.add('Head');
        }
      }
    });
    // Relax fingers of any dirty hand back to the neutral rest shape
    const handSides = (['Right', 'Left'] as const).filter((s) =>
      dirtyBonesRef.current.has(s)
    );
    const startCurls = { ...fingerCurlsRef.current };
    const restCurlTargets: Partial<Record<'Right' | 'Left', Record<string, number>>> = {};
    for (const s of handSides) {
      restCurlTargets[s] = shapeToCurlTargets(s, HANDSHAPES.rest);
    }

    dirtyBonesRef.current.clear();

    if (allDirty.size === 0 && handSides.length === 0) return Promise.resolve();

    const t0 = performance.now();
    return new Promise<void>((resolve) => {
      const step = (now: number) => {
        let t = Math.min((now - t0) / duration, 1);
        t = easeIO(t);
        for (const name of allDirty) {
          if (bonesRef.current[name]) {
            bonesRef.current[name].quaternion.copy(startQ[name]).slerp(targetQ[name], t);
          }
        }
        for (const s of handSides) {
          lerpHandshape(s, startCurls, restCurlTargets[s]!, t);
        }
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }, [lerpHandshape]);

  const fingerspell = useCallback(
    async (word: string, idx: number, spd: number) => {
      setActiveTokenIndex(idx);
      const letters = [...word.toLowerCase()].filter((c) => c >= 'a' && c <= 'z');
      if (!letters.length) return;

      // Fingerspelling position: hand raised beside the right shoulder,
      // slightly forward — where a signer actually holds it.
      const lm = lmRef.current;
      const spellPos = lm.rShoulder
        .clone()
        .add(new THREE.Vector3(-0.12, 0.18, 0.28));

      // Raise the hand into position first
      {
        const startPos = getCurrentHandPos('Right');
        const t0 = performance.now();
        const dur = 350 / spd;
        await new Promise<void>((resolve) => {
          const step = (now: number) => {
            let t = Math.min((now - t0) / dur, 1);
            t = easeIO(t);
            applyArmIK('Right', startPos.clone().lerp(spellPos, t), bonesRef.current, restPoseRef.current, lmRef.current, armDataRef.current);
            dirtyBonesRef.current.add('Right');
            if (t < 1) requestAnimationFrame(step);
            else resolve();
          };
          requestAnimationFrame(step);
        });
      }

      // Form each letter's handshape, with a tiny bounce so repeated
      // letters read as separate.
      for (let li = 0; li < letters.length; li++) {
        const shape = ALPHA_SHAPES[letters[li]];
        if (!shape) continue;
        const targets = shapeToCurlTargets('Right', shape);
        const startCurls = { ...fingerCurlsRef.current };
        const bounce = li > 0 && letters[li] === letters[li - 1] ? 0.04 : 0.015;
        const basePos = getCurrentHandPos('Right');
        const t0 = performance.now();
        const dur = 200 / spd;
        await new Promise<void>((resolve) => {
          const step = (now: number) => {
            let t = Math.min((now - t0) / dur, 1);
            t = easeIO(t);
            lerpHandshape('Right', startCurls, targets, t);
            // small vertical dip-and-return so letter changes are visible
            const dip = Math.sin(t * Math.PI) * bounce;
            applyArmIK('Right', basePos.clone().add(new THREE.Vector3(0, -dip, 0)), bonesRef.current, restPoseRef.current, lmRef.current, armDataRef.current);
            dirtyBonesRef.current.add('Right');
            if (t < 1) requestAnimationFrame(step);
            else resolve();
          };
          requestAnimationFrame(step);
        });
        await delay(140 / spd);
      }
    },
    [getCurrentHandPos, setActiveTokenIndex, lerpHandshape]
  );

  const playSequence = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setStatus('signing');

    const tokensCopy = pendingTokensRef.current;
    const signsCopy = pendingSignsRef.current;
    const signMap = new Map(signsCopy.map((s) => [s.key, s]));
    const spd = useTranslatorStore.getState().speed;

    for (let i = 0; i < tokensCopy.length; i++) {
      const token = tokensCopy[i];
      const sign = signMap.get(token);

      setActiveTokenIndex(i);

      if (sign) {
        for (const kf of sign.keyframes) {
          await animateKeyframe(kf, spd);
        }
        await delay(180 / spd);
      } else {
        await fingerspell(token, i, spd);
      }

      await animateToRest(250 / spd);
      await delay(100 / spd);
    }

    setActiveTokenIndex(-1);
    setStatus('idle');
    isPlayingRef.current = false;
  }, [animateKeyframe, animateToRest, fingerspell, setStatus, setActiveTokenIndex]);

  // ── Render loop (Three.js frame) ────────────────────────────────────────────
  useFrame(() => {
    // Keep matrices fresh — R3F handles renderer.render
  });

  return <primitive object={scene} />;
}
