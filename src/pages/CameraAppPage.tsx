import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, ShieldCheck, CheckCircle2, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClapCamStore } from '@/store/useClapCamStore';
import { useCamera } from '@/hooks/useCamera';
import { useBackgroundCalibration } from '@/hooks/useBackgroundCalibration';
import { useInvisibilityEffect } from '@/hooks/useInvisibilityEffect';
import { useClapDetection } from '@/hooks/useClapDetection';
import { CameraView } from '@/components/camera/CameraView';
import { CameraControls } from '@/components/camera/CameraControls';
import { CameraStatus } from '@/components/camera/CameraStatus';
import { CameraSystemStatus } from '@/components/camera/CameraSystemStatus';
import { CalibrationScreen } from '@/components/calibration/CalibrationScreen';
import { CalibrationCountdown } from '@/components/calibration/CalibrationCountdown';
import { BackgroundPreview } from '@/components/calibration/BackgroundPreview';
import { ControlPanel } from '@/components/controls/ControlPanel';
import { StatusBar } from '@/components/controls/StatusBar';

export function CameraAppPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const { modelLoaded } = useInvisibilityEffect(videoRef, canvasRef);

  const { startDetection, stopDetection } = useClapDetection();

  const isInvisible = useClapCamStore((s) => s.isInvisible);
  const micActive = useClapCamStore((s) => s.micActive);
  const clapPulseActive = useClapCamStore((s) => s.clapPulseActive);

  const handleBackToHome = () => {
    stopDetection();
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
      stopDetection();
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
      {/* ── Ambient Background Glows ────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-accent-cyan/10 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-accent-purple/10 blur-[140px]" />
        {/* Invisibility active glow */}
        <AnimatePresence>
          {isInvisible && (
            <motion.div
              key="invisible-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-accent-pink/5 blur-3xl"
            />
          )}
        </AnimatePresence>
        {/* Clap pulse ring */}
        <AnimatePresence>
          {clapPulseActive && (
            <motion.div
              key="clap-ring"
              initial={{ opacity: 0.6, scale: 0.9 }}
              animate={{ opacity: 0, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-accent-cyan/40"
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Top Header ──────────────────────────────────────────────────── */}
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

            {/* Invisible active badge */}
            <AnimatePresence>
              {isInvisible && (
                <motion.div
                  key="invisible-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-pink/15 border border-accent-pink/40 text-accent-pink font-mono text-xs font-bold"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>INVISIBLE</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-light border border-white/5 text-xs font-mono text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
              <span>Air-Gapped Privacy</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Studio Viewport ─────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">
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
              <span>Studio Workspace &bull; ClapCam AI</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Real-Time Invisibility Engine
            </h1>
          </div>

          <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
            {isActive ? (
              <span className="text-accent-green font-semibold">
                ● Streaming Live
              </span>
            ) : (
              <span>Standby Mode</span>
            )}
          </div>
        </motion.div>

        {/* Live Video Viewport + Overlays */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full flex flex-col items-center relative"
        >
          <div className="relative w-full max-w-5xl">
            {/* Canvas invisibility glow frame */}
            <AnimatePresence>
              {isInvisible && (
                <motion.div
                  key="canvas-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl ring-2 ring-accent-pink/50 shadow-[0_0_40px_rgba(236,72,153,0.2)] pointer-events-none z-10"
                />
              )}
            </AnimatePresence>

            {/* Live Camera View */}
            <CameraView
              videoRef={videoRef}
              canvasRef={canvasRef}
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

            {/* Countdown Overlay */}
            {calibrationState === 'countdown' && (
              <CalibrationCountdown
                seconds={countdownSeconds}
                onCancel={cancelCalibration}
              />
            )}

            {/* Background Verification Preview */}
            {calibrationState === 'preview' && capturedBackground && (
              <BackgroundPreview
                background={capturedBackground}
                onAccept={acceptBackground}
                onRetake={retakeCalibration}
              />
            )}
          </div>
        </motion.div>

        {/* Real-Time Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <StatusBar />
        </motion.div>

        {/* Calibration Controls */}
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

        {/* Phase 5: Effect ControlPanel — Mic, Mode Selector, Sensitivity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="w-full"
        >
          <ControlPanel
            onStartMic={startDetection}
            onStopMic={stopDetection}
          />
        </motion.div>

        {/* Camera Hardware Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
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

        {/* Diagnostic Telemetry Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="w-full max-w-5xl mx-auto"
        >
          <CameraSystemStatus
            cameraStatus={status}
            resolution={videoDimensions}
            activeDeviceLabel={selectedDevice?.label}
            isCalibrated={isCalibrated}
            capturedBackground={capturedBackground}
            modelLoaded={modelLoaded}
            micActive={micActive}
            isInvisible={isInvisible}
          />
        </motion.div>
      </main>

      {/* ── Studio Footer ────────────────────────────────────────────────── */}
      <footer className="relative z-20 py-4 text-center text-xs font-mono text-gray-500 border-t border-glass-border bg-void/80">
        ClapCam AI &bull; All Processing Local &bull; Zero Server Storage &bull; Clap to Disappear
      </footer>
    </div>
  );
}
