import { useRef, useCallback } from 'react';
import { useClapCamStore } from '@/store/useClapCamStore';

/**
 * Hook to manage the requestAnimationFrame render loop.
 * Orchestrates calling the segmenter + effect compositor each frame.
 * Tracks FPS and per-frame timing.
 */
export function useRenderLoop() {
  const animationIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const fpsFrameCountRef = useRef(0);
  const fpsLastTimeRef = useRef(performance.now());
  const updatePerformance = useClapCamStore((s) => s.updatePerformance);

  const startLoop = useCallback(
    (frameCallback: (timestamp: number) => void) => {
      const loop = (timestamp: number) => {
        // FPS calculation
        fpsFrameCountRef.current++;
        const elapsed = timestamp - fpsLastTimeRef.current;
        if (elapsed >= 1000) {
          const fps = Math.round((fpsFrameCountRef.current / elapsed) * 1000);
          updatePerformance({ fps, frameCount: fpsFrameCountRef.current });
          fpsFrameCountRef.current = 0;
          fpsLastTimeRef.current = timestamp;
        }

        lastFrameTimeRef.current = timestamp;
        frameCallback(timestamp);

        animationIdRef.current = requestAnimationFrame(loop);
      };

      animationIdRef.current = requestAnimationFrame(loop);
    },
    [updatePerformance],
  );

  const stopLoop = useCallback(() => {
    if (animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);

  return {
    startLoop,
    stopLoop,
  };
}
