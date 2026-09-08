import { UserMinus, Camera, SunMedium, CheckCircle2 } from 'lucide-react';

export function CalibrationTips() {
  const tips = [
    {
      icon: UserMinus,
      title: 'Step Out of View',
      desc: 'No people, hands, or moving pets in the camera frame.',
      accent: 'text-accent-cyan',
    },
    {
      icon: Camera,
      title: 'Stationary Camera',
      desc: 'Keep webcam fixed in position; do not tilt or move.',
      accent: 'text-accent-purple',
    },
    {
      icon: SunMedium,
      title: 'Consistent Lighting',
      desc: 'Avoid flashing lights or rapidly shifting room shadows.',
      accent: 'text-accent-pink',
    },
  ];

  return (
    <div className="glass rounded-2xl p-5 border border-glass-border">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/5 font-mono text-xs text-gray-400">
        <span className="text-white font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Calibration Best Practices</span>
        </span>
        <span className="text-[10px] text-gray-500 uppercase">3s Quick Capture</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-surface/50 border border-white/5 flex items-start gap-2.5"
            >
              <div className="p-1.5 rounded-lg bg-surface-light border border-white/5 flex-shrink-0 mt-0.5">
                <Icon className={`w-3.5 h-3.5 ${tip.accent}`} />
              </div>
              <div>
                <h5 className="font-bold text-white text-xs">{tip.title}</h5>
                <p className="text-[11px] text-gray-400 font-light mt-0.5 leading-snug">
                  {tip.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
