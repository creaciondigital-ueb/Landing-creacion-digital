import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blog';
import { useLang } from '../i18n/LanguageContext';
import '../styles/programa.css';
import '../styles/proyecto-detalle.css';

const IMG = '/programa/img';
const APLICA_URL = 'https://www.unbosque.edu.co/inscripciones/pregrado';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cierra el menú mobile al hacer clic/tocar fuera de él (no solo con la X).
  const mobileNavRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onOutsidePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (mobileNavRef.current?.contains(target)) return;
      if (hamburgerRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', onOutsidePointerDown);
    document.addEventListener('touchstart', onOutsidePointerDown);
    return () => {
      document.removeEventListener('mousedown', onOutsidePointerDown);
      document.removeEventListener('touchstart', onOutsidePointerDown);
    };
  }, [menuOpen]);

  const post = BLOG_POSTS.find((p) => p.id === id);
  if (!post || !post.detail) return <Navigate to="/blog" replace />;

  const otrosPosts = BLOG_POSTS.filter((p) => p.id !== id);

  const d = post.detail;
  const title    = lang === 'en' ? (post.titleEn ?? post.title) : post.title;
  const excerpt  = lang === 'en' ? (post.excerptEn ?? post.excerpt) : post.excerpt;
  const category = lang === 'en' ? (post.categoryEn ?? post.category) : post.category;
  const date     = lang === 'en' ? (post.dateEn ?? post.date) : post.date;
  const desc     = lang === 'en' ? d.descriptionEn : d.descriptionEs;
  const tags     = lang === 'en' ? (d.tagsEn ?? []) : (d.tagsEs ?? []);
  const paragraphs = desc.split('\n\n').filter(Boolean);

  const labels = lang === 'en'
    ? { category: 'Category', author: 'Author', date: 'Date',
        tags: 'Related topics', back: '← Back to blog', more: 'More posts' }
    : { category: 'Categoría', author: 'Autor', date: 'Fecha',
        tags: 'Temas relacionados', back: '← Volver al blog', more: 'Más publicaciones' };

  /* ── Carrusel ── */
  const images = d.images;
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
        <nav ref={mobileNavRef} className={`pcd-nav${menuOpen ? ' is-open' : ''}`} aria-label="Principal">
          <Link className="pcd-nav__link" to="/#programa" onClick={() => setMenuOpen(false)}>{t.nav.programa}</Link>
          <Link className="pcd-nav__link" to="/#docentes" onClick={() => setMenuOpen(false)}>{t.nav.docentes}</Link>
          <Link className="pcd-nav__link" to="/#equipo" onClick={() => setMenuOpen(false)}>{t.nav.equipo}</Link>
          <Link className="pcd-nav__link" to="/proyectos" onClick={() => setMenuOpen(false)}>{t.nav.proyectos}</Link>
          <Link className="pcd-nav__link" to="/blog" onClick={() => setMenuOpen(false)}>{t.nav.blog}</Link>
          <LangToggle />
        </nav>
        <div className="pcd-header__actions">
          <LangToggle />
          <a className="pcd-cta-pill" href={APLICA_URL} target="_blank" rel="noopener">
            <span>{t.nav.aplicaAhora}</span>
            <span className="pcd-cta-pill__arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <button ref={hamburgerRef} type="button" className={`pcd-hamburger${menuOpen ? ' is-open' : ''}`}
          aria-label={t.nav.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
          <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
        </button>
      </header>

      <main className="pdet">

        {/* BACK TOP */}
        <div className="pdet__back-top">
          <Link to="/blog" className="pdet__back">{labels.back}</Link>
        </div>

        {/* TÍTULO */}
        <h1 className="pdet__title">{title}</h1>
        <p className="pdet__subtitle">{excerpt}</p>

        {/* CARRUSEL — ancho completo */}
        {images.length > 0 && (
          <div className="pdet__carousel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="pdet__carousel-track">
              {images.map((src, i) => (
                <img
                  key={src}
                  className={`pdet__slide${i === slide ? ' pdet__slide--active' : ''}`}
                  src={src}
                  alt={`${title} — imagen ${i + 1}`}
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
        )}

        {/* CONTENIDO — ficha + texto */}
        <div className="pdet__body">

          {/* Columna izquierda — ficha técnica */}
          <aside className="pdet__aside">
            <dl className="pdet__sheet">
              <dt>{labels.category}</dt>
              <dd>{category}</dd>
              {post.author && (
                <>
                  <dt>{labels.author}</dt>
                  <dd>{post.author}</dd>
                </>
              )}
              <dt>{labels.date}</dt>
              <dd>{date}</dd>
            </dl>

            {tags.length > 0 && (
              <div className="pdet__skills-block">
                <p className="pdet__skills-label">{labels.tags}</p>
                <div className="pdet__skills">
                  {tags.map((s) => <span key={s} className="pdet__skill">{s}</span>)}
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

        {/* OTRAS PUBLICACIONES */}
        {otrosPosts.length > 0 && (
          <div className="pdet__more">
            <p className="pdet__more-title">{labels.more}</p>
            <div className="pdet__more-track">
              {otrosPosts.map((p) => {
                const cap = lang === 'en' ? (p.titleEn ?? p.title) : p.title;
                const cat = lang === 'en' ? (p.categoryEn ?? p.category) : p.category;
                const card = (
                  <>
                    <div className="pdet__more-thumb" style={{ backgroundImage: `url('${p.image}')` }} />
                    <div className="pdet__more-info">
                      <span className="pdet__more-subject">{cat}</span>
                      <p className="pdet__more-caption">{cap}</p>
                    </div>
                  </>
                );
                return p.detail ? (
                  <Link key={p.id} to={`/blog/${p.id}`} className="pdet__more-card">{card}</Link>
                ) : (
                  <Link key={p.id} to="/blog" className="pdet__more-card">{card}</Link>
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
