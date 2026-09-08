import { AlertCircle, Loader2, PowerOff } from 'lucide-react';
import type { CameraStatusType } from '@/types/camera';

interface CameraStatusProps {
  status: CameraStatusType;
  resolution?: { width: number; height: number } | null;
  className?: string;
}

export function CameraStatus({ status, resolution, className = '' }: CameraStatusProps) {
  switch (status) {
    case 'active':
      return (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/30 text-accent-green font-mono text-xs ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="font-semibold uppercase tracking-wider">LIVE</span>
          {resolution && (
            <span className="text-gray-300 font-normal">
              &bull; {resolution.width} &times; {resolution.height}
            </span>
          )}
        </div>
      );

    case 'starting':
      return (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan font-mono text-xs ${className}`}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className="font-medium">Initializing Stream...</span>
        </div>
      );

    case 'error':
      return (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="font-medium">Camera Error</span>
        </div>
      );

    case 'off':
    default:
      return (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light border border-white/5 text-gray-400 font-mono text-xs ${className}`}
        >
          <PowerOff className="w-3.5 h-3.5" />
          <span>Camera Standby</span>
        </div>
      );
  }
}
