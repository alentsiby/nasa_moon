function moonSVG(p, size=120){
  const r = size/2;
  const x = 2*p - 1;
  const absx = Math.abs(x);
  const dir = x >= 0 ? 1 : -1;
  const scaleX = 1 - absx;
  const shift = dir * r * 0.65;
  const id = 'm' + Math.random().toString(36).slice(2);

  return `
  <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="moonSVG">
    <defs>
      <radialGradient id="g-${id}" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#111"/>
        <stop offset="60%" stop-color="#222"/>
        <stop offset="100%" stop-color="#000"/>
      </radialGradient>
      <mask id="mask-${id}">
        <rect width="100%" height="100%" fill="black"/>
        <g transform="translate(${r+shift}, ${r}) scale(${scaleX}, 1)">
          <circle cx="0" cy="0" r="${r}" fill="white"/>
        </g>
      </mask>
    </defs>
    <!-- White moon base -->
    <circle cx="${r}" cy="${r}" r="${r}" fill="#fff" stroke="#ccc" stroke-width="2"/>
    <!-- Dark shadow -->
    <g mask="url(#mask-${id})">
      <circle cx="${r}" cy="${r}" r="${r}" fill="url(#g-${id})"/>
    </g>
  </svg>`;
}

// Calculate moon phase percentage (0=new, 0.5=full)
function moonPhasePercent(date){
  const lp = 2551443; // synodic month (s)
  const now = date/1000;
  const new_moon = Date.UTC(2000,0,6,18,14,0)/1000;
  const phase = ((now - new_moon) % lp) / lp;
  return phase;
}

// Return text label for phase
function moonPhaseName(p){
  if (p < 0.03 || p > 0.97) return "New Moon";
  if (p < 0.22) return "Waxing Crescent";
  if (p < 0.28) return "First Quarter";
  if (p < 0.47) return "Waxing Gibbous";
  if (p < 0.53) return "Full Moon";
  if (p < 0.72) return "Waning Gibbous";
  if (p < 0.78) return "Last Quarter";
  return "Waning Crescent";
}

function renderToday(){
  const p = moonPhasePercent(new Date());
  document.getElementById("todayMoon").innerHTML = moonSVG(p);
  document.getElementById("todayText").textContent = moonPhaseName(p);
}

function render7(){
  const grid = document.getElementById("sevenGrid");
  grid.innerHTML = "";
  const today = new Date();
  for(let i=1;i<=7;i++){
    const d = new Date(today);
    d.setDate(d.getDate()+i);
    const p = moonPhasePercent(d);
    const cell = document.createElement("div");
    cell.innerHTML = moonSVG(p,80) 
                   + `<div class="phaseText">${moonPhaseName(p)}</div>`
                   + `<div>${d.toDateString().slice(0,10)}</div>`;
    grid.appendChild(cell);
  }
}

document.getElementById("toggle7").onclick = ()=>{
  const panel = document.getElementById("sevenPanel");
  if(panel.classList.contains("hidden")){
    render7();
    panel.classList.remove("hidden");
  } else {
    panel.classList.add("hidden");
  }
};

renderToday();
