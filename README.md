# Portfolio — Sebastián Expósito Ruiz

## Qué es
Mi portfolio personal alojado en GitHub Pages, donde muestro mis proyectos, tecnologías y formas de contacto.

## Stack
- Frontend: HTML, CSS y JavaScript sin framework
- Hosting: GitHub Pages
- Contenido bilingüe: JSON en `assets/i18n/`

## Features
- Portfolio de una sola página, centrado en tres casos destacados con evidencia visual propia
- Archivo compacto para proyectos secundarios
- Marca visual propia basada en un trébol geométrico de cuatro nodos
- Diseño responsive, accesible por teclado, con `prefers-reduced-motion`
- Metadatos SEO, Open Graph, favicon y página 404
- Versión ES/EN y enlaces directos a CV, GitHub, LinkedIn y email

## Contenido que se actualiza

- Proyectos, trayectoria y capacidades: `assets/i18n/es.json` y `assets/i18n/en.json`.
- Imágenes de los proyectos destacados: `assets/img/projects/`.
- CV descargable: `assets/cv/`.

Para añadir un proyecto destacado, añade el caso en ambos ficheros de idioma y una imagen optimizada en WebP. Para un proyecto secundario, basta con añadir una entrada al bloque `archive.items`.

## Cómo ejecutar
Opción A (simple):
1. Clona el repo
2. Abre `index.html` en el navegador

Opción B (recomendado):
1. Clona el repo
2. Lanza un servidor local (ej. Live Server en VS Code)

## Validación

La web mantiene HTML, CSS y JavaScript sin framework. Ejecuta `npm install --no-package-lock`, `npx playwright install chromium` y `npm test` para comprobar tres anchuras, idioma ES/EN, contenido crítico sin traducciones, metadatos, enlaces internos y la demo del TFG. Se necesita Python 3 para el servidor de pruebas.
