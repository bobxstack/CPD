
import React from 'react';
import { useStoreActions } from '../store/store';
import { AXIS_PRESETS } from '../constants';

const PresetSelector: React.FC = () => {
  const { applyPreset } = useStoreActions();

  return (
    <div className="pt-2">
      <label className="block text-sm font-medium text-gray-400 mb-2">Presets</label>
      <div className="grid grid-cols-2 gap-2">
        {AXIS_PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset.value)}
            className="text-sm bg-gray-700 hover:bg-cyan-600 text-white font-semibold py-2 px-2 rounded-md transition duration-150 ease-in-out"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetSelector;
