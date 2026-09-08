import { Shield, Code2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-20 px-6 py-4 border-t border-glass-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          <span className="font-mono">100% Private — Zero server processing</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono">Built with MediaPipe + Web Audio API</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-cyan transition-colors flex items-center gap-1"
          >
            <Code2 className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
