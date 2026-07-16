import { useEffect, useState, useRef, type ReactNode, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  onAuthStateChange,
  getCurrentUser,
  type AuthUser,
} from '../lib/api';
import ChangePasswordModal from '../components/ChangePasswordModal';
import '../styles/programa.css';

const IMG = '/programa/img';
const APLICA_URL = 'https://www.unbosque.edu.co/inscripciones/pregrado';

/**
 * Landing pública del Programa Creación Digital (Universidad El Bosque).
 *
 * Implementación del handoff de Claude Design (chat "Identidad Visual", 2026-05):
 * diseño 1:1 desde el Figma "PW CreaDig" → frame "Página Web". Reemplaza la
 * landing editorial previa por la versión definitiva de 9 secciones.
 *
 * Estructura:
 *  1. Header sticky (logo lockup UEB + nav + APLICA AHORA)
 *  2. Hero "no vinimos a dictar clase."
 *  3. Marquee "Esto aprenderás estudiando nuestro pregrado"
 *  4-6. 3 ejes color-block: contenido (cobalt) · mundo 3d (acid) · producto (tomato)
 *  7. Marquee "Conoce a nuestro equipo docente"
 *  8. Docentes (carrusel + modales con perfil/experiencia)
 *  9. Proyectos · CTA Estudia · Footer
 *
 * Notas de implementación:
 *  - Plan C: monta ChangePasswordModal defensivamente (esta página no usa Layout).
 *  - Modales de docentes: <dialog> nativo controlado por estado React.
 *  - Links internos (VER PROYECTOS, galería) → /galeria vía React Router.
 *  - Imágenes servidas desde public/programa/img/*.webp.
 */

interface DocenteModalProps {
  id: string;
  active: boolean;
  onClose: () => void;
  portrait: string;
  name: ReactNode;
  tags: string[];
  children: ReactNode;
}

function DocenteModal({ id, active, onClose, portrait, name, tags, children }: DocenteModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (active && !dlg.open) {
      try { dlg.showModal(); } catch { dlg.setAttribute('open', ''); }
    } else if (!active && dlg.open) {
      dlg.close();
    }
  }, [active]);

  return (
    <dialog
      ref={ref}
      className="pcd-docente-modal"
      id={`modal-${id}`}
      aria-labelledby={`modal-${id}-name`}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <button className="pcd-docente-modal__close" type="button" aria-label="Cerrar" onClick={onClose}>X</button>
      <div className="pcd-docente-modal__inner">
        <aside className="pcd-docente-modal__side">
          <div
            className="pcd-docente-modal__portrait"
            style={{ backgroundImage: `url('${portrait}')` }}
            aria-hidden="true"
          />
          <h2 className="pcd-docente-modal__name" id={`modal-${id}-name`}>{name}</h2>
          <div className="pcd-docente-modal__tags">
            {tags.map((t) => <span key={t} className="pcd-docente__tag">{t}</span>)}
          </div>
        </aside>
        <div className="pcd-docente-modal__content">
          {children}
        </div>
      </div>
    </dialog>
  );
}

export default function ProgramaCreacionDigital() {
  // Plan C — copia defensiva del modal forzado (esta página no usa Layout).
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());
  useEffect(() => {
    const unsubscribe = onAuthStateChange((u) => setUser(u));
    return unsubscribe;
  }, []);
  const mustChange = user?.must_change_password === true;

  // Modal de docente activo (null = ninguno).
  const [activeDocente, setActiveDocente] = useState<string | null>(null);
  const openDocente = (id: string) => setActiveDocente(id);
  const closeDocente = () => setActiveDocente(null);

  // Menú hamburguer (solo móvil).
  const [menuOpen, setMenuOpen] = useState(false);

  const onCardKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDocente(id); }
  };

  return (
    <div className="pcd-page">

      {/* ===== HEADER ===== */}
      <header className="pcd-header">
        <a href="#top" className="pcd-brand" aria-label="Inicio Creación Digital · Universidad El Bosque">
          <img className="pcd-brand__logo" src={`${IMG}/Label_UEB_CreacionDigital_Horizontal.png`} alt="Universidad El Bosque · Creación Digital" />
        </a>
        <nav className={`pcd-nav${menuOpen ? ' is-open' : ''}`} aria-label="Principal">
          <a className="pcd-nav__link" href="#programa" onClick={() => setMenuOpen(false)}>PROGRAMA</a>
          <a className="pcd-nav__link" href="#docentes" onClick={() => setMenuOpen(false)}>docentes</a>
          <a className="pcd-nav__link" href="#proyectos" onClick={() => setMenuOpen(false)}>PROYECTOS</a>
        </nav>
        <a className="pcd-cta-pill" href={APLICA_URL} target="_blank" rel="noopener">
          <span>APLICA AHORA</span>
          <span className="pcd-cta-pill__arrow" aria-hidden="true">→</span>
        </a>
        <button
          type="button"
          className={`pcd-hamburger${menuOpen ? ' is-open' : ''}`}
          aria-label="Menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
        </button>
      </header>

      {/* ===== HERO ===== */}
      <section id="top" className="pcd-hero">
        <div className="pcd-hero__meta">
          <span><b>Pregrado</b> · 8 semestres</span>
          <span className="center">Bogotá · Universidad El Bosque</span>
          <span className="right"><b>SNIES</b> · 116265</span>
        </div>

        <h1 className="pcd-hero__title">
          <span className="row">no vinimos</span>
          <span className="row row--shift1">a dictar</span>
          <span className="row row--shift2">clase<span className="blob">.</span></span>
        </h1>

        {/* CTA solo móvil — debajo del título (en desktop el pill vive en el header) */}
        <a className="pcd-hero__cta-mobile" href={APLICA_URL} target="_blank" rel="noopener">
          <span>APLICA AHORA</span>
          <span aria-hidden="true">→</span>
        </a>

        <div className="pcd-hero__bottom">
          <div className="pcd-hero__brand">
            <img className="pcd-hero__brand-logo" src={`${IMG}/LogoUEB_CreacionDigital.png`} alt="Universidad El Bosque · Creación Digital · Pregrado | 8 Semestres" />
          </div>

          <div className="pcd-hero__quienes">
            <span className="pcd-hero__quienes-label">¿quiénes<br />somos?</span>
            <p className="pcd-hero__quienes-body">
              Creamos en medio del ruido, la velocidad y el cambio. En un mundo donde las ideas evolucionan todos los días y las formas de crear ya no caben en una sola disciplina. Como Creadores Digitales, aprendemos a pensar críticamente, experimentar sin miedo y convertir la curiosidad en acción.
            </p>
          </div>

          <div className="pcd-hero__photo" aria-hidden="true" />
        </div>
      </section>

      {/* ===== MARQUEE · Esto aprenderás ===== */}
      <div className="pcd-marquee" aria-hidden="true">
        <div className="pcd-marquee__track">
          <span>
            Esto aprenderás estudiando nuestro pregrado <span className="pcd-marquee__star">✺</span>
            Esto aprenderás estudiando nuestro pregrado <span className="pcd-marquee__star">✺</span>
            Esto aprenderás estudiando nuestro pregrado <span className="pcd-marquee__star">✺</span>
          </span>
          <span>
            Esto aprenderás estudiando nuestro pregrado <span className="pcd-marquee__star">✺</span>
            Esto aprenderás estudiando nuestro pregrado <span className="pcd-marquee__star">✺</span>
            Esto aprenderás estudiando nuestro pregrado <span className="pcd-marquee__star">✺</span>
          </span>
        </div>
      </div>

      {/* ===== AXIS 01 · CONTENIDO ===== */}
      <section id="programa" className="pcd-axis pcd-axis--contenido">
        <div className="pcd-axis__left">
          <div className="pcd-axis__tag">01 · programa</div>
          <h2 className="pcd-axis__word">conte&shy;<br />nido</h2>
          <p className="pcd-axis__caption">Contenido audiovisual, animación 2D, generación de imágenes y videos con IA</p>
          <div className="pcd-axis__image" style={{ backgroundImage: `url('${IMG}/proyecto-3.webp')` }} aria-hidden="true" />
        </div>
        <div className="pcd-axis__right">
          <article className="pcd-vs">
            <span className="pcd-vs__idx">1.1</span>
            <div>
              <h3 className="pcd-vs__title">En vez de publicar; <span className="pcd-vs__accent">conectar.</span></h3>
              <p className="pcd-vs__body">El contenido no se trata solo de subir videos o seguir tendencias. Aprendemos a crear mensajes y experiencias digitales capaces de generar comunidad e impacto real.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs">
            <span className="pcd-vs__idx">1.2</span>
            <div>
              <h3 className="pcd-vs__title">En vez de perseguir algoritmos; <span className="pcd-vs__accent">entender audiencias.</span></h3>
              <p className="pcd-vs__body">Las plataformas cambian todos los días. Por eso aprendemos a analizar comportamientos y crear estrategias que conecten con las personas más allá de una métrica.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs">
            <span className="pcd-vs__idx">1.3</span>
            <div>
              <h3 className="pcd-vs__title">En vez de consumir internet; <span className="pcd-vs__accent">construirlo.</span></h3>
              <p className="pcd-vs__body">Las marcas y las comunidades digitales no aparecen solas. Aprendemos a crear contenidos, identidades y experiencias para el ecosistema digital actual.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ===== AXIS 02 · MUNDO 3D ===== */}
      <section className="pcd-axis pcd-axis--mundo">
        <div className="pcd-axis__left">
          <div className="pcd-axis__tag">02 · programa</div>
          <h2 className="pcd-axis__word">mundo<br />3d</h2>
          <p className="pcd-axis__caption">Videojuegos, diseño de personajes, modelado, escultura y animación 3D</p>
          <div className="pcd-axis__image" style={{ backgroundImage: `url('${IMG}/proyecto-5.webp')` }} aria-hidden="true" />
        </div>
        <div className="pcd-axis__right">
          <article className="pcd-vs">
            <span className="pcd-vs__idx">2.1</span>
            <div>
              <h3 className="pcd-vs__title">En vez de imaginar mundos; <span className="pcd-vs__accent">construirlos.</span></h3>
              <p className="pcd-vs__body">Detrás de cada videojuego, personaje o experiencia inmersiva hay personas capaces de convertir ideas en realidades digitales. Aquí aprendes a combinar narrativa, diseño y tecnología para crear experiencias memorables.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs">
            <span className="pcd-vs__idx">2.2</span>
            <div>
              <h3 className="pcd-vs__title">En vez de solo jugar; <span className="pcd-vs__accent">diseñar experiencias.</span></h3>
              <p className="pcd-vs__body">Los mundos digitales no se crean únicamente desde lo visual. Aprendemos a construir personajes, escenarios e interacciones capaces de generar emoción e inmersión.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs">
            <span className="pcd-vs__idx">2.3</span>
            <div>
              <h3 className="pcd-vs__title">En vez de mirar el futuro; <span className="pcd-vs__accent">crearlo.</span></h3>
              <p className="pcd-vs__body">La animación, el 3D y las experiencias inmersivas están transformando la forma en que vivimos lo digital. Aquí aprendes las herramientas para crear nuevas formas de explorarlo.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ===== AXIS 03 · PRODUCTO ===== */}
      <section className="pcd-axis pcd-axis--producto">
        <div className="pcd-axis__left">
          <div className="pcd-axis__tag">03 · programa</div>
          <h2 className="pcd-axis__word">prod-<br />ucto</h2>
          <p className="pcd-axis__caption">Código, creación de apps y páginas web, UX/UI, análisis de usuarios</p>
          <div className="pcd-axis__image" style={{ backgroundImage: `url('${IMG}/proyecto-6.webp')` }} aria-hidden="true" />
        </div>
        <div className="pcd-axis__right">
          <article className="pcd-vs">
            <span className="pcd-vs__idx">3.1</span>
            <div>
              <h3 className="pcd-vs__title">En vez de usar plataformas; <span className="pcd-vs__accent">crearlas.</span></h3>
              <p className="pcd-vs__body">Las aplicaciones, redes sociales y productos digitales nacen de personas capaces de entender cómo interactuamos en internet. Aquí aprendes a crear experiencias digitales pensadas para conectar y generar impacto real.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs">
            <span className="pcd-vs__idx">3.2</span>
            <div>
              <h3 className="pcd-vs__title">En vez de pensar en pantallas; <span className="pcd-vs__accent">pensar en personas.</span></h3>
              <p className="pcd-vs__body">Un producto digital no funciona solo porque se vea bien. Aprendemos a entender usuarios y diseñar experiencias intuitivas, atractivas y fáciles de usar.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs">
            <span className="pcd-vs__idx">3.3</span>
            <div>
              <h3 className="pcd-vs__title">En vez de seguir ideas; <span className="pcd-vs__accent">convertirlas en productos.</span></h3>
              <p className="pcd-vs__body">Las grandes plataformas digitales comenzaron como una idea capaz de resolver una necesidad real. Aquí aprendes a combinar creatividad, tecnología y estrategia para construir experiencias digitales con potencial de crecer en el mundo real.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ===== MARQUEE · Conoce a nuestro equipo docente ===== */}
      <div className="pcd-marquee" aria-hidden="true">
        <div className="pcd-marquee__track">
          <span>
            Conoce a nuestro equipo docente <span className="pcd-marquee__star">✺</span>
            Conoce a nuestro equipo docente <span className="pcd-marquee__star">✺</span>
            Conoce a nuestro equipo docente <span className="pcd-marquee__star">✺</span>
            Conoce a nuestro equipo docente <span className="pcd-marquee__star">✺</span>
          </span>
          <span>
            Conoce a nuestro equipo docente <span className="pcd-marquee__star">✺</span>
            Conoce a nuestro equipo docente <span className="pcd-marquee__star">✺</span>
            Conoce a nuestro equipo docente <span className="pcd-marquee__star">✺</span>
            Conoce a nuestro equipo docente <span className="pcd-marquee__star">✺</span>
          </span>
        </div>
      </div>

      {/* ===== DOCENTES ===== */}
      <section id="docentes" className="pcd-docentes">
        <header className="pcd-docentes__head">
          <h2 className="pcd-docentes__title">Quienes crean afuera, enseñan aquí.</h2>
          <p className="pcd-docentes__sub">Experiencia real convertida en aprendizaje</p>
        </header>
        <div className="pcd-docentes__grid">
          <article
            className="pcd-docente" tabIndex={0} role="button"
            aria-label="Ver perfil de Juan David Aristizabal"
            onClick={() => openDocente('juandavid')}
            onKeyDown={(e) => onCardKey(e, 'juandavid')}
            style={{ '--docente-init': `url('${IMG}/JuanDavid_Init.webp')`, '--docente-end': `url('${IMG}/JuanDavid_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--like" src={`${IMG}/Like.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Juan David<br />Aristizabal</h3>
            <p className="pcd-docente__bio">Director creativo en Meta-Carbon con experiencia en animación 2D/3D, motion graphics, videojuegos y experiencias digitales desarrolladas en WebGL. Ha trabajado en proyectos audiovisuales y de investigación-creación.</p>
            <div className="pcd-docente__tags">
              <span className="pcd-docente__tag">Animación</span>
              <span className="pcd-docente__tag">Videojuegos</span>
              <span className="pcd-docente__tag">3D</span>
            </div>
          </article>

          <article
            className="pcd-docente" tabIndex={0} role="button"
            aria-label="Ver perfil de Vanessa Tovar"
            onClick={() => openDocente('vanessa')}
            onKeyDown={(e) => onCardKey(e, 'vanessa')}
            style={{ '--docente-init': `url('${IMG}/Vanessa_Init.webp')`, '--docente-end': `url('${IMG}/Vanessa_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--idea" src={`${IMG}/Idea.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Vanessa<br />Tovar</h3>
            <p className="pcd-docente__bio">Diseñadora Industrial y magíster en Customer Experience (CX) con experiencia en UX/UI, estrategia digital y diseño de experiencias para plataformas como Bolsa de Valores de Colombia y Metrocuadrado, desarrollando productos digitales.</p>
            <div className="pcd-docente__tags">
              <span className="pcd-docente__tag">UX / UI</span>
              <span className="pcd-docente__tag">Estrategia</span>
              <span className="pcd-docente__tag">Research</span>
            </div>
          </article>

          <article
            className="pcd-docente" tabIndex={0} role="button"
            aria-label="Ver perfil de Camilo Cardozo"
            onClick={() => openDocente('camilo')}
            onKeyDown={(e) => onCardKey(e, 'camilo')}
            style={{ '--docente-init': `url('${IMG}/Camilo_Init.webp')`, '--docente-end': `url('${IMG}/Camilo_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--love" src={`${IMG}/Love.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Camilo<br />Cardozo</h3>
            <p className="pcd-docente__bio">Diseñador gráfico y especialista en marketing digital, con más de 15 años de experiencia en branding, UX/UI, creatividad y transformación digital para marcas y ecosistemas de alto impacto en Latinoamérica.</p>
            <div className="pcd-docente__tags">
              <span className="pcd-docente__tag">Branding</span>
              <span className="pcd-docente__tag">Storytelling</span>
              <span className="pcd-docente__tag">UX</span>
            </div>
          </article>

          <article
            className="pcd-docente" tabIndex={0} role="button"
            aria-label="Ver perfil de Juan Sebastián Sierra"
            onClick={() => openDocente('sebastian')}
            onKeyDown={(e) => onCardKey(e, 'sebastian')}
            style={{ '--docente-init': `url('${IMG}/Sebastian_Init.webp')`, '--docente-end': `url('${IMG}/Sebastian_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <h3 className="pcd-docente__name">Juan Sebastián<br />Sierra</h3>
            <p className="pcd-docente__bio">Diseñador especializado en producción digital, modelado 3D y experiencias inmersivas. Es Senior Tech Artist con experiencia en pipelines de juegos AAA y proyectos de realidad virtual.</p>
            <div className="pcd-docente__tags">
              <span className="pcd-docente__tag">3D</span>
              <span className="pcd-docente__tag">Tech Art</span>
              <span className="pcd-docente__tag">VR</span>
            </div>
          </article>
        </div>
      </section>

      {/* ===== MODALES DOCENTES ===== */}
      <DocenteModal
        id="juandavid" active={activeDocente === 'juandavid'} onClose={closeDocente}
        portrait={`${IMG}/JuanDavid_Init.webp`}
        name={<>Juan David<br />Aristizabal</>}
        tags={['Animación', 'Videojuegos', 'WebGL']}
      >
        <h3 className="pcd-docente-modal__heading">Perfil</h3>
        <p className="pcd-docente-modal__p">Soy profesional en Publicidad y Diseño Gráfico con énfasis en animación 2D y 3D, y cuento con una Maestría en Animación 3D para las Industrias del Entretenimiento.</p>
        <p className="pcd-docente-modal__p">Actualmente me desempeño como director creativo en Meta-Carbon, donde he trabajado en proyectos audiovisuales de investigación-creación relacionados con animación, motion graphics, videojuegos y experiencias desarrolladas en WebGL.</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">Experiencia</h3>
        <ul className="pcd-docente-modal__list">
          <li>
            <strong>Caída libre</strong>
            <span className="pcd-docente-modal__detail-plain">Participé como modelador, rigger y animador en Caída Libre, un cortometraje animado ganador de Co-Crea desarrollado junto a Wilson Borja y Diego Ríos.</span>
          </li>
          <li>
            <strong>Action Beat Club</strong>
            <span className="pcd-docente-modal__detail-plain">Como director creativo, lideré Action Beat Club, una colección NFT desarrollada para Meta-Carbon y publicada en Crypto.com</span>
          </li>
          <li>
            <strong>Wonka</strong>
            <span className="pcd-docente-modal__detail-plain">Participé como modelador, rigger y artista VFX en una campaña comercial para Wonka, desarrollando piezas 3D y efectos visuales.</span>
          </li>
        </ul>
      </DocenteModal>

      <DocenteModal
        id="vanessa" active={activeDocente === 'vanessa'} onClose={closeDocente}
        portrait={`${IMG}/Vanessa_Init.webp`}
        name={<>Vanessa<br />Tovar</>}
        tags={['UX | UI', 'Estrategia', 'Research']}
      >
        <h3 className="pcd-docente-modal__heading">Perfil</h3>
        <p className="pcd-docente-modal__p">Soy Diseñadora Industrial y magíster en Customer Experience (CX), con experiencia en UX/UI, estrategia digital y diseño de experiencias para sectores financieros, inmobiliarios, educativos y de servicios digitales.</p>
        <p className="pcd-docente-modal__p">Me apasiona moverme entre la academia y la industria, desarrollando proyectos centrados en las personas, la innovación y la creación de experiencias digitales más humanas, intuitivas y conectadas con las necesidades reales de los usuarios.</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">Experiencia</h3>
        <ul className="pcd-docente-modal__list">
          <li>
            <strong>Bolsa de Valores de Colombia</strong>
            <span className="pcd-docente-modal__detail-plain">En la BVC trabajé en iniciativas orientadas a la optimización de experiencias digitales y estrategias UX, buscando fortalecer la relación entre los usuarios y los servicios financieros desde una perspectiva más humana, estratégica y centrada en las personas.</span>
          </li>
          <li>
            <strong>Metrocuadrado</strong>
            <span className="pcd-docente-modal__detail-plain">Participé en el diseño y mejora de experiencias de publicación, visualización y registro dentro de la plataforma, desarrollando procesos más intuitivos, claros y eficientes para los usuarios, enfocados en mejorar la interacción y facilitar la toma de decisiones.</span>
          </li>
        </ul>
      </DocenteModal>

      <DocenteModal
        id="camilo" active={activeDocente === 'camilo'} onClose={closeDocente}
        portrait={`${IMG}/Camilo_Init.webp`}
        name={<>Camilo<br />Cardozo</>}
        tags={['Branding', 'Storytelling', 'UX | UI']}
      >
        <h3 className="pcd-docente-modal__heading">Perfil</h3>
        <p className="pcd-docente-modal__p">Soy Diseñador Gráfico de la Universidad Jorge Tadeo Lozano, especialista en Gerencia de Mercadeo, Comunicación y Artes, Máster en Marketing Digital y en Educación Superior.</p>
        <p className="pcd-docente-modal__p">Cuento con más de 15 años de experiencia en branding, creatividad, marketing digital y transformación digital, integrando estrategia, storytelling, UX/UI y cultura digital para desarrollar experiencias y proyectos con impacto real. Actualmente, combino mi experiencia en la industria con la docencia universitaria.</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">Experiencia</h3>
        <ul className="pcd-docente-modal__list">
          <li>
            <span className="pcd-docente-modal__detail-plain">He liderado proyectos de branding, marketing digital, creatividad y transformación digital para marcas de alto impacto en Latinoamérica. A lo largo de mi trayectoria he trabajado junto a organizaciones como Banco BHD, dale!, Metrocuadrado, Seguros Alfa, DDB e IPG Mediabrands, desarrollando estrategias enfocadas en construcción de marca, experiencias digitales, comunicación creativa y crecimiento de negocio.</span>
          </li>
          <li>
            <span className="pcd-docente-modal__detail-plain">También hago parte de <strong>ADL Digital Lab</strong>, el laboratorio digital de <strong>Grupo Aval</strong>, participando en iniciativas de innovación, transformación digital y diseño de experiencias centradas en el usuario. Mi experiencia combina pensamiento estratégico, storytelling, UX/UI, creatividad aplicada y cultura digital para conectar marcas con personas a través de experiencias memorables.</span>
          </li>
        </ul>
      </DocenteModal>

      <DocenteModal
        id="sebastian" active={activeDocente === 'sebastian'} onClose={closeDocente}
        portrait={`${IMG}/Sebastian_Init.webp`}
        name={<>Juan Sebastián<br />Sierra</>}
        tags={['UX | UI', 'Estrategia', 'Producto']}
      >
        <h3 className="pcd-docente-modal__heading">Perfil</h3>
        <p className="pcd-docente-modal__p">Soy diseñador de producto especializado en estrategia, UI/UX e innovación, con formación en Diseño de Interacción y una Maestría en Diseño Estratégico e Innovación.</p>
        <p className="pcd-docente-modal__p">Actualmente soy Senior Product Design Manager y Solutions Leader en Monks Technology Services, donde lidero equipos y desarrollo soluciones digitales centradas en las personas, combinando creatividad, pensamiento estratégico y experiencia técnica. Me apasiona crear experiencias funcionales y atractivas que generen impacto.</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">Experiencia</h3>
        <ul className="pcd-docente-modal__list">
          <li>
            <span className="pcd-docente-modal__detail-plain">Algunos de los proyectos más importantes y enriquecedores en los que he participado han sido junto a <strong>marcas como</strong> Caracol Televisión, Bridgestone, PlayStation, Sony Interactive Entertainment, LISTERINE y Johnson &amp; Johnson, liderando iniciativas de diseño de producto, estrategia digital y experiencia de usuario para distintos mercados e industrias.</span>
          </li>
          <li>
            <span className="pcd-docente-modal__detail-plain">Actualmente, como Senior Product Design Manager y Solutions Leader en <strong>Monks Technology Services</strong>, trabajo impulsando soluciones digitales innovadoras para transformar necesidades complejas de negocio en productos y experiencias centradas en las personas. Mi experiencia incluye liderazgo de equipos multidisciplinarios, definición de estrategias de producto y desarrollo de soluciones con impacto tanto para usuarios como para empresas.</span>
          </li>
        </ul>
      </DocenteModal>

      {/* ===== PROYECTOS ===== */}
      <section id="proyectos" className="pcd-projects">
        <header className="pcd-projects__head">
          <h2 className="pcd-projects__title">
            Proyectos que<br />
            <span className="pop">crean</span> nuestros<br />
            estudiantes.
          </h2>
          <Link className="pcd-cta-secondary" to="/galeria">
            <span>VER PROYECTOS</span>
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className="pcd-projects__grid">
          <article className="pcd-project pcd-project--wide">
            <div className="pcd-project__media" style={{ backgroundImage: `url('${IMG}/proyecto-2.webp')` }} aria-hidden="true" />
            <div className="pcd-project__meta">
              <span>ESTUDIO DE CREACIÓN DIGITAL 4 | A. ROZO</span>
              <span>2026</span>
            </div>
            <p className="pcd-project__caption">Modelado y esculpido de máscara en Blender</p>
          </article>

          <article className="pcd-project pcd-project--tall">
            <div className="pcd-project__media" style={{ backgroundImage: `url('${IMG}/proyecto-4.webp')` }} aria-hidden="true" />
            <div className="pcd-project__meta">
              <span>COMPOSICIÓN PLÁSTICA 2 | J. SUÁREZ</span>
              <span>2026</span>
            </div>
            <p className="pcd-project__caption">Campaña digital inspirada en el Mundial de Fútbol 2026</p>
          </article>
        </div>
      </section>

      {/* ===== ESTUDIA / CTA FINAL ===== */}
      <section id="aplica" className="pcd-estudia">
        <div className="pcd-estudia__copy">
          <span className="pcd-estudia__eyebrow">U. EL BOSQUE &gt;&gt; SNIES 116265 &gt;&gt; 8 SEMESTRES</span>
          <h2 className="pcd-estudia__title">
            Estudia<br />
            <span className="neon">Creación</span>
            Digital.
          </h2>
          <p className="pcd-estudia__body">No estudias Creación Digital para encajar en el futuro, sino para ayudar a crearlo. Haz parte de una nueva generación de creadores capaces de conectar ideas, tecnología y cultura digital, e inscríbete para empezar a construir lo que viene después.</p>
          <a className="pcd-estudia__cta" href={APLICA_URL} target="_blank" rel="noopener">
            <span>APLICA AHORA</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="pcd-estudia__photo">
          {/* Bullets anclados a la foto (no a la sección) para que queden
              sobre las 4 personas tanto en desktop como en móvil apilado. */}
          <span className="pcd-bullet pcd-bullet--1">Estrategia</span>
          <span className="pcd-bullet pcd-bullet--2">tecnología</span>
          <span className="pcd-bullet pcd-bullet--3">FUTURO</span>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="pcd-footer" id="contacto">
        <div className="pcd-footer__columns">
          <div className="pcd-footer__col">
            <span className="pcd-footer__title">Programa</span>
            <a className="pcd-footer__link" href="https://www.unbosque.edu.co/programas-academicos/facultad-creacion-comunicacion/creacion-digital" target="_blank" rel="noopener">Información</a>
            <a className="pcd-footer__link" href="#manifiesto">Manifiesto</a>
          </div>
          <div className="pcd-footer__col">
            <span className="pcd-footer__title">Comunidad</span>
            <a className="pcd-footer__link" href="https://www.instagram.com/creaciondigital.ueb/" target="_blank" rel="noopener">Instagram</a>
            <a className="pcd-footer__link" href="https://www.tiktok.com/@creaciondigital.ueb" target="_blank" rel="noopener">TikTok</a>
          </div>
          <div className="pcd-footer__col">
            <span className="pcd-footer__title">Universidad</span>
            <a className="pcd-footer__link" href="https://www.unbosque.edu.co/" target="_blank" rel="noopener">Universidad El Bosque</a>
            <a className="pcd-footer__link" href="https://www.unbosque.edu.co/programas-academicos/facultad-creacion-comunicacion" target="_blank" rel="noopener">FACyC</a>
          </div>
        </div>
        <p className="pcd-footer__legal">© Universidad El Bosque · PREGRADO DE Creación Digital · 2026</p>
      </footer>

      {/* Plan C — modal forzado de cambio de contraseña (defensivo) */}
      {mustChange && user && (
        <ChangePasswordModal
          userLabel={user.full_name}
          onSuccess={() => { /* onAuthStateChange refresca el user con flag=false */ }}
        />
      )}
    </div>
  );
}
