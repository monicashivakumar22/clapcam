import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

function App() {
  const phase = useAppStore((s) => s.phase);

  return (
    <div className="relative min-h-screen flex flex-col bg-void overflow-hidden">
      {/* Background ambient glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent-cyan/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-purple/5 blur-[120px]" />
      </div>

      {/* Main layout */}
      <Header />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {phase === 'initializing' && (
            <motion.div
              key="init"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <LoadingOverlay />
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl p-8 max-w-md text-center"
            >
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
              <p className="text-gray-400 text-sm">
                {useAppStore.getState().error || 'An unexpected error occurred.'}
              </p>
            </motion.div>
          )}

          {(phase === 'calibrating' || phase === 'ready' || phase === 'active') && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl"
            >
              <div className="glass rounded-2xl p-6">
                <div className="aspect-video bg-surface rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 font-mono text-sm">
                    Camera viewport — Phase 2
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;
