import React, { createContext, useContext, useRef } from 'react';
import { useSyncExternalStore } from 'react';
import type { AppState, Axis, TrackData, ViewState, PlaybackState } from '../types';
import { processImportedData } from '../services/importService';

type Store = {
  subscribe: (callback: () => void) => () => void;
  getState: () => AppState;
  actions: {
    loadTrack: (file: File) => Promise<void>;
    setAxis: (axis: Axis, metric: string | null) => void;
    applyPreset: (preset: { x: string | null; y: string | null; z: string | null }) => void;
    togglePlay: () => void;
    setTime: (time: number | ((prevTime: number) => number)) => void;
  }
};

const createStore = (): Store => {
  let state: AppState = {
    trackData: null,
    isLoading: false,
    error: null,
    view: {
      axisMapping: { x: null, y: null, z: null },
    },
    playback: {
      isPlaying: false,
      currentTime: 0,
    },
    // Dummy actions, will be replaced
    loadTrack: async () => {},
    setAxis: () => {},
    applyPreset: () => {},
    togglePlay: () => {},
    setTime: () => {},
  };

  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState = (fn: (s: AppState) => AppState) => {
    state = fn(state);
    listeners.forEach(l => l());
  };

  const subscribe = (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  const actions = {
    loadTrack: async (file: File) => {
      setState(s => ({ ...s, isLoading: true, error: null, trackData: null, playback: { isPlaying: false, currentTime: 0 } }));
      try {
        const data = await processImportedData(file);
        setState(s => ({
          ...s,
          isLoading: false,
          trackData: data,
          view: {
            axisMapping: { x: 'pos_x', y: 'pos_y', z: 'pos_z' }
          },
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during import.';
        setState(s => ({ ...s, isLoading: false, error: errorMessage }));
      }
    },
    setAxis: (axis: Axis, metric: string | null) => {
      setState(s => ({
        ...s,
        view: {
          ...s.view,
          axisMapping: { ...s.view.axisMapping, [axis]: metric },
        },
      }));
    },
    applyPreset: (preset: { x: string | null; y: string | null; z: string | null }) => {
       setState(s => ({
        ...s,
        view: {
          ...s.view,
          axisMapping: { x: preset.x, y: preset.y, z: preset.z },
        },
      }));
    },
    togglePlay: () => {
        const currentState = getState();
        if(!currentState.trackData) return;
        
        let newTime = currentState.playback.currentTime;
        if(newTime >= currentState.trackData.metadata.duration){
            newTime = 0;
        }

        setState(s => ({
            ...s,
            playback: {
                ...s.playback,
                isPlaying: !s.playback.isPlaying,
                currentTime: newTime
            }
        }));
    },
    setTime: (time: number | ((prevTime: number) => number)) => {
      setState(s => ({
        ...s,
        playback: {
          ...s.playback,
          currentTime: typeof time === 'function' ? time(s.playback.currentTime) : time,
        },
      }));
    },
  };
  
  // Replace dummy actions
  state.loadTrack = actions.loadTrack;
  state.setAxis = actions.setAxis;
  state.applyPreset = actions.applyPreset;
  state.togglePlay = actions.togglePlay;
  state.setTime = actions.setTime;


  return { subscribe, getState, actions };
};

const StoreContext = createContext<Store | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeRef = useRef<Store | null>(null);
  if (!storeRef.current) {
    storeRef.current = createStore();
  }
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
};

export function useStore<T,>(selector: (state: AppState) => T): T {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  
  const state = useSyncExternalStore(store.subscribe, () => selector(store.getState()));
  return state;
}

export function useStoreActions() {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('useStoreActions must be used within a StoreProvider');
    }
    return store.actions;
}