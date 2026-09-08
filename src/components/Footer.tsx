import { Eye, Shield, Cpu, Code2, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-glass-border bg-void/90 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-glow">
                <Eye className="w-4 h-4 text-void" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-white font-sans">
                ClapCam<span className="text-gradient"> AI</span>
              </span>
            </Link>

            <p className="text-xs text-gray-400 font-light max-w-sm leading-relaxed">
              Real-time on-device person segmentation and acoustic transient detection. Built for privacy, performance, and instant browser invisibility.
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs font-mono text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-accent-green" />
                <span>Zero Server Telemetry</span>
              </div>
              <span>&bull;</span>
              <div className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
                <span>WebAssembly SIMD</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2.5 text-xs font-mono">
            <span className="text-gray-300 font-semibold uppercase tracking-wider mb-1">
              Architecture
            </span>
            <a href="#features" className="text-gray-400 hover:text-accent-cyan transition-colors">
              Neural Segmentation
            </a>
            <a href="#how-it-works" className="text-gray-400 hover:text-accent-cyan transition-colors">
              Transient Acoustic Gate
            </a>
            <a href="#simulation" className="text-gray-400 hover:text-accent-cyan transition-colors">
              Interactive Simulator
            </a>
            <a href="#specs" className="text-gray-400 hover:text-accent-cyan transition-colors">
              Runtime Diagnostics
            </a>
          </div>

          {/* Quick Launch & Privacy */}
          <div className="flex flex-col gap-2.5 text-xs font-mono">
            <span className="text-gray-300 font-semibold uppercase tracking-wider mb-1">
              Engine Access
            </span>
            <Link to="/camera" className="text-accent-cyan hover:text-white transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Live Camera</span>
            </Link>
            <a href="#privacy" className="text-gray-400 hover:text-accent-green transition-colors">
              Air-Gapped Guarantee
            </a>
            <a href="#architecture" className="text-gray-400 hover:text-accent-purple transition-colors">
              WASM Model Specifications
            </a>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div>
            &copy; {currentYear} ClapCam AI. All processing executed locally on-device.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-400">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
              <span>using MediaPipe + Web Audio</span>
            </span>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="View Source Code"
            >
              <Code2 className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
