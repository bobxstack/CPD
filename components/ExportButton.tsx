
import React from 'react';
import { useStore } from '../store/store';

declare const pako: any;

const ExportButton: React.FC = () => {
  const { trackData, view } = useStore(state => ({
    trackData: state.trackData,
    view: state.view,
  }));

  const handleExport = () => {
    if (!trackData) return;

    try {
      // 1. Prepare data payload including track data and view settings
      const exportData = {
        trackData,
        viewState: view,
      };

      // 2. Convert to JSON string and compress using pako
      const jsonString = JSON.stringify(exportData);
      const compressedData = pako.gzip(jsonString);

      // 3. Create a Blob, generate an object URL, and trigger download
      const blob = new Blob([compressedData], { type: 'application/gzip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trajectory-export-${new Date().toISOString()}.json.gz`;
      document.body.appendChild(a);
      a.click();
      
      // 4. Clean up by removing the element and revoking the URL
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Export failed:", error);
      // In a real app, we might set an error state to inform the user
    }
  };

  const isDisabled = !trackData;

  return (
    <div className="w-full mt-4">
      <button
        onClick={handleExport}
        disabled={isDisabled}
        className="w-full flex items-center justify-center gap-2 text-sm bg-gray-700 hover:bg-cyan-600 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
        aria-label="Export current view and data"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Export View</span>
      </button>
    </div>
  );
};

export default ExportButton;
