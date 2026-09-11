// ===============================
// MODERN MOBILE MENU
// ===============================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", () => {

    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

  });

  mainNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });
}

// पंचायत निर्देशिका — हर पंचायत अब क्लिक करने पर उसका अपना पेज खोलती है
const grid = document.getElementById('ledgerGrid');
const countEl = document.getElementById('ledgerCount');
const searchEl = document.getElementById('panchayatSearch');

if (grid && countEl && searchEl) {
  var SITE = window.SITE_BASE || './';

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function render(list) {
    if (!grid || !countEl) return;
    grid.innerHTML = '';
    if (list.length === 0) {
      grid.innerHTML = '<div class="no-results">कोई पंचायत नहीं मिली। कृपया अलग नाम से खोजें।</div>';
      countEl.textContent = '0 पंचायत';
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(item => {
      const row = document.createElement('a');
      row.className = 'panchayat-row';
      row.href = SITE + 'pages/panchayat.html?name=' + encodeURIComponent(item.name);
      row.innerHTML = `<span class="panchayat-num">${item.i}</span><span class="panchayat-name">${esc(item.name)}</span>`;
      frag.appendChild(row);
    });
    grid.appendChild(frag);
    countEl.textContent = list.length + ' पंचायत';
  }

  fetch(SITE + 'data/panchayats.json')
    .then(res => res.json())
    .then(names => {
      const indexed = names.map((name, idx) => ({ i: idx + 1, name }));
      render(indexed);

      searchEl.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        const filtered = q === '' ? indexed : indexed.filter(v => v.name.toLowerCase().includes(q));
        render(filtered);
      });
    })
    .catch(err => {
      grid.innerHTML = '<div class="no-results">पंचायत सूची लोड नहीं हो पाई। data/panchayats.json जाँचें।</div>';
      console.error('panchayats.json load error:', err);
    });
}
