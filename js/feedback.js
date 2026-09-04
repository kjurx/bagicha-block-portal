
const form = document.getElementById("feedbackForm");
const success = document.getElementById("feedbackSuccess");

if (form && success) {
  const nameInput = document.getElementById("feedbackName");
  if (nameInput && window.currentUser) {
    const user = window.currentUser();
    if (user && user.name && !nameInput.value) {
      nameInput.value = user.name;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const item = {
      type: document.getElementById("feedbackType").value,
      name: document.getElementById("feedbackName").value.trim(),
      message: document.getElementById("feedbackMessage").value.trim(),
      createdAt: new Date().toISOString()
    };

    if (!item.message) return;

    const existing = JSON.parse(localStorage.getItem("bagichaFeedback") || "[]");
    existing.push(item);
    localStorage.setItem("bagichaFeedback", JSON.stringify(existing));

    form.reset();
    success.style.display = "block";
    setTimeout(() => { success.style.display = "none"; }, 4000);
  });
}
