// नेटवर्क कवरेज इंडिकेटर (सिर्फ panchayat.html)
// Mobile phone ke network indicator jaisa — sirf current panchayat (?name) ke
// available operators data/network.json से पढ़कर दिखाता है। Data न हो तो छुपा रहता है।

(function () {
  const container = document.getElementById('networkIndicator');
  if (!container) return;

  const SITE = window.SITE_BASE || './';
  const params = new URLSearchParams(window.location.search);
  const currentName = params.get('name');
  if (!currentName) {
    container.style.display = 'none';
    return;
  }

  function netTitle() {
    if (window.__lang) {
      const data = window.__lang.get();
      const lang = window.__lang.current();
      if (data && data[lang] && data[lang].network_coverage) return data[lang].network_coverage;
    }
    return 'नेटवर्क कवरेज';
  }

  window.__refreshNetworkLabel = () => {
    const title = container.querySelector('.net-title');
    if (title) title.textContent = netTitle();
  };

  fetch(SITE + 'data/network.json')
    .then(r => {
      if (!r.ok) throw new Error('network.json load nahi hua');
      return r.json();
    })
    .catch(() => ({ network: {} }))
    .then(data => {
      const coverage = data.network || {};
      const key = Object.keys(coverage).find(k => k.toLowerCase() === currentName.toLowerCase());
      const ops = key ? coverage[key] : null;

      if (!ops || !ops.length) {
        container.style.display = 'none';
        return;
      }

      container.innerHTML = '';
      const title = document.createElement('span');
      title.className = 'net-title';
      title.textContent = netTitle();
      container.appendChild(title);

      const list = document.createElement('span');
      list.className = 'net-list';
      container.appendChild(list);

      ops.forEach(op => {
        const badge = document.createElement('span');
        badge.className = 'net-badge';
        badge.textContent = op;
        list.appendChild(badge);
      });
    });
})();