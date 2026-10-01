# BIA Honduras — Estado del Proyecto

**Última actualización:** 2026-10-01
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
| Rama | `main`, sin commit pendiente de este bloque |
| Último commit | `5459e4e` Add AGENTS.md for future sessions |
| Remoto | `https://github.com/biahndcompras/website.git` |
| Producción | `https://biahonduras.vercel.app` |
| Gates | 164 tests, `tsc --noEmit`, `vite build` — todo verde |

---

## 2b. Identidad de marca —ylonavy de 2026-10-01

La paleta café/dorado/ladrillo se reemplazó por la identidad oficial: **azul
`#4A88FA`** y **navy `#1C3565`**, ambos tomados de los archivos de logo
suministrados. El lockup textual provisional se sustituyó por el logo real.

### El logo

`src/components/layout/BiaLogo.tsx` — SVG en línea, cuatro paths (tres letras +
la marca). **Las letras usan `currentColor`**: los archivos "main white" y
"main blue" tienen geometría idéntica y solo difieren en el relleno, así que el
color del contenedor elige la variante. El header y el footer ya alternan entre
`--dark` y `--light`, entonces el logo blanco no necesita un segundo asset.

Se descartó la máscara de luminancia y el `clipPath` del SVG original: solo
enmascaran un rectángulo blanco a canvas completo.

### La paleta y por qué está partida en tres azules

El dato que gobierna todo: **`#4A88FA` tiene luminancia 0.2597**. Con blanco da
3.39:1 y con navy 3.55:1. Ningún texto del sitio alcanza 4.5:1 sobre él — solo
casi-negro (6.19:1), y el sitio no tiene tinta negra. Por eso un solo token no
basta:

| Token | Valor | Uso | Medido |
|---|---|---|---|
| `--bia-blue` | `#4a88fa` | reglas, bordes, puntos, rellenos decorativos, gradientes, la marca del logo, texto ≥24px | 3:1 |
| `--bia-blue-light` | `#6fa6fd` | texto pequeño **sobre** navy | 4.90:1 |
| `--bia-blue-deep` | `#2a63c4` | texto pequeño **sobre** mist; superficies que llevan texto claro | 5.02–5.35:1 |
| `--bia-navy` | `#1c3565` | secciones de fondo sólido (del logo) | — |
| `--bia-navy-deep` | `#16294a` | compañero de gradiente | — |
| `--bia-mist` | `#e9f1fe` | superficie clara **y** texto sobre navy | — |
| `--bia-mist-soft` | `#f4f8fe` | superficie clara más suave | — |
| `--bia-slate` | `#566878` | texto atenuado | 5.07:1 sobre mist |
| `--bia-focus` | `#4480ee` | anillo de foco | 3.32:1 mist · 3.19:1 navy |
| `--bia-focus-on-blue` | `#b3d0ff` | foco sobre las superficies azul profundo | 3.64:1 |

Renombres simultáneos: `--bia-ivory` → `--bia-mist`, `--bia-copper` →
`--bia-blue`, `home-cta--copper` → `home-cta--accent`. `--bia-ivory` era crema
`#f5f0e7`; su luminosidad relativa contra blanco (1.135:1) se reprodujo con un
tinte azul al 12% (`#e9f1fe`, 1.136:1) para no perder la separación entre
secciones claras.

**Consecuencia que hay que respetar:** `#4A88FA` no puede ir detrás de texto
pequeño. Por eso `.home-talent` (la banda que antes era ladrillo) es
`--bia-blue-deep` y no el azul de marca, y los botones de hover
(`.secondary-link`, `.careers-link--light`, `.site-header__contact-link`,
`.home-hero__cta--solid`) también. `.careers-faq` quedó navy como el resto de
las secciones oscuras, con el azul como brillo de acento.

### La trampa que casi costó un deploy

Un renombrado por lotes con `perl` usó `--bia-blue\b`, y `\b` **también** corta
antes del guion de `--bia-blue-light` y `--bia-blue-deep`. Las tres definiciones
se colapsaron en `--bia-blue-deep`, dejando `--bia-blue` y `--bia-blue-light`
**sin definir**. Cada `var(--bia-blue)` del stylesheet pasó a ser una
declaración inválida que caía al valor heredado, en 50 reglas a la vez.

**`tsc` no lo vio. Los 151 tests no lo vieron.** Solo un barrido de contraste
en navegador lo detectó. Por eso ahora existe `src/palette.test.ts`, que afirma
el invariante contra el CSS real.

### Verificación de contraste — cómo se midió de verdad

El primer auditor solo leía `background-color` y reportaba 79 falsos positivos
de 1:1. El segundo intentó reconstruir el fondo en un canvas y falló: **este
navegador rechaza gradientes CSS en `ctx.fillStyle`** (`fillStyle` se queda en
el valor anterior). El tercero —el que sirve— hace esto:

1. Inyecta `color: transparent !important` para quitar los glifos.
2. Toma un **screenshot del viewport sin `clip`**.
3. Lo decodifica dentro de la página y promedia los píxeles reales de cada caja
   de texto.

Dos cosas que hay que saber si se repite esto:

- `page.screenshot({ clip })` usa coordenadas de **documento**, no de viewport.
  Emparejarlas con `getBoundingClientRect()` mezcla el scroll y produce
  "fallos" inventados. Sin `clip` la imagen mapea 1:1 al viewport.
- Sin `prefers-reduced-motion: reduce`, las animaciones de entrada hacen que las
  mediciones caigan en estados intermedios y reporten texto claro sobre fondo
  claro.

Con eso, las 6 rutas quedan en **0 fallos** de contraste.

### Una limitación conocida, medida y no resuelta

El anillo de foco no puede alcanzar 3:1 en **todas** partes a la vez: los
gradientes tienen regiones de luminancia intermedia (`#2a63c4` da 1.51:1 con
`--bia-focus`). Esto ya era así con el dorado anterior (2.42:1 en la misma
región) — no es una regresión, pero tampoco está resuelto. La solución estándar
es un anillo de dos tonos (borde interior claro + exterior oscuro). No se
implementó porque es una decisión de diseño de todo el sitio, no del cambio de
color. Si se quiere, es un bloque pequeño en `:focus-visible`.

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

### 7.1 Bloqueante — el deploy está roto

```
prod /          → 200
prod /nosotros  → 404   ← el rewrite de vercel.json no está en producción
```

El commit `8bb4e76` (vercel.json) está en GitHub pero **Vercel no ha
redesplegado**. Reverificado el 2026-10-01: las cinco subrutas siguen en 404.

**Y no se puede arreglar desde esta máquina.** El CLI de Vercel está
autenticado como `biamxai-2610s-projects`, y ese equipo solo contiene
`sac-module` y `bia-one`. `biahonduras.vercel.app` pertenece a otra cuenta.

Dos caminos:

- `vercel login` con la cuenta que es dueña del dominio, y `vercel --prod`.
- Importar el repo de GitHub como proyecto nuevo en `biamxai-2610s-projects`.
  Fixa el 404 y además da acceso por CLI. Ojo: cambia la URL de producción.

### 7.2 Entradas de BIA

Nada de esto se puede inventar — esperar contenido aprobado:

- ~~Logo oficial~~ — **resuelto el 2026-10-01** (ver §2b). Sigue pendiente la
  guía de marca escrita: tipografías, tono de voz, usos del logo.
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
- **¿Los slots de media abstractos?** Siguen siendo gradientes. Con la paleta
  nueva los verdes de terreno (`--bia-mountain`) conviven con los azules; se
  ve bien, pero es una decisión que vale confirmar cuando llegue fotografía.
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
  palette.test.ts            contrato de paleta + logo contra el CSS real
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
    layout/BiaLogo.tsx              logo oficial — letras = currentColor
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
