import type { ClapConfig, ClapCallback, ClapEvent } from '@/types';
import { DEFAULT_CLAP_CONFIG, FFT_SIZE, SMOOTHING_TIME_CONSTANT } from '@/utils/constants';

/**
 * ClapDetector uses the Web Audio API AnalyserNode to detect claps
 * by monitoring energy spikes in the 2–4 kHz frequency band.
 *
 * Design rationale:
 * - Claps are broadband transients with peak energy in ~2000–4000 Hz
 * - We sum energy in that band and compare against a configurable threshold
 * - A cooldown period prevents rapid re-triggering
 * - consecutiveFrames requires N frames above threshold to confirm (reduces false positives)
 */
export class ClapDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private frequencyData: Uint8Array | null = null;
  private animationId: number | null = null;
  private config: ClapConfig;
  private callback: ClapCallback | null = null;
  private lastClapTime = 0;
  private consecutiveCount = 0;
  private running = false;

  constructor(config?: Partial<ClapConfig>) {
    this.config = { ...DEFAULT_CLAP_CONFIG, ...config };
  }

  /**
   * Start listening for claps from the given microphone stream.
   */
  async start(stream: MediaStream, callback: ClapCallback): Promise<void> {
    this.callback = callback;

    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = FFT_SIZE;
    this.analyser.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT;

    this.source = this.audioContext.createMediaStreamSource(stream);
    this.source.connect(this.analyser);

    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.running = true;

    this.detect();
  }

  /**
   * Stop listening and release audio resources.
   */
  stop(): void {
    this.running = false;

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.frequencyData = null;
    this.callback = null;
    this.consecutiveCount = 0;
  }

  /**
   * Update detection configuration at runtime.
   */
  updateConfig(config: Partial<ClapConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Core detection loop — runs at display refresh rate via requestAnimationFrame.
   *
   * Algorithm:
   * 1. Sample frequency-domain data from the AnalyserNode
   * 2. Sum energy in the target frequency band (2–4 kHz by default)
   * 3. If energy exceeds threshold for N consecutive frames → trigger clap
   * 4. Apply cooldown to prevent rapid re-triggering
   */
  private detect = (): void => {
    if (!this.running || !this.analyser || !this.frequencyData) return;

    this.analyser.getByteFrequencyData(this.frequencyData);

    const energy = this.calculateBandEnergy();
    const now = performance.now();

    if (energy > this.config.energyThreshold) {
      this.consecutiveCount++;

      if (
        this.consecutiveCount >= this.config.consecutiveFrames &&
        now - this.lastClapTime > this.config.cooldownMs
      ) {
        this.lastClapTime = now;
        this.consecutiveCount = 0;

        const event: ClapEvent = {
          timestamp: now,
          energy,
          frequency: (this.config.frequencyMin + this.config.frequencyMax) / 2,
        };

        this.callback?.(event);
      }
    } else {
      this.consecutiveCount = 0;
    }

    this.animationId = requestAnimationFrame(this.detect);
  };

  /**
   * Calculate average energy in the configured frequency band.
   * Converts Hz range to FFT bin indices based on sample rate and FFT size.
   */
  private calculateBandEnergy(): number {
    if (!this.analyser || !this.frequencyData || !this.audioContext) return 0;

    const sampleRate = this.audioContext.sampleRate;
    const binCount = this.analyser.frequencyBinCount;
    const binWidth = sampleRate / (binCount * 2);

    const minBin = Math.floor(this.config.frequencyMin / binWidth);
    const maxBin = Math.min(
      Math.ceil(this.config.frequencyMax / binWidth),
      binCount - 1,
    );

    let sum = 0;
    let count = 0;

    for (let i = minBin; i <= maxBin; i++) {
      sum += this.frequencyData[i];
      count++;
    }

    return count > 0 ? sum / count : 0;
  }
}
