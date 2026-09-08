import type {
  FeatureItem,
  HowItWorksStep,
  TechSpec,
  PrivacyComparison,
  LimitationItem,
} from '@/types';

export const HERO_METRICS = [
  { value: '< 35ms', label: 'Inference Latency', detail: 'Real-time WebAssembly GPU delegate' },
  { value: '100%', label: 'On-Device Privacy', detail: 'Zero server roundtrips or uploads' },
  { value: '2.8 kHz', label: 'Acoustic Center', detail: 'Transient high-Q bandpass analysis' },
  { value: '60 FPS', label: 'Render Target', detail: 'Offscreen canvas hardware accelerated' },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: '01',
    number: 'Step 01',
    title: 'Background Calibration',
    subtitle: 'Reference Plate Acquisition',
    description:
      'Step out of the frame for 3 seconds. ClapCam AI samples consecutive video frames, computing a noise-reduced baseline canvas representing your empty room.',
    technicalDetails: [
      'Multi-frame temporal averaging',
      'High-dynamic-range pixel buffer storage',
      'Zero distortion baseline frame cache',
    ],
    iconName: 'Camera',
    color: 'cyan',
  },
  {
    step: '02',
    number: 'Step 02',
    title: 'Transient Acoustic Analysis',
    subtitle: 'Web Audio API FFT Engine',
    description:
      'The browser audio pipeline continuously monitors incoming microphone transients, isolating clapping bursts between 2,000 Hz and 4,000 Hz while discarding ambient speech.',
    technicalDetails: [
      '2048-point Fast Fourier Transform',
      'Attack-time differential energy scoring',
      'Dynamic threshold with cooldown filter',
    ],
    iconName: 'Mic',
    color: 'purple',
  },
  {
    step: '03',
    number: 'Step 03',
    title: 'Neural Mask Splicing',
    subtitle: 'Sub-frame Invisibility Compositing',
    description:
      'Upon detecting a clap, MediaPipe generates high-fidelity person category masks. Pixels inside the silhouette are instantaneously swapped with the stored background plate.',
    technicalDetails: [
      'Separable Gaussian edge blurring',
      '5-frame temporal buffer smoothing',
      'Sub-millisecond canvas drawImage replacement',
    ],
    iconName: 'EyeOff',
    color: 'pink',
  },
];

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: 'ai-segmentation',
    title: 'Real-Time Neural Segmentation',
    badge: 'MediaPipe Vision',
    description:
      'On-device deep neural network segments human silhouettes at up to 60 FPS using GPU-accelerated WebAssembly without dropping video frames.',
    metric: '256×256 / 30+ FPS',
    iconName: 'Cpu',
    accent: 'cyan',
  },
  {
    id: 'clap-detection',
    title: 'Transient Acoustic Trigger',
    badge: 'Web Audio API',
    description:
      'High-Q bandpass audio filters analyze sharp acoustic transients in the 2–4 kHz clapping spectrum, ignoring background chatter, music, and typing.',
    metric: '500ms Cooldown Gate',
    iconName: 'AudioWaveform',
    accent: 'purple',
  },
  {
    id: 'clean-plate',
    title: 'Clean-Plate Frame Compositing',
    badge: 'Zero-Artifact FX',
    description:
      'Replaces segmented person pixels with a pre-calibrated clean background frame, creating genuine invisibility rather than basic opacity fading.',
    metric: '32-bit RGBA Buffer Splicing',
    iconName: 'Sparkles',
    accent: 'pink',
  },
  {
    id: 'airgap-privacy',
    title: '100% Air-Gapped Privacy',
    badge: 'Zero Server Storage',
    description:
      'All camera pixels, audio waveforms, and machine learning models execute entirely within your browser runtime. Zero bytes ever leave your device.',
    metric: '0 KB Uploaded',
    iconName: 'ShieldCheck',
    accent: 'green',
  },
  {
    id: 'multi-mode',
    title: '4 Visual Transformation Modes',
    badge: 'Custom Shaders',
    description:
      'Toggle between pure Invisibility, Spectral Ghost (translucent blue overlay), 8-Bit Pixel mosaic, and RGB Chromatic Aberration Glitch effects.',
    metric: '4 Dynamic FX Shaders',
    iconName: 'Layers',
    accent: 'cyan',
  },
  {
    id: 'performance-tuning',
    title: 'Hardware-Tuned Performance',
    badge: 'Adaptive Engine',
    description:
      'Adaptive buffer pooling, OffscreenCanvas rendering, and rolling EMA frame timing prevent memory leaks and maintain smooth UI responsiveness.',
    metric: '< 50 MB RAM Footprint',
    iconName: 'Sliders',
    accent: 'purple',
  },
];

export const TECH_SPECS: TechSpec[] = [
  {
    category: 'Computer Vision',
    technology: 'Google MediaPipe Tasks Vision (Image Segmenter)',
    description: 'Selfie segmentation model running via WebAssembly with GPU delegate acceleration.',
    highlight: 'WASM + WebGL GPU',
  },
  {
    category: 'Audio Processing',
    technology: 'Web Audio API (AnalyserNode & BiquadFilterNode)',
    description: 'Real-time time-domain and frequency-domain transient energy differential detector.',
    highlight: '2048 FFT / 48 kHz',
  },
  {
    category: 'Rendering Pipeline',
    technology: 'HTML5 Canvas 2D / OffscreenCanvas API',
    description: 'Double-buffered pixel manipulation with direct ImageData Uint8ClampedArray write.',
    highlight: 'Zero Garbage Allocation',
  },
  {
    category: 'State & UI',
    technology: 'React 19 + TypeScript + Zustand + Tailwind CSS',
    description: 'Atomic state transitions with sub-millisecond component reactivity and Framer Motion micro-animations.',
    highlight: 'Strict Type Safety',
  },
];

export const PRIVACY_COMPARISONS: PrivacyComparison[] = [
  {
    feature: 'Video & Audio Data Transmission',
    clapcam: '0 KB — Stays in device memory exclusively',
    traditional: 'Continuous HD video stream sent to cloud servers',
  },
  {
    feature: 'Machine Learning Execution',
    clapcam: 'Local WebAssembly runtime on your GPU/CPU',
    traditional: 'Remote cloud GPUs processing user biometric video',
  },
  {
    feature: 'Facial & Silhouette Storage',
    clapcam: 'Zero persistence; discarded upon tab close',
    traditional: 'Server logs, model training datasets, and telemetry',
  },
  {
    feature: 'Network Access Required After Load',
    clapcam: 'None — Fully functional offline in airplane mode',
    traditional: 'Requires uninterrupted high-bandwidth internet',
  },
];

export const BEST_EXPERIENCE_GUIDE: LimitationItem[] = [
  {
    icon: '💡',
    title: 'Balanced, Static Lighting',
    tip: 'Avoid harsh backlighting or dynamic flashing lights, as rapid exposure changes can reveal seams between the baseline background and live video.',
    severity: 'tip',
  },
  {
    icon: '📷',
    title: 'Stable Camera Position',
    tip: 'Ensure your webcam or phone is stationary. Since background replacement is pixel-mapped, camera movement requires recalibrating the clean plate.',
    severity: 'note',
  },
  {
    icon: '👏',
    title: 'Crisp, Sharp Claps',
    tip: 'Clap with cupped or flat hands approximately 1–3 feet from the microphone to generate the distinct 2.8 kHz transient spike required for detection.',
    severity: 'info',
  },
  {
    icon: '🪑',
    title: 'Clean Baseline Area',
    tip: 'Ensure the frame is completely clear of people during the initial 3-second calibration snapshot so the background frame is clean.',
    severity: 'tip',
  },
];
