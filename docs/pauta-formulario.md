# Página de pauta (/pauta): datos pendientes y medición

La página `/pauta` es la que reciben los anuncios de TikTok, Facebook e Instagram. Es oculta: no aparece en Google, no está en el sitemap y ninguna página del sitio la enlaza.

- Código: `src/pages/PautaPage.tsx`. Estilos: `src/styles/pauta.css`.
- Datos que llena la dirección del programa: `src/data/pauta.ts`. Mientras un dato esté vacío (`null`), el bloque que lo necesita no se muestra.
- Variantes del titular: `/pauta?v=casilla` (por defecto), `/pauta?v=juego`, `/pauta?v=puedes`.

## 1. Sin formulario: todo va a WhatsApp

La página no tiene formulario. «Inscríbete», en la barra superior, va a https://www.unbosque.edu.co/inscripciones/pregrado (GA4: `aplica_ahora`). «Agenda una charla con el director», en el hero, abre el formulario de charlas del sitio. «Síguenos en Instagram» y «Síguenos en TikTok» van a @creaciondigital.ueb. La última sección, «Visita nuestra página», lleva a https://creaciondigital-ueb.netlify.app/. «Visítanos en un open day», «Asiste a nuestro workshop de creación con IA», «Quiero hablar con la dirección», «Escríbenos por WhatsApp» y el botón verde fijo abren WhatsApp con un mensaje prellenado que incluye la variante (`v`) del anuncio. El de mamás y papás, el del open day y el del workshop llevan su propio mensaje.

## 2. Datos pendientes (sección 12 del spec)

| Dato en `src/data/pauta.ts` | Qué pasa mientras esté vacío |
|---|---|
| `whatsapp` | No aparece ningún botón de WhatsApp (ni el del hero, ni el de papás, ni el verde fijo). **Es lo único indispensable para pautar.** |
| `horasRespuesta` | No aparece el paso 1 («Te escribimos por WhatsApp en menos de…»). |
| `politicaDatosUrl`, `terminosUrl` | No aparecen los enlaces del pie. |
| `video` | No aparece el video del hero. |
| `fotos` | No aparece la galería. Para publicarlas, súbelas a Cloudflare (ver CHANGELOG, «Imágenes fuera de Netlify»). |
| `bonoSabado`, `bonoPioneros`, `bonoMapa` | El bono no aparece. Si los tres están vacíos, no aparece la fila de bonos. |
| `citaAutorizada`, `globalHackAutorizado`, `globalHackAnio` | No aparecen la cita ni el bloque del Global Hack. |
| `valorSemestre` | No aparece la caja del precio. |
| `requisitosAdmision`, `financiacion` | Esas dos preguntas no aparecen. |
| `metaPixelId`, `tiktokPixelId` | No se cargan los píxeles. El evento de GA4 `whatsapp_click` sí funciona desde ya. |

## 3. Medición

- **GA4** (las dos propiedades del sitio): al tocar cualquier botón de WhatsApp se registra `whatsapp_click` con el parámetro `v`. Conviene marcarlo como evento clave: es la conversión de esta página.
- **Meta**: se registra `PageView` al cargar y `Contact` al tocar WhatsApp. En la campaña, optimiza por `Contact`.
- **TikTok**: se registra `page` al cargar y `Contact` al tocar WhatsApp.
- En los anuncios, usa enlaces de este tipo:
  `https://creaciondigital-ueb.netlify.app/pauta?v=juego&utm_source=tiktok&utm_campaign=pregrado_2027_1&utm_content=juego`
