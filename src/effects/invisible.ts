import type { EffectParams } from '@/types';

/**
 * Core invisibility effect: replaces person pixels with stored background pixels.
 *
 * For each pixel:
 * - If mask confidence > 0 (person detected): use background pixel
 * - If mask confidence = 0 (background): use live video pixel
 * - Blends at mask edges using the confidence value as alpha for smooth transitions
 *
 * @param output - Uint8ClampedArray to write composited pixels into (RGBA)
 * @param params - Contains videoFrame, backgroundFrame, mask, and dimensions
 */
export function applyInvisibleEffect(
  output: Uint8ClampedArray,
  params: EffectParams,
): void {
  const { videoFrame, backgroundFrame, mask, width, height } = params;
  const videoData = videoFrame.data;
  const bgData = backgroundFrame.data;
  const pixelCount = width * height;

  for (let i = 0; i < pixelCount; i++) {
    const alpha = mask[i]; // 0.0 (background) to 1.0 (person)
    const px = i * 4;

    if (alpha <= 0.01) {
      // Pure background — use live video
      output[px] = videoData[px];
      output[px + 1] = videoData[px + 1];
      output[px + 2] = videoData[px + 2];
      output[px + 3] = 255;
    } else if (alpha >= 0.99) {
      // Pure person — replace with stored background
      output[px] = bgData[px];
      output[px + 1] = bgData[px + 1];
      output[px + 2] = bgData[px + 2];
      output[px + 3] = 255;
    } else {
      // Edge blend: lerp between video and background using mask alpha
      const inv = 1 - alpha;
      output[px] = videoData[px] * inv + bgData[px] * alpha;
      output[px + 1] = videoData[px + 1] * inv + bgData[px + 1] * alpha;
      output[px + 2] = videoData[px + 2] * inv + bgData[px + 2] * alpha;
      output[px + 3] = 255;
    }
  }
}
