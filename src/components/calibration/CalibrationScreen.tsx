import { Camera, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import type { CalibrationState, CapturedBackground } from '@/types/camera';
import { CalibrationCountdown } from './CalibrationCountdown';
import { BackgroundPreview } from './BackgroundPreview';
import { CalibrationTips } from './CalibrationTips';

interface CalibrationScreenProps {
  isCameraActive: boolean;
  isCalibrated: boolean;
  calibrationState: CalibrationState;
  countdownSeconds: number;
  capturedBackground: CapturedBackground | null;
  calibrationError: string | null;
  onStartCalibration: () => void;
  onCancelCalibration: () => void;
  onAcceptBackground: () => void;
  onRetakeCalibration: () => void;
}

export function CalibrationScreen({
  isCameraActive,
  isCalibrated,
  calibrationState,
  countdownSeconds,
  capturedBackground,
  calibrationError,
  onStartCalibration,
  onCancelCalibration,
  onAcceptBackground,
  onRetakeCalibration,
}: CalibrationScreenProps) {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
      {/* 1. Countdown Overlay (renders on top of video when countdown is running) */}
      {calibrationState === 'countdown' && (
        <CalibrationCountdown
          seconds={countdownSeconds}
          onCancel={onCancelCalibration}
        />
      )}

      {/* 2. Capturing Instant State */}
      {calibrationState === 'capturing' && (
        <div className="absolute inset-0 z-30 glass-strong bg-void/90 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-accent-cyan/20 border border-accent-cyan animate-pulse flex items-center justify-center mb-3">
            <Camera className="w-8 h-8 text-accent-cyan" />
          </div>
          <h4 className="text-lg font-bold text-white mb-1">
            Freezing Background Frame...
          </h4>
          <p className="text-xs font-mono text-gray-400">
            Reading video hardware buffer at 1:1 aspect ratio
          </p>
        </div>
      )}

      {/* 3. Verification Preview Screen */}
      {calibrationState === 'preview' && capturedBackground && (
        <BackgroundPreview
          background={capturedBackground}
          onAccept={onAcceptBackground}
          onRetake={onRetakeCalibration}
        />
      )}

      {/* 4. Calibration Management Bar (Always rendered below video in workspace) */}
      <div className="glass rounded-2xl p-4 sm:p-5 border border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Text / Badge */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isCalibrated
                ? 'bg-accent-green/15 text-accent-green border border-accent-green/30'
                : 'bg-surface-light text-gray-400 border border-white/5'
            }`}
          >
            {isCalibrated ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5 text-accent-cyan" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                {isCalibrated ? 'Clean Plate Calibrated' : 'Background Calibration'}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                  isCalibrated
                    ? 'bg-accent-green/15 text-accent-green'
                    : 'bg-accent-purple/15 text-accent-purple'
                }`}
              >
                {isCalibrated ? 'Ready for FX' : 'Required'}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              {isCalibrated && capturedBackground
                ? `Saved ${capturedBackground.width}×${capturedBackground.height} clean room frame buffer`
                : 'Step out of frame to capture an empty room plate for invisibility'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isCalibrated ? (
            <button
              onClick={onStartCalibration}
              disabled={!isCameraActive || calibrationState === 'countdown'}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono text-xs font-semibold glass border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalibrate Background</span>
            </button>
          ) : (
            <button
              onClick={onStartCalibration}
              disabled={!isCameraActive || calibrationState === 'countdown'}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-void bg-gradient-to-r from-accent-cyan via-white to-accent-cyan bg-[length:200%_auto] hover:bg-right transition-all shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 text-void fill-void" />
              <span>Start 3s Calibration</span>
            </button>
          )}
        </div>
      </div>

      {/* Error display if calibration fails */}
      {calibrationError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs flex items-center justify-between">
          <span>⚠️ {calibrationError}</span>
        </div>
      )}

      {/* Tips Guide (rendered below control panel) */}
      {!isCalibrated && isCameraActive && <CalibrationTips />}
    </div>
  );
}
