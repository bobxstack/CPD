
import React from 'react';
import { useStore, useStoreActions } from '../store/store';

const TimeSlider: React.FC = () => {
  const { setTime } = useStoreActions();
  const currentTime = useStore(state => state.playback.currentTime);
  const duration = useStore(state => state.trackData?.metadata.duration ?? 0);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(parseFloat(event.target.value));
  };

  return (
    <div className="flex-1 flex items-center gap-3">
        <input
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={currentTime}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-400 font-mono w-24 text-center">
            {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
        </span>
    </div>
  );
};

export default TimeSlider;
