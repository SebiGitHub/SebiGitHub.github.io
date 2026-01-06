// año del footer
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// estado de idioma
const STATE = { lang: localStorage.getItem('lang') || 'es', dict: {} };

// carga JSON de idioma
async function loadDict(lang){
  try {
    const res = await fetch(`assets/i18n/${lang}.json`);
    const json = await res.json();
    STATE.dict = json;
    STATE.lang = lang;
    localStorage.setItem('lang', lang);
    applyI18n();
  } catch (e) {
    console.error('Error cargando diccionario', e);
  }
}

// aplica textos + re-renderiza secciones
function applyI18n(){
  if (!STATE.dict || !STATE.dict.nav) {
    // aún no se ha cargado bien el JSON
    return;
  }

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const val = key.split('.').reduce((o,k)=>o?.[k], STATE.dict);
    if (typeof val === 'string') el.textContent = val;
  });

  renderSkills();
  renderProjects();
  renderXP();
  renderServices();
  document.documentElement.lang = STATE.lang;
}

// toggle ES/EN
document.getElementById('lang-toggle')?.addEventListener('click', ()=>{
  loadDict(STATE.lang === 'es' ? 'en' : 'es');
});

// === RENDER PROYECTOS ===
function renderProjects(){
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  if (!STATE.dict || !STATE.dict.projects) {
    console.warn('Projects aún no disponible en STATE.dict');
    return;
  }

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
      <div class="project-thumb">
        <span>${p.emoji}</span>
      </div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="tech">${p.tech.map(t => `<span>${t}</span>`).join("")}</div>
      <details>
        <summary>+ info</summary>
        <p>${p.why}</p>
      </details>
      <a href="${p.link}" class="btn" target="_blank">GitHub</a>
    </div>
  `).join("");
}

// === RENDER SKILLS ===
function renderSkills(){
  const grid = document.getElementById("skills-grid");
  if (!grid || !STATE.dict.skills) return;

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

// === RENDER EXPERIENCIA ===
function renderXP(){
  const container = document.getElementById("xp-list");
  if (!container || !STATE.dict.xp) return;

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

// === RENDER SERVICIOS ===
function renderServices(){
  const container = document.getElementById("services-list");
  if (!container || !STATE.dict.services) return;

  const s = STATE.dict.services;
  const items = [
    { icon: "⚙️", title: s.s1_title, body: s.s1_body },
    { icon: "🖥️", title: s.s2_title, body: s.s2_body },
    { icon: "🛠️", title: s.s3_title, body: s.s3_body }
  ];

  container.innerHTML = items.map(i => `
    <div class="card service-card">
      <div class="service-icon">${i.icon}</div>
      <h3>${i.title}</h3>
      <p>${i.body}</p>
    </div>
  `).join("");
}

// === ANIMACIÓN DE SECCIONES ===
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

// arranque
document.addEventListener("DOMContentLoaded", ()=>{
  setupSectionObserver();
  loadDict(STATE.lang);
});

// Spotlight: mueve variables CSS con el ratón
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  document.documentElement.style.setProperty("--mx", `${x}%`);
  document.documentElement.style.setProperty("--my", `${y}%`);
});
