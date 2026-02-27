require("dotenv").config();
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const { body, validationResult } = require("express-validator");

// ----------------------
// Basic setup
// ----------------------
const app = express();
const PORT = process.env.IPORT || 5000;

// Timestamp helper
function timestamp() {
  const now = new Date();
  return now.toISOString().replace("T", " ").replace("Z", "");
}

// Parse JSON bodies
app.use(express.json());

// Serve static frontend from ./public
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Front page
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// Resources page
app.get("/resources", (req, res) => {
  res.sendFile(path.join(publicDir, "resources.html"));
});

// ----------------------
// PostgreSQL connection
// ----------------------
const pool = new Pool({});

// Optional DB connectivity check
async function testDb() {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("✅ Database connection OK");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

// ----------------------
// Validation rules
// ----------------------
const resourceValidators = [
  body("action")
    .exists({ checkFalsy: true })
    .withMessage("action is required")
    .trim()
    .isIn(["create"])
    .withMessage("action must be 'create'"),

  body("resourceName")
    .exists({ checkFalsy: true })
    .withMessage("resourceName is required")
    .isString()
    .withMessage("resourceName must be a string")
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage("resourceName must be 5–30 characters long")
    .matches(/^[A-Za-z0-9ÄÖÅäöå ]+$/)
    .withMessage(
      "resourceName may contain letters, numbers, Finnish letters, and spaces only"
    ),

  body("resourceDescription")
    .exists({ checkFalsy: true })
    .withMessage("resourceDescription is required")
    .isString()
    .withMessage("resourceDescription must be a string")
    .trim()
    .isLength({ min: 10, max: 50 })
    .withMessage("resourceDescription must be 10–50 characters long")
    .matches(/^[A-Za-z0-9ÄÖÅäöå ]+$/)
    .withMessage(
      "resourceDescription may contain letters, numbers, Finnish letters, and spaces only"
    ),

  body("resourceAvailable")
    .optional()
    .isBoolean()
    .withMessage("resourceAvailable must be boolean")
    .toBoolean(),

  body("resourcePrice")
    .exists({ checkFalsy: false })
    .withMessage("resourcePrice is required")
    .isFloat({ min: 0 })
    .withMessage("resourcePrice must be a non-negative number")
    .toFloat(),

  body("resourcePriceUnit")
    .exists({ checkFalsy: true })
    .withMessage("resourcePriceUnit is required")
    .isString()
    .withMessage("resourcePriceUnit must be a string")
    .trim()
    .isIn(["hour", "day", "week", "month"])
    .withMessage("resourcePriceUnit must be one of: hour, day, week, month"),
];

// ----------------------
// Create resource route
// ----------------------
app.post("/api/resources", resourceValidators, async (req, res) => {
  // Validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }

  // Normalized values after .toBoolean() / .toFloat()
  let {
    action = "",
    resourceName = "",
    resourceDescription = "",
    resourceAvailable = false,
    resourcePrice = 0,
    resourcePriceUnit = "",
  } = req.body;

  console.log("The client's POST request", `[${timestamp()}]`);
  console.log("------------------------------");
  console.log("Action        ➡️", action);
  console.log("Name          ➡️", resourceName);
  console.log("Description   ➡️", resourceDescription);
  console.log("Availability  ➡️", resourceAvailable);
  console.log("Price         ➡️", resourcePrice);
  console.log("Price unit    ➡️", resourcePriceUnit);
  console.log("------------------------------");

  if (action !== "create") {
    return res
      .status(400)
      .json({ ok: false, error: "Only create is implemented right now" });
  }

  const availableValue = Boolean(resourceAvailable);
  const priceValue = Number(resourcePrice);

  try {
    const insertSql = `
      INSERT INTO resources (name, description, available, price, price_unit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, available, price, price_unit, created_at
    `;
    const params = [
      resourceName,
      resourceDescription,
      availableValue,
      priceValue,
      resourcePriceUnit,
    ];

    const { rows } = await pool.query(insertSql, params);
    const created = rows[0];

    return res.status(201).json({ ok: true, data: created });
  } catch (err) {
    console.log("=== ERROR IN INSERT ===");
    console.log(err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }
});

// ----------------------
// 404 for unknown API routes
// ----------------------
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ----------------------
// Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  testDb();
});
