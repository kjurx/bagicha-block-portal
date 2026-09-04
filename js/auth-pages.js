// ===============================
// LOGIN / SIGNUP PAGE HANDLERS
// ===============================

function showAuthError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? "block" : "none";
}

function initAuthPage() {
  if (window.currentUser && currentUser()) {
    window.location.href = (window.SITE_BASE || './') + "index.html";
    return;
  }

  // --- LOGIN ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const emailEl = document.getElementById("loginEmail");
    const passEl = document.getElementById("loginPassword");
    const errorEl = document.getElementById("authError");

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      showAuthError(errorEl, "");

      const result = authLogin(emailEl.value, passEl.value);
      if (!result.ok) {
        showAuthError(errorEl, result.error);
        return;
      }
      window.location.href = (window.SITE_BASE || './') + "index.html";
    });
  }

  // --- SIGNUP ---
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    const nameEl = document.getElementById("signupName");
    const emailEl = document.getElementById("signupEmail");
    const passEl = document.getElementById("signupPassword");
    const pass2El = document.getElementById("signupPassword2");
    const errorEl = document.getElementById("signupError");

    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      showAuthError(errorEl, "");

      if (passEl.value !== pass2El.value) {
        showAuthError(errorEl, "दोनों पासवर्ड एक जैसे नहीं हैं।");
        return;
      }

      const result = authRegister(nameEl.value, emailEl.value, passEl.value);
      if (!result.ok) {
        showAuthError(errorEl, result.error);
        return;
      }

      authLogin(emailEl.value, passEl.value);
      window.location.href = (window.SITE_BASE || './') + "index.html";
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuthPage);
} else {
  initAuthPage();
}