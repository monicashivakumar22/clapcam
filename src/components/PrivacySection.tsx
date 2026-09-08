import { ShieldCheck, Lock, EyeOff, FileText, Check, X } from 'lucide-react';
import { PRIVACY_COMPARISONS } from '@/data/features';

export function PrivacySection() {
  return (
    <section id="privacy" className="py-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent-green/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-green/30 text-xs font-mono text-accent-green mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Manifest</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Zero Server Processing. Period.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-300 font-light">
            Unlike cloud-based vision APIs, ClapCam AI processes all video frames and audio transients entirely in your local browser sandbox.
          </p>
        </div>

        {/* 3 Privacy Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-3xl p-7 border border-glass-border hover:border-accent-green/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-surface-light border border-white/10 flex items-center justify-center mb-5">
              <Lock className="w-6 h-6 text-accent-green" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              100% In-Memory Execution
            </h3>
            <p className="text-sm text-gray-300 font-light leading-relaxed">
              Camera pixels are stored exclusively in volatile JavaScript typed array buffers. No frames are written to local disk or transmitted over WebSockets.
            </p>
          </div>

          <div className="glass rounded-3xl p-7 border border-glass-border hover:border-accent-green/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-surface-light border border-white/10 flex items-center justify-center mb-5">
              <EyeOff className="w-6 h-6 text-accent-cyan" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No Biometric Tracking
            </h3>
            <p className="text-sm text-gray-300 font-light leading-relaxed">
              The neural segmentation model operates solely on binary silhouette masks without facial recognition, identity tagging, or biometric profiling.
            </p>
          </div>

          <div className="glass rounded-3xl p-7 border border-glass-border hover:border-accent-green/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-surface-light border border-white/10 flex items-center justify-center mb-5">
              <FileText className="w-6 h-6 text-accent-purple" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Zero Telemetry / Offline Ready
            </h3>
            <p className="text-sm text-gray-300 font-light leading-relaxed">
              After initial asset load, ClapCam AI works completely air-gapped in Airplane Mode. Disconnect your internet at any time to verify.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-glass-border shadow-2xl overflow-x-auto">
          <div className="min-w-[600px]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-glass-border text-xs font-mono text-gray-400">
                  <th className="pb-4 font-medium">Privacy Architecture Dimension</th>
                  <th className="pb-4 font-medium text-accent-green">ClapCam AI (Local Engine)</th>
                  <th className="pb-4 font-medium text-gray-500">Traditional Cloud Vision APIs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {PRIVACY_COMPARISONS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 text-gray-300 font-sans text-sm font-medium">
                      {row.feature}
                    </td>
                    <td className="py-4 text-accent-green font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      <span>{row.clapcam}</span>
                    </td>
                    <td className="py-4 text-gray-400">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-400/70 flex-shrink-0" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
