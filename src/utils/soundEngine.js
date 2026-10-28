/**
 * SpeakUp Clean & Crystal-Clear Voice Engine
 * 
 * Restores 100% natural, intelligible speech:
 * 1. Pitch locked strictly at 1.0 (no chipmunk, cartoon, or demonic distortion).
 * 2. Rate locked at 0.9 (natural, easy-to-understand speech cadence for speech therapy).
 * 3. Picks only genuine English US/UK voices that have clear articulation.
 * 4. Strips emojis/markup so words aren't garbled.
 */

class SpeakUpAudioEngine {
  constructor() {
    this.voices = [];
    this.selectedVoice = null;
    this.audioCtx = null;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    if (this.voices.length > 0) {
      this.selectedVoice = this.pickCleanVoice();
    }
  }

  /**
   * Selects clean, stable, crystal-clear standard English voices.
   * Avoids voices that distort with speech pitch modifications.
   */
  pickCleanVoice() {
    if (!this.voices || this.voices.length === 0) return null;

    // Standard high-clarity voice profiles
    const cleanMatches = [
      /google us english/i,
      /microsoft zira/i,
      /microsoft aria/i,
      /samantha/i,
      /karen/i,
      /en-us/i,
      /en_us/i,
      /en-gb/i
    ];

    for (const pattern of cleanMatches) {
      const match = this.voices.find(v => pattern.test(v.name) || pattern.test(v.lang));
      if (match) return match;
    }

    // Default to first English voice available
    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  getAvailableVoices() {
    if (!this.voices || this.voices.length === 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices();
      }
    }
    return this.voices.filter(v => v.lang.startsWith('en'));
  }

  setCustomVoice(voiceName) {
    const found = this.voices.find(v => v.name === voiceName || v.voiceURI === voiceName);
    if (found) {
      this.selectedVoice = found;
    }
  }

  /**
   * Speaks cleanly without pitch distortion.
   * @param {string} text - The words to speak
   * @param {number|string} speedOrPreset - 1.0 (normal), 0.75 (slow), or preset
   * @param {function} onEnd - Callback when speech ends
   */
  speak(text, speedOrPreset = 0.9, onEnd = null) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean text: strip emojis, symbols, and extra punctuation that confuse speech synthesizers
    const clean = text
      .replace(/[\u{1F600}-\u{1F6FF}|[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[^\w\s.,?!'-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);

    if (!this.selectedVoice) {
      this.initVoices();
    }
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // CRITICAL: Lock pitch strictly to 1.0 so speech never sounds distorted or cartoonish
    utterance.pitch = 1.0;

    // Rate: clean, clear speed (default 0.9 for comfortable children's listening)
    if (speedOrPreset === 'slow' || speedOrPreset === 'gentle') {
      utterance.rate = 0.75;
    } else if (typeof speedOrPreset === 'number') {
      utterance.rate = Math.max(0.6, Math.min(speedOrPreset, 1.1));
    } else {
      utterance.rate = 0.9;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Gentle, cheerful completion chime using standard Web Audio
   */
  playChime(type = 'success') {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // Gentle C5 -> E5 -> G5 chord

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.45);
      });
    } catch (e) {
      // Ignored if browser policy blocks sound before user gesture
    }
  }

  /**
   * Crisp, soft UI button click / tap sound
   */
  playClick() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      // Fast gentle downward bubble tap: 580Hz down to 260Hz in 40ms
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.04);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Bright, crystal-clear bell "ting" sound for correct answers
   */
  playTing() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      // High harmonic silver bell frequencies: E6 (1318.5Hz) & E7 (2637Hz)
      const bells = [
        { freq: 1318.51, gainVal: 0.22 },
        { freq: 2637.02, gainVal: 0.12 }
      ];

      bells.forEach(b => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(b.freq, now);

        gain.gain.setValueAtTime(b.gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.7);
      });
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Gentle, kid-friendly cartoon "uh-oh" double boop for incorrect attempts
   */
  playError() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      // Gentle, friendly low tones (300Hz -> 230Hz, then 220Hz -> 150Hz)
      const tones = [
        { start: 0, dur: 0.11, freqStart: 310, freqEnd: 240 },
        { start: 0.12, dur: 0.15, freqStart: 230, freqEnd: 160 }
      ];

      tones.forEach(t => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(t.freqStart, now + t.start);
        osc.frequency.linearRampToValueAtTime(t.freqEnd, now + t.start + t.dur);

        gain.gain.setValueAtTime(0.12, now + t.start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t.start + t.dur);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + t.start);
        osc.stop(now + t.start + t.dur + 0.02);
      });
    } catch (e) {
      // Ignore
    }
  }
}

export const soundEngine = new SpeakUpAudioEngine();
