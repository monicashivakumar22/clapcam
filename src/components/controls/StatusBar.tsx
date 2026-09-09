import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Mic, Cpu, Clock } from 'lucide-react';
import { useClapCamStore } from '@/store/useClapCamStore';

/**
 * Real-time telemetry status bar.
 * Displays: FPS counter, segmentation latency, render latency,
 * clap pulse flash, audio frequency bars, and mic/model status.
 */
export function StatusBar() {
  const performance = useClapCamStore((s) => s.performance);
  const micActive = useClapCamStore((s) => s.micActive);
  const modelLoaded = useClapCamStore((s) => s.modelLoaded);
  const modelLoading = useClapCamStore((s) => s.modelLoading);
  const modelLoadProgress = useClapCamStore((s) => s.modelLoadProgress);
  const clapPulseActive = useClapCamStore((s) => s.clapPulseActive);
  const isInvisible = useClapCamStore((s) => s.isInvisible);
  const audioFrequencyBars = useClapCamStore((s) => s.audioFrequencyBars);
  const cameraActive = useClapCamStore((s) => s.cameraActive);

  const { fps, segmentationMs, renderMs } = performance;

  const fpsColor =
    fps >= 25 ? 'text-accent-green' : fps >= 15 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl glass border border-glass-border shadow-xl font-mono text-[11px] max-w-5xl mx-auto">
      {/* Left: FPS + Latency */}
      <div className="flex items-center gap-4">
        {/* FPS Counter */}
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="text-gray-400">FPS</span>
          <span className={`font-bold tabular-nums ${cameraActive ? fpsColor : 'text-gray-500'}`}>
            {cameraActive ? fps : '—'}
          </span>
        </div>

        {/* Segmentation Latency */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-accent-purple" />
          <span className="text-gray-400">Seg</span>
          <span className={`font-bold tabular-nums ${modelLoaded ? 'text-accent-purple' : 'text-gray-500'}`}>
            {modelLoaded ? `${segmentationMs.toFixed(1)}ms` : '—'}
          </span>
        </div>

        {/* Render Latency */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-accent-pink" />
          <span className="text-gray-400">Rnd</span>
          <span className={`font-bold tabular-nums ${modelLoaded ? 'text-accent-pink' : 'text-gray-500'}`}>
            {modelLoaded ? `${renderMs.toFixed(1)}ms` : '—'}
          </span>
        </div>
      </div>

      {/* Center: Audio Frequency Visualizer */}
      <div className="flex items-end gap-0.5 h-5">
        {audioFrequencyBars.map((height, i) => (
          <motion.div
            key={i}
            className={`w-1 rounded-full transition-colors ${
              micActive
                ? clapPulseActive
                  ? 'bg-accent-cyan'
                  : 'bg-accent-purple/70'
                : 'bg-gray-600'
            }`}
            animate={{
              height: micActive ? `${Math.max(3, (height / 255) * 20)}px` : '3px',
            }}
            transition={{ duration: 0.08, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Right: Clap Pulse + Model Status + Mic */}
      <div className="flex items-center gap-3">
        {/* Clap Detected Flash */}
        <AnimatePresence>
          {clapPulseActive && (
            <motion.div
              key="clap-pulse"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan font-bold"
            >
              <Zap className="w-3 h-3" />
              <span>CLAP!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invisibility Active Tag */}
        <AnimatePresence>
          {isInvisible && (
            <motion.div
              key="invisible-tag"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-pink/15 border border-accent-pink/40 text-accent-pink font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-pulse" />
              <span>INVISIBLE</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Model Loading Progress */}
        {modelLoading && !modelLoaded && (
          <div className="flex items-center gap-1.5 text-accent-purple">
            <Cpu className="w-3 h-3 animate-pulse" />
            <span>Model {modelLoadProgress}%</span>
          </div>
        )}

        {/* Mic Status Dot */}
        <div className="flex items-center gap-1.5">
          <Mic className={`w-3.5 h-3.5 ${micActive ? 'text-accent-purple' : 'text-gray-500'}`} />
          <span className={micActive ? 'text-accent-purple font-semibold' : 'text-gray-500'}>
            {micActive ? 'Listening' : 'Mic Off'}
          </span>
        </div>
      </div>
    </div>
  );
}
