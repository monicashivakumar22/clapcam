import { useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { CAMERA_CONSTRAINTS } from '@/utils/constants';

/**
 * Hook to manage camera stream lifecycle.
 * Handles getUserMedia, stream attachment to video element, and cleanup.
 */
export function useCamera() {
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const setCameraReady = useAppStore((s) => s.setCameraReady);
  const setError = useAppStore((s) => s.setError);

  const startCamera = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      streamRef.current = stream;
      videoRef.current = videoElement;

      videoElement.srcObject = stream;
      await videoElement.play();

      setCameraReady(true);
      return stream;
    } catch (err) {
      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
            setError('Camera permission denied. ClapCam AI needs camera access to work.');
            break;
          case 'NotFoundError':
            setError('No camera found. Please connect a camera and refresh.');
            break;
          case 'NotReadableError':
            setError('Camera is in use by another app. Please close other apps.');
            break;
          default:
            setError(`Camera error: ${err.message}`);
        }
      } else {
        setError('Failed to access camera.');
      }
      return null;
    }
  }, [setCameraReady, setError]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
  }, [setCameraReady]);

  const captureFrame = useCallback((): ImageData | null => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    streamRef,
    startCamera,
    stopCamera,
    captureFrame,
  };
}
