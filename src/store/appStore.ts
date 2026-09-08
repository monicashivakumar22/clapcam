import { create } from 'zustand';
import type { AppState, EffectMode } from '@/types';
import { DEFAULT_CLAP_CONFIG, DEFAULT_SEGMENTATION_CONFIG } from '@/utils/constants';

const initialPerformance = {
  fps: 0,
  segmentationMs: 0,
  renderMs: 0,
  frameCount: 0,
};

let demoTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppState>((set, get) => ({
  // ─── Interactive Demo State ─────────────────────────────────────────
  isDemoInvisible: false,
  demoStage: 'visible',
  demoEffectMode: 'invisible',
  demoAudioLevel: 15,
  demoSpikeActive: false,
  demoFps: 60,

  triggerDemoClap: () => {
    if (demoTimer) clearTimeout(demoTimer);

    const currentlyInvisible = get().isDemoInvisible;

    // Stage 1: Clap impulse & audio spike
    set({
      demoStage: 'clapping',
      demoSpikeActive: true,
      demoAudioLevel: 98,
    });

    // Stage 2: Glitch / neural mask calculation
    demoTimer = setTimeout(() => {
      set({
        demoStage: 'glitching',
        demoAudioLevel: 55,
      });

      // Stage 3: Invisibility transition resolved
      demoTimer = setTimeout(() => {
        set({
          isDemoInvisible: !currentlyInvisible,
          demoStage: !currentlyInvisible ? 'invisible' : 'visible',
          demoSpikeActive: false,
          demoAudioLevel: 18,
        });
      }, 450);
    }, 250);
  },

  setDemoEffectMode: (demoEffectMode: EffectMode) => set({ demoEffectMode }),

  resetDemo: () => {
    if (demoTimer) clearTimeout(demoTimer);
    set({
      isDemoInvisible: false,
      demoStage: 'visible',
      demoAudioLevel: 15,
      demoSpikeActive: false,
    });
  },

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
