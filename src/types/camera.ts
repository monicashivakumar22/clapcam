import type { EffectMode, ClapConfig, SegmentationConfig, PerformanceMetrics } from './index';

export interface CameraDevice {
  deviceId: string;
  label: string;
  groupId?: string;
}

export interface CameraResolution {
  width: number;
  height: number;
}

export type CameraStatusType = 'off' | 'starting' | 'active' | 'error';

export interface CameraErrorDetails {
  name: string;
  message: string;
  userFriendlyMessage: string;
}

// ─── Calibration Types ───────────────────────────────────────────────────

export type CalibrationState =
  | 'idle'
  | 'countdown'
  | 'capturing'
  | 'preview'
  | 'accepted'
  | 'error';

export interface CapturedBackground {
  bitmap: ImageBitmap;
  dataUrl: string;
  width: number;
  height: number;
  capturedAt: number;
  isMirrored: boolean;
}

// ─── Complete ClapCam Store State ─────────────────────────────────────────

export interface ClapCamStoreState {
  // Camera state
  cameraActive: boolean;
  cameraLoading: boolean;
  cameraError: string | null;
  cameraStatus: CameraStatusType;
  selectedCameraId: string;
  availableDevices: CameraDevice[];
  isMirrored: boolean;
  videoDimensions: CameraResolution | null;
  isFullscreen: boolean;

  // Calibration state
  isCalibrated: boolean;
  calibrationState: CalibrationState;
  countdownSeconds: number;
  capturedBackground: CapturedBackground | null;
  calibrationError: string | null;

  // AI Segmentation state
  modelLoaded: boolean;
  modelLoading: boolean;
  modelLoadProgress: number;
  modelError: string | null;
  segmentationConfig: SegmentationConfig;

  // Audio & Clap Detection state
  micActive: boolean;
  micLoading: boolean;
  micError: string | null;
  clapConfig: ClapConfig;
  lastClapTimestamp: number;
  clapPulseActive: boolean;
  audioFrequencyBars: number[];

  // Effect & Invisibility state
  effectMode: EffectMode;
  isInvisible: boolean;
  isProcessingEffect: boolean;

  // Telemetry & Performance
  performance: PerformanceMetrics;

  // Actions - Camera
  setCameraActive: (active: boolean) => void;
  setCameraLoading: (loading: boolean) => void;
  setCameraError: (error: string | null) => void;
  setCameraStatus: (status: CameraStatusType) => void;
  setSelectedCameraId: (id: string) => void;
  setAvailableDevices: (devices: CameraDevice[]) => void;
  setIsMirrored: (mirrored: boolean) => void;
  toggleMirror: () => void;
  setVideoDimensions: (dimensions: CameraResolution | null) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  resetCameraState: () => void;

  // Actions - Calibration
  startCalibration: () => void;
  setCountdownSeconds: (seconds: number) => void;
  setCalibrationState: (state: CalibrationState) => void;
  setCapturedBackground: (background: CapturedBackground | null) => void;
  acceptBackground: () => void;
  retakeCalibration: () => void;
  resetCalibration: () => void;
  setCalibrationError: (error: string | null) => void;

  // Actions - AI & Vision
  setModelLoaded: (loaded: boolean) => void;
  setModelLoading: (loading: boolean) => void;
  setModelLoadProgress: (progress: number) => void;
  setModelError: (error: string | null) => void;
  setSegmentationConfig: (config: Partial<SegmentationConfig>) => void;

  // Actions - Audio & Clap
  setMicActive: (active: boolean) => void;
  setMicLoading: (loading: boolean) => void;
  setMicError: (error: string | null) => void;
  setClapConfig: (config: Partial<ClapConfig>) => void;
  triggerClapDetected: () => void;
  setAudioFrequencyBars: (bars: number[]) => void;

  // Actions - Effect & Invisibility
  setEffectMode: (mode: EffectMode) => void;
  setIsInvisible: (invisible: boolean) => void;
  toggleInvisibility: () => void;
  setIsProcessingEffect: (processing: boolean) => void;
  updatePerformance: (metrics: Partial<PerformanceMetrics>) => void;
}
