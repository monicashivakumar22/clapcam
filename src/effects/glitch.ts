import type { EffectParams } from '@/types';

/**
 * Glitch effect: applies RGB channel shifting and scanline artifacts
 * to the person region, creating a digital distortion look.
 *
 * @param output - Uint8ClampedArray to write composited pixels into (RGBA)
 * @param params - Contains videoFrame, backgroundFrame, mask, and dimensions
 * @param intensity - Glitch intensity (0.0 to 1.0, default: 0.5)
 */
export function applyGlitchEffect(
  output: Uint8ClampedArray,
  params: EffectParams,
  intensity: number = 0.5,
): void {
  const { videoFrame, backgroundFrame, mask, width, height, timestamp } = params;
  const videoData = videoFrame.data;
  const bgData = backgroundFrame.data;
  const pixelCount = width * height;

  // Pseudo-random offset based on timestamp for animated glitch
  const time = timestamp * 0.001;
  const shiftR = Math.floor(Math.sin(time * 7.3) * 8 * intensity);
  const shiftB = Math.floor(Math.cos(time * 5.1) * 8 * intensity);
  const scanlineFreq = Math.floor(4 + Math.sin(time * 3) * 2);

  for (let i = 0; i < pixelCount; i++) {
    const px = i * 4;
    const maskAlpha = mask[i];

    if (maskAlpha <= 0.1) {
      // Background — pass through
      output[px] = videoData[px];
      output[px + 1] = videoData[px + 1];
      output[px + 2] = videoData[px + 2];
      output[px + 3] = 255;
      continue;
    }

    const x = i % width;
    const y = Math.floor(i / width);

    // RGB channel shift: offset red and blue channels horizontally
    const rIdx = Math.max(0, Math.min(pixelCount - 1, y * width + x + shiftR)) * 4;
    const bIdx = Math.max(0, Math.min(pixelCount - 1, y * width + x + shiftB)) * 4;

    let r = videoData[rIdx];
    let g = videoData[px + 1];
    let b = videoData[bIdx + 2];

    // Scanline effect: darken every Nth row
    if (y % scanlineFreq === 0) {
      const darken = 0.6;
      r = r * darken;
      g = g * darken;
      b = b * darken;
    }

    // Blend with background at mask edges
    const blend = Math.min(maskAlpha, 1);
    const inv = 1 - blend;

    output[px] = r * blend + bgData[px] * inv;
    output[px + 1] = g * blend + bgData[px + 1] * inv;
    output[px + 2] = b * blend + bgData[px + 2] * inv;
    output[px + 3] = 255;
  }
}
