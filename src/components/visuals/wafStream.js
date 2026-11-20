// WAF stream: requests fly in from the left as glowing dots with comet tails.
// Malicious ones (red) hit the vertical filter line, turn grey and die there.
// Clean ones (green) pass the line and land in the shield, which flashes.
// Plain canvas, no dependencies, so it runs in React and in a bare HTML page.

const C = {
  bgTop: '#122637',
  bgBottom: '#0d1d2b',
  stripe: 'rgba(120,170,210,',
  line: '70,130,175',
  shield: '74,156,201',
  red: [232, 86, 62],
  green: [112, 190, 72],
  grey: [205, 210, 214],
};

const rand = (a, b) => a + Math.random() * (b - a);
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)));

// Shield outline in a 100 x 116 box, centre at (50, 58).
const SHIELD = 'M50 2 C66 12 82 16 96 16 C96 62 82 96 50 114 C18 96 4 62 4 16 C18 16 34 12 50 2 Z';
const CHECK = 'M32 58 L45 71 L69 45';

export function createWafStream(canvas, opts = {}) {
  const ctx = canvas.getContext('2d');
  const shieldPath = new Path2D(SHIELD);
  const checkPath = new Path2D(CHECK);
  const reduce = opts.reducedMotion ?? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  let w = 0, h = 0, dpr = 1, unit = 1;
  let lineX = 0, shieldX = 0, shieldY = 0, shieldS = 1;
  let bg = null;
  let dots = [];
  let spawnIn = 0;
  let flash = 0;
  let greenBusy = false; // one clean request at a time, so greens never clump
  let raf = 0, last = 0, running = false;

  function layout() {
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    unit = Math.min(1.25, Math.max(0.8, Math.min(w, h * 1.2) / 380));
    lineX = Math.round(w * 0.715) + 0.5;
    shieldS = 0.46 * unit;
    shieldX = lineX + Math.min(w * 0.155, 140 * unit);
    shieldY = h * 0.553;
    buildBackground();
  }

  // Static layer: navy gradient, irregular faint vertical bands, the filter line.
  function buildBackground() {
    bg = document.createElement('canvas');
    bg.width = canvas.width; bg.height = canvas.height;
    const b = bg.getContext('2d');
    b.scale(dpr, dpr);
    const g = b.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, C.bgTop); g.addColorStop(1, C.bgBottom);
    b.fillStyle = g; b.fillRect(0, 0, w, h);

    let x = 0, i = 0;
    while (x < w) {
      const bw = 4 + ((i * 37) % 23);
      b.fillStyle = C.stripe + (0.008 + ((i * 53) % 7) * 0.004) + ')';
      b.fillRect(x, 0, bw, h);
      b.fillStyle = C.stripe + '0.025)';
      b.fillRect(x + bw, 0, 1, h);
      x += bw + 6 + ((i * 29) % 19); i++;
    }

    const lg = b.createLinearGradient(0, h * 0.1, 0, h);
    lg.addColorStop(0, `rgba(${C.line},0)`);
    lg.addColorStop(0.18, `rgba(${C.line},0.75)`);
    lg.addColorStop(0.85, `rgba(${C.line},0.6)`);
    lg.addColorStop(1, `rgba(${C.line},0.15)`);
    b.fillStyle = lg;
    b.fillRect(lineX - 0.5, h * 0.1, 1, h * 0.9);
    // soft halo around the line
    b.fillStyle = `rgba(${C.line},0.05)`;
    b.fillRect(lineX - 3, h * 0.18, 6, h * 0.8);
  }

  function spawn(initial = false) {
    const good = !greenBusy && Math.random() < 0.2;
    if (good) greenBusy = true;
    const y = good
      ? shieldY + rand(-8, 8) * unit
      : rand(h * 0.16, h * 0.92);
    const startX = initial ? rand(0, lineX - 40) : rand(-40, lineX * 0.35);
    dots.push({
      x: startX, y,
      v: rand(95, 150) * unit,       // px per second
      r: 4 * unit,
      tail: rand(46, 58) * unit,
      good,
      state: 'fly',                  // fly -> hit (bad) | pass (good) -> dead
      t: 0,
      alpha: initial ? 1 : 0,
    });
  }

  function update(dt) {
    spawnIn -= dt;
    if (spawnIn <= 0) {
      spawn();
      // keep roughly h/60 dots in flight, whatever the width
      const travel = lineX / (122 * unit);
      const interval = travel / Math.max(4, h / 60);
      spawnIn = interval * rand(0.6, 1.4);
    }
    flash = Math.max(0, flash - dt * 1.6);

    for (const d of dots) {
      d.alpha = Math.min(1, d.alpha + dt * 2.5);
      if (d.state === 'fly') {
        d.x += d.v * dt;
        if (!d.good && d.x >= lineX) { d.x = lineX; d.state = 'hit'; d.t = 0; }
        if (d.good && d.x >= shieldX - 22 * shieldS) { d.state = 'dead'; flash = 1; greenBusy = false; }
      } else if (d.state === 'hit') {
        d.t += dt;
      }
    }
    dots = dots.filter(d => d.state !== 'dead' && !(d.state === 'hit' && d.t > 1.5));
  }

  function drawDot(d) {
    let col = d.good ? C.green : C.red;
    let tail = d.tail, a = d.alpha;
    if (d.state === 'hit') {
      const k = Math.min(1, d.t / 0.35);
      col = mix(C.red, C.grey, k);
      tail = d.tail * Math.max(0.55, 1 - d.t * 0.25);
      a *= d.t < 0.8 ? 1 : Math.max(0, 1 - (d.t - 0.8) / 0.7);
    }
    // dots spawned mid-screen grow their tail as they get going
    tail = Math.min(tail, Math.max(0, d.x + 40));
    const [r, g, b] = col;
    const tg = ctx.createLinearGradient(d.x - tail, 0, d.x, 0);
    tg.addColorStop(0, `rgba(${r},${g},${b},0)`);
    tg.addColorStop(1, `rgba(${r},${g},${b},${0.38 * a})`);
    ctx.fillStyle = tg;
    ctx.fillRect(d.x - tail, d.y - d.r * 0.85, tail, d.r * 1.7);

    ctx.shadowColor = `rgba(${r},${g},${b},${0.9 * a})`;
    ctx.shadowBlur = 8 * unit;
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawShield() {
    ctx.save();
    ctx.translate(shieldX - 50 * shieldS, shieldY - 58 * shieldS);
    ctx.scale(shieldS, shieldS);
    const glow = 0.25 + flash * 0.75;
    ctx.fillStyle = `rgba(${C.shield},${0.12 + flash * 0.12})`;
    ctx.fill(shieldPath);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.shadowColor = `rgba(${C.shield},${glow})`;
    ctx.shadowBlur = (6 + flash * 18) * shieldS * 2;
    ctx.strokeStyle = `rgba(${C.shield},0.95)`;
    ctx.lineWidth = 5;
    ctx.stroke(shieldPath);
    ctx.lineWidth = 7;
    ctx.stroke(checkPath);
    ctx.restore();
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    update(dt);
    render();
    if (running) raf = requestAnimationFrame(frame);
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bg, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const d of dots) drawDot(d);
    drawShield();
  }

  function seed() {
    dots = []; greenBusy = false;
    const n = Math.round(h / 60);
    for (let i = 0; i < n; i++) spawn(true);
  }

  const ro = new ResizeObserver(() => { layout(); if (!running) render(); });
  ro.observe(canvas);
  layout();
  seed();

  const api = {
    start() {
      if (running || reduce) { render(); return; }
      running = true; last = 0; raf = requestAnimationFrame(frame);
    },
    stop() { running = false; cancelAnimationFrame(raf); },
    destroy() { api.stop(); ro.disconnect(); },
  };
  return api;
}
