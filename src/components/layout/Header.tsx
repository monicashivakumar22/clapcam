import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export function Header() {
  return (
    <header className="relative z-20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-glow">
              <Eye className="w-5 h-5 text-void" strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple opacity-40 blur-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              ClapCam<span className="text-gradient"> AI</span>
            </h1>
            <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">
              Invisibility Engine
            </p>
          </div>
        </motion.div>

        {/* Status badges */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-xs font-mono text-gray-400">Local Processing</span>
          </div>
          <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
            <span className="text-xs font-mono text-gray-400">MediaPipe</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
