import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useLang } from './i18n/LanguageContext';

// Landing pública del Programa (Editorial Rebrand v3.4.0) y la galería de
// proyectos de estudiantes (contenido estático, sin backend). Lazy-loaded
// para repartir el bundle en dos chunks.
const ProgramaCreacionDigital = lazy(() => import('./pages/ProgramaCreacionDigital'));
const ProyectosPage = lazy(() => import('./pages/ProyectosPage'));
const ProyectoDetallePage = lazy(() => import('./pages/ProyectoDetallePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
// Página de pauta: oculta, sin enlaces desde el sitio (ver PautaPage.tsx).
const PautaPage = lazy(() => import('./pages/PautaPage'));

/**
 * React Router no resetea el scroll al navegar entre rutas (a diferencia de
 * una navegación de navegador normal) — sin esto, al ir de "/" a "/proyectos"
 * la página nueva podía quedar mostrada a mitad de scroll. Si la URL trae un
 * hash (ej. "/#docentes") respeta el scroll a esa sección en vez de forzar
 * el tope.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

const CHARLA_URL = 'https://forms.cloud.microsoft/r/rx1NFDC8v9?origin=lprLink';

/**
 * Botón flotante "Agenda tu charla informativa": fijo arriba a la derecha (bajo el header)
 * en todas las rutas, para que acompañe la navegación. Estilos en
 * programa.css (.pcd-charla-fab), que cargan todas las páginas.
 */
function CharlaButton() {
  const { t } = useLang();
  return (
    <a className="pcd-charla-fab" href={CHARLA_URL} target="_blank" rel="noopener">
      {t.nav.charla} <span aria-hidden="true">→</span>
    </a>
  );
}

export default function App() {
  // En /pauta no va el botón de charla: esa página no tiene salidas.
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      {pathname !== '/pauta' && <CharlaButton />}
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div className="pcd-loading">Cargando…</div>}>
              <ProgramaCreacionDigital />
            </Suspense>
          }
        />
        <Route
          path="/proyectos"
          element={
            <Suspense fallback={<div className="pcd-loading">Cargando…</div>}>
              <ProyectosPage />
            </Suspense>
          }
        />
        <Route
          path="/proyectos/:id"
          element={
            <Suspense fallback={<div className="pcd-loading">Cargando…</div>}>
              <ProyectoDetallePage />
            </Suspense>
          }
        />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<div className="pcd-loading">Cargando…</div>}>
              <BlogPage />
            </Suspense>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <Suspense fallback={<div className="pcd-loading">Cargando…</div>}>
              <BlogPostPage />
            </Suspense>
          }
        />
        <Route
          path="/pauta"
          element={
            <Suspense fallback={null}>
              <PautaPage />
            </Suspense>
          }
        />
        {/* Ruta de repuesto (catch-all) — antes, cualquier URL fuera de
            las 5 rutas de arriba no hacía match con nada y <Routes>
            no renderizaba nada (pantalla en blanco, código 200 porque
            Nginx sirve index.html para cualquier ruta). Hallazgo de la
            auditoría de sep. 2026. */}
        <Route
          path="*"
          element={
            <Suspense fallback={<div className="pcd-loading">Cargando…</div>}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}
