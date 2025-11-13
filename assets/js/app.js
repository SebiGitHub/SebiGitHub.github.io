const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const STATE = { lang: localStorage.getItem('lang') || 'es', dict: {} };

async function loadDict(lang){
  const res = await fetch(`assets/i18n/${lang}.json`);
  STATE.dict = await res.json();
  STATE.lang = lang;
  localStorage.setItem('lang', lang);
  applyI18n();
}

function applyI18n(){
  if (!STATE.dict || !STATE.dict.nav) return; // aún no se ha cargado el JSON

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


document.getElementById('lang-toggle')?.addEventListener('click', ()=>{
  loadDict(STATE.lang === 'es' ? 'en' : 'es');
});


function renderProjects(){
  const grid = document.getElementById("projects-grid");
  if (!grid || !STATE.dict || !STATE.dict.projects) return;

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


function renderSkills(){
  const grid = document.getElementById("skills-grid");
  if (!grid || !STATE.dict.skills) return;

  const blocks = [
    {
      title: STATE.dict.skills.dev_title,
      items: STATE.dict.skills.dev_items
    },
    {
      title: STATE.dict.skills.web_title,
      items: STATE.dict.skills.web_items
    },
    {
      title: STATE.dict.skills.data_title,
      items: STATE.dict.skills.data_items
    },
    {
      title: STATE.dict.skills.soft_title,
      items: STATE.dict.skills.soft_items
    }
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

function renderXP(){
  const container = document.getElementById("xp-list");
  if (!container || !STATE.dict.xp) return;

  const items = [
    {
      title: STATE.dict.xp.xp1_title,
      body: STATE.dict.xp.xp1_body
    },
    {
      title: STATE.dict.xp.xp2_title,
      body: STATE.dict.xp.xp2_body
    },
    {
      title: STATE.dict.xp.xp3_title,
      body: STATE.dict.xp.xp3_body
    }
  ];

  container.innerHTML = items.map(i => `
    <div class="card xp-card">
      <h3>${i.title}</h3>
      <p>${i.body}</p>
    </div>
  `).join("");

  const certs = document.getElementById("services-list");
}

function renderServices(){
  const container = document.getElementById("services-list");
  if (!container || !STATE.dict.services) return;

  const items = [
    {
      icon: "⚙️",
      title: STATE.dict.services.s1_title,
      body: STATE.dict.services.s1_body
    },
    {
      icon: "🖥️",
      title: STATE.dict.services.s2_title,
      body: STATE.dict.services.s2_body
    },
    {
      icon: "🛠️",
      title: STATE.dict.services.s3_title,
      body: STATE.dict.services.s3_body
    }
  ];

  container.innerHTML = items.map(i => `
    <div class="card service-card">
      <div class="service-icon">${i.icon}</div>
      <h3>${i.title}</h3>
      <p>${i.body}</p>
    </div>
  `).join("");
}

function setupSectionObserver(){
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18
  });

  sections.forEach(sec => observer.observe(sec));
}

document.addEventListener("DOMContentLoaded", ()=>{
  loadDict(STATE.lang);
  setupSectionObserver();
});

