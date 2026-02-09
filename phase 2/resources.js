// ===============================
// 1) DOM references
// ===============================
const actions = document.getElementById("resourceActions");
const resourceNameContainer = document.getElementById("resourceNameContainer");
const descriptionInput = document.getElementById("resourceDescription");

// Example roles
const role = "admin"; // "reserver" | "admin"

// Will hold references to buttons
let createButton = null;
let updateButton = null;
let deleteButton = null;

// ===============================
// 2) Button creation helpers
// ===============================
const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";

const BUTTON_ENABLED_CLASSES =
  "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

const BUTTON_DISABLED_CLASSES =
  "cursor-not-allowed opacity-50";

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.name = "action";
  if (value) btn.value = value;

  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();

  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;

  btn.disabled = !enabled;

  // Keep disabled look in ONE place
  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);

  if (!enabled) {
    btn.classList.remove("hover:bg-brand-dark/80");
  } else if (btn.value === "create" || btn.textContent === "Create") {
    btn.classList.add("hover:bg-brand-dark/80");
  }
}

function renderActionButtons(currentRole) {
  if (currentRole === "reserver") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  if (currentRole === "admin") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });

    updateButton = addButton({
      label: "Update",
      value: "update",
      classes: BUTTON_ENABLED_CLASSES,
    });

    deleteButton = addButton({
      label: "Delete",
      value: "delete",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  // Buttons disabled until validation
  setButtonEnabled(createButton, false);
  setButtonEnabled(updateButton, false);
  setButtonEnabled(deleteButton, false);
}

// ===============================
// 3) Input creation + validation
// ===============================
function createResourceNameInput(container) {
  const input = document.createElement("input");
  input.id = "resourceName";
  input.name = "resourceName";
  input.type = "text";
  input.placeholder = "e.g., Meeting Room A";

  input.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white
    px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
    transition-all duration-200 ease-out
  `;

  container.appendChild(input);
  return input;
}

function isResourceNameValid(value) {
  const trimmed = value.trim();
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;
  return trimmed.length >= 5 && trimmed.length <= 30 && allowedPattern.test(trimmed);
}

function isDescriptionValid(value) {
  const trimmed = value.trim();
  return trimmed.length >= 10 && trimmed.length <= 200;
}

function setInputVisualState(input, state) {
  input.classList.remove(
    "border-green-500",
    "bg-green-100",
    "focus:ring-green-500/30",
    "border-red-500",
    "bg-red-100",
    "focus:ring-red-500/30",
    "focus:border-brand-blue",
    "focus:ring-brand-blue/30"
  );

  input.classList.add("focus:ring-2");

  if (state === "valid") {
    input.classList.add("border-green-500", "bg-green-100", "focus:ring-green-500/30");
  } else if (state === "invalid") {
    input.classList.add("border-red-500", "bg-red-100", "focus:ring-red-500/30");
  }
}

function updateValidation() {
  const nameValid = isResourceNameValid(resourceNameInput.value);
  const descValid = isDescriptionValid(descriptionInput.value);

  setInputVisualState(resourceNameInput, resourceNameInput.value.trim() === "" ? "neutral" : (nameValid ? "valid" : "invalid"));
  setInputVisualState(descriptionInput, descriptionInput.value.trim() === "" ? "neutral" : (descValid ? "valid" : "invalid"));

  setButtonEnabled(createButton, nameValid && descValid);
}

// ===============================
// 4) Bootstrapping
// ===============================
renderActionButtons(role);

// Create + validate input
const resourceNameInput = createResourceNameInput(resourceNameContainer);

// Real-time validation for both fields
resourceNameInput.addEventListener("input", updateValidation);
descriptionInput.addEventListener("input", updateValidation);

// Initial validation on page load
updateValidation();
