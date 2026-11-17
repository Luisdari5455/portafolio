import type { ArchitectureController } from './architecture-scene';
export function setupArchitectureLab(lab: HTMLElement) {
  const start = lab.querySelector<HTMLButtonElement>('[data-architecture-start]')!;
  const run = lab.querySelector<HTMLButtonElement>('[data-architecture-run]')!;
  const tabs = [...lab.querySelectorAll<HTMLButtonElement>('[data-architecture-select]')];
  const panels = [...lab.querySelectorAll<HTMLElement>('[data-architecture-panel]')];
  const steps = [...lab.querySelectorAll<HTMLElement>('[data-request-step]')];
  const angle = lab.querySelector<HTMLInputElement>('[data-architecture-angle]')!;
  const expand = lab.querySelector<HTMLInputElement>('[data-architecture-expand]')!;
  const show = (key: string, visible: boolean) => { const el = lab.querySelector<HTMLElement>(`[data-${key}]`); if (el) el.hidden = !visible; };
  let controller: ArchitectureController | undefined;
  let selected = 0;
  let loading = false;
  let disposed = false;
  let fallbackTimer = 0;
  const select = (index: number) => {
    selected = index;
    tabs.forEach((tab, i) => tab.setAttribute('aria-pressed', String(i === index)));
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    controller?.select(index);
  };
  const step = (index: number) => {
    lab.querySelectorAll<HTMLElement>('[data-scene-step]').forEach((item, i) => { item.hidden = i !== index; });
    steps.forEach((item, i) => {
    item.toggleAttribute('data-active', i === index);
    if (i === index) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
    });
  };
  const flow = (state: 'ready' | 'running' | 'done') => {
    ['ready', 'running', 'done'].forEach(key => show(`flow-${key}`, key === state));
    run.disabled = state === 'running';
    show('architecture-result', state === 'done');
    if (state !== 'running') step(-1);
  };
  const complete = () => { select(0); flow('done'); };
  const fail = () => {
    controller?.dispose(); controller = undefined;
    show('architecture-error', true); show('architecture-fallback', true);
    show('architecture-hint', false); show('architecture-controls', false); show('architecture-run', true);
    show('architecture-labels', false);
    flow('ready');
  };
  const simulate = () => {
    window.clearTimeout(fallbackTimer);
    flow('running');
    if (controller) { controller.run(); return; }
    // The same explanation remains interactive when WebGL is unavailable.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { complete(); return; }
    let index = 0;
    const advance = () => {
      if (disposed) return;
      if (index === 4) { complete(); return; }
      step(index); select([0, 1, 2, 1][index]); index++;
      fallbackTimer = window.setTimeout(advance, 1400);
    };
    advance();
  };
  select(0);
  show('architecture-tabs', true);
  start.hidden = false;
  tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
  start.addEventListener('click', async () => {
    if (controller || loading) return;
    loading = true; start.hidden = true; show('architecture-loading', true);
    try {
      const { createArchitectureScene } = await import('./architecture-scene');
      if (disposed) return;
      controller = createArchitectureScene(lab.querySelector<HTMLElement>('[data-architecture-stage]')!, select, complete, fail, step);
      controller.select(selected);
      show('architecture-fallback', false); show('architecture-controls', true); show('architecture-run', true); show('architecture-hint', true); show('architecture-labels', true);
    } catch { fail(); }
    finally { loading = false; show('architecture-loading', false); }
    if (!disposed) simulate();
  });
  angle.addEventListener('input', () => controller?.rotate(Number(angle.value)));
  expand.addEventListener('change', () => controller?.expand(expand.checked));
  lab.querySelector('[data-architecture-reset]')?.addEventListener('click', () => {
    window.clearTimeout(fallbackTimer);
    angle.value = '0'; expand.checked = false;
    controller?.reset(); select(0); flow('ready');
  });
  run.addEventListener('click', simulate);
  window.addEventListener('pagehide', event => { if (!event.persisted) { disposed = true; window.clearTimeout(fallbackTimer); controller?.dispose(); } });
}
