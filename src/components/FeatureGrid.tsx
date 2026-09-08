import {
  Cpu,
  AudioWaveform,
  Sparkles,
  ShieldCheck,
  Layers,
  Sliders,
} from 'lucide-react';
import { FEATURES_DATA } from '@/data/features';

export function FeatureGrid() {
  const getIcon = (iconName: string, accent: string) => {
    const colorClass =
      accent === 'cyan'
        ? 'text-accent-cyan'
        : accent === 'purple'
        ? 'text-accent-purple'
        : accent === 'pink'
        ? 'text-accent-pink'
        : 'text-accent-green';

    switch (iconName) {
      case 'Cpu':
        return <Cpu className={`w-6 h-6 ${colorClass}`} />;
      case 'AudioWaveform':
        return <AudioWaveform className={`w-6 h-6 ${colorClass}`} />;
      case 'Sparkles':
        return <Sparkles className={`w-6 h-6 ${colorClass}`} />;
      case 'ShieldCheck':
        return <ShieldCheck className={`w-6 h-6 ${colorClass}`} />;
      case 'Layers':
        return <Layers className={`w-6 h-6 ${colorClass}`} />;
      case 'Sliders':
        return <Sliders className={`w-6 h-6 ${colorClass}`} />;
      default:
        return <Cpu className={`w-6 h-6 ${colorClass}`} />;
    }
  };

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-pink/30 text-xs font-mono text-accent-pink mb-4">
            <span>Engine Features</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Precision & Speed
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-300 font-light">
            Every layer of the vision, audio, and compositing pipeline is designed from the ground up for low-latency in-browser execution.
          </p>
        </div>

        {/* 2-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES_DATA.map((feature) => (
            <div
              key={feature.id}
              className="glass rounded-3xl p-8 border border-glass-border hover:border-white/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Corner Ambient Glow */}
              <div
                className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none ${
                  feature.accent === 'cyan'
                    ? 'bg-accent-cyan'
                    : feature.accent === 'purple'
                    ? 'bg-accent-purple'
                    : feature.accent === 'pink'
                    ? 'bg-accent-pink'
                    : 'bg-accent-green'
                }`}
              />

              <div>
                {/* Top Row: Icon & Badge */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-surface-light border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(feature.iconName, feature.accent)}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-surface-light text-[11px] font-mono text-gray-300 border border-white/5">
                    {feature.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>

              {/* Metric Tag Footer */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Specification</span>
                <span className="text-accent-cyan font-bold">
                  {feature.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
