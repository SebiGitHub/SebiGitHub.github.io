/* =========================================================
   CONFIG
========================================================= */
const EMAIL_TO = "sebitaexporu@gmail.com";

/* =========================================================
   STATE
========================================================= */
const STATE = {
  lang: localStorage.getItem("lang") || "es",
  dict: {}
};

/* =========================================================
   HELPERS
========================================================= */
function setYear(){
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

function setCssMouseVars(){
  // Throttle via rAF para no spamear el main thread
  let raf = null;
  window.addEventListener("mousemove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--mx", `${x}%`);
      document.documentElement.style.setProperty("--my", `${y}%`);
      raf = null;
    });
  });
}

/* =========================================================
   I18N
========================================================= */
async function loadDict(lang){
  try{
    const res = await fetch(`assets/i18n/${lang}.json`);
    const json = await res.json();
    STATE.dict = json;
    STATE.lang = lang;
    localStorage.setItem("lang", lang);

    applyI18n();
    updateLangUI();
  }catch(e){
    console.error("Error cargando diccionario:", e);
  }
}

function applyI18n(){
  if (!STATE.dict) return;

  // textContent
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = key.split(".").reduce((o,k)=>o?.[k], STATE.dict);
    if (typeof val === "string") el.textContent = val;
  });

  // placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = key.split(".").reduce((o,k)=>o?.[k], STATE.dict);
    if (typeof val === "string") el.setAttribute("placeholder", val);
  });

  // Render secciones dinámicas
  renderSkills();
  renderProjects();
  renderXP();

  document.documentElement.lang = STATE.lang;
}

function updateLangUI(){
  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;
  toggle.querySelectorAll(".lang-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.lang === STATE.lang);
  });
}

function setupLangToggle(){
  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", (e) => {
    const pill = e.target.closest(".lang-pill");
    if (pill?.dataset.lang) {
      loadDict(pill.dataset.lang);
      return;
    }
    // click fuera de pill: alterna
    loadDict(STATE.lang === "es" ? "en" : "es");
  });
}

/* =========================================================
   SEARCH (busca texto dentro del main)
========================================================= */
function setupSearch(){
  const form = document.getElementById("search-form");
  const input = document.getElementById("site-search");
  const status = document.getElementById("search-status");
  if (!form || !input) return;

  const clearHit = () => {
    document.querySelectorAll(".search-hit").forEach(el => el.classList.remove("search-hit"));
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearHit();

    const q = (input.value || "").trim().toLowerCase();
    if (!q){
      if (status) status.textContent = "";
      return;
    }

    // Buscamos en elementos típicos de contenido (evita nav)
    const candidates = Array.from(document.querySelectorAll("main h1, main h2, main h3, main p, main li, main summary, main small"));
    const match = candidates.find(el => (el.textContent || "").toLowerCase().includes(q));

    if (!match){
      if (status) status.textContent = (STATE.lang === "es" ? "Sin resultados" : "No results");
      return;
    }

    match.classList.add("search-hit");
    match.scrollIntoView({ behavior: "smooth", block: "center" });
    if (status) status.textContent = (STATE.lang === "es" ? "Encontrado" : "Found");
  });
}

/* =========================================================
   CONTACT FORM (sin backend: crea mailto con el contenido)
========================================================= */
function setupContactForm(){
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("f-name")?.value?.trim() || "";
    const email = document.getElementById("f-email")?.value?.trim() || "";
    const message = document.getElementById("f-message")?.value?.trim() || "";

    const subject = encodeURIComponent(`[Portfolio] Mensaje de ${name || "alguien"}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}\n`
    );

    window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;
  });
}

/* =========================================================
   RENDER: PROJECTS
========================================================= */
function renderProjects(){
  const grid = document.getElementById("projects-grid");
  if (!grid || !STATE.dict?.projects) return;

  const proj = STATE.dict.projects;

  const items = [
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

  grid.innerHTML = items.map(p => `
    <div class="card project-card">
      <div class="project-thumb"><span>${p.emoji}</span></div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="tech">${p.tech.map(t => `<span>${t}</span>`).join("")}</div>
      <details>
        <summary>${STATE.lang === "es" ? "+ info" : "+ info"}</summary>
        <p>${p.why}</p>
      </details>
      <a href="${p.link}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  `).join("");
}

/* =========================================================
   RENDER: SKILLS
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
      <ul>${b.items.map(i => `<li>${i}</li>`).join("")}</ul>
    </div>
  `).join("");
}

/* =========================================================
   RENDER: EXPERIENCE
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
   ANIMACIÓN DE SECCIONES
========================================================= */
function setupSectionObserver(){
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  sections.forEach(sec => observer.observe(sec));
}

/* =========================================================
   BOOT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  setCssMouseVars();

  setupLangToggle();
  setupSearch();
  setupContactForm();
  setupSectionObserver();

  loadDict(STATE.lang);
});
