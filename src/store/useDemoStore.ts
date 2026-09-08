import { create } from 'zustand';
import type { EffectMode, DemoState } from '@/types';

let demoTimer: ReturnType<typeof setTimeout> | null = null;

export const useDemoStore = create<DemoState>((set, get) => ({
  isDemoInvisible: false,
  demoStage: 'visible',
  demoEffectMode: 'invisible',
  demoAudioLevel: 15,
  demoSpikeActive: false,
  demoFps: 60,

  triggerDemoClap: () => {
    if (demoTimer) clearTimeout(demoTimer);

    const currentlyInvisible = get().isDemoInvisible;

    set({
      demoStage: 'clapping',
      demoSpikeActive: true,
      demoAudioLevel: 98,
    });

    demoTimer = setTimeout(() => {
      set({
        demoStage: 'glitching',
        demoAudioLevel: 55,
      });

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
}));
