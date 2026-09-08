import type { EffectParams } from '@/types';

/**
 * Pixel mosaic effect: renders the person region as large pixelated blocks
 * while keeping the background crisp.
 *
 * @param output - Uint8ClampedArray to write composited pixels into (RGBA)
 * @param params - Contains videoFrame, backgroundFrame, mask, and dimensions
 * @param blockSize - Size of each mosaic block in pixels (default: 12)
 */
export function applyPixelEffect(
  output: Uint8ClampedArray,
  params: EffectParams,
  blockSize: number = 12,
): void {
  const { videoFrame, mask, width, height } = params;
  const videoData = videoFrame.data;
  const pixelCount = width * height;

  // First pass: copy background/video as-is
  for (let i = 0; i < pixelCount; i++) {
    const px = i * 4;
    output[px] = videoData[px];
    output[px + 1] = videoData[px + 1];
    output[px + 2] = videoData[px + 2];
    output[px + 3] = 255;
  }

  // Second pass: pixelate person regions
  for (let by = 0; by < height; by += blockSize) {
    for (let bx = 0; bx < width; bx += blockSize) {
      // Sample the center of the block
      const cx = Math.min(bx + Math.floor(blockSize / 2), width - 1);
      const cy = Math.min(by + Math.floor(blockSize / 2), height - 1);
      const centerIdx = cy * width + cx;

      // Only pixelate if center is in person region
      if (mask[centerIdx] <= 0.3) continue;

      const cpx = centerIdx * 4;
      const r = videoData[cpx];
      const g = videoData[cpx + 1];
      const b = videoData[cpx + 2];

      // Fill the entire block with the center color
      const endY = Math.min(by + blockSize, height);
      const endX = Math.min(bx + blockSize, width);

      for (let y = by; y < endY; y++) {
        for (let x = bx; x < endX; x++) {
          const idx = y * width + x;
          if (mask[idx] > 0.3) {
            const px = idx * 4;
            output[px] = r;
            output[px + 1] = g;
            output[px + 2] = b;
            output[px + 3] = 255;
          }
        }
      }
    }
  }
}
