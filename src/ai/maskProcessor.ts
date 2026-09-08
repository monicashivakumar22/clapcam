import type { SegmentationConfig } from '@/types';

/**
 * Temporal smoothing buffer.
 * Stores the last N mask frames to average out flickering.
 */
let temporalBuffer: Float32Array[] = [];
let smoothedMask: Float32Array | null = null;

/**
 * Process a raw confidence mask from the segmenter:
 * 1. Apply confidence threshold (hard cutoff)
 * 2. Apply edge smoothing via box blur
 * 3. Blend with temporal buffer to reduce flicker
 *
 * @param rawMask - Raw Float32Array from MediaPipe (0.0 to 1.0 per pixel)
 * @param width - Mask width in pixels
 * @param height - Mask height in pixels
 * @param config - Segmentation configuration (threshold, blur, temporal frames)
 * @returns Processed Float32Array mask (0.0 = background, 1.0 = person)
 */
export function processMask(
  rawMask: Float32Array,
  width: number,
  height: number,
  config: SegmentationConfig,
): Float32Array {
  const { confidenceThreshold, edgeBlurRadius, temporalSmoothing } = config;
  const size = width * height;

  // Step 1: Threshold the raw mask
  const thresholded = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    thresholded[i] = rawMask[i] >= confidenceThreshold ? rawMask[i] : 0;
  }

  // Step 2: Apply edge blur (box blur approximation)
  const blurred = applyBoxBlur(thresholded, width, height, edgeBlurRadius);

  // Step 3: Temporal smoothing
  const result = applyTemporalSmoothing(blurred, temporalSmoothing);

  return result;
}

/**
 * Simple box blur for mask edge smoothing.
 * Uses separable passes (horizontal then vertical) for efficiency.
 */
function applyBoxBlur(
  mask: Float32Array,
  width: number,
  height: number,
  radius: number,
): Float32Array {
  if (radius <= 0) return mask;

  const size = width * height;
  const temp = new Float32Array(size);
  const result = new Float32Array(size);
  const diameter = radius * 2 + 1;

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    let sum = 0;
    const rowOffset = y * width;

    // Initialize window
    for (let x = -radius; x <= radius; x++) {
      const idx = Math.max(0, Math.min(width - 1, x));
      sum += mask[rowOffset + idx];
    }
    temp[rowOffset] = sum / diameter;

    // Slide window
    for (let x = 1; x < width; x++) {
      const addIdx = Math.min(width - 1, x + radius);
      const removeIdx = Math.max(0, x - radius - 1);
      sum += mask[rowOffset + addIdx] - mask[rowOffset + removeIdx];
      temp[rowOffset + x] = sum / diameter;
    }
  }

  // Vertical pass
  for (let x = 0; x < width; x++) {
    let sum = 0;

    // Initialize window
    for (let y = -radius; y <= radius; y++) {
      const idx = Math.max(0, Math.min(height - 1, y));
      sum += temp[idx * width + x];
    }
    result[x] = sum / diameter;

    // Slide window
    for (let y = 1; y < height; y++) {
      const addIdx = Math.min(height - 1, y + radius);
      const removeIdx = Math.max(0, y - radius - 1);
      sum += temp[addIdx * width + x] - temp[removeIdx * width + x];
      result[y * width + x] = sum / diameter;
    }
  }

  return result;
}

/**
 * Temporal smoothing: averages the current mask with the last N masks
 * to reduce frame-to-frame flicker in the segmentation boundary.
 */
export function applyTemporalSmoothing(
  currentMask: Float32Array,
  bufferSize: number,
): Float32Array {
  if (bufferSize <= 1) return currentMask;

  // Add current mask to buffer
  temporalBuffer.push(new Float32Array(currentMask));

  // Trim buffer to max size
  while (temporalBuffer.length > bufferSize) {
    temporalBuffer.shift();
  }

  const size = currentMask.length;

  // Reuse or allocate smoothed mask buffer
  if (!smoothedMask || smoothedMask.length !== size) {
    smoothedMask = new Float32Array(size);
  }

  const frameCount = temporalBuffer.length;
  const weight = 1 / frameCount;

  // Average all frames in buffer
  smoothedMask.fill(0);
  for (const frame of temporalBuffer) {
    for (let i = 0; i < size; i++) {
      smoothedMask[i] += frame[i] * weight;
    }
  }

  return smoothedMask;
}

/**
 * Reset temporal smoothing buffer. Call when switching modes
 * or recalibrating to avoid ghosting artifacts.
 */
export function resetTemporalBuffer(): void {
  temporalBuffer = [];
  smoothedMask = null;
}
