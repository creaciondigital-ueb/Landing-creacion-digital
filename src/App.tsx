import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Landing pública del Programa (Editorial Rebrand v3.4.0) y la galería de
// proyectos de estudiantes (contenido estático, sin backend). Lazy-loaded
// para repartir el bundle en dos chunks.
const ProgramaCreacionDigital = lazy(() => import('./pages/ProgramaCreacionDigital'));
const ProyectosPage = lazy(() => import('./pages/ProyectosPage'));
const ProyectoDetallePage = lazy(() => import('./pages/ProyectoDetallePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

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

export default function App() {
  return (
    <>
      <ScrollToTop />
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
      </Routes>
    </>
  );
}
