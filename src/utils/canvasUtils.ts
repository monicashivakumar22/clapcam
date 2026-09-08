import type { CapturedBackground } from '@/types/camera';

/**
 * Captures a single frozen frame from an active HTMLVideoElement.
 * Creates an in-memory canvas with exact natural video dimensions,
 * applies mirroring transformation if active, and produces an immutable ImageBitmap.
 */
export async function captureVideoFrame(
  video: HTMLVideoElement,
  isMirrored: boolean = false,
): Promise<CapturedBackground | null> {
  if (!video || video.readyState < 2) {
    console.warn('[canvasUtils] Video element is not ready for frame capture');
    return null;
  }

  const width = video.videoWidth || 1280;
  const height = video.videoHeight || 720;

  if (width === 0 || height === 0) {
    console.warn('[canvasUtils] Video dimensions are 0x0');
    return null;
  }

  // Create an offscreen in-memory canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', {
    alpha: false,
    willReadFrequently: true,
  });

  if (!ctx) {
    console.warn('[canvasUtils] Failed to acquire 2D context');
    return null;
  }

  // If the video is mirrored for selfie view, mirror the captured canvas
  // to maintain 1:1 pixel coordinate alignment during compositing
  if (isMirrored) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  // Draw current video frame to canvas
  ctx.drawImage(video, 0, 0, width, height);

  try {
    // Generate an immutable ImageBitmap for fast WebGL/Canvas compositing
    const bitmap = await createImageBitmap(canvas);

    // Generate in-memory DataURL for UI preview
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    return {
      bitmap,
      dataUrl,
      width,
      height,
      capturedAt: Date.now(),
      isMirrored,
    };
  } catch (err) {
    console.error('[canvasUtils] Error generating ImageBitmap:', err);
    return null;
  }
}

/**
 * Safely releases an ImageBitmap hardware resource to avoid GPU/RAM leaks.
 */
export function disposeImageBitmap(bitmap: ImageBitmap | null): void {
  if (!bitmap) return;

  try {
    if (typeof bitmap.close === 'function') {
      bitmap.close();
    }
  } catch (err) {
    console.warn('[canvasUtils] Error disposing ImageBitmap:', err);
  }
}

/**
 * Safely disposes a captured background object.
 */
export function disposeCapturedBackground(bg: CapturedBackground | null): void {
  if (!bg) return;
  disposeImageBitmap(bg.bitmap);
}
