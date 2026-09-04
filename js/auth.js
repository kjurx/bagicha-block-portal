// ===============================
// USER AUTHENTICATION (localStorage based)
// ===============================
// Is static site me server nahi hai, isliye users device ke browser ke
// localStorage me save hote hain. Password plain text me nahi, hashed form me rakha jata hai.

const AUTH_STORAGE = "bagichaUsers";
const AUTH_SESSION = "bagichaSession";

function hashPassword(str) {
  const salt = "bagicha_salt_v1::";
  str = salt + str;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16) + (h1 >>> 0).toString(16);
}

function getUsers() {
  try {
    const list = JSON.parse(localStorage.getItem(AUTH_STORAGE)) || [];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveUsers(list) {
  localStorage.setItem(AUTH_STORAGE, JSON.stringify(list));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_SESSION));
  } catch (e) {
    return null;
  }
}

function setSession(user) {
  localStorage.setItem(AUTH_SESSION, JSON.stringify({ name: user.name, email: user.email }));
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION);
}

function isLoggedIn() {
  return !!getSession();
}

function currentUser() {
  return getSession();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Register: success => { ok:true }, fail => { ok:false, error:"..." }
function authRegister(name, email, password) {
  name = (name || '').trim();
  email = (email || '').trim().toLowerCase();

  if (name.length < 2) return { ok: false, error: "कृपया अपना पूरा नाम लिखें।" };
  if (!validateEmail(email)) return { ok: false, error: "ईमेल का format सही नहीं है।" };
  if (password.length < 4) return { ok: false, error: "पासवर्ड कम से कम 4 अक्षर का होना चाहिए।" };

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    return { ok: false, error: "इस ईमेल से पहले से एक खाता मौजूद है। Login " + "करें।" };
  }

  users.push({
    name: name,
    email: email,
    pass: hashPassword(password),
    createdAt: new Date().toISOString()
  });
  saveUsers(users);
  return { ok: true };
}

// Login: success => { ok:true }, fail => { ok:false, error:"..." }
function authLogin(email, password) {
  email = (email || '').trim().toLowerCase();
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return { ok: false, error: "ईमेल या पासवर्ड गलत है।" };
  if (user.pass !== hashPassword(String(password))) return { ok: false, error: "ईमेल या पासवर्ड गलत है।" };
  setSession(user);
  return { ok: true };
}

function authLogout() {
  clearSession();
}

// ===============================
// HEADER AUTH UI
// ===============================
// Har page ke header me <div data-auth></div> hota hai.
// Looged-in user => welcome chip + logout, ander => Login/Sign Up links.

function renderAuthUI() {
  const areas = document.querySelectorAll("[data-auth]");
  if (!areas.length) return;

  const user = currentUser();

  areas.forEach(area => {
    if (user) {
      const firstName = (user.name || '').split(' ')[0] || user.email;
      area.innerHTML = '' +
        '<span class="auth-chip" title="' + (user.email || '').replace(/"/g, '&quot;') + '">👤 ' + firstName + '</span>' +
        '<button class="auth-btn" type="button" data-auth-logout>Logout</button>';

      const logoutBtn = area.querySelector("[data-auth-logout]");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          authLogout();
          renderAuthUI();
          if (document.body && document.body.classList.contains("auth-page")) {
            window.location.href = (window.SITE_BASE || './') + "index.html";
          }
        });
      }
    } else {
      const loginHref = (window.SITE_BASE || './') + "pages/auth/login.html";
      const signupHref = (window.SITE_BASE || './') + "pages/auth/signup.html";
      area.innerHTML = '' +
        '<a class="auth-btn" href="' + loginHref + '">Login</a>' +
        '<a class="auth-btn auth-btn-primary" href="' + signupHref + '">Sign Up</a>';
    }
  });
}

function initAuth() {
  renderAuthUI();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuth);
} else {
  initAuth();
}