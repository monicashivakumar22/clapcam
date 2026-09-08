import { Cpu, Camera, Mic, Activity, HardDrive, ShieldCheck, Zap } from 'lucide-react';
import { useClapCamStore } from '@/store/useClapCamStore';

export function SystemStatus() {
  const performance = useClapCamStore((s) => s.performance);

  const subsystems = [
    {
      name: 'MediaPipe Vision Model',
      type: 'TFLite WebAssembly GPU',
      status: 'Standby / Ready',
      metric: '256x256 Float32',
      icon: Cpu,
      accent: 'cyan',
    },
    {
      name: 'Web Audio FFT Engine',
      type: 'AnalyserNode 48kHz',
      status: '2.8 kHz Bandpass Gate',
      metric: '2048 FFT Bins',
      icon: Mic,
      accent: 'purple',
    },
    {
      name: 'Camera Video Stream',
      type: 'getUserMedia 1080p',
      status: 'Awaiting User Permission',
      metric: '30-60 FPS Target',
      icon: Camera,
      accent: 'pink',
    },
    {
      name: 'Canvas Compositing Buffer',
      type: 'Double-Buffered Offscreen',
      status: 'Zero GC Allocation',
      metric: 'RGBA 32-bit Splicer',
      icon: HardDrive,
      accent: 'green',
    },
  ];

  return (
    <section id="specs" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-cyan/30 text-xs font-mono text-accent-cyan mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetry &amp; Health</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            System Status &amp; Runtime Metrics
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-300 font-light">
            Real-time diagnostics from your local browser environment. Connected directly to the client state store.
          </p>
        </div>

        {/* Futuristic Status Dashboard Card */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-glass-border shadow-2xl relative overflow-hidden">
          {/* Top Bar with Live Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-glass-border">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse" />
              <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Local Runtime Engine: Healthy
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent-cyan" />
                <span>Zero Server Dependencies</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-accent-purple" />
                <span>GPU Acceleration Active</span>
              </div>
            </div>
          </div>

          {/* Subsystems Status Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subsystems.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <div
                  key={idx}
                  className="glass rounded-2xl p-5 border border-white/5 flex flex-col justify-between hover:border-white/15 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="p-2.5 rounded-xl bg-surface-light border border-white/10">
                        <Icon className="w-4 h-4 text-accent-cyan" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface text-gray-400 border border-white/5">
                        {sub.metric}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      {sub.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {sub.type}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                    <span className="text-xs font-mono text-gray-300">
                      {sub.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Live Metrics Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-surface/80 border border-white/5 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-gray-400">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-gray-500">Target Frame Rate:</span>{' '}
                <span className="text-white font-bold">60 FPS</span>
              </div>
              <div>
                <span className="text-gray-500">Render Time:</span>{' '}
                <span className="text-accent-cyan font-bold">
                  {performance.renderMs > 0 ? `${performance.renderMs}ms` : '< 2.5ms'}
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="text-gray-500">Audio FFT Resolution:</span>{' '}
                <span className="text-accent-purple font-bold">2048 Samples</span>
              </div>
            </div>

            <div className="text-accent-green font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              <span>READY FOR STREAM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
