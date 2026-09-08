import type { CameraDevice } from '@/types/camera';

/**
 * Translates browser DOMException camera errors into actionable, user-friendly messages.
 */
export function formatCameraError(error: unknown): string {
  if (error instanceof DOMException || (typeof error === 'object' && error !== null && 'name' in error)) {
    const err = error as DOMException;
    switch (err.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return 'Camera permission was denied. Please grant camera access in your browser address bar to use ClapCam AI.';
      case 'NotFoundError':
      case 'DevicesNotFoundError':
        return 'No camera hardware found. Please connect a webcam and refresh the page.';
      case 'NotReadableError':
      case 'TrackStartError':
        return 'Camera is in use by another application or OS service (e.g., Zoom, Teams). Please close other camera apps and retry.';
      case 'OverconstrainedError':
      case 'ConstraintNotSatisfiedError':
        return 'The requested camera resolution or configuration is not supported by your hardware.';
      case 'AbortError':
        return 'Camera connection was aborted. Please check your hardware connection and try again.';
      case 'SecurityError':
        return 'Camera access is blocked due to browser security restrictions. Ensure you are running on localhost or HTTPS.';
      default:
        return err.message ? `Camera Error (${err.name}): ${err.message}` : 'Failed to start camera due to an unexpected hardware error.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected camera error occurred. Please refresh the page.';
}

/**
 * Checks if the MediaDevices API and getUserMedia are supported in the current environment.
 */
export function isMediaDevicesSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  );
}

/**
 * Retrieves all available video input devices with sensible fallback labels.
 */
export async function getVideoInputDevices(): Promise<CameraDevice[]> {
  if (!isMediaDevicesSupported() || typeof navigator.mediaDevices.enumerateDevices !== 'function') {
    return [];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');

    return videoDevices.map((device, index) => ({
      deviceId: device.deviceId,
      label: device.label || `Camera ${index + 1} (${device.deviceId.slice(0, 5)}...)`,
      groupId: device.groupId,
    }));
  } catch (err) {
    console.warn('[CameraUtils] Failed to enumerate devices:', err);
    return [];
  }
}

/**
 * Constructs clean MediaStreamConstraints for video capture.
 */
export function getCameraConstraints(deviceId?: string): MediaStreamConstraints {
  if (deviceId) {
    return {
      video: {
        deviceId: { exact: deviceId },
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 360 },
        frameRate: { ideal: 30, max: 60 },
      },
      audio: false,
    };
  }

  return {
    video: {
      facingMode: 'user',
      width: { ideal: 1280, min: 640 },
      height: { ideal: 720, min: 360 },
      frameRate: { ideal: 30, max: 60 },
    },
    audio: false,
  };
}

/**
 * Safely stops all media tracks and releases hardware handles.
 */
export function stopMediaStream(stream: MediaStream | null): void {
  if (!stream) return;

  try {
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
      track.enabled = false;
    });
  } catch (err) {
    console.warn('[CameraUtils] Error stopping media tracks:', err);
  }
}
