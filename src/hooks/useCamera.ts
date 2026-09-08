import { useRef, useCallback, useEffect } from 'react';
import { useClapCamStore } from '@/store/useClapCamStore';
import {
  formatCameraError,
  getVideoInputDevices,
  getCameraConstraints,
  stopMediaStream,
  isMediaDevicesSupported,
} from '@/utils/cameraUtils';

export function useCamera() {
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    cameraActive,
    cameraLoading,
    cameraError,
    cameraStatus,
    selectedCameraId,
    availableDevices,
    isMirrored,
    videoDimensions,
    isFullscreen,
    setCameraActive,
    setCameraLoading,
    setCameraError,
    setSelectedCameraId,
    setAvailableDevices,
    toggleMirror,
    setVideoDimensions,
    setIsFullscreen,
    resetCameraState,
  } = useClapCamStore();

  /**
   * Refreshes the list of connected video input hardware devices.
   */
  const refreshDevices = useCallback(async () => {
    const devices = await getVideoInputDevices();
    setAvailableDevices(devices);
    return devices;
  }, [setAvailableDevices]);

  /**
   * Stops the active camera stream and cleans up video bindings.
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    setVideoDimensions(null);
  }, [setCameraActive, setVideoDimensions]);

  /**
   * Starts or restarts the camera stream for the given device ID.
   */
  const startCamera = useCallback(
    async (targetVideoElement?: HTMLVideoElement | null, deviceId?: string) => {
      if (!isMediaDevicesSupported()) {
        setCameraError(
          'Your browser does not support camera capture via the MediaDevices API. Please try a modern browser like Chrome, Edge, or Firefox.',
        );
        return null;
      }

      if (targetVideoElement) {
        videoRef.current = targetVideoElement;
      }

      // Stop any existing stream first
      if (streamRef.current) {
        stopMediaStream(streamRef.current);
        streamRef.current = null;
      }

      setCameraLoading(true);
      setCameraError(null);

      const targetDeviceId = deviceId || selectedCameraId;

      try {
        const constraints = getCameraConstraints(targetDeviceId || undefined);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        streamRef.current = stream;

        // If targetDeviceId wasn't explicitly chosen, find active device track ID
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings();
          if (settings.deviceId) {
            setSelectedCameraId(settings.deviceId);
          }
        }

        // Attach stream to video element if available
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Listen for metadata to capture real camera dimensions
          const handleLoadedMetadata = () => {
            if (videoRef.current) {
              setVideoDimensions({
                width: videoRef.current.videoWidth || 1280,
                height: videoRef.current.videoHeight || 720,
              });
              videoRef.current.play().catch((playErr) => {
                console.warn('[useCamera] Autoplay interrupted:', playErr);
              });
            }
          };

          videoRef.current.onloadedmetadata = handleLoadedMetadata;
        }

        setCameraActive(true);
        setCameraLoading(false);

        // Update device list once permission is granted (to retrieve real device labels)
        await refreshDevices();

        return stream;
      } catch (err) {
        const friendlyMessage = formatCameraError(err);
        setCameraError(friendlyMessage);
        setCameraLoading(false);
        stopCamera();
        return null;
      }
    },
    [
      selectedCameraId,
      setCameraLoading,
      setCameraError,
      setSelectedCameraId,
      setVideoDimensions,
      setCameraActive,
      refreshDevices,
      stopCamera,
    ],
  );

  /**
   * Switches to a specific camera hardware input by deviceId.
   */
  const switchCamera = useCallback(
    async (deviceId: string) => {
      setSelectedCameraId(deviceId);
      await startCamera(videoRef.current, deviceId);
    },
    [setSelectedCameraId, startCamera],
  );

  /**
   * Toggles browser fullscreen on the specified video container element.
   */
  const toggleFullscreen = useCallback(
    async (containerElement?: HTMLElement | null) => {
      const target = containerElement || videoRef.current?.parentElement || document.documentElement;

      try {
        if (!document.fullscreenElement) {
          await target.requestFullscreen();
          setIsFullscreen(true);
        } else {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      } catch (err) {
        console.warn('[useCamera] Fullscreen request failed:', err);
      }
    },
    [setIsFullscreen],
  );

  // Sync fullscreen change events (e.g. user pressing ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  // Listen to physical device changes (connecting/disconnecting webcams)
  useEffect(() => {
    if (!isMediaDevicesSupported() || typeof navigator.mediaDevices.addEventListener !== 'function') {
      return;
    }

    const handleDeviceChange = () => {
      refreshDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    // Initial device list scan
    refreshDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [refreshDevices]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
      resetCameraState();
    };
  }, [stopCamera, resetCameraState]);

  return {
    videoRef,
    streamRef,
    isActive: cameraActive,
    isLoading: cameraLoading,
    error: cameraError,
    status: cameraStatus,
    devices: availableDevices,
    selectedDeviceId: selectedCameraId,
    isMirrored,
    videoDimensions,
    isFullscreen,
    startCamera,
    stopCamera,
    switchCamera,
    refreshDevices,
    toggleMirror,
    toggleFullscreen,
  };
}
