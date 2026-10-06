import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { POSE_CONNECTIONS } from '../pose/poseConstants';
import colors from '../theme/colors';

/**
 * Draws MediaPipe's 33 keypoints + bones over the camera preview.
 * Low-confidence joints/bones are dimmed (or skipped) so the overlay
 * doesn't invent anatomy when tracking is weak.
 */
export default function SkeletonOverlay({
  keypoints,
  width,
  height,
  minConfidence = 0.5,
  showLowConfidence = true,
}) {
  const { joints, bones } = useMemo(() => {
    if (!keypoints?.length || !width || !height) {
      return { joints: [], bones: [] };
    }

    const jointsOut = keypoints.map((kp) => {
      const x = typeof kp.screenX === 'number' ? kp.screenX : kp.x * width;
      const y = typeof kp.screenY === 'number' ? kp.screenY : kp.y * height;
      const low = kp.isLowConfidence ?? kp.confidence < minConfidence;
      return { ...kp, x, y, low };
    });

    const bonesOut = [];
    for (const [a, b] of POSE_CONNECTIONS) {
      const ja = jointsOut[a];
      const jb = jointsOut[b];
      if (!ja || !jb) continue;
      if (ja.low && jb.low && !showLowConfidence) continue;
      bonesOut.push({
        key: `${a}-${b}`,
        x1: ja.x,
        y1: ja.y,
        x2: jb.x,
        y2: jb.y,
        low: ja.low || jb.low,
      });
    }

    return { joints: jointsOut, bones: bonesOut };
  }, [keypoints, width, height, minConfidence, showLowConfidence]);

  if (!joints.length) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        {bones.map((bone) => (
          <Line
            key={bone.key}
            x1={bone.x1}
            y1={bone.y1}
            x2={bone.x2}
            y2={bone.y2}
            stroke={bone.low ? 'rgba(6, 182, 212, 0.25)' : colors.hudCyan}
            strokeWidth={bone.low ? 1.5 : 2.5}
            strokeLinecap="round"
          />
        ))}
        {joints.map((joint) => {
          if (joint.low && !showLowConfidence) return null;
          return (
            <Circle
              key={joint.index}
              cx={joint.x}
              cy={joint.y}
              r={joint.low ? 3 : 4.5}
              fill={joint.low ? 'rgba(148, 163, 184, 0.45)' : colors.hudLime}
              stroke={joint.low ? 'transparent' : colors.darkCanvas}
              strokeWidth={1}
            />
          );
        })}
      </Svg>
    </View>
  );
}
