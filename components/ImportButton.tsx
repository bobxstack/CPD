import React, { useRef, useState, useCallback } from 'react';
import { useStoreActions } from '../store/store';

const ImportButton: React.FC = () => {
  const { loadTrack } = useStoreActions();
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      loadTrack(file);
    }
    // Reset the input value to allow re-uploading the same file.
    event.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      loadTrack(file);
      // Also reset the file input ref here to allow re-selecting the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [loadTrack]);

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json.gz"
      />
      <label
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-700 border-2 border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-cyan-400 focus:outline-none"
      >
        <span className="flex items-center space-x-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          <span className="font-medium text-gray-300">
            Drop file or <span className="text-cyan-400 underline">browse</span>
          </span>
        </span>
        {fileName ? (
            <p className="text-sm text-gray-400 mt-2 truncate">{fileName}</p>
        ) : (
            <p className="text-xs text-gray-500 mt-2">Supports compressed JSON (.json.gz)</p>
        )}
      </label>
    </div>
  );
};

export default ImportButton;