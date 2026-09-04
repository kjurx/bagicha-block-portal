// ===============================
// SITE BASE PATH RESOLVER
// ===============================
// Har page se same relative path se data/asset load karne ke liye
// site root ki absolute location nikalta hai. Ye file sabse pehle load honi chahiye.

(function () {
  var src = (document.currentScript && document.currentScript.src) || '';
  var base = '';
  if (src) {
    base = src.replace(/\/js\/paths\.js(\?.*)?$/, '');
  }
  window.SITE_BASE = base ? base + '/' : './';
})();