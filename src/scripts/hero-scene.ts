// Hero 3D: one line-drawn "sheet" per project, stacked in space. The stack tilts with the pointer and
// fans out as the page scrolls. Colors come from the page tokens so it follows the light/dark theme.
import {
  BufferGeometry, Color, DoubleSide, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments,
  Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer,
} from 'three';
import { sheetLayouts } from '../data/sheet-layouts';

const WIDTH = 3.2;
const HEIGHT = 2.2;
type Segments = number[];

// Layout helpers work in 0..1 coordinates measured from the sheet's top-left corner.
const px = (u: number) => (u - 0.5) * WIDTH;
const py = (v: number) => (0.5 - v) * HEIGHT;
const line = (out: Segments, u0: number, v0: number, u1: number, v1: number) => out.push(px(u0), py(v0), 0, px(u1), py(v1), 0);
const box = (out: Segments, u0: number, v0: number, u1: number, v1: number) => {
  line(out, u0, v0, u1, v0); line(out, u1, v0, u1, v1); line(out, u1, v1, u0, v1); line(out, u0, v1, u0, v0);
};


const segments = (points: Segments) => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  return geometry;
};

// follow 'page': fans out as the page scrolls away from the top. follow 'element': starts fanned out
// and closes into a neat stack as its container rises through the viewport.
export function initHeroScene(container: HTMLElement, count: number, reducedMotion: boolean, follow: 'page' | 'element' = 'page') {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.append(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.z = 11;

  const tilt = new Group(); // leans the stack back
  const spin = new Group(); // turns it around its own axis
  tilt.add(spin);
  scene.add(tilt);

  const paper = new MeshBasicMaterial({ side: DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const outline = new LineBasicMaterial();
  const detail = new LineBasicMaterial();
  const accent = new MeshBasicMaterial({ side: DoubleSide });

  const sheets: Group[] = [];
  for (let index = 0; index < count; index++) {
    const sheet = new Group();
    sheet.add(new Mesh(new PlaneGeometry(WIDTH, HEIGHT), paper));
    const frame: Segments = [];
    box(frame, 0, 0, 1, 1);
    sheet.add(new LineSegments(segments(frame), outline));
    const inner: Segments = [];
    const layout = sheetLayouts[index % sheetLayouts.length];
    layout.lines.forEach(([u0, v0, u1, v1]) => line(inner, u0, v0, u1, v1));
    layout.boxes.forEach(([u0, v0, u1, v1]) => box(inner, u0, v0, u1, v1));
    const lines = new LineSegments(segments(inner), detail);
    lines.position.z = 0.002;
    sheet.add(lines);
    if (index === count - 1) {
      const mark = new Mesh(new PlaneGeometry(WIDTH * 0.16, HEIGHT * 0.07), accent);
      mark.position.set(px(0.84), py(0.07), 0.002);
      sheet.add(mark);
    }
    spin.add(sheet);
    sheets.push(sheet);
  }

  // Custom properties hold unresolved light-dark() values, so resolve them through a real element.
  const probe = document.createElement('span');
  probe.style.display = 'none';
  container.append(probe);
  const token = (name: string) => {
    probe.style.color = `var(${name})`;
    return new Color(getComputedStyle(probe).color);
  };
  const applyColors = () => {
    paper.color = token('--paper');
    outline.color = token('--ink');
    detail.color = token('--muted');
    accent.color = token('--accent');
  };

  const target = { pointerX: 0, pointerY: 0, scroll: 0 };
  const current = { pointerX: 0, pointerY: 0, scroll: 0, gap: 0.02 };
  const draw = (time: number) => {
    const drift = reducedMotion ? 0 : Math.sin(time / 2600) * 0.035;
    tilt.rotation.x = -1.02 + current.pointerY * 0.14;
    spin.rotation.z = 0.62 + current.pointerX * 0.3 + current.scroll * 0.7 + drift;
    tilt.position.y = follow === 'page' ? -0.15 + current.scroll * 0.9 : -0.1;
    sheets.forEach((sheet, index) => { sheet.position.z = (index - (count - 1) / 2) * current.gap; });
    renderer.render(scene, camera);
  };

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = container;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Pull the camera back on narrow canvases so the stack always fits.
    camera.position.z = camera.aspect < 1 ? 11 / camera.aspect : 11;
    camera.updateProjectionMatrix();
    draw(performance.now());
  };

  let frame = 0;
  let visible = true;
  const loop = (time: number) => {
    const ease = 0.07;
    current.pointerX += (target.pointerX - current.pointerX) * ease;
    current.pointerY += (target.pointerY - current.pointerY) * ease;
    current.scroll += (target.scroll - current.scroll) * ease;
    current.gap += (0.5 + target.scroll * 0.55 - current.gap) * 0.05;
    draw(time);
    frame = requestAnimationFrame(loop);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    if (!reducedMotion && visible && !document.hidden) frame = requestAnimationFrame(loop);
  };

  applyColors();
  if (reducedMotion) current.gap = 0.5;
  new ResizeObserver(resize).observe(container);
  new MutationObserver(() => { applyColors(); draw(performance.now()); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { applyColors(); draw(performance.now()); });

  if (!reducedMotion) {
    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      target.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      target.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
    const onScroll = () => {
      const raw = follow === 'page'
        ? window.scrollY / (window.innerHeight * 0.9)
        : (container.getBoundingClientRect().top - window.innerHeight * 0.35) / (window.innerHeight * 0.65);
      target.scroll = Math.min(1, Math.max(0, raw));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(container);
    document.addEventListener('visibilitychange', sync);
  }
  resize();
  sync();
  container.classList.add('is-ready');
}
