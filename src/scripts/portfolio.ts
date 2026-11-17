import { translateCopy } from '../i18n/portfolio';
// Progressive enhancement: all content is readable without JavaScript.
const root = document.documentElement;

// Theme: the inline head script resolves the initial value; this keeps the toggle and system changes in sync.
const themeButton = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const storedTheme = () => {
  try { return localStorage.getItem('portfolio-theme'); } catch { return null; }
};
const applyTheme = (theme: string) => {
  root.dataset.theme = theme;
  const dark = theme === 'dark';
  if (themeMeta) themeMeta.content = dark ? '#111110' : '#fbfaf8';
  if (themeButton) {
    const label = translateCopy(dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro', root.lang === 'en' ? 'en' : 'es');
    themeButton.setAttribute('aria-label', label);
    themeButton.title = label;
  }
};
if (themeButton) themeButton.hidden = false;
applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
themeButton?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('portfolio-theme', next); } catch { /* The choice still applies to this visit. */ }
  applyTheme(next);
});
systemDark.addEventListener('change', event => {
  if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light');
});

// Navbar: scrolled state, mobile menu and current-section highlight.
const nav = document.querySelector<HTMLElement>('[data-nav]');
const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const setMenu = (open: boolean) => {
  if (!nav || !menuButton) return;
  nav.toggleAttribute('data-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', translateCopy(open ? 'Cerrar menú' : 'Abrir menú', root.lang === 'en' ? 'en' : 'es'));
};
document.addEventListener('portfolio:theme', () => applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light'));
document.addEventListener('portfolio:language', () => { applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light'); setMenu(Boolean(nav?.hasAttribute('data-open'))); });
menuButton?.addEventListener('click', () => setMenu(!nav?.hasAttribute('data-open')));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.hasAttribute('data-open')) { setMenu(false); menuButton?.focus(); }
});
document.addEventListener('click', event => {
  if (nav?.hasAttribute('data-open') && !nav.contains(event.target as Node)) setMenu(false);
});
const navLinks = document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]');
navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
if (nav) {
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none';
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => nav.classList.toggle('is-scrolled', !entry.isIntersecting)).observe(sentinel);
}
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      if (link.dataset.navLink === entry.target.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach(link => {
  const section = document.getElementById(link.dataset.navLink ?? '');
  if (section) spy.observe(section);
});

// Motion extras load only when the visitor has not asked for reduced motion.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero 3D scene: three.js is fetched on demand so it never blocks the first paint.
const scenes = document.querySelectorAll<HTMLElement>('[data-hero-scene]');
if (scenes.length) {
  import('./hero-scene')
    .then(({ initHeroScene }) => scenes.forEach(scene => {
      // No WebGL: the section simply stays text-only.
      try { initHeroScene(scene, Number(scene.dataset.heroScene) || 4, reducedMotion, scene.dataset.sceneFollow === 'element' ? 'element' : 'page'); } catch { scene.hidden = true; }
    }))
    .catch(() => scenes.forEach(scene => { scene.hidden = true; }));
}

// Rows settle into place as they enter the viewport.
if (!reducedMotion) {
  const revealed = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealed.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll<HTMLElement>('.project, .steps li, .timeline-item').forEach(element => {
    element.classList.add('reveal');
    revealed.observe(element);
  });
}

// Project thumbnails lean toward the pointer (mouse only).
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
if (!reducedMotion) {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach(row => {
    const card = row.querySelector<HTMLElement>('.thumb-card, .timeline-card');
    if (!card) return;
    let frame = 0;
    row.addEventListener('pointermove', event => {
      if (!finePointer.matches || event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / rect.width));
        const y = Math.max(-1, Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / rect.height));
        row.classList.add('is-tilting');
        const strength = card.classList.contains('timeline-card') ? 0.45 : 1;
        card.style.setProperty('--ry', `${x * 16 * strength}deg`);
        card.style.setProperty('--rx', `${-y * 14 * strength}deg`);
      });
    });
    row.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      row.classList.remove('is-tilting');
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
}

// Timeline: the accent line grows with the scroll and each dot fills once it has been passed.
const timelineList = document.querySelector<HTMLElement>('[data-timeline]');
if (timelineList) {
  const items = timelineList.querySelectorAll<HTMLElement>('.timeline-item');
  let queued = false;
  const update = () => {
    queued = false;
    const rect = timelineList.getBoundingClientRect();
    const marker = window.innerHeight * 0.6;
    const progress = reducedMotion ? 1 : Math.max(0, Math.min(1, (marker - rect.top) / rect.height));
    timelineList.style.setProperty('--progress', `${progress * 100}%`);
    items.forEach(item => item.classList.toggle('is-past', reducedMotion || item.getBoundingClientRect().top < marker));
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  update();
}

// One scheduled update per frame; mobile uses gentler decorative depth.
const depthQuery = matchMedia('(prefers-reduced-motion: no-preference)');
const drifting = [...document.querySelectorAll<HTMLElement>('[data-parallax]')].map(element => ({ element, factor: Number(element.dataset.parallax) || 0, offset: 0 }));
const leaning = [...document.querySelectorAll<HTMLElement>('[data-scroll-pos]')];
const chapters = [...document.querySelectorAll<HTMLElement>('main > .section')];
const heroScene = document.querySelector<HTMLElement>('.hero-scene');
let depthFrame = 0;
function updateDepth() {
  depthFrame = 0;
  if (!depthQuery.matches || document.hidden) return;
  const viewport = window.innerHeight;
  const middle = viewport / 2;
  // Collect layout reads before writing styles to avoid repeated layout work.
  const driftValues = drifting.map(item => {
    const rect = item.element.getBoundingClientRect();
    const top = rect.top - item.offset;
    return top > viewport + 120 || top + rect.height < -120 ? null : Math.max(-54, Math.min(54, (top + rect.height / 2 - middle) * item.factor * 1.5));
  });
  const leanValues = leaning.map(element => {
    const rect = (element.parentElement ?? element).getBoundingClientRect();
    return rect.top > viewport + 120 || rect.bottom < -120 ? null : Math.max(-.6, Math.min(.6, (rect.top + rect.height / 2 - middle) / middle));
  });
  const chapterValues = chapters.map(element => {
    const rect = element.getBoundingClientRect();
    return rect.top > viewport || rect.bottom < 0 ? null : Math.max(-64, Math.min(64, (middle - rect.top) * .12));
  });
  const heroRect = heroScene?.parentElement?.getBoundingClientRect();
  drifting.forEach((item, index) => {
    const raw = driftValues[index];
    if (raw === null) return;
    const value = raw * (innerWidth <= 860 ? .4 : 1);
    item.offset = value;
    item.element.style.setProperty('--py', `${value.toFixed(1)}px`);
  });
  leaning.forEach((element, index) => { if (leanValues[index] !== null) element.style.setProperty('--pos', leanValues[index]!.toFixed(3)); });
  chapters.forEach((element, index) => { if (chapterValues[index] !== null) element.style.setProperty('--chapter-y', `${chapterValues[index]!.toFixed(1)}px`); });
  if (heroScene && heroRect && heroRect.bottom > 0) heroScene.style.setProperty('--scene-y', `${Math.max(-65, Math.min(65, -heroRect.top * .16)).toFixed(1)}px`);
}
function requestDepth() {
  if (depthQuery.matches && !document.hidden && !depthFrame) depthFrame = requestAnimationFrame(updateDepth);
}
function syncDepth() {
  cancelAnimationFrame(depthFrame);
  depthFrame = 0;
  drifting.forEach(item => { item.offset = 0; item.element.style.removeProperty('--py'); });
  leaning.forEach(element => element.style.removeProperty('--pos'));
  chapters.forEach(element => element.style.removeProperty('--chapter-y'));
  heroScene?.style.removeProperty('--scene-y');
  requestDepth();
}
depthQuery.addEventListener('change', syncDepth);
window.addEventListener('scroll', requestDepth, { passive: true });
window.addEventListener('resize', requestDepth);
document.addEventListener('visibilitychange', syncDepth);
requestDepth();

