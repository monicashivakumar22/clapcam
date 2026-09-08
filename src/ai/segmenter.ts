import { ImageSegmenter, FilesetResolver } from '@mediapipe/tasks-vision';
import type { SegmentationResult } from '@/types';
import {
  MEDIAPIPE_WASM_CDN,
  SELFIE_SEGMENTER_MODEL,
  SELFIE_SEGMENTER_LANDSCAPE_MODEL,
} from '@/utils/constants';

let segmenter: ImageSegmenter | null = null;

/**
 * Initialize the MediaPipe ImageSegmenter with the selfie segmentation model.
 * Downloads the WASM runtime and model weights on first call.
 *
 * @param modelType - 'general' (256x256) or 'landscape' (144x256)
 * @param onProgress - Optional callback for loading progress (0-100)
 */
export async function initSegmenter(
  modelType: 'general' | 'landscape' = 'general',
  onProgress?: (progress: number) => void,
): Promise<void> {
  if (segmenter) {
    await segmenter.close();
    segmenter = null;
  }

  onProgress?.(10);

  const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_CDN);

  onProgress?.(40);

  const modelPath =
    modelType === 'landscape'
      ? SELFIE_SEGMENTER_LANDSCAPE_MODEL
      : SELFIE_SEGMENTER_MODEL;

  segmenter = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: modelPath,
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    outputConfidenceMasks: true,
    outputCategoryMask: false,
  });

  onProgress?.(100);
}

/**
 * Run segmentation on a single video frame.
 * Returns a confidence mask where each pixel is 0.0 (background) to 1.0 (person).
 *
 * @param video - The HTMLVideoElement providing the current frame
 * @param timestampMs - Frame timestamp in milliseconds (must be monotonically increasing)
 */
export function segmentFrame(
  video: HTMLVideoElement,
  timestampMs: number,
): SegmentationResult | null {
  if (!segmenter) {
    console.warn('[Segmenter] Not initialized. Call initSegmenter() first.');
    return null;
  }

  const result = segmenter.segmentForVideo(video, timestampMs);
  const confidenceMasks = result.confidenceMasks;

  if (!confidenceMasks || confidenceMasks.length === 0) {
    return null;
  }

  // The first confidence mask corresponds to the "person" category
  const personMask = confidenceMasks[0];
  const maskData = personMask.getAsFloat32Array();

  return {
    mask: maskData,
    width: personMask.width,
    height: personMask.height,
    timestampMs,
  };
}

/**
 * Release all MediaPipe resources.
 */
export async function destroySegmenter(): Promise<void> {
  if (segmenter) {
    await segmenter.close();
    segmenter = null;
  }
}

/**
 * Check if the segmenter is currently initialized and ready.
 */
export function isSegmenterReady(): boolean {
  return segmenter !== null;
}
