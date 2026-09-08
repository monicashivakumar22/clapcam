import { create } from 'zustand';
import type { AppState } from '@/types';
import { DEFAULT_CLAP_CONFIG, DEFAULT_SEGMENTATION_CONFIG } from '@/utils/constants';

const initialPerformance = {
  fps: 0,
  segmentationMs: 0,
  renderMs: 0,
  frameCount: 0,
};

export const useAppStore = create<AppState>((set) => ({
  // ─── Phase & Mode ───────────────────────────────────────────────────
  phase: 'initializing',
  effectMode: 'invisible',
  isVisible: true,

  // ─── Media ──────────────────────────────────────────────────────────
  cameraReady: false,
  micReady: false,
  backgroundFrame: null,

  // ─── AI ─────────────────────────────────────────────────────────────
  modelLoaded: false,
  modelLoadProgress: 0,

  // ─── Performance ────────────────────────────────────────────────────
  performance: { ...initialPerformance },

  // ─── Configuration ──────────────────────────────────────────────────
  clapConfig: { ...DEFAULT_CLAP_CONFIG },
  segmentationConfig: { ...DEFAULT_SEGMENTATION_CONFIG },

  // ─── Error ──────────────────────────────────────────────────────────
  error: null,

  // ─── Actions ────────────────────────────────────────────────────────
  setPhase: (phase) => set({ phase }),
  setEffectMode: (effectMode) => set({ effectMode }),
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  setIsVisible: (isVisible) => set({ isVisible }),
  setCameraReady: (cameraReady) => set({ cameraReady }),
  setMicReady: (micReady) => set({ micReady }),
  setBackgroundFrame: (backgroundFrame) => set({ backgroundFrame }),
  setModelLoaded: (modelLoaded) => set({ modelLoaded }),
  setModelLoadProgress: (modelLoadProgress) => set({ modelLoadProgress }),
  updatePerformance: (metrics) =>
    set((state) => ({
      performance: { ...state.performance, ...metrics },
    })),
  setClapConfig: (config) =>
    set((state) => ({
      clapConfig: { ...state.clapConfig, ...config },
    })),
  setSegmentationConfig: (config) =>
    set((state) => ({
      segmentationConfig: { ...state.segmentationConfig, ...config },
    })),
  setError: (error) => set({ error, phase: error ? 'error' : 'initializing' }),
  reset: () =>
    set({
      phase: 'initializing',
      effectMode: 'invisible',
      isVisible: true,
      cameraReady: false,
      micReady: false,
      backgroundFrame: null,
      modelLoaded: false,
      modelLoadProgress: 0,
      performance: { ...initialPerformance },
      clapConfig: { ...DEFAULT_CLAP_CONFIG },
      segmentationConfig: { ...DEFAULT_SEGMENTATION_CONFIG },
      error: null,
    }),
}));
