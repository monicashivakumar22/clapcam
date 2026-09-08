import { Check, RefreshCw, Sparkles, ShieldCheck, Clock } from 'lucide-react';
import type { CapturedBackground } from '@/types/camera';

interface BackgroundPreviewProps {
  background: CapturedBackground;
  onAccept: () => void;
  onRetake: () => void;
}

export function BackgroundPreview({
  background,
  onAccept,
  onRetake,
}: BackgroundPreviewProps) {
  const timeFormatted = new Date(background.capturedAt).toLocaleTimeString();

  return (
    <div className="absolute inset-0 z-30 glass-strong bg-void/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in overflow-y-auto">
      {/* Top Banner */}
      <div className="max-w-2xl w-full flex items-center justify-between gap-2 pb-3 mb-3 border-b border-glass-border font-mono text-xs">
        <div className="flex items-center gap-2 text-accent-cyan">
          <Sparkles className="w-4 h-4" />
          <span className="font-bold">Frozen Background Reference Plate</span>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-[11px]">
          <Clock className="w-3 h-3" />
          <span>{timeFormatted}</span>
        </div>
      </div>

      {/* Captured Image Display Container */}
      <div className="relative w-full max-w-2xl aspect-video rounded-2xl bg-black border border-white/15 overflow-hidden shadow-2xl group">
        <img
          src={background.dataUrl}
          alt="Captured frozen background plate"
          className="w-full h-full object-cover"
        />

        {/* HUD Overlay Badges on Captured Image */}
        <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[11px]">
          <span className="px-2.5 py-1 rounded-md glass bg-void/80 text-accent-green font-bold border border-accent-green/30">
            FROZEN PLATE
          </span>
          <span className="px-2 py-1 rounded-md glass bg-void/80 text-gray-300 border border-white/10">
            {background.width} &times; {background.height}
          </span>
          {background.isMirrored && (
            <span className="hidden sm:inline px-2 py-1 rounded-md glass bg-void/80 text-gray-400 border border-white/10">
              Mirrored
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md glass bg-void/80 text-[10px] font-mono text-gray-300 border border-white/10">
          <ShieldCheck className="w-3 h-3 text-accent-cyan" />
          <span>Volatile Memory Only</span>
        </div>
      </div>

      {/* Verification Notice */}
      <p className="mt-4 text-xs sm:text-sm text-gray-300 font-light max-w-md">
        Verify that the frame above is completely clear of people. This frozen canvas will be swapped into person silhouettes when you clap in Phase 5.
      </p>

      {/* Action Buttons: Accept & Retake */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetake}
          className="px-5 py-2.5 rounded-xl font-mono text-xs font-semibold glass border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retake (3s Countdown)</span>
        </button>

        <button
          onClick={onAccept}
          className="px-7 py-2.5 rounded-xl font-mono text-xs font-bold text-void bg-gradient-to-r from-accent-cyan via-white to-accent-cyan bg-[length:200%_auto] hover:bg-right transition-all shadow-glow flex items-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4 text-void" strokeWidth={3} />
          <span>Accept &amp; Save Plate</span>
        </button>
      </div>
    </div>
  );
}
