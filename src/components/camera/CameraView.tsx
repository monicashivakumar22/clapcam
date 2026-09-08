import { useEffect, useRef } from 'react';
import {
  Camera,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Lock,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { CameraDevice, CameraResolution, CameraStatusType } from '@/types/camera';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  status: CameraStatusType;
  isMirrored: boolean;
  videoDimensions: CameraResolution | null;
  devices: CameraDevice[];
  onStartCamera: () => void;
  onRetry: () => void;
}

export function CameraView({
  videoRef,
  canvasRef,
  isActive,
  isLoading,
  error,
  isMirrored,
  videoDimensions,
  devices,
  onStartCamera,
  onRetry,
}: CameraViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent default context menu or unwanted touches on video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.setAttribute('playsinline', 'true');
    }
  }, [videoRef]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-video sm:aspect-[16/9] w-full max-w-5xl mx-auto rounded-3xl bg-surface border border-glass-border shadow-2xl overflow-hidden flex items-center justify-center"
    >
      {/* 1. Actual Video Element (rendered always so ref binds) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-transform duration-200 ${
          isMirrored ? '-scale-x-100' : 'scale-x-100'
        } ${isActive && !isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* 1b. Live Compositing Overlay Canvas */}
      {/* When the invisibility effect is active, this canvas is populated by the
          compositing pipeline and covers the raw video. It is left transparent
          (cleared) otherwise so the raw feed shows through unchanged. */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
          isActive && !isLoading ? 'z-10 opacity-100' : 'opacity-0 z-0'
        }`}
      />


      {/* 2. Top HUD Overlay (Active Stream State) */}
      {isActive && !isLoading && !error && (
        <>
          {/* Top-Left: LIVE & Resolution HUD */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass bg-void/80 border border-accent-green/30 text-accent-green font-mono text-xs shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="font-bold tracking-wider">LIVE</span>
            </div>

            {videoDimensions && (
              <div className="px-3 py-1 rounded-full glass bg-void/80 border border-white/10 text-gray-300 font-mono text-xs">
                {videoDimensions.width} &times; {videoDimensions.height}
              </div>
            )}

            {isMirrored && (
              <div className="hidden sm:block px-2.5 py-1 rounded-full glass bg-void/80 border border-white/10 text-gray-400 font-mono text-[11px]">
                Mirrored
              </div>
            )}
          </div>

          {/* Top-Right: Privacy Reassurance Badge */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass bg-void/80 border border-accent-cyan/30 text-accent-cyan font-mono text-xs shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Local Stream &bull; 0 KB Sent</span>
            </div>
          </div>
        </>
      )}

      {/* 3. Permission / Enable Camera Interstitial Screen */}
      {!isActive && !isLoading && !error && (
        <div className="absolute inset-0 z-20 glass-strong bg-void/90 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 flex items-center justify-center shadow-glow mb-5">
            <Camera className="w-10 h-10 text-accent-cyan" />
          </div>

          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            Camera Access Required
          </h3>

          <p className="mt-2 text-sm text-gray-300 max-w-md font-light leading-relaxed">
            ClapCam AI processes video frames locally in your browser. Click below to grant camera access and start the real-time feed.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onStartCamera}
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-void bg-gradient-to-r from-accent-cyan via-white to-accent-cyan bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-glow flex items-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-void fill-void" />
              <span>Enable Camera Feed</span>
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-mono text-gray-400">
            <Lock className="w-3.5 h-3.5 text-accent-green" />
            <span>100% In-Memory Sandbox &bull; No Video Ever Leaves Your Device</span>
          </div>

          {devices.length > 0 && (
            <div className="mt-4 text-[11px] font-mono text-gray-500">
              {devices.length} video hardware {devices.length === 1 ? 'device' : 'devices'} detected
            </div>
          )}
        </div>
      )}

      {/* 4. Loading / Initializing Stream Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-20 glass-strong bg-void/90 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-light border border-white/10 flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
          </div>
          <h4 className="text-lg font-bold text-white mb-1">
            Negotiating Hardware Stream
          </h4>
          <p className="text-xs font-mono text-gray-400">
            Requesting MediaDevices video track (1280 &times; 720 ideal)...
          </p>
        </div>
      )}

      {/* 5. Error Recovery Screen */}
      {error && !isLoading && (
        <div className="absolute inset-0 z-20 glass-strong bg-void/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          <h4 className="text-lg font-bold text-white mb-2">
            Camera Connection Failed
          </h4>

          <p className="text-xs sm:text-sm text-red-300/90 font-mono max-w-lg mb-6 leading-relaxed bg-red-950/30 p-3 rounded-xl border border-red-500/20">
            {error}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              className="px-6 py-2.5 rounded-xl text-xs font-bold font-mono text-void bg-accent-cyan shadow-glow flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Permission</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
