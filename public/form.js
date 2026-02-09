// ===============================
// form.js
// ===============================

// Helper
function $(id) { return document.getElementById(id); }
function timestamp() { return new Date().toISOString().replace('T', ' ').replace('Z', ''); }

document.addEventListener("DOMContentLoaded", () => {
  const form = $("resourceForm");
  if (form) form.addEventListener("submit", onSubmit);
});

async function onSubmit(event) {
  event.preventDefault();
  const submitter = event.submitter;
  const actionValue = submitter?.value || "create";
  const selectedUnit = document.querySelector('input[name="resourcePriceUnit"]:checked')?.value || "";
  const priceRaw = $("resourcePrice")?.value || "";
  const resourcePrice = priceRaw === "" ? 0 : Number(priceRaw);

  const payload = {
    action: actionValue,
    resourceName: $("resourceName")?.value || "",
    resourceDescription: $("resourceDescription")?.value || "",
    resourceAvailable: $("resourceAvailable")?.checked || false,
    resourcePrice,
    resourcePriceUnit: selectedUnit
  };

  try {
    console.log(`Sending request [${timestamp()}]`);
    const response = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} ${response.statusText}\n${text}`);
    }

    const data = await response.json();
    let msg = `Server response [${timestamp()}]\n--------------------------\n`;
    msg += `Status ➡️ ${response.status}\n`;
    msg += `Action ➡️ ${data.echo.action}\n`;
    msg += `Name ➡️ ${data.echo.resourceName}\n`;
    msg += `Description ➡️ ${data.echo.resourceDescription}\n`;
    msg += `Availability ➡️ ${data.echo.resourceAvailable}\n`;
    msg += `Price ➡️ ${data.echo.resourcePrice}\n`;
    msg += `Price unit ➡️ ${data.echo.resourcePriceUnit}\n`;

    console.log(msg);
    alert(msg);

  } catch (err) {
    console.error("POST error:", err);
    alert("Error sending request. See console.");
  }
}
