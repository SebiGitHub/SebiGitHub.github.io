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
      tech: ["PowerApps", "SharePoint", "VBScript", "Access", "Excel"]
    },
    {
      title: STATE.dict.projects.p2_title,
      desc: STATE.dict.projects.p2_desc,
      why: STATE.dict.projects.p2_why,
      link: "https://github.com/SebiGitHub/AvaloniaCatalogoWinForms.git",
      tech: ["Avalonia", "WinForms", "Visual Studio"]
    },
    {
      title: STATE.dict.projects.p3_title,
      desc: STATE.dict.projects.p3_desc,
      why: STATE.dict.projects.p3_why,
      link: "https://github.com/SebiGitHub/PokedexBuscador.git",
      tech: ["Android Studio", "Kotlin", "PokeAPI"]
    }
  ];

  grid.innerHTML = items.map(p => `
    <div class="card project-card">
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

document.addEventListener("DOMContentLoaded", ()=>{
  applyI18n();
  renderProjects();
});

