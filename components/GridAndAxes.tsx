
import React from 'react';

interface GridAndAxesProps {
  xScale: (val: number) => number;
  yScale: (val: number) => number;
  dimensions: { width: number; height: number; margin: { top: number; right: number; bottom: number; left: number } };
  xLabel: string;
  yLabel: string;
}

const GridAndAxes: React.FC<GridAndAxesProps> = ({ dimensions, xLabel, yLabel }) => {
  const { width, height, margin } = dimensions;
  const numGridLines = 5;

  const gridLines = Array.from({ length: numGridLines }).map((_, i) => {
    const ratio = i / (numGridLines - 1);
    const x = margin.left + ratio * (width - margin.left - margin.right);
    const y = margin.top + ratio * (height - margin.top - margin.bottom);
    return { x, y };
  });

  return (
    <g>
      {/* Grid lines */}
      {gridLines.map((line, i) => (
        <g key={i}>
          <line x1={line.x} y1={margin.top} x2={line.x} y2={height - margin.bottom} stroke="#4A5568" strokeWidth="0.5" />
          <line x1={margin.left} y1={line.y} x2={width - margin.right} y2={line.y} stroke="#4A5568" strokeWidth="0.5" />
        </g>
      ))}

      {/* Axes lines */}
      <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="#A0AEC0" strokeWidth="1" />
      <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#A0AEC0" strokeWidth="1" />

      {/* Axes labels */}
      <text
        x={width / 2}
        y={height - margin.bottom / 4}
        textAnchor="middle"
        fill="#A0AEC0"
        fontSize="12"
        fontWeight="bold"
      >
        {xLabel} (X)
      </text>
      <text
        transform={`translate(${margin.left / 2}, ${height / 2}) rotate(-90)`}
        textAnchor="middle"
        fill="#A0AEC0"
        fontSize="12"
        fontWeight="bold"
      >
        {yLabel} (Y)
      </text>
    </g>
  );
};

export default GridAndAxes;
