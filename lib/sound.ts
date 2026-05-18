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
