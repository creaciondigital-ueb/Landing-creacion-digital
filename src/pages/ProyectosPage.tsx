import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PROYECTOS } from '../data/proyectos';
import '../styles/programa.css';

const IMG = '/programa/img';
const APLICA_URL = 'https://www.unbosque.edu.co/inscripciones/pregrado';
const PAGE_SIZE = 9;

type FilterKind = 'year' | 'subject';
interface Chip { kind: FilterKind; value: string; }

/**
 * Galería de proyectos de estudiantes — /proyectos.
 *
 * Reemplaza a la antigua "Galería 3D" (con login, paneles y base de datos):
 * esta página es contenido 100% estático, tomado de `src/data/proyectos.ts`.
 * Usa el mismo header/footer del landing (`pcd-header`/`pcd-footer`) para
 * que se sienta parte del mismo sitio, sin el navbar del producto viejo.
 */
export default function ProyectosPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [yearOpen, setYearOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // Cierra los dropdowns de filtro al hacer clic fuera de ellos.
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

  // Animación de entrada (fade + slide-up) para el título, filtros, cards
  // y footer — mismo patrón que ProgramaCreacionDigital.tsx: cada elemento
  // con clase .pcd-reveal se anima una sola vez al entrar en pantalla.
  // Se re-observa cada vez que cambian los filtros/página: una card que
  // estaba oculta por un filtro y vuelve a aparecer es un elemento nuevo
  // en el DOM que el observer todavía no vio, así que sin esto se quedaba
  // invisible (opacity:0) para siempre.
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

  return (
    <div className="pcd-page">
      <header className="pcd-header">
        <Link to="/" className="pcd-brand" aria-label="Inicio Creación Digital · Universidad El Bosque">
          <img className="pcd-brand__logo" src={`${IMG}/Label_UEB_CreacionDigital_Horizontal.png`} alt="Universidad El Bosque · Creación Digital" />
        </Link>
        <nav className={`pcd-nav${menuOpen ? ' is-open' : ''}`} aria-label="Principal">
          <Link className="pcd-nav__link" to="/#programa" onClick={() => setMenuOpen(false)}>PROGRAMA</Link>
          <Link className="pcd-nav__link" to="/#docentes" onClick={() => setMenuOpen(false)}>docentes</Link>
          <Link className="pcd-nav__link" to="/proyectos" onClick={() => setMenuOpen(false)}>PROYECTOS</Link>
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
      <section className="pcd-projects-hero">
        <div className="pcd-projects-hero__content pcd-reveal">
          <div className="pcd-projects-hero__eyebrow-row">
            <Link to="/" className="pcd-projects-hero__back">
              <span aria-hidden="true">←</span> Volver al inicio
            </Link>
            <span className="pcd-projects-hero__eyebrow">Portafolio estudiantil</span>
          </div>
          <h1 className="pcd-projects-hero__title">
            Proyectos que<br className="pcd-projects-hero__title-break" /> <span className="pop">crean</span><br />
            nuestros<br className="pcd-projects-hero__title-break" /> estudiantes.
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
              Año
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
              Asignatura
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
                    {subject}
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
                    {chip.value}
                    <button type="button" aria-label={`Quitar filtro ${chip.value}`} onClick={() => removeChip(chip)}>×</button>
                  </span>
                ))}
              </div>
              <button type="button" className="pcd-projects__filter-clear" onClick={clearAll} aria-label="Limpiar todos los filtros">
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
            {pageItems.map((p) => (
              <article className="pcd-project pcd-reveal" key={p.id}>
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
                {p.description && <p className="pcd-project__description">{p.description}</p>}
                {p.fileUrl && (
                  <a className="pcd-project__file" href={p.fileUrl} target="_blank" rel="noopener">
                    {p.fileLabel ?? 'Ver archivo'} <span aria-hidden="true">→</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="pcd-projects__empty">No hay proyectos con esos filtros todavía.</p>
        )}

        {/* ===== PAGINACIÓN ===== */}
        {/* TODO: volver a "totalPages > 1" cuando haya más de 1 página real; se fuerza a true para previsualizar el estilo. */}
        {(totalPages >= 1) && (
          <nav className="pcd-projects__pagination pcd-reveal" aria-label="Paginación de proyectos">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Página anterior"
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
              aria-label="Página siguiente"
            >
              →
            </button>
          </nav>
        )}
      </section>

      <footer className="pcd-footer pcd-footer--dark" id="contacto">
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
