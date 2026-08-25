import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { PROYECTOS } from '../data/proyectos';
import { useLang } from '../i18n/LanguageContext';
import '../styles/programa.css';
import '../styles/proyecto-detalle.css';

const IMG = '/programa/img';
const APLICA_URL = 'https://www.unbosque.edu.co/inscripciones/pregrado';

export default function ProyectoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const proyecto = PROYECTOS.find((p) => p.id === id);
  if (!proyecto || !proyecto.modal) return <Navigate to="/proyectos" replace />;

  const otrosProyectos = PROYECTOS.filter((p) => p.id !== id);

  const m = proyecto.modal;
  const title   = lang === 'en' ? (m.titleEn ?? m.titleEs ?? proyecto.captionEn ?? proyecto.caption) : (m.titleEs ?? proyecto.caption);
  const caption  = lang === 'en' ? (proyecto.captionEn ?? proyecto.caption) : proyecto.caption;
  const subject  = lang === 'en' ? (proyecto.subjectEn ?? proyecto.subject) : proyecto.subject;
  const desc     = lang === 'en' ? m.descriptionEn : m.descriptionEs;
  const skills   = lang === 'en' ? (m.skillsEn ?? []) : (m.skillsEs ?? []);
  const paragraphs = desc.split('\n\n').filter(Boolean);

  const professorFull = proyecto.professor
    ?.replace('C. Cardozo', 'Camilo Cardozo')
    .replace('J. Lamprea', 'John Lamprea')
    .replace('A. Rozo', 'A. Rozo')
    .replace('J. Suárez', 'J. Suárez');

  const labels = lang === 'en'
    ? { subject: 'Subject', professor: 'Faculty', students: 'Students', year: 'Year',
        skills: 'Skills developed', back: '← Back to projects', more: 'More projects' }
    : { subject: 'Materia', professor: 'Docente', students: 'Estudiantes', year: 'Año',
        skills: 'Habilidades desarrolladas', back: '← Volver a proyectos', more: 'Más proyectos' };

  /* ── Carrusel ── */
  const images = m.images;
  const [slide, setSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setSlide((s) => (s + 1) % images.length), [images.length]);
  const prev = useCallback(() => setSlide((s) => (s - 1 + images.length) % images.length), [images.length]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
  }, [next]);

  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [startTimer]);

  const goTo = (i: number) => { setSlide(i); startTimer(); };
  const handlePrev = () => { prev(); startTimer(); };
  const handleNext = () => { next(); startTimer(); };

  /* ── Swipe táctil ── */
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) { delta < 0 ? handleNext() : handlePrev(); }
    touchStartX.current = null;
  };

  /* ── Lang toggle ── */
  const LangToggle = () => (
    <button type="button" className="pcd-lang-toggle" aria-label={t.nav.langLabel}
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>
      <span className={`pcd-lang-toggle__opt${lang === 'es' ? ' pcd-lang-toggle__opt--active' : ''}`}>ES</span>
      <span className="pcd-lang-toggle__sep">|</span>
      <span className={`pcd-lang-toggle__opt${lang === 'en' ? ' pcd-lang-toggle__opt--active' : ''}`}>EN</span>
    </button>
  );

  return (
    <div className="pcd-page">
      {/* NAV */}
      <header className="pcd-header">
        <Link to="/" className="pcd-brand" aria-label="Inicio Creación Digital · Universidad El Bosque">
          <img className="pcd-brand__logo" src={`${IMG}/Label_UEB_CreacionDigital_Horizontal.png`} alt="Universidad El Bosque · Creación Digital" />
        </Link>
        <nav className={`pcd-nav${menuOpen ? ' is-open' : ''}`} aria-label="Principal">
          <Link className="pcd-nav__link" to="/#programa" onClick={() => setMenuOpen(false)}>{t.nav.programa}</Link>
          <Link className="pcd-nav__link" to="/#docentes" onClick={() => setMenuOpen(false)}>{t.nav.docentes}</Link>
          <Link className="pcd-nav__link" to="/proyectos" onClick={() => setMenuOpen(false)}>{t.nav.proyectos}</Link>
          <LangToggle />
        </nav>
        <div className="pcd-header__actions">
          <LangToggle />
          <a className="pcd-cta-pill" href={APLICA_URL} target="_blank" rel="noopener">
            <span>{t.nav.aplicaAhora}</span>
            <span className="pcd-cta-pill__arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <button type="button" className={`pcd-hamburger${menuOpen ? ' is-open' : ''}`}
          aria-label={t.nav.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
          <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
        </button>
      </header>

      <main className="pdet">

        {/* BACK TOP */}
        <div className="pdet__back-top">
          <Link to="/proyectos" className="pdet__back">{labels.back}</Link>
        </div>

        {/* TÍTULO */}
        <h1 className="pdet__title">{title}</h1>
        <p className="pdet__subtitle">{caption}</p>

        {/* CARRUSEL — ancho completo */}
        <div className="pdet__carousel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="pdet__carousel-track">
            {images.map((src, i) => (
              <img
                key={src}
                className={`pdet__slide${i === slide ? ' pdet__slide--active' : ''}`}
                src={src}
                alt={`${caption} — imagen ${i + 1}`}
              />
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button className="pdet__nav pdet__nav--prev" onClick={handlePrev} aria-label="Anterior">‹</button>
              <button className="pdet__nav pdet__nav--next" onClick={handleNext} aria-label="Siguiente">›</button>
              <div className="pdet__dots">
                {images.map((_, i) => (
                  <button key={i} className={`pdet__dot${i === slide ? ' pdet__dot--active' : ''}`}
                    onClick={() => goTo(i)} aria-label={`Imagen ${i + 1}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* CONTENIDO — ficha + texto */}
        <div className="pdet__body">

          {/* Columna izquierda — ficha técnica */}
          <aside className="pdet__aside">
            <dl className="pdet__sheet">
              <dt>{labels.subject}</dt>
              <dd>{subject}</dd>
              {professorFull && (
                <>
                  <dt>{labels.professor}</dt>
                  <dd>{professorFull}</dd>
                </>
              )}
              {proyecto.student && (
                <>
                  <dt>{labels.students}</dt>
                  <dd>{proyecto.student}</dd>
                </>
              )}
              <dt>{labels.year}</dt>
              <dd>{proyecto.year}</dd>
            </dl>

            {skills.length > 0 && (
              <div className="pdet__skills-block">
                <p className="pdet__skills-label">{labels.skills}</p>
                <div className="pdet__skills">
                  {skills.map((s) => <span key={s} className="pdet__skill">{s}</span>)}
                </div>
              </div>
            )}
          </aside>

          {/* Columna central — texto */}
          <article className="pdet__article">
            {paragraphs.map((p, i) => (
              <p key={i} className="pdet__p">{p}</p>
            ))}
          </article>
        </div>

        {/* OTROS PROYECTOS */}
        {otrosProyectos.length > 0 && (
          <div className="pdet__more">
            <p className="pdet__more-title">{labels.more}</p>
            <div className="pdet__more-track">
              {otrosProyectos.map((p) => {
                const cap = lang === 'en' ? (p.captionEn ?? p.caption) : p.caption;
                const subj = lang === 'en' ? (p.subjectEn ?? p.subject) : p.subject;
                const card = (
                  <>
                    <div className="pdet__more-thumb" style={{ backgroundImage: `url('${p.image}')` }} />
                    <div className="pdet__more-info">
                      <span className="pdet__more-subject">{subj}</span>
                      <p className="pdet__more-caption">{cap}</p>
                    </div>
                  </>
                );
                return p.modal ? (
                  <Link key={p.id} to={`/proyectos/${p.id}`} className="pdet__more-card">{card}</Link>
                ) : (
                  <Link key={p.id} to="/proyectos" className="pdet__more-card">{card}</Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="pcd-footer pcd-footer--dark" id="contacto">
        <div className="pcd-footer__columns">
          <div className="pcd-footer__col">
            <span className="pcd-footer__title">{t.footer.colPrograma}</span>
            <a className="pcd-footer__link" href="https://www.unbosque.edu.co/programas-academicos/facultad-creacion-comunicacion/creacion-digital" target="_blank" rel="noopener">{t.footer.info}</a>
            <a className="pcd-footer__link" href="/programa/pdf/Manifiesto-CREADIG.pdf" target="_blank" rel="noopener">{t.footer.manifiesto}</a>
          </div>
          <div className="pcd-footer__col">
            <span className="pcd-footer__title">{t.footer.colComunidad}</span>
            <a className="pcd-footer__link" href="https://www.instagram.com/creaciondigital.ueb/" target="_blank" rel="noopener">Instagram</a>
            <a className="pcd-footer__link" href="https://www.tiktok.com/@creaciondigital.ueb" target="_blank" rel="noopener">TikTok</a>
          </div>
          <div className="pcd-footer__col">
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
