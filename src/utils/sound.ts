/* Wooden button "tap" synthesized with the Web Audio API (no asset needed).
   A tiny noise impulse excites a few resonant band-pass modes tuned to woody
   frequencies (modal synthesis), giving a warm, hollow "tock". */
let tapAudioCtx: AudioContext | null = null;
export function playTapSound() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!tapAudioCtx) tapAudioCtx = new Ctx();
    if (tapAudioCtx.state === "suspended") void tapAudioCtx.resume();
    const ctx = tapAudioCtx;
    const now = ctx.currentTime;

    // Short noise impulse — the "strike" that excites the wood.
    const dur = 0.007;
    const size = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / size);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Keep it warm — roll off the harsh highs.
    const out = ctx.createGain();
    out.gain.value = 0.9;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3200;
    lp.connect(out).connect(ctx.destination);

    // Resonant woody modes (frequency, Q, level, decay).
    const modes = [
      { f: 210, q: 14, g: 1.0, d: 0.20 },
      { f: 560, q: 11, g: 0.55, d: 0.13 },
      { f: 1150, q: 9, g: 0.28, d: 0.08 },
    ];
    for (const m of modes) {
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = m.f;
      bp.Q.value = m.q;
      const g = ctx.createGain();
      g.gain.setValueAtTime(m.g, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + m.d);
      noise.connect(bp).connect(g).connect(lp);
    }

    noise.start(now);
    noise.stop(now + dur);
  } catch {
    /* ignore audio errors (e.g. autoplay restrictions) */
  }
}
