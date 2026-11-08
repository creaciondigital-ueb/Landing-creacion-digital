import { useEffect } from 'react';

/**
 * Carga diferida de fondos CSS y video (noviembre 2026, pauta en TikTok).
 *
 * `loading="lazy"` solo sirve para <img>; casi todas las imágenes de la home
 * son fondos CSS, que el navegador descarga apenas se pintan aunque estén muy
 * abajo. Antes, cada visita bajaba ~10 MB sin hacer scroll. Este hook pone la
 * imagen solo cuando el elemento se acerca a la pantalla:
 *
 * - `data-bg="url"`: se aplica como background-image.
 * - `data-init` / `data-end`: las dos ilustraciones de cada docente, como las
 *   variables --docente-init / --docente-end que usa programa.css. Al cargar
 *   una card se cargan también las dos siguientes, porque el carrusel es
 *   horizontal y las que están fuera del carrusel no cuentan como visibles.
 * - `<video data-src="url">`: se asigna el src y se reproduce.
 *
 * React no maneja el atributo style de esos elementos, así que no pisa lo que
 * pone el hook al volver a renderizar (por ejemplo, al cambiar de idioma).
 */
const SELECTOR = '[data-bg], [data-init], video[data-src]';

function load(el: HTMLElement) {
  if (el.dataset.lazyDone) return;
  el.dataset.lazyDone = '1';
  const { bg, init, end, src } = el.dataset;
  if (bg) el.style.backgroundImage = `url('${bg}')`;
  if (init) el.style.setProperty('--docente-init', `url('${init}')`);
  if (end) el.style.setProperty('--docente-end', `url('${end}')`);
  if (src && el instanceof HTMLVideoElement) {
    el.src = src;
    el.play().catch(() => { /* autoplay bloqueado: queda el póster */ });
  }
}

export function useLazyMedia(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (!('IntersectionObserver' in window)) { els.forEach(load); return; }
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        load(el);
        io.unobserve(el);
        if (el.dataset.init) {
          let next = el.nextElementSibling as HTMLElement | null;
          for (let i = 0; i < 2 && next; i++, next = next.nextElementSibling as HTMLElement | null) {
            if (next.dataset.init) load(next);
          }
        }
      }
    }, { rootMargin: '600px 0px' });
    els.forEach((el) => { if (!el.dataset.lazyDone) io.observe(el); });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
