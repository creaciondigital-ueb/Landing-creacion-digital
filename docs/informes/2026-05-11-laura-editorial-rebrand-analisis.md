---
autor: Laura Botero Ríos
cargo: Analista y Planificadora
fecha: 2026-05-11
tema: Análisis estratégico — Editorial Rebrand (Landing PCD + reskin galería)
estado: revision
---

# Análisis Estratégico — Editorial Rebrand

## Resumen ejecutivo

Carlos solicita aplicar un design system editorial nuevo (generado en Claude Design) a dos productos web que ya conviven en este codebase: **(1) una landing del Programa Creación Digital — paraguas de la carrera**, y **(2) la galería de modelos 3D existente (Estudio de Creación Digital 4)**. La directriz firme: **el backend no se toca**; el frontend se reprograma para consumir los mismos endpoints con la nueva estética.

El alcance es grande (~15-20 componentes a re-skinear + 1 componente nuevo grande + cambios de rutas), por lo que el riesgo principal **no es técnico** sino **de coherencia**: que el trabajo se detenga a mitad de camino y la app quede visualmente inconsistente entre rutas.

## Fase 1 — Descubrimiento

### Problema real (no la primera solicitud)

La primera solicitud es "implementar `programa_creacion_digital/index.html`". El problema real, después de leer el chat de Claude Design + las directrices de Carlos, es más amplio:

> *"El programa de Creación Digital de la Universidad El Bosque necesita una landing pública con identidad visual editorial fuerte. La galería existente (que hoy es la home) pasa a ser una subsección de ese programa, y debe adoptar la misma identidad visual para que el visitante perciba un único producto coherente."*

Este reframing tiene implicaciones:
- No es solo "agregar una página"; es **reposicionar todo el frontend**
- La galería deja de ser el destino principal y se vuelve una **subsección curada** del programa
- La identidad visual unificada es el activo más importante de la feature (no la landing en sí)

### Usuarios finales y casos de uso

| Usuario | Antes | Después del rebrand |
|---|---|---|
| **Visitante anónimo** (probable: prospecto de estudiante, padre de familia, jurado de admisiones) | Entra a galería 3D, ve modelos, navega; sin contexto del programa | Entra a landing del programa, lee manifiesto/ejes, descubre portafolio destacado, *opcionalmente* entra a la galería completa |
| **Estudiante actual** | Hace login, sube sus modelos, edita perfil | Mismo flujo pero entra a `/galeria` directamente (probable bookmark) |
| **Docente (teacher/admin)** | Login → admin panel | Mismo flujo, mismas funciones, distinta paleta |
| **Jurado externo / industria** (caso de uso nuevo aspiracional) | No tenía contexto | Landing es la primera impresión profesional del programa |

**Implicación: la audiencia primaria de la landing es distinta a la de la galería** — y eso justifica la separación visual/de ruta.

### Alcance mínimo viable (MVP) vs alcance ideal

| Alcance | Qué entrega | Riesgo de quedar a mitad |
|---|---|---|
| **MVP-1** Landing nueva en `/`, galería intacta (dark) en `/galeria` | Carlos puede compartir URL del programa con tono editorial; galería sigue funcionando, pero visualmente disonante | **Alto** — productos visiblemente "de dos diseñadores distintos" |
| **MVP-2 (recomendado)** Landing nueva + reskin completo de galería al mismo lenguaje | Producto coherente, una sola identidad visual | **Bajo si se entrega completo**; alto si paramos a mitad |
| **Ideal** MVP-2 + microinteracciones, animaciones, scroll-linked effects del design | Premium feel | Mucho tiempo extra para retorno marginal |

**Recomendación de Laura**: MVP-2. La disonancia visual de MVP-1 *empeora* la percepción del programa (sería como abrir una carpeta corporativa que cambia de tipografía a la segunda página). Si por capacidad real solo se puede entregar MVP-1, mejor postergar la landing hasta poder hacer MVP-2 atómicamente.

### Restricciones técnicas relevantes

- **Stack vivo:** Vite 6 + React 19 + TypeScript estricto. El design entrega HTML/CSS — hay que portar disciplinadamente.
- **Backend intocable** (directriz Carlos). Toda decisión de UX que requiera cambios de schema o nuevos endpoints → fuera de alcance, se discute aparte.
- **Cero deploy en este plan.** Trabajamos en branch `feature/editorial-rebrand` local. La sesión de deploy es posterior y separada.
- **El UI Kit del design es "drop-in skin"** — clases CSS coinciden con las del producto real. Eso reduce el riesgo de refactor masivo de JSX (excepto Hero, que sí cambia estructura).
- **Componentes no presentes en el UI Kit** (~15 componentes — ModelModal, ShowcaseCarousel, MarmosetViewer, UploadForm, EditModelForm, ShowcaseUploadForm, AdminPanel, TeacherPanel, UserMenu, ChangePasswordModal, TempPasswordModal, ResetPasswordPage, ProfilePage, EstudiantesPage, SortableModelCard) → **inferencia disciplinada** aplicando tokens + patrones del kit, sin reinventar.

## Fase 2 — Análisis de alternativas

### Alternativa A — Trabajar landing primero, galería después (en sesiones distintas)

Pros:
- Entrega temprana visible (landing)
- Riesgo aislado por etapa
- Permite a Carlos mostrar la landing aunque la galería no esté lista

Contras:
- **Crea ventana de disonancia visual** que puede durar días o semanas
- El compromiso de "después" tiende a postergarse
- Visitantes confundidos en el periodo intermedio

### Alternativa B (recomendada) — Foundation + landing + reskin galería en una línea continua de trabajo

Pros:
- Producto coherente al cerrar
- Cero ventana de disonancia (todo se entrega junto a `develop`)
- Cada sprint construye sobre tokens compartidos — el reskin de la galería es más barato después de tener la landing porque el patrón ya está vivo

Contras:
- Más sprints antes de poder mostrar nada (los primeros se ven "raros" — paleta nueva con estructura vieja)
- Si paramos a mitad, queda inconsistente en local pero NO en producción (es lo que mitiga el riesgo)

### Alternativa C — Reskin de la galería primero, landing después

Pros:
- Permite validar el lenguaje visual sobre algo que YA funciona antes de invertir en componente nuevo
- Galería siempre fue el corazón funcional; consolidar primero

Contras:
- La landing es lo que Carlos solicitó explícitamente — postergarla puede frustrar
- El reskin de la galería SIN tener landing nueva es ambiguo (¿por qué cambió de estética si la home no comunica el nuevo posicionamiento?)

**Recomendación de Laura**: **Alternativa B**. Acumula riesgo en una sola línea de trabajo y entrega coherencia. Carlos confirmó que trabaja en local con branch dedicada, lo cual elimina el riesgo principal (disonancia en producción mientras se trabaja).

## Fase 3 — Riesgos macro de la feature

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| 1 | **Trabajo se detiene a mitad** y queda inconsistente entre rutas | Media | Alto | Sprints atómicos con checkpoint de Carlos al cierre de cada uno. Cada sprint es un commit válido por sí mismo. NO push hasta cerrar todos los sprints |
| 2 | **Componentes sin guía visual del design** terminan "Frankenstein" (mezcla de estilos) | Alta | Medio | Sprint 5/6 disciplinados: documentar el patrón antes de aplicar. Isabella valida cada modal/form contra el kit visualmente |
| 3 | **Cambio de rutas** (`/` → landing) rompe deep-links viejos (bookmarks, comparticiones) | Media en prod | Bajo en local | NO aplicable a esta sesión (local only). Cuando lleguemos a deploy: redirect 301 `/` legacy → `/galeria` si Carlos lo ve necesario |
| 4 | **Bundle size crece** por dual paleta + nuevos componentes + Google Fonts | Baja | Bajo | Code splitting de la landing (`React.lazy`) → Natalia valida en su informe |
| 5 | **TypeScript errors** al cambiar JSX del Hero o HexagonChart | Baja | Bajo | `npx tsc --noEmit` antes de cada commit. Hero es el único componente con cambio estructural fuerte |
| 6 | **El estudiante regular pierde contexto** ("¿dónde está la galería que usaba?") | Baja | Bajo | El topbar de la landing tiene link claro a `/galeria`. Más importante: estudiantes acceden vía login → redirect directo a `/galeria`. NO hay regresión funcional |
| 7 | **Carlos cambia de opinión a mitad** sobre alguna decisión visual (paleta, fonts, mapeo de categoría) | Media | Medio | Decisiones cerradas en Fase A (mesa de expertos) ANTES de implementar. Sprint 1 (tokens) es revertible si hay cambio |
| 8 | **El re-skin oculta bugs preexistentes** del backend (el cambio de CSS revela edge cases visuales no antes notados) | Media | Bajo-medio | Andrés en su informe debe identificar matriz de regresión funcional, no solo visual |

## Fase 4 — Recomendación de alcance y ritmo

**Alcance recomendado a Carlos:**
- ✅ Entregar Alternativa B completa
- ✅ NO incluir scroll-linked animations / microinteracciones avanzadas del design Buck-style (out of scope, sesión aparte)
- ✅ Mantener funcionalidad 1:1 (ningún cambio a flujos, validaciones, contratos de datos)
- ✅ Trabajar en `feature/editorial-rebrand` local, sin deploy en esta sesión ni serie de sesiones

**Ritmo recomendado:**
- 7 sprints atómicos (definidos en el plan inicial)
- Checkpoint de Carlos al cierre de cada sprint
- Sin push hasta cerrar Sprint 7 (todo en branch local)
- Comité de QA (Valentina) antes de marcar la feature como `implementado`

**Decisiones que aún necesitan validación** (los demás expertos deben pronunciarse):
- Valor exacto del blanco frío → **Isabella decide** en su informe
- Layout strategy: ¿1 Layout que detecta ruta, o 2 Layouts (público + interno)? → **Natalia decide**
- Patrón de inferencia para los componentes sin guía visual (ModelModal, AdminPanel, etc.) → **Isabella + Sebastián acuerdan** en sus informes
- Matriz de QA mínima por sprint → **Andrés define** en su informe

## Output esperado del comité

Después de los 5 informes individuales, el acta del comité (escrita por Claude Renard como Tech Lead) debe consolidar:

1. Alcance final acordado (cualquier ajuste sobre la recomendación de Laura)
2. Decisiones específicas resueltas (blanco frío, Layout strategy, paleta de fricciones residuales)
3. Plan ejecutable con sprints inmutables (Carlos aprueba o rechaza)
4. Definition of Done por sprint (qué cuenta como "cerrado")
5. Asignación clara de responsabilidades

**Mi recomendación como Analista**: que el comité produzca **un único plan acordado** que reemplace el plan inicial que escribí solo como Tech Lead (`2026-05-11-editorial-rebrand.md` actual). El plan inicial fue prematuro y debe ser refinado por los hallazgos de los expertos antes de ejecutarse.

---

**Próximo paso**: que los otros 4 expertos (Natalia, Isabella, Sebastián, Andrés) escriban sus informes individuales, idealmente leyendo este informe primero para no duplicar trabajo.
