/**
 * Proyectos de estudiantes — Programa Creación Digital.
 *
 * Contenido 100% estático (sin base de datos, sin backend): cada vez que
 * haya un proyecto nuevo, se agrega un objeto a este array a mano. Las
 * imágenes/archivos se suben directo a `public/programa/img/proyectos/`
 * (o donde corresponda) y se referencian aquí por ruta.
 *
 * - Los primeros 2 proyectos del array son los que se muestran como
 *   preview en el home (sección "Proyectos que crean nuestros estudiantes").
 * - `/proyectos` muestra el array completo.
 */

export interface Proyecto {
  id: string;
  /** Imagen principal (portada) del proyecto. */
  image: string;
  /** Asignatura/curso, ej. "Estudio de Creación Digital 4" — se usa para el filtro. */
  subject: string;
  /** Iniciales o nombre del profesor, ej. "A. Rozo". */
  professor: string;
  /** Año del proyecto (texto, ej. "2026") — se usa para el filtro. */
  year: string;
  /** Descripción corta (1 línea), se usa en el home y como título en /proyectos. */
  caption: string;
  /** Descripción más larga, opcional — solo se muestra en /proyectos. */
  description?: string;
  /** Nombre del estudiante autor, opcional. */
  student?: string;
  /** Archivo descargable opcional (PDF, .glb, .zip, etc.), ruta dentro de /public. */
  fileUrl?: string;
  fileLabel?: string;
}

export const PROYECTOS: Proyecto[] = [
  {
    id: 'mascara-blender',
    image: '/programa/img/proyecto-2.webp',
    subject: 'Estudio de Creación Digital 4',
    professor: 'A. Rozo',
    year: '2026',
    caption: 'Modelado y esculpido de máscara en Blender',
  },
  {
    id: 'campana-mundial',
    image: '/programa/img/campana-mundial.webp',
    subject: 'Estudio de Creación Digital 1',
    professor: 'J. Suárez',
    year: '2026',
    caption: 'Campaña digital inspirada en el Mundial de Fútbol 2026',
  },
];
