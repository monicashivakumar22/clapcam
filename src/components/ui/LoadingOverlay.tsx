import { motion } from 'framer-motion';
import { Cpu, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function LoadingOverlay() {
  const progress = useAppStore((s) => s.modelLoadProgress);

  return (
    <div className="flex flex-col items-center gap-6 py-12">
      {/* Animated icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center">
          <Cpu className="w-8 h-8 text-accent-cyan" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1 -right-1"
        >
          <Loader2 className="w-5 h-5 text-accent-purple" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-1">
          Initializing <span className="text-gradient">AI Engine</span>
        </h2>
        <p className="text-sm text-gray-500 font-mono">
          Loading MediaPipe segmentation model...
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64">
        <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-xs text-gray-600 font-mono mt-2 text-center">
          {progress}% complete
        </p>
      </div>

      {/* Privacy notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-[11px] text-gray-600 font-mono max-w-xs text-center"
      >
        All processing happens locally on your device. No data leaves your browser.
      </motion.p>
    </div>
  );
}
