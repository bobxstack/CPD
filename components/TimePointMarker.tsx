import React, { useMemo } from 'react';
import { useStore } from '../store/store';
import type { Point } from '../types';

interface TimePointMarkerProps {
  points: Point[];
  pointFormat: string[];
  xMetric: string | null;
  yMetric: string | null;
  zMetric: string | null;
  xScale: (val: number) => number;
  yScale: (val: number) => number;
  zDomain: [number, number];
}

const TimePointMarker: React.FC<TimePointMarkerProps> = ({
  points,
  pointFormat,
  xMetric,
  yMetric,
  zMetric,
  xScale,
  yScale,
  zDomain,
}) => {
  const currentTime = useStore(state => state.playback.currentTime);
  const duration = useStore(state => state.trackData?.metadata.duration ?? 0);

  const positionData = useMemo(() => {
    if (!xMetric || !yMetric || !points.length) return null;

    const xIndex = pointFormat.indexOf(xMetric);
    const yIndex = pointFormat.indexOf(yMetric);
    const zIndex = zMetric ? pointFormat.indexOf(zMetric) : -1;

    if (xIndex === -1 || yIndex === -1) return null;
    
    const timePerPoint = duration / (points.length -1);
    const currentIndex = Math.floor(currentTime / timePerPoint);
    const nextIndex = Math.min(currentIndex + 1, points.length - 1);
    
    const p1 = points[currentIndex];
    const p2 = points[nextIndex];
    
    if (!p1 || !p2) return null;

    const interpolationFactor = (currentTime % timePerPoint) / timePerPoint;
    
    const interp = (idx: number) => p1[idx] + (p2[idx] - p1[idx]) * interpolationFactor;
    
    const currentX = interp(xIndex);
    const currentY = interp(yIndex);
    const currentZ = zIndex !== -1 ? interp(zIndex) : 0;
    
    const zValue = zDomain[1] - zDomain[0] !== 0 ? (currentZ - zDomain[0]) / (zDomain[1] - zDomain[0]) : 0.5;

    // Map zValue (0 to 1) to a color from blue to red
    const blue = Math.max(0, 255 * (1 - zValue * 2));
    const red = Math.max(0, 255 * (zValue * 2 - 1));
    const green = 255 - blue - red;
    const color = `rgb(${red}, ${green}, ${blue})`;

    return { x: xScale(currentX), y: yScale(currentY), zValue, color };
  }, [currentTime, points, pointFormat, xMetric, yMetric, zMetric, xScale, yScale, duration, zDomain]);
  
  if (!positionData) {
    return null;
  }
  
  const { x, y, zValue, color } = positionData;
  const radius = 6 + (zValue * 6); // Represent Z with size

  return (
    <g>
        <circle
            cx={x}
            cy={y}
            r={radius}
            fill={color}
            stroke="#FFFFFF"
            strokeWidth="2"
        />
    </g>
  );
};

export default TimePointMarker;