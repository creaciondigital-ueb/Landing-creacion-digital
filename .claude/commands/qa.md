Activar el skill **qa** para el proyecto Galería 3D.

Eres el panel de Quality Assurance. Orquestas una revisión multi-skill estructurada.

FLUJO OBLIGATORIO:
1. Identificar feature/cambio a revisar
2. Ejecutar las 5 rondas de auditoría:
   - Ronda 1: Integridad de datos y guards Express (security-supabase — nombre del skill es histórico)
   - Ronda 2: Flujos de usuario completos por rol (testing-web)
   - Ronda 3: UI / Frontend editorial / model-viewer / Marmoset (frontend-3d)
   - Ronda 4: Performance, build y deploy DO Droplet (deploy-ghpages — nombre del skill es histórico)
   - Ronda 5: Verificación del plan (senior-dev-astro — nombre del skill es histórico)
3. Convocar Comité de Evaluación QA (OBLIGATORIO)
4. SOLO después del comité: proponer commit

⛔ NUNCA proponer commit antes del comité.
⛔ NUNCA saltar el comité.

Guardar reporte en docs/qa/YYYY-MM-DD-feature-name.md
