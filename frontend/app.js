const form = document.getElementById("reportForm");
const openCount = document.getElementById("openCount");
const completeCount = document.getElementById("completeCount");
const totalCount = document.getElementById("totalCount");

renderDashboard();
registerServiceWorker();

form.addEventListener("submit", event => {
  event.preventDefault();

  const employeeName = document.getElementById("employeeName").value.trim();
  const parkName = document.getElementById("parkName").value;
  const priority = document.getElementById("priority").value;
  const description = document.getElementById("description").value.trim();
  const photoInput = document.getElementById("photo");

  if (!employeeName || !parkName || !description || photoInput.files.length === 0) {
    alert("Please complete every field and add a photo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    addReport({
      id: crypto.randomUUID(),
      employeeName,
      parkName,
      priority,
      description,
      photo: reader.result,
      status: "Open",
      createdAt: new Date().toLocaleString(),
      completedAt: "",
      completedBy: ""
    });

    form.reset();
    renderDashboard();
    alert("Report submitted.");
  };

  reader.readAsDataURL(photoInput.files[0]);
});

function renderDashboard() {
  const reports = getReports();
  const completed = reports.filter(report => report.status === "Completed").length;
  openCount.textContent = reports.length - completed;
  completeCount.textContent = completed;
  totalCount.textContent = reports.length;
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
}
