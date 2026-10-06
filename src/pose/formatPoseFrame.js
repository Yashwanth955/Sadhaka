import {
  POSE_LANDMARK_NAMES,
  DEFAULT_MIN_KEYPOINT_CONFIDENCE,
} from './poseConstants';

/**
 * Landmark confidence: prefer visibility, fall back to presence, else 0.
 */
export function landmarkConfidence(landmark) {
  if (!landmark) return 0;
  if (typeof landmark.visibility === 'number') return landmark.visibility;
  if (typeof landmark.presence === 'number') return landmark.presence;
  return 0;
}

/**
 * Normalize a raw MediaPipe person (33 landmarks) into a pipeline-friendly frame.
 *
 * @param {Array<{x:number,y:number,z:number,visibility?:number,presence?:number}>} rawLandmarks
 * @param {object} [opts]
 * @param {import('react-native-mediapipe-posedetection').ViewCoordinator} [opts.viewCoordinator]
 * @param {{width:number,height:number}} [opts.frameDims]
 * @param {number} [opts.minConfidence]
 * @param {number} [opts.inferenceTime]
 * @returns {PoseFrame|null}
 *
 * @typedef {object} PoseKeypoint
 * @property {number} index
 * @property {string} name
 * @property {number} x          Normalized 0–1 (MediaPipe image space)
 * @property {number} y
 * @property {number} z
 * @property {number} confidence
 * @property {boolean} isLowConfidence
 * @property {number} [screenX]  Pixel coords in the camera preview (when VC provided)
 * @property {number} [screenY]
 *
 * @typedef {object} PoseFrame
 * @property {number} timestamp
 * @property {number} inferenceTimeMs
 * @property {PoseKeypoint[]} keypoints   Always length 33
 * @property {number} averageConfidence
 * @property {number} visibleCount        Keypoints above minConfidence
 * @property {boolean} personDetected
 */
export function formatPoseFrame(rawLandmarks, opts = {}) {
  if (!Array.isArray(rawLandmarks) || rawLandmarks.length < 33) {
    return null;
  }

  const minConfidence = opts.minConfidence ?? DEFAULT_MIN_KEYPOINT_CONFIDENCE;
  const vc = opts.viewCoordinator;
  const frameDims = opts.frameDims;

  const keypoints = [];
  let confidenceSum = 0;
  let visibleCount = 0;

  for (let i = 0; i < 33; i++) {
    const lm = rawLandmarks[i] || { x: 0, y: 0, z: 0 };
    const confidence = landmarkConfidence(lm);
    const isLowConfidence = confidence < minConfidence;

    if (!isLowConfidence) visibleCount += 1;
    confidenceSum += confidence;

    /** @type {PoseKeypoint} */
    const kp = {
      index: i,
      name: POSE_LANDMARK_NAMES[i],
      x: lm.x ?? 0,
      y: lm.y ?? 0,
      z: lm.z ?? 0,
      confidence,
      isLowConfidence,
    };

    if (vc && frameDims) {
      const screen = vc.convertPoint(frameDims, { x: kp.x, y: kp.y });
      kp.screenX = screen.x;
      kp.screenY = screen.y;
    }

    keypoints.push(kp);
  }

  return {
    timestamp: Date.now(),
    inferenceTimeMs: opts.inferenceTime ?? 0,
    keypoints,
    averageConfidence: confidenceSum / 33,
    visibleCount,
    personDetected: visibleCount > 0,
  };
}

/**
 * Pull the first detected person from a MediaPipe result bundle.
 * Handles both the typed `results[0].landmarks[0]` shape and a flat fallback.
 */
export function extractFirstPersonLandmarks(result) {
  if (!result) return null;

  // Primary shape from native emit: results[0].landmarks[0] (33 points)
  const fromResults = result.results?.[0]?.landmarks?.[0];
  if (Array.isArray(fromResults) && fromResults.length >= 33) {
    return fromResults;
  }

  // Some builds flatten to result.landmarks[0]
  const fromFlat = result.landmarks?.[0];
  if (Array.isArray(fromFlat) && fromFlat.length >= 33) {
    return fromFlat;
  }

  // Already a single person array
  if (Array.isArray(result) && result.length >= 33 && typeof result[0]?.x === 'number') {
    return result;
  }

  return null;
}
