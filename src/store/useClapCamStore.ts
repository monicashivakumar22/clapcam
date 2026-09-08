import { create } from 'zustand';
import type {
  ClapCamStoreState,
  CameraDevice,
  CameraResolution,
  CameraStatusType,
  CalibrationState,
  CapturedBackground,
} from '@/types/camera';
import type { EffectMode, ClapConfig, SegmentationConfig, PerformanceMetrics } from '@/types';
import { disposeCapturedBackground } from '@/utils/canvasUtils';
import { DEFAULT_CLAP_CONFIG, DEFAULT_SEGMENTATION_CONFIG } from '@/utils/constants';

const initialPerformance: PerformanceMetrics = {
  fps: 0,
  segmentationMs: 0,
  renderMs: 0,
  frameCount: 0,
};

let clapPulseTimer: ReturnType<typeof setTimeout> | null = null;

export const useClapCamStore = create<ClapCamStoreState>((set, get) => ({
  // ─── Camera State ──────────────────────────────────────────────────
  cameraActive: false,
  cameraLoading: false,
  cameraError: null,
  cameraStatus: 'off',
  selectedCameraId: '',
  availableDevices: [],
  isMirrored: true,
  videoDimensions: null,
  isFullscreen: false,

  // ─── Calibration State ─────────────────────────────────────────────
  isCalibrated: false,
  calibrationState: 'idle',
  countdownSeconds: 3,
  capturedBackground: null,
  calibrationError: null,

  // ─── AI Segmentation State ─────────────────────────────────────────
  modelLoaded: false,
  modelLoading: false,
  modelLoadProgress: 0,
  modelError: null,
  segmentationConfig: { ...DEFAULT_SEGMENTATION_CONFIG },

  // ─── Audio & Clap Detection State ──────────────────────────────────
  micActive: false,
  micLoading: false,
  micError: null,
  clapConfig: { ...DEFAULT_CLAP_CONFIG },
  lastClapTimestamp: 0,
  clapPulseActive: false,
  audioFrequencyBars: new Array(16).fill(10),

  // ─── Effect & Invisibility State ───────────────────────────────────
  effectMode: 'invisible',
  isInvisible: false,
  isProcessingEffect: false,

  // ─── Telemetry & Performance ───────────────────────────────────────
  performance: { ...initialPerformance },

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
      isInvisible: false,
      clapPulseActive: false,
    });
  },

  // ─── Calibration Actions ───────────────────────────────────────────
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

  // ─── AI & Vision Actions ───────────────────────────────────────────
  setModelLoaded: (modelLoaded: boolean) =>
    set({
      modelLoaded,
      modelLoading: false,
      modelError: modelLoaded ? null : undefined,
    }),

  setModelLoading: (modelLoading: boolean) => set({ modelLoading }),

  setModelLoadProgress: (modelLoadProgress: number) => set({ modelLoadProgress }),

  setModelError: (modelError: string | null) =>
    set({
      modelError,
      modelLoading: false,
      modelLoaded: false,
    }),

  setSegmentationConfig: (config: Partial<SegmentationConfig>) =>
    set((state) => ({
      segmentationConfig: { ...state.segmentationConfig, ...config },
    })),

  // ─── Audio & Clap Actions ──────────────────────────────────────────
  setMicActive: (micActive: boolean) =>
    set({
      micActive,
      micLoading: false,
      micError: micActive ? null : undefined,
    }),

  setMicLoading: (micLoading: boolean) => set({ micLoading }),

  setMicError: (micError: string | null) =>
    set({
      micError,
      micActive: false,
      micLoading: false,
    }),

  setClapConfig: (config: Partial<ClapConfig>) =>
    set((state) => ({
      clapConfig: { ...state.clapConfig, ...config },
    })),

  triggerClapDetected: () => {
    if (clapPulseTimer) clearTimeout(clapPulseTimer);

    const now = performance.now();
    const nextInvisible = !get().isInvisible;

    set({
      isInvisible: nextInvisible,
      lastClapTimestamp: now,
      clapPulseActive: true,
    });

    clapPulseTimer = setTimeout(() => {
      set({ clapPulseActive: false });
    }, 1000);
  },

  setAudioFrequencyBars: (audioFrequencyBars: number[]) => set({ audioFrequencyBars }),

  // ─── Effect & Invisibility Actions ─────────────────────────────────
  setEffectMode: (effectMode: EffectMode) => set({ effectMode }),

  setIsInvisible: (isInvisible: boolean) => set({ isInvisible }),

  toggleInvisibility: () => set((state) => ({ isInvisible: !state.isInvisible })),

  setIsProcessingEffect: (isProcessingEffect: boolean) => set({ isProcessingEffect }),

  updatePerformance: (metrics: Partial<PerformanceMetrics>) =>
    set((state) => ({
      performance: { ...state.performance, ...metrics },
    })),
}));
