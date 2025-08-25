// Fake moon phases (replace with real API if needed)
const phases = [
  "New Moon", "Waxing Crescent", "First Quarter",
  "Waxing Gibbous", "Full Moon", "Waning Gibbous",
  "Last Quarter", "Waning Crescent"
];

// Show today's moon
function renderToday() {
  const today = new Date();
  const label = phases[today.getDate() % phases.length];
  document.getElementById("todayLabel").innerText = label;
}

// Show next 7 days
function render7() {
  const panel = document.getElementById("sevenPanel");
  panel.innerHTML = "";
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const phase = phases[date.getDate() % phases.length];
    const card = document.createElement("div");
    card.className = "day-card";
    card.innerHTML = `
      <div class="moon"></div>
      <div class="label">${phase}</div>
      <div class="date">${date.toDateString()}</div>
    `;
    panel.appendChild(card);
  }
}

renderToday();
