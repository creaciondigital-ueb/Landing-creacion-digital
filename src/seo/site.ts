/**
 * Datos del sitio compartidos por la app (useSeo) y por el generador de HTML
 * para bots (scripts/prerender.ts). Sin dependencias de React ni del DOM, para
 * que el script de Node pueda importarlo.
 *
 * SITE_URL: dominio oficial. Mientras creaciondigital.online siga apuntando al
 * servidor viejo de DigitalOcean (sitio de junio 2026), el oficial es el de
 * Netlify. Cuando el dominio apunte a Netlify, se cambia SOLO esta línea.
 */
export const SITE_URL = 'https://creaciondigital-ueb.netlify.app';
export const SITE_NAME = 'Creación Digital · Universidad El Bosque';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/programa/img/Label_UEB_CreacionDigital_Horizontal.png`;
export const APLICA_URL = 'https://www.unbosque.edu.co/inscripciones/pregrado';
export const CHARLA_URL = 'https://forms.cloud.microsoft/r/rx1NFDC8v9?origin=lprLink';

export function resolveImageUrl(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  return image.startsWith('http') ? image : `${SITE_URL}${image}`;
}
