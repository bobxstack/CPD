
import React from 'react';
import AxisManager from './components/AxisManager';
import ExportButton from './components/ExportButton';
import ImportButton from './components/ImportButton';
import SceneController from './components/SceneController';
import Timeline from './components/Timeline';
import { useStore } from './store/store';

const App: React.FC = () => {
  const trackData = useStore(state => state.trackData);
  const isLoading = useStore(state => state.isLoading);
  const error = useStore(state => state.error);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      <aside className="w-80 bg-gray-800 p-4 space-y-6 overflow-y-auto shadow-lg flex flex-col">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">Consciousness Phase Diagram</h1>
          <p className="text-sm text-gray-400">Version 0.1</p>
        </div>
        <div className="flex-grow space-y-6">
          <div>
            <ImportButton />
            {trackData && <ExportButton />}
          </div>
          {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm">{error}</div>}
          {trackData && (
            <>
              <AxisManager />
            </>
          )}
        </div>
        {trackData && (
          <div className="flex-shrink-0">
            <Timeline />
          </div>
        )}
      </aside>

      <main className="flex-1 flex items-center justify-center p-4">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-400">Decompressing and parsing data...</p>
          </div>
        ) : trackData ? (
          <SceneController />
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-400">No Data Loaded</h2>
            <p className="mt-2 text-gray-500">Please import a compressed JSON track file to begin.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;