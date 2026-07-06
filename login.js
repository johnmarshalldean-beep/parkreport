const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("adminName").value.trim();
  const allowed = ADMIN_NAMES.some(admin => admin.toLowerCase() === name.toLowerCase());

  if (!allowed) {
    message.textContent = "Access denied.";
    message.className = "message error";
    return;
  }

  localStorage.setItem("parkReportAdmin", name);
  window.location.href = "admin.html";
});
