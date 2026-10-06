/**
 * Example consumer for CameraScreen pose callbacks.
 * Plug this into your feature-extraction pipeline.
 *
 * Usage from a parent screen:
 *
 *   import { handlePoseFrame, handleNoPerson } from '../pose/posePipelineExample';
 *   navigation.navigate('Camera', {
 *     onPoseDetected: handlePoseFrame,
 *     onNoPersonDetected: handleNoPerson,
 *   });
 *
 * Or embed:
 *
 *   <CameraScreen onPoseDetected={handlePoseFrame} onNoPersonDetected={handleNoPerson} />
 */

/** @type {import('./formatPoseFrame').PoseFrame[]} */
const recentFrames = [];
const MAX_BUFFER = 90; // ~7.5s at 12 FPS

/**
 * @param {import('./formatPoseFrame').PoseFrame} poseFrame
 */
export function handlePoseFrame(poseFrame) {
  // Drop frames where too few joints are trustworthy
  if (!poseFrame?.personDetected || poseFrame.visibleCount < 8) {
    return;
  }

  // Prefer high-confidence joints for angles / distances
  const usable = poseFrame.keypoints.filter((kp) => !kp.isLowConfidence);

  recentFrames.push({
    ...poseFrame,
    keypoints: usable.length ? usable : poseFrame.keypoints,
  });
  if (recentFrames.length > MAX_BUFFER) {
    recentFrames.shift();
  }

  // TODO: replace with your extractor, e.g. joint angles, hop distance, rep count
  // extractFeatures(poseFrame);
}

export function handleNoPerson() {
  // Optional: insert a null frame / pause counting while athlete is out of view
}

export function getBufferedPoseFrames() {
  return recentFrames.slice();
}

export function clearPoseBuffer() {
  recentFrames.length = 0;
}
