import { useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { initSegmenter, segmentFrame, destroySegmenter } from '@/ai/segmenter';
import { processMask, resetTemporalBuffer } from '@/ai/maskProcessor';
import type { SegmentationResult } from '@/types';

/**
 * Hook to manage MediaPipe segmentation lifecycle.
 * Handles model loading, per-frame segmentation, and mask processing.
 */
export function useSegmentation() {
  const segmentationConfig = useAppStore((s) => s.segmentationConfig);
  const setModelLoaded = useAppStore((s) => s.setModelLoaded);
  const setModelLoadProgress = useAppStore((s) => s.setModelLoadProgress);
  const setError = useAppStore((s) => s.setError);
  const lastTimestampRef = useRef(0);

  const loadModel = useCallback(async () => {
    try {
      setModelLoadProgress(0);
      await initSegmenter(segmentationConfig.modelType, (progress) => {
        setModelLoadProgress(progress);
      });
      setModelLoaded(true);
    } catch (err) {
      setError(
        `Failed to load segmentation model: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }, [segmentationConfig.modelType, setModelLoaded, setModelLoadProgress, setError]);

  const segment = useCallback(
    (video: HTMLVideoElement): Float32Array | null => {
      // Ensure monotonically increasing timestamps
      const now = performance.now();
      if (now <= lastTimestampRef.current) {
        lastTimestampRef.current += 1;
      } else {
        lastTimestampRef.current = now;
      }

      const result: SegmentationResult | null = segmentFrame(
        video,
        lastTimestampRef.current,
      );

      if (!result) return null;

      // Process: threshold → blur → temporal smooth
      return processMask(
        result.mask,
        result.width,
        result.height,
        segmentationConfig,
      );
    },
    [segmentationConfig],
  );

  const cleanup = useCallback(async () => {
    resetTemporalBuffer();
    await destroySegmenter();
    setModelLoaded(false);
  }, [setModelLoaded]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    loadModel,
    segment,
    cleanup,
  };
}
