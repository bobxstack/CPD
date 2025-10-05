
import React from 'react';
import AxisSelector from './AxisSelector';
import PresetSelector from './PresetSelector';
import { useStore } from '../store/store';
import type { Axis } from '../types';

const AxisManager: React.FC = () => {
  const axisMapping = useStore(state => state.view.axisMapping);
  
  const axes: Axis[] = ['x', 'y', 'z'];
  const assignedMetrics = Object.values(axisMapping).filter(Boolean);
  const hasDuplicates = new Set(assignedMetrics).size !== assignedMetrics.length;

  return (
    <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
      <h2 className="font-semibold text-lg text-gray-300 border-b border-gray-700 pb-2">Axis Configuration</h2>
      <div className="space-y-3">
        {axes.map(axis => (
          <AxisSelector key={axis} axis={axis} />
        ))}
      </div>
       {hasDuplicates && (
        <div className="text-yellow-400 bg-yellow-900/50 p-2 rounded-md text-sm">
          Warning: The same metric is assigned to multiple axes.
        </div>
      )}
      <PresetSelector />
    </div>
  );
};

export default AxisManager;
