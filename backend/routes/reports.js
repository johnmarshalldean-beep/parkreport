const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DATA_FILE = path.join(__dirname, "../data/reports.json");

function readReports() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeReports(reports) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2));
}

router.get("/", (req, res) => {
  res.json(readReports());
});

router.post("/", (req, res) => {
  const reports = readReports();
  const report = {
    id: crypto.randomUUID(),
    employeeName: req.body.employeeName,
    parkName: req.body.parkName,
    priority: req.body.priority || "Medium",
    description: req.body.description,
    photo: req.body.photo,
    status: "Open",
    createdAt: new Date().toISOString(),
    completedAt: "",
    completedBy: ""
  };
  reports.unshift(report);
  writeReports(reports);
  res.status(201).json(report);
});

router.patch("/:id/complete", (req, res) => {
  const reports = readReports();
  const report = reports.find(item => item.id === req.params.id);
  if (!report) return res.status(404).json({ error: "Report not found" });

  report.status = "Completed";
  report.completedBy = req.body.completedBy || "Unknown";
  report.completedAt = new Date().toISOString();

  writeReports(reports);
  res.json(report);
});

router.delete("/:id", (req, res) => {
  const reports = readReports().filter(item => item.id !== req.params.id);
  writeReports(reports);
  res.status(204).send();
});

module.exports = router;
