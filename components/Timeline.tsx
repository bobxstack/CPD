
import React from 'react';
import PlayPauseButton from './PlayPauseButton';
import TimeSlider from './TimeSlider';

const Timeline: React.FC = () => {
  return (
    <div className="w-full bg-gray-800/50 rounded-lg p-3">
        <div className="flex items-center gap-4">
            <PlayPauseButton />
            <TimeSlider />
        </div>
    </div>
  );
};

export default Timeline;
