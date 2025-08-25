// Moon phases list
const phases = [
  "New Moon", "Waxing Crescent", "First Quarter",
  "Waxing Gibbous", "Full Moon", "Waning Gibbous",
  "Last Quarter", "Waning Crescent"
];

// Simple moon shadow styles for each phase
const moonStyles = {
  "New Moon": { shift: "0", left: "0" },
  "Waxing Crescent": { shift: "-30%", left: "0" },
  "First Quarter": { shift: "-100%", left: "50%" },
  "Waxing Gibbous": { shift: "-170%", left: "50%" },
  "Full Moon": { shift: "-300%", left: "100%" },
  "Waning Gibbous": { shift: "70%", left: "0" },
  "Last Quarter": { shift: "100%", left: "0" },
  "Waning Crescent": { shift: "30%", left: "0" }
};

// Apply moon phase style
function setMoonPhase(moonEl, phase) {
  moonEl.style.setProperty("--shadow-shift", moonStyles[phase].shift);
  moonEl.style.setProperty("--shadow-left", moonStyles[phase].left);
}

// Show today's moon
function renderToday() {
  const today = new Date();
  const phase = phases[today.getDate() % phases.length];
  document.getElementById("todayLabel").innerText = phase;
  setMoonPhase(document.getElementById("todayMoon"), phase);
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
      <div class="moon" id="moon${i}"></div>
      <div class="label">${phase}</div>
      <div class="date">${date.toDateString()}</div>
    `;
    panel.appendChild(card);
    setMoonPhase(document.getElementById(`moon${i}`), phase);
  }
}

renderToday();
