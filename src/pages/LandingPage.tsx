import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CameraPreviewMockup } from '@/components/CameraPreviewMockup';
import { HowItWorks } from '@/components/HowItWorks';
import { FeatureGrid } from '@/components/FeatureGrid';
import { TechStack } from '@/components/TechStack';
import { SystemStatus } from '@/components/SystemStatus';
import { PrivacySection } from '@/components/PrivacySection';
import { Limitations } from '@/components/Limitations';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-void text-white selection:bg-accent-cyan/20 selection:text-accent-cyan relative overflow-x-hidden font-sans">
      {/* Dynamic Background Noise / Shimmer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-cyan/5 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-purple/5 blur-[140px]" />
        <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-accent-pink/5 blur-[160px]" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero />
        <CameraPreviewMockup />
        <HowItWorks />
        <FeatureGrid />
        <TechStack />
        <SystemStatus />
        <PrivacySection />
        <Limitations />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
