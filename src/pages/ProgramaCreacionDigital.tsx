import { useEffect, useState, useRef, type ReactNode, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { PROYECTOS } from '../data/proyectos';
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
 *  - Modales de docentes: <dialog> nativo controlado por estado React.
 *  - Links internos (VER PROYECTOS) → /proyectos vía React Router.
 *  - Imágenes servidas desde public/programa/img/*.webp.
 */

interface DocenteModalProps {
  id: string;
  active: boolean;
  onClose: () => void;
  onSwipe: (dir: 1 | -1) => void;
  portrait: string;
  portraitEnd: string;
  name: ReactNode;
  tags: string[];
  children: ReactNode;
}

// Umbral mínimo (px) de desplazamiento horizontal para considerar un swipe
// real y no un tap o scroll vertical accidental.
const DOCENTE_SWIPE_THRESHOLD = 50;

function DocenteModal({ id, active, onClose, onSwipe, portrait, portraitEnd, name, tags, children }: DocenteModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  // Swipe horizontal (solo móvil, vía touch) para pasar al docente
  // siguiente/anterior sin cerrar el modal. `didSwipeRef` evita que el click
  // "fantasma" que el navegador dispara después del touchend cierre el modal
  // (el onClick de abajo lo usa para ignorar ese click cuando hubo swipe).
  const touchStartX = useRef<number | null>(null);
  const didSwipeRef = useRef(false);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < DOCENTE_SWIPE_THRESHOLD) return;
    didSwipeRef.current = true;
    onSwipe(dx < 0 ? 1 : -1);
  };

  // Cuando `active` pasa a false porque el swipe cambió al siguiente/anterior
  // docente (o porque ya se cerró por otra vía), llamamos dlg.close()
  // nosotros mismos. Eso dispara el evento nativo 'close' del <dialog>, que
  // de otra forma volvería a invocar onClose() y resetearía activeDocente a
  // null justo después de que el swipe lo haya puesto en el siguiente id.
  // Esta bandera evita ese doble disparo.
  const skipNextCloseEvent = useRef(false);
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (active && !dlg.open) {
      try { dlg.showModal(); } catch { dlg.setAttribute('open', ''); }
    } else if (!active && dlg.open) {
      skipNextCloseEvent.current = true;
      dlg.close();
    }
  }, [active]);

  const handleNativeClose = () => {
    if (skipNextCloseEvent.current) { skipNextCloseEvent.current = false; return; }
    onClose();
  };

  // Retrato del modal: alterna entre la versión "default" y la "hover" del
  // docente cada 1.5s mientras el modal está abierto.
  const [showEndPortrait, setShowEndPortrait] = useState(false);
  useEffect(() => {
    if (!active) { setShowEndPortrait(false); return; }
    const interval = setInterval(() => setShowEndPortrait((v) => !v), 1500);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <dialog
      ref={ref}
      className={`pcd-docente-modal pcd-docente-modal--${id}`}
      id={`modal-${id}`}
      aria-labelledby={`modal-${id}-name`}
      onClose={handleNativeClose}
      onClick={(e) => {
        if (didSwipeRef.current) { didSwipeRef.current = false; return; }
        if (e.target === ref.current) onClose();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button className="pcd-docente-modal__close" type="button" aria-label="Cerrar" onClick={onClose}>X</button>
      <div className="pcd-docente-modal__inner">
        <aside className="pcd-docente-modal__side">
          <div className="pcd-docente-modal__portrait" aria-hidden="true">
            <div
              className="pcd-docente-modal__portrait-layer pcd-docente-modal__portrait-layer--init"
              style={{ backgroundImage: `url('${portrait}')`, opacity: showEndPortrait ? 0 : 1 }}
            />
            <div
              className="pcd-docente-modal__portrait-layer pcd-docente-modal__portrait-layer--end"
              style={{ backgroundImage: `url('${portraitEnd}')`, opacity: showEndPortrait ? 1 : 0 }}
            />
          </div>
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
  // Modal de docente activo (null = ninguno).
  const [activeDocente, setActiveDocente] = useState<string | null>(null);
  const openDocente = (id: string) => setActiveDocente(id);
  const closeDocente = () => setActiveDocente(null);

  // Orden de las cards (igual al orden visual del carrusel) — usado para
  // saber cuál es el "siguiente"/"anterior" docente al hacer swipe en el modal.
  const DOCENTE_ORDER = ['paula', 'camilo', 'vanessa', 'juandavid'];
  const onSwipeDocente = (dir: 1 | -1) => {
    setActiveDocente((current) => {
      if (!current) return current;
      const idx = DOCENTE_ORDER.indexOf(current);
      if (idx === -1) return current;
      const nextIdx = (idx + dir + DOCENTE_ORDER.length) % DOCENTE_ORDER.length;
      return DOCENTE_ORDER[nextIdx];
    });
  };

  // Menú hamburguer (solo móvil).
  const [menuOpen, setMenuOpen] = useState(false);

  // Hero: título "no vinimos a dictar clase." se escribe letra por letra al
  // cargar; al terminar, "dictar" se tacha con una línea animada.
  const HERO_L1 = 'no vinimos';
  const HERO_L2_PRE = 'a ';
  const HERO_L2_WORD = 'dictar';
  const HERO_L3 = 'clase';
  const heroTotalChars = HERO_L1.length + HERO_L2_PRE.length + HERO_L2_WORD.length + HERO_L3.length;
  const [heroTypedChars, setHeroTypedChars] = useState(0);
  const [heroStrikeActive, setHeroStrikeActive] = useState(false);
  useEffect(() => {
    const typeInterval = setInterval(() => {
      setHeroTypedChars((prev) => {
        if (prev >= heroTotalChars) {
          clearInterval(typeInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(typeInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (heroTypedChars < heroTotalChars) return;
    const strikeTimeout = setTimeout(() => setHeroStrikeActive(true), 300);
    return () => clearTimeout(strikeTimeout);
  }, [heroTypedChars, heroTotalChars]);
  const heroLine1Visible = HERO_L1.slice(0, Math.min(HERO_L1.length, heroTypedChars));
  const heroLine2PreVisible = HERO_L2_PRE.slice(0, Math.max(0, Math.min(HERO_L2_PRE.length, heroTypedChars - HERO_L1.length)));
  const heroLine2WordVisible = HERO_L2_WORD.slice(0, Math.max(0, Math.min(HERO_L2_WORD.length, heroTypedChars - HERO_L1.length - HERO_L2_PRE.length)));
  const heroLine3Visible = HERO_L3.slice(0, Math.max(0, Math.min(HERO_L3.length, heroTypedChars - HERO_L1.length - HERO_L2_PRE.length - HERO_L2_WORD.length)));
  const heroTypingDone = heroTypedChars >= heroTotalChars;
  // Cursor parpadeante: solo se muestra en la línea que se está escribiendo
  // en este momento (desaparece al terminar todo el título).
  const heroRow2Total = HERO_L2_PRE.length + HERO_L2_WORD.length;
  const heroRow1Active = heroTypedChars < HERO_L1.length;
  const heroRow2Active = !heroRow1Active && heroTypedChars < HERO_L1.length + heroRow2Total;
  const heroRow3Active = !heroRow1Active && !heroRow2Active && !heroTypingDone;

  const onCardKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDocente(id); }
  };

  // Animación de entrada (fade + slide-up) para el resto de la página al
  // hacer scroll — el hero ya tiene su propia animación (typewriter), esto
  // cubre ejes, docentes, proyectos, estudia y footer. Cada elemento con
  // clase .pcd-reveal se anima una sola vez, al entrar en pantalla.
  useEffect(() => {
    const els = document.querySelectorAll('.pcd-reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Drag-to-pan del carrusel de docentes (reemplaza el scroll horizontal nativo visible).
  const docentesGridRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, startScroll: 0, moved: false });

  const onDocentesMouseDown = (e: React.MouseEvent) => {
    const grid = docentesGridRef.current;
    if (!grid) return;
    dragState.current = { isDown: true, startX: e.pageX, startScroll: grid.scrollLeft, moved: false };
    grid.classList.add('is-dragging');
  };
  const onDocentesMouseMove = (e: React.MouseEvent) => {
    const grid = docentesGridRef.current;
    if (!grid || !dragState.current.isDown) return;
    const dx = e.pageX - dragState.current.startX;
    if (Math.abs(dx) > 4) dragState.current.moved = true;
    grid.scrollLeft = dragState.current.startScroll - dx;
  };
  const endDocentesDrag = () => {
    docentesGridRef.current?.classList.remove('is-dragging');
    dragState.current.isDown = false;
  };
  // Evita que el click que cierra un drag abra el modal de perfil.
  const onDocenteCardClick = (id: string) => {
    if (dragState.current.moved) { dragState.current.moved = false; return; }
    openDocente(id);
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
          <span><b>Pregrado</b> · <span className="pcd-hero__meta-value">8 semestres</span></span>
          <span className="center">
            Bogotá ·{' '}
            <span className="pcd-hero__meta-value">
              <span className="pcd-hero__meta-full">Universidad El Bosque</span>
              <span className="pcd-hero__meta-short">U. El Bosque</span>
            </span>
          </span>
          <span className="right"><b>SNIES</b> · <span className="pcd-hero__meta-value">116265</span></span>
        </div>

        <h1 className="pcd-hero__title">
          <span className="row">
            {heroLine1Visible}
            {heroRow1Active && <span className="pcd-hero__cursor" aria-hidden="true" />}
          </span>
          <span className="row row--shift1">
            {heroLine2PreVisible}
            <span className={`pcd-hero__dictar${heroStrikeActive ? ' is-struck' : ''}`}>{heroLine2WordVisible}</span>
            {heroRow2Active && <span className="pcd-hero__cursor" aria-hidden="true" />}
          </span>
          <span className="row row--shift2">
            {heroLine3Visible}
            <span className={`blob${heroTypingDone ? ' is-visible' : ''}`}>.</span>
            {heroRow3Active && <span className="pcd-hero__cursor" aria-hidden="true" />}
          </span>
        </h1>

        <div className="pcd-hero__bottom">
          <div className="pcd-hero__floor-line" aria-hidden="true" />
          <div className="pcd-hero__floor-line--right" aria-hidden="true" />

          <div className="pcd-hero__quienes-row">
            <span className="pcd-hero__quienes-label">¿quiénes <br />somos?</span>
          </div>
          <p className="pcd-hero__quienes-body pcd-hero__quienes-body-desktop">
            Creamos en medio del ruido, la velocidad{' '.repeat(17)}y{' '.repeat(10)} el cambio. En un mundo donde las ideas evolucionan todos los días{' '.repeat(14)} y las formas de crear ya no caben en una sola disciplina. Como{' '.repeat(17)} Creadores Digitales, aprendemos a pensar críticamente, experimentar sin miedo y convertir la curiosidad en acción.
          </p>
          <p className="pcd-hero__quienes-body pcd-hero__quienes-body-mobile">
            Creamos en medio del ruido, la velocidad y el cambio. En un mundo donde las ideas evolucionan todos los días y las formas de crear ya no caben en una sola disciplina. Como Creadores Digitales, aprendemos a pensar críticamente, experimentar sin miedo y convertir la curiosidad en acción.
          </p>

          <div className="pcd-hero__logos-row">
            <div className="pcd-hero__brand">
              <img className="pcd-hero__brand-logo" src={`${IMG}/LogoUEB_CreacionDigital.png`} alt="Universidad El Bosque · Creación Digital · Pregrado | 8 Semestres" />
            </div>
            <a className="pcd-hero__cta-mobile" href={APLICA_URL} target="_blank" rel="noopener">
              <span>APLICA AHORA</span>
              <span aria-hidden="true">&#8594;</span>
            </a>
          </div>

          <div className="pcd-hero__photo" aria-hidden="true" />
        </div>
      </section>

      {/* ===== MARQUEE · Esto aprenderás =====
          id="programa" vive aquí (no en la section de abajo) para que al
          navegar desde el nav ("PROGRAMA") lo primero que se vea sea esta
          franja animada, no que la salte directo al eje de contenido. */}
      <div id="programa" className="pcd-marquee" aria-hidden="true">
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
      <section className="pcd-axis pcd-axis--contenido">
        <div className="pcd-axis__left">
          <div className="pcd-axis__tag pcd-reveal">01 · programa</div>
          <h2 className="pcd-axis__word pcd-reveal">
            <span className="pcd-axis__word-desktop">conte-<br />nido</span>
            <span className="pcd-axis__word-mobile">contenido</span>
          </h2>
          <p className="pcd-axis__caption pcd-reveal">Contenido audiovisual, animación 2D, generación de imágenes y videos con IA</p>
          <div className="pcd-axis__image pcd-reveal" style={{ backgroundImage: `url('${IMG}/proyecto-3.webp')` }} aria-hidden="true" />
        </div>
        <div className="pcd-axis__right">
          <article className="pcd-vs pcd-reveal">
            <span className="pcd-vs__idx">1.1</span>
            <div>
              <h3 className="pcd-vs__title">En vez de publicar; <span className="pcd-vs__accent">conectar.</span></h3>
              <p className="pcd-vs__body">El contenido no se trata solo de subir videos o seguir tendencias. Aprendemos a crear mensajes y experiencias digitales capaces de generar comunidad e impacto real.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs pcd-reveal">
            <span className="pcd-vs__idx">1.2</span>
            <div>
              <h3 className="pcd-vs__title">En vez de perseguir algoritmos; <span className="pcd-vs__accent">entender audiencias.</span></h3>
              <p className="pcd-vs__body">Las plataformas cambian todos los días. Por eso aprendemos a analizar comportamientos y crear estrategias que conecten con las personas más allá de una métrica.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs pcd-reveal">
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
          <div className="pcd-axis__tag pcd-reveal">02 · programa</div>
          <h2 className="pcd-axis__word pcd-reveal">
            <span className="pcd-axis__word-desktop">mundo<br />3d</span>
            <span className="pcd-axis__word-mobile">mundo 3d</span>
          </h2>
          <p className="pcd-axis__caption pcd-reveal">Videojuegos, diseño de personajes, modelado, escultura y animación 3D</p>
          <div className="pcd-axis__image pcd-reveal" style={{ backgroundImage: `url('${IMG}/proyecto-5.webp')` }} aria-hidden="true" />
        </div>
        <div className="pcd-axis__right">
          <article className="pcd-vs pcd-reveal">
            <span className="pcd-vs__idx">2.1</span>
            <div>
              <h3 className="pcd-vs__title">En vez de imaginar mundos; <span className="pcd-vs__accent">construirlos.</span></h3>
              <p className="pcd-vs__body">Detrás de cada videojuego, personaje o experiencia inmersiva hay personas capaces de convertir ideas en realidades digitales. Aquí aprendes a combinar narrativa, diseño y tecnología para crear experiencias memorables.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs pcd-reveal">
            <span className="pcd-vs__idx">2.2</span>
            <div>
              <h3 className="pcd-vs__title">En vez de solo jugar; <span className="pcd-vs__accent">diseñar experiencias.</span></h3>
              <p className="pcd-vs__body">Los mundos digitales no se crean únicamente desde lo visual. Aprendemos a construir personajes, escenarios e interacciones capaces de generar emoción e inmersión.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs pcd-reveal">
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
          <div className="pcd-axis__tag pcd-reveal">03 · programa</div>
          <h2 className="pcd-axis__word pcd-reveal">
            <span className="pcd-axis__word-desktop">prod-<br />ucto</span>
            <span className="pcd-axis__word-mobile">producto</span>
          </h2>
          <p className="pcd-axis__caption pcd-reveal">Código, creación de apps y páginas web, UX/UI, análisis de usuarios</p>
          <div className="pcd-axis__image pcd-reveal" style={{ backgroundImage: `url('${IMG}/proyecto-6.webp')` }} aria-hidden="true" />
        </div>
        <div className="pcd-axis__right">
          <article className="pcd-vs pcd-reveal">
            <span className="pcd-vs__idx">3.1</span>
            <div>
              <h3 className="pcd-vs__title">En vez de usar plataformas; <span className="pcd-vs__accent">crearlas.</span></h3>
              <p className="pcd-vs__body">Las aplicaciones, redes sociales y productos digitales nacen de personas capaces de entender cómo interactuamos en internet. Aquí aprendes a crear experiencias digitales pensadas para conectar y generar impacto real.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs pcd-reveal">
            <span className="pcd-vs__idx">3.2</span>
            <div>
              <h3 className="pcd-vs__title">En vez de pensar en pantallas; <span className="pcd-vs__accent">pensar en personas.</span></h3>
              <p className="pcd-vs__body">Un producto digital no funciona solo porque se vea bien. Aprendemos a entender usuarios y diseñar experiencias intuitivas, atractivas y fáciles de usar.</p>
            </div>
          </article>
          <hr className="pcd-axis__divider" />
          <article className="pcd-vs pcd-reveal">
            <span className="pcd-vs__idx">3.3</span>
            <div>
              <h3 className="pcd-vs__title">En vez de seguir ideas; <span className="pcd-vs__accent">convertirlas en productos.</span></h3>
              <p className="pcd-vs__body">Las grandes plataformas digitales comenzaron como una idea capaz de resolver una necesidad real. Aquí aprendes a combinar creatividad, tecnología y estrategia para construir experiencias digitales con potencial de crecer en el mundo real.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ===== MARQUEE · Conoce a nuestro equipo docente =====
          id="docentes" vive aquí (no en la section de abajo), mismo motivo
          que el marquee de "programa": que al navegar se vea primero la
          franja animada. */}
      <div id="docentes" className="pcd-marquee" aria-hidden="true">
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
      <section className="pcd-docentes">
        <header className="pcd-docentes__head pcd-reveal">
          <h2 className="pcd-docentes__title">Quienes crean afuera,<br />enseñan aquí.</h2>
          <p className="pcd-docentes__sub">Experiencia real <br className="pcd-docentes__sub-break" />convertida en aprendizaje</p>
        </header>
        <div
          className="pcd-docentes__grid"
          ref={docentesGridRef}
          onMouseDown={onDocentesMouseDown}
          onMouseMove={onDocentesMouseMove}
          onMouseUp={endDocentesDrag}
          onMouseLeave={endDocentesDrag}
        >
          <article
            className="pcd-docente pcd-docente--paula pcd-reveal" tabIndex={0} role="button"
            aria-label="Ver perfil de Paula Lenis"
            onClick={() => onDocenteCardClick('paula')}
            onKeyDown={(e) => onCardKey(e, 'paula')}
            style={{ '--docente-init': `url('${IMG}/Paula_Init.webp')`, '--docente-end': `url('${IMG}/Paula_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--like" src={`${IMG}/Like.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Paula<br />Lenis</h3>
            <p className="pcd-docente__bio">Diseñadora Gráfica y especialista en Experiencia de Usuario (UX), con experiencia en diseño de productos digitales, estrategia UX y liderazgo de equipos en empresas como Rappi e IxDF Colombia.</p>
            <div className="pcd-docente__tags">
              <span className="pcd-docente__tag">UX / UI</span>
              <span className="pcd-docente__tag">Estrategia</span>
              <span className="pcd-docente__tag">Liderazgo</span>
            </div>
          </article>

          <article
            className="pcd-docente pcd-docente--camilo pcd-reveal" tabIndex={0} role="button"
            aria-label="Ver perfil de Camilo Cardozo"
            onClick={() => onDocenteCardClick('camilo')}
            onKeyDown={(e) => onCardKey(e, 'camilo')}
            style={{ '--docente-init': `url('${IMG}/Camilo_Init.webp')`, '--docente-end': `url('${IMG}/Camilo_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--idea" src={`${IMG}/Idea.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Camilo<br />Cardozo</h3>
            <p className="pcd-docente__bio">Diseñador gráfico y especialista en marketing digital, con más de 15 años de experiencia en branding, UX/UI, creatividad y transformación digital para marcas y ecosistemas de alto impacto en Latinoamérica.</p>
            <div className="pcd-docente__tags">
              <span className="pcd-docente__tag">Branding</span>
              <span className="pcd-docente__tag">Storytelling</span>
              <span className="pcd-docente__tag">UX</span>
            </div>
          </article>

          <article
            className="pcd-docente pcd-docente--vanessa pcd-reveal" tabIndex={0} role="button"
            aria-label="Ver perfil de Vanessa Tovar"
            onClick={() => onDocenteCardClick('vanessa')}
            onKeyDown={(e) => onCardKey(e, 'vanessa')}
            style={{ '--docente-init': `url('${IMG}/Vanessa_Init.webp')`, '--docente-end': `url('${IMG}/Vanessa_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--love" src={`${IMG}/Love.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Vanessa<br />Tovar</h3>
            <p className="pcd-docente__bio">Diseñadora Industrial y magíster en Customer Experience (CX) con experiencia en UX/UI, estrategia digital y diseño de experiencias para plataformas como Bolsa de Valores de Colombia y Metrocuadrado, desarrollando productos digitales.</p>
            <div className="pcd-docente__tags">
              <span className="pcd-docente__tag">UX / UI</span>
              <span className="pcd-docente__tag">Estrategia</span>
              <span className="pcd-docente__tag">Research</span>
            </div>
          </article>

          <article
            className="pcd-docente pcd-docente--juandavid pcd-reveal" tabIndex={0} role="button"
            aria-label="Ver perfil de Juan David Aristizabal"
            onClick={() => onDocenteCardClick('juandavid')}
            onKeyDown={(e) => onCardKey(e, 'juandavid')}
            style={{ '--docente-init': `url('${IMG}/JuanDavid_Init.webp')`, '--docente-end': `url('${IMG}/JuanDavid_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--star" src={`${IMG}/Star.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Juan David<br />Aristizabal</h3>
            <p className="pcd-docente__bio">Director creativo en Meta-Carbon con experiencia en animación 2D/3D, motion graphics, videojuegos y experiencias digitales desarrolladas en WebGL. Ha trabajado en proyectos audiovisuales y de investigación-creación.</p>
            <div className="pcd-docente__tags">
              <span className="pcd-docente__tag">Animación</span>
              <span className="pcd-docente__tag">Videojuegos</span>
              <span className="pcd-docente__tag">3D</span>
            </div>
          </article>
        </div>
      </section>

      {/* ===== MODALES DOCENTES ===== */}
      <DocenteModal
        id="juandavid" active={activeDocente === 'juandavid'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/JuanDavid_Init.webp`}
        portraitEnd={`${IMG}/JuanDavid_End.webp`}
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
        id="vanessa" active={activeDocente === 'vanessa'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/Vanessa_Init.webp`}
        portraitEnd={`${IMG}/Vanessa_End.webp`}
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
        id="camilo" active={activeDocente === 'camilo'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/Camilo_Init.webp`}
        portraitEnd={`${IMG}/Camilo_End.webp`}
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
        id="paula" active={activeDocente === 'paula'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/Paula_Init.webp`}
        portraitEnd={`${IMG}/Paula_End.webp`}
        name={<>Paula<br />Lenis</>}
        tags={['UX | UI', 'Estrategia', 'Liderazgo']}
      >
        <h3 className="pcd-docente-modal__heading">Perfil</h3>
        <p className="pcd-docente-modal__p">Soy Diseñadora Gráfica y especialista en Experiencia de Usuario (UX), con experiencia en diseño de productos digitales, estrategia UX y liderazgo de equipos. He trabajado creando soluciones centradas en las personas para empresas de tecnología, impulsando experiencias digitales intuitivas, eficientes e innovadoras.</p>
        <p className="pcd-docente-modal__p">Me apasiona combinar diseño, estrategia e inteligencia artificial para desarrollar productos con impacto, además de contribuir al crecimiento de la comunidad UX a través de mentorías y espacios de aprendizaje.</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">Experiencia</h3>
        <ul className="pcd-docente-modal__list">
          <li>
            <strong>Rappi</strong>
            <span className="pcd-docente-modal__detail-plain">He liderado el diseño de productos digitales y equipos de Product Design, creando experiencias más intuitivas y escalables para millones de usuarios. Mi trabajo ha estado enfocado en conectar las necesidades de las personas con los objetivos del negocio mediante estrategias de diseño e innovación.</span>
          </li>
          <li>
            <strong>IxDF Colombia</strong>
            <span className="pcd-docente-modal__detail-plain">Como Country Manager lidero la comunidad de Interaction Design Foundation en Colombia, promoviendo eventos, alianzas y espacios de aprendizaje para fortalecer el ecosistema de UX y Product Design en el país.</span>
          </li>
          <li>
            <strong>Laboratoria, ADPList y +Mujeres en UX LATAM</strong>
            <span className="pcd-docente-modal__detail-plain">He participado como mentora acompañando a profesionales que inician o fortalecen su carrera en UX y Product Design, compartiendo conocimientos y apoyando su desarrollo profesional.</span>
          </li>
        </ul>
      </DocenteModal>

      {/* ===== PROYECTOS ===== */}
      <section id="proyectos" className="pcd-projects">
        <header className="pcd-projects__head pcd-reveal">
          <h2 className="pcd-projects__title">
            Proyectos que<br />
            <span className="pop">crean</span> nuestros<br />
            estudiantes.
          </h2>
          <Link className="pcd-cta-secondary" to="/proyectos">
            <span>VER PROYECTOS</span>
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className="pcd-projects__grid">
          {PROYECTOS.slice(0, 2).map((p, i) => (
            <article key={p.id} className={`pcd-project ${i === 0 ? 'pcd-project--wide' : 'pcd-project--tall'} pcd-reveal`}>
              <div
                className={`pcd-project__media${p.id === 'campana-mundial' ? ' pcd-project__media--zoom' : ''}`}
                style={{ backgroundImage: `url('${p.image}')` }}
                aria-hidden="true"
              />
              <div className="pcd-project__meta">
                <span>{p.subject.toUpperCase()}</span>
                <span>{p.year}</span>
              </div>
              <p className="pcd-project__caption">{p.caption}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== ESTUDIA / CTA FINAL ===== */}
      <section id="aplica" className="pcd-estudia">
        <div className="pcd-estudia__copy">
          <span className="pcd-estudia__eyebrow pcd-reveal">U. EL BOSQUE &gt;&gt; SNIES 116265 &gt;&gt; 8 SEMESTRES</span>
          <h2 className="pcd-estudia__title pcd-reveal">
            Estudia<br />
            <span className="neon">Creación</span>
            Digital.
          </h2>
          <p className="pcd-estudia__body pcd-reveal">No estudias Creación Digital para encajar en el futuro, sino para ayudar a crearlo. Haz parte de una nueva generación de creadores capaces de conectar ideas, tecnología y cultura digital, e inscríbete para empezar a construir lo que viene después.</p>
          <a className="pcd-estudia__cta pcd-reveal" href={APLICA_URL} target="_blank" rel="noopener">
            <span>APLICA AHORA</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="pcd-estudia__photo pcd-reveal">
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
          <div className="pcd-footer__col pcd-reveal">
            <span className="pcd-footer__title">Programa</span>
            <a className="pcd-footer__link" href="https://www.unbosque.edu.co/programas-academicos/facultad-creacion-comunicacion/creacion-digital" target="_blank" rel="noopener">Información</a>
            <a className="pcd-footer__link" href="/programa/pdf/Manifiesto-CREADIG.pdf" target="_blank" rel="noopener">Manifiesto</a>
          </div>
          <div className="pcd-footer__col pcd-reveal">
            <span className="pcd-footer__title">Comunidad</span>
            <a className="pcd-footer__link" href="https://www.instagram.com/creaciondigital.ueb/" target="_blank" rel="noopener">Instagram</a>
            <a className="pcd-footer__link" href="https://www.tiktok.com/@creaciondigital.ueb" target="_blank" rel="noopener">TikTok</a>
          </div>
          <div className="pcd-footer__col pcd-reveal">
            <span className="pcd-footer__title">Universidad</span>
            <a className="pcd-footer__link" href="https://www.unbosque.edu.co/" target="_blank" rel="noopener">Universidad El Bosque</a>
            <a className="pcd-footer__link" href="https://www.unbosque.edu.co/programas-academicos/facultad-creacion-comunicacion" target="_blank" rel="noopener">FACyC</a>
          </div>
        </div>
        <p className="pcd-footer__legal">© Universidad El Bosque · Pregrado de Creación Digital · 2026</p>
      </footer>
    </div>
  );
}
