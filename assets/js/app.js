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

function setupTabs(container, selector, select) {
  const tabs = Array.from(container.querySelectorAll(selector));
  tabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (event) => {
      const last = tabs.length - 1;
      let next = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index === last ? 0 : index + 1;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index === 0 ? last : index - 1;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = last;
      if (next === null) return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });
}

function renderProjectMedia(project) {
  const items = Array.isArray(project.media?.items) && project.media.items.length
    ? project.media.items
    : [["Preview", project.image, project.image_alt]];
  const label = project.media?.label || project.title;
  const id = `project-media-${project.id}`;
  const images = items.map(([name, source, alt], index) => `<img class="${index === 0 ? "is-active" : ""}" src="${escapeHTML(source)}" width="1600" height="1000" loading="lazy" decoding="async" alt="${escapeHTML(alt)}">`).join("");
  const controls = items.map(([name], index) => `<button class="project-media-control" id="${id}-tab-${index}" type="button" data-media-index="${index}" role="tab" aria-selected="${index === 0}" aria-controls="${id}-panel" tabindex="${index === 0 ? "0" : "-1"}">${escapeHTML(name)}</button>`).join("");
  return `<figure class="project-media" data-project-media>
    <div class="project-media-stage" id="${id}-panel" role="tabpanel" tabindex="0" aria-labelledby="${id}-tab-0">${images}</div>
    ${items.length > 1 ? `<div class="project-media-controls" role="tablist" aria-label="${escapeHTML(label)}">${controls}</div>` : ""}
    <figcaption class="project-media-caption" aria-live="polite">${escapeHTML(items[0][2])}</figcaption>
  </figure>`;
}

function setupProjectMedia() {
  document.querySelectorAll("[data-project-media]").forEach((media) => {
    const images = Array.from(media.querySelectorAll("img"));
    const caption = media.querySelector(".project-media-caption");
    const select = (index) => {
      images.forEach((image, imageIndex) => image.classList.toggle("is-active", imageIndex === index));
      media.querySelectorAll("[data-media-index]").forEach((control) => {
        const isActive = Number(control.dataset.mediaIndex) === index;
        control.setAttribute("aria-selected", String(isActive));
        control.tabIndex = isActive ? 0 : -1;
      });
      if (caption && images[index]) caption.textContent = images[index].alt;
      const panel = media.querySelector('[role="tabpanel"]');
      const activeControl = media.querySelector(`[data-media-index="${index}"]`);
      if (panel && activeControl) panel.setAttribute("aria-labelledby", activeControl.id);
    };
    media.querySelectorAll("[data-media-index]").forEach((control) => {
      const selectCurrent = () => select(Number(control.dataset.mediaIndex));
      control.addEventListener("click", selectCurrent);
      control.addEventListener("focus", selectCurrent);
      control.addEventListener("pointerenter", selectCurrent);
    });
    setupTabs(media, "[data-media-index]", select);
  });
}

function renderFeaturedProjects() {
  const container = document.getElementById("featured-projects");
  if (!container) return;

  container.innerHTML = state.dictionary.featured.map((project) => {
    const facts = project.facts.map(([label, text]) => `<li><b>${escapeHTML(label)}</b><span>${escapeHTML(text)}</span></li>`).join("");
    const links = project.links.map(([label, href]) => `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`).join("");
    return `<article class="featured-project">
      ${renderProjectMedia(project)}
      <div class="project-body">
        <p class="project-index">${escapeHTML(project.index)}</p>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.summary)}</p>
        <ul class="project-facts">${facts}</ul>
        <div class="project-links">${links}</div>
      </div>
    </article>`;
  }).join("");
  setupProjectMedia();
}

function renderHeroProcess() {
  const container = document.getElementById("hero-process");
  const detail = document.getElementById("process-detail");
  const hint = document.querySelector(".process-hint");
  const process = state.dictionary.hero?.process;
  if (!container || !detail || !process?.steps?.length) return;

  container.setAttribute("role", "tablist");
  container.setAttribute("aria-label", process.label);
  container.innerHTML = `${process.steps.map(([title], index) => `<button class="process-step ${index === 0 ? "is-active" : ""}" id="process-tab-${index}" type="button" data-process-index="${index}" role="tab" aria-selected="${index === 0}" aria-controls="process-detail" tabindex="${index === 0 ? "0" : "-1"}"><span class="process-dot"></span><span>${escapeHTML(title)}</span></button>`).join("")}<div class="process-core" aria-hidden="true"><img src="assets/img/brand-mark.svg" width="86" height="86" alt=""></div>`;
  detail.textContent = process.steps[0][1];
  detail.setAttribute("role", "tabpanel");
  detail.setAttribute("tabindex", "0");
  detail.setAttribute("aria-labelledby", "process-tab-0");
  if (hint) hint.textContent = process.hint;
  const select = (index) => {
    const [, description] = process.steps[index] || [];
    if (!description) return;
    container.querySelectorAll("[data-process-index]").forEach((step) => {
      const isActive = Number(step.dataset.processIndex) === index;
      step.classList.toggle("is-active", isActive);
      step.setAttribute("aria-selected", String(isActive));
      step.tabIndex = isActive ? 0 : -1;
    });
    detail.textContent = description;
    detail.setAttribute("aria-labelledby", `process-tab-${index}`);
  };
  container.querySelectorAll("[data-process-index]").forEach((step) => {
    const selectCurrent = () => select(Number(step.dataset.processIndex));
    step.addEventListener("click", selectCurrent);
    step.addEventListener("focus", selectCurrent);
    step.addEventListener("pointerenter", selectCurrent);
  });
  setupTabs(container, "[data-process-index]", select);
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
  renderHeroProcess();
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

  const close = ({ restoreFocus = false } = {}) => {
    links.classList.remove("is-open");
    overlay.hidden = true;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menú");
    if (restoreFocus) button.focus();
  };
  const open = () => {
    links.classList.add("is-open");
    overlay.hidden = false;
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Cerrar menú");
    links.querySelector("a, button")?.focus();
  };
  button.addEventListener("click", () => links.classList.contains("is-open") ? close({ restoreFocus: true }) : open());
  overlay.addEventListener("click", () => close({ restoreFocus: true }));
  links.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && links.classList.contains("is-open")) {
      close({ restoreFocus: true });
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
