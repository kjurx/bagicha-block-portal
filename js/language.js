// ===============================
// LANGUAGE SYSTEM + SELECTOR
// ===============================

let currentLanguage = localStorage.getItem("bagichaLanguage") || "hindi";
let languageData = {};

window.__lang = {
  get: () => languageData,
  current: () => currentLanguage
};

async function loadLanguages() {
  try {
    const response = await fetch((window.SITE_BASE || './') + "data/languages.json");
    if (!response.ok) throw new Error("languages.json load nahi hua");
    languageData = await response.json();
    if (!languageData[currentLanguage]) {
      currentLanguage = "hindi";
      localStorage.setItem("bagichaLanguage", "hindi");
    }
  } catch (error) {
    console.error("Language loading error:", error);
  }
}

const languageSelector = document.getElementById("languageSelector");
const languageButton = document.getElementById("languageButton");
const currentLanguageLabel = document.getElementById("currentLanguage");
const languageOptions = document.querySelectorAll("[data-language]");

if (languageButton && languageSelector) {
  languageButton.addEventListener("click", () => {
    const isOpen = languageSelector.classList.toggle("open");
    languageButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  languageOptions.forEach(button => {
    button.addEventListener("click", () => {
      currentLanguage = button.dataset.language;
      localStorage.setItem("bagichaLanguage", currentLanguage);
      currentLanguageLabel.textContent = button.textContent;
      languageSelector.classList.remove("open");
      languageButton.setAttribute("aria-expanded", "false");
      applyLanguage(currentLanguage);
    });
  });

  document.addEventListener("click", event => {
    if (!languageSelector.contains(event.target)) {
      languageSelector.classList.remove("open");
      languageButton.setAttribute("aria-expanded", "false");
    }
  });
}

function applyLanguage(lang) {
  const translations = languageData[lang];
  if (!translations) return;

  const langMap = { hindi: 'hi', english: 'en', hinglish: 'hi', kurukh: 'sat', sadri: 'sat', chhattisgarhi: 'hi' };
  document.documentElement.lang = langMap[lang] || 'hi';

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (Object.prototype.hasOwnProperty.call(translations, key) && translations[key]) {
      el.textContent = translations[key];
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    const key = el.dataset.i18nAria;
    if (Object.prototype.hasOwnProperty.call(translations, key) && translations[key]) {
      el.setAttribute("aria-label", translations[key]);
    }
  });

  if (window.__refreshDynamicLabels) window.__refreshDynamicLabels();
  if (window.__refreshNetworkLabel) window.__refreshNetworkLabel();
}

loadLanguages().then(() => {
  const savedButton = document.querySelector(`[data-language="${currentLanguage}"]`);
  if (savedButton) {
    currentLanguageLabel.textContent = savedButton.textContent;
  }
  applyLanguage(currentLanguage);
});
