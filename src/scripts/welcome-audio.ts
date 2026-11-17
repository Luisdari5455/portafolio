// Original looping ambient score, generated locally without recordings or downloads.
export function setupWelcomeAudio() {
  const button = document.querySelector<HTMLButtonElement>('[data-sound-control]');
  const preference = document.querySelector<HTMLInputElement>('[data-welcome-sound]');
  if (!button || !preference || !window.AudioContext) return;
  let context: AudioContext | undefined;
  let source: AudioBufferSourceNode | undefined;
  let gain: GainNode | undefined;
  let score: AudioBuffer | undefined;
  let playing = false;
  let generation = 0;
  let resumeOnVisible = false;
  try { preference.checked = localStorage.getItem('portfolio-sound') !== 'off'; } catch { /* Optional storage. */ }
  const save = () => { try { localStorage.setItem('portfolio-sound', preference.checked ? 'on' : 'off'); } catch { /* Optional storage. */ } };
  const sync = (error = false) => {
    button.setAttribute('aria-pressed', String(playing));
    button.querySelector<HTMLElement>('[data-sound-idle]')!.hidden = playing || error;
    button.querySelector<HTMLElement>('[data-sound-playing]')!.hidden = !playing;
    button.querySelector<HTMLElement>('[data-sound-error]')!.hidden = !error;
  };
  const stop = () => {
    generation++;
    if (context && source && gain) {
      const retiringSource = source, retiringGain = gain;
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setTargetAtTime(0, context.currentTime, .06);
      try { source.stop(context.currentTime + .3); } catch { /* Already stopped. */ }
      retiringSource.onended = () => { retiringSource.disconnect(); retiringGain.disconnect(); };
    }
    source = undefined; gain = undefined; playing = false; sync();
  };
  const createScore = (ctx: AudioContext) => {
    const rate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, rate * 24, rate);
    const channels = [buffer.getChannelData(0), buffer.getChannelData(1)];
    const note = (pitch: number, start: number, duration: number, level: number, pan: number) => {
      const frequency = 440 * 2 ** ((pitch - 69) / 12);
      for (let i = 0; i < duration * rate; i++) {
        const t = i / rate;
        const envelope = Math.min(1, t / .15) * Math.exp(-t * 1.15) * Math.min(1, (duration - t) / .3);
        const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * level;
        const index = (Math.floor(start * rate) + i) % buffer.length;
        channels[0][index] += sample * (1 - pan * .3);
        channels[1][index] += sample * (1 + pan * .3);
      }
    };
    [62,69,74,78,76,69,66,74,62,66,69,76,74,69,66,62].forEach((pitch, i) => note(pitch, i * 1.5, 4.5, .13, i % 2 ? .5 : -.5));
    [50,57,54,57].forEach((pitch, i) => note(pitch, i * 6, 7, .09, 0));
    return buffer;
  };
  const play = async () => {
    stop(); const current = generation;
    try {
      context ??= new AudioContext();
      await context.resume();
      if (generation !== current || document.hidden) return;
      if (context.state !== 'running') { sync(true); return; }
      score ??= createScore(context);
      source = context.createBufferSource(); source.buffer = score; source.loop = true;
      gain = context.createGain(); gain.gain.setValueAtTime(0, context.currentTime); gain.gain.linearRampToValueAtTime(.3, context.currentTime + 1.5);
      source.connect(gain); gain.connect(context.destination); source.start(); playing = true; sync();
    } catch { if (generation === current) { stop(); sync(true); } }
  };
  button.hidden = false;
  button.addEventListener('click', () => {
    resumeOnVisible = false;
    if (playing) { preference.checked = false; save(); stop(); }
    else { preference.checked = true; save(); void play(); }
  });
  preference.addEventListener('change', () => { save(); if (!preference.checked) { resumeOnVisible = false; stop(); } });
  document.querySelector('[data-welcome-enter]')?.addEventListener('click', () => { if (preference.checked) void play(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { resumeOnVisible = playing; stop(); }
    else if (resumeOnVisible && preference.checked) { resumeOnVisible = false; void play(); }
  });
  window.addEventListener('pagehide', () => { resumeOnVisible = false; stop(); void context?.close().catch(() => {}); context = undefined; score = undefined; });
}
