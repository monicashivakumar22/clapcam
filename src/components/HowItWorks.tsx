import { Camera, Mic, EyeOff, Check, Cpu } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '@/data/features';

export function HowItWorks() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera':
        return <Camera className="w-6 h-6 text-accent-cyan" />;
      case 'Mic':
        return <Mic className="w-6 h-6 text-accent-purple" />;
      case 'EyeOff':
        return <EyeOff className="w-6 h-6 text-accent-pink" />;
      default:
        return <Cpu className="w-6 h-6 text-accent-cyan" />;
    }
  };

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent-purple/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-cyan/30 text-xs font-mono text-accent-cyan mb-4">
            <span>Execution Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How ClapCam AI Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-300 font-light">
            A three-phase pipeline orchestrated entirely inside your browser's WebAssembly and Web Audio threads.
          </p>
        </div>

        {/* 3-Step Connected Cards Layout */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-[2px] -translate-y-8 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink opacity-30 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="glass rounded-3xl p-7 border border-glass-border hover:border-accent-cyan/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 shadow-glass"
              >
                <div>
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-surface-light border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {getIcon(step.iconName)}
                    </div>
                    <span className="text-4xl font-extrabold font-mono text-white/20 group-hover:text-gradient transition-colors">
                      {step.step}
                    </span>
                  </div>

                  {/* Step Title & Subtitle */}
                  <div className="text-xs font-mono text-accent-cyan uppercase tracking-wider mb-1">
                    {step.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-300 leading-relaxed font-light mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Technical Specification Bullets */}
                <div className="pt-5 border-t border-white/5 flex flex-col gap-2">
                  {step.technicalDetails.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs font-mono text-gray-400">
                      <Check className="w-3.5 h-3.5 text-accent-cyan flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
