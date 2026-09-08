import { useRef, useEffect } from 'react';
import { useClapCamStore } from '@/store/useClapCamStore';
import { useSegmentation } from '@/hooks/useSegmentation';
import { useRenderLoop } from '@/hooks/useRenderLoop';
import { applyInvisibleEffect } from '@/effects/invisible';
import { createOrReuseCanvas, getContext2D } from '@/utils/canvas';

/**
 * Real-time compositing pipeline for the live camera feed.
 *
 * Responsibilities:
 * - Loads the MediaPipe segmentation model once the feed is active + calibrated.
 * - Runs a requestAnimationFrame loop that segments each video frame.
 * - When the user is "invisible" (clap-triggered) and a clean plate is cached,
 *   replaces person pixels with the clean background plate onto a <canvas>.
 * - Otherwise clears the canvas so the raw <video> shows through, keeping
 *   the camera feed 1:1 aligned.
 *
 * The caller renders a <canvas> overlay sized to the video dimensions and
 * positioned directly over the <video> element.
 */
export function useInvisibilityEffect(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const {
    cameraActive,
    isCalibrated,
    capturedBackground,
    effectMode,
    isInvisible,
    isMirrored,
    videoDimensions,
    modelLoaded,
    setIsProcessingEffect,
    updatePerformance,
  } = useClapCamStore();

  const { loadModel, segment, cleanup } = useSegmentation();
  const { startLoop, stopLoop } = useRenderLoop();

  // Refs to avoid recreating per-frame buffers on every render
  const bgImageDataRef = useRef<ImageData | null>(null);
  const modelLoadedRef = useRef(modelLoaded);
  const isMirroredRef = useRef(isMirrored);

  useEffect(() => {
    modelLoadedRef.current = modelLoaded;
  }, [modelLoaded]);

  useEffect(() => {
    isMirroredRef.current = isMirrored;
  }, [isMirrored]);

  // Cache the clean background plate as ImageData once it changes
  useEffect(() => {
    const bg = capturedBackground;
    if (!bg || !isCalibrated) {
      bgImageDataRef.current = null;
      return;
    }

    const offscreen = createOrReuseCanvas(null, bg.width, bg.height);
    const ctx = getContext2D(offscreen);
    if (!ctx) return;

    ctx.drawImage(bg.bitmap, 0, 0, bg.width, bg.height);
    bgImageDataRef.current = ctx.getImageData(0, 0, bg.width, bg.height);
  }, [capturedBackground, isCalibrated]);

  // Load the segmentation model once the feed is active and calibrated
  useEffect(() => {
    if (cameraActive && isCalibrated && !modelLoaded) {
      loadModel();
    }
  }, [cameraActive, isCalibrated, modelLoaded, loadModel]);

  // Start / stop the render loop based on camera activity
  useEffect(() => {
    if (!cameraActive) {
      stopLoop();
      return;
    }

    startLoop((_timestamp) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      if (video.readyState < 2) return;

      const dims = videoDimensions;
      const w = video.videoWidth || dims?.width || 1280;
      const h = video.videoHeight || dims?.height || 720;
      if (w === 0 || h === 0) return;

      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const showEffect =
        isInvisible && effectMode === 'invisible' && bgImageDataRef.current && modelLoadedRef.current;

      if (!showEffect) {
        // Show raw video by clearing the overlay canvas
        ctx.clearRect(0, 0, w, h);
        return;
      }

      const segStart = performance.now();
      const segResult = segment(video);
      const renderStart = performance.now();

      if (!segResult) {
        ctx.clearRect(0, 0, w, h);
        return;
      }

      const { mask: rawMask, width: maskW, height: maskH } = segResult;
      if (maskW === 0 || maskH === 0) return;

      // MediaPipe emits low-res masks; upscale to full video resolution so the
      // compositor can index it 1:1 against the video/background ImageData.
      const mask = upscaleMask(rawMask, maskW, maskH, w, h);

      // Capture the live video frame into ImageData for compositing.
      // Mirror it to match the calibration plate captured in selfie view,
      // keeping 1:1 pixel alignment with the mirrored <video> element.
      const videoOffscreen = createOrReuseCanvas(null, w, h);
      const videoCtx = getContext2D(videoOffscreen);
      if (!videoCtx) return;

      if (isMirroredRef.current) {
        videoCtx.translate(w, 0);
        videoCtx.scale(-1, 1);
      }
      videoCtx.drawImage(video, 0, 0, w, h);
      const videoFrame = videoCtx.getImageData(0, 0, w, h);

      const bgData = bgImageDataRef.current;
      if (!bgData) return;
      const output = ctx.createImageData(w, h);

      applyInvisibleEffect(output.data, {
        videoFrame,
        backgroundFrame: bgData,
        mask,
        width: w,
        height: h,
        timestamp: performance.now(),
      });

      ctx.putImageData(output, 0, 0);

      const renderMs = performance.now() - renderStart;
      const segMs = performance.now() - segStart;
      updatePerformance({ segmentationMs: segMs, renderMs });
      setIsProcessingEffect(true);
    });

    return () => {
      stopLoop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive, startLoop, stopLoop, segment]);

  // Reset processing flag when invisibility turns off
  useEffect(() => {
    if (!isInvisible) {
      setIsProcessingEffect(false);
    }
  }, [isInvisible, setIsProcessingEffect]);

  // Clean up segmentation resources on unmount / camera stop
  useEffect(() => {
    return () => {
      cleanup();
      bgImageDataRef.current = null;
    };
  }, [cleanup]);

  return { modelLoaded };
}

/**
 * Nearest-neighbor upscale of a low-res segmentation mask to full video
 * resolution so the compositor can index it 1:1 against the frame ImageData.
 */
function upscaleMask(
  src: Float32Array,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): Float32Array {
  const dst = new Float32Array(dstW * dstH);
  const xRatio = srcW / dstW;
  const yRatio = srcH / dstH;

  for (let y = 0; y < dstH; y++) {
    const srcY = Math.min(srcH - 1, Math.floor(y * yRatio));
    const srcRow = srcY * srcW;
    const dstRow = y * dstW;
    for (let x = 0; x < dstW; x++) {
      const srcX = Math.min(srcW - 1, Math.floor(x * xRatio));
      dst[dstRow + x] = src[srcRow + srcX];
    }
  }

  return dst;
}
