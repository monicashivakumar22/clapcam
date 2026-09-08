import { useState, useRef, useEffect } from 'react';
import {
  Video,
  VideoOff,
  FlipHorizontal,
  Maximize2,
  Minimize2,
  RefreshCw,
  ChevronUp,
  Check,
} from 'lucide-react';
import type { CameraDevice } from '@/types/camera';

interface CameraControlsProps {
  isActive: boolean;
  isLoading: boolean;
  isMirrored: boolean;
  isFullscreen: boolean;
  devices: CameraDevice[];
  selectedDeviceId: string;
  onTogglePower: () => void;
  onToggleMirror: () => void;
  onToggleFullscreen: () => void;
  onSelectDevice: (deviceId: string) => void;
  onRefreshDevices: () => void;
}

export function CameraControls({
  isActive,
  isLoading,
  isMirrored,
  isFullscreen,
  devices,
  selectedDeviceId,
  onTogglePower,
  onToggleMirror,
  onToggleFullscreen,
  onSelectDevice,
  onRefreshDevices,
}: CameraControlsProps) {
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDeviceDropdownOpen(false);
      }
    };

    if (deviceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [deviceDropdownOpen]);

  const selectedDevice = devices.find((d) => d.deviceId === selectedDeviceId);

  return (
    <div className="relative z-20 flex flex-wrap items-center justify-center gap-3 p-3 rounded-2xl glass-strong border border-glass-border shadow-2xl max-w-2xl mx-auto">
      {/* Power Toggle Button */}
      <button
        onClick={onTogglePower}
        disabled={isLoading}
        className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
          isActive
            ? 'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25'
            : 'bg-gradient-to-r from-accent-cyan via-white to-accent-cyan bg-[length:200%_auto] text-void font-bold shadow-glow hover:bg-right'
        }`}
        title={isActive ? 'Turn camera off' : 'Turn camera on'}
      >
        {isActive ? (
          <>
            <VideoOff className="w-4 h-4 text-red-400" />
            <span>Stop Camera</span>
          </>
        ) : (
          <>
            <Video className="w-4 h-4 text-void" />
            <span>{isLoading ? 'Starting...' : 'Start Camera'}</span>
          </>
        )}
      </button>

      {/* Mirror Mode Toggle */}
      <button
        onClick={onToggleMirror}
        disabled={!isActive}
        className={`px-4 py-2.5 rounded-xl font-mono text-xs flex items-center gap-2 border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
          isMirrored
            ? 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan shadow-[0_0_12px_rgba(0,240,255,0.2)]'
            : 'glass border-white/5 text-gray-300 hover:bg-white/10'
        }`}
        title={isMirrored ? 'Mirroring active (CSS horizontal flip)' : 'Click to enable mirror mode'}
      >
        <FlipHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">Mirror</span>
      </button>

      {/* Camera Device Switcher Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => {
            onRefreshDevices();
            setDeviceDropdownOpen(!deviceDropdownOpen);
          }}
          disabled={!isActive || devices.length <= 1}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs flex items-center gap-2 glass border border-white/5 text-gray-300 hover:bg-white/10 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            deviceDropdownOpen ? 'border-accent-cyan/40 text-accent-cyan' : ''
          }`}
          title="Switch video input device"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="max-w-[120px] sm:max-w-[160px] truncate">
            {selectedDevice ? selectedDevice.label : 'Select Camera'}
          </span>
          <ChevronUp
            className={`w-3.5 h-3.5 transition-transform ${deviceDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Device Dropdown Menu */}
        {deviceDropdownOpen && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 sm:w-72 rounded-2xl glass-strong border border-glass-border p-2 shadow-2xl z-50 animate-fade-in">
            <div className="px-3 py-2 text-[10px] font-mono text-gray-400 uppercase tracking-wider border-b border-white/5">
              Available Video Inputs ({devices.length})
            </div>

            <div className="flex flex-col gap-1 mt-1 max-h-48 overflow-y-auto">
              {devices.length === 0 ? (
                <div className="p-3 text-xs text-gray-400 text-center font-mono">
                  No cameras discovered
                </div>
              ) : (
                devices.map((device, idx) => {
                  const isSelected =
                    device.deviceId === selectedDeviceId ||
                    (!selectedDeviceId && idx === 0);

                  return (
                    <button
                      key={device.deviceId || idx}
                      onClick={() => {
                        onSelectDevice(device.deviceId);
                        setDeviceDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-accent-cyan/15 text-accent-cyan font-bold'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="truncate mr-2">{device.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Toggle */}
      <button
        onClick={onToggleFullscreen}
        disabled={!isActive}
        className="p-2.5 rounded-xl glass border border-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
