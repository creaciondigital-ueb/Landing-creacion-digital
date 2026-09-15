import { useEffect } from 'react';

/**
 * SEO por ruta — la SPA solo tenía un <title>/meta description estáticos
 * en index.html, compartidos por las 5 rutas (home, /proyectos,
 * /proyectos/:id, /blog, /blog/:id). Este hook los actualiza en cada
 * cambio de ruta: título, meta description, Open Graph, Twitter Card y
 * canonical. Sin dependencias nuevas — solo manipula el <head> con la
 * API nativa del DOM.
 */

export const SITE_URL = 'https://creaciondigital.online';
export const SITE_NAME = 'Creación Digital · Universidad El Bosque';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/programa/img/Label_UEB_CreacionDigital_Horizontal.png`;

interface SeoOptions {
  /** <title> y og:title / twitter:title. */
  title: string;
  /** meta description y og:description / twitter:description. */
  description: string;
  /** Ruta relativa (ej. "/blog/mi-post") — arma la URL canónica y og:url. */
  path: string;
  /** Ruta relativa a /public o URL absoluta. Si falta, usa DEFAULT_OG_IMAGE. */
  image?: string;
  type?: 'website' | 'article';
  /** Objeto para inyectar como JSON-LD (<script type="application/ld+json">). */
  jsonLd?: Record<string, unknown>;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function resolveImageUrl(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  return image.startsWith('http') ? image : `${SITE_URL}${image}`;
}

const JSONLD_ID = 'pcd-jsonld-route';

export function useSeo({ title, description, path, image, type = 'website', jsonLd }: SeoOptions) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const resolvedImage = resolveImageUrl(image);

    document.title = title;
    setMeta('name', 'description', description);

    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', resolvedImage);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', resolvedImage);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    let script = document.getElementById(JSONLD_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = JSONLD_ID;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, type, JSON.stringify(jsonLd ?? null)]);
}
