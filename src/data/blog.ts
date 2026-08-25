/**
 * Publicaciones del Blog — Programa Creación Digital.
 *
 * Contenido 100% estático (sin base de datos, sin backend), siguiendo el
 * mismo patrón que `proyectos.ts`: cada publicación nueva se agrega a mano
 * como un objeto en el array `BLOG_POSTS`. Empieza vacío — se irá llenando
 * con las noticias del programa.
 */

export interface BlogPostDetail {
  /** Imágenes del carrusel en la página de detalle (rutas dentro de /public). */
  images: string[];
  descriptionEs: string;
  descriptionEn: string;
  /** Etiquetas/temas relacionados con la publicación. */
  tagsEs?: string[];
  tagsEn?: string[];
}

export interface BlogPost {
  id: string;
  /** Imagen de portada — siempre horizontal. */
  image: string;
  /** Categoría de la noticia, ej. "Logros", "Eventos" — se usa para el filtro. */
  category: string;
  categoryEn?: string;
  /** Año de publicación (texto, ej. "2026") — se usa para el filtro. */
  year: string;
  /** Fecha legible, ej. "18 de agosto de 2026". */
  date: string;
  dateEn?: string;
  /** Título de la publicación. */
  title: string;
  titleEn?: string;
  /** Bajada corta (1-2 líneas), se usa en la card del listado. */
  excerpt: string;
  excerptEn?: string;
  /** Autor/es de la publicación, opcional. */
  author?: string;
  /** Datos de la página de detalle — si está presente, la card abre /blog/:id. */
  detail?: BlogPostDetail;
}

export const BLOG_POSTS: BlogPost[] = [];
