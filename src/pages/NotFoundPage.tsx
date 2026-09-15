import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useSeo } from '../hooks/useSeo';
import '../styles/programa.css';

const IMG = '/programa/img';
const APLICA_URL = 'https://www.unbosque.edu.co/inscripciones/pregrado';

const COPY = {
  es: {
    eyebrow: 'Error 404',
    title: 'Esta página no existe',
    body: 'El enlace puede estar mal escrito o la página que buscabas ya no está disponible.',
    home: 'Volver al inicio',
    proyectos: 'Ver proyectos',
    blog: 'Ir al blog',
  },
  en: {
    eyebrow: 'Error 404',
    title: 'This page doesn’t exist',
    body: 'The link may be mistyped, or the page you were looking for is no longer available.',
    home: 'Back to home',
    proyectos: 'See projects',
    blog: 'Go to blog',
  },
};

/**
 * Ruta de repuesto (catch-all) — antes de esto, una URL inválida o un
 * post/proyecto eliminado del array de datos dejaba <Routes> sin
 * ningún match y la pantalla en blanco (con código 200, porque Nginx
 * sirve index.html para cualquier ruta). Hallazgo de la auditoría de
 * sep. 2026.
 */
export default function NotFoundPage() {
  const { lang, setLang, t } = useLang();
  const c = COPY[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useSeo({
    title: lang === 'en' ? 'Page not found · Creación Digital' : 'Página no encontrada · Creación Digital',
    description: c.body,
    path: '/404',
  });

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
      <header className="pcd-header">
        <Link to="/" className="pcd-brand" aria-label="Inicio Creación Digital · Universidad El Bosque">
          <img className="pcd-brand__logo" src={`${IMG}/Label_UEB_CreacionDigital_Horizontal.png`} alt="Universidad El Bosque · Creación Digital" />
        </Link>
        <nav ref={mobileNavRef} className={`pcd-nav${menuOpen ? ' is-open' : ''}`} aria-label="Principal">
          <Link className="pcd-nav__link" to="/#programa" onClick={() => setMenuOpen(false)}>{t.nav.programa}</Link>
          <Link className="pcd-nav__link" to="/#docentes" onClick={() => setMenuOpen(false)}>{t.nav.docentes}</Link>
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

      <main className="pcd-404">
        <span className="pcd-404__number" aria-hidden="true">404</span>
        <span className="pcd-404__eyebrow">{c.eyebrow}</span>
        <h1 className="pcd-404__title">{c.title}</h1>
        <p className="pcd-404__body">{c.body}</p>
        <div className="pcd-404__actions">
          <Link className="pcd-404__cta pcd-404__cta--primary" to="/">{c.home}</Link>
          <Link className="pcd-404__cta" to="/proyectos">{c.proyectos}</Link>
          <Link className="pcd-404__cta" to="/blog">{c.blog}</Link>
        </div>
      </main>

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
