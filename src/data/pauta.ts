/**
 * Datos de la página de pauta (/pauta) que llena la dirección del programa.
 * Spec: CDCopyMastery/landing-pauta-spec.md (sección 12, "Pendientes").
 *
 * Regla: la página nunca muestra un hueco. Mientras un dato esté en `null`
 * (o `false`, o la lista vacía), el bloque que lo necesita no aparece. Al
 * llenarlo, aparece solo. Todo lo demás del texto está en PautaPage.tsx,
 * copiado tal cual del spec.
 */
export interface PautaDatos {
  /**
   * Celular con indicativo y sin signos, ej. '573001234567'. La página no tiene
   * formulario: todos los botones abren WhatsApp. Sin este número no aparece
   * ninguno.
   */
  whatsapp: string | null;
  /** En cuánto tiempo se responde, tal como se lee en la frase: "Te escribimos por WhatsApp en menos de ___." Ej. '24 horas'. */
  horasRespuesta: string | null;
  /** Enlaces del pie. Sin URL, el enlace no aparece. */
  politicaDatosUrl: string | null;
  terminosUrl: string | null;

  /** Video del hero: MP4 H.264 de menos de 3 MB y su imagen de portada. */
  video: { src: string; poster: string; descripcion: string } | null;
  /** Cuatro fotos reales 4:5 (estudio, laboratorio, proyecto 3D, proyecto web), con autorización de imagen. */
  fotos: { src: string; alt: string }[];

  /** Bonos: cada uno sale solo si está confirmado. El texto se agrega al detalle (fecha y cupo, etc.). */
  bonoSabado: string | null;
  bonoPioneros: string | null;
  bonoMapa: string | null;

  /** Autorizaciones de la sección "Quiénes ya la estudian". */
  citaAutorizada: boolean;

  /** Valor del semestre 2027-1, ya aprobado para publicar. Ej. '$ 9.850.000'. */
  valorSemestre: string | null;

  /** Respuestas de las dos últimas preguntas frecuentes. */
  requisitosAdmision: string | null;
  financiacion: string | null;

  /** Píxeles de medición. Sin ID, no se cargan. */
  metaPixelId: string | null;
  tiktokPixelId: string | null;
}

export const PAUTA: PautaDatos = {
  whatsapp: '573232527585',
  horasRespuesta: null,
  politicaDatosUrl: null,
  terminosUrl: null,

  video: null,
  fotos: [],

  bonoSabado: null,
  bonoPioneros: null,
  bonoMapa: null,

  citaAutorizada: false,

  valorSemestre: null,

  requisitosAdmision: null,
  financiacion: null,

  metaPixelId: null,
  tiktokPixelId: null,
};
