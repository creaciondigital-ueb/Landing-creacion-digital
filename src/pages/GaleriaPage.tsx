import Gallery from '../components/Gallery';

/**
 * Página de la galería del Estudio de Creación Digital 4 — `/galeria`.
 *
 * Sprint 3 del editorial rebrand v3.4.0:
 *  - Hero reescrito con estructura editorial 3-row (Galería italic +
 *    № 04 · Vol. 2026 / de [objetos tachado] modelos / 3D Rubik Bubbles).
 *  - Stats bar inferior eliminada (Carlos pidió quitarla en el chat
 *    del design — "no aporta mucho").
 *  - Footer reskinneado con tag acid "GLB · PBR · WebXR".
 *
 * Funcionalidad intacta: el componente `<Gallery/>` consume los mismos
 * endpoints, mismos filtros, mismo modal, mismas acciones.
 */
export default function GaleriaPage() {
  return (
    <>
      <header className="hero">
        <div className="hero-eyebrow">
          <span>Estudio de Creación Digital 4</span>
          <span className="hero-eyebrow-dot">●</span>
          <span>Semestre 2026-1</span>
        </div>

        <h1 className="hero-title">
          <span className="hero-line hero-row-1">
            <em className="hero-word hero-word--galeria">Galería</em>
            <span className="hero-tag">
              <span className="hero-tag-num">№ 04</span>
              <span className="hero-tag-rule"></span>
              <span className="hero-tag-label">Vol. 2026</span>
            </span>
          </span>
          <span className="hero-line hero-row-2">
            <span className="hero-de">de</span>
            <s className="hero-strike">objetos</s>
            <em className="hero-word hero-word--modelos">modelos</em>
          </span>
          <span className="hero-line hero-row-3">
            <span className="hero-bubble">3D.</span>
          </span>
        </h1>

        <p className="hero-desc">
          Explora modelos 3D creados por nuestros estudiantes.
          Materiales <strong>PBR</strong>, iluminación profesional,
          listos para experiencias web, AR y VR.
        </p>
      </header>

      <main id="galeria">
        <Gallery />
      </main>

      <footer>
        <p>© 2026 Estudio de Creación Digital 4 — Universidad El Bosque</p>
        <p className="footer-tag">GLB · PBR · WebXR</p>
      </footer>
    </>
  );
}
