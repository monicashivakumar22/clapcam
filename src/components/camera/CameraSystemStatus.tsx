import { Camera, Mic, Cpu, Sparkles, ShieldCheck, HardDrive, CheckCircle2 } from 'lucide-react';
import type { CameraResolution, CameraStatusType, CapturedBackground } from '@/types/camera';

interface CameraSystemStatusProps {
  cameraStatus: CameraStatusType;
  resolution: CameraResolution | null;
  activeDeviceLabel?: string;
  isCalibrated?: boolean;
  capturedBackground?: CapturedBackground | null;
}

export function CameraSystemStatus({
  cameraStatus,
  resolution,
  activeDeviceLabel,
  isCalibrated = false,
  capturedBackground,
}: CameraSystemStatusProps) {
  const isCameraLive = cameraStatus === 'active';

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 border border-glass-border shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/5 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isCameraLive ? 'bg-accent-green animate-pulse' : 'bg-gray-500'
            }`}
          />
          <span className="text-white font-bold uppercase tracking-wider">
            Workspace Subsystem Telemetry
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Local Device Memory Sandbox</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        {/* 1. Camera System */}
        <div className="p-3.5 rounded-xl bg-surface/60 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Camera className="w-4 h-4 text-accent-cyan" />
              <span>Camera Stream</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                isCameraLive
                  ? 'bg-accent-green/15 text-accent-green border border-accent-green/30'
                  : 'bg-surface-light text-gray-400'
              }`}
            >
              {cameraStatus}
            </span>
          </div>

          <div className="text-[11px] text-gray-400 truncate">
            {isCameraLive && resolution
              ? `${resolution.width}×${resolution.height} @ 30-60fps`
              : 'Awaiting User Trigger'}
          </div>

          {activeDeviceLabel && isCameraLive && (
            <div className="text-[10px] text-gray-500 truncate mt-1">
              {activeDeviceLabel}
            </div>
          )}
        </div>

        {/* 2. Background Calibration Plate (Phase 4 Active) */}
        <div
          className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
            isCalibrated
              ? 'bg-accent-green/5 border-accent-green/25'
              : 'bg-surface/60 border-white/5'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              {isCalibrated ? (
                <CheckCircle2 className="w-4 h-4 text-accent-green" />
              ) : (
                <HardDrive className="w-4 h-4 text-accent-purple" />
              )}
              <span>Clean Plate</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                isCalibrated
                  ? 'bg-accent-green/15 text-accent-green border border-accent-green/30'
                  : 'bg-accent-purple/10 text-accent-purple border border-accent-purple/20'
              }`}
            >
              {isCalibrated ? 'READY' : 'NOT CALIBRATED'}
            </span>
          </div>
          <div className="text-[11px] text-gray-400 truncate">
            {isCalibrated && capturedBackground
              ? `${capturedBackground.width}×${capturedBackground.height} In-Memory`
              : 'Requires 3s Calibration'}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            {isCalibrated ? 'Frozen Reference Cached' : 'Step out of frame'}
          </div>
        </div>

        {/* 3. Audio & Microphone */}
        <div className="p-3.5 rounded-xl bg-surface/60 border border-white/5 flex flex-col justify-between opacity-70">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Mic className="w-4 h-4 text-accent-purple" />
              <span>Audio &amp; Mic</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-light text-[10px] text-gray-400 font-mono">
              Phase 5
            </span>
          </div>
          <div className="text-[11px] text-gray-400">Web Audio AnalyserNode</div>
          <div className="text-[10px] text-gray-500 mt-1">Standby &bull; Not Initialized</div>
        </div>

        {/* 4. MediaPipe Vision & FX Compositor */}
        <div className="p-3.5 rounded-xl bg-surface/60 border border-white/5 flex flex-col justify-between opacity-70">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Cpu className="w-4 h-4 text-accent-pink" />
              <span>Vision &amp; FX</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-light text-[10px] text-gray-400 font-mono">
              Phase 5
            </span>
          </div>
          <div className="text-[11px] text-gray-400">MediaPipe GPU Delegate</div>
          <div className="text-[10px] text-gray-500 mt-1">Standby &bull; Not Initialized</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gray-500">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Volatile In-Memory Clean Plate Storage &bull; Zero Disk/Cloud Persistence</span>
        </div>
        <div>Local Browser Pipeline</div>
      </div>
    </div>
  );
}
