// Function to calculate moon phase
function getMoonPhase(date) {
  const lp = 2551443; // lunar period in seconds
  const new_moon = new Date(1970, 0, 7, 20, 35, 0); // reference new moon
  const phase = ((date.getTime() / 1000 - new_moon.getTime() / 1000) % lp) / lp;
  return phase; // 0 = new, 0.5 = full
}

// Function to get phase name
function getPhaseName(phase) {
  if (phase < 0.03 || phase > 0.97) return "New Moon 🌑";
  if (phase < 0.25) return "Waxing Crescent 🌒";
  if (phase < 0.27) return "First Quarter 🌓";
  if (phase < 0.50) return "Waxing Gibbous 🌔";
  if (phase < 0.53) return "Full Moon 🌕";
  if (phase < 0.75) return "Waning Gibbous 🌖";
  if (phase < 0.77) return "Last Quarter 🌗";
  return "Waning Crescent 🌘";
}

// Function to draw moon shape
function drawMoon(ctx, x, y, size, phase) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Base circle (moon)
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2, false);
  ctx.fillStyle = "white";
  ctx.fill();

  // Shadow
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();

  if (phase <= 0.5) {
    // Waxing
    ctx.ellipse(x - size * (1 - 2 * phase), y, size, size, 0, 0, Math.PI * 2);
  } else {
    // Waning
    ctx.ellipse(x + size * (2 * phase - 1), y, size, size, 0, 0, Math.PI * 2);
  }

  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

// Today’s moon
const today = new Date();
const todayPhase = getMoonPhase(today);
const todayName = getPhaseName(todayPhase);

document.getElementById("todayPhase").textContent = todayName;

const todayCtx = document.getElementById("todayMoon").getContext("2d");
drawMoon(todayCtx, 75, 75, 50, todayPhase);

// Forecast
const forecastContainer = document.getElementById("forecast");

for (let i = 1; i <= 7; i++) {
  const date = new Date();
  date.setDate(today.getDate() + i);
  const phase = getMoonPhase(date);
  const name = getPhaseName(phase);

  const item = document.createElement("div");
  item.className = "forecast-item";

  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");
  drawMoon(ctx, 50, 50, 35, phase);

  const text = document.createElement("p");
  text.textContent = name;

  item.appendChild(canvas);
  item.appendChild(text);
  forecastContainer.appendChild(item);
}
