import { create } from 'zustand';
import type {
  ClapCamStoreState,
  CameraDevice,
  CameraResolution,
  CameraStatusType,
  CalibrationState,
  CapturedBackground,
} from '@/types/camera';
import { disposeCapturedBackground } from '@/utils/canvasUtils';

export const useClapCamStore = create<ClapCamStoreState>((set, get) => ({
  // ─── Camera State ──────────────────────────────────────────────────
  cameraActive: false,
  cameraLoading: false,
  cameraError: null,
  cameraStatus: 'off',
  selectedCameraId: '',
  availableDevices: [],
  isMirrored: true, // Default to true for user-facing selfie webcam feel
  videoDimensions: null,
  isFullscreen: false,

  // ─── Calibration State (Phase 4) ──────────────────────────────────
  isCalibrated: false,
  calibrationState: 'idle',
  countdownSeconds: 3,
  capturedBackground: null,
  calibrationError: null,

  // ─── Camera Actions ────────────────────────────────────────────────
  setCameraActive: (cameraActive: boolean) =>
    set({
      cameraActive,
      cameraStatus: cameraActive ? 'active' : 'off',
      cameraError: cameraActive ? null : undefined,
    }),

  setCameraLoading: (cameraLoading: boolean) =>
    set({
      cameraLoading,
      cameraStatus: cameraLoading ? 'starting' : 'off',
    }),

  setCameraError: (cameraError: string | null) =>
    set({
      cameraError,
      cameraActive: false,
      cameraLoading: false,
      cameraStatus: cameraError ? 'error' : 'off',
    }),

  setCameraStatus: (cameraStatus: CameraStatusType) => set({ cameraStatus }),

  setSelectedCameraId: (selectedCameraId: string) => set({ selectedCameraId }),

  setAvailableDevices: (availableDevices: CameraDevice[]) => set({ availableDevices }),

  setIsMirrored: (isMirrored: boolean) => set({ isMirrored }),

  toggleMirror: () => set((state) => ({ isMirrored: !state.isMirrored })),

  setVideoDimensions: (videoDimensions: CameraResolution | null) => set({ videoDimensions }),

  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),

  resetCameraState: () => {
    const prevBg = get().capturedBackground;
    disposeCapturedBackground(prevBg);

    set({
      cameraActive: false,
      cameraLoading: false,
      cameraError: null,
      cameraStatus: 'off',
      videoDimensions: null,
      isFullscreen: false,
      isCalibrated: false,
      calibrationState: 'idle',
      countdownSeconds: 3,
      capturedBackground: null,
      calibrationError: null,
    });
  },

  // ─── Calibration Actions (Phase 4) ─────────────────────────────────
  startCalibration: () => {
    const prevBg = get().capturedBackground;
    disposeCapturedBackground(prevBg);

    set({
      calibrationState: 'countdown',
      countdownSeconds: 3,
      calibrationError: null,
      capturedBackground: null,
    });
  },

  setCountdownSeconds: (countdownSeconds: number) => set({ countdownSeconds }),

  setCalibrationState: (calibrationState: CalibrationState) => set({ calibrationState }),

  setCapturedBackground: (capturedBackground: CapturedBackground | null) => {
    const prevBg = get().capturedBackground;
    if (prevBg && prevBg !== capturedBackground) {
      disposeCapturedBackground(prevBg);
    }
    set({
      capturedBackground,
      calibrationState: capturedBackground ? 'preview' : 'idle',
    });
  },

  acceptBackground: () =>
    set({
      isCalibrated: true,
      calibrationState: 'accepted',
      calibrationError: null,
    }),

  retakeCalibration: () => {
    const prevBg = get().capturedBackground;
    disposeCapturedBackground(prevBg);

    set({
      isCalibrated: false,
      calibrationState: 'countdown',
      countdownSeconds: 3,
      capturedBackground: null,
      calibrationError: null,
    });
  },

  resetCalibration: () => {
    const prevBg = get().capturedBackground;
    disposeCapturedBackground(prevBg);

    set({
      isCalibrated: false,
      calibrationState: 'idle',
      countdownSeconds: 3,
      capturedBackground: null,
      calibrationError: null,
    });
  },

  setCalibrationError: (calibrationError: string | null) =>
    set({
      calibrationError,
      calibrationState: calibrationError ? 'error' : 'idle',
    }),
}));
