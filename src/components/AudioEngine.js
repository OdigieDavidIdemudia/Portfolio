/**
 * AudioEngine.js — Procedural ambient terminal music.
 *
 * Uses the Web Audio API to synthesise an A-minor-pentatonic arpeggio
 * with a bass drone and tape-echo delay. No external audio files.
 *
 * Design intent: subtle, slow, moody — think SOC monitor room at 02:00.
 */

// ─── Scale & Pattern ─────────────────────────────────────────────────────────

/** A minor pentatonic: A2 → G4 */
const SCALE = [
    110.00, // A2
    130.81, // C3
    146.83, // D3
    164.81, // E3
    196.00, // G3
    220.00, // A3
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
];

/** Melody step pattern — indices into SCALE. Slow ascending / meandering. */
const MELODY = [0, 2, 3, 4, 5, 4, 3, 2, 3, 5, 4, 6, 5, 4, 3, 5];

/** Bass root cycle (low A1 / E1 alternating every 4 beats) */
const BASS = [55.0, 41.2, 55.0, 49.0]; // A1, E1, A1, G1

const BPM            = 82;
const SPB            = 60 / BPM;     // seconds-per-beat
const SCHEDULE_AHEAD = 0.14;         // look-ahead buffer (s)
const LOOKAHEAD_MS   = 25;           // scheduler tick interval

// ─── Engine class ─────────────────────────────────────────────────────────────

class AudioEngine {
    constructor() {
        this.ctx          = null;
        this.masterGain   = null;
        this.delay        = null;
        this.delayGain    = null;
        this._playing     = false;
        this._nextBeat    = 0;
        this._melodyStep  = 0;
        this._bassStep    = 0;
        this._beatCount   = 0;
        this._timerId     = null;
    }

    get isPlaying() { return this._playing; }

    // ── Lazy init (AudioContext must be created from a user gesture) ─────────
    _init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        // Master gain (fades in/out)
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0;
        this.masterGain.connect(this.ctx.destination);

        // Tape-echo delay
        this.delay = this.ctx.createDelay(1.5);
        this.delay.delayTime.value = SPB * 0.75;

        this.delayGain = this.ctx.createGain();
        this.delayGain.gain.value = 0.32;

        // Low-pass on delay return → echos sound progressively darker
        this.delayFilter = this.ctx.createBiquadFilter();
        this.delayFilter.type = 'lowpass';
        this.delayFilter.frequency.value = 900;

        this.delay.connect(this.delayFilter);
        this.delayFilter.connect(this.delayGain);
        this.delayGain.connect(this.delay);          // feedback loop
        this.delayGain.connect(this.masterGain);
    }

    // ── Schedule one beat ────────────────────────────────────────────────────
    _scheduleBeat(t) {
        const ctx = this.ctx;

        // ── Melody note ──────────────────────────────────────────────────────
        const noteIdx = MELODY[this._melodyStep % MELODY.length];
        const freq    = SCALE[noteIdx];
        const dur     = SPB * 0.75;

        // Fundamental (sine)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = freq;

        // 2nd harmonic (triangle) for warmth
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.value = freq * 2;

        const env1 = ctx.createGain();
        env1.gain.setValueAtTime(0, t);
        env1.gain.linearRampToValueAtTime(0.20, t + 0.02);
        env1.gain.exponentialRampToValueAtTime(0.001, t + dur);

        const env2 = ctx.createGain();
        env2.gain.setValueAtTime(0, t);
        env2.gain.linearRampToValueAtTime(0.05, t + 0.02);
        env2.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.5);

        osc1.connect(env1);
        osc2.connect(env2);
        env1.connect(this.masterGain);
        env1.connect(this.delay);    // wet send
        env2.connect(this.masterGain);

        osc1.start(t); osc1.stop(t + dur);
        osc2.start(t); osc2.stop(t + dur * 0.5);

        this._melodyStep++;

        // ── Bass note every 4 beats ──────────────────────────────────────────
        if (this._beatCount % 4 === 0) {
            const bassFreq = BASS[this._bassStep % BASS.length];
            const bassOsc  = ctx.createOscillator();
            bassOsc.type   = 'sine';
            bassOsc.frequency.value = bassFreq;

            const bassEnv = ctx.createGain();
            bassEnv.gain.setValueAtTime(0, t);
            bassEnv.gain.linearRampToValueAtTime(0.28, t + 0.12);
            bassEnv.gain.exponentialRampToValueAtTime(0.001, t + SPB * 4);

            bassOsc.connect(bassEnv);
            bassEnv.connect(this.masterGain);
            bassOsc.start(t);
            bassOsc.stop(t + SPB * 4);

            this._bassStep++;
        }

        this._beatCount++;
    }

    // ── Scheduling loop ──────────────────────────────────────────────────────
    _tick() {
        if (!this._playing) return;
        while (this._nextBeat < this.ctx.currentTime + SCHEDULE_AHEAD) {
            this._scheduleBeat(this._nextBeat);
            this._nextBeat += SPB;
        }
        this._timerId = setTimeout(() => this._tick(), LOOKAHEAD_MS);
    }

    // ── Public API ───────────────────────────────────────────────────────────
    play() {
        this._init();
        this.ctx.resume();
        this._playing  = true;
        this._nextBeat = this.ctx.currentTime + 0.05;

        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.42, this.ctx.currentTime + 3);

        this._tick();
    }

    stop() {
        this._playing = false;
        clearTimeout(this._timerId);

        if (this.masterGain) {
            const t = this.ctx.currentTime;
            this.masterGain.gain.cancelScheduledValues(t);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
            this.masterGain.gain.linearRampToValueAtTime(0, t + 1.8);
        }
    }

    toggle() {
        if (this._playing) { this.stop(); return false; }
        else               { this.play(); return true;  }
    }

    // ── Key-click synthesiser ─────────────────────────────────────────────
    // Generates a short band-passed noise burst on every keystroke.
    // isEnter=true produces a slightly deeper thud for the Enter key.
    _ensureClickBuffer() {
        if (this._clickBuffer) return;
        const dur    = 0.06; // 60ms of white noise
        const bufLen = Math.floor(this.ctx.sampleRate * dur);
        this._clickBuffer = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
        const data = this._clickBuffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    }

    playKeyClick(isEnter = false) {
        // Requires ctx to exist (init'd on first play())
        if (!this.ctx || this.ctx.state === 'suspended') return;
        this._ensureClickBuffer();

        const t = this.ctx.currentTime;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this._clickBuffer;

        // Band-pass: regular keys around 2.8 kHz, Enter lower/thicker at 1.2 kHz
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = isEnter ? 1200 : 2800;
        filter.Q.value = isEnter ? 0.7 : 1.1;

        const gain = this.ctx.createGain();
        const vol  = isEnter ? 0.22 : 0.14;
        const dur  = isEnter ? 0.032 : 0.020;
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination); // bypass masterGain → direct, always audible

        noise.start(t);
        noise.stop(t + dur);
    }
}

/** Module-level singleton — one engine for the whole app. */
export const audioEngine = new AudioEngine();
