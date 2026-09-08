import { Info, Sparkles } from 'lucide-react';
import { BEST_EXPERIENCE_GUIDE } from '@/data/features';

export function Limitations() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-purple/30 text-xs font-mono text-accent-purple mb-4">
            <Info className="w-3.5 h-3.5" />
            <span>Optimal Conditions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Best Experience Guide
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-300 font-light">
            To achieve seamless, artifact-free invisibility, follow these physical and environmental recommendations.
          </p>
        </div>

        {/* 4 Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BEST_EXPERIENCE_GUIDE.map((item, idx) => (
            <div
              key={idx}
              className="glass rounded-3xl p-6 border border-glass-border hover:border-white/20 transition-all flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface-light border border-white/10 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-surface-light text-[10px] font-mono text-accent-cyan border border-white/5 uppercase">
                    {item.severity}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                  {item.tip}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip Card */}
        <div className="mt-8 glass rounded-2xl p-5 border border-accent-cyan/20 bg-gradient-to-r from-accent-cyan/5 via-transparent to-accent-purple/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 text-gray-300">
            <Sparkles className="w-5 h-5 text-accent-cyan flex-shrink-0" />
            <span>
              <strong>Pro Tip:</strong> If room lighting shifts or the camera moves, click <em>Recalibrate Plate</em> in the studio to refresh the clean frame buffer.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
