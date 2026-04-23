const API_URL = "/api/persons";

let selectedCustomerId = null;
let customers = [];

const customerList = document.getElementById("customer-list");
const recordsSummary = document.getElementById("records-summary");
const form = document.getElementById("management-form");
const statusBox = document.getElementById("form-status");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");
const resetBtn = document.getElementById("reset-btn");

const firstnameInput = document.getElementById("firstname");
const lastnameInput = document.getElementById("lastname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const birthdateInput = document.getElementById("birthdate");

function showStatus(message, type = "") {
  statusBox.textContent = message;
  statusBox.className = "status-message";
  if (type) {
    statusBox.classList.add(type);
  }
}

function clearStatus() {
  statusBox.textContent = "";
  statusBox.className = "status-message";
}

function getFormData() {
  return {
    first_name: firstnameInput.value.trim(),
    last_name: lastnameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    birth_date: birthdateInput.value || null
  };
}

function fillForm(person) {
  firstnameInput.value = person.first_name || "";
  lastnameInput.value = person.last_name || "";
  emailInput.value = person.email || "";
  phoneInput.value = person.phone || "";
  birthdateInput.value = person.birth_date ? person.birth_date.slice(0, 10) : "";
}

function resetForm() {
  selectedCustomerId = null;
  form.reset();
  saveBtn.textContent = "Add customer";
  deleteBtn.disabled = true;
  clearStatus();
  renderCustomers();
}

function setSelectedCustomer(person) {
  selectedCustomerId = person.id;
  fillForm(person);
  saveBtn.textContent = "Update customer";
  deleteBtn.disabled = false;
  showStatus(`Selected customer: ${person.first_name} ${person.last_name}`, "info");
  renderCustomers();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderCustomers() {
  customerList.innerHTML = "";

  if (!customers.length) {
    customerList.innerHTML = `<p class="empty-message">No customers found.</p>`;
    recordsSummary.textContent = "0 customers in the registry";
    return;
  }

  recordsSummary.textContent = `${customers.length} customer${customers.length === 1 ? "" : "s"} in the registry`;

  customers.forEach((person) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "customer-card";

    if (person.id === selectedCustomerId) {
      card.classList.add("selected");
    }

    card.innerHTML = `
      <span class="customer-name">${escapeHtml(person.first_name)} ${escapeHtml(person.last_name)}</span>
      <span class="customer-detail"><strong>Email:</strong> ${escapeHtml(person.email || "-")}</span>
      <span class="customer-detail"><strong>Phone:</strong> ${escapeHtml(person.phone || "-")}</span>
      <span class="customer-detail"><strong>Birth date:</strong> ${escapeHtml(person.birth_date ? person.birth_date.slice(0, 10) : "-")}</span>
    `;

    card.addEventListener("click", () => {
      setSelectedCustomer(person);
    });

    customerList.appendChild(card);
  });
}

async function loadCustomers() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Failed to fetch customers.");
    }

    customers = await res.json();

    if (selectedCustomerId !== null) {
      const stillExists = customers.find((customer) => customer.id === selectedCustomerId);
      if (!stillExists) {
        selectedCustomerId = null;
        form.reset();
        saveBtn.textContent = "Add customer";
        deleteBtn.disabled = true;
      }
    }

    renderCustomers();
  } catch (error) {
    console.error(error);
    customerList.innerHTML = `<p class="error-message">Error loading customer data.</p>`;
    recordsSummary.textContent = "Unable to load customers";
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  clearStatus();

  const payload = getFormData();

  if (!payload.first_name || !payload.last_name || !payload.email) {
    showStatus("First name, last name, and email are required.", "error");
    return;
  }

  const isUpdating = selectedCustomerId !== null;
  const url = isUpdating ? `${API_URL}/${selectedCustomerId}` : API_URL;
  const method = isUpdating ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Request failed.");
    }

    await loadCustomers();

    if (isUpdating && result.person) {
      setSelectedCustomer(result.person);
      showStatus("Customer updated successfully.", "success");
    } else {
      resetForm();
      showStatus("Customer added successfully.", "success");
    }
  } catch (error) {
    console.error(error);
    showStatus(error.message || "Unable to save customer.", "error");
  }
}

async function handleDelete() {
  if (selectedCustomerId === null) {
    showStatus("Select a customer before deleting.", "error");
    return;
  }

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId);
  const customerLabel = selectedCustomer
    ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
    : "this customer";

  const confirmed = window.confirm(`Delete ${customerLabel}?`);
  if (!confirmed) {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${selectedCustomerId}`, {
      method: "DELETE"
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Delete failed.");
    }

    resetForm();
    await loadCustomers();
    showStatus("Customer deleted successfully.", "success");
  } catch (error) {
    console.error(error);
    showStatus(error.message || "Unable to delete customer.", "error");
  }
}

form.addEventListener("submit", handleSubmit);
deleteBtn.addEventListener("click", handleDelete);
resetBtn.addEventListener("click", resetForm);

loadCustomers();
