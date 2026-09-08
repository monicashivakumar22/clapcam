import type { EffectParams } from '@/types';

/**
 * Ghost effect: renders the person semi-transparent against the background.
 * The person is visible but appears as a translucent "ghost" overlay.
 *
 * @param output - Uint8ClampedArray to write composited pixels into (RGBA)
 * @param params - Contains videoFrame, backgroundFrame, mask, and dimensions
 * @param ghostOpacity - Opacity of the person (0.0 = fully invisible, 1.0 = fully visible)
 */
export function applyGhostEffect(
  output: Uint8ClampedArray,
  params: EffectParams,
  ghostOpacity: number = 0.3,
): void {
  const { videoFrame, backgroundFrame, mask, width, height } = params;
  const videoData = videoFrame.data;
  const bgData = backgroundFrame.data;
  const pixelCount = width * height;

  for (let i = 0; i < pixelCount; i++) {
    const maskAlpha = mask[i];
    const px = i * 4;

    if (maskAlpha <= 0.01) {
      // Background — pass through live video
      output[px] = videoData[px];
      output[px + 1] = videoData[px + 1];
      output[px + 2] = videoData[px + 2];
      output[px + 3] = 255;
    } else {
      // Person region — blend with ghostOpacity
      const personWeight = maskAlpha * ghostOpacity;
      const bgWeight = 1 - personWeight;

      // Add a slight blue tint to the ghost for spooky effect
      output[px] = videoData[px] * personWeight * 0.7 + bgData[px] * bgWeight;
      output[px + 1] = videoData[px + 1] * personWeight * 0.8 + bgData[px + 1] * bgWeight;
      output[px + 2] = videoData[px + 2] * personWeight * 1.2 + bgData[px + 2] * bgWeight;
      output[px + 3] = 255;
    }
  }
}
