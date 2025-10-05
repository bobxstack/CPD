export type Point = number[];

export interface Metrics {
  [key: string]: {
    min: number;
    max: number;
  };
}

export interface TrackData {
  points: Point[];
  metrics: Metrics;
  metadata: {
    point_format: string[];
    duration: number;
  };
}

export type Axis = 'x' | 'y' | 'z';

export interface ViewState {
  axisMapping: {
    x: string | null;
    y: string | null;
    z: string | null;
  };
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
}

export interface AppState {
  // Track Slice
  trackData: TrackData | null;
  isLoading: boolean;
  error: string | null;

  // View Slice
  view: ViewState;

  // Playback Slice
  playback: PlaybackState;

  // Actions
  loadTrack: (file: File) => Promise<void>;
  setAxis: (axis: Axis, metric: string | null) => void;
  applyPreset: (preset: { x: string | null; y: string | null; z: string | null }) => void;
  togglePlay: () => void;
  setTime: (time: number | ((prevTime: number) => number)) => void;
}