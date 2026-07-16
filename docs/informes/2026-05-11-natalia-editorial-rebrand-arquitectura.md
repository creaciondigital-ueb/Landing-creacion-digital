---
autor: Natalia Vargas Ospina
cargo: Arquitecta Web
fecha: 2026-05-11
tema: Impacto arquitectural — Editorial Rebrand (rutas, Layout, bundle, code-splitting)
estado: revision
---

# Impacto Arquitectural — Editorial Rebrand

## Resumen ejecutivo

El rebrand no es solo "cambiar CSS". Introduce **dos productos web cohabitando en el mismo SPA**: una landing pública para prospectos, y una aplicación interna para estudiantes/docentes. Esta separación tiene implicaciones arquitecturales reales — y la decisión correcta sobre Layout strategy y code-splitting ahorra trabajo (y bundle) significativo.

Mi mandato en este análisis es resolver 4 preguntas:

1. ¿1 Layout adaptativo o 2 Layouts distintos?
2. ¿Cómo se organiza el routing nuevo?
3. ¿Cuánto crece el bundle y qué code-splitting aplica?
4. ¿Cuál es el riesgo de regresión arquitectural?

## 1) Layout strategy

### Opciones

**A) Un Layout adaptativo** — `Layout.tsx` detecta la ruta y muestra topbar distinta (landing vs galería).

```tsx
const isLanding = useLocation().pathname === '/';
return isLanding ? <PCDTopbar/> : <GaleriaTopbar/>;
{children}
```

| Pro | Contra |
|---|---|
| Un solo punto de entrada | El componente conoce dos diseños — mezcla de responsabilidades |
| Reusa `<Outlet/>` | Crece a medida que aparecen más rutas con topbar distinta |
| | Difícil de razonar — "¿qué topbar muestra esta ruta?" requiere leer el componente |

**B) Dos Layouts distintos** — la landing **NO** usa `Layout.tsx`. Tiene su propia topbar embebida. La galería + páginas internas siguen con `Layout.tsx`.

```tsx
<Routes>
  <Route path="/" element={<ProgramaCreacionDigital />} />  {/* sin Layout */}
  <Route element={<Layout />}>
    <Route path="/galeria" element={<GaleriaPage />} />
    {/* resto de páginas internas */}
  </Route>
</Routes>
```

| Pro | Contra |
|---|---|
| Separación clara de responsabilidades | Duplicación mínima (ambos cargan tokens globales) |
| Cada producto es independiente — landing se puede mover a un sub-paquete o repo distinto sin esfuerzo | |
| Mejor para code-splitting (landing puede ser un chunk separado) | |
| Más fácil de razonar arquitecturalmente | |

### Decisión

**B — Dos Layouts distintos.** Razones:

1. **Separación de productos**: la landing es un producto público estático casi sin estado; la galería es una aplicación con auth, estado complejo, componentes pesados. Mezclarlos en un Layout compartido enmascara esa diferencia.
2. **Code-splitting natural**: si la landing es un componente independiente envuelto en `React.lazy`, su bundle es chunk separado. Visitantes nuevos descargan solo la landing; el bundle de la galería se descarga al navegar a `/galeria` (o se pre-fetcha en idle).
3. **Mantenibilidad**: el día que decidamos llevar la landing a un repo aparte (escenario realista si la universidad pide separación de responsabilidades), el costo es bajísimo.

## 2) Routing

### Estructura propuesta

```tsx
// App.tsx
const ProgramaCreacionDigital = React.lazy(() => import('./pages/ProgramaCreacionDigital'));

<Routes>
  <Route path="/" element={
    <Suspense fallback={<PCDLoadingSkeleton/>}>
      <ProgramaCreacionDigital />
    </Suspense>
  } />
  <Route element={<Layout />}>
    <Route path="/galeria"        element={<GaleriaPage />} />
    <Route path="/estudiantes"    element={<EstudiantesPage />} />
    <Route path="/perfil"         element={<ProfilePage />} />
    <Route path="/admin"          element={<AdminPanel />} />
    <Route path="/teacher"        element={<TeacherPanel />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
  </Route>
</Routes>
```

### Pre-fetch en idle (recomendación)

Después de cargar la landing, en idle del navegador pre-cargamos el chunk de `GaleriaPage` (porque es probable que el visitante navegue ahí). Esto se hace con un `<link rel="prefetch">` dinámico o con un hook simple:

```tsx
useEffect(() => {
  const idle = (window as any).requestIdleCallback || setTimeout;
  idle(() => import('./pages/GaleriaPage'));
}, []);
```

**Costo**: ~10 líneas. **Beneficio**: navegación landing → galería se siente instantánea.

### NavLinks del Layout

`Layout.tsx` actualmente tiene:
```tsx
<NavLink to="/" end>Galería</NavLink>
<NavLink to="/estudiantes">Estudiantes</NavLink>
```

Cambiar a:
```tsx
<NavLink to="/galeria" end>Galería</NavLink>
<NavLink to="/estudiantes">Estudiantes</NavLink>
```

Y el `topbar-brand` (logo home del Layout interno) que apunta a `/` debe ahora apuntar a `/galeria` (porque desde la galería el "ir a inicio" del producto interno es la galería, no la landing del programa).

**Decisión arquitectural**: el Layout interno NO debe tener un link "back to landing" en su topbar central. El usuario logueado vive en `/galeria` y derivados. La landing es el "afuera" del producto. Si lo necesitara, va en el footer o user menu.

## 3) Bundle size + code-splitting

### Antes del rebrand

```
dist/assets/index-XXX.js              ~340 KB (105 KB gzipped)
dist/assets/Model3D-XXX.js            ~130 KB (Three.js loaders)
dist/assets/events-XXX.js             ~847 KB (R3F + Three.js core, lazy ya)
dist/assets/index-XXX.css             ~44 KB
```

### Predicción post-rebrand (sin code-splitting de la landing)

```
dist/assets/index-XXX.js              ~340 KB + ~25 KB (JSX de la landing + tokens) = ~365 KB
dist/assets/index-XXX.css             ~44 KB + ~16 KB (programa.css) = ~60 KB
+ Google Fonts (CDN, no entra al bundle, ~30 KB de woff2 total al primer load)
```

**Problema**: visitantes que entran a `/galeria` directamente (estudiantes con bookmark) descargan ~25 KB extra de JSX de landing que **nunca van a usar**. Pequeño en absoluto, pero gratis evitarlo.

### Con code-splitting (recomendado)

```
dist/assets/ProgramaCreacionDigital-XXX.js   ~25 KB (chunk separado, lazy)
dist/assets/index-XXX.js                      ~340 KB (sin la landing)
dist/assets/index-XXX.css                     ~60 KB (CSS sigue junto por ahora — Vite no splittea CSS por ruta por default)
```

**Costo**: 1 línea de `React.lazy(...)` + `<Suspense>` wrapper.
**Beneficio**: visitantes a `/galeria` no descargan código de la landing.

### Sobre el CSS

Vite por default empaqueta TODO el CSS en un solo bundle (`index-XXX.css`). Si quisiéramos splittear `programa.css` por ruta, requeriría configuración custom de Vite (CSS code-splitting via dynamic imports). **Mi recomendación**: NO hacer CSS splitting en esta feature. Los ~16 KB extra son negligible vs el riesgo de configuración compleja. Si más adelante el proyecto crece a 5+ productos, reconsideramos.

### Fuentes (Google Fonts CDN)

- DM Serif Text: ~22 KB woff2 (regular + italic)
- Zalando Sans: ~38 KB (variable + variable italic)
- Rubik Bubbles: ~16 KB
- JetBrains Mono: ~30 KB (ya estaba)

Total fonts: ~106 KB. Google Fonts entrega `display: swap` por default — render no se bloquea.

**Alternativa considerada**: auto-host las fuentes desde `/public/fonts/`. Pros: cero round-trip a Google. Contras: ~5 MB de archivos `.ttf` en el repo (los `.ttf` del design no están optimizados — Google sirve `.woff2` que son ~4x más chicos). Decisión: **CDN**.

## 4) Riesgo de regresión arquitectural

| # | Riesgo | Mitigación |
|---|---|---|
| 1 | Páginas con auth (`/perfil`, `/admin`) pierden el guard al cambiar de ruta | Verificar que `Layout.tsx` mantiene el guard tras el cambio. Andrés valida en su matriz |
| 2 | `topbar-brand` apuntando a `/` lleva al usuario logueado de vuelta a la landing pública | Cambiar `<NavLink to="/">` → `<NavLink to="/galeria">` en Layout |
| 3 | `must_change_password` modal (montado en Layout) no aplica a `/` | Correcto comportamiento — la landing es pública, no hay auth ahí. NO bug |
| 4 | Bookmarks viejos a `/` (que esperaban galería) ahora llevan a landing | NO aplicable en local. En deploy: si Carlos quiere, agregar lógica de detección "usuario logueado en `/`" → redirect a `/galeria`. Sesión aparte |
| 5 | Pre-fetch de `GaleriaPage` consume ancho de banda mobile innecesario | Condicionar a `navigator.connection?.effectiveType === '4g'` o saveData. Pero overkill — 25 KB es ínfimo |
| 6 | El landing usa `<a href="#manifiesto">` (anchors). Con React Router puro, `<a>` causa full reload | Usar scroll dentro del componente. Cambiar `<a href="#X">` por `<a onClick={scrollToSection}>` o useEffect que escucha hash change |

## Output del informe

**Decisiones que aporto al comité:**

1. ✅ **Layout strategy**: dos Layouts. Landing fuera del `<Route element={<Layout/>}>`, todo lo interno con Layout.
2. ✅ **Routing**: `/` → landing (lazy), `/galeria` → galería (en Layout), resto sin cambio. Pre-fetch del chunk galería en idle.
3. ✅ **Code-splitting**: `React.lazy` para la landing. NO splittear el CSS.
4. ✅ **Fuentes**: Google Fonts CDN, no auto-host.
5. ⚠️ **Anchors del landing**: revisar que los `<a href="#X">` funcionen sin recargar — usar scroll JS o tweak con React Router.
6. ⚠️ **NavLink home del topbar interno**: cambiar de `/` a `/galeria` para no sacar al usuario logueado del producto.

**Pregunta abierta para Carlos** (no decisión mía):
- ¿Deploy posterior incluirá redirect 301 de `/legacy-routes` a las nuevas? Para esta sesión es irrelevante (local), pero hay que ponerlo en el TODO para el deploy.

**Estimación de mi alcance arquitectural**: 15-20 min de implementación de Sprint 2 (rutas + Layout strategy + lazy/Suspense). El grueso de Sprint 2 es JSX/CSS de la landing, no arquitectura.
