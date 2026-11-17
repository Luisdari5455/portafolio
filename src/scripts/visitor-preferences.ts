import { translateCopy } from '../i18n/portfolio';
type Language = 'es' | 'en';
const root = document.documentElement;
const dialog = document.querySelector<HTMLDialogElement>('[data-welcome]');
const triggers = document.querySelectorAll<HTMLButtonElement>('[data-open-welcome]');
const textSources = new Map<Text, string>();
const attributeSources: Array<{ element: Element; name: string; value: string }> = [];
let language: Language = 'es';
let opener: HTMLElement | null = null;
let prepared = false;
const read = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const save = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch { /* Preferences remain active for this visit. */ } };

// Keep original text nodes so switching languages never removes icons or event handlers.
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
  acceptNode(node) {
    const parent = node.parentElement;
    return parent && !parent.closest('script, style, svg, [aria-hidden="true"]') && node.textContent?.trim()
      ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
  },
});
while (walker.nextNode()) textSources.set(walker.currentNode as Text, walker.currentNode.textContent ?? '');
document.querySelectorAll('[aria-label], [title], img[alt]').forEach(element => {
  ['aria-label', 'title', 'alt'].forEach(name => {
    const value = element.getAttribute(name);
    if (value) attributeSources.push({ element, name, value });
  });
});
const baseTitle = document.title;
function setLanguage(next: Language) {
  language = next;
  root.lang = next;
  textSources.forEach((value, node) => { node.textContent = translateCopy(value, next); });
  attributeSources.forEach(({ element, name, value }) => element.setAttribute(name, translateCopy(value, next)));
  document.title = translateCopy(baseTitle, next);
  save('portfolio-language', next);
  document.dispatchEvent(new CustomEvent('portfolio:language'));
}
function setTheme(theme: 'light' | 'dark') {
  root.dataset.theme = theme;
  save('portfolio-theme', theme);
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#111110' : '#fbfaf8';
  document.dispatchEvent(new CustomEvent('portfolio:theme'));
}
function syncInputs() {
  dialog?.querySelectorAll<HTMLInputElement>('input[name="visit-language"]').forEach(input => { input.checked = input.value === language; });
  dialog?.querySelectorAll<HTMLInputElement>('input[name="visit-theme"]').forEach(input => { input.checked = input.value === root.dataset.theme; });
}
function revealOptions() {
  prepared = true;
  const loading = dialog?.querySelector<HTMLElement>('[data-welcome-loading]');
  const options = dialog?.querySelector<HTMLElement>('[data-welcome-options]');
  if (loading) loading.hidden = true;
  if (options) options.hidden = false;
  if (dialog?.open) dialog.querySelector<HTMLInputElement>('input[name="visit-language"]:checked')?.focus();
}
function openWelcome(trigger?: HTMLElement) {
  if (!dialog || dialog.open) return;
  opener = trigger ?? null;
  syncInputs();
  dialog.showModal();
  if (prepared) dialog.querySelector<HTMLInputElement>('input[name="visit-language"]:checked')?.focus();
}
function finish() {
  if (!dialog) return;
  save('portfolio-welcomed', '1');
  dialog.close();
}
setLanguage(read('portfolio-language') === 'en' ? 'en' : 'es');
triggers.forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => { revealOptions(); openWelcome(button); });
});
dialog?.querySelectorAll<HTMLInputElement>('input[name="visit-language"]').forEach(input => input.addEventListener('change', () => {
  if (input.checked) setLanguage(input.value === 'en' ? 'en' : 'es');
}));
dialog?.querySelectorAll<HTMLInputElement>('input[name="visit-theme"]').forEach(input => input.addEventListener('change', () => {
  if (input.checked) setTheme(input.value === 'dark' ? 'dark' : 'light');
}));
dialog?.querySelector('[data-welcome-enter]')?.addEventListener('click', finish);
dialog?.querySelector('[data-welcome-close]')?.addEventListener('click', finish);
dialog?.addEventListener('cancel', () => save('portfolio-welcomed', '1'));
dialog?.addEventListener('close', () => {
  (opener ?? document.querySelector<HTMLElement>('#contenido'))?.focus({ preventScroll: true });
});
// The initial pixel splash runs inline; the preference dialog follows it, never overlaps it.
function afterBoot() {
  revealOptions();
  if (!read('portfolio-welcomed')) openWelcome();
}
if (root.classList.contains('boot-done')) afterBoot();
else document.addEventListener('portfolio:booted', afterBoot, { once: true });
