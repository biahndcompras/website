---
name: validate
description: QA adversarial para BIA Honduras: valida la narrativa bilingüe, el hero de video con scroll ciclo, parallax cinematográfico, rutas, accesibilidad, layout responsive y claims sin inventar.
---

# `/validate` — QA adversarial BIA Honduras

Eres un revisor externo y escéptico. Los tests verdes son evidencia, no aprobación: busca fallos de lógica, estados intermedios, regresiones visuales, falsos positivos de accesibilidad y contenido que contradiga el brief.

## 0. Contexto y gates del proyecto

- La app es React 19 + Vite + TypeScript + Tailwind 4 + `motion` + `lenis` + React Router.
- La superficie pública tiene `/` y `/careers`, con español inicial e inglés completo.
- El Home es una narrativa editorial BIA Honduras; el Hero usa video como medio principal y un poster solo como fallback.
- Comandos de evidencia: `npm test -- --run`, `npm run lint`, `npm run build` y verificación Playwright en desktop/mobile.
- El diseño aprobado usa azules profundos, marfil, cobre, whitespace generoso, parallax restringido y movimiento suave.
- El contenido no puede inventar métricas, certificaciones, ubicaciones, vacantes o claims no aprobados.

## 1. Invariantes específicos — “Busca X / quebrar si Y”

1. **Video hero real:** busca que `/media/bia-origin-hero.mp4` sea el medio visible y cargado; quebrar si el Hero depende de una imagen estática, de un video arquitectónico remoto o de un archivo inexistente.
2. **Ciclo de scroll completo:** busca que el Hero permanezca fijo hasta completar el ciclo de video y reiniciarlo; quebrar si el contenido inferior aparece antes del final del ciclo o si el reinicio salta frames/posiciones.
3. **Seek determinista y acotado:** busca que `currentTime` se mantenga entre 0 y la duración, con una sola búsqueda pendiente; quebrar si hay seek races, saltos al帧 incorrecto, NaN o valores fuera de rango.
4. **Parallax cinematográfico seguro:** busca al menos dos secciones con entrada/salida por scroll además del Hero; quebrar si el movimiento solo se activa en entrada, oculta contenido al subir, altera el layout o causa overflow horizontal.
5. **Capas sin solapamiento:** busca que video, fondos, overlays, texto, botones y media slots tengan un z-index y的空间 intentionally; quebrar si una imagen o panel tapa texto, botones, focus rings o la navegación.
6. **Reduced motion usable:** busca que `prefers-reduced-motion: reduce` desactive scrub/parallax agresivo, mantenga copy y controles visibles y no deje elementos focusables ocultos; quebrar si el contenido principal queda invisible o inaccesible.
7. **Bilingüe completo:** busca que toda key usada exista en `es` y `en`, que `lang`, metadata y rutas cambien correctamente y que cambiar idioma no pierda el contexto de scroll; quebrar si aparece una key, un undefined o un texto en el idioma incorrecto.
8. **Rutas y anchors reales:** busca que `/` y `/careers` rendericen sus secciones y que los anchors `#bia-story`, `#bia-hubs`, `#bia-brands`, `#contact` y los anchors de Careers resuelvan sin 404, scroll infinito o header cubriendo el destino.
9. **Responsive real:** busca ausencia de overflow horizontal, tap targets utilizables y composición legible al menos en 320/390 px y 1440 px; quebrar si un panel, imagen o transición desborda el viewport.
10. **Claims honestos:** busca que cifras, certificaciones, ubicaciones, vacantes y contactos no aprobados estén ausentes o marcados como placeholder; quebrar si el contenido presenta un dato inventado como hecho.
11. **Identidad limpia:** busca que el runtime activo no contenga Cover, ADU, feasibility, configurator ni copy arquitectónico; quebrar si un archivo stale vuelve al import graph o al contenido visible.
12. **Motion quality gate:** busca transiciones de transform/opacity, no de width/height/padding/margin; quebrar si el detector encuentra layout transitions en el bloque tocado.

## 2. Revisión adversarial

Para cada bloque modificado:

- Traza el flujo real: evento → estado → MotionValue → DOM → cleanup.
- Comprueba los límites: scroll 0, scroll 1, halfway, final de video, restart, reduced motion, media error, mobile resize, route change y locale change.
- Busca `catch` silenciosos, timers sin cleanup, listeners duplicados, `Math.random` en contenido o estados que se inicializan en orden incorrecto.
- Revisa el código, no solo las assertions: un test puede pasar aunque el comportamiento visible sea incorrecto.
- Comprueba z-index, stacking contexts, clipping, sticky boundaries, pointer events y focus order en el viewport real.
- Verifica que las imágenes/media slots no puedan tapar texto o botones, especialmente en breakpoints angostos.
- No aceptes paridad de traducciones como prueba de calidad de copy: revisa que el texto sea natural, completo y consistente con el tono BIA.

## 3. Comandos y navegador

Ejecuta, según el alcance:

```bash
npm test -- --run
npm run lint
npm run build
node /Users/ecalderonl/.agents/skills/impeccable/scripts/detect.mjs --json src/pages src/components src/index.css
```

Verifica con navegador real:

- `/` y `/careers` en `1440×900` y `390×844`.
- Hero: `currentSrc`, `duration`, `readyState`, `currentTime`, `seeking`, `data-media-state`.
- Scroll hacia abajo y arriba: Hero, sección parallax y penúltima sección.
- Cambio ES/EN, navegación de rutas, anchors y reduced motion.
- Network/console: cero errores; media fallback intencional si se bloquea el MP4.

## 4. Salida obligatoria

```text
## Informe de QA — {alcance}
- {n} hallazgos: {n_críticos} críticos, {n} medios, {n} menores; {n} preguntas.

### Críticos (deben corregirse antes de continuar)
- **...**: ruta, síntoma y reproducción.

### Medios
- **...**: impacto y corrección exigida.

### Menores / estilo
- **...**

### Preguntas incómodas
- **...**

### Decisión final
- [ ] El bloque está listo / [ ] requiere corrección / [ ] requiere justificación con evidencia.
```

## 5. Reglas de corrección

- Todo crítico se corrige inmediatamente y se vuelve a verificar.
- Todo medio se corrige o se documenta con una razón verificable.
- No se declara PASS por tests alone: se requiere inspección visual y evidencia de navegador.
- Si un hallazgo revela un invariante nuevo, se agrega a la Sección 1 antes de cerrar.
