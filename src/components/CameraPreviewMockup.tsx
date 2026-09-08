import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Activity,
  Layers,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useDemoStore } from '@/store/useDemoStore';
import type { EffectMode } from '@/types';

export function CameraPreviewMockup() {
  const {
    isDemoInvisible,
    demoStage,
    demoEffectMode,
    demoSpikeActive,
    triggerDemoClap,
    setDemoEffectMode,
    resetDemo,
  } = useDemoStore();

  const [simulatedAudioBars, setSimulatedAudioBars] = useState<number[]>(
    new Array(16).fill(12),
  );

  // Animate ambient audio bars + sudden spike on clap
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedAudioBars((prev) =>
        prev.map((_, i) => {
          if (demoSpikeActive) {
            // High energy spike in the 2.8kHz range (middle bars 7-11)
            if (i >= 6 && i <= 11) {
              return Math.floor(75 + Math.random() * 25);
            }
            return Math.floor(40 + Math.random() * 35);
          }
          // Ambient background noise
          const base = i >= 4 && i <= 10 ? 18 : 8;
          return Math.floor(base + Math.random() * 16);
        }),
      );
    }, 80);

    return () => clearInterval(interval);
  }, [demoSpikeActive]);

  const modes: { id: EffectMode; label: string; description: string }[] = [
    { id: 'invisible', label: 'Invisible', description: 'Clean background plate replacement' },
    { id: 'ghost', label: 'Ghost', description: 'Translucent 30% spectral overlay' },
    { id: 'pixel', label: 'Pixel', description: '8-bit dynamic mosaic blocks' },
    { id: 'glitch', label: 'Glitch', description: 'RGB chromatic aberration wave' },
  ];

  return (
    <section id="simulation" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-purple/30 text-xs font-mono text-accent-purple mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience Invisibility in Your Browser
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-300 font-light">
            Test the real-time transition cycle below. Click the clap trigger to simulate acoustic transient detection and watch the person silhouette vanish.
          </p>
        </div>

        {/* Studio Simulation Container */}
        <div className="glass-strong rounded-3xl p-4 sm:p-7 border border-glass-border shadow-2xl relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Mockup HUD Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-glass-border text-xs font-mono">
            {/* Camera Status & REC */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface/80 border border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-white font-bold text-[11px]">REC</span>
                <span className="text-gray-400 text-[10px]">1080P 60FPS</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-gray-400">
                <Activity className="w-3.5 h-3.5 text-accent-green" />
                <span>GPU Delegate: WebAssembly</span>
              </div>
            </div>

            {/* Telemetry Pills */}
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-lg bg-surface/80 border border-white/5 text-gray-300 flex items-center gap-1.5">
                <span className="text-accent-cyan font-bold">28.4ms</span>
                <span className="text-gray-500">Latency</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-surface/80 border border-white/5 text-accent-green flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Clean Plate: Cached</span>
              </div>
            </div>
          </div>

          {/* Main Viewport Stage */}
          <div className="mt-4 relative aspect-[16/9] sm:aspect-[21/10] bg-surface rounded-2xl overflow-hidden border border-white/5 shadow-inner">
            {/* Background Plate: Stylized Minimalist Modern Studio */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e18] via-[#121224] to-[#0a0a14]">
              {/* Studio Grid & Room Ambience */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-70" />
              
              {/* Studio Wall Elements: Floating Shelf & Neon Light Bar */}
              <div className="absolute top-8 left-12 w-48 h-1.5 bg-accent-purple/30 rounded-full blur-[1px]" />
              <div className="absolute top-10 left-12 w-40 h-0.5 bg-accent-cyan/40 rounded-full" />
              
              {/* Decorative Studio Plants & Desk Shapes */}
              <div className="absolute bottom-0 left-8 w-24 h-40 bg-surface-light/40 rounded-t-2xl border-t border-l border-white/5" />
              <div className="absolute bottom-0 right-12 w-32 h-48 bg-surface-light/30 rounded-t-2xl border-t border-r border-white/5" />
              
              {/* Studio Window Glow */}
              <div className="absolute top-6 right-20 w-44 h-36 rounded-xl bg-gradient-to-br from-accent-cyan/10 to-transparent border border-white/5" />

              {/* Floor Perspective Line */}
              <div className="absolute bottom-12 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Subject / Person Silhouette Layer */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                {!isDemoInvisible && (
                  <motion.div
                    key="person-subject"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: demoEffectMode === 'ghost' ? 0.35 : 1,
                      scale: 1,
                      filter:
                        demoStage === 'glitching'
                          ? 'drop-shadow(3px 0px 0px #00f0ff) drop-shadow(-3px 0px 0px #ec4899) hue-rotate(90deg)'
                          : demoEffectMode === 'glitch'
                          ? 'drop-shadow(2px 0px 0px #00f0ff) drop-shadow(-2px 0px 0px #ec4899)'
                          : demoEffectMode === 'ghost'
                          ? 'drop-shadow(0 0 15px rgba(0,240,255,0.4))'
                          : 'none',
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      filter: 'blur(12px) brightness(1.8)',
                    }}
                    transition={{ duration: 0.4 }}
                    className={`relative flex flex-col items-center justify-end h-[85%] w-64 ${
                      demoEffectMode === 'pixel' ? 'contrast-150 saturate-200' : ''
                    }`}
                  >
                    {/* Person SVG Silhouette */}
                    <svg
                      viewBox="0 0 200 300"
                      className="w-full h-full drop-shadow-2xl"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Head & Hair */}
                      <circle
                        cx="100"
                        cy="65"
                        r="32"
                        fill={demoEffectMode === 'ghost' ? '#00f0ff' : '#22223a'}
                        stroke={demoEffectMode === 'ghost' ? '#a855f7' : '#3b3b5c'}
                        strokeWidth="2"
                      />
                      {/* Headphones */}
                      <path
                        d="M 64 65 C 64 42, 136 42, 136 65"
                        stroke="#00f0ff"
                        strokeWidth="4"
                        fill="none"
                      />
                      <rect x="60" y="55" width="8" height="20" rx="3" fill="#00f0ff" />
                      <rect x="132" y="55" width="8" height="20" rx="3" fill="#00f0ff" />

                      {/* Neck & Collar */}
                      <path d="M 90 95 L 110 95 L 114 110 L 86 110 Z" fill="#1b1b2f" />

                      {/* Torso / Jacket */}
                      <path
                        d="M 50 115 C 65 105, 135 105, 150 115 L 165 240 L 35 240 Z"
                        fill={demoEffectMode === 'ghost' ? 'rgba(0,240,255,0.3)' : '#19192e'}
                        stroke={demoEffectMode === 'ghost' ? '#00f0ff' : '#2d2d48'}
                        strokeWidth="2"
                      />

                      {/* Jacket Lapels / Neon Trim */}
                      <path
                        d="M 75 112 L 100 180 L 125 112"
                        stroke="#a855f7"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <line
                        x1="100"
                        y1="180"
                        x2="100"
                        y2="240"
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />

                      {/* Arms */}
                      <path
                        d="M 50 115 L 25 210 L 45 220 L 65 150"
                        fill={demoEffectMode === 'ghost' ? 'rgba(0,240,255,0.2)' : '#161628'}
                      />
                      <path
                        d="M 150 115 L 175 210 L 155 220 L 135 150"
                        fill={demoEffectMode === 'ghost' ? 'rgba(0,240,255,0.2)' : '#161628'}
                      />

                      {/* Pixel Mosaic Overlay if in Pixel mode */}
                      {demoEffectMode === 'pixel' && (
                        <g opacity="0.6">
                          {Array.from({ length: 18 }).map((_, idx) => (
                            <rect
                              key={idx}
                              x={(idx % 6) * 20 + 40}
                              y={Math.floor(idx / 6) * 35 + 80}
                              width="18"
                              height="30"
                              fill={idx % 2 === 0 ? '#00f0ff' : '#a855f7'}
                              opacity="0.35"
                            />
                          ))}
                        </g>
                      )}
                    </svg>

                    {/* Neural Segmentation Contour Glow */}
                    <div className="absolute inset-0 rounded-full border border-accent-cyan/30 animate-pulse pointer-events-none" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Invisibility Particles & Empty Plate State Indicator */}
              {isDemoInvisible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center p-6 glass rounded-2xl border border-accent-cyan/30 text-center shadow-glow"
                >
                  <div className="w-12 h-12 rounded-full bg-accent-cyan/10 border border-accent-cyan/40 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-accent-cyan animate-pulse" />
                  </div>
                  <h4 className="text-base font-bold text-white tracking-wide">
                    SUBJECT INVISIBLE
                  </h4>
                  <p className="text-xs font-mono text-gray-300 mt-1 max-w-xs">
                    Replaced with clean background plate frame buffer #001
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/10 text-accent-green border border-accent-green/30 text-[11px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-ping" />
                    <span>0% Person Opacity Composite</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Glitch Scanline Overlay when triggering */}
            {demoStage === 'glitching' && (
              <div className="absolute inset-0 bg-accent-cyan/10 backdrop-invert-0 pointer-events-none mix-blend-screen flex flex-col justify-between">
                <div className="h-1 bg-accent-cyan shadow-[0_0_15px_#00f0ff] animate-pulse" />
                <div className="text-center font-mono text-xs font-bold text-accent-cyan tracking-widest uppercase bg-void/80 py-1">
                  &gt;&gt;&gt; ACOUSTIC TRIGGER: RECONSTRUCTING BUFFER &lt;&lt;&lt;
                </div>
                <div className="h-1 bg-accent-purple shadow-[0_0_15px_#a855f7] animate-pulse" />
              </div>
            )}

            {/* HUD Status Overlay in Top Corner */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 font-mono text-[11px] pointer-events-none">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md glass bg-void/70 border border-white/10">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isDemoInvisible ? 'bg-accent-purple animate-pulse' : 'bg-accent-green'
                  }`}
                />
                <span className="text-gray-200">
                  {demoStage === 'clapping'
                    ? '⚡ TRANSIENT CLAP DETECTED (+26 dB)'
                    : demoStage === 'glitching'
                    ? '🔄 SPLICING CLEAN BACKGROUND...'
                    : isDemoInvisible
                    ? '✨ INVISIBLE MODE ACTIVE'
                    : '🟢 LIVE VIEW (SUBJECT DETECTED)'}
                </span>
              </div>

              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md glass bg-void/70 border border-white/10 text-gray-400">
                <span>MODE:</span>
                <span className="text-accent-cyan uppercase font-bold">
                  {demoEffectMode}
                </span>
              </div>
            </div>

            {/* Real-time Audio Spectrum Visualizer HUD */}
            <div className="absolute bottom-3 right-3 glass bg-void/80 rounded-xl p-2.5 border border-white/10 flex flex-col gap-1 pointer-events-none">
              <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-gray-400">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-accent-cyan" />
                  <span>2.8 kHz Band</span>
                </span>
                <span className={demoSpikeActive ? 'text-accent-cyan font-bold' : 'text-gray-400'}>
                  {demoSpikeActive ? 'SPIKE 98%' : '18 dB'}
                </span>
              </div>

              <div className="flex items-end gap-1 h-8 w-36 px-1">
                {simulatedAudioBars.map((height, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-sm transition-all duration-75 ${
                      demoSpikeActive && idx >= 6 && idx <= 11
                        ? 'bg-gradient-to-t from-accent-cyan to-white'
                        : 'bg-gradient-to-t from-accent-purple/50 to-accent-cyan'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls Bar */}
          <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-6 pt-4 border-t border-glass-border">
            {/* Mode Selectors */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-mono text-gray-400 mr-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent-cyan" />
                <span>Effect Mode:</span>
              </span>

              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setDemoEffectMode(mode.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    demoEffectMode === mode.id
                      ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-void font-bold shadow-glow'
                      : 'glass text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  title={mode.description}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Interactive Clap & Reset Triggers */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={resetDemo}
                className="p-2.5 rounded-xl glass text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset simulation to visible default"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={triggerDemoClap}
                disabled={demoStage === 'clapping' || demoStage === 'glitching'}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl text-sm font-bold text-void bg-gradient-to-r from-accent-cyan via-white to-accent-cyan bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-glow flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <span className="text-base">👏</span>
                <span>
                  {isDemoInvisible ? 'Simulate Clap to Reappear' : 'Simulate Clap (Disappear)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
