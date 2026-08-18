import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PROYECTOS } from '../data/proyectos';
import { useLang } from '../i18n/LanguageContext';
import '../styles/programa.css';

const IMG = '/programa/img';
const APLICA_URL = 'https://www.unbosque.edu.co/inscripciones/pregrado';
const PAGE_SIZE = 9;

type FilterKind = 'year' | 'subject';
interface Chip { kind: FilterKind; value: string; }

/**
 * Galería de proyectos de estudiantes — /proyectos.
 * Soporta ES / EN mediante el contexto LanguageContext + hook useLang().
 */
export default function ProyectosPage() {
  const { lang, setLang, t } = useLang();
  const tp = t.proyectosPage;

  const [menuOpen, setMenuOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const filtersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!yearOpen && !subjectOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setYearOpen(false);
        setSubjectOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [yearOpen, subjectOpen]);

  const availableYears = useMemo(
    () => Array.from(new Set(PROYECTOS.map((p) => p.year))).sort((a, b) => b.localeCompare(a)),
    []
  );
  const availableSubjects = useMemo(
    () => Array.from(new Set(PROYECTOS.map((p) => p.subject))).sort((a, b) => a.localeCompare(b)),
    []
  );
  // Mapeo ES subject → EN label para mostrar en filtros y chips
  const subjectLabel = (subject: string) => {
    if (lang !== 'en') return subject;
    const p = PROYECTOS.find((p) => p.subject === subject);
    return p?.subjectEn ?? subject;
  };

  const toggleYear = (year: string) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]));
    setPage(1);
    setYearOpen(false);
  };
  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]));
    setPage(1);
    setSubjectOpen(false);
  };
  const clearAll = () => { setSelectedYears([]); setSelectedSubjects([]); setPage(1); };

  const chips: Chip[] = [
    ...selectedYears.map((value): Chip => ({ kind: 'year', value })),
    ...selectedSubjects.map((value): Chip => ({ kind: 'subject', value })),
  ];
  const removeChip = (chip: Chip) => (chip.kind === 'year' ? toggleYear(chip.value) : toggleSubject(chip.value));

  const filtered = PROYECTOS.filter(
    (p) =>
      (selectedYears.length === 0 || selectedYears.includes(p.year)) &&
      (selectedSubjects.length === 0 || selectedSubjects.includes(p.subject))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
  }, [selectedYears, selectedSubjects, currentPage]);

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
        <a className="pcd-cta-pill" href={APLICA_URL} target="_blank" rel="noopener">
          <span>{t.nav.aplicaAhora}</span>
          <span className="pcd-cta-pill__arrow" aria-hidden="true">→</span>
        </a>
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
      <section className="pcd-projects-hero">
        <div className="pcd-projects-hero__content pcd-reveal">
          <div className="pcd-projects-hero__eyebrow-row">
            <Link to="/" className="pcd-projects-hero__back">
              {tp.back}
            </Link>
            <span className="pcd-projects-hero__eyebrow">{tp.eyebrow}</span>
          </div>
          <h1 className="pcd-projects-hero__title">
            {tp.titleL1}<br className="pcd-projects-hero__title-break" /> <span className="pop">{tp.titlePop}</span><br />
            {tp.titleL2}
            {tp.titleL3 && <><br className="pcd-projects-hero__title-break" />{tp.titleL3}</>}
          </h1>
        </div>
        <div className="pcd-projects-hero__illustration">
          <span className="pcd-projects-hero__globo-wrap pcd-projects-hero__globo-wrap--cen">
            <img className="pcd-projects-hero__globo pcd-projects-hero__globo--cen" src={`${IMG}/globo-cen.webp`} alt="" aria-hidden="true" />
          </span>
          <span className="pcd-projects-hero__globo-wrap pcd-projects-hero__globo-wrap--izq">
            <img className="pcd-projects-hero__globo pcd-projects-hero__globo--izq" src={`${IMG}/globo-izq.webp`} alt="" aria-hidden="true" />
          </span>
          <span className="pcd-projects-hero__globo-wrap pcd-projects-hero__globo-wrap--der">
            <img className="pcd-projects-hero__globo pcd-projects-hero__globo--der" src={`${IMG}/globo-der.webp`} alt="" aria-hidden="true" />
          </span>
          <img className="pcd-projects-hero__people" src={`${IMG}/proyectos-imagen.webp`} alt="Estudiantes de Creación Digital conversando" />
        </div>
      </section>

      <section className="pcd-projects pcd-projects--page">
        {/* ===== FILTROS ===== */}
        <div className="pcd-projects__filters pcd-reveal" ref={filtersRef}>
          <div className="pcd-projects__filter-dropdown">
            <button
              type="button"
              className={`pcd-projects__filter-btn pcd-projects__filter-btn--year${selectedYears.length ? ' is-active' : ''}`}
              onClick={() => { setYearOpen((v) => !v); setSubjectOpen(false); }}
              aria-expanded={yearOpen}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
              {tp.filterYear}
            </button>
            {yearOpen && (
              <div className="pcd-projects__filter-menu">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    type="button"
                    className={`pcd-projects__filter-option pcd-projects__filter-option--year${selectedYears.includes(year) ? ' is-selected' : ''}`}
                    onClick={() => toggleYear(year)}
                  >
                    <span className="pcd-projects__filter-checkbox" aria-hidden="true">
                      {selectedYears.includes(year) && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pcd-projects__filter-dropdown">
            <button
              type="button"
              className={`pcd-projects__filter-btn pcd-projects__filter-btn--subject${selectedSubjects.length ? ' is-active' : ''}`}
              onClick={() => { setSubjectOpen((v) => !v); setYearOpen(false); }}
              aria-expanded={subjectOpen}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              {tp.filterSubject}
            </button>
            {subjectOpen && (
              <div className="pcd-projects__filter-menu">
                {availableSubjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    className={`pcd-projects__filter-option pcd-projects__filter-option--subject${selectedSubjects.includes(subject) ? ' is-selected' : ''}`}
                    onClick={() => toggleSubject(subject)}
                  >
                    <span className="pcd-projects__filter-checkbox" aria-hidden="true">
                      {selectedSubjects.includes(subject) && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    {subjectLabel(subject)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {chips.length > 0 && (
            <>
              <div className="pcd-projects__chips">
                {chips.map((chip) => (
                  <span className={`pcd-projects__chip pcd-projects__chip--${chip.kind}`} key={`${chip.kind}-${chip.value}`}>
                    {chip.kind === 'subject' ? subjectLabel(chip.value) : chip.value}
                    <button type="button" aria-label={`${tp.removeFilter} ${chip.value}`} onClick={() => removeChip(chip)}>×</button>
                  </span>
                ))}
              </div>
              <button type="button" className="pcd-projects__filter-clear" onClick={clearAll} aria-label={tp.clearAll}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* ===== GRID ===== */}
        {pageItems.length > 0 ? (
          <div className="pcd-projects-page__grid">
            {pageItems.map((p) => {
              const inner = (
                <>
                  <div
                    className={`pcd-project__media${p.id === 'chocosapiens-humanismo-digital' ? ' pcd-project__media--contain' : ''}`}
                    style={{ backgroundImage: `url('${p.image}')` }}
                    aria-hidden="true"
                  />
                  <div className="pcd-project__meta">
                    <span>{(lang === 'en' ? (p.subjectEn ?? p.subject) : p.subject).toUpperCase()}</span>
                    <span>{p.year}</span>
                  </div>
                  <p className="pcd-project__caption">{lang === 'en' ? (p.captionEn ?? p.caption) : p.caption}</p>
                  {p.fileUrl && (
                    <a className="pcd-project__file" href={p.fileUrl} target="_blank" rel="noopener">
                      {p.fileLabel ?? tp.fileLabel} <span aria-hidden="true">→</span>
                    </a>
                  )}
                </>
              );
              return p.modal ? (
                <Link key={p.id} to={`/proyectos/${p.id}`} className="pcd-project pcd-project--clickable pcd-reveal" style={{ textDecoration: 'none' }}>
                  {inner}
                </Link>
              ) : (
                <article key={p.id} className="pcd-project pcd-reveal">{inner}</article>
              );
            })}
          </div>
        ) : (
          <p className="pcd-projects__empty">{tp.empty}</p>
        )}

        {/* ===== PAGINACIÓN ===== */}
        {(totalPages >= 1) && (
          <nav className="pcd-projects__pagination pcd-reveal" aria-label={tp.paginationLabel}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label={tp.prevPage}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={n === currentPage ? 'is-active' : ''}
                onClick={() => setPage(n)}
                aria-current={n === currentPage ? 'page' : undefined}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label={tp.nextPage}
            >
              →
            </button>
          </nav>
        )}
      </section>

      <footer className="pcd-footer pcd-footer--dark" id="contacto">
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
