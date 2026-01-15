/* =========================================================
   UTIL: Año dinámico
   ========================================================= */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* =========================================================
   I18N: estado + carga diccionario
   ========================================================= */
const STATE = { lang: localStorage.getItem('lang') || 'es', dict: {} };

async function loadDict(lang){
  try {
    const res = await fetch(`assets/i18n/${lang}.json`);
    const json = await res.json();

    STATE.dict = json;
    STATE.lang = lang;
    localStorage.setItem('lang', lang);

    applyI18n();
    updateLangToggleUI();
  } catch (e) {
    console.error('Error cargando diccionario', e);
  }
}

function applyI18n(){
  if (!STATE.dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const val = key.split('.').reduce((o,k)=>o?.[k], STATE.dict);
    if (typeof val === 'string') el.textContent = val;
  });

  renderSkills();
  renderProjects();
  renderXP();

  document.documentElement.lang = STATE.lang;
}

function updateLangToggleUI(){
  const pills = document.querySelectorAll('.lang-pill');
  pills.forEach(p=>{
    const lang = p.getAttribute('data-lang');
    p.classList.toggle('active', lang === STATE.lang);
  });
}

/* Toggle ES/EN */
document.getElementById('lang-toggle')?.addEventListener('click', ()=>{
  loadDict(STATE.lang === 'es' ? 'en' : 'es');
});

/* =========================================================
   SKILLS
   ========================================================= */
function renderSkills(){
  const grid = document.getElementById("skills-grid");
  if (!grid || !STATE.dict?.skills) return;

  const s = STATE.dict.skills;
  const blocks = [
    { title: s.dev_title,  items: s.dev_items  },
    { title: s.web_title,  items: s.web_items  },
    { title: s.data_title, items: s.data_items },
    { title: s.soft_title, items: s.soft_items }
  ];

  grid.innerHTML = blocks.map(b => `
    <div class="card skill-card">
      <h3>${b.title}</h3>
      <ul>
        ${b.items.map(i => `<li>${i}</li>`).join("")}
      </ul>
    </div>
  `).join("");
}

/* =========================================================
   EXPERIENCE
   ========================================================= */
function renderXP(){
  const container = document.getElementById("xp-list");
  if (!container || !STATE.dict?.xp) return;

  const x = STATE.dict.xp;
  const items = [
    { title: x.xp1_title, body: x.xp1_body },
    { title: x.xp2_title, body: x.xp2_body },
    { title: x.xp3_title, body: x.xp3_body }
  ];

  container.innerHTML = items.map(i => `
    <div class="card xp-card">
      <h3>${i.title}</h3>
      <p>${i.body}</p>
    </div>
  `).join("");
}

/* =========================================================
   PROJECTS — Carrusel (Opción A)
   ========================================================= */
let PROJECT_INDEX = 0;

function getProjectItems(){
  const proj = STATE.dict?.projects;
  if (!proj) return [];

  return [
    {
      title: proj.p1_title,
      desc: proj.p1_desc,
      why: proj.p1_why,
      link: "https://github.com/SebiGitHub/WEB-DE-PROTOCOLOS-HSJD.git",
      tech: ["PowerApps", "SharePoint", "VBScript", "Access", "Excel"],
      emoji: "🧩"
    },
    {
      title: proj.p2_title,
      desc: proj.p2_desc,
      why: proj.p2_why,
      link: "https://github.com/SebiGitHub/AvaloniaCatalogoWinForms.git",
      tech: ["Avalonia", "WinForms", "Visual Studio"],
      emoji: "🪄"
    },
    {
      title: proj.p3_title,
      desc: proj.p3_desc,
      why: proj.p3_why,
      link: "https://github.com/SebiGitHub/PokedexBuscador.git",
      tech: ["Android Studio", "Kotlin", "PokeAPI"],
      emoji: "🔍"
    }
  ];
}

function clampIndex(i, len){
  if (len <= 0) return 0;
  return (i + len) % len;
}

function renderProjects(){
  const stage = document.getElementById("project-stage");
  const dots = document.getElementById("project-dots");
  if (!stage || !dots) return;

  const items = getProjectItems();
  if (items.length === 0) {
    stage.innerHTML = "";
    dots.innerHTML = "";
    return;
  }

  PROJECT_INDEX = clampIndex(PROJECT_INDEX, items.length);
  const p = items[PROJECT_INDEX];

  stage.innerHTML = `
    <div class="card project-card">
      <div class="project-thumb"><span>${p.emoji}</span></div>

      <h3>${p.title}</h3>
      <p>${p.desc}</p>

      <div class="tech">
        ${p.tech.map(t => `<span>${t}</span>`).join("")}
      </div>

      <details>
        <summary>+ info</summary>
        <p>${p.why}</p>
      </details>

      <a href="${p.link}" class="btn" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  `;

  dots.innerHTML = items.map((_, idx) => `
    <button
      class="carousel-dot ${idx === PROJECT_INDEX ? "active" : ""}"
      aria-label="Ir al proyecto ${idx + 1}"
      data-idx="${idx}">
    </button>
  `).join("");

  dots.querySelectorAll(".carousel-dot").forEach(b=>{
    b.addEventListener("click", ()=>{
      PROJECT_INDEX = Number(b.getAttribute("data-idx"));
      renderProjects();
    });
  });
}

function setupProjectsCarousel(){
  const prev = document.getElementById("proj-prev");
  const next = document.getElementById("proj-next");
  const stage = document.getElementById("project-stage");
  if (!prev || !next || !stage) return;

  prev.addEventListener("click", ()=>{
    const items = getProjectItems();
    PROJECT_INDEX = clampIndex(PROJECT_INDEX - 1, items.length);
    renderProjects();
  });

  next.addEventListener("click", ()=>{
    const items = getProjectItems();
    PROJECT_INDEX = clampIndex(PROJECT_INDEX + 1, items.length);
    renderProjects();
  });

  /* Swipe simple (móvil) */
  let x0 = null;
  stage.addEventListener("touchstart", (e)=>{
    x0 = e.touches?.[0]?.clientX ?? null;
  }, { passive:true });

  stage.addEventListener("touchend", (e)=>{
    const x1 = e.changedTouches?.[0]?.clientX ?? null;
    if (x0 == null || x1 == null) return;

    const dx = x1 - x0;
    if (Math.abs(dx) < 60) return;

    const items = getProjectItems();
    PROJECT_INDEX = clampIndex(PROJECT_INDEX + (dx < 0 ? 1 : -1), items.length);
    renderProjects();
    x0 = null;
  }, { passive:true });
}

/* =========================================================
   CONTACT FORM -> abre Gmail con borrador (como pediste)
   ========================================================= */
function setupContactForm(){
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const name = form.elements["name"]?.value?.trim() || "";
    const email = form.elements["email"]?.value?.trim() || "";
    const msg = form.elements["message"]?.value?.trim() || "";

    const to = "sebitaexporu@gmail.com";
    const subject = `Contacto desde tu portfolio${name ? ` — ${name}` : ""}`;
    const body =
      `Hola Sebastián,\n\n` +
      `${msg}\n\n` +
      (email ? `Mi email: ${email}\n` : "") +
      (name ? `Nombre: ${name}\n` : "") +
      `\n— Enviado desde tu portfolio`;

    const url =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(to)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  });
}

/* =========================================================
   ANIMACIÓN DE SECCIONES (IntersectionObserver)
   ========================================================= */
function setupSectionObserver(){
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  sections.forEach(sec => observer.observe(sec));
}

/* Spotlight: variables CSS */
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty("--mx", `${x}%`);
  document.documentElement.style.setProperty("--my", `${y}%`);
});

/* Arranque */
document.addEventListener("DOMContentLoaded", ()=>{
  setupSectionObserver();
  setupProjectsCarousel();
  setupContactForm();
  loadDict(STATE.lang);
});
