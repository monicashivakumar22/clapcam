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

// ─── Phase 4: Calibration Types ───────────────────────────────────────────

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

  // Calibration state (Phase 4)
  isCalibrated: boolean;
  calibrationState: CalibrationState;
  countdownSeconds: number;
  capturedBackground: CapturedBackground | null;
  calibrationError: string | null;

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

  // Actions - Calibration (Phase 4)
  startCalibration: () => void;
  setCountdownSeconds: (seconds: number) => void;
  setCalibrationState: (state: CalibrationState) => void;
  setCapturedBackground: (background: CapturedBackground | null) => void;
  acceptBackground: () => void;
  retakeCalibration: () => void;
  resetCalibration: () => void;
  setCalibrationError: (error: string | null) => void;
}
