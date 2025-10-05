
import React, { useMemo } from 'react';
import type { Point } from '../types';

interface TrajectoryLineProps {
  points: Point[];
  pointFormat: string[];
  xMetric: string;
  yMetric: string;
  xScale: (val: number) => number;
  yScale: (val: number) => number;
}

const TrajectoryLine: React.FC<TrajectoryLineProps> = ({ points, pointFormat, xMetric, yMetric, xScale, yScale }) => {
  const polylinePoints = useMemo(() => {
    const xIndex = pointFormat.indexOf(xMetric);
    const yIndex = pointFormat.indexOf(yMetric);

    if (xIndex === -1 || yIndex === -1) return "";

    return points
      .map(p => `${xScale(p[xIndex])},${yScale(p[yIndex])}`)
      .join(' ');
  }, [points, pointFormat, xMetric, yMetric, xScale, yScale]);

  return (
    <polyline
      points={polylinePoints}
      fill="none"
      stroke="rgba(0, 255, 255, 0.3)"
      strokeWidth="2"
    />
  );
};

export default TrajectoryLine;
