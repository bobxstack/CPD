
import React from 'react';
import { useStore, useStoreActions } from '../store/store';
import type { Axis } from '../types';

interface AxisSelectorProps {
  axis: Axis;
}

const AxisSelector: React.FC<AxisSelectorProps> = ({ axis }) => {
  const { setAxis } = useStoreActions();
  const metrics = useStore(state => state.trackData?.metrics ? Object.keys(state.trackData.metrics) : []);
  const selectedMetric = useStore(state => state.view.axisMapping[axis]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAxis(axis, event.target.value || null);
  };
  
  const axisColors: Record<Axis, string> = {
    x: 'border-red-500',
    y: 'border-green-500',
    z: 'border-blue-500'
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={`${axis}-axis-select`} className={`font-bold text-lg w-6 text-center text-gray-300 border-l-4 ${axisColors[axis]} pl-1`}>
        {axis.toUpperCase()}
      </label>
      <select
        id={`${axis}-axis-select`}
        value={selectedMetric || ''}
        onChange={handleChange}
        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="">-- Select Metric --</option>
        {metrics.map(metric => (
          <option key={metric} value={metric}>
            {metric}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AxisSelector;
