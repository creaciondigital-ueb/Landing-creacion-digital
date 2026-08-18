import { useEffect, useState, useRef, type ReactNode, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { PROYECTOS } from '../data/proyectos';
import { useLang } from '../i18n/LanguageContext';
import '../styles/programa.css';

const IMG = '/programa/img';
const APLICA_URL = 'https://www.unbosque.edu.co/inscripciones/pregrado';

/** Herramientas del dock — modo "Contenido" del eje 01. */
const CONTENIDO_DOCK = [
  { name: 'Higgsfield', icon: `${IMG}/dock/higgsfield.png` },
  { name: 'ChatGPT', icon: `${IMG}/dock/chatgpt.png` },
  { name: 'Runway', icon: `${IMG}/dock/runway.png` },
  { name: 'CapCut', icon: `${IMG}/dock/capcut.png` },
  { name: 'DaVinci Resolve', icon: `${IMG}/dock/davinci-resolve.png` },
  { name: 'Adobe', icon: `${IMG}/dock/adobe.png` },
  { name: 'Affinity', icon: `${IMG}/dock/affinity.png` },
];

/** Herramientas del dock — modo "Contenido" del eje 02 (mundo 3d). */
const MUNDO_DOCK = [
  { name: 'Blender', icon: `${IMG}/dock/blender.png` },
  { name: 'Unity', icon: `${IMG}/dock/unity.png` },
  { name: 'Unreal Engine', icon: `${IMG}/dock/unreal-engine.png` },
  { name: 'Cascadeur', icon: `${IMG}/dock/cascadeur.png` },
];

/** Herramientas del dock — modo "Contenido" del eje 03 (producto). */
const PRODUCTO_DOCK = [
  { name: 'Claude', icon: `${IMG}/dock/claude.png` },
  { name: 'Figma', icon: `${IMG}/dock/figma.png` },
  { name: 'GitHub', icon: `${IMG}/dock/github.png` },
  { name: 'Visual Studio Code', icon: `${IMG}/dock/vscode.png` },
];

/**
 * Convierte un string con **frases resaltadas** (marcadas entre doble
 * asterisco, estilo markdown liviano) en nodos React con <strong> en vez
 * de texto plano — para poder resaltar palabras clave dentro de un párrafo
 * de traducción sin partirlo en múltiples keys de i18n.
 */
function renderAccented(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((chunk, i) =>
    i % 2 === 1 ? <strong className="pcd-accent-text" key={i}>{chunk}</strong> : chunk
  );
}

/**
 * Landing pública del Programa Creación Digital (Universidad El Bosque).
 * Soporta ES / EN mediante el contexto LanguageContext + hook useLang().
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

const DOCENTE_SWIPE_THRESHOLD = 50;

function DocenteModal({ id, active, onClose, onSwipe, portrait, portraitEnd, name, tags, children }: DocenteModalProps) {
  const { t } = useLang();
  const ref = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const didSwipeRef = useRef(false);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < DOCENTE_SWIPE_THRESHOLD) return;
    didSwipeRef.current = true;
    onSwipe(dx < 0 ? 1 : -1);
  };

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
      <button className="pcd-docente-modal__close" type="button" aria-label={t.docentes.cerrar} onClick={onClose}>X</button>
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
            {tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
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
  const { lang, setLang, t } = useLang();

  // Modal de docente activo
  const [activeDocente, setActiveDocente] = useState<string | null>(null);
  const openDocente = (id: string) => setActiveDocente(id);
  const closeDocente = () => setActiveDocente(null);

  const DOCENTE_ORDER = ['paula', 'sofia', 'nicolas', 'ximena', 'camilo', 'daniela', 'juandavid', 'vanessa'];
  const onSwipeDocente = (dir: 1 | -1) => {
    setActiveDocente((current) => {
      if (!current) return current;
      const idx = DOCENTE_ORDER.indexOf(current);
      if (idx === -1) return current;
      const nextIdx = (idx + dir + DOCENTE_ORDER.length) % DOCENTE_ORDER.length;
      return DOCENTE_ORDER[nextIdx];
    });
  };

  // Menú hamburguer
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle Definición / Contenido — eje 01 (sección "contenido")
  const [axis01Mode, setAxis01Mode] = useState<'definicion' | 'contenido'>('definicion');
  // Toggle Definición / Contenido — eje 02 (sección "mundo 3d")
  const [axis02Mode, setAxis02Mode] = useState<'definicion' | 'contenido'>('definicion');
  // Toggle Definición / Contenido — eje 03 (sección "producto")
  const [axis03Mode, setAxis03Mode] = useState<'definicion' | 'contenido'>('definicion');

  // ── Hero typewriter ──────────────────────────────────────────
  const [heroTypedChars, setHeroTypedChars] = useState(0);
  const [heroStrikeActive, setHeroStrikeActive] = useState(false);

  // Reinicia la animación cuando cambia el idioma
  useEffect(() => {
    const L1 = t.hero.line1;
    const L2PRE = t.hero.line2pre;
    const L2WORD = t.hero.line2word;
    const L3 = t.hero.line3;
    const total = L1.length + L2PRE.length + L2WORD.length + L3.length;

    setHeroTypedChars(0);
    setHeroStrikeActive(false);

    const typeInterval = setInterval(() => {
      setHeroTypedChars((prev) => {
        if (prev >= total) { clearInterval(typeInterval); return prev; }
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(typeInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const HERO_L1 = t.hero.line1;
  const HERO_L2_PRE = t.hero.line2pre;
  const HERO_L2_WORD = t.hero.line2word;
  const HERO_L3 = t.hero.line3;
  const heroTotalChars = HERO_L1.length + HERO_L2_PRE.length + HERO_L2_WORD.length + HERO_L3.length;

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

  const heroRow2Total = HERO_L2_PRE.length + HERO_L2_WORD.length;
  const heroRow1Active = heroTypedChars < HERO_L1.length;
  const heroRow2Active = !heroRow1Active && heroTypedChars < HERO_L1.length + heroRow2Total;
  const heroRow3Active = !heroRow1Active && !heroRow2Active && !heroTypingDone;

  const onCardKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDocente(id); }
  };

  // Animaciones scroll reveal
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

  // Drag-to-pan carrusel docentes (+ loop infinito: el set de cards se
  // duplica una vez en el DOM; al cruzar el borde entre el set original y
  // el duplicado, saltamos el scrollLeft hacia atrás en exactamente ese
  // mismo ancho — visualmente idéntico, así que el salto es imperceptible
  // y el carrusel puede seguir arrastrándose/scrolleando para siempre.
  const docentesGridRef = useRef<HTMLDivElement>(null);
  const docentesFirstCardRef = useRef<HTMLElement>(null);
  const docentesFirstCloneRef = useRef<HTMLElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, startScroll: 0, moved: false });

  const onDocentesScroll = () => {
    const grid = docentesGridRef.current;
    const a = docentesFirstCardRef.current;
    const b = docentesFirstCloneRef.current;
    if (!grid || !a || !b) return;
    const period = b.getBoundingClientRect().left - a.getBoundingClientRect().left;
    if (period <= 0) return;
    if (grid.scrollLeft >= period) {
      grid.scrollLeft -= period;
      dragState.current.startScroll -= period;
    } else if (grid.scrollLeft < 0) {
      grid.scrollLeft += period;
      dragState.current.startScroll += period;
    }
  };

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
  const onDocenteCardClick = (id: string) => {
    if (dragState.current.moved) { dragState.current.moved = false; return; }
    openDocente(id);
  };

  // Autoavance continuo hacia la izquierda (scrollLeft creciente). Solo se
  // detiene mientras se arrastra activamente; el loop infinito de
  // onDocentesScroll ya se encarga de que, al llegar al final, vuelva a
  // Paula sin salto visible, así que nunca deja de moverse.
  //
  // Al cambiar de ventana/pestaña, requestAnimationFrame se pausa (el
  // navegador no gasta ciclos en una pestaña oculta); al volver, el próximo
  // frame llega con un "time" que saltó varios segundos hacia adelante. Sin
  // límite, ese dt gigante se traduce en un salto brusco de scrollLeft (se
  // veía como un "brinco" al volver). Dos salvaguardas: se limita el dt
  // máximo por frame (nunca avanza de más aunque haya habido un frame lento
  // o una pausa), y además se resetea lastTime cada vez que la pestaña
  // vuelve a estar visible, para que ese primer frame de vuelta no cuente
  // tiempo "de más" en absoluto.
  useEffect(() => {
    const grid = docentesGridRef.current;
    if (!grid) return;

    const SPEED_PX_PER_SEC = 32;
    const MAX_DT = 1 / 30; // nunca avanza más de lo que avanzaría en ~2 frames a 60fps
    let rafId = 0;
    let lastTime: number | null = null;

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, MAX_DT);
      lastTime = time;
      if (!dragState.current.isDown) {
        grid.scrollLeft += SPEED_PX_PER_SEC * dt;
      }
      rafId = requestAnimationFrame(step);
    };
    const onVisibilityChange = () => { lastTime = null; };
    document.addEventListener('visibilitychange', onVisibilityChange);
    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  /** Toggle visual ES | EN */
  const LangToggle = () => (
    <button
      type="button"
      className="pcd-lang-toggle"
      aria-label={t.nav.langLabel}
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
    >
      <span className={`pcd-lang-toggle__opt${lang === 'es' ? ' pcd-lang-toggle__opt--active' : ''}`}>ES</span>
      <span className="pcd-lang-toggle__sep">|</span>
      <span className={`pcd-lang-toggle__opt${lang === 'en' ? ' pcd-lang-toggle__opt--active' : ''}`}>EN</span>
    </button>
  );

  return (
    <div className="pcd-page">

      {/* ===== HEADER ===== */}
      <header className="pcd-header">
        <a href="#top" className="pcd-brand" aria-label="Inicio Creación Digital · Universidad El Bosque">
          <img className="pcd-brand__logo" src={`${IMG}/Label_UEB_CreacionDigital_Horizontal.png`} alt="Universidad El Bosque · Creación Digital" />
        </a>
        <nav className={`pcd-nav${menuOpen ? ' is-open' : ''}`} aria-label="Principal">
          <a className="pcd-nav__link" href="#programa" onClick={() => setMenuOpen(false)}>{t.nav.programa}</a>
          <a className="pcd-nav__link" href="#docentes" onClick={() => setMenuOpen(false)}>{t.nav.docentes}</a>
          <a className="pcd-nav__link" href="#proyectos" onClick={() => setMenuOpen(false)}>{t.nav.proyectos}</a>
          <LangToggle />
        </nav>
        <div className="pcd-header__actions">
          <LangToggle />
          <a className="pcd-cta-pill" href={APLICA_URL} target="_blank" rel="noopener">
            <span>{t.nav.aplicaAhora}</span>
            <span className="pcd-cta-pill__arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <button
          type="button"
          className={`pcd-hamburger${menuOpen ? ' is-open' : ''}`}
          aria-label={t.nav.menu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
        </button>
      </header>

      {/* ===== HERO ===== */}
      <section id="top" className={`pcd-hero${lang === 'en' ? ' pcd-hero--en' : ''}`}>
        <div className="pcd-hero__meta">
          <span><b>{t.hero.meta.tipo}</b> · <span className="pcd-hero__meta-value">{t.hero.meta.duracion}</span></span>
          <span className="center">
            {t.hero.meta.ciudad} ·{' '}
            <span className="pcd-hero__meta-value">
              <span className="pcd-hero__meta-full">{t.hero.meta.uni}</span>
              <span className="pcd-hero__meta-short">{t.hero.meta.uniShort}</span>
            </span>
          </span>
          <span className="right"><b>{t.hero.meta.snies}</b> · <span className="pcd-hero__meta-value">116265</span></span>
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
            <span className="pcd-hero__quienes-label">
              {t.hero.quienesLabel.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </span>
          </div>
          <p className="pcd-hero__quienes-body pcd-hero__quienes-body-desktop">
            {lang === 'es' ? <>Creamos en medio del ruido, la velocidad{' '.repeat(17)}y{' '.repeat(10)} el cambio. En un mundo donde las ideas evolucionan todos los días{' '.repeat(14)} y las formas de crear ya no caben en una sola disciplina. Como{' '.repeat(17)} Creadores Digitales, aprendemos a pensar críticamente, experimentar sin miedo y convertir la curiosidad en acción.</> : <>We create amid the noise, speed and{' '.repeat(32)} change. In a world where ideas evolve every day and the ways of{' '.repeat(15)} creating no longer fit within a single discipline. As Digital Creators,{' '.repeat(15)} we learn to think critically, experiment fearlessly, and turn curiosity into action.</>}
          </p>
          <p className="pcd-hero__quienes-body pcd-hero__quienes-body-mobile">
            {t.hero.quienesBody}
          </p>

          <div className="pcd-hero__logos-row">
            <div className="pcd-hero__brand">
              <img
                className="pcd-hero__brand-logo"
                src={lang === 'en'
                  ? `${IMG}/Label_UEB_CreacionDigital_EN.png`
                  : `${IMG}/LogoUEB_CreacionDigital.png`}
                alt={lang === 'en'
                  ? 'Universidad El Bosque · Creación Digital · Bachelor Degree | 8 Semesters'
                  : 'Universidad El Bosque · Creación Digital · Pregrado | 8 Semestres'}
              />
            </div>
            <a className="pcd-hero__cta-mobile" href={APLICA_URL} target="_blank" rel="noopener">
              <span>{t.nav.aplicaAhora}</span>
              <span aria-hidden="true">&#8594;</span>
            </a>
          </div>

          <div className="pcd-hero__photo" aria-hidden="true" />
        </div>
      </section>

      {/* ===== MARQUEE · aprenderás ===== */}
      <div id="programa" className="pcd-marquee" aria-hidden="true">
        <div className="pcd-marquee__track">
          <span>
            {t.marquee1} <span className="pcd-marquee__star">✺</span>
            {t.marquee1} <span className="pcd-marquee__star">✺</span>
            {t.marquee1} <span className="pcd-marquee__star">✺</span>
          </span>
          <span>
            {t.marquee1} <span className="pcd-marquee__star">✺</span>
            {t.marquee1} <span className="pcd-marquee__star">✺</span>
            {t.marquee1} <span className="pcd-marquee__star">✺</span>
          </span>
        </div>
      </div>

      {/* ===== AXIS 01 · CONTENIDO ===== */}
      <section className="pcd-axis pcd-axis--contenido">
        <div className="pcd-axis__left">
          <button
            type="button"
            className="pcd-axis__switch pcd-reveal"
            aria-label={axis01Mode === 'definicion' ? t.axis01.toggleToContenido : t.axis01.toggleToDefinicion}
            onClick={() => setAxis01Mode(axis01Mode === 'definicion' ? 'contenido' : 'definicion')}
          >
            {axis01Mode === 'definicion' ? t.axis01.toggleToContenido : t.axis01.toggleToDefinicion}
          </button>
          <h2 className="pcd-axis__word pcd-reveal">
            <span className="pcd-axis__word-desktop">
              {t.axis01.wordLine1}
              {t.axis01.wordLine2 && <><br />{t.axis01.wordLine2}</>}
            </span>
            <span className="pcd-axis__word-mobile">{t.axis01.wordFull}</span>
          </h2>
          <p className="pcd-axis__caption pcd-reveal">{t.axis01.caption}</p>
          <div className="pcd-axis__image pcd-reveal" style={{ backgroundImage: `url('${IMG}/proyecto-3.webp')` }} aria-hidden="true" />
        </div>
        <div className="pcd-axis__right">
          {axis01Mode === 'definicion' ? (
            <>
              <article className="pcd-vs">
                <span className="pcd-vs__idx">1.1</span>
                <div>
                  <h3 className="pcd-vs__title">{t.axis01.vs11title} <span className="pcd-vs__accent">{t.axis01.vs11accent}</span></h3>
                  <p className="pcd-vs__body">{t.axis01.vs11body}</p>
                </div>
              </article>
              <hr className="pcd-axis__divider" />
              <article className="pcd-vs">
                <span className="pcd-vs__idx">1.2</span>
                <div>
                  <h3 className="pcd-vs__title">{t.axis01.vs12title} <span className="pcd-vs__accent">{t.axis01.vs12accent}</span></h3>
                  <p className="pcd-vs__body">{t.axis01.vs12body}</p>
                </div>
              </article>
              <hr className="pcd-axis__divider" />
              <article className="pcd-vs">
                <span className="pcd-vs__idx">1.3</span>
                <div>
                  <h3 className="pcd-vs__title">{t.axis01.vs13title} <span className="pcd-vs__accent">{t.axis01.vs13accent}</span></h3>
                  <p className="pcd-vs__body">{t.axis01.vs13body}</p>
                </div>
              </article>
            </>
          ) : (
            <>
              <h3 className="pcd-content-title">{t.axis01.contenidoTitle}</h3>
              <p className="pcd-content-copy">{renderAccented(t.axis01.contenidoBody)}</p>
              <div className="pcd-content-dock">
                <span className="pcd-content-dock__label">{t.axis01.dockLabel}</span>
                <div className="pcd-content-dock__row">
                  {CONTENIDO_DOCK.map((tool) => (
                    <div className="pcd-content-dock__item" key={tool.name} title={tool.name}>
                      <div className="pcd-content-dock__icon" style={{ backgroundImage: `url('${tool.icon}')` }} aria-hidden="true" />
                      <span className="pcd-content-dock__name">{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== AXIS 02 · MUNDO 3D ===== */}
      <section className={`pcd-axis pcd-axis--mundo${lang === 'en' ? ' pcd-axis--mundo-en' : ''}`}>
        <div className="pcd-axis__left">
          <button
            type="button"
            className="pcd-axis__switch pcd-reveal"
            aria-label={axis02Mode === 'definicion' ? t.axis02.toggleToContenido : t.axis02.toggleToDefinicion}
            onClick={() => setAxis02Mode(axis02Mode === 'definicion' ? 'contenido' : 'definicion')}
          >
            {axis02Mode === 'definicion' ? t.axis02.toggleToContenido : t.axis02.toggleToDefinicion}
          </button>
          <h2 className="pcd-axis__word pcd-reveal">
            <span className="pcd-axis__word-desktop">
              {t.axis02.wordLine1}
              {t.axis02.wordLine2 && <><br />{t.axis02.wordLine2}</>}
            </span>
            <span className="pcd-axis__word-mobile">{t.axis02.wordFull}</span>
          </h2>
          <p className="pcd-axis__caption pcd-reveal">{t.axis02.caption}</p>
          <div className="pcd-axis__image pcd-reveal" style={{ backgroundImage: `url('${IMG}/proyecto-5.webp')` }} aria-hidden="true" />
        </div>
        <div className="pcd-axis__right">
          {axis02Mode === 'definicion' ? (
            <>
              <article className="pcd-vs">
                <span className="pcd-vs__idx">2.1</span>
                <div>
                  <h3 className="pcd-vs__title">{t.axis02.vs21title} <span className="pcd-vs__accent">{t.axis02.vs21accent}</span></h3>
                  <p className="pcd-vs__body">{t.axis02.vs21body}</p>
                </div>
              </article>
              <hr className="pcd-axis__divider" />
              <article className="pcd-vs">
                <span className="pcd-vs__idx">2.2</span>
                <div>
                  <h3 className="pcd-vs__title">{t.axis02.vs22title} <span className="pcd-vs__accent">{t.axis02.vs22accent}</span></h3>
                  <p className="pcd-vs__body">{t.axis02.vs22body}</p>
                </div>
              </article>
              <hr className="pcd-axis__divider" />
              <article className="pcd-vs">
                <span className="pcd-vs__idx">2.3</span>
                <div>
                  <h3 className="pcd-vs__title">{t.axis02.vs23title} <span className="pcd-vs__accent">{t.axis02.vs23accent}</span></h3>
                  <p className="pcd-vs__body">{t.axis02.vs23body}</p>
                </div>
              </article>
            </>
          ) : (
            <>
              <h3 className="pcd-content-title">{t.axis02.contenidoTitle}</h3>
              <p className="pcd-content-copy">{renderAccented(t.axis02.contenidoBody)}</p>
              <div className="pcd-content-dock">
                <span className="pcd-content-dock__label">{t.axis02.dockLabel}</span>
                <div className="pcd-content-dock__row">
                  {MUNDO_DOCK.map((tool) => (
                    <div className="pcd-content-dock__item" key={tool.name} title={tool.name}>
                      <div className="pcd-content-dock__icon" style={{ backgroundImage: `url('${tool.icon}')` }} aria-hidden="true" />
                      <span className="pcd-content-dock__name">{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== AXIS 03 · PRODUCTO ===== */}
      <section className="pcd-axis pcd-axis--producto">
        <div className="pcd-axis__left">
          <button
            type="button"
            className="pcd-axis__switch pcd-reveal"
            aria-label={axis03Mode === 'definicion' ? t.axis03.toggleToContenido : t.axis03.toggleToDefinicion}
            onClick={() => setAxis03Mode(axis03Mode === 'definicion' ? 'contenido' : 'definicion')}
          >
            {axis03Mode === 'definicion' ? t.axis03.toggleToContenido : t.axis03.toggleToDefinicion}
          </button>
          <h2 className="pcd-axis__word pcd-reveal">
            <span className="pcd-axis__word-desktop">
              {t.axis03.wordLine1}
              {t.axis03.wordLine2 && <><br />{t.axis03.wordLine2}</>}
            </span>
            <span className="pcd-axis__word-mobile">{t.axis03.wordFull}</span>
          </h2>
          <p className="pcd-axis__caption pcd-reveal">{t.axis03.caption}</p>
          <div className="pcd-axis__image pcd-reveal" style={{ backgroundImage: `url('${IMG}/proyecto-6.webp')` }} aria-hidden="true" />
        </div>
        <div className="pcd-axis__right">
          {axis03Mode === 'definicion' ? (
            <>
              <article className="pcd-vs">
                <span className="pcd-vs__idx">3.1</span>
                <div>
                  <h3 className="pcd-vs__title">{t.axis03.vs31title} <span className="pcd-vs__accent">{t.axis03.vs31accent}</span></h3>
                  <p className="pcd-vs__body">{t.axis03.vs31body}</p>
                </div>
              </article>
              <hr className="pcd-axis__divider" />
              <article className="pcd-vs">
                <span className="pcd-vs__idx">3.2</span>
                <div>
                  <h3 className="pcd-vs__title">{t.axis03.vs32title} <span className="pcd-vs__accent">{t.axis03.vs32accent}</span></h3>
                  <p className="pcd-vs__body">{t.axis03.vs32body}</p>
                </div>
              </article>
              <hr className="pcd-axis__divider" />
              <article className="pcd-vs">
                <span className="pcd-vs__idx">3.3</span>
                <div>
                  <h3 className="pcd-vs__title">{t.axis03.vs33title} <span className="pcd-vs__accent">{t.axis03.vs33accent}</span></h3>
                  <p className="pcd-vs__body">{t.axis03.vs33body}</p>
                </div>
              </article>
            </>
          ) : (
            <>
              <h3 className="pcd-content-title">{t.axis03.contenidoTitle}</h3>
              <p className="pcd-content-copy">{renderAccented(t.axis03.contenidoBody)}</p>
              <div className="pcd-content-dock">
                <span className="pcd-content-dock__label">{t.axis03.dockLabel}</span>
                <div className="pcd-content-dock__row">
                  {PRODUCTO_DOCK.map((tool) => (
                    <div className="pcd-content-dock__item" key={tool.name} title={tool.name}>
                      <div className="pcd-content-dock__icon" style={{ backgroundImage: `url('${tool.icon}')` }} aria-hidden="true" />
                      <span className="pcd-content-dock__name">{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== MARQUEE · docentes ===== */}
      <div id="docentes" className="pcd-marquee" aria-hidden="true">
        <div className="pcd-marquee__track">
          <span>
            {t.marquee2} <span className="pcd-marquee__star">✺</span>
            {t.marquee2} <span className="pcd-marquee__star">✺</span>
            {t.marquee2} <span className="pcd-marquee__star">✺</span>
            {t.marquee2} <span className="pcd-marquee__star">✺</span>
          </span>
          <span>
            {t.marquee2} <span className="pcd-marquee__star">✺</span>
            {t.marquee2} <span className="pcd-marquee__star">✺</span>
            {t.marquee2} <span className="pcd-marquee__star">✺</span>
            {t.marquee2} <span className="pcd-marquee__star">✺</span>
          </span>
        </div>
      </div>

      {/* ===== DOCENTES ===== */}
      <section className="pcd-docentes">
        <header className="pcd-docentes__head pcd-reveal">
          <h2 className="pcd-docentes__title">
            {t.docentes.sectionTitle.split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
          <p className="pcd-docentes__sub">{t.docentes.sectionSub}</p>
        </header>
        <div
          className="pcd-docentes__grid"
          ref={docentesGridRef}
          onMouseDown={onDocentesMouseDown}
          onMouseMove={onDocentesMouseMove}
          onMouseUp={endDocentesDrag}
          onMouseLeave={endDocentesDrag}
          onScroll={onDocentesScroll}
        >
          {/* Paula */}
          <article
            ref={docentesFirstCardRef}
            className="pcd-docente pcd-docente--paula pcd-reveal" tabIndex={0} role="button"
            aria-label={t.docentes.paula.ariaLabel}
            onClick={() => onDocenteCardClick('paula')}
            onKeyDown={(e) => onCardKey(e, 'paula')}
            style={{ '--docente-init': `url('${IMG}/Paula_Init.webp')`, '--docente-end': `url('${IMG}/Paula_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--star" src={`${IMG}/Star.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Paula<br />Lenis</h3>
            <p className="pcd-docente__bio">{t.docentes.paula.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.paula.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Sofía */}
          <article
            className="pcd-docente pcd-docente--sofia pcd-reveal" tabIndex={0} role="button"
            aria-label={t.docentes.sofia.ariaLabel}
            onClick={() => onDocenteCardClick('sofia')}
            onKeyDown={(e) => onCardKey(e, 'sofia')}
            style={{ '--docente-init': `url('${IMG}/Sofia_Init.webp')`, '--docente-end': `url('${IMG}/Sofia_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--idea" src={`${IMG}/Idea.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Sofía<br />Jiménez</h3>
            <p className="pcd-docente__bio">{t.docentes.sofia.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.sofia.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Nicolás */}
          <article
            className="pcd-docente pcd-docente--nicolas pcd-reveal" tabIndex={0} role="button"
            aria-label={t.docentes.nicolas.ariaLabel}
            onClick={() => onDocenteCardClick('nicolas')}
            onKeyDown={(e) => onCardKey(e, 'nicolas')}
            style={{ '--docente-init': `url('${IMG}/Nicolas_Init.webp')`, '--docente-end': `url('${IMG}/Nicolas_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--love" src={`${IMG}/Love.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Nicolás<br />Bartolo</h3>
            <p className="pcd-docente__bio">{t.docentes.nicolas.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.nicolas.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Ximena */}
          <article
            className="pcd-docente pcd-docente--ximena pcd-reveal" tabIndex={0} role="button"
            aria-label={t.docentes.ximena.ariaLabel}
            onClick={() => onDocenteCardClick('ximena')}
            onKeyDown={(e) => onCardKey(e, 'ximena')}
            style={{ '--docente-init': `url('${IMG}/Ximena_Init.webp')`, '--docente-end': `url('${IMG}/Ximena_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--star" src={`${IMG}/Star.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Ximena<br />Tovar</h3>
            <p className="pcd-docente__bio">{t.docentes.ximena.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.ximena.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Camilo */}
          <article
            className="pcd-docente pcd-docente--camilo pcd-reveal" tabIndex={0} role="button"
            aria-label={t.docentes.camilo.ariaLabel}
            onClick={() => onDocenteCardClick('camilo')}
            onKeyDown={(e) => onCardKey(e, 'camilo')}
            style={{ '--docente-init': `url('${IMG}/Camilo_Init.webp')`, '--docente-end': `url('${IMG}/Camilo_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--idea" src={`${IMG}/Idea.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Camilo<br />Cardozo</h3>
            <p className="pcd-docente__bio">{t.docentes.camilo.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.camilo.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Daniela */}
          <article
            className="pcd-docente pcd-docente--daniela pcd-docente--no-photo pcd-reveal" tabIndex={0} role="button"
            aria-label={t.docentes.daniela.ariaLabel}
            onClick={() => onDocenteCardClick('daniela')}
            onKeyDown={(e) => onCardKey(e, 'daniela')}
            style={{} as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--love" src={`${IMG}/Love.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Daniela<br />Meza</h3>
            <p className="pcd-docente__bio">{t.docentes.daniela.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.daniela.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Juan David */}
          <article
            className="pcd-docente pcd-docente--juandavid pcd-reveal" tabIndex={0} role="button"
            aria-label={t.docentes.juandavid.ariaLabel}
            onClick={() => onDocenteCardClick('juandavid')}
            onKeyDown={(e) => onCardKey(e, 'juandavid')}
            style={{ '--docente-init': `url('${IMG}/JuanDavid_Init.webp')`, '--docente-end': `url('${IMG}/JuanDavid_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--star" src={`${IMG}/Star.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Juan David<br />Aristizabal</h3>
            <p className="pcd-docente__bio">{t.docentes.juandavid.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.juandavid.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Vanessa */}
          <article
            className="pcd-docente pcd-docente--vanessa pcd-reveal" tabIndex={0} role="button"
            aria-label={t.docentes.vanessa.ariaLabel}
            onClick={() => onDocenteCardClick('vanessa')}
            onKeyDown={(e) => onCardKey(e, 'vanessa')}
            style={{ '--docente-init': `url('${IMG}/Vanessa_Init.webp')`, '--docente-end': `url('${IMG}/Vanessa_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--idea" src={`${IMG}/Idea.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Vanessa<br />Tovar</h3>
            <p className="pcd-docente__bio">{t.docentes.vanessa.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.vanessa.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* ── set duplicado: permite el loop infinito del carrusel ── */}
          {/* Paula (clon para loop infinito) */}
          <article
            ref={docentesFirstCloneRef}
            className="pcd-docente pcd-docente--paula pcd-reveal" tabIndex={-1} role="button" aria-hidden="true"
            aria-label={t.docentes.paula.ariaLabel}
            onClick={() => onDocenteCardClick('paula')}
            onKeyDown={(e) => onCardKey(e, 'paula')}
            style={{ '--docente-init': `url('${IMG}/Paula_Init.webp')`, '--docente-end': `url('${IMG}/Paula_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--star" src={`${IMG}/Star.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Paula<br />Lenis</h3>
            <p className="pcd-docente__bio">{t.docentes.paula.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.paula.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Sofía (clon para loop infinito) */}
          <article
            className="pcd-docente pcd-docente--sofia pcd-reveal" tabIndex={-1} role="button" aria-hidden="true"
            aria-label={t.docentes.sofia.ariaLabel}
            onClick={() => onDocenteCardClick('sofia')}
            onKeyDown={(e) => onCardKey(e, 'sofia')}
            style={{ '--docente-init': `url('${IMG}/Sofia_Init.webp')`, '--docente-end': `url('${IMG}/Sofia_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--idea" src={`${IMG}/Idea.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Sofía<br />Jiménez</h3>
            <p className="pcd-docente__bio">{t.docentes.sofia.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.sofia.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Nicolás (clon para loop infinito) */}
          <article
            className="pcd-docente pcd-docente--nicolas pcd-reveal" tabIndex={-1} role="button" aria-hidden="true"
            aria-label={t.docentes.nicolas.ariaLabel}
            onClick={() => onDocenteCardClick('nicolas')}
            onKeyDown={(e) => onCardKey(e, 'nicolas')}
            style={{ '--docente-init': `url('${IMG}/Nicolas_Init.webp')`, '--docente-end': `url('${IMG}/Nicolas_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--love" src={`${IMG}/Love.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Nicolás<br />Bartolo</h3>
            <p className="pcd-docente__bio">{t.docentes.nicolas.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.nicolas.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Ximena (clon para loop infinito) */}
          <article
            className="pcd-docente pcd-docente--ximena pcd-reveal" tabIndex={-1} role="button" aria-hidden="true"
            aria-label={t.docentes.ximena.ariaLabel}
            onClick={() => onDocenteCardClick('ximena')}
            onKeyDown={(e) => onCardKey(e, 'ximena')}
            style={{ '--docente-init': `url('${IMG}/Ximena_Init.webp')`, '--docente-end': `url('${IMG}/Ximena_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--star" src={`${IMG}/Star.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Ximena<br />Tovar</h3>
            <p className="pcd-docente__bio">{t.docentes.ximena.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.ximena.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Camilo (clon para loop infinito) */}
          <article
            className="pcd-docente pcd-docente--camilo pcd-reveal" tabIndex={-1} role="button" aria-hidden="true"
            aria-label={t.docentes.camilo.ariaLabel}
            onClick={() => onDocenteCardClick('camilo')}
            onKeyDown={(e) => onCardKey(e, 'camilo')}
            style={{ '--docente-init': `url('${IMG}/Camilo_Init.webp')`, '--docente-end': `url('${IMG}/Camilo_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--idea" src={`${IMG}/Idea.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Camilo<br />Cardozo</h3>
            <p className="pcd-docente__bio">{t.docentes.camilo.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.camilo.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Daniela (clon para loop infinito) */}
          <article
            className="pcd-docente pcd-docente--daniela pcd-docente--no-photo pcd-reveal" tabIndex={-1} role="button" aria-hidden="true"
            aria-label={t.docentes.daniela.ariaLabel}
            onClick={() => onDocenteCardClick('daniela')}
            onKeyDown={(e) => onCardKey(e, 'daniela')}
            style={{} as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--love" src={`${IMG}/Love.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Daniela<br />Meza</h3>
            <p className="pcd-docente__bio">{t.docentes.daniela.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.daniela.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Juan David (clon para loop infinito) */}
          <article
            className="pcd-docente pcd-docente--juandavid pcd-reveal" tabIndex={-1} role="button" aria-hidden="true"
            aria-label={t.docentes.juandavid.ariaLabel}
            onClick={() => onDocenteCardClick('juandavid')}
            onKeyDown={(e) => onCardKey(e, 'juandavid')}
            style={{ '--docente-init': `url('${IMG}/JuanDavid_Init.webp')`, '--docente-end': `url('${IMG}/JuanDavid_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--star" src={`${IMG}/Star.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Juan David<br />Aristizabal</h3>
            <p className="pcd-docente__bio">{t.docentes.juandavid.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.juandavid.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>

          {/* Vanessa (clon para loop infinito) */}
          <article
            className="pcd-docente pcd-docente--vanessa pcd-reveal" tabIndex={-1} role="button" aria-hidden="true"
            aria-label={t.docentes.vanessa.ariaLabel}
            onClick={() => onDocenteCardClick('vanessa')}
            onKeyDown={(e) => onCardKey(e, 'vanessa')}
            style={{ '--docente-init': `url('${IMG}/Vanessa_Init.webp')`, '--docente-end': `url('${IMG}/Vanessa_End.webp')` } as CSSProperties}
          >
            <div className="pcd-docente__blob" aria-hidden="true" />
            <img className="pcd-sticker pcd-sticker--idea" src={`${IMG}/Idea.webp`} alt="" aria-hidden="true" />
            <h3 className="pcd-docente__name">Vanessa<br />Tovar</h3>
            <p className="pcd-docente__bio">{t.docentes.vanessa.bio}</p>
            <div className="pcd-docente__tags">
              {t.docentes.vanessa.tags.map((tag) => <span key={tag} className="pcd-docente__tag">{tag}</span>)}
            </div>
          </article>
        </div>
      </section>

      {/* ===== MODALES DOCENTES ===== */}
      <DocenteModal
        id="nicolas" active={activeDocente === 'nicolas'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/Nicolas_Init.webp`}
        portraitEnd={`${IMG}/Nicolas_End.webp`}
        name={<>Nicolás<br />Bartolo</>}
        tags={t.docentes.nicolas.modalTags}
      >
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalPerfil}</h3>
        <p className="pcd-docente-modal__p">{t.docentes.nicolas.p1}</p>
        <p className="pcd-docente-modal__p">{t.docentes.nicolas.p2}</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalExp}</h3>
        <ul className="pcd-docente-modal__list">
          {t.docentes.nicolas.exp.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span className="pcd-docente-modal__detail-plain">{item.body}</span>
            </li>
          ))}
        </ul>
      </DocenteModal>

      <DocenteModal
        id="sofia" active={activeDocente === 'sofia'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/Sofia_Init.webp`}
        portraitEnd={`${IMG}/Sofia_End.webp`}
        name={<>Sofía<br />Jiménez</>}
        tags={t.docentes.sofia.modalTags}
      >
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalPerfil}</h3>
        <p className="pcd-docente-modal__p">{t.docentes.sofia.p1}</p>
        <p className="pcd-docente-modal__p">{t.docentes.sofia.p2}</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalExp}</h3>
        <ul className="pcd-docente-modal__list">
          {t.docentes.sofia.exp.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span className="pcd-docente-modal__detail-plain">{item.body}</span>
            </li>
          ))}
        </ul>
      </DocenteModal>
      <DocenteModal
        id="juandavid" active={activeDocente === 'juandavid'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/JuanDavid_Init.webp`}
        portraitEnd={`${IMG}/JuanDavid_End.webp`}
        name={<>Juan David<br />Aristizabal</>}
        tags={t.docentes.juandavid.modalTags}
      >
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalPerfil}</h3>
        <p className="pcd-docente-modal__p">{t.docentes.juandavid.p1}</p>
        <p className="pcd-docente-modal__p">{t.docentes.juandavid.p2}</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalExp}</h3>
        <ul className="pcd-docente-modal__list">
          {t.docentes.juandavid.exp.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span className="pcd-docente-modal__detail-plain">{item.body}</span>
            </li>
          ))}
        </ul>
      </DocenteModal>

      <DocenteModal
        id="vanessa" active={activeDocente === 'vanessa'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/Vanessa_Init.webp`}
        portraitEnd={`${IMG}/Vanessa_End.webp`}
        name={<>Vanessa<br />Tovar</>}
        tags={t.docentes.vanessa.modalTags}
      >
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalPerfil}</h3>
        <p className="pcd-docente-modal__p">{t.docentes.vanessa.p1}</p>
        <p className="pcd-docente-modal__p">{t.docentes.vanessa.p2}</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalExp}</h3>
        <ul className="pcd-docente-modal__list">
          {t.docentes.vanessa.exp.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span className="pcd-docente-modal__detail-plain">{item.body}</span>
            </li>
          ))}
        </ul>
      </DocenteModal>

      <DocenteModal
        id="camilo" active={activeDocente === 'camilo'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/Camilo_Init.webp`}
        portraitEnd={`${IMG}/Camilo_End.webp`}
        name={<>Camilo<br />Cardozo</>}
        tags={t.docentes.camilo.modalTags}
      >
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalPerfil}</h3>
        <p className="pcd-docente-modal__p">{t.docentes.camilo.p1}</p>
        <p className="pcd-docente-modal__p">{t.docentes.camilo.p2}</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalExp}</h3>
        <ul className="pcd-docente-modal__list">
          {t.docentes.camilo.exp.map((item, idx) => (
            <li key={idx}>
              {item.boldParts !== null ? (
                <span className="pcd-docente-modal__detail-plain">
                  {item.boldParts![0]}<strong>{item.boldParts![1]}</strong>
                  {item.boldParts![2]}<strong>{item.boldParts![3]}</strong>
                  {item.boldParts![4]}
                </span>
              ) : (
                <span className="pcd-docente-modal__detail-plain">{item.body ?? ''}</span>
              )}
            </li>
          ))}
        </ul>
      </DocenteModal>

      <DocenteModal
        id="daniela" active={activeDocente === 'daniela'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait="" portraitEnd=""
        name={<>Daniela<br />Meza</>}
        tags={t.docentes.daniela.modalTags}
      >
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalPerfil}</h3>
        <p className="pcd-docente-modal__p">{t.docentes.daniela.p1}</p>
        <p className="pcd-docente-modal__p">{t.docentes.daniela.p2}</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalExp}</h3>
        <ul className="pcd-docente-modal__list">
          {t.docentes.daniela.exp.map((item, idx) => (
            <li key={idx}>
              <span className="pcd-docente-modal__detail-plain">{item.body ?? ''}</span>
            </li>
          ))}
        </ul>
      </DocenteModal>

      <DocenteModal
        id="paula" active={activeDocente === 'paula'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/Paula_Init.webp`}
        portraitEnd={`${IMG}/Paula_End.webp`}
        name={<>Paula<br />Lenis</>}
        tags={t.docentes.paula.modalTags}
      >
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalPerfil}</h3>
        <p className="pcd-docente-modal__p">{t.docentes.paula.p1}</p>
        <p className="pcd-docente-modal__p">{t.docentes.paula.p2}</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalExp}</h3>
        <ul className="pcd-docente-modal__list">
          {t.docentes.paula.exp.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span className="pcd-docente-modal__detail-plain">{item.body}</span>
            </li>
          ))}
        </ul>
      </DocenteModal>

      <DocenteModal
        id="ximena" active={activeDocente === 'ximena'} onClose={closeDocente} onSwipe={onSwipeDocente}
        portrait={`${IMG}/Ximena_Init.webp`}
        portraitEnd={`${IMG}/Ximena_End.webp`}
        name={<>Ximena<br />Tovar</>}
        tags={t.docentes.ximena.modalTags}
      >
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalPerfil}</h3>
        <p className="pcd-docente-modal__p">{t.docentes.ximena.p1}</p>
        <p className="pcd-docente-modal__p">{t.docentes.ximena.p2}</p>
        <hr className="pcd-docente-modal__rule" />
        <h3 className="pcd-docente-modal__heading">{t.docentes.modalExp}</h3>
        <ul className="pcd-docente-modal__list">
          {t.docentes.ximena.exp.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span className="pcd-docente-modal__detail-plain">{item.body}</span>
            </li>
          ))}
        </ul>
      </DocenteModal>

      {/* ===== PROYECTOS ===== */}
      <section id="proyectos" className="pcd-projects">
        <header className="pcd-projects__head pcd-reveal">
          <h2 className="pcd-projects__title">
            {t.projects.sectionTitleL1}<br />
            <span className="pop">{t.projects.sectionTitlePop}</span>{t.projects.sectionTitleL2rest}
            {t.projects.sectionTitleL3 && <><br />{t.projects.sectionTitleL3}</>}
          </h2>
          <Link className="pcd-cta-secondary" to="/proyectos">
            <span>{t.projects.cta}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className="pcd-projects__grid">
          {PROYECTOS.slice(0, 2).map((p, i) => {
            const isTall = i === 1;
            const imgSrc = isTall ? (p.imageVertical ?? p.image) : p.image;
            const inner = (
              <>
                <div
                  className={`pcd-project__media${p.id === 'chocosapiens-humanismo-digital' ? ' pcd-project__media--contain' : ''}`}
                  style={{ backgroundImage: `url('${imgSrc}')` }}
                  aria-hidden="true"
                />
                <div className="pcd-project__meta">
                  <span>{(lang === 'en' ? (p.subjectEn ?? p.subject) : p.subject).toUpperCase()}</span>
                  <span>{p.year}</span>
                </div>
                <p className="pcd-project__caption">{lang === 'en' ? (p.captionEn ?? p.caption) : p.caption}</p>
              </>
            );
            return p.modal ? (
              <Link key={p.id} to={`/proyectos/${p.id}`}
                className={`pcd-project ${i === 0 ? 'pcd-project--wide' : 'pcd-project--tall'} pcd-project--clickable pcd-reveal`}
                style={{ textDecoration: 'none' }}>
                {inner}
              </Link>
            ) : (
              <article key={p.id} className={`pcd-project ${i === 0 ? 'pcd-project--wide' : 'pcd-project--tall'} pcd-reveal`}>
                {inner}
              </article>
            );
          })}
        </div>
      </section>

      {/* ===== ESTUDIA / CTA FINAL ===== */}
      <section id="aplica" className="pcd-estudia">
        <div className="pcd-estudia__copy">
          <span className="pcd-estudia__eyebrow pcd-reveal">{t.estudia.eyebrow}</span>
          <h2 className="pcd-estudia__title pcd-reveal">
            {t.estudia.title}<br />
            <span className="neon">{t.estudia.titleNeon}</span>
            {t.estudia.titleEnd}
          </h2>
          <p className="pcd-estudia__body pcd-reveal">{t.estudia.body}</p>
          <a className="pcd-estudia__cta pcd-reveal" href={APLICA_URL} target="_blank" rel="noopener">
            <span>{t.estudia.cta}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="pcd-estudia__photo pcd-reveal">
          <span className="pcd-bullet pcd-bullet--1">{t.estudia.bullet1}</span>
          <span className="pcd-bullet pcd-bullet--2">{t.estudia.bullet2}</span>
          <span className="pcd-bullet pcd-bullet--3">{t.estudia.bullet3}</span>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="pcd-footer" id="contacto">
        <div className="pcd-footer__columns">
          <div className="pcd-footer__col pcd-reveal">
            <span className="pcd-footer__title">{t.footer.colPrograma}</span>
            <a className="pcd-footer__link" href="https://www.unbosque.edu.co/programas-academicos/facultad-creacion-comunicacion/creacion-digital" target="_blank" rel="noopener">{t.footer.info}</a>
            <a className="pcd-footer__link" href="/programa/pdf/Manifiesto-CREADIG.pdf" target="_blank" rel="noopener">{t.footer.manifiesto}</a>
          </div>
          <div className="pcd-footer__col pcd-reveal">
            <span className="pcd-footer__title">{t.footer.colComunidad}</span>
            <a className="pcd-footer__link" href="https://www.instagram.com/creaciondigital.ueb/" target="_blank" rel="noopener">Instagram</a>
            <a className="pcd-footer__link" href="https://www.tiktok.com/@creaciondigital.ueb" target="_blank" rel="noopener">TikTok</a>
          </div>
          <div className="pcd-footer__col pcd-reveal">
            <span className="pcd-footer__title">{t.footer.colUniversidad}</span>
            <a className="pcd-footer__link" href="https://www.unbosque.edu.co/" target="_blank" rel="noopener">Universidad El Bosque</a>
            <a className="pcd-footer__link" href="https://www.unbosque.edu.co/programas-academicos/facultad-creacion-comunicacion" target="_blank" rel="noopener">FACyC</a>
          </div>
        </div>
        <p className="pcd-footer__legal">{t.footer.legal}</p>
      </footer>
    </div>
  );
}
