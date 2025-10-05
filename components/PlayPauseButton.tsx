
import React from 'react';
import { useStore, useStoreActions } from '../store/store';

const PlayPauseButton: React.FC = () => {
  const { togglePlay } = useStoreActions();
  const isPlaying = useStore(state => state.playback.isPlaying);

  return (
    <button
      onClick={togglePlay}
      className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold p-2 rounded-full w-10 h-10 flex items-center justify-center transition"
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        </svg>
      )}
    </button>
  );
};

export default PlayPauseButton;
