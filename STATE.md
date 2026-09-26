# BIA Honduras — Estado del Proyecto

**Última actualización:** 2026-09-26
**Propósito:** retomar el trabajo en otra sesión sin releer toda la conversación.

---

## 1. Qué es este proyecto

Sitio web bilingüe para **BIA Honduras**, el pilar hondureño de BIA Foods. Marca de
café y alimentos con sede en Honduras. El sitio es editorial y cinematográfico:
narrativa de origen, marca empleadora y storytelling corporativo.

Convertido desde una plantilla de Cover Architectural Labs. Ese andamiaje ya no
existe en el código activo.

### Stack

React 19 · TypeScript · Vite 6 · React Router 7 · Motion · Lenis · Tailwind CSS 4 ·
Vitest. Sin dependencias de UI, sin `@types/react` (por eso `key` no compila en
componentes: usa `<Fragment key>`).

---

## 2. Estado actual

| | |
|---|---|
| Rama | `main`, sincronizada con `origin/main` |
| Último commit | `8136353` Play the MotionStory film instead of seeking it |
| Remoto | `https://github.com/biahndcompras/website.git` |
| Producción | `https://biahonduras.vercel.app` |
| Gates | 151 tests, `tsc --noEmit`, `vite build`, detector UI `[]` — todo verde |

---

## 3. Rutas

| Español | Alias inglés | Página |
|---|---|---|
| `/` | — | Home narrativa |
| `/nosotros` | `/about` | Identidad, historia, valores |
| `/marcas` | `/brands` | El Indio, Café Maya, Oro Puro, Medalla |
| `/calidad-y-sostenibilidad` | `/quality` | Seguridad alimentaria, trazabilidad, territorio |
| `/talento` | `/careers` | Employer brand |
| `/contactanos` | `/contact` | Hub editorial de contacto |

Cada alias es una **ruta montada de verdad**, no solo canonicalización. Por eso
cada una escribe `link[rel="canonical"]` apuntando al path español, para que una
página no sea indexable dos veces.

**Decisión de producto:** no se mencionan los *hubs* en ninguna parte. Se retiró
de la navegación, el footer y el copy. La Home conserva su sección histórica de
hubs porque es contenido previo aprobado — si quieres retirarla, es un cambio
acordado, no un bug.

---

## 4. Qué se construyó y cómo

### 4.1 Migración desde la plantilla original

Se reemplazó Cover Architectural Labs por BIA Honduras: contenido, rutas,
header/footer, i18n, metadata y assets. Se ^|limpió| el runtime de ADU,
feasibility y configurator. Búsqueda de fuentes remotas o assets no relacionados
devuelve cero.

### 4.2 Home cinematográfica

| Sección | Mecánica |
|---|---|
| Hero | Pista `h-[400vh]`, stage sticky, scrub por seek de un clip local de 15.52s |
| Manifest | Copy editorial |
| Origen | Copán, Marcala, Montecillos |
| Seed to cup | Stage sticky cinematográfico, 7 pasos, reversible, crossfade de variantes |
| Brands | 4 marcas con monogramas |
| **MotionStory** | Sección independiente, ver §4.4 |
| Quality | Layout de dos columnas acotado, sin solapamientos |
| Talent band | CTA a `/talento` |

### 4.3 Subpáginas corporativas

Decisión tomada con el usuario: **una página independiente por tema**, sin menciones
a hubs, historia integrada dentro de `/nosotros`, y `/marcas` como página única
(sin rutas de detalle por marca hasta que haya fotografía y copy aprobados).

Cada página tiene su propia composición editorial — no son el mismo layout con
otros datos:

- **Nosotros**: narrativa + línea de tiempo con fechas pendientes visibles.
- **Marcas**: filas editoriales alternadas con monogramas.
- **Calidad**: alterna secciones claras y navy.
- **Talento**: reutiliza la composición de carreras existente.
- **Contactanos**: índice de audiencias, sin formulario.

`SecondaryPageShell` (`src/components/layout/`) centraliza el marco, el recorte
de overflow, el hero etiquetado y las notas de contenido pendiente.

### 4.4 MotionStory — el problema más difícil

**Síntoma 1: "corre muy rápido al hacer scroll."**
Causa: 23.06s de film mapeados sobre una pista de 200vh = solo 900px de scroll real
a 1440×900. Eso son 39px de scroll por segundo de footage, ~2.5s de película por
clic de rueda. El Hero, que se sentía bien, corre a 174px/s.
Arreglo: ventana de 12s + pista de 260vh → 120px/s. El presupuesto
(`MOTION_STORY_MIN/MAX_PX_PER_SECOND` = 90/170) se asserta leyendo el valor real
del CSS, así que el ratio no puede regresar sin romper la suite.

**Síntoma 2: "se queda estático."**
El arreglo anterior arregló el síntoma equivocado. Causa real:
`preload="metadata"` → solo 4.67s de 23.06s bufferizados. Cada seek más allá de
eso descargaba el segmento antes de pintar; costo medido 12–97ms, y un arrastre
lento repetía frame.
Arreglo: **el film se reproduce, no se busca.** `preload="auto"`, `loop`,
`playbackRate` entre 0.25 y 0.5 que hace ease con el scroll. El scroll conserva la
autoridad vía tolerancia de 0.35s: el scroll continuo no se pelea con la
reproducción, un salto deliberado sí posiciona. Un `IntersectionObserver` pausa y
rebobina cuando el stage sale de pantalla.

> `playbackRate` nunca baja de 0.25 porque Safari rechaza valores menores a 0.5 en
> algunos sources. Ese es el piso técnico, no una preferencia.

**El Hero nunca se modificó.** Verificado por `git diff` contra el commit inicial
(byte-idéntico) y en runtime: 400vh, 15.52s, `preload="metadata"`, seek en
`900 → 5.17s` / `1800 → 10.33s` / `2700 → 15.50s`.

### 4.5 Responsive

Barrido de 12 anchos (320→1920) × 6 rutas. Encontró y corrigió dos problemas
reales:

- **Tap targets de 15px** en móvil. Ahora 44px en móvil, por debajo del mínimo
  táctil de WCAG 2.5.8.
- **Texto de 7.68px** en el wordmark y 9.1px en captions de media. Subidos.

En escritorio los links inline quedan en 15px, que es la excepción que la norma
concede para texto en línea con ratón.

### 4.6 Despliegue

Fallo reportado como "el selector ES/EN no funciona". **No era el selector.**
Faltaba `vercel.json`, así que Vercel respondía las rutas del cliente con su propio
404. Como React Router nunca toca la red al navegar, el sitio se veía perfecto
clickeando y solo fallaba al recargar — lo que se lee como un reset de idioma.

`vercel.json` con `cleanUrls` + rewrite catch-all, protegido por
`src/app/vercelDeploy.test.ts`.

### 4.7 Git

`git init` sobre un directorio que no era repo. Se excluyeron ~1GB de material que
no es del sitio: `orbs/` (31M, app legacy), `assets/` (9.9M, video arquitectónico
sin referencias), `src/assets/` (96M, maestros 4K sin recortar), `._*` (999
AppleDouble del volumen extraíble), `.playwright-mcp/` (64M de screenshots).
Verificado que **nada** importa desde esos directorios; todo el media servido sale
de `public/media/` (23MB).

El primer push falló con 403: faltaba permiso de escritura. El usuario resolvió
habilitarse como colaborador.

---

## 5. Verdades de contenido — la regla más importante

**Solo se publica lo aprobado por BIA.** Todo lo demás se guarda como
`status: 'placeholder'` con una nota visible que el usuario lee en la página.

Vive en `src/content/secondaryPages.ts`:

| Dato | Estado actual |
|---|---|
| `contactChannels[*].value` | `null` — no hay email, teléfono ni dirección publicados |
| `historyMoments[*].period` | `null` — la línea de tiempo dice "Fecha por confirmar con BIA" |
| `talentOpenings.count` | `null` — la sección dice que no acepta solicitudes |
| `secondaryPageMetrics` | `[]` — ninguna métrica puede filtrarse al copy |
| Formulario de contacto | **no existe** — no hay `mailto:`, `tel:` ni `<form>` |

Para promover un placeholder: cambiar `status` a `approved` y llenar el valor. La
nota desaparece sola.

**Nunca inventar:** certificaciones, estándares concretos, métricas, ubicaciones,
vacantes, fechas, datos de contacto. Hay un test que falla si la página de contacto
intenta enviar a un destino inexistente.

---

## 6. Cómo verificar antes de decir que algo funciona

```bash
npm test -- --run     # 151 tests
npm run lint          # tsc --noEmit
npm run build
node ~/.agents/skills/impeccable/scripts/detect.mjs --json src/pages src/components src/index.css
```

Y después, en navegador — los tests no cubren percepción:

- Un recorrido real del flujo, no solo checks de DOM.
- Barrido de bounding boxes en varios anchos buscando overflow y solapamiento.
- **`prefers-reduced-motion` y móvil** en cada sección cinemática.
- Consola en cero errores.

`verification.md` tiene la matriz de evidencia completa con números medidos.

---

## 7. Pendiente

### 7.1Bloqueante — el deploy está roto

```
prod /          → 200
prod /nosotros  → 404   ← el rewrite de vercel.json no está en producción
```

El commit `8bb4e76` (vercel.json) está en GitHub pero **Vercel no ha redesplegado**.
Mientras tanto, toda ruta directa y todo enlace compartido están rotos.

**Acción:** disparar el redespliegue. Si la integración de GitHub no lo hace
automático, `vercel --prod` desde la raíz.

### 7.2 Entradas de BIA

Nada de esto se puede inventar — esperar contenido aprobado:

- Logo oficial y guía de marca (hoy hay un lockup textual placeholder).
- Fotografía aprobada para reemplazar los slots de media abstractos.
- Fechas de la línea de tiempo de la compañía.
- Copy de producto por marca (origen, presentación, notas de cata).
- Estándares de calidad y certificaciones aplicables.
- Canales de contacto: correo, teléfono, dirección, redes, prensa.
- Vacantes reales y el destino de las candidaturas (¿ATS? ¿correo? ¿CRM?).
- Páginas legales: Privacidad, Términos (hoy son placeholders etiquetados).

### 7.3 Decisiones de producto pendientes

Ninguna bloquea; todas son tuyas:

- **¿Retirar la sección de hubs de la Home?** El copy de las subpáginas ya no los
  menciona, pero la Home todavía sí.
- **¿Páginas de detalle por marca?** `/marcas/el-indio` etc. están reservadas
  hasta que haya fotografía y copy oficiales.
- **¿Mover el video a CDN?** `preload="auto"` ahora necesita el clip completo
  (13MB) disponible rápido. En redes lentas el film tarda en bufferizar. Vercel
  Blob o un CDN lo resuelven.
- **Analytics / píxeles de seguimiento.** Ninguno instalado.
- **Dominio propio.** Hoy corre en `biahonduras.vercel.app`.
- **OG image y favicon definitivos.** Los metadatos se actualizan por ruta, pero no
  hay imagen social ni favicon con la marca final.

### 7.4 Opcional

- Chunk splitting: el bundle JS es ~520KB (156KB gzip). Vite avisa por encima de
  500KB. Se puede partitionar por ruta con `React.lazy`.
- `README.md` documenta los overrides de media por variable de entorno
  (`VITE_BIA_HERO_VIDEO_URL`, `VITE_BIA_MOTION_STORY_VIDEO_URL`, etc.).

---

## 8. Mapa de archivos clave

```
src/
  app/routes.ts              rutas canónicas + alias + canonicalización
  app/vercelDeploy.test.ts   protege vercel.json
  content/secondaryPages.ts  CONTRATO DE CONTENIDO — el archivo más importante
  content/bia.ts             contenido Home aprobado
  i18n/
    I18nProvider.tsx         locale + persistencia en localStorage
    translations.ts          todo el copy ES/EN
  components/
    layout/SecondaryPageShell.tsx   marco compartido de subpáginas
    layout/SiteHeader.tsx           nav, switcher de idioma, tema
    layout/siteNavigation.ts        destinos + metadata por ruta
    media/ScrollVideoHero.tsx       Hero — NO TOCAR sin evidencia
    media/heroMedia.ts              scrub del Hero — NO TOCAR
    media/motionStoryMedia.ts       transporte y presupuesto del 2º video
    sections/MotionStorySection.tsx sección cinemática independiente
    sections/ProcessCinematicStage.tsx  "Cada paso importa"
  pages/                     un archivo por página
  test/cssContract.ts        lector de CSS plano para tests de layout

vercel.json                  rewrite SPA — requerido en producción
verification.md              matriz de evidencia con números
docs/plans/                  7 documentos de diseño e implementación
```

---

## 9. Reglas del proyecto

1. **No inventar hechos.** Placeholder con nota visible, siempre.
2. **El Hero no se toca** sin evidencia de que es la causa. Fue restaurado
   explícitamente una vez ya.
3. **Los dos videos son independientes.** El Hero es seek-scrub; MotionStory es
   playback-rate. No unificar.
4. **Nada de overflow horizontal** en ningún ancho, en ninguna ruta.
5. **Reduced motion y móvil** deben quedar legibles e interactivos.
6. **Cada layout tiene un contrato en CSS** que un test lee del stylesheet real.
   Si editas un lado de un ratio, el otro lado también, o la suite falla.
7. **No borrar evidencia.** `verification.md` acumula los números de cada
   medición, incluso de los intentos fallidos.

---

## 10. Cómo retomar

```bash
git pull
npm install
npm run dev          # el puerto 3000 suele estar ocupado; usar --port 3400
```

Luego: `npm test -- --run && npm run lint && npm run build`, y una pasada en
navegador antes de declarar algo terminado.

Si la primera tarea es seguir con el cine, empezar por §4.4: el presupuesto de
scrub ya está protegido por tests, así que se puede iterar sobre la sensación sin
temer romper el ratio a ciegas.
