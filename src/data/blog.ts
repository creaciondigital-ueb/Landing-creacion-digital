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

/**
 * ⚠️ CONTENIDO DE EJEMPLO (placeholder) — solo para previsualizar el diseño
 * de las tarjetas en la landing y en /blog. Reemplazar/borrar estos 4
 * objetos cuando lleguen las publicaciones reales del programa.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'ejemplo-post-1',
    image: '',
    category: 'Logros',
    categoryEn: 'Achievements',
    year: '2026',
    date: 'Agosto 2026',
    dateEn: 'August 2026',
    title: 'Título de ejemplo — logro destacado de un estudiante',
    titleEn: 'Sample title — a student\'s standout achievement',
    excerpt: 'Texto de ejemplo para previsualizar cómo se ve la bajada de una tarjeta del blog en la landing.',
    excerptEn: 'Sample text to preview how a blog card\'s excerpt looks on the landing page.',
  },
  {
    id: 'ejemplo-post-2',
    image: '',
    category: 'Eventos',
    categoryEn: 'Events',
    year: '2026',
    date: 'Julio 2026',
    dateEn: 'July 2026',
    title: 'Título de ejemplo — evento o actividad del programa',
    titleEn: 'Sample title — a program event or activity',
    excerpt: 'Otro texto de ejemplo, un poco más largo, para ver cómo se acomoda en dos o tres líneas dentro de la tarjeta.',
    excerptEn: 'Another sample text, a bit longer, to see how it wraps across two or three lines inside the card.',
  },
  {
    id: 'ejemplo-post-3',
    image: '',
    category: 'Noticias',
    categoryEn: 'News',
    year: '2026',
    date: 'Junio 2026',
    dateEn: 'June 2026',
    title: 'Título de ejemplo — noticia importante del programa',
    titleEn: 'Sample title — important program news',
    excerpt: 'Texto de ejemplo corto para la tercera tarjeta de prueba.',
    excerptEn: 'Short sample text for the third test card.',
  },
  {
    id: 'ejemplo-post-4',
    image: '',
    category: 'Logros',
    categoryEn: 'Achievements',
    year: '2026',
    date: 'Mayo 2026',
    dateEn: 'May 2026',
    title: 'Título de ejemplo — cuarta tarjeta de prueba',
    titleEn: 'Sample title — fourth test card',
    excerpt: 'Texto de ejemplo para la cuarta tarjeta, así se ve la fila completa de 4.',
    excerptEn: 'Sample text for the fourth card, to preview the full row of 4.',
  },
];
