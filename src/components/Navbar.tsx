import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Menu, X, Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Simulation', href: '#simulation' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Privacy', href: '#privacy' },
    { name: 'Specs', href: '#specs' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      return; // Will navigate via Link
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-void/85 backdrop-blur-xl border-b border-glass-border shadow-glass py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan via-accent-purple to-accent-pink p-[1px] shadow-glow transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-void rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-accent-cyan transition-colors group-hover:text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl bg-accent-cyan/20 blur-md -z-10 group-hover:bg-accent-cyan/40 transition-colors" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                ClapCam
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30">
                AI
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase -mt-0.5">
              Invisibility Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full glass border border-glass-border">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  handleNavClick(link.href);
                }
              }}
              className="text-xs font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button & Badges */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-light/60 border border-white/5 text-[11px] font-mono text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
            <span>Air-Gapped</span>
          </div>

          <Link
            to="/camera"
            className="relative group overflow-hidden px-4 py-2 rounded-xl text-xs font-semibold text-void bg-gradient-to-r from-accent-cyan via-white to-accent-cyan bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-glow flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-void fill-void" />
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/camera"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-void bg-accent-cyan shadow-glow flex items-center gap-1"
          >
            <span>Start</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl glass text-gray-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass-strong border-b border-glass-border px-6 py-5 overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault();
                    }
                    handleNavClick(link.href);
                  }}
                  className="text-sm font-medium text-gray-300 hover:text-accent-cyan py-2 border-b border-white/5 transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-2 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                  <Cpu className="w-4 h-4 text-accent-cyan" />
                  <span>MediaPipe WebAssembly GPU</span>
                </div>
                <Link
                  to="/camera"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl text-center text-sm font-bold text-void bg-gradient-to-r from-accent-cyan to-accent-purple shadow-glow flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Camera Studio</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
