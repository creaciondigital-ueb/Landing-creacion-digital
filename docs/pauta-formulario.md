# Página de pauta (/pauta): cómo conectar el formulario y llenar los datos

La página `/pauta` es la que reciben los anuncios de TikTok, Facebook e Instagram. Es oculta: no aparece en Google, no está en el sitemap y ninguna página del sitio la enlaza.

- Código: `src/pages/PautaPage.tsx`. Estilos: `src/styles/pauta.css`.
- Datos que llena la dirección del programa: `src/data/pauta.ts`. Mientras un dato esté vacío (`null`), el bloque que lo necesita no se muestra.
- Variantes del titular: `/pauta?v=casilla` (por defecto), `/pauta?v=juego`, `/pauta?v=puedes`.

## 1. Crear la hoja de Google que recibe los datos

1. En Google Drive, crea una hoja nueva llamada **Contactos pauta Creación Digital**.
2. En la fila 1 escribe estos encabezados, uno por columna: `fecha`, `nombre`, `whatsapp`, `soy`, `utm_source`, `utm_campaign`, `utm_content`, `v`, `formulario`, `pagina`.
3. Ve a **Extensiones → Apps Script**, borra lo que haya y pega esto:

```js
function doPost(e) {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const p = e.parameter;
  hoja.appendRow([
    new Date(), p.nombre, "'" + p.whatsapp, p.soy,
    p.utm_source, p.utm_campaign, p.utm_content, p.v, p.formulario, p.pagina,
  ]);
  return ContentService.createTextOutput('ok');
}
```

4. Guarda. Luego pulsa **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier persona**.
5. Autoriza los permisos que pide Google y copia la **URL de la aplicación web**. Termina en `/exec`.
6. Pon esa URL en `formEndpoint` dentro de `src/data/pauta.ts`.

Para probarlo, envía el formulario desde la página publicada y revisa que aparezca una fila nueva en la hoja.

Si después cambias el script, hay que publicarlo con **Implementar → Administrar implementaciones → Editar → Versión nueva**. Así la URL no cambia.

## 2. Datos pendientes (sección 12 del spec)

| Dato en `src/data/pauta.ts` | Qué pasa mientras esté vacío |
|---|---|
| `whatsapp` | No aparece el botón verde «Escríbenos» ni el de «Abrir WhatsApp» después de enviar el formulario. |
| `formEndpoint` | El formulario se ve, pero al enviarlo dice que no se pudo. |
| `horasRespuesta` | No aparece el paso 1 («Te escribimos por WhatsApp en menos de…»). El mensaje final dice solo «Te escribimos por WhatsApp». |
| `autorizacionTexto` | La casilla usa el texto genérico del preview. Hay que reemplazarlo por el de jurídica antes de pautar. |
| `politicaDatosUrl`, `terminosUrl` | No aparecen los enlaces del pie. |
| `video` | No aparece el video del hero. |
| `fotos` | No aparece la galería. Para publicarlas, súbelas a Cloudflare (ver CHANGELOG, «Imágenes fuera de Netlify»). |
| `asignaturasNegocio` | El bloque Negocio sale sin la lista de asignaturas. |
| `bonoSabado`, `bonoPioneros`, `bonoMapa` | El bono no aparece. Si los tres están vacíos, no aparece la fila de bonos. |
| `citaAutorizada`, `globalHackAutorizado`, `globalHackAnio` | No aparecen la cita ni el bloque del Global Hack. |
| `valorSemestre` | No aparece la caja del precio. |
| `fechaCierre` | La sección de cierre sale sin el titular, solo con la etiqueta y el formulario. |
| `fechaPuertasAbiertas` | No aparece la frase «Escríbenos hoy y alcanzas a venir…». |
| `requisitosAdmision`, `financiacion` | Esas dos preguntas no aparecen. |
| `metaPixelId`, `tiktokPixelId` | No se cargan los píxeles. Los eventos de GA4 (`generate_lead` y `whatsapp_click`) sí funcionan desde ya. |

## 3. Medición

- **GA4** (las dos propiedades del sitio): al enviar el formulario se registra `generate_lead` y al tocar WhatsApp, `whatsapp_click`. Los dos llevan el parámetro `v`. Conviene marcarlos como eventos clave.
- **Meta**: se registra `PageView` al cargar, `Lead` al enviar el formulario y `Contact` al tocar WhatsApp.
- **TikTok**: se registra `page` al cargar, `SubmitForm` al enviar y `Contact` al tocar WhatsApp.
- En los anuncios, usa enlaces de este tipo:
  `https://creaciondigital-ueb.netlify.app/pauta?v=juego&utm_source=tiktok&utm_campaign=pregrado_2027_1&utm_content=juego`
