const historyList = document.getElementById("historyList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const clearHistory = document.getElementById("clearHistory");

renderHistory();

searchInput.addEventListener("input", renderHistory);
statusFilter.addEventListener("change", renderHistory);

clearHistory.addEventListener("click", () => {
  if (confirm("Clear all report history on this device?")) {
    saveReports([]);
    renderHistory();
  }
});

function renderHistory() {
  const query = searchInput.value.toLowerCase();
  const status = statusFilter.value;

  let reports = getReports();

  if (status !== "all") {
    reports = reports.filter(report => report.status === status);
  }

  if (query) {
    reports = reports.filter(report =>
      report.employeeName.toLowerCase().includes(query) ||
      report.parkName.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      report.priority.toLowerCase().includes(query)
    );
  }

  historyList.innerHTML = "";

  if (reports.length === 0) {
    historyList.innerHTML = `<section class="card"><p>No reports found.</p></section>`;
    return;
  }

  reports.forEach(report => {
    const card = document.createElement("article");
    card.className = `report-card ${report.status === "Completed" ? "completed" : ""} ${report.priority === "Emergency" ? "emergency" : ""}`;

    card.innerHTML = `
      <h3>${escapeHTML(report.parkName)}</h3>
      <span class="badge">${escapeHTML(report.status)}</span>
      <span class="badge">${escapeHTML(report.priority)}</span>
      <p><strong>Employee:</strong> ${escapeHTML(report.employeeName)}</p>
      <p><strong>Description:</strong> ${escapeHTML(report.description)}</p>
      <p><strong>Created:</strong> ${escapeHTML(report.createdAt)}</p>
      ${report.completedAt ? `<p><strong>Completed:</strong> ${escapeHTML(report.completedAt)} by ${escapeHTML(report.completedBy)}</p>` : ""}
      <img src="${report.photo}" alt="Report photo" />
      <div class="actions">
        ${report.status === "Open" ? `<button data-complete="${report.id}">Mark Complete</button>` : ""}
        <button class="danger" data-delete="${report.id}">Delete</button>
      </div>
    `;

    historyList.appendChild(card);
  });

  document.querySelectorAll("[data-complete]").forEach(button => {
    button.addEventListener("click", () => {
      const completedBy = prompt("Completed by who?");
      if (!completedBy) return;
      updateReport(button.dataset.complete, {
        status: "Completed",
        completedBy,
        completedAt: new Date().toLocaleString()
      });
      renderHistory();
    });
  });

  document.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () => {
      if (confirm("Delete this report?")) {
        deleteReport(button.dataset.delete);
        renderHistory();
      }
    });
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[character]));
}
