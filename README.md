# Easy Client Web

Frontend web de **Easy Logistics / Easy OS**: landing comercial, autenticación y módulos de la app cliente (cotización y siguientes).

## Stack

| Tecnología | Uso |
|---|---|
| [React 19](https://react.dev/) | UI |
| [Vite 8](https://vite.dev/) | Build y dev server |
| [React Router 7](https://reactrouter.com/) | Rutas (lazy + Suspense) |
| [GSAP + ScrollTrigger](https://gsap.com/) | Animaciones / scroll en landing |
| [Three.js](https://threejs.org/) | Globo 3D y visuales de home |
| [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) | Lint |

## Cómo arrancar

```bash
npm install
npm run dev
```

Otros scripts:

```bash
npm run build    # build de producción → dist/
npm run preview  # servir el build localmente
npm run lint     # oxlint
```

---

## Arquitectura

La app se organiza por **features** (dominios de producto), no por tipo técnico suelto. Cada feature agrupa páginas, componentes, layouts, contenido y estilos propios.

### Mapa de features

| Feature | Rol | Rutas |
|---|---|---|
| `home` | Landing pública (órbita, método, CTA) | `/` |
| `users` | Autenticación / sesión | `/login` |
| `modules` | Shell de app y módulos de negocio | `/app/*` (hoy `/app/cotizacion`) |

### Estructura del repositorio

```
easy_client_web/
├── index.html
├── vite.config.js
├── package.json
├── .oxlintrc.json
├── public/
│   ├── brand/                 # Logos y marks oficiales
│   └── media/                 # Assets estáticos (mapas, imágenes)
└── src/
    ├── main.jsx               # Entry: StrictMode + BrowserRouter
    ├── app/
    │   ├── appRouter.jsx      # Registro central de rutas
    │   └── ScrollToTop.jsx    # Reset de scroll entre rutas
    ├── css/
    │   └── index.css          # Tokens globales, reset, tipografía
    ├── assets/                # Assets menores del bundler
    └── features/
        ├── home/
        │   ├── pages/         # Página de landing
        │   ├── components/    # UI de marketing / órbita
        │   ├── content/       # Copy y datos narrativos
        │   └── styles/
        ├── users/
        │   ├── pages/         # Login
        │   ├── components/
        │   └── styles/
        └── modules/
            ├── pages/         # Pantallas de módulo (Quotation, …)
            ├── layout/        # AppLayout, QuotationLayout
            ├── components/    # Shell (sidebar/header) + UI del módulo
            ├── content/       # Nav de módulos, etc.
            └── styles/
```

### Capas principales

| Capa | Responsabilidad |
|---|---|
| `src/main.jsx` | Bootstrap (router, CSS global) |
| `src/app/` | Infra de app: rutas, utilidades de navegación |
| `src/css/` | Design tokens globales (`--navy`, `--cyan`, tipografías) |
| `src/features/<nombre>/` | Módulo de producto autocontenido |
| `features/*/pages/` | Pantallas conectadas al router |
| `features/*/layout/` | Layouts con shell / composición de página |
| `features/*/components/` | Componentes de esa feature |
| `features/*/content/` | Datos estáticos, copy, config de navegación |
| `features/*/styles/` | CSS específico de la feature |
| `public/brand`, `public/media` | Assets servidos tal cual (sin bundling) |

### Flujo de arranque

```
index.html
  → src/main.jsx
    → BrowserRouter
      → ScrollToTop
      → app/appRouter.jsx
           ├─ /              → features/home/pages
           ├─ /login         → features/users/pages/login
           ├─ /app           → redirect → /app/cotizacion
           └─ /app/cotizacion → features/modules/layout/QuotationLayout
```

Las rutas se cargan con `React.lazy` + `Suspense` desde `appRouter.jsx`. El objeto `routes` es la fuente de verdad de path + elemento.

### Dependencias entre features

- Preferir **imports dentro de la misma feature**.
- Cross-feature solo cuando sea reutilización clara (ej. `modules` reutiliza `Header` / estilos de `home`, o `BrandLogo` desde `users`).
- No inventar una capa `shared/` hasta que haya 2+ consumidores reales y estables.

### Features actuales (resumen)

**`home`** — Landing: hero con marca, globo/órbita (Three.js), método, video band, rail de flujo, trust/coverage, footer y panel “learn more”. Copy en `content/landingNarrative.js`.

**`users`** — Login con backdrop compartible; post-submit navega hacia la app.

**`modules`** — Cotización (`Quotation` + form) y base de shell (`AppLayout`, sidebar/header, `MODULE_NAV`). Módulos futuros (vinculación, operaciones, tracking, etc.) se registran primero en `content/navigation.js` y luego como rutas.

### Cómo agregar una feature o módulo

1. Crear `src/features/<nombre>/` con `pages/`, `components/`, `styles/`, y si aplica `layout/` o `content/`.
2. Seguir las convenciones de nombres de abajo.
3. Registrar la ruta en `src/app/appRouter.jsx` (lazy + Suspense).
4. Si es módulo de app, añadir entrada en `features/modules/content/navigation.js`.

```
src/features/modules/
  pages/Tracking.jsx
  components/TrackingBoard.jsx
  styles/tracking.css
```

---

## Convenciones de naming

### Archivos y carpetas

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componentes React | **PascalCase** + `.jsx` | `BrandLogo.jsx`, `QuotationForm.jsx` |
| Layouts | **PascalCase** + sufijo `Layout` | `AppLayout.jsx`, `QuotationLayout.jsx` |
| Páginas | **PascalCase** o `index` / nombre de ruta en minúscula | `Quotation.jsx`, `index.jsx`, `login.jsx` |
| Módulos / utilidades / config | **camelCase** + `.js` o `.jsx` | `appRouter.jsx`, `landingNarrative.js`, `brandMark.js` |
| Estilos CSS | **kebab-case** | `landing.css`, `quotation-form.css`, `app-shell.css` |
| Carpetas de features | **kebab-case** / minúsculas | `home/`, `users/`, `modules/` |
| Assets públicos de marca | **kebab-case** descriptivo | `easy-logo-on-dark.svg` |

### Código JavaScript / React

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `export default function QuotationLayout()` |
| Funciones / hooks / variables | camelCase | `activeId`, `menuOpen`, `getActiveModuleId` |
| Constantes de módulo / content | SCREAMING_SNAKE o camelCase estable | `MODULE_NAV`, `HERO`, `QUOTE_PATH` |
| Props | camelCase | `onDark`, `menuOpen`, `activeId` |
| Clases CSS | kebab-case (BEM ligero) | `.app-shell__main`, `.quote-module-page` |
| IDs de ancla / secciones | kebab-case | `#inicio`, `#contacto` |
| IDs de módulo en nav | kebab-case o camel corto | `quotation`, `ai-booking` |

### Imports

- Rutas relativas desde el archivo actual.
- Extensión `.jsx` en imports de páginas/componentes cuando el proyecto ya la usa (ver `appRouter.jsx`).
- CSS de feature se importa en la página, layout o componente raíz de esa feature.

```jsx
// features/modules/layout/QuotationLayout.jsx
import Header from '../../home/components/Header'
import Quotation from '../pages/Quotation'
import '../styles/quotation-layout.css'
```

### Componentes y estilos

- Un componente exportado principal por archivo (`export default` preferido).
- Helpers / subcomponentes locales pueden situarse en el mismo archivo si no se reutilizan.
- Named exports OK para piezas auxiliares (`export function RouteMesh`, `export const VideoBand`).
- Tokens globales en `src/css/index.css`.
- Estilos de feature en `features/*/styles/`.
- Preferir clases semánticas frente a estilos inline, salvo valores dinámicos (GSAP, Three, props de logo).

---

## Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) en **español o inglés**, con mensaje corto en imperativo y foco en el *porqué*.

### Formato

```
<tipo>(<scope opcional>): <descripción corta>

[cuerpo opcional]
```

### Tipos

| Tipo | Cuándo |
|---|---|
| `feat` | Nueva funcionalidad visible (ruta, módulo, sección de landing) |
| `fix` | Corrección de bug |
| `refactor` | Cambio interno sin alterar comportamiento |
| `style` | CSS / markup visual sin lógica de negocio |
| `perf` | Mejora de rendimiento (lazy, assets, animaciones) |
| `docs` | Solo documentación (README, comentarios de guía) |
| `chore` | Tooling, deps, config (Vite, oxlint, ignore) |
| `build` | Cambios que afectan el bundle / build |
| `ci` | Pipelines / automatización (si se añaden) |

### Scopes habituales

Alinear el scope con la feature o capa tocada:

- `home` — landing
- `users` — login / auth UI
- `modules` — shell o módulos de `/app`
- `quotation` — flujo de cotización
- `app` — router, bootstrap
- `css` — tokens / estilos globales
- `deps` — dependencias

### Ejemplos

```
feat(home): añadir rail de flujo multimodal en la landing

feat(quotation): formulario inicial de cotización en /app/cotizacion

fix(users): corregir navegación post-login hacia la app

refactor(modules): extraer nav de módulos a content/navigation

style(home): ajustar tipografía del hero en mobile

chore(deps): actualizar gsap y three

docs: documentar arquitectura por features y commits
```

### Reglas

1. **Una intención por commit** — no mezclar feat de cotización con retoques de landing.
2. **Descripción ≤ ~72 caracteres**, en imperativo: “añadir”, “corregir”, “extraer” (no “añadí” / “fixed”).
3. **Scope opcional pero recomendado** cuando el cambio es claramente de una feature.
4. **Breaking changes**: añadir `!` tras el tipo/scope y explicar en el cuerpo (`feat(app)!: renombrar rutas /app/...`).
5. **No commits** de secretos (`.env`, credenciales) ni de `dist/` / artefactos generados.
6. Evitar mensajes genéricos (`update`, `wip`, `fix stuff`).

---

## Configuración de archivos clave

### `vite.config.js`

Vite + plugin React. Extensible para aliases, proxy o env. Hoy permite hosts ngrok en dev.

### `src/app/appRouter.jsx`

Centraliza las rutas. Para agregar una página:

1. Crear la página/layout en `src/features/<feature>/…`
2. `lazy(() => import(...))`
3. Registrar en el objeto `routes` y el `<Route />` correspondiente

### `src/css/index.css`

Design system base: paleta Easy Logistics, tipografías, reset y layout de `#root`.

### `.oxlintrc.json`

Lint con plugins `react` y `oxc`. Reglas activas de hooks y exports de componentes.

---

## Notas

- El contenido de producto está en **español**.
- Respetar `prefers-reduced-motion` en experiencias animadas.
- No editar tokens de marca (navy `#003D4C`, cyan `#00A4BD`) ni assets en `public/brand/` sin alinear con diseño/brand.
- Documentación de modelado de datos Easy OS (Zoho / Airtable) vive en `arquitecturaEasyOS/` y es independiente de este frontend.
)
