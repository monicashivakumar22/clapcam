import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  animate?: boolean;
}

export function GlassCard({ children, className = '', glow = false, animate = true }: GlassCardProps) {
  const Component = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 16 } as const,
        animate: { opacity: 1, y: 0 } as const,
        transition: { duration: 0.4 } as const,
      }
    : {};

  return (
    <Component
      className={`glass rounded-2xl ${glow ? 'glow-border' : ''} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
}
