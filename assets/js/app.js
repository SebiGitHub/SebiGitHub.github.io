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
  document.documentElement.lang = STATE.lang;
}

document.getElementById('lang-toggle')?.addEventListener('click', ()=>{
  loadDict(STATE.lang === 'es' ? 'en' : 'es');
});

loadDict(STATE.lang);
