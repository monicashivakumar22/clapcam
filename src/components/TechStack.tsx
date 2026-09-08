import { Code2, Cpu, AudioLines, Palette, CheckCircle2 } from 'lucide-react';
import { TECH_SPECS } from '@/data/features';

export function TechStack() {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Computer Vision':
        return <Cpu className="w-5 h-5 text-accent-cyan" />;
      case 'Audio Processing':
        return <AudioLines className="w-5 h-5 text-accent-purple" />;
      case 'Rendering Pipeline':
        return <Palette className="w-5 h-5 text-accent-pink" />;
      default:
        return <Code2 className="w-5 h-5 text-accent-green" />;
    }
  };

  return (
    <section id="architecture" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-cyan/30 text-xs font-mono text-accent-cyan mb-4">
            <span>Stack &amp; Standards</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Modern Browser Architecture
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-300 font-light">
            Built strictly on modern web standards with zero external backend microservices or cloud telemetry dependencies.
          </p>
        </div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TECH_SPECS.map((spec, idx) => (
            <div
              key={idx}
              className="glass rounded-3xl p-7 border border-glass-border hover:border-accent-cyan/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-light border border-white/10 flex items-center justify-center">
                      {getCategoryIcon(spec.category)}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-gray-400 uppercase">
                        {spec.category}
                      </span>
                      <h3 className="text-base font-bold text-white">
                        {spec.technology}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-300 font-light leading-relaxed mb-6">
                  {spec.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-green" />
                  <span>Standard Compliant</span>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-surface-light text-accent-cyan font-bold border border-white/5">
                  {spec.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
