
import type { TrackData } from '../types';

declare const pako: any;

// This function simulates the logic that would run inside a Web Worker.
export const processImportedData = (file: File): Promise<TrackData> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided.'));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error('Failed to read file.');
        }

        const compressedData = new Uint8Array(event.target.result as ArrayBuffer);
        
        if (typeof pako === 'undefined') {
            throw new Error('Pako library is not loaded. Cannot decompress file.');
        }

        const decompressedData = pako.inflate(compressedData, { to: 'string' });
        const jsonData: TrackData = JSON.parse(decompressedData);

        // Basic validation
        if (!jsonData.points || !jsonData.metrics || !jsonData.metadata) {
          throw new Error('Invalid data format. Missing points, metrics, or metadata.');
        }

        resolve(jsonData);
      } catch (err) {
        console.error('Error processing file:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        reject(new Error(`Failed to parse file: ${errorMessage}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file.'));
    };

    reader.readAsArrayBuffer(file);
  });
};
