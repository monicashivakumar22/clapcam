import type { ClapConfig, SegmentationConfig } from '@/types';

// ─── MediaPipe Model ────────────────────────────────────────────────────────

export const MEDIAPIPE_WASM_CDN =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';

export const SELFIE_SEGMENTER_MODEL =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite';

export const SELFIE_SEGMENTER_LANDSCAPE_MODEL =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/latest/selfie_segmenter_landscape.tflite';

// ─── Camera ─────────────────────────────────────────────────────────────────

export const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',
    frameRate: { ideal: 30 },
  },
  audio: false,
};

export const MIC_CONSTRAINTS: MediaStreamConstraints = {
  audio: {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
  },
  video: false,
};

// ─── Clap Detection Defaults ────────────────────────────────────────────────

export const DEFAULT_CLAP_CONFIG: ClapConfig = {
  energyThreshold: 140,
  frequencyMin: 2000,
  frequencyMax: 4000,
  cooldownMs: 500,
  consecutiveFrames: 2,
};

// ─── Segmentation Defaults ──────────────────────────────────────────────────

export const DEFAULT_SEGMENTATION_CONFIG: SegmentationConfig = {
  confidenceThreshold: 0.6,
  temporalSmoothing: 5,
  edgeBlurRadius: 4,
  modelType: 'general',
};

// ─── Rendering ──────────────────────────────────────────────────────────────

export const TARGET_FPS = 30;
export const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;

// ─── Audio Analysis ─────────────────────────────────────────────────────────

export const FFT_SIZE = 2048;
export const SMOOTHING_TIME_CONSTANT = 0.3;

// ─── Calibration ────────────────────────────────────────────────────────────

export const CALIBRATION_COUNTDOWN_SECONDS = 5;
export const CALIBRATION_FRAMES_TO_AVERAGE = 10;

// ─── UI ─────────────────────────────────────────────────────────────────────

export const TRANSITION_DURATION_MS = 300;
export const GLITCH_DURATION_MS = 200;
