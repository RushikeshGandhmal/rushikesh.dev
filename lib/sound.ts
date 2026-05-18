/**
 * Minimal Web Audio chime — no external assets, no dependencies.
 *
 * Plays a tiny three-note arpeggio when the user switches themes:
 *   - light: ascending E5 → A5 → C6 (open, bright)
 *   - dark:  descending C6 → A5 → E5 (warm, settling)
 *
 * Frequencies are sine waves with a soft attack/release envelope so the
 * chime sounds like a wooden marimba rather than a beep. Volume is
 * intentionally low (~7%) so it never startles. Honours
 * prefers-reduced-motion as a proxy for "user wants less stuff happening."
 */

type Theme = "light" | "dark";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      (window as unknown as { AudioContext?: typeof AudioContext })
        .AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * Play the theme-switch chime. Called *with the destination theme* —
 * i.e. the theme the user is moving to.
 */
export function playThemeChime(to: Theme): void {
  if (prefersReducedMotion()) return;
  const audio = getCtx();
  if (!audio) return;

  // E5, A5, C6 — major-sixth flavoured arpeggio, very sweet on a sine.
  const ASC = [659.25, 880.0, 1046.5];
  const DESC = [1046.5, 880.0, 659.25];
  const notes = to === "light" ? ASC : DESC;

  const now = audio.currentTime;
  const noteGap = 0.085; // 85ms between notes
  const noteLen = 0.55; // each note rings for ~550ms

  notes.forEach((freq, i) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    // a tiny second oscillator one octave up gives the chime a "glass" shimmer
    const shimmer = audio.createOscillator();
    const shimmerGain = audio.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(freq * 2, now);

    const start = now + i * noteGap;
    const peak = start + 0.012;
    const end = start + noteLen;

    // Body envelope
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.07, peak);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    // Shimmer envelope — quieter and shorter
    shimmerGain.gain.setValueAtTime(0, start);
    shimmerGain.gain.linearRampToValueAtTime(0.018, peak);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, start + noteLen * 0.55);

    osc.connect(gain).connect(audio.destination);
    shimmer.connect(shimmerGain).connect(audio.destination);

    osc.start(start);
    osc.stop(end + 0.02);
    shimmer.start(start);
    shimmer.stop(start + noteLen * 0.6);
  });
}

/**
 * A low, cinematic "boom" — the impact accent for the theme blast.
 * Sub-bass sine sweep (90Hz → 35Hz) + a high-passed noise crack.
 * Designed to layer underneath playThemeChime() without clashing.
 *
 * Total length ~320ms. Volume capped so it's felt more than heard.
 */
export function playBoom(): void {
  if (prefersReducedMotion()) return;
  const audio = getCtx();
  if (!audio) return;

  const now = audio.currentTime;

  // 1. Sub thump — sine sweeping down, the "felt" part of the boom.
  const sub = audio.createOscillator();
  const subGain = audio.createGain();
  sub.type = "sine";
  sub.frequency.setValueAtTime(90, now);
  sub.frequency.exponentialRampToValueAtTime(35, now + 0.12);
  subGain.gain.setValueAtTime(0, now);
  subGain.gain.linearRampToValueAtTime(0.18, now + 0.005);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
  sub.connect(subGain).connect(audio.destination);
  sub.start(now);
  sub.stop(now + 0.34);

  // 2. Crack — short filtered noise burst, gives the boom its bite.
  const noiseLen = 0.12;
  const sampleCount = Math.floor(audio.sampleRate * noiseLen);
  const buffer = audio.createBuffer(1, sampleCount, audio.sampleRate);
  const ch = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    ch[i] = (Math.random() * 2 - 1) * (1 - i / sampleCount);
  }
  const noise = audio.createBufferSource();
  noise.buffer = buffer;

  const hpf = audio.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 1200;

  const noiseGain = audio.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.003);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + noiseLen);

  noise.connect(hpf).connect(noiseGain).connect(audio.destination);
  noise.start(now);
  noise.stop(now + noiseLen + 0.02);
}

/**
 * A soft sea-wave whoosh — the soulful accent for the theme transition.
 *
 *   1. Brown noise (1/f² – deep, water-like rumble) routed through a
 *      lowpass biquad whose cutoff rides 250 Hz → 1.8 kHz → 350 Hz.
 *      That's the *shape* of a wave: muffled rumble building offshore,
 *      bright crash as it crests, foamy hiss as it recedes.
 *   2. A sub-bass sine swell (45-55 Hz) carrying the body of the wave —
 *      felt more than heard, adds the gentle "pull" of water mass.
 *   3. A faint shimmer layer (highpassed brown noise) on the tail —
 *      the spritzy foam fizz after the wave breaks.
 *
 * Volume capped so it never startles. ~1.4s total — matches the visual
 * theme-blast-reveal keyframe.
 */
export function playSeaWave(to: Theme): void {
  if (prefersReducedMotion()) return;
  const audio = getCtx();
  if (!audio) return;

  const now = audio.currentTime;
  const duration = 1.4;
  const peak = 0.62; // when the wave is at its loudest

  // --- 1. The whoosh — brown noise through an opening/closing lowpass ---
  const length = Math.floor(audio.sampleRate * duration);
  const buf = audio.createBuffer(1, length, audio.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    // Brown noise: integrate white noise, clamp to prevent drift.
    const white = Math.random() * 2 - 1;
    last = (last + 0.018 * white) / 1.018;
    data[i] = last * 3.6;
  }
  const noise = audio.createBufferSource();
  noise.buffer = buf;

  const lpf = audio.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.Q.value = 0.7;
  lpf.frequency.setValueAtTime(250, now);
  lpf.frequency.exponentialRampToValueAtTime(1800, now + peak);
  lpf.frequency.exponentialRampToValueAtTime(360, now + duration);

  const noiseGain = audio.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.14, now + peak);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(lpf).connect(noiseGain).connect(audio.destination);
  noise.start(now);
  noise.stop(now + duration + 0.05);

  // --- 2. The swell — sub-bass sine, the *body* of the wave -------------
  // Slightly deeper going to dark, slightly higher going to light — so the
  // transition has a tonal direction matching the mood.
  const sub = audio.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(to === "dark" ? 45 : 55, now);

  const subGain = audio.createGain();
  subGain.gain.setValueAtTime(0, now);
  subGain.gain.linearRampToValueAtTime(0.05, now + peak);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  sub.connect(subGain).connect(audio.destination);
  sub.start(now);
  sub.stop(now + duration + 0.05);

  // --- 3. The fizz — highpassed brown noise on the tail (foam) ----------
  const fizzNoise = audio.createBufferSource();
  fizzNoise.buffer = buf; // re-use the brown noise buffer
  const hpf = audio.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 3200;

  const fizzGain = audio.createGain();
  // Peaks slightly AFTER the main whoosh — so the foam follows the wave.
  fizzGain.gain.setValueAtTime(0, now);
  fizzGain.gain.linearRampToValueAtTime(0.035, now + peak + 0.18);
  fizzGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  fizzNoise.connect(hpf).connect(fizzGain).connect(audio.destination);
  fizzNoise.start(now);
  fizzNoise.stop(now + duration + 0.05);
}
