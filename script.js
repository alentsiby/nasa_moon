// ===================== CONFIG =====================
const INVERT_COLORS = true;  // true = white moon / dark shading (your original ask)
                             // false = classic dark disk / bright lit side

// ===================== UTILITIES ==================
const TAU = Math.PI * 2;
const frac = x => x - Math.floor(x);

function toJulian(date){               // JD from local time
  return date.getTime()/86400000 + 2440587.5;
}

// Returns { phase:[0..1), ageDays, illum:[0..1] }
function moonPhase(date){
  const jd = toJulian(date);
  const synodic = 29.530588853;
  const p = frac((jd - 2451550.1) / synodic); // 0=new, .5=full
  const age = p * synodic;
  const illum = 0.5 * (1 - Math.cos(TAU * p));
  return { phase:p, ageDays:age, illum };
}

function phaseName(p){
  if (p < 0.03 || p > 0.97) return 'New Moon';
  if (p < 0.22) return 'Waxing Crescent';
  if (p < 0.28) return 'First Quarter';
  if (p < 0.47) return 'Waxing Gibbous';
  if (p < 0.53) return 'Full Moon';
  if (p < 0.72) return 'Waning Gibbous';
  if (p < 0.78) return 'Last Quarter';
  return 'Waning Crescent';
}

function fmtDate(d){
  return d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}
function fmtShort(d){
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
function percent(n){ return (n*100).toFixed(1) + '%'; }

// ===================== MOON SVG ===================
// FIXED: Corrected terminator direction (waxing = right-lit, waning = left-lit)
function moonSVG(p, size=160, invert=INVERT_COLORS){
  const r = size/2;
  const absx = Math.abs(2*p - 1);
  const dir = (p < 0.5) ? 1 : -1;  // <<< Correct: waxing (<0.5) -> shift right, waning (>0.5) -> shift left
  const scaleX = 1 - absx;
  const shift = dir * r * 0.65;

  const id = 'm' + Math.random().toString(36).slice(2);

  const baseFill   = invert ? '#ffffff' : '#0a0f22';
  const baseStroke = invert ? '#cccccc' : '#1c2752';
  const grad0 = invert ? '#111111' : '#f8fbff';
  const grad1 = invert ? '#222222' : '#e6ebff';
  const grad2 = invert ? '#000000' : '#c7d2ff';

  return `
  <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="moonSVG" aria-label="Moon icon">
    <defs>
      <radialGradient id="g-${id}" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="${grad0}"/>
        <stop offset="60%" stop-color="${grad1}"/>
        <stop offset="100%" stop-color="${grad2}"/>
      </radialGradient>
      <filter id="shadow-${id}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.6"/>
      </filter>
      <clipPath id="clip-${id}">
        <circle cx="${r}" cy="${r}" r="${r}" />
      </clipPath>
      <mask id="mask-${id}">
        <rect width="100%" height="100%" fill="black"/>
        <g transform="translate(${r+shift}, ${r}) scale(${scaleX}, 1)">
          <circle cx="0" cy="0" r="${r}" fill="white" />
        </g>
      </mask>
    </defs>
    <circle cx="${r}" cy="${r}" r="${r}" fill="${baseFill}" stroke="${baseStroke}" stroke-width="2" filter="url(#shadow-${id})"/>
    <g clip-path="url(#clip-${id})" mask="url(#mask-${id})">
      <circle cx="${r}" cy="${r}" r="${r}" fill="url(#g-${id})"/>
    </g>
    <circle cx="${r}" cy="${r}" r="${r-1.5}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="3"/>
  </svg>`;
}

// ===================== RENDER =====================
function renderToday(){
  const now = new Date();
  const { phase, ageDays, illum } = moonPhase(now);

  document.getElementById('now').textContent = now.toLocaleString();
  document.getElementById('todayMoon').innerHTML = moonSVG(phase, 160);
  document.getElementById('todayLabel').textContent = phaseName(phase);
  document.getElementById('todayDate').textContent = fmtDate(now);
  document.getElementById('todayIllum').textContent = percent(illum);
  document.getElementById('todayAge').textContent = ageDays.toFixed(1) + ' days';
}

function render7(){
  const grid = document.getElementById('grid7');
  grid.innerHTML = '';
  const base = new Date();
  for(let i=1;i<=7;i++){
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate()+i);
    const { phase, illum } = moonPhase(d);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${moonSVG(phase, 120)}
      <div class="label">${phaseName(phase)}</div>
      <div class="date">${fmtShort(d)}</div>
      <div class="illum">${percent(illum)} lit</div>
    `;
    grid.appendChild(card);
  }
}

// Toggle 7-day panel
const toggleBtn = document.getElementById('toggle7');
const sevenPanel = document.getElementById('sevenPanel');
toggleBtn.addEventListener('click', () => {
  const show = sevenPanel.style.display === 'none';
  sevenPanel.style.display = show ? 'block' : 'none';
  toggleBtn.textContent = show ? '▼ Hide Next 7 Days' : '▶ Next 7 Days';
  if (show) render7();
});

// Initial render + refresh each minute
renderToday();
setInterval(() => {
  renderToday();
  if (sevenPanel.style.display !== 'none') render7();
}, 60 * 1000);

// ===================== LOCAL STARFIELD =====================
(function starfield(){
  const c = document.getElementById('sky');
  const ctx = c.getContext('2d');

  function sizeCanvas(){
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }
  function rand(a,b){ return a + Math.random()*(b-a); }

  function paint(){
    ctx.clearRect(0,0,c.width,c.height);

    const g = ctx.createLinearGradient(0,0,0,c.height);
    g.addColorStop(0, '#0f1b3f');
    g.addColorStop(1, '#060a17');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,c.width,c.height);

    const area = c.width * c.height;
    const layers = [
      { n: Math.floor(area / 12000), r:[0.4,1.0], a:[0.5,0.9] },
      { n: Math.floor(area / 18000), r:[0.8,1.6], a:[0.3,0.7] },
      { n: Math.floor(area / 26000), r:[1.2,2.0], a:[0.2,0.5] },
    ];

    layers.forEach(L => {
      for(let i=0;i<L.n;i++){
        const x = Math.random()*c.width;
        const y = Math.random()*c.height;
        const r = rand(L.r[0], L.r[1]);
        const a = rand(L.a[0], L.a[1]);
        const grd = ctx.createRadialGradient(x,y,0,x,y,r);
        grd.addColorStop(0, `rgba(255,255,255,${a})`);
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(x,y,r,0,TAU); ctx.fill();
      }
    });
  }

  function resizeAndPaint(){
    sizeCanvas();
    paint();
  }

  resizeAndPaint();
  window.addEventListener('resize', resizeAndPaint);
})();
