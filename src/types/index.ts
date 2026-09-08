// ─── Effect Modes ───────────────────────────────────────────────────────────

export type EffectMode = 'invisible' | 'ghost' | 'pixel' | 'glitch';

// ─── Application State ─────────────────────────────────────────────────────

export type AppPhase =
  | 'initializing'    // Loading models and requesting permissions
  | 'calibrating'     // User must step out of frame to capture background
  | 'ready'           // Background captured, waiting for clap to activate
  | 'active'          // Effect is currently applied (user is "invisible")
  | 'error';          // Unrecoverable error state

export interface PerformanceMetrics {
  fps: number;
  segmentationMs: number;
  renderMs: number;
  frameCount: number;
}

export interface ClapConfig {
  /** Minimum energy threshold to trigger a clap (0-255 scale) */
  energyThreshold: number;
  /** Frequency band lower bound in Hz */
  frequencyMin: number;
  /** Frequency band upper bound in Hz */
  frequencyMax: number;
  /** Minimum time between clap detections in ms */
  cooldownMs: number;
  /** Number of consecutive frames that must exceed threshold */
  consecutiveFrames: number;
}

export interface SegmentationConfig {
  /** Confidence threshold for person mask (0.0 - 1.0) */
  confidenceThreshold: number;
  /** Number of temporal smoothing frames */
  temporalSmoothing: number;
  /** Gaussian blur radius for mask edges */
  edgeBlurRadius: number;
  /** Model to use: 'general' (256x256) or 'landscape' (144x256) */
  modelType: 'general' | 'landscape';
}

export interface AppState {
  // ─── Phase & Mode ───────────────────────────────────────────────────
  phase: AppPhase;
  effectMode: EffectMode;
  isVisible: boolean; // true = normal view, false = effect applied

  // ─── Media ──────────────────────────────────────────────────────────
  cameraReady: boolean;
  micReady: boolean;
  backgroundFrame: ImageData | null;

  // ─── AI ─────────────────────────────────────────────────────────────
  modelLoaded: boolean;
  modelLoadProgress: number; // 0-100

  // ─── Performance ────────────────────────────────────────────────────
  performance: PerformanceMetrics;

  // ─── Configuration ──────────────────────────────────────────────────
  clapConfig: ClapConfig;
  segmentationConfig: SegmentationConfig;

  // ─── Error ──────────────────────────────────────────────────────────
  error: string | null;

  // ─── Actions ────────────────────────────────────────────────────────
  setPhase: (phase: AppPhase) => void;
  setEffectMode: (mode: EffectMode) => void;
  toggleVisibility: () => void;
  setIsVisible: (visible: boolean) => void;
  setCameraReady: (ready: boolean) => void;
  setMicReady: (ready: boolean) => void;
  setBackgroundFrame: (frame: ImageData | null) => void;
  setModelLoaded: (loaded: boolean) => void;
  setModelLoadProgress: (progress: number) => void;
  updatePerformance: (metrics: Partial<PerformanceMetrics>) => void;
  setClapConfig: (config: Partial<ClapConfig>) => void;
  setSegmentationConfig: (config: Partial<SegmentationConfig>) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ─── Rendering Types ────────────────────────────────────────────────────────

export interface RenderContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export interface EffectParams {
  videoFrame: ImageData;
  backgroundFrame: ImageData;
  mask: Float32Array;
  width: number;
  height: number;
  timestamp: number;
}

// ─── Clap Detection ────────────────────────────────────────────────────────

export interface ClapEvent {
  timestamp: number;
  energy: number;
  frequency: number;
}

export type ClapCallback = (event: ClapEvent) => void;

// ─── Segmenter ──────────────────────────────────────────────────────────────

export interface SegmentationResult {
  mask: Float32Array;
  width: number;
  height: number;
  timestampMs: number;
}
