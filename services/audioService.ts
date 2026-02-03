
class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.15;
    this.masterGain.connect(this.ctx.destination);
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 1) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    g.gain.setValueAtTime(volume, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(g);
    g.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playClick() {
    this.playTone(800, 'sine', 0.05, 0.5);
  }

  public playEnter() {
    this.playTone(440, 'square', 0.1, 0.3);
    setTimeout(() => this.playTone(880, 'square', 0.1, 0.2), 50);
  }

  public playSuccess() {
    this.playTone(660, 'sine', 0.2, 0.4);
    setTimeout(() => this.playTone(1320, 'sine', 0.3, 0.3), 100);
  }

  public playProcessing() {
    this.playTone(120, 'sawtooth', 0.1, 0.1);
  }

  public playError() {
    this.playTone(110, 'sawtooth', 0.4, 0.5);
  }
}

export const audioService = new AudioService();
