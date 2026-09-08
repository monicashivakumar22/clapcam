import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '@/hooks/useCamera';
import { useBackgroundCalibration } from '@/hooks/useBackgroundCalibration';
import { CameraView } from '@/components/camera/CameraView';
import { CameraControls } from '@/components/camera/CameraControls';
import { CameraStatus } from '@/components/camera/CameraStatus';
import { CameraSystemStatus } from '@/components/camera/CameraSystemStatus';
import { CalibrationScreen } from '@/components/calibration/CalibrationScreen';
import { CalibrationCountdown } from '@/components/calibration/CalibrationCountdown';
import { BackgroundPreview } from '@/components/calibration/BackgroundPreview';

export function CameraAppPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    videoRef,
    isActive,
    isLoading,
    error,
    status,
    devices,
    selectedDeviceId,
    isMirrored,
    videoDimensions,
    isFullscreen,
    startCamera,
    stopCamera,
    switchCamera,
    refreshDevices,
    toggleMirror,
    toggleFullscreen,
  } = useCamera();

  const {
    isCalibrated,
    calibrationState,
    countdownSeconds,
    capturedBackground,
    calibrationError,
    startCalibration,
    cancelCalibration,
    acceptBackground,
    retakeCalibration,
  } = useBackgroundCalibration(videoRef);

  const handleBackToHome = () => {
    stopCamera();
    navigate('/');
  };

  const handleStartCamera = async () => {
    if (videoRef.current) {
      await startCamera(videoRef.current);
    }
  };

  const handleTogglePower = async () => {
    if (isActive) {
      stopCamera();
    } else if (videoRef.current) {
      await startCamera(videoRef.current);
    }
  };

  const selectedDevice = devices.find((d) => d.deviceId === selectedDeviceId);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-void text-white flex flex-col justify-between relative overflow-x-hidden font-sans selection:bg-accent-cyan/20 selection:text-accent-cyan"
    >
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-accent-cyan/10 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-accent-purple/10 blur-[140px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 px-4 sm:px-6 py-4 border-b border-glass-border bg-void/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-xs font-mono text-gray-300 hover:text-accent-cyan transition-colors px-3 py-1.5 rounded-xl glass hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>&larr; Return to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <CameraStatus status={status} resolution={videoDimensions} />

            {isCalibrated && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/30 text-accent-green font-mono text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Plate Calibrated</span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-light border border-white/5 text-xs font-mono text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
              <span>Air-Gapped Privacy</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Center Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center gap-6">
        {/* Workspace Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-cyan mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Workspace &bull; Phase 4 Calibration</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Real-Time Feed &amp; Clean Plate Capture
            </h1>
          </div>

          <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
            {isActive ? (
              <span className="text-accent-green font-semibold">
                ● Streaming Live (1:1 Frame Alignment)
              </span>
            ) : (
              <span>Standby Mode</span>
            )}
          </div>
        </motion.div>

        {/* Live Video Viewport Container with Calibration Overlays */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full flex flex-col items-center relative"
        >
          <div className="relative w-full max-w-5xl">
            {/* Live Camera View */}
            <CameraView
              videoRef={videoRef}
              isActive={isActive}
              isLoading={isLoading}
              error={error}
              status={status}
              isMirrored={isMirrored}
              videoDimensions={videoDimensions}
              devices={devices}
              onStartCamera={handleStartCamera}
              onRetry={handleStartCamera}
            />

            {/* Countdown Overlay during calibration */}
            {calibrationState === 'countdown' && (
              <CalibrationCountdown
                seconds={countdownSeconds}
                onCancel={cancelCalibration}
              />
            )}

            {/* Verification Preview Screen when frame captured */}
            {calibrationState === 'preview' && capturedBackground && (
              <BackgroundPreview
                background={capturedBackground}
                onAccept={acceptBackground}
                onRetake={retakeCalibration}
              />
            )}
          </div>
        </motion.div>

        {/* Calibration Controls Panel Bar & Tips */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full"
        >
          <CalibrationScreen
            isCameraActive={isActive}
            isCalibrated={isCalibrated}
            calibrationState={calibrationState}
            countdownSeconds={countdownSeconds}
            capturedBackground={capturedBackground}
            calibrationError={calibrationError}
            onStartCalibration={startCalibration}
            onCancelCalibration={cancelCalibration}
            onAcceptBackground={acceptBackground}
            onRetakeCalibration={retakeCalibration}
          />
        </motion.div>

        {/* Floating Bottom Camera Hardware Controls Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="w-full"
        >
          <CameraControls
            isActive={isActive}
            isLoading={isLoading}
            isMirrored={isMirrored}
            isFullscreen={isFullscreen}
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            onTogglePower={handleTogglePower}
            onToggleMirror={toggleMirror}
            onToggleFullscreen={() => toggleFullscreen(containerRef.current)}
            onSelectDevice={switchCamera}
            onRefreshDevices={refreshDevices}
          />
        </motion.div>

        {/* Diagnostic Telemetry Subsystems Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full max-w-5xl mx-auto"
        >
          <CameraSystemStatus
            cameraStatus={status}
            resolution={videoDimensions}
            activeDeviceLabel={selectedDevice?.label}
            isCalibrated={isCalibrated}
            capturedBackground={capturedBackground}
          />
        </motion.div>
      </main>

      {/* Studio Footer */}
      <footer className="relative z-20 py-4 text-center text-xs font-mono text-gray-500 border-t border-glass-border bg-void/80">
        ClapCam AI &bull; Background Calibration &bull; Zero Server Storage
      </footer>
    </div>
  );
}
