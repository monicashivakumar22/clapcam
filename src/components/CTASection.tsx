import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative glass-strong rounded-3xl p-8 sm:p-14 lg:p-16 border border-accent-cyan/30 shadow-2xl overflow-hidden text-center">
          {/* Neon Glow Blobs */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-accent-cyan/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-accent-purple/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-accent-cyan/40 text-xs font-mono text-accent-cyan mb-6 shadow-glow">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant In-Browser Launch</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Vanish with a Single Clap?
            </h2>

            <p className="mt-6 text-base sm:text-lg text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
              No software downloads. No account creation. No cloud video feeds. Experience on-device real-time invisibility in less than 10 seconds.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/camera"
                className="w-full sm:w-auto px-9 py-4 rounded-xl text-base font-bold text-void bg-gradient-to-r from-accent-cyan via-white to-accent-cyan bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-glow flex items-center justify-center gap-3 group"
              >
                <Sparkles className="w-5 h-5 text-void fill-void" />
                <span>Launch ClapCam Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent-green" />
                <span>100% Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                <span>Compatible with Chrome, Edge &amp; Firefox</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
