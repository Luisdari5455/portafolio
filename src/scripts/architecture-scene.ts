import {
  BoxGeometry, BufferGeometry, Color, CylinderGeometry, EdgesGeometry, Float32BufferAttribute,
  Group, Line, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, PerspectiveCamera,
  Raycaster, Scene, Vector2, Vector3, WebGLRenderer,
} from 'three';

export interface ArchitectureController {
  select(index: number): void;
  rotate(degrees: number): void;
  expand(open: boolean): void;
  run(): void;
  reset(): void;
  dispose(): void;
}

export function createArchitectureScene(container: HTMLElement, onSelect: (index: number) => void, onComplete: () => void, onError: () => void, onStep: (step: number) => void): ArchitectureController {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.style.touchAction = 'pan-y';
  container.append(renderer.domElement);
  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, .1, 100);
  const world = new Group(); scene.add(world);
  const base = new MeshBasicMaterial();
  const screen = new MeshBasicMaterial();
  const accent = new MeshBasicMaterial();
  const edgeMaterials = Array.from({ length: 3 }, () => new LineBasicMaterial());
  const wireMaterial = new LineBasicMaterial();
  const nodes = Array.from({ length: 3 }, () => new Group());
  const selectable: Mesh[] = [];
  const geometries = new Set<BufferGeometry>();
  const materials = [base, screen, accent, ...edgeMaterials, wireMaterial];
  const events = new AbortController();
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0, expanded = false, disposed = false, frame = 0, started = 0;
  let running = false;
  let lastStep = -1;

  function add(geometry: BufferGeometry, material: MeshBasicMaterial, index: number, x: number, y: number, z: number) {
    geometries.add(geometry);
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z); mesh.userData.layer = index;
    const edges = new EdgesGeometry(geometry); geometries.add(edges);
    mesh.add(new LineSegments(edges, edgeMaterials[index]));
    nodes[index].add(mesh); selectable.push(mesh);
  }
  nodes.forEach((node, i) => { world.add(node); add(new BoxGeometry(1.9, .16, 1.4), base, i, 0, 0, 0); });
  // UI: pixel-like monitor and code strokes.
  add(new BoxGeometry(1.55, 1.05, .16), base, 0, 0, 1, 0);
  add(new BoxGeometry(1.3, .8, .04), screen, 0, 0, 1, .11);
  add(new BoxGeometry(.18, .4, .2), base, 0, 0, .3, 0);
  add(new BoxGeometry(.8, .08, .4), base, 0, 0, .12, .05);
  [0, 1, 2].forEach(i => add(new BoxGeometry(.65 - i * .12, .045, .04), accent, 0, -.12, 1.2 - i * .2, .15));
  // API: server rack with three service modules.
  add(new BoxGeometry(1.25, 1.5, .7), base, 1, 0, .85, 0);
  [0, 1, 2].forEach(i => {
    add(new BoxGeometry(1.08, .32, .05), screen, 1, 0, .4 + i * .45, .39);
    add(new BoxGeometry(.1, .1, .04), accent, 1, .36, .4 + i * .45, .44);
    add(new BoxGeometry(.5, .035, .04), accent, 1, -.15, .4 + i * .45, .44);
  });
  // Data: three low-poly storage volumes.
  [0, 1, 2].forEach(i => add(new CylinderGeometry(.67, .67, .33, 12), i === 2 ? screen : base, 2, 0, .3 + i * .4, 0));
  add(new BoxGeometry(.12, .12, .06), accent, 2, 0, 1.1, .67);
  const wireGeometry = new BufferGeometry(); geometries.add(wireGeometry);
  const wire = new Line(wireGeometry, wireMaterial); world.add(wire);
  const packetGeometry = new BoxGeometry(.15, .15, .15); geometries.add(packetGeometry);
  const packet = new Mesh(packetGeometry, accent); packet.visible = false; world.add(packet);
  const probe = document.createElement('span'); probe.hidden = true; container.append(probe);
  const token = (name: string) => { probe.style.color = `var(${name})`; return new Color(getComputedStyle(probe).color); };
  function colors() {
    base.color.copy(token('--paper')); screen.color.copy(token('--surface')); accent.color.copy(token('--accent'));
    wireMaterial.color.copy(token('--muted'));
    edgeMaterials.forEach((material, i) => material.color.copy(token(i === selected ? '--accent' : '--muted')));
  }
  function layout() {
    nodes.forEach((node, i) => {
      node.position.set((i - 1) * (expanded ? 3 : 2.45), expanded ? (i - 1) * .55 : 0, 0);
      node.scale.setScalar(i === selected ? 1.06 : 1);
    });
    const points = nodes.map(node => new Vector3(node.position.x, node.position.y + .25, .8));
    wireGeometry.setAttribute('position', new Float32BufferAttribute(points.flatMap(point => [point.x, point.y, point.z]), 3));
    wireGeometry.computeBoundingSphere();
  }
  const labels = [...container.querySelectorAll<HTMLElement>('[data-model-label]')];
  const projected = new Vector3();
  function render() {
    if (disposed || document.hidden) return;
    renderer.render(scene, camera);
    labels.forEach((label, i) => {
      projected.set(0, 2.05, 0); nodes[i].localToWorld(projected); projected.project(camera);
      label.style.left = ((projected.x + 1) * container.clientWidth / 2) + 'px';
      label.style.top = ((1 - projected.y) * container.clientHeight / 2) + 'px';
    });
  }
  function resize() {
    const width = container.clientWidth, height = container.clientHeight;
    if (!width || !height || disposed) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.set(0, 4.5, Math.max(11.5, 15 / camera.aspect));
    camera.lookAt(0, .65, 0); camera.updateProjectionMatrix(); render();
  }
  function finish() {
    cancelAnimationFrame(frame); frame = 0; packet.visible = false;
    const notify = running; running = false;
    render(); if (notify) onComplete();
  }
  function animate(time: number) {
    if (disposed || document.hidden || motion.matches) { finish(); return; }
    const elapsed = Math.min((time - started) / 1400, 4);
    const route = [0, 1, 2, 1, 0];
    const segment = Math.min(3, Math.floor(elapsed));
    if (segment !== lastStep) { lastStep = segment; onStep(segment); onSelect(route[segment]); }
    const from = nodes[route[segment]].position, to = nodes[route[segment + 1]].position;
    packet.position.lerpVectors(from, to, elapsed - segment); packet.position.y += .25; packet.position.z = .8;
    packet.rotation.set(time * .002, time * .003, 0);
    render();
    if (elapsed >= 4) finish(); else frame = requestAnimationFrame(animate);
  }
  const raycaster = new Raycaster(); const pointer = new Vector2();
  let pointerStart: { x: number; y: number } | null = null;
  renderer.domElement.addEventListener('pointerdown', event => { pointerStart = { x: event.clientX, y: event.clientY }; }, { signal: events.signal });
  renderer.domElement.addEventListener('pointercancel', () => { pointerStart = null; }, { signal: events.signal });
  renderer.domElement.addEventListener('pointerup', event => {
    if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 7) { pointerStart = null; return; }
    pointerStart = null;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(selectable, false)[0];
    if (hit) onSelect(Number(hit.object.userData.layer));
  }, { signal: events.signal });
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); onError(); }, { signal: events.signal });
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container);
  const themeObserver = new MutationObserver(() => { colors(); render(); });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const onMotion = () => { if (motion.matches) finish(); };
  motion.addEventListener('change', onMotion);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); else render(); }, { signal: events.signal });
  const visibility = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) finish(); }); visibility.observe(container);
  world.rotation.y = -.12;
  colors(); layout(); resize();
  return {
    select(index) { selected = Math.max(0, Math.min(2, index)); colors(); layout(); render(); },
    rotate(degrees) { world.rotation.y = degrees * Math.PI / 180 - .12; render(); },
    expand(open) { expanded = open; layout(); render(); },
    run() { finish(); lastStep = -1; running = true; if (motion.matches) { finish(); return; } packet.visible = true; started = performance.now(); frame = requestAnimationFrame(animate); },
    reset() { finish(); selected = 0; expanded = false; world.rotation.y = -.12; colors(); layout(); render(); },
    dispose() {
      if (disposed) return; disposed = true; cancelAnimationFrame(frame); events.abort();
      resizeObserver.disconnect(); themeObserver.disconnect(); visibility.disconnect(); motion.removeEventListener('change', onMotion);
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
      renderer.dispose(); renderer.domElement.remove(); probe.remove();
    },
  };
}
