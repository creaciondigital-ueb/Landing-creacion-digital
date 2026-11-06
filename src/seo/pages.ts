/**
 * Título, descripción y JSON-LD de cada ruta. Una sola fuente para la app
 * (las páginas se los pasan a useSeo) y para scripts/prerender.ts, que los
 * escribe en el HTML estático que leen los bots que no ejecutan JavaScript.
 */
import type { BlogPost } from '../data/blog';
import type { Proyecto } from '../data/proyectos';
import { SITE_URL, SITE_NAME, resolveImageUrl } from './site';

type Lang = 'es' | 'en';
type JsonLd = Record<string, unknown>;
export interface PageSeo {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: JsonLd;
}

const HOME_DESCRIPTION: Record<Lang, string> = {
  es: 'Pregrado en Creación Digital de la Universidad El Bosque, Bogotá. Formamos profesionales que orquestan código, contenido, narrativa y negocio, con profesores de la industria tech y la inteligencia artificial como herramienta diaria.',
  en: 'Digital Creation undergraduate program at Universidad El Bosque, Bogotá. We train professionals who orchestrate code, content, narrative and business, with teachers from the tech industry and AI as an everyday tool.',
};
const BLOG_DESCRIPTION: Record<Lang, string> = {
  es: 'Noticias, logros y eventos del programa de Creación Digital de la Universidad El Bosque.',
  en: 'News, achievements and events from the Digital Creation program at Universidad El Bosque.',
};
const PROYECTOS_DESCRIPTION: Record<Lang, string> = {
  es: 'Descubre los proyectos creados por estudiantes del programa de Creación Digital de la Universidad El Bosque: investigación, identidad de marca, UX y más.',
  en: 'Discover the projects built by Digital Creation students at Universidad El Bosque: research, brand identity, UX and more.',
};

export function homeSeo(lang: Lang): PageSeo {
  return {
    title: SITE_NAME,
    description: HOME_DESCRIPTION[lang],
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'EducationalOccupationalProgram',
      name: lang === 'en' ? 'Digital Creation (undergraduate)' : 'Pregrado en Creación Digital',
      description: HOME_DESCRIPTION[lang],
      url: `${SITE_URL}/`,
      timeToComplete: 'P4Y',
      inLanguage: 'es',
      provider: {
        '@type': 'CollegeOrUniversity',
        name: 'Universidad El Bosque',
        url: 'https://www.unbosque.edu.co/',
        address: { '@type': 'PostalAddress', addressLocality: 'Bogotá', addressCountry: 'CO' },
      },
    },
  };
}

export function blogListSeo(lang: Lang): PageSeo {
  return {
    title: lang === 'en' ? 'Blog · Digital Creation · Universidad El Bosque' : 'Blog · Creación Digital · Universidad El Bosque',
    description: BLOG_DESCRIPTION[lang],
    path: '/blog',
  };
}

export function proyectosListSeo(lang: Lang): PageSeo {
  return {
    title: lang === 'en'
      ? 'Student Projects · Digital Creation · Universidad El Bosque'
      : 'Proyectos de estudiantes · Creación Digital · Universidad El Bosque',
    description: PROYECTOS_DESCRIPTION[lang],
    path: '/proyectos',
  };
}

export function blogPostSeo(post: BlogPost | undefined, id: string, lang: Lang): PageSeo {
  const headline = post ? (lang === 'en' ? (post.titleEn ?? post.title) : post.title) : '';
  const description = post ? (lang === 'en' ? (post.excerptEn ?? post.excerpt) : post.excerpt) : '';
  const image = post?.image || undefined;
  return {
    title: post ? `${headline} · Blog Creación Digital` : SITE_NAME,
    description,
    path: `/blog/${id}`,
    image,
    type: 'article',
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline,
          description,
          image: resolveImageUrl(image),
          author: { '@type': 'Organization', name: SITE_NAME },
          publisher: {
            '@type': 'Organization',
            name: 'Universidad El Bosque',
            logo: { '@type': 'ImageObject', url: resolveImageUrl(undefined) },
          },
          mainEntityOfPage: `${SITE_URL}/blog/${id}`,
        }
      : undefined,
  };
}

export function proyectoSeo(proyecto: Proyecto | undefined, id: string, lang: Lang): PageSeo {
  const name = proyecto?.modal
    ? (lang === 'en'
        ? (proyecto.modal.titleEn ?? proyecto.modal.titleEs ?? proyecto.captionEn ?? proyecto.caption)
        : (proyecto.modal.titleEs ?? proyecto.caption))
    : '';
  const description = proyecto ? (lang === 'en' ? (proyecto.captionEn ?? proyecto.caption) : proyecto.caption) : '';
  return {
    title: proyecto?.modal ? `${name} · Creación Digital` : SITE_NAME,
    description,
    path: `/proyectos/${id}`,
    image: proyecto?.image,
    type: 'article',
    jsonLd: proyecto?.modal
      ? {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name,
          description,
          image: resolveImageUrl(proyecto.image),
          ...(proyecto.student ? { creator: proyecto.student } : {}),
          dateCreated: proyecto.year,
          url: `${SITE_URL}/proyectos/${id}`,
          sourceOrganization: { '@type': 'Organization', name: SITE_NAME },
        }
      : undefined,
  };
}
