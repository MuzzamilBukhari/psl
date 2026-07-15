import * as THREE from 'three';

/**
 * Handshape engine — drives the avatar's finger bones.
 *
 * A handshape is a per-finger curl amount (0 = fully extended, 1 = full fist).
 * Order: [thumb, index, middle, ring, pinky].
 *
 * Finger joint bones follow the Mixamo/ReadyPlayerMe convention:
 *   {Side}Hand{Finger}{1|2|3}  (4 is the fingertip end bone, never rotated)
 *
 * The curl rotation axis differs between rigs and hands, so it is detected
 * empirically at load time (see detectCurlAxis).
 */

export const FINGERS = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'] as const;
export type FingerName = (typeof FINGERS)[number];

/** Max curl angle (radians) per joint depth [joint1, joint2, joint3]. */
const FINGER_JOINT_MAX: [number, number, number] = [1.15, 1.35, 0.85];
/** Thumb articulates differently — smaller range so it doesn't clip the palm. */
const THUMB_JOINT_MAX: [number, number, number] = [0.45, 0.55, 0.45];

export interface HandshapeDef {
  /** [thumb, index, middle, ring, pinky] curls, 0..1 */
  curls: [number, number, number, number, number];
}

/** Named handshapes used by the sign dictionary. */
export const HANDSHAPES: Record<string, HandshapeDef> = {
  rest:       { curls: [0.15, 0.1, 0.1, 0.1, 0.1] },
  open:       { curls: [0.1, 0, 0, 0, 0] },        // all fingers spread open
  flat:       { curls: [0.35, 0, 0, 0, 0] },       // flat palm, thumb tucked
  fist:       { curls: [0.9, 1, 1, 1, 1] },
  point:      { curls: [0.8, 0, 1, 1, 1] },        // index extended
  v:          { curls: [0.8, 0, 0, 1, 1] },        // peace / H-hand
  thumbs_up:  { curls: [0, 1, 1, 1, 1] },
  c:          { curls: [0.4, 0.5, 0.5, 0.5, 0.5] }, // C-hand (cup)
  o:          { curls: [0.6, 0.75, 0.75, 0.75, 0.75] }, // bunched / O-hand
  pinky:      { curls: [0.9, 1, 1, 1, 0] },        // I-hand
  l:          { curls: [0, 0, 1, 1, 1] },          // L-hand
  y:          { curls: [0, 1, 1, 1, 0] },          // Y-hand (thumb+pinky)
  three:      { curls: [0, 0, 0, 1, 1] },          // thumb+index+middle
  four:       { curls: [0.9, 0, 0, 0, 0] },        // four fingers, thumb tucked
  half_curl:  { curls: [0.4, 0.45, 0.45, 0.45, 0.45] },

  // ── Data-derived PSL handshapes ──────────────────────────────────────────
  // Median per-finger curls computed from the PSL MediaPipe landmark dataset
  // (wordDataset, real signer recordings). [thumb, index, middle, ring, pinky]
  psl_eat:    { curls: [0.77, 0.5, 0.7, 0.67, 0.59] },
  psl_good:   { curls: [0.67, 0.85, 0.87, 0.98, 1.0] },
  psl_know:   { curls: [0.94, 0.35, 0.36, 0.36, 0.35] },
  psl_little: { curls: [0.29, 0.48, 1.0, 1.0, 1.0] },
  psl_me:     { curls: [1.0, 0.33, 0.96, 0.94, 0.92] },
  psl_my:     { curls: [0.5, 0.14, 0.06, 0.1, 0.14] },
  psl_name:   { curls: [0.53, 0.13, 0.07, 0.96, 0.96] },
  psl_phone:  { curls: [0.28, 0.96, 1.0, 0.94, 0.17] },
  psl_thanks: { curls: [0.7, 0.16, 0.09, 0.09, 0.16] },
  psl_what:   { curls: [0.63, 0.11, 0.12, 0.91, 0.95] },
  psl_you:    { curls: [1.0, 0.34, 1.0, 1.0, 1.0] },
  psl_your:   { curls: [0.68, 0.15, 0.37, 0.12, 0.18] },

  // number handshapes (finger counting)
  one:        { curls: [0.9, 0, 1, 1, 1] },
  two:        { curls: [0.9, 0, 0, 1, 1] },
  five:       { curls: [0, 0, 0, 0, 0] },
};

/**
 * PSL Urdu fingerspelling alphabet — data-derived from rightHandDataset
 * (5112 real signer samples across 37 Urdu letters).
 */
export const URDU_ALPHA_SHAPES: Record<string, HandshapeDef> = {
  'ء': { curls: [0.42, 0.31, 0.98, 1.0, 0.96] },
  'ا': { curls: [0.75, 1.0, 0.95, 0.96, 0.96] },
  'ب': { curls: [1.0, 0.17, 0.12, 0.07, 0.12] },
  'ت': { curls: [0.96, 0.26, 0.21, 0.14, 0.09] },
  'ث': { curls: [0.22, 0.4, 0.44, 0.42, 0.37] },
  'ج': { curls: [1.0, 1.0, 0.99, 0.97, 0.09] },
  'ح': { curls: [1.0, 0.12, 0.14, 0.98, 0.95] },
  'خ': { curls: [0.48, 0.19, 0.09, 0.94, 0.99] },
  'د': { curls: [0.77, 0.54, 0.92, 1.0, 1.0] },
  'ذ': { curls: [0.17, 0.45, 0.59, 1.0, 1.0] },
  'ر': { curls: [0.37, 0.23, 0.13, 0.92, 0.89] },
  'ز': { curls: [0.58, 0.22, 1.0, 1.0, 1.0] },
  'س': { curls: [0.58, 0.99, 0.99, 1.0, 1.0] },
  'ش': { curls: [0.52, 0.56, 0.58, 0.57, 0.7] },
  'ص': { curls: [0.26, 1.0, 1.0, 1.0, 1.0] },
  'ض': { curls: [1.0, 0.16, 1.0, 0.96, 0.07] },
  'ط': { curls: [0.54, 0.06, 0.58, 0.51, 0.46] },
  'ظ': { curls: [0.29, 0.32, 0.12, 0.72, 0.08] },
  'ع': { curls: [0.18, 0.4, 0.77, 0.73, 0.71] },
  'غ': { curls: [0.29, 0.53, 0.41, 0.45, 0.74] },
  'ف': { curls: [0.94, 1.0, 0.09, 0.08, 0.11] },
  'ق': { curls: [0.42, 0.17, 1.0, 1.0, 1.0] },
  'ل': { curls: [0.35, 0.12, 0.98, 0.97, 0.96] },
  'م': { curls: [1.0, 0.77, 0.82, 0.84, 0.82] },
  'ن': { curls: [1.0, 0.79, 1.0, 1.0, 1.0] },
  'و': { curls: [1.0, 1.0, 0.99, 0.92, 0.92] },
  'ٹ': { curls: [0.73, 0.94, 1.0, 0.96, 0.96] },
  'پ': { curls: [0.63, 0.27, 0.51, 1.0, 1.0] },
  'چ': { curls: [1.0, 0.16, 0.14, 0.12, 0.94] },
  'ڈ': { curls: [0.3, 0.13, 0.62, 0.67, 0.62] },
  'ڑ': { curls: [1.0, 0.05, 0.06, 0.94, 0.96] },
  'ژ': { curls: [0.84, 0.16, 0.08, 0.95, 0.98] },
  'ک': { curls: [0.46, 0.11, 0.17, 1.0, 0.97] },
  'گ': { curls: [1.0, 0.22, 1.0, 1.0, 0.97] },
  'ہ': { curls: [0.99, 0.22, 0.17, 1.0, 0.94] },
  'ی': { curls: [1.0, 0.98, 0.98, 0.96, 0.96] },
  'ے': { curls: [0.37, 0.99, 0.94, 0.96, 0.1] },
};

// Make Urdu letter shapes addressable from sign keyframes as "urdu_<letter>"
// (sign rows in the DB reference handshapes by HANDSHAPES key).
Object.assign(
  HANDSHAPES,
  Object.fromEntries(
    Object.entries(URDU_ALPHA_SHAPES).map(([letter, def]) => [`urdu_${letter}`, def])
  )
);

/**
 * One-handed fingerspelling alphabet (ASL-style manual alphabet, commonly
 * used in PSL contexts for spelling English words/names).
 * Approximated with curl-only shapes — good enough to be visibly distinct.
 */
export const ALPHA_SHAPES: Record<string, HandshapeDef> = {
  a: { curls: [0.2, 1, 1, 1, 1] },
  b: { curls: [0.7, 0, 0, 0, 0] },
  c: HANDSHAPES.c,
  d: { curls: [0.5, 0, 0.7, 0.7, 0.7] },
  e: { curls: [0.7, 0.8, 0.8, 0.8, 0.8] },
  f: { curls: [0.5, 0.7, 0, 0, 0] },
  g: { curls: [0.4, 0, 1, 1, 1] },
  h: { curls: [0.5, 0, 0, 1, 1] },
  i: HANDSHAPES.pinky,
  j: HANDSHAPES.pinky,
  k: { curls: [0.3, 0, 0, 1, 1] },
  l: HANDSHAPES.l,
  m: { curls: [0.8, 0.9, 0.9, 0.9, 1] },
  n: { curls: [0.8, 0.9, 0.9, 1, 1] },
  o: HANDSHAPES.o,
  p: { curls: [0.3, 0, 0.4, 1, 1] },
  q: { curls: [0.4, 0.3, 1, 1, 1] },
  r: { curls: [0.7, 0, 0.1, 1, 1] },
  s: HANDSHAPES.fist,
  t: { curls: [0.5, 0.85, 1, 1, 1] },
  u: { curls: [0.8, 0, 0, 1, 1] },
  v: HANDSHAPES.v,
  w: { curls: [0.8, 0, 0, 0, 1] },
  x: { curls: [0.7, 0.5, 1, 1, 1] },
  y: HANDSHAPES.y,
  z: { curls: [0.7, 0, 1, 1, 1] },
};

export interface CurlAxisInfo {
  axis: THREE.Vector3;
  /** Thumb opposition axis — thumbs fold toward the palm, not like fingers. */
  thumbAxis: THREE.Vector3;
}

const CANDIDATE_AXES: THREE.Vector3[] = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, -1),
];

/**
 * Detect which local axis curls fingers toward the palm for this rig/hand.
 * Test-rotates the index finger joints around each candidate axis and picks
 * the one that brings the fingertip closest to the wrist. Restores rest pose.
 */
export function detectCurlAxis(
  side: 'Right' | 'Left',
  bones: Record<string, THREE.Bone>,
  restPose: Record<string, THREE.Quaternion>
): CurlAxisInfo {
  const fallbackAxis = new THREE.Vector3(0, 0, side === 'Right' ? 1 : -1);

  /**
   * Test-rotate `joints` around each candidate axis; return the axis that
   * brings `tip` closest to `target` (curling = approaching the palm).
   */
  const findBestAxis = (
    joints: THREE.Bone[],
    tip: THREE.Bone,
    target: THREE.Bone,
    angle: number
  ): THREE.Vector3 => {
    const targetPos = new THREE.Vector3();
    target.getWorldPosition(targetPos);

    let best = fallbackAxis;
    let bestDist = Infinity;
    for (const axis of CANDIDATE_AXES) {
      const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
      for (const j of joints) {
        j.quaternion.copy(restPose[j.name]).multiply(q);
      }
      joints[0].parent?.updateMatrixWorld(true);
      const tipPos = new THREE.Vector3();
      tip.getWorldPosition(tipPos);
      const d = tipPos.distanceTo(targetPos);
      if (d < bestDist) {
        bestDist = d;
        best = axis;
      }
    }
    // Restore rest pose
    for (const j of joints) {
      j.quaternion.copy(restPose[j.name]);
    }
    joints[0].parent?.updateMatrixWorld(true);
    return best.clone();
  };

  const wrist = bones[side + 'Hand'];
  const indexJoints = [1, 2, 3].map((i) => bones[`${side}HandIndex${i}`]);
  const indexTip = bones[`${side}HandIndex4`] ?? indexJoints[2];

  if (!wrist || !indexTip || indexJoints.some((j) => !j)) {
    return { axis: fallbackAxis.clone(), thumbAxis: fallbackAxis.clone() };
  }

  const axis = findBestAxis(indexJoints, indexTip, wrist, 0.9);

  // Thumb: opposition — fold the thumb tip toward the ring finger base
  // (across the palm), not toward the wrist like the other fingers.
  const thumbJoints = [1, 2, 3].map((i) => bones[`${side}HandThumb${i}`]);
  const thumbTip = bones[`${side}HandThumb4`] ?? thumbJoints[2];
  const oppositionTarget = bones[`${side}HandRing1`] ?? wrist;
  const thumbAxis =
    thumbTip && !thumbJoints.some((j) => !j)
      ? findBestAxis(thumbJoints, thumbTip, oppositionTarget, 0.7)
      : axis.clone();

  return { axis, thumbAxis };
}

/** All finger joint bone names for one hand (joints 1–3, all five fingers). */
export function fingerBoneNames(side: 'Right' | 'Left'): string[] {
  const names: string[] = [];
  for (const finger of FINGERS) {
    for (let i = 1; i <= 3; i++) {
      names.push(`${side}Hand${finger}${i}`);
    }
  }
  return names;
}

/**
 * Apply per-finger curls to one hand's bones.
 * `curls` maps bone name → curl amount 0..1 (already interpolated by caller).
 */
export function applyFingerCurls(
  side: 'Right' | 'Left',
  curls: Record<string, number>,
  bones: Record<string, THREE.Bone>,
  restPose: Record<string, THREE.Quaternion>,
  axisInfo: CurlAxisInfo
): void {
  for (const finger of FINGERS) {
    const isThumb = finger === 'Thumb';
    const maxAngles = isThumb ? THUMB_JOINT_MAX : FINGER_JOINT_MAX;
    const axis = isThumb ? axisInfo.thumbAxis : axisInfo.axis;
    for (let i = 1; i <= 3; i++) {
      const name = `${side}Hand${finger}${i}`;
      const bone = bones[name];
      const rest = restPose[name];
      if (!bone || !rest) continue;
      const curl = curls[name] ?? 0;
      const q = new THREE.Quaternion().setFromAxisAngle(
        axis,
        curl * maxAngles[i - 1]
      );
      bone.quaternion.copy(rest).multiply(q);
    }
  }
}

/** Expand a HandshapeDef into per-bone curl targets for one hand. */
export function shapeToCurlTargets(
  side: 'Right' | 'Left',
  shape: HandshapeDef
): Record<string, number> {
  const targets: Record<string, number> = {};
  FINGERS.forEach((finger, fi) => {
    for (let i = 1; i <= 3; i++) {
      targets[`${side}Hand${finger}${i}`] = shape.curls[fi];
    }
  });
  return targets;
}
