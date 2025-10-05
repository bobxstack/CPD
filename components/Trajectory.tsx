import React, { useMemo } from 'react';
// FIX: Import for side-effects to bring in @react-three/fiber's JSX namespace augmentations
import '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { TrackData, ViewState } from '../types';

interface TrajectoryProps {
  trackData: TrackData;
  axisMapping: ViewState['axisMapping'];
  currentTime: number;
}

const Trajectory: React.FC<TrajectoryProps> = ({ trackData, axisMapping, currentTime }) => {
  const { points, metrics, metadata } = trackData;
  const { point_format, duration } = metadata;

  // FIX: Destructure axisMapping properties 'x', 'y', 'z' and alias them.
  const { x: xMetric, y: yMetric, z: zMetric } = axisMapping;

  const scaledPoints = useMemo(() => {
    if (!xMetric || !yMetric) return [];

    const xIndex = point_format.indexOf(xMetric);
    const yIndex = point_format.indexOf(yMetric);
    const zIndex = zMetric ? point_format.indexOf(zMetric) : -1;

    if (xIndex === -1 || yIndex === -1) return [];

    // FIX: Add explicit return type to ensure TypeScript infers a tuple [number, number] instead of number[].
    const getDomain = (metric: string): [number, number] => (metrics[metric] ? [metrics[metric].min, metrics[metric].max] : [0, 1]);
    
    const xDomain = getDomain(xMetric);
    const yDomain = getDomain(yMetric);
    // FIX: Explicitly type `zDomain` as a tuple to avoid type widening to `number[]`.
    const zDomain: [number, number] = zMetric ? getDomain(zMetric) : [0, 0];

    const scale = (val: number, domain: [number, number]) => {
        const range = domain[1] - domain[0] || 1;
        return -5 + ((val - domain[0]) / range) * 10; // Scale to [-5, 5] range
    };

    return points.map(p => new THREE.Vector3(
        scale(p[xIndex], xDomain),
        scale(p[yIndex], yDomain),
        zIndex !== -1 ? scale(p[zIndex], zDomain) : 0
    ));
  }, [points, point_format, xMetric, yMetric, zMetric, metrics]);

  const markerPosition = useMemo(() => {
    if (scaledPoints.length < 2) return new THREE.Vector3();

    const timePerPoint = duration / (scaledPoints.length - 1);
    const currentIndex = Math.min(Math.floor(currentTime / timePerPoint), scaledPoints.length - 2);
    const nextIndex = currentIndex + 1;

    const p1 = scaledPoints[currentIndex];
    const p2 = scaledPoints[nextIndex];

    const interpolationFactor = (currentTime % timePerPoint) / timePerPoint;

    return new THREE.Vector3().lerpVectors(p1, p2, isNaN(interpolationFactor) ? 0 : interpolationFactor);
  }, [currentTime, scaledPoints, duration]);

  if (scaledPoints.length === 0) return null;

  return (
    <>
      <Line
        points={scaledPoints}
        color="#00FFFF"
        lineWidth={2}
        transparent
        opacity={0.3}
      />
      <mesh position={markerPosition}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2} />
      </mesh>
    </>
  );
};

export default Trajectory;
