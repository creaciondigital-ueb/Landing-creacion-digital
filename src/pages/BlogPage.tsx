import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blog';
import { useLang } from '../i18n/LanguageContext';
import '../styles/programa.css';

const IMG = '/programa/img';
const APLICA_URL = 'https://www.unbosque.edu.co/inscripciones/pregrado';
const PAGE_SIZE = 9;
// Mismo ciclo de colores de marca que las cards del blog en el home
// (ver BLOG_CARD_COLORS en ProgramaCreacionDigital.tsx).
const BLOG_CARD_COLORS = ['cobalt', 'acid', 'tomato', 'ink'] as const;

type FilterKind = 'year' | 'category';
interface Chip { kind: FilterKind; value: string; }

/**
 * Blog del programa — /blog. Noticias e información importante del
 * programa. Sigue el mismo patrón de /proyectos (filtros, grid, paginación)
 * reutilizando los estilos editoriales del sitio.
 */
export default function BlogPage() {
  const { lang, setLang, t } = useLang();
  const tb = t.blogPage;

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
  const [yearOpen, setYearOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const filtersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!yearOpen && !categoryOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setYearOpen(false);
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [yearOpen, categoryOpen]);

  const availableYears = useMemo(
    () => Array.from(new Set(BLOG_POSTS.map((p) => p.year))).sort((a, b) => b.localeCompare(a)),
    []
  );
  const availableCategories = useMemo(
    () => Array.from(new Set(BLOG_POSTS.map((p) => p.category))).sort((a, b) => a.localeCompare(b)),
    []
  );
  // Mapeo ES category → EN label para mostrar en filtros y chips
  const categoryLabel = (category: string) => {
    if (lang !== 'en') return category;
    const p = BLOG_POSTS.find((p) => p.category === category);
    return p?.categoryEn ?? category;
  };

  const toggleYear = (year: string) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]));
    setPage(1);
    setYearOpen(false);
  };
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
    setPage(1);
    setCategoryOpen(false);
  };
  const clearAll = () => { setSelectedYears([]); setSelectedCategories([]); setPage(1); };

  const chips: Chip[] = [
    ...selectedYears.map((value): Chip => ({ kind: 'year', value })),
    ...selectedCategories.map((value): Chip => ({ kind: 'category', value })),
  ];
  const removeChip = (chip: Chip) => (chip.kind === 'year' ? toggleYear(chip.value) : toggleCategory(chip.value));

  const searchNorm = search.trim().toLowerCase();
  const filtered = BLOG_POSTS.filter((p) => {
    const matchesYear = selectedYears.length === 0 || selectedYears.includes(p.year);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchesSearch =
      searchNorm === '' ||
      [p.title, p.titleEn, p.excerpt, p.excerptEn]
        .filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(searchNorm));
    return matchesYear && matchesCategory && matchesSearch;
  });
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
  }, [selectedYears, selectedCategories, currentPage]);

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
    <div className="pcd-page pcd-blog-listing">
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
        <button
          ref={hamburgerRef}
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
              {tb.back}
            </Link>
            <span className="pcd-projects-hero__eyebrow">{tb.eyebrow}</span>
          </div>
          <h1 className="pcd-projects-hero__title">
            {tb.titleL1}<br className="pcd-projects-hero__title-break" /> <span className="pop">{tb.titlePop}</span><br />
            {tb.titleL2}
            {tb.titleL3 && <>{' '}<br className="pcd-projects-hero__title-break" />{tb.titleL3}</>}
          </h1>
        </div>
      </section>

      <section className="pcd-projects pcd-projects--page">
        {/* ===== FILTROS ===== */}
        <div className="pcd-projects__filters pcd-reveal" ref={filtersRef}>
          <label className="pcd-blog-listing__search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={tb.searchPlaceholder}
              aria-label={tb.searchPlaceholder}
            />
          </label>
          <div className="pcd-projects__filter-dropdown">
            <button
              type="button"
              className={`pcd-projects__filter-btn pcd-projects__filter-btn--year${selectedYears.length ? ' is-active' : ''}`}
              onClick={() => { setYearOpen((v) => !v); setCategoryOpen(false); }}
              aria-expanded={yearOpen}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
              {tb.filterYear}
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
              className={`pcd-projects__filter-btn pcd-projects__filter-btn--subject${selectedCategories.length ? ' is-active' : ''}`}
              onClick={() => { setCategoryOpen((v) => !v); setYearOpen(false); }}
              aria-expanded={categoryOpen}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              {tb.filterCategory}
            </button>
            {categoryOpen && (
              <div className="pcd-projects__filter-menu">
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`pcd-projects__filter-option pcd-projects__filter-option--subject${selectedCategories.includes(category) ? ' is-selected' : ''}`}
                    onClick={() => toggleCategory(category)}
                  >
                    <span className="pcd-projects__filter-checkbox" aria-hidden="true">
                      {selectedCategories.includes(category) && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    {categoryLabel(category)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {chips.length > 0 && (
            <>
              <div className="pcd-projects__chips">
                {chips.map((chip) => (
                  <span className={`pcd-projects__chip pcd-projects__chip--${chip.kind === 'year' ? 'year' : 'subject'}`} key={`${chip.kind}-${chip.value}`}>
                    {chip.kind === 'category' ? categoryLabel(chip.value) : chip.value}
                    <button type="button" aria-label={`${tb.removeFilter} ${chip.value}`} onClick={() => removeChip(chip)}>×</button>
                  </span>
                ))}
              </div>
              <button type="button" className="pcd-projects__filter-clear" onClick={clearAll} aria-label={tb.clearAll}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* ===== GRID — mismas cards de color + número fantasma que el blog del home ===== */}
        {pageItems.length > 0 ? (
          <div className="pcd-projects-page__grid pcd-blog-listing__grid">
            {pageItems.map((p) => {
              const origIndex = BLOG_POSTS.findIndex((bp) => bp.id === p.id);
              const cardColor = BLOG_CARD_COLORS[origIndex % BLOG_CARD_COLORS.length];
              const cat = lang === 'en' ? (p.categoryEn ?? p.category) : p.category;
              const date = lang === 'en' ? (p.dateEn ?? p.date) : p.date;
              const cap = lang === 'en' ? (p.titleEn ?? p.title) : p.title;
              const exc = lang === 'en' ? (p.excerptEn ?? p.excerpt) : p.excerpt;
              const inner = (
                <>
                  <span className="pcd-blog-preview__index">{String(origIndex + 1).padStart(2, '0')}</span>
                  <div className="pcd-blog-preview__body">
                    <div className="pcd-blog-listing__meta">
                      <span>{cat.toUpperCase()}</span>
                      <span>{date}</span>
                    </div>
                    <p className="pcd-blog-preview__card-title">{cap}</p>
                    <p className="pcd-blog-preview__excerpt">{exc}</p>
                  </div>
                </>
              );
              const cls = `pcd-blog-preview__card pcd-blog-preview__card--${cardColor} pcd-blog-listing__card pcd-reveal`;
              return p.detail ? (
                <Link key={p.id} to={`/blog/${p.id}`} className={cls}>{inner}</Link>
              ) : (
                <article key={p.id} className={cls}>{inner}</article>
              );
            })}
          </div>
        ) : (
          <p className="pcd-projects__empty">{tb.empty}</p>
        )}

        {/* ===== PAGINACIÓN ===== */}
        {filtered.length > 0 && totalPages > 1 && (
          <nav className="pcd-projects__pagination pcd-reveal" aria-label={tb.paginationLabel}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label={tb.prevPage}
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
              aria-label={tb.nextPage}
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
