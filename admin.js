const adminName = localStorage.getItem("parkReportAdmin");
if (!adminName) window.location.href = "login.html";

document.getElementById("adminGreeting").textContent = `Logged in as ${adminName}`;
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("parkReportAdmin");
  window.location.href = "login.html";
});

const adminReports = document.getElementById("adminReports");
const stats = document.getElementById("stats");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
let allReports = [];

async function loadReports() {
  const { data, error } = await supabaseClient
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    adminReports.textContent = "Could not load reports.";
    console.error(error);
    return;
  }

  allReports = data || [];
  renderStats();
  renderReports();
}

function renderStats() {
  const open = allReports.filter(r => r.status === "Open").length;
  const progress = allReports.filter(r => r.status === "In Progress").length;
  const complete = allReports.filter(r => r.status === "Completed").length;
  stats.textContent = `${open} Open • ${progress} In Progress • ${complete} Completed`;
}

function renderReports() {
  const search = searchInput.value.toLowerCase();
  const status = statusFilter.value;

  const filtered = allReports.filter(r => {
    const text = `${r.employee_name} ${r.park} ${r.category} ${r.description} ${r.asset}`.toLowerCase();
    return (!search || text.includes(search)) && (!status || r.status === status);
  });

  if (!filtered.length) {
    adminReports.textContent = "No reports found.";
    return;
  }

  adminReports.innerHTML = filtered.map(r => {
    const date = new Date(r.created_at).toLocaleString();
    const map = r.gps_lat && r.gps_lng
      ? `<p><a target="_blank" href="https://www.google.com/maps?q=${r.gps_lat},${r.gps_lng}">Open GPS Map</a></p>`
      : "";

    return `
      <article class="report priority-${r.priority}">
        <h3>${r.park}</h3>
        <div class="meta">${date} • ${r.employee_name} • ${r.category}</div>
        <p><span class="status">${r.status}</span> Priority: ${r.priority}</p>
        ${r.asset ? `<p><strong>Asset:</strong> ${r.asset}</p>` : ""}
        <p>${r.description}</p>
        ${map}
        ${r.photo_url ? `<a href="${r.photo_url}" target="_blank"><img src="${r.photo_url}" alt="Report photo"></a>` : ""}
        <div class="admin-actions">
          <button class="progress" onclick="updateStatus('${r.id}', 'In Progress')">In Progress</button>
          <button class="complete" onclick="updateStatus('${r.id}', 'Completed')">Complete</button>
          <button class="danger" onclick="deleteReport('${r.id}')">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

async function updateStatus(id, status) {
  const { error } = await supabaseClient
    .from("reports")
    .update({
      status,
      completed_by: status === "Completed" ? adminName : null,
      completed_at: status === "Completed" ? new Date().toISOString() : null
    })
    .eq("id", id);

  if (error) alert("Could not update report.");
  await loadReports();
}

async function deleteReport(id) {
  if (!confirm("Delete this report?")) return;
  const { error } = await supabaseClient.from("reports").delete().eq("id", id);
  if (error) alert("Could not delete report.");
  await loadReports();
}

searchInput.addEventListener("input", renderReports);
statusFilter.addEventListener("change", renderReports);
loadReports();
