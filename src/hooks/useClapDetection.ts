import { useRef, useCallback, useEffect } from 'react';
import { ClapDetector } from '@/audio/clapDetector';
import { initAudio, destroyAudio } from '@/audio/audioManager';
import { useClapCamStore } from '@/store/useClapCamStore';
import type { ClapEvent } from '@/types';

/**
 * Hook to manage clap detection lifecycle.
 * Starts the microphone, creates a ClapDetector, routes clap events to the store,
 * and forwards real-time audio frequency bar data for the visualizer.
 */
export function useClapDetection() {
  const detectorRef = useRef<ClapDetector | null>(null);
  const clapConfig = useClapCamStore((s) => s.clapConfig);
  const setMicActive = useClapCamStore((s) => s.setMicActive);
  const setMicLoading = useClapCamStore((s) => s.setMicLoading);
  const triggerClapDetected = useClapCamStore((s) => s.triggerClapDetected);
  const setMicError = useClapCamStore((s) => s.setMicError);
  const setAudioFrequencyBars = useClapCamStore((s) => s.setAudioFrequencyBars);

  const onClap = useCallback(
    (_event: ClapEvent) => {
      triggerClapDetected();
    },
    [triggerClapDetected],
  );

  const onAudioData = useCallback(
    (bars: number[]) => {
      setAudioFrequencyBars(bars);
    },
    [setAudioFrequencyBars],
  );

  const startDetection = useCallback(async () => {
    try {
      setMicLoading(true);
      const stream = await initAudio();
      const detector = new ClapDetector(clapConfig);
      await detector.start(stream, onClap, onAudioData);
      detectorRef.current = detector;
      setMicActive(true);
    } catch (err) {
      setMicError(err instanceof Error ? err.message : 'Failed to start clap detection.');
    }
  }, [clapConfig, onClap, onAudioData, setMicActive, setMicLoading, setMicError]);

  const stopDetection = useCallback(() => {
    if (detectorRef.current) {
      detectorRef.current.stop();
      detectorRef.current = null;
    }
    destroyAudio();
    setMicActive(false);
    // Reset bars to flat
    setAudioFrequencyBars(new Array(16).fill(10));
  }, [setMicActive, setAudioFrequencyBars]);

  // Update detector config at runtime without restarting
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
