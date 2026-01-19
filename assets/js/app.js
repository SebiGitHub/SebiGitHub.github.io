// Marca que hay JS (para animaciones/hamburguesa sin romper ATS/no-JS)
document.documentElement.classList.add('js');

/* =========================================================
   UTIL: Año dinámico
   ========================================================= */
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* Marca que hay JS (por si quieres fallback CSS) */
document.documentElement.classList.add("js");

/* =========================================================
   I18N: estado + carga diccionario
   ========================================================= */
const STATE = { lang: localStorage.getItem("lang") || "es", dict: {} };

async function loadDict(lang) {
  try {
    const res = await fetch(`assets/i18n/${lang}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`No se pudo cargar ${lang}.json (${res.status})`);

    const json = await res.json();

    STATE.dict = json;
    STATE.lang = lang;
    localStorage.setItem("lang", lang);

    applyI18n();
    updateLangToggleUI();

    console.info(`[i18n] OK -> ${lang}`);
  } catch (e) {
    console.error("[i18n] Error cargando diccionario:", e);
  }
}

function applyI18n() {
  if (!STATE.dict) return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = key.split(".").reduce((o, k) => o?.[k], STATE.dict);
    if (typeof val === "string") el.textContent = val;
  });

  renderAbout();
  renderSkills();
  renderXP();
  renderProjects();

  document.documentElement.lang = STATE.lang;
}

function updateLangToggleUI() {
  document.querySelectorAll(".lang-pill").forEach((p) => {
    const lang = p.getAttribute("data-lang");
    p.classList.toggle("active", lang === STATE.lang);
  });
}

function chipTone(label = "") {
  const l = label.toLowerCase();

  if (l.includes("salesforce") || l.includes("apex")) return "t-salesforce";
  if (l.includes("powerapps") || l.includes("sharepoint")) return "t-powerapps";
  if (l.includes("access") || l.includes("sql")) return "t-data";
  if (l.includes("excel")) return "t-excel";
  if (l.includes("c#") || l.includes(".net") || l.includes("csharp")) return "t-dotnet";
  if (l.includes("kotlin")) return "t-kotlin";
  if (l.includes("python")) return "t-python";
  if (l.includes("javascript")) return "t-js";
  if (l === "java" || l.includes(" java")) return "t-java";
  if (l.includes("vbscript")) return "t-vb";
  if (l === "html") return "t-html";
  if (l === "css") return "t-css";
  if (l.includes("wordpress")) return "t-wp";
  if (l === "git") return "t-git";
  if (l.includes("github")) return "t-github";

  // soft skills
  if (l.includes("comunicación") || l.includes("communication")) return "t-soft-comm";
  if (l.includes("curiosidad") || l.includes("curiosity")) return "t-soft-cur";
  if (l.includes("adaptabilidad") || l.includes("adaptability")) return "t-soft-adapt";
  if (l.includes("orden") || l.includes("organization")) return "t-soft-org";

  return "";
}


document.getElementById("lang-toggle")?.addEventListener("click", () => {
  loadDict(STATE.lang === "es" ? "en" : "es");
});

/* =========================================================
   ABOUT
   ========================================================= */
function renderAbout() {
  const grid = document.getElementById("aboutGrid");
  const chips = document.getElementById("aboutChips");
  const t = STATE.dict;

  if (!grid || !chips || !t?.about) return;

  grid.innerHTML = (t.about.cards || [])
    .map(
      (c) => `
    <article class="card col-4">
      <h3 class="card-title"><i class="${c.icon}"></i><span>${c.title}</span></h3>
      <ul class="bullets">
        ${(c.bullets || []).map((b) => `<li>${b}</li>`).join("")}
      </ul>
    </article>
  `
    )
    .join("");

  chips.innerHTML = (t.about.chips || [])
    .map((ch) => `<span class="chip ${chipTone(ch.label)}"><i class="${ch.icon}"></i>${ch.label}</span>`)
    .join("");
}

/* =========================================================
   SKILLS
   ========================================================= */
function renderSkills() {
  const wrap = document.getElementById("skillsGrid");
  const t = STATE.dict;

  if (!wrap || !t?.skills?.categories) return;

  wrap.innerHTML = (t.skills.categories || [])
    .map(
      (cat) => `
    <article class="card col-6">
      <h3 class="card-title"><i class="${cat.icon}"></i><span>${cat.title}</span></h3>
      <div class="chips">
        ${(cat.items || [])
          .map((it) => `<span class="chip ${chipTone(it.label)}"><i class="${it.icon}"></i>${it.label}</span>
`)
          .join("")}
      </div>
    </article>
  `
    )
    .join("");
}

/* =========================================================
   EXPERIENCE
   ========================================================= */
function renderXP() {
  const tl = document.getElementById("experienceTimeline");
  const t = STATE.dict;

  if (!tl || !t?.xp?.timeline) return;

  tl.innerHTML = (t.xp.timeline || [])
    .map(
      (item) => `
    <div class="t-item">
      <div class="t-dot"></div>
      <div class="t-card">
        <div style="font-weight:900; font-size:1.05rem;">${item.title}</div>
        <div class="t-meta">${item.meta || ""}</div>

        <ul class="bullets" style="margin-top:10px;">
          ${(item.bullets || []).map((b) => `<li>${b}</li>`).join("")}
        </ul>

        <div class="t-tech">
          ${(item.tech || []).map((ic) => `<i class="${ic}"></i>`).join("")}
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

/* =========================================================
   PROJECTS — Carrusel (Opción A)
   ========================================================= */
let PROJECT_INDEX = 0;

function getProjectItems() {
  const proj = STATE.dict?.projects;
  if (!proj) return [];

  return [
    {
      title: proj.p1_title,
      desc: proj.p1_desc,
      why: proj.p1_why,
      link: "https://github.com/SebiGitHub/WEB-DE-PROTOCOLOS-HSJD",
      tech: ["PowerApps", "SharePoint", "VBScript", "Access", "Excel"],
      icon: "fa-solid fa-diagram-project",
      thumbClass: "thumb-powerapps"
    },
    {
      title: proj.p2_title,
      desc: proj.p2_desc,
      why: proj.p2_why,
      link: "https://github.com/SebiGitHub/AvaloniaCatalogoWinForms",
      tech: ["Avalonia", "WinForms", "Visual Studio"],
      icon: "fa-solid fa-cubes-stacked",
      thumbClass: "thumb-desktop"
    },
    {
      title: proj.p3_title,
      desc: proj.p3_desc,
      why: proj.p3_why,
      link: "https://github.com/SebiGitHub/Agenda",
      tech: ["Android", "Kotlin", "SQLite/Room"],
      icon: "fa-solid fa-calendar-days",
      thumbClass: "thumb-android"
    },
    {
      title: proj.p4_title,
      desc: proj.p4_desc,
      why: proj.p4_why,
      link: "https://github.com/SebiGitHub/Realtime-Collaborative-Bingo-Web-App",
      tech: ["Web", "Realtime", "Rooms"],
      icon: "fa-solid fa-users",
      thumbClass: "thumb-realtime"
    },
    {
      title: proj.p5_title,
      desc: proj.p5_desc,
      why: proj.p5_why,
      link: "https://github.com/SebiGitHub/Selenium-end-to-end",
      tech: ["Selenium", "E2E", "Testing"],
      icon: "fa-solid fa-vial-circle-check",
      thumbClass: "thumb-testing"
    },
    {
      title: proj.p6_title,
      desc: proj.p6_desc,
      why: proj.p6_why,
      link: "https://github.com/SebiGitHub/Corrutinas",
      tech: ["Kotlin", "Labs", "Android"],
      icon: "fa-solid fa-flask",
      thumbClass: "thumb-labs",
      cases: proj.p6_cases || []
    }
  ];
}

function clampIndex(i, len) {
  if (len <= 0) return 0;
  return (i + len) % len;
}

function renderProjects() {
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

  const labels = STATE.dict?.projects?.case_labels || {};
  const casesHTML = (p.cases && p.cases.length)
    ? `
      <div class="mini-grid" aria-label="Mini casos">
        ${p.cases.map(c => `
          <article class="mini-card">
            <div class="mini-title">${c.title}</div>
            <div class="mini-row"><span class="mini-k">${labels.problem || "Problema"}:</span> ${c.problem}</div>
            <div class="mini-row"><span class="mini-k">${labels.solution || "Solución"}:</span> ${c.solution}</div>
            <div class="mini-row"><span class="mini-k">${labels.signal || "Señal"}:</span> ${c.signal}</div>
            ${c.link ? `<a class="mini-link" href="${c.link}" target="_blank" rel="noopener noreferrer">Ver repo</a>` : ``}
          </article>
        `).join("")}
      </div>
    `
    : "";

  stage.innerHTML = `
    <div class="card project-card">
      <div class="project-thumb ${p.thumbClass || ""}">
        <i class="project-icon ${p.icon}" aria-hidden="true"></i>
      </div>

      <h3>${p.title}</h3>
      <p>${p.desc}</p>

      <div class="project-psr">
        <div><strong>${STATE.dict.projects.labels.problem}:</strong> ${p.problem}</div>
        <div><strong>${STATE.dict.projects.labels.solution}:</strong> ${p.solution}</div>
        <div><strong>${STATE.dict.projects.labels.result}:</strong> ${p.result}</div>
      </div>

      <div class="tech">
        ${p.tech.map(t => `<span>${t}</span>`).join("")}
      </div>

      ${casesHTML}

      <details>
        <summary>+ info</summary>
        <p>${p.why}</p>
      </details>

      <a href="${p.link}" class="btn" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  `;

  dots.innerHTML = items
    .map(
      (_, idx) => `
    <button class="carousel-dot ${idx === PROJECT_INDEX ? "active" : ""}"
      aria-label="Ir al proyecto ${idx + 1}" data-idx="${idx}"></button>
  `
    )
    .join("");

  dots.querySelectorAll(".carousel-dot").forEach((b) => {
    b.addEventListener("click", () => {
      PROJECT_INDEX = Number(b.getAttribute("data-idx"));
      renderProjects();
    });
  });
}

function setupProjectsCarousel() {
  const prev = document.getElementById("proj-prev");
  const next = document.getElementById("proj-next");
  const stage = document.getElementById("project-stage");
  if (!prev || !next || !stage) return;

  prev.addEventListener("click", () => {
    const items = getProjectItems();
    PROJECT_INDEX = clampIndex(PROJECT_INDEX - 1, items.length);
    renderProjects();
  });

  next.addEventListener("click", () => {
    const items = getProjectItems();
    PROJECT_INDEX = clampIndex(PROJECT_INDEX + 1, items.length);
    renderProjects();
  });

  let x0 = null;
  stage.addEventListener(
    "touchstart",
    (e) => {
      x0 = e.touches?.[0]?.clientX ?? null;
    },
    { passive: true }
  );

  stage.addEventListener(
    "touchend",
    (e) => {
      const x1 = e.changedTouches?.[0]?.clientX ?? null;
      if (x0 == null || x1 == null) return;

      const dx = x1 - x0;
      if (Math.abs(dx) < 60) return;

      const items = getProjectItems();
      PROJECT_INDEX = clampIndex(PROJECT_INDEX + (dx < 0 ? 1 : -1), items.length);
      renderProjects();
      x0 = null;
    },
    { passive: true }
  );
}

/* =========================================================
   CONTACT FORM -> Gmail draft
   ========================================================= */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
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
   MENÚ NAVEGACIÓN (Hamburguesa)
   ========================================================= */
function setupNavMenu(){
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  const overlay = document.getElementById("nav-overlay");
  if(!toggle || !links || !overlay) return;

  const open = ()=>{
    links.classList.add("open");
    overlay.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  };
  const close = ()=>{
    links.classList.remove("open");
    overlay.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", ()=>{
    links.classList.contains("open") ? close() : open();
  });

  overlay.addEventListener("click", close);

  // Cierra al clicar un link
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", close));

  // Esc para cerrar
  window.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") close();
  });
}

function setupHeroSpotlight(){
  const hero = document.getElementById("hero");
  if(!hero) return;

  const onMove = (e)=>{
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    hero.style.setProperty("--hx", `${x}%`);
    hero.style.setProperty("--hy", `${y}%`);
  };

  hero.addEventListener("mousemove", onMove);
  hero.addEventListener("mouseleave", ()=>{
    hero.style.setProperty("--hx", `50%`);
    hero.style.setProperty("--hy", `40%`);
  });
}


/* =========================================================
   ANIMACIÓN SECCIONES
   ========================================================= */
function setupSectionObserver() {
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* Spotlight */
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty("--mx", `${x}%`);
  document.documentElement.style.setProperty("--my", `${y}%`);
});

/* Arranque */
document.addEventListener("DOMContentLoaded", ()=>{
  setupNavMenu();
  setupHeroSpotlight();

  setupSectionObserver();
  setupProjectsCarousel();
  setupContactForm();
  loadDict(STATE.lang);
});
