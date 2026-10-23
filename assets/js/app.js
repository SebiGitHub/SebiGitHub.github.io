document.documentElement.classList.add("js");

const escapeHTML = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const getSavedLanguage = () => {
  try {
    return localStorage.getItem("portfolio-language") === "en" ? "en" : "es";
  } catch {
    return "es";
  }
};

const state = { lang: getSavedLanguage(), dictionary: null, request: 0 };
const valueAt = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);

function setStaticCopy() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = valueAt(state.dictionary, element.dataset.i18n);
    if (typeof value === "string") element.textContent = value;
  });

  document.documentElement.lang = state.lang;
  document.title = state.dictionary.meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", state.dictionary.meta.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", state.dictionary.meta.title);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", state.dictionary.meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", state.dictionary.meta.description);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", state.dictionary.meta.description);

  const resume = `assets/cv/CV_Sebastian_Exposito_Ruiz_${state.lang.toUpperCase()}.pdf`;
  document.querySelectorAll("[data-current-resume]").forEach((link) => { link.href = resume; });
  document.querySelectorAll(".lang-toggle [data-lang]").forEach((pill) => {
    pill.classList.toggle("is-active", pill.dataset.lang === state.lang);
  });
}

function renderFeaturedProjects() {
  const container = document.getElementById("featured-projects");
  if (!container) return;

  container.innerHTML = state.dictionary.featured.map((project) => {
    const facts = project.facts.map(([label, text]) => `<li><b>${escapeHTML(label)}</b><span>${escapeHTML(text)}</span></li>`).join("");
    const links = project.links.map(([label, href]) => `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`).join("");
    return `<article class="featured-project">
      <div class="project-media"><img src="${escapeHTML(project.image)}" width="960" height="480" decoding="async" alt="${escapeHTML(project.image_alt)}"></div>
      <div class="project-body">
        <p class="project-index">${escapeHTML(project.index)}</p>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.summary)}</p>
        <ul class="project-facts">${facts}</ul>
        <div class="project-links">${links}</div>
      </div>
    </article>`;
  }).join("");
}

function renderArchive() {
  const container = document.getElementById("project-archive");
  if (!container) return;

  container.innerHTML = state.dictionary.archive.items.map(([title, description, href]) => `
    <a class="archive-item" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">
      <span><h4>${escapeHTML(title)}</h4><p>${escapeHTML(description)}</p></span><span aria-hidden="true">↗</span>
    </a>`).join("");
}

function renderProfile() {
  const principles = document.getElementById("principles");
  const capabilities = document.getElementById("capability-list");
  if (principles) {
    principles.innerHTML = state.dictionary.profile.principles.map(([title, description]) => `
      <li><span><strong>${escapeHTML(title)}</strong><p>${escapeHTML(description)}</p></span></li>`).join("");
  }
  if (capabilities) {
    capabilities.innerHTML = state.dictionary.capabilities.items.map(([label, description]) => `
      <div class="capability-item"><strong>${escapeHTML(label)}</strong><span>${escapeHTML(description)}</span></div>`).join("");
  }
}

function renderTimeline() {
  const container = document.getElementById("timeline");
  if (!container) return;
  container.innerHTML = state.dictionary.trajectory.items.map(([title, description, date]) => `
    <article class="timeline-item"><span class="timeline-dot" aria-hidden="true"></span><div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(description)}</p></div><time class="timeline-date">${escapeHTML(date)}</time></article>`).join("");
}

function renderContent() {
  setStaticCopy();
  renderFeaturedProjects();
  renderArchive();
  renderProfile();
  renderTimeline();
}

async function loadLanguage(language) {
  const request = ++state.request;
  try {
    const response = await fetch(`assets/i18n/${language}.json`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${language}`);
    const dictionary = await response.json();
    if (request !== state.request) return;
    state.lang = language;
    state.dictionary = dictionary;
    try { localStorage.setItem("portfolio-language", language); } catch { /* Storage is optional. */ }
    renderContent();
    document.documentElement.classList.add("content-ready");
  } catch (error) {
    console.error("[portfolio] Translation loading failed", error);
    document.documentElement.classList.add("content-ready");
  }
}

function setupMenu() {
  const button = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  const overlay = document.getElementById("nav-overlay");
  if (!button || !links || !overlay) return;

  const close = () => {
    links.classList.remove("is-open");
    overlay.hidden = true;
    button.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    links.classList.add("is-open");
    overlay.hidden = false;
    button.setAttribute("aria-expanded", "true");
  };
  button.addEventListener("click", () => links.classList.contains("is-open") ? close() : open());
  overlay.addEventListener("click", close);
  links.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && links.classList.contains("is-open")) {
      close();
      button.focus();
    }
  });
}

function setupSectionObserver() {
  const elements = document.querySelectorAll(".section, .resume-banner, .contact");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  setupMenu();
  setupSectionObserver();
  document.getElementById("lang-toggle")?.addEventListener("click", () => {
    loadLanguage(state.lang === "es" ? "en" : "es");
  });
  loadLanguage(state.lang);
});
