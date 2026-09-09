import { motion } from 'framer-motion';
import { Mic, MicOff, EyeOff, Eye, Sliders, Zap, Cpu } from 'lucide-react';
import { useClapCamStore } from '@/store/useClapCamStore';
import type { EffectMode } from '@/types';

interface ControlPanelProps {
  onStartMic: () => void;
  onStopMic: () => void;
}

const EFFECT_MODES: { mode: EffectMode; label: string; color: string; description: string }[] = [
  {
    mode: 'invisible',
    label: 'Invisible',
    color: 'accent-cyan',
    description: 'Replace with clean plate',
  },
  {
    mode: 'ghost',
    label: 'Ghost',
    color: 'accent-purple',
    description: 'Semi-transparent overlay',
  },
  {
    mode: 'pixel',
    label: 'Pixelate',
    color: 'accent-pink',
    description: 'Mosaic censorship effect',
  },
  {
    mode: 'glitch',
    label: 'Glitch',
    color: 'accent-green',
    description: 'RGB split distortion',
  },
];

/**
 * Control panel for:
 * - Enabling / disabling the microphone (clap detection arm)
 * - Toggling manual invisibility override
 * - Selecting the active effect mode
 * - Adjusting clap detection sensitivity
 */
export function ControlPanel({ onStartMic, onStopMic }: ControlPanelProps) {
  const micActive = useClapCamStore((s) => s.micActive);
  const micLoading = useClapCamStore((s) => s.micLoading);
  const micError = useClapCamStore((s) => s.micError);
  const isInvisible = useClapCamStore((s) => s.isInvisible);
  const isCalibrated = useClapCamStore((s) => s.isCalibrated);
  const modelLoaded = useClapCamStore((s) => s.modelLoaded);
  const effectMode = useClapCamStore((s) => s.effectMode);
  const clapConfig = useClapCamStore((s) => s.clapConfig);
  const setEffectMode = useClapCamStore((s) => s.setEffectMode);
  const toggleInvisibility = useClapCamStore((s) => s.toggleInvisibility);
  const setClapConfig = useClapCamStore((s) => s.setClapConfig);

  const canActivateMic = isCalibrated;

  return (
    <div className="glass rounded-2xl border border-glass-border shadow-xl overflow-hidden max-w-5xl mx-auto">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-white/5 flex items-center gap-2 font-mono text-xs">
        <Sliders className="w-4 h-4 text-accent-cyan" />
        <span className="text-white font-bold uppercase tracking-wider">Effect Controls</span>
        <span className="ml-auto text-gray-500">Phase 5 · AI Compositor Active</span>
      </div>

      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* ── Column 1: Mic & Clap Arm ─────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">
            Clap Detection
          </div>

          {/* Mic Toggle */}
          <motion.button
            onClick={micActive ? onStopMic : onStartMic}
            disabled={!canActivateMic || micLoading}
            whileTap={{ scale: 0.97 }}
            className={`w-full px-4 py-3 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              micActive
                ? 'bg-accent-purple/15 border border-accent-purple/40 text-accent-purple shadow-[0_0_18px_rgba(139,92,246,0.25)]'
                : 'glass-strong border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {micActive ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Disarm Mic</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>{micLoading ? 'Requesting...' : 'Arm Mic'}</span>
              </>
            )}
          </motion.button>

          {!canActivateMic && (
            <p className="text-[10px] font-mono text-gray-500 text-center">
              Calibrate background first
            </p>
          )}

          {micError && (
            <p className="text-[10px] font-mono text-red-400 text-center leading-snug">
              ⚠ {micError}
            </p>
          )}

          {/* Manual Invisibility Override */}
          <div className="mt-1">
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">
              Manual Override
            </div>
            <motion.button
              onClick={toggleInvisibility}
              disabled={!isCalibrated || !modelLoaded}
              whileTap={{ scale: 0.97 }}
              className={`w-full px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isInvisible
                  ? 'bg-accent-pink/15 border border-accent-pink/40 text-accent-pink'
                  : 'glass border border-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {isInvisible ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reappear</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Go Invisible</span>
                </>
              )}
            </motion.button>
            {!modelLoaded && isCalibrated && (
              <p className="text-[10px] font-mono text-gray-500 text-center mt-1">
                <Cpu className="w-2.5 h-2.5 inline mr-1 animate-pulse text-accent-purple" />
                Model loading…
              </p>
            )}
          </div>
        </div>

        {/* ── Column 2: Effect Mode Selector ───────────────────────── */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">
            Effect Mode
          </div>
          {EFFECT_MODES.map(({ mode, label, color, description }) => {
            const isSelected = effectMode === mode;
            return (
              <motion.button
                key={mode}
                onClick={() => setEffectMode(mode)}
                whileTap={{ scale: 0.97 }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? `bg-${color}/10 border border-${color}/40 text-${color} shadow-[0_0_12px_rgba(0,240,255,0.1)]`
                    : 'glass border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? `bg-${color}` : 'bg-gray-600'
                    }`}
                  />
                  <span className="font-semibold">{label}</span>
                </div>
                <span className={`text-[10px] ${isSelected ? 'opacity-80' : 'opacity-40'}`}>
                  {description}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* ── Column 3: Sensitivity Slider ─────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">
            Clap Sensitivity
          </div>

          {/* Energy Threshold Slider */}
          <div className="glass rounded-xl border border-white/5 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-gray-300">
                <Zap className="w-3 h-3 text-accent-cyan" />
                <span>Energy Gate</span>
              </div>
              <span className="text-accent-cyan font-bold tabular-nums">
                {clapConfig.energyThreshold}
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={220}
              step={5}
              value={clapConfig.energyThreshold}
              onChange={(e) => setClapConfig({ energyThreshold: Number(e.target.value) })}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-cyan-400 bg-white/10"
              title="Lower = more sensitive, Higher = less sensitive"
            />
            <div className="flex justify-between text-[9px] text-gray-600">
              <span>Sensitive</span>
              <span>Strict</span>
            </div>
          </div>

          {/* Cooldown Slider */}
          <div className="glass rounded-xl border border-white/5 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-gray-300">Cooldown</span>
              <span className="text-accent-purple font-bold tabular-nums">
                {clapConfig.cooldownMs}ms
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={2000}
              step={100}
              value={clapConfig.cooldownMs}
              onChange={(e) => setClapConfig({ cooldownMs: Number(e.target.value) })}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-purple-400 bg-white/10"
              title="Minimum time between clap triggers"
            />
            <div className="flex justify-between text-[9px] text-gray-600">
              <span>Fast (300ms)</span>
              <span>Slow (2s)</span>
            </div>
          </div>

          {/* Consecutive Frames */}
          <div className="glass rounded-xl border border-white/5 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-gray-300">Confirm Frames</span>
              <span className="text-accent-green font-bold tabular-nums">
                {clapConfig.consecutiveFrames}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={clapConfig.consecutiveFrames}
              onChange={(e) => setClapConfig({ consecutiveFrames: Number(e.target.value) })}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-green-400 bg-white/10"
              title="Frames above threshold needed to confirm a clap"
            />
            <div className="flex justify-between text-[9px] text-gray-600">
              <span>1 frame</span>
              <span>5 frames</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
