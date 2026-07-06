const reportsList = document.getElementById("reportsList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
let allReports = [];

async function loadReports() {
  const { data, error } = await supabaseClient
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    reportsList.textContent = "Could not load reports.";
    console.error(error);
    return;
  }

  allReports = data || [];
  renderReports();
}

function renderReports() {
  const search = searchInput.value.toLowerCase();
  const status = statusFilter.value;

  const filtered = allReports.filter(r => {
    const text = `${r.employee_name} ${r.park} ${r.category} ${r.description} ${r.asset}`.toLowerCase();
    return (!search || text.includes(search)) && (!status || r.status === status);
  });

  if (!filtered.length) {
    reportsList.textContent = "No reports found.";
    return;
  }

  reportsList.innerHTML = filtered.map(r => {
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
      </article>
    `;
  }).join("");
}

searchInput.addEventListener("input", renderReports);
statusFilter.addEventListener("change", renderReports);
loadReports();
