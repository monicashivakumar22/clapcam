import { MIC_CONSTRAINTS } from '@/utils/constants';

let micStream: MediaStream | null = null;

/**
 * Request microphone access and return the raw MediaStream.
 * Disables browser audio processing (echo cancellation, noise suppression,
 * auto gain control) to get a clean signal for clap detection.
 *
 * @throws Error if the user denies microphone permission or no mic is available
 */
export async function initAudio(): Promise<MediaStream> {
  try {
    micStream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
    return micStream;
  } catch (err) {
    if (err instanceof DOMException) {
      switch (err.name) {
        case 'NotAllowedError':
          throw new Error(
            'Microphone permission denied. ClapCam AI needs mic access to detect claps.',
          );
        case 'NotFoundError':
          throw new Error(
            'No microphone found. Please connect a microphone and try again.',
          );
        case 'NotReadableError':
          throw new Error(
            'Microphone is in use by another application. Please close other apps and try again.',
          );
        default:
          throw new Error(`Microphone error: ${err.message}`);
      }
    }
    throw err;
  }
}

/**
 * Stop all microphone tracks and release the stream.
 */
export function destroyAudio(): void {
  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop());
    micStream = null;
  }
}

/**
 * Check if the microphone stream is currently active.
 */
export function isMicActive(): boolean {
  return micStream !== null && micStream.getAudioTracks().some((t) => t.enabled);
}
