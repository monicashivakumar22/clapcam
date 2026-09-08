import { motion } from 'framer-motion';
import { Sparkles, Play, Shield, Cpu, AudioWaveform, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HERO_METRICS } from '@/data/features';

export function Hero() {
  const scrollToSimulation = () => {
    const el = document.querySelector('#simulation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.querySelector('#how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background Radial Glow & Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-accent-cyan/15 via-accent-purple/15 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-accent-purple/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Product Pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-accent-cyan/20 shadow-glow mb-8"
        >
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
          </div>
          <span className="text-xs font-mono font-medium tracking-wide text-gray-200">
            Next-Gen Real-Time Vision &bull; 100% Local Browser Engine
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-5xl mx-auto font-sans"
        >
          Clap.
          <span className="relative inline-block mx-2 sm:mx-3 px-2">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-white to-accent-purple animate-pulse">
              DISAPPEAR.
            </span>
            <span className="absolute inset-0 bg-accent-cyan/15 rounded-xl blur-xl -z-10" />
            <span className="absolute bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink opacity-80" />
          </span>
          Reappear.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
        >
          An on-device computer vision and acoustic AI engine. Step out to capture your clean background plate,
          then turn completely invisible the moment you clap.
          <span className="text-accent-cyan font-normal block sm:inline sm:ml-1">
            Zero server uploads. 100% private.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none"
        >
          <Link
            to="/camera"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm sm:text-base font-bold text-void bg-gradient-to-r from-accent-cyan via-white to-accent-cyan bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-glow flex items-center justify-center gap-3 group"
          >
            <Sparkles className="w-5 h-5 text-void fill-void" />
            <span>Start ClapCam AI</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={scrollToSimulation}
            className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm sm:text-base font-semibold text-white glass hover:bg-white/10 transition-all border border-glass-border flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Play className="w-4 h-4 text-accent-cyan fill-accent-cyan group-hover:scale-110 transition-transform" />
            <span>Interactive Demo 👏</span>
          </button>

          <button
            onClick={scrollToHowItWorks}
            className="w-full sm:w-auto px-5 py-4 rounded-xl text-xs sm:text-sm font-mono text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>See How It Works &darr;</span>
          </button>
        </motion.div>

        {/* Feature Pill Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gray-400 font-mono"
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-light/40 border border-white/5">
            <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
            <span>MediaPipe Tasks Vision</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-light/40 border border-white/5">
            <AudioWaveform className="w-3.5 h-3.5 text-accent-purple" />
            <span>Web Audio Transient Filter</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-light/40 border border-white/5">
            <Shield className="w-3.5 h-3.5 text-accent-green" />
            <span>Air-Gapped Client Runtime</span>
          </div>
        </motion.div>

        {/* Hero Performance Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto"
        >
          {HERO_METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="glass rounded-2xl p-4 sm:p-5 text-left border border-glass-border hover:border-accent-cyan/30 transition-all duration-300 group"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono group-hover:text-gradient transition-colors">
                {metric.value}
              </div>
              <div className="text-xs font-semibold text-gray-200 mt-1">
                {metric.label}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5 font-light leading-snug">
                {metric.detail}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
