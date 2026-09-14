# Portfolio — Sebastián Expósito Ruiz

## Qué es
Mi portfolio personal alojado en GitHub Pages, donde muestro mis proyectos, tecnologías y formas de contacto.

## Stack
- Frontend: HTML/CSS/JavaScript (Visual Studio Code)
- Hosting: GitHub Pages

## Features
- Presentación personal + skills
- Listado de proyectos con enlaces a repos/demo
- Sección de contacto
- Diseño responsive
- Versión ES/EN

## Capturas/GIF
<img width="2497" height="1256" alt="image" src="https://github.com/user-attachments/assets/91f4d19c-afbd-401e-951c-bbbafc6d6b1c" />
<img width="1151" height="1162" alt="image" src="https://github.com/user-attachments/assets/284bab8c-2067-4605-a5d3-893c9701edd8" />
<img width="1232" height="939" alt="image" src="https://github.com/user-attachments/assets/c3bb2044-52e3-43b2-acc2-86e063b1f33a" />

## Cómo ejecutar
Opción A (simple):
1. Clona el repo
2. Abre `index.html` en el navegador

Opción B (recomendado):
1. Clona el repo
2. Lanza un servidor local (ej. Live Server en VS Code)

## Qué aprendí
- Estructurar un portfolio pensado para recruiters (claridad, navegación, CTA)
- Despliegue con GitHub Pages
- Mejoras de UI/UX: jerarquía visual, responsive, accesibilidad básica

## Validación y CV

La web mantiene HTML, CSS y JavaScript sin framework. `npm install`, `npx playwright install chromium` y `npm test` comprueban tres anchuras, idiomas, errores JavaScript y enlaces internos. Se necesita Python 3 para el servidor de pruebas.

Las fuentes actuales del CV están en `assets/cv/CV_ES.html` y `CV_EN.html`; pueden imprimirse desde el navegador. El workflow genera los PDF como artefactos descargables de GitHub Actions tras superar las pruebas. No modifica la rama. Los diseños de Canva se mantienen por separado y no se sincronizan automáticamente.
