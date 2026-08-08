// Site-wide procedural interface sounds. Mirrors the theme system's pattern:
// mute state lives on document.documentElement.dataset.sound ("muted"|"unmuted")
// so playSound() can read it without prop-drilling or a React context. The
// SoundInitializerScript sets the attribute pre-hydration from localStorage;
// the radial Menu toggle flips it via setMuted().
//
// Single shared AudioContext (lazy-created) replaces the old per-call ctx from
// ProjectSection — fixes the autoplay-policy gap via resume() on unmute and
// avoids spinning up a fresh context for every hover tick.

export type SoundType = "hover" | "select" | "toggle";

let ctx: AudioContext | null = null;
let autoResumeInstalled = false;

// Debounce window for hover ticks. Sweeping across several CircleButtons in
// quick succession would otherwise fire one tick per icon; this collapses
// repeated hovers within the window into a single sound. Only "hover" is
// gated — "select" and "toggle" should always fire on explicit intent.
const HOVER_DEBOUNCE_MS = 150;
let lastHoverTime = 0;

// mouseenter (what playSound callers use) is NOT a user-activation event per
// Chrome's autoplay policy — only click/pointerdown/keydown unlock audio. On a
// refresh where the user was already unmuted (localStorage), the lazy
// AudioContext is created suspended on the first hover and can't be resumed
// from there. So the first time we create a context, we attach one-shot
// listeners for the real gesture events; the next click/keydown anywhere on
// the page transitions the context to "running", and all subsequent hover
// sounds are audible.
function installAutoResume(audioCtx: AudioContext): void {
  if (autoResumeInstalled || typeof window === "undefined") return;
  autoResumeInstalled = true;
  const resume = () => {
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  };
  window.addEventListener("pointerdown", resume, { passive: true });
  window.addEventListener("keydown", resume, { passive: true });
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    ctx = new Ctor();
    installAutoResume(ctx);
  }
  return ctx;
}

export function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  return document.documentElement.dataset.sound !== "unmuted";
}

export function setMuted(next: boolean): void {
  if (typeof window === "undefined") return;
  document.documentElement.dataset.sound = next ? "muted" : "unmuted";
  try {
    localStorage.setItem("sound-muted", String(next));
  } catch {
    // storage disabled (private mode / cookies off) — DOM attribute still works in-session
  }
  // Resume on unmute. The click that triggered this is a user gesture, so the
  // autoplay policy allows the context to leave the "suspended" state here.
  if (!next) {
    const c = getCtx();
    if (c && c.state === "suspended") c.resume().catch(() => {});
  }
}

export function toggleSound(): void {
  // willUnmute is true when currently muted → toggling toward unmuted.
  const willUnmute = isMuted();
  setMuted(!willUnmute);
  // Confirmation beep only on unmute — when muting, no sound should play.
  // After setMuted(false), the DOM reads "unmuted" so playSound passes the gate.
  if (willUnmute) playSound("toggle");
}

// Oscillator configs preserved verbatim from the former ProjectSection inline
// helper — same waveforms, frequency sweeps, gain envelopes, and bandpass filter.
export function playSound(type: SoundType): void {
  if (isMuted()) return;
  if (type === "hover") {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - lastHoverTime < HOVER_DEBOUNCE_MS) return;
    lastHoverTime = now;
  }
  const c = getCtx();
  if (!c) return;
  // Belt-and-suspenders: after the page has sticky activation (any prior
  // click/keydown), a suspended ctx (e.g. after tab switch) can be resumed
  // even from a non-gesture handler. The initial unlock is handled by
  // installAutoResume's pointerdown/keydown listeners.
  if (c.state === "suspended") c.resume().catch(() => {});
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.connect(gain);
    gain.connect(c.destination);

    if (type === "hover") {
      // Futuristic click/tick
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.08);
      gain.gain.setValueAtTime(0.03, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, c.currentTime + 0.08);
      osc.start();
      osc.stop(c.currentTime + 0.08);
    } else if (type === "select") {
      // Sci-fi energy sweep
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.25);

      const filter = c.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 6;
      filter.frequency.setValueAtTime(180, c.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1800, c.currentTime + 0.25);

      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);

      gain.gain.setValueAtTime(0.05, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);

      osc.start();
      osc.stop(c.currentTime + 0.25);
    } else if (type === "toggle") {
      // Futuristic slide toggle beep
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, c.currentTime);
      osc.frequency.setValueAtTime(780, c.currentTime + 0.06);
      gain.gain.setValueAtTime(0.02, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.002, c.currentTime + 0.15);
      osc.start();
      osc.stop(c.currentTime + 0.15);
    }
  } catch (e) {
    console.warn("AudioContext playback interrupted:", e);
  }
}
