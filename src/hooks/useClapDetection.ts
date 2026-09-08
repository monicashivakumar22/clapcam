import { useRef, useCallback, useEffect } from 'react';
import { ClapDetector } from '@/audio/clapDetector';
import { initAudio, destroyAudio } from '@/audio/audioManager';
import { useAppStore } from '@/store/appStore';
import type { ClapEvent } from '@/types';

/**
 * Hook to manage clap detection lifecycle.
 * Starts the microphone, creates a ClapDetector, and routes clap events to the store.
 */
export function useClapDetection() {
  const detectorRef = useRef<ClapDetector | null>(null);
  const clapConfig = useAppStore((s) => s.clapConfig);
  const setMicReady = useAppStore((s) => s.setMicReady);
  const toggleVisibility = useAppStore((s) => s.toggleVisibility);
  const setError = useAppStore((s) => s.setError);

  const onClap = useCallback(
    (_event: ClapEvent) => {
      toggleVisibility();
    },
    [toggleVisibility],
  );

  const startDetection = useCallback(async () => {
    try {
      const stream = await initAudio();
      const detector = new ClapDetector(clapConfig);
      await detector.start(stream, onClap);
      detectorRef.current = detector;
      setMicReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start clap detection.');
    }
  }, [clapConfig, onClap, setMicReady, setError]);

  const stopDetection = useCallback(() => {
    if (detectorRef.current) {
      detectorRef.current.stop();
      detectorRef.current = null;
    }
    destroyAudio();
    setMicReady(false);
  }, [setMicReady]);

  // Update detector config at runtime
  useEffect(() => {
    if (detectorRef.current) {
      detectorRef.current.updateConfig(clapConfig);
    }
  }, [clapConfig]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    startDetection,
    stopDetection,
  };
}
