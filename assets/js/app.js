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
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const val = key.split('.').reduce((o,k)=>o?.[k], STATE.dict);
    if (typeof val === 'string') el.textContent = val;
  });
  renderSkills();
  renderProjects();
  document.documentElement.lang = STATE.lang;
}

document.getElementById('lang-toggle')?.addEventListener('click', ()=>{
  loadDict(STATE.lang === 'es' ? 'en' : 'es');
});

loadDict(STATE.lang);

function renderProjects(){
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  const items = [
    {
      title: STATE.dict.projects.p1_title,
      desc: STATE.dict.projects.p1_desc,
      why: STATE.dict.projects.p1_why,
      link: "https://github.com/SebiGitHub/WEB-DE-PROTOCOLOS-HSJD.git",
      tech: ["PowerApps", "SharePoint", "VBScript", "Access", "Excel"],
      emoji: "🧩"
    },
    {
      title: STATE.dict.projects.p2_title,
      desc: STATE.dict.projects.p2_desc,
      why: STATE.dict.projects.p2_why,
      link: "https://github.com/SebiGitHub/AvaloniaCatalogoWinForms.git",
      tech: ["Avalonia", "WinForms", "Visual Studio"],
      emoji: "🪄"
    },
    {
      title: STATE.dict.projects.p3_title,
      desc: STATE.dict.projects.p3_desc,
      why: STATE.dict.projects.p3_why,
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


document.addEventListener("DOMContentLoaded", ()=>{
  applyI18n();
  renderProjects();
});

