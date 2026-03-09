require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

function timestamp() { return new Date().toISOString().replace("T", " ").replace("Z", ""); }

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Explicit page routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/resources", (req, res) => res.sendFile(path.join(__dirname, "public", "resources.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/bookings", (req, res) => res.sendFile(path.join(__dirname, "public", "bookings.html")));

// API endpoint
app.post("/api/resources", (req, res) => {
  const { action="", resourceName="", resourceDescription="", resourceAvailable=false, resourcePrice=0, resourcePriceUnit="" } = req.body || {};
  console.log("POST /api/resources", `[${timestamp()}]`, { action, resourceName, resourceDescription, resourceAvailable, resourcePrice, resourcePriceUnit });
  res.json({ ok: true, echo: req.body });
});

// 404 fallback for API
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

// Start server
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
