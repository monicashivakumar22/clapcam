import { useRef, useCallback, useEffect } from 'react';
import { ClapDetector } from '@/audio/clapDetector';
import { initAudio, destroyAudio } from '@/audio/audioManager';
import { useClapCamStore } from '@/store/useClapCamStore';
import type { ClapEvent } from '@/types';

/**
 * Hook to manage clap detection lifecycle.
 * Starts the microphone, creates a ClapDetector, and routes clap events to the store.
 */
export function useClapDetection() {
  const detectorRef = useRef<ClapDetector | null>(null);
  const clapConfig = useClapCamStore((s) => s.clapConfig);
  const setMicActive = useClapCamStore((s) => s.setMicActive);
  const toggleInvisibility = useClapCamStore((s) => s.toggleInvisibility);
  const setMicError = useClapCamStore((s) => s.setMicError);

  const onClap = useCallback(
    (_event: ClapEvent) => {
      toggleInvisibility();
    },
    [toggleInvisibility],
  );

  const startDetection = useCallback(async () => {
    try {
      const stream = await initAudio();
      const detector = new ClapDetector(clapConfig);
      await detector.start(stream, onClap);
      detectorRef.current = detector;
      setMicActive(true);
    } catch (err) {
      setMicError(err instanceof Error ? err.message : 'Failed to start clap detection.');
    }
  }, [clapConfig, onClap, setMicActive, setMicError]);

  const stopDetection = useCallback(() => {
    if (detectorRef.current) {
      detectorRef.current.stop();
      detectorRef.current = null;
    }
    destroyAudio();
    setMicActive(false);
  }, [setMicActive]);

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
