// पंचायत विवरण पेज — URL से ?name=... पढ़कर सही पंचायत की जानकारी दिखाता है

function fmtNum(n) {
  return typeof n === 'number' ? n.toLocaleString('en-IN') : n;
}

function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const params = new URLSearchParams(window.location.search);
const panchayatName = params.get('name');

const nameEl = document.getElementById('detailName');
const kickerEl = document.getElementById('detailKicker');
const bodyEl = document.getElementById('detailBody');

var SITE = window.SITE_BASE || './';

if (!nameEl || !bodyEl) {
  // DOM elements missing — page structure broken
} else if (!panchayatName) {
  nameEl.textContent = 'पंचायत नहीं मिली';
  bodyEl.innerHTML = '<p>कोई पंचायत नाम नहीं दिया गया। कृपया <a href="' + SITE + 'index.html#panchayats">निर्देशिका</a> से किसी पंचायत को चुनें।</p>';
} else {
  nameEl.textContent = panchayatName;

  Promise.all([
    fetch((window.SITE_BASE || './') + 'data/panchayats.json').then(r => r.json()),
    fetch((window.SITE_BASE || './') + 'data/panchayat-details.json').then(r => r.json()).catch(() => ({}))
  ]).then(([names, details]) => {
    const idx = names.findIndex(n => n.toLowerCase() === panchayatName.toLowerCase());
    if (kickerEl) {
      kickerEl.textContent = idx >= 0 ? ('पंचायत #' + (idx + 1)) : 'पंचायत';
    }

    const info = details[panchayatName];

    if (!info) {
      bodyEl.innerHTML = `
        <div class="section-head">
          <span class="kicker">इस पंचायत के बारे में</span>
          <h2>क्या खास है</h2>
        </div>
        <div class="fill-banner">
          इस पंचायत की जानकारी अभी उपलब्ध नहीं है। data/panchayat-details.json में
          "${escapeHTML(panchayatName)}" के नाम से एक एंट्री जोड़कर जानकारी भरी जा सकती है।
        </div>
        <p class="mt-20"><a
        class="directory-back-link"
        href="${SITE}index.html#panchayats"> पूरी पंचायत निर्देशिका देखें</a></p>
      `;
      return;
    }

    const statRow = (label, val) => val !== undefined ? `
      <div class="mini"><span>${escapeHTML(label)}</span><span>${escapeHTML(String(val))}</span></div>
    ` : '';

    bodyEl.innerHTML = `
      <div class="section-head">
        <span class="kicker">इस पंचायत के बारे में</span>
        <h2>क्या खास है</h2>
        ${info.about ? `<p>${escapeHTML(info.about)}</p>` : ''}
      </div>

      <div class="card-grid mb-32">
        <div class="card marigold">
          <h3>बुनियादी जानकारी</h3>
          ${statRow('तहसील', info.tehsil)}
          ${statRow('ज़िला', info.district)}
          ${statRow('पिन कोड', info.pincode)}
          ${statRow('ऊँचाई', info.elevation_m ? info.elevation_m + ' मीटर' : undefined)}
          ${statRow('जशपुर से दूरी', info.distance_from_jashpur_km ? info.distance_from_jashpur_km + ' किमी' : undefined)}
        </div>
        <div class="card leaf-card">
          <h3>जनगणना (2011)</h3>
          ${statRow('कुल जनसंख्या', fmtNum(info.population_total))}
          ${statRow('पुरुष', fmtNum(info.population_male))}
          ${statRow('महिला', fmtNum(info.population_female))}
          ${statRow('साक्षरता दर', info.literacy_rate)}
          ${statRow('कुल घर', fmtNum(info.houses))}
          ${statRow('क्षेत्रफल', info.area_hectares ? info.area_hectares + ' हेक्टेयर' : undefined)}
        </div>
      </div>

      ${info.highlights && info.highlights.length ? `
        <div class="section-head">
          <span class="kicker">खास बातें</span>
          <h2>यहाँ क्या देखें / जानें</h2>
        </div>
        <ul class="highlight-list">
          ${info.highlights.map(h => `<li>${escapeHTML(h)}</li>`).join('')}
        </ul>
      ` : ''}

      ${info.contact ? `
        <div class="fill-banner mt-24">
          <strong>संपर्क:</strong> सरपंच — ${escapeHTML(info.contact.sarpanch || 'Coming Soon')}
          ${info.contact.phone ? ' · फोन: ' + escapeHTML(info.contact.phone) : ''}
        </div>
      ` : ''}

      ${info.specialty_note ? `<p class="specialty-note">${escapeHTML(info.specialty_note)}</p>` : ''}

      <p class="mt-28"><a
      class="directory-back-link"
      href="${SITE}index.html#panchayats">पूरी पंचायत निर्देशिका देखें</a></p>
    `;
  }).catch(err => {
    bodyEl.innerHTML = '<p>जानकारी लोड करने में समस्या हुई।</p>';
    console.error('detail load error:', err);
  });
}
