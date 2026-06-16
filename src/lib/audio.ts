// Simple two-tone "ding" generated with WebAudio so we don't need a binary
// asset bundled. Plays nothing if AudioContext is unavailable.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

export async function playChime(): Promise<void> {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") {
    try {
      await ac.resume();
    } catch {
      return;
    }
  }
  const now = ac.currentTime;
  const tones: Array<[number, number]> = [
    [880, now],
    [1320, now + 0.16],
  ];
  for (const [freq, when] of tones) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.18, when + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.5);
    osc.connect(gain).connect(ac.destination);
    osc.start(when);
    osc.stop(when + 0.55);
  }
}
