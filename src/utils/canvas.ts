/**
 * Canvas utility functions for buffer management and drawing operations.
 */

/**
 * Create an offscreen canvas with the given dimensions.
 * Reuses the existing canvas if dimensions match.
 */
export function createOrReuseCanvas(
  existing: HTMLCanvasElement | null,
  width: number,
  height: number,
): HTMLCanvasElement {
  if (existing && existing.width === width && existing.height === height) {
    return existing;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Get a 2D rendering context from a canvas, with optimizations.
 */
export function getContext2D(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D | null {
  return canvas.getContext('2d', {
    willReadFrequently: true,
    alpha: false,
  });
}

/**
 * Draw a video frame onto a canvas, scaling to fit.
 */
export function drawVideoFrame(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  width: number,
  height: number,
): void {
  ctx.drawImage(video, 0, 0, width, height);
}

/**
 * Create a reusable ImageData buffer.
 * Avoids allocating new ImageData objects every frame.
 */
export function createOrReuseImageData(
  existing: ImageData | null,
  width: number,
  height: number,
): ImageData {
  if (existing && existing.width === width && existing.height === height) {
    return existing;
  }
  return new ImageData(width, height);
}
