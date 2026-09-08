import { useRef, useCallback, useEffect } from 'react';
import { useClapCamStore } from '@/store/useClapCamStore';
import { captureVideoFrame } from '@/utils/canvasUtils';

export function useBackgroundCalibration(
  videoRef: React.RefObject<HTMLVideoElement | null>,
) {
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    cameraActive,
    isMirrored,
    isCalibrated,
    calibrationState,
    countdownSeconds,
    capturedBackground,
    calibrationError,
    startCalibration,
    setCountdownSeconds,
    setCalibrationState,
    setCapturedBackground,
    acceptBackground,
    retakeCalibration,
    resetCalibration,
    setCalibrationError,
  } = useClapCamStore();

  const clearTimer = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  /**
   * Captures the current video frame as a frozen clean background plate.
   */
  const captureFrameNow = useCallback(async () => {
    clearTimer();
    setCalibrationState('capturing');

    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      setCalibrationError(
        'Video feed is not ready. Please ensure your camera is active and transmitting video frames.',
      );
      return;
    }

    try {
      const result = await captureVideoFrame(video, isMirrored);

      if (result) {
        setCapturedBackground(result);
      } else {
        setCalibrationError(
          'Failed to capture clean background frame. Please retry calibration.',
        );
      }
    } catch (err) {
      console.error('[useBackgroundCalibration] Capture error:', err);
      setCalibrationError('Unexpected error during frame capture.');
    }
  }, [
    videoRef,
    isMirrored,
    clearTimer,
    setCalibrationState,
    setCapturedBackground,
    setCalibrationError,
  ]);

  /**
   * Begins the 3-second calibration countdown.
   */
  const handleStart = useCallback(() => {
    if (!cameraActive) {
      setCalibrationError('Please start the camera before initiating calibration.');
      return;
    }

    clearTimer();
    startCalibration();

    let count = 3;
    setCountdownSeconds(count);

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      setCountdownSeconds(count);

      if (count <= 0) {
        clearTimer();
        captureFrameNow();
      }
    }, 1000);
  }, [
    cameraActive,
    clearTimer,
    startCalibration,
    setCountdownSeconds,
    captureFrameNow,
    setCalibrationError,
  ]);

  /**
   * Cancels the active countdown and returns to idle.
   */
  const handleCancel = useCallback(() => {
    clearTimer();
    resetCalibration();
  }, [clearTimer, resetCalibration]);

  /**
   * Retakes the calibration with a fresh 3-second countdown.
   */
  const handleRetake = useCallback(() => {
    clearTimer();
    retakeCalibration();

    let count = 3;
    setCountdownSeconds(count);

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      setCountdownSeconds(count);

      if (count <= 0) {
        clearTimer();
        captureFrameNow();
      }
    }, 1000);
  }, [clearTimer, retakeCalibration, setCountdownSeconds, captureFrameNow]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    isCalibrated,
    calibrationState,
    countdownSeconds,
    capturedBackground,
    calibrationError,
    startCalibration: handleStart,
    cancelCalibration: handleCancel,
    acceptBackground,
    retakeCalibration: handleRetake,
    resetCalibration,
  };
}
