const STORAGE_KEY = "parkReportsPWA";

function getReports() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveReports(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function addReport(report) {
  const reports = getReports();
  reports.unshift(report);
  saveReports(reports);
}

function updateReport(id, updates) {
  const reports = getReports().map(report => {
    if (report.id === id) return { ...report, ...updates };
    return report;
  });
  saveReports(reports);
}

function deleteReport(id) {
  const reports = getReports().filter(report => report.id !== id);
  saveReports(reports);
}
