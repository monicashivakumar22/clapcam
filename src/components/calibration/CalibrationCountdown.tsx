import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';

interface CalibrationCountdownProps {
  seconds: number;
  onCancel: () => void;
}

export function CalibrationCountdown({ seconds, onCancel }: CalibrationCountdownProps) {
  const totalSeconds = 3;
  const progress = ((totalSeconds - seconds + 1) / totalSeconds) * 100;

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-30 glass-strong bg-void/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in"
    >
      {/* Top Banner Notice */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-accent-cyan px-3 py-1 rounded-full glass border border-accent-cyan/30">
          <Camera className="w-3.5 h-3.5 animate-pulse" />
          <span>Capturing Clean Plate</span>
        </div>

        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-gray-400 hover:text-white px-3 py-1 rounded-full glass hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>
      </div>

      {/* Main Countdown Visual Ring & Number */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center my-4">
        {/* SVG Circular Progress Ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-surface-light"
            strokeWidth="6"
            fill="transparent"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-accent-cyan"
            strokeWidth="6"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray="264"
            animate={{
              strokeDashoffset: 264 - (264 * progress) / 100,
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>

        {/* Pulsing Center Digit */}
        <motion.div
          key={seconds}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
        >
          <span className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-accent-cyan to-accent-purple font-mono drop-shadow-glow">
            {seconds > 0 ? seconds : '📸'}
          </span>
          <span className="text-[11px] font-mono text-gray-300 uppercase tracking-widest mt-1">
            {seconds > 0 ? 'Seconds' : 'Smile!'}
          </span>
        </motion.div>
      </div>

      {/* Action Instruction */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-sm"
      >
        <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
          Step Completely Out of Frame
        </h4>
        <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
          Ensure the camera sees only your empty room so the background reference plate is 100% clean.
        </p>
      </motion.div>
    </div>
  );
}
