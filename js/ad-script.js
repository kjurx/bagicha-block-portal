// ===============================
// Advertisement Slider
// ===============================

const adSlides = document.getElementById("adSlides");
const adDots = document.getElementById("adDots");
const adPrev = document.getElementById("adPrev");
const adNext = document.getElementById("adNext");
const adFallback = document.getElementById("adBannerFallback");

let ads = [];
let currentAd = 0;
let adTimer = null;

function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function loadAds() {
  try {
    const response = await fetch((window.SITE_BASE || './') + "data/ads.json");

    if (!response.ok) {
      throw new Error("ads.json load failed");
    }

    const data = await response.json();
    ads = data.ads || [];

    if (!ads.length) {
      showFallback();
      return;
    }

    renderAds();
    showAd(0, 'next');
    startAutoPlay();

  } catch (error) {
    console.error("Advertisement error:", error);
    showFallback();
  }
}

function adDotLabel(index) {
  let label = 'विज्ञापन';
  if (window.__lang) {
    const data = window.__lang.get();
    const lang = window.__lang.current();
    if (data && data[lang] && data[lang].ad_label) label = data[lang].ad_label;
  }
  return label + ' ' + (index + 1);
}

window.__refreshDynamicLabels = () => {
  document.querySelectorAll('.ad-dot').forEach(dot => {
    dot.setAttribute('aria-label', adDotLabel(Number(dot.dataset.index || 0)));
  });
};

function renderAds() {
  adSlides.innerHTML = "";
  adDots.innerHTML = "";

  ads.forEach((ad, index) => {

    const slide = document.createElement("a");

    slide.className = "ad-slide";

    const rawLink = String(ad.link || "").trim();
    const safeLink =
      /^(https?:\/\/|\.\/|\/)/i.test(rawLink) ? rawLink : "#";
    slide.href = safeLink;

    slide.innerHTML = `
      <img src="${escapeHTML(ad.image)}" alt="${escapeHTML(ad.alt || "विज्ञापन")}">
    `;

    adSlides.appendChild(slide);

    const dot = document.createElement("button");

    dot.className = "ad-dot";
    dot.dataset.index = index;
    dot.setAttribute("aria-label", adDotLabel(index));

    dot.addEventListener("click", () => {
      const direction = index >= currentAd ? "next" : "prev";
      showAd(index, direction);
      restartAutoPlay();
    });

    adDots.appendChild(dot);
  });
}

function showAd(index, direction = "next") {
  if (!ads.length) return;

  const slides = document.querySelectorAll(".ad-slide");
  if (!slides.length) return;

  const nextIndex = (index + ads.length) % ads.length;
  const previousIndex = currentAd;

  currentAd = nextIndex;

  slides.forEach((slide, i) => {
    slide.classList.remove("active", "slide-in-right", "slide-in-left", "slide-out-left", "slide-out-right");

    if (i === currentAd) {
      slide.classList.add(direction === "prev" ? "slide-in-left" : "slide-in-right");
      // Force the animation to start from the correct side.
      void slide.offsetWidth;
      slide.classList.add("active");
    } else if (i === previousIndex) {
      slide.classList.add(direction === "prev" ? "slide-out-right" : "slide-out-left");
    }
  });

  document.querySelectorAll(".ad-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentAd);
  });

  if (adFallback) {
    adFallback.style.display = "none";
  }
}

function nextAd() {
  showAd(currentAd + 1, "next");
}

function prevAd() {
  showAd(currentAd - 1, "prev");
}

function startAutoPlay() {
  clearInterval(adTimer);

  adTimer = setInterval(() => {
    nextAd();
  }, 4500);
}

function restartAutoPlay() {
  startAutoPlay();
}

function showFallback() {
  if (adFallback) {
    adFallback.style.display = "flex";
  }
}

if (adNext) {
  adNext.addEventListener("click", () => {
    nextAd();
    restartAutoPlay();
  });
}

if (adPrev) {
  adPrev.addEventListener("click", () => {
    prevAd();
    restartAutoPlay();
  });
}

const adBannerSlot = document.getElementById("adBannerSlot");
if (adBannerSlot) {
  adBannerSlot.addEventListener("mouseenter", () => clearInterval(adTimer));
  adBannerSlot.addEventListener("mouseleave", startAutoPlay);
}

loadAds();