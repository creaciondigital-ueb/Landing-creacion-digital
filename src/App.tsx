import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import GaleriaPage from './pages/GaleriaPage';
import EstudiantesPage from './components/EstudiantesPage';
import ProfilePage from './components/ProfilePage';
import AdminPanel from './components/AdminPanel';
import TeacherPanel from './components/TeacherPanel';
import ResetPasswordPage from './components/ResetPasswordPage';

// Editorial Rebrand v3.4.0 — la landing del Programa Creación Digital
// vive en `/` como producto independiente (R2 del acta: dos Layouts
// distintos). Lazy-loaded para que visitantes a `/galeria` no descarguen
// su chunk (R4 del acta).
const ProgramaCreacionDigital = lazy(() => import('./pages/ProgramaCreacionDigital'));

/**
 * Hook que pre-carga el chunk de GaleriaPage en idle del navegador.
 * Visitantes que entren primero a `/` (landing) suelen navegar a `/galeria`
 * después — pre-fetch hace que esa navegación se sienta instantánea.
 * Decisión R4 del comité.
 */
function usePrefetchGaleria() {
  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
    };
    const idle = win.requestIdleCallback || ((cb: () => void) => window.setTimeout(cb, 1));
    idle(() => {
      // Solo pre-fetch si está en `/` (visitante en landing).
      if (window.location.pathname === '/') {
        import('./pages/GaleriaPage');
      }
    });
  }, []);
}

export default function App() {
  usePrefetchGaleria();

  return (
    <Routes>
      {/* Landing pública del Programa (Editorial Rebrand v3.4.0) —
          NO usa Layout; tiene su propia topbar editorial */}
      <Route
        path="/"
        element={
          <Suspense fallback={<div className="pcd-loading">Cargando…</div>}>
            <ProgramaCreacionDigital />
          </Suspense>
        }
      />

      {/* Producto interno (galería + páginas autenticadas) — usan Layout
          con la topbar del Estudio de Creación Digital 4 */}
      <Route element={<Layout />}>
        <Route path="/galeria" element={<GaleriaPage />} />
        <Route path="/estudiantes" element={<EstudiantesPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/teacher" element={<TeacherPanel />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>
    </Routes>
  );
}
