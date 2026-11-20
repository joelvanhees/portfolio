// WAF stream, endless loop: requests fly in from the left as glowing dots with
// comet tails. Malicious ones (red) hit the vertical filter line, flare up grey,
// swell, shrink to a speck and vanish. Clean ones (green) are faster and pass
// straight through the line and the shield, out of frame.
// Plain canvas, no dependencies, so it runs in React and in a bare HTML page.
//
// Proportions measured from a 389px-wide reference recording: line at 72.9 %
// of the width, shield centre at 87.7 % / 50 %, shield 11.3 % wide.

// SE Legal house colours: navy #0f305d, gold #b09069, dark gold #8a6d47,
// light grey #f2f2f2. Blocked requests and the filter line are light grey,
// the shield is gold in both tones.
const C = {
  bg: ['#0f305d', '#0f305d'],
  stripe: 'rgba(242,242,242,',
  line: '242,242,242',
  gold: '176,144,105',
  goldDark: '138,109,71',
  red: [242, 242, 242],     // incoming malicious request
  green: [104, 196, 70],
  grey: [242, 242, 242],    // the same request once stopped at the line
};

const rand = (a, b) => a + Math.random() * (b - a);
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)));
const easeOut = t => 1 - (1 - t) * (1 - t);

// Shield outline in a 100 x 116 box, centre at (50, 58).
const SHIELD = 'M50 3 C64 12 80 16 95 16 C95 62 82 96 50 113 C18 96 5 62 5 16 C20 16 36 12 50 3 Z';
const CHECK = 'M33 59 L45 71 L68 46';

// Hit timeline (seconds): flare to grey, swell, hold, shrink to a speck, gone.
const HIT_SWELL = 0.28, HIT_HOLD = 0.55, HIT_SHRINK = 1.0, HIT_END = 1.45;

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
  let raf = 0, last = 0, running = false;

  function layout() {
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, r.width); h = Math.max(1, r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    // sizes follow the width on phones, capped so desktop does not get cartoonish
    unit = Math.min(1.5, Math.max(0.8, Math.min(w, h * 1.1) / 389));
    lineX = Math.round(w * 0.729) + 0.5;
    shieldS = (44 * unit) / 100;
    shieldX = lineX + Math.min(w * 0.148, 120 * unit);
    shieldY = h * 0.5;
    buildBackground();
  }

  // Static layer: navy with a lighter wash behind the line, faint vertical
  // bands, and the filter line itself.
  function buildBackground() {
    bg = document.createElement('canvas');
    bg.width = canvas.width; bg.height = canvas.height;
    const b = bg.getContext('2d');
    b.scale(dpr, dpr);
    const g = b.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, C.bg[0]); g.addColorStop(1, C.bg[1]);
    b.fillStyle = g; b.fillRect(0, 0, w, h);
    const wash = b.createRadialGradient(lineX, h * 0.45, 0, lineX, h * 0.45, Math.max(w, h) * 0.6);
    wash.addColorStop(0, 'rgba(255,255,255,0.035)');
    wash.addColorStop(1, 'rgba(255,255,255,0)');
    b.fillStyle = wash; b.fillRect(0, 0, w, h);

    let x = 0, i = 0;
    while (x < w) {
      const bw = 4 + ((i * 37) % 23);
      b.fillStyle = C.stripe + (0.006 + ((i * 53) % 7) * 0.003) + ')';
      b.fillRect(x, 0, bw, h);
      b.fillStyle = C.stripe + '0.018)';
      b.fillRect(x + bw, 0, 1, h);
      x += bw + 6 + ((i * 29) % 19); i++;
    }

    // the filter line runs the full height, edge to edge
    const top = 0, bot = h;
    b.fillStyle = `rgba(${C.line},0.85)`;
    b.fillRect(lineX - 0.5, top, 1, bot - top);
    const halo = b.createLinearGradient(lineX - 6, 0, lineX + 6, 0);
    halo.addColorStop(0, `rgba(${C.line},0)`);
    halo.addColorStop(0.5, `rgba(${C.line},0.06)`);
    halo.addColorStop(1, `rgba(${C.line},0)`);
    b.globalCompositeOperation = 'lighter';
    b.fillStyle = halo;
    b.fillRect(lineX - 6, top, 12, bot - top);
    b.globalCompositeOperation = 'source-over';
  }

  // Travel time from the left edge to the line: ~3.6 s red, ~1.8 s green,
  // so the rhythm is the same on every screen width.
  function spawn(initial = false) {
    const good = Math.random() < 0.14;
    const travel = good ? rand(1.6, 2.0) : rand(3.0, 4.4);
    const startX = initial ? rand(-20, lineX - 30) : rand(-60, lineX * 0.45);
    dots.push({
      x: startX,
      y: rand(h * 0.12, h * 0.9),
      v: lineX / travel,
      r: 3 * unit,
      tail: rand(44, 54) * unit,
      good,
      state: 'fly',          // fly -> hit (red) -> gone | fly -> off screen (green)
      t: 0,
      alpha: initial ? 1 : 0,
    });
  }

  function update(dt) {
    spawnIn -= dt;
    if (spawnIn <= 0) {
      spawn();
      // about one dot per 26px of height in flight
      spawnIn = (3.7 / Math.max(6, h / 26)) * rand(0.4, 1.6);
    }
    for (const d of dots) {
      d.alpha = Math.min(1, d.alpha + dt * 2.2);
      if (d.state === 'fly') {
        d.x += d.v * dt;
        if (!d.good && d.x >= lineX) { d.x = lineX; d.state = 'hit'; d.t = 0; }
      } else {
        d.t += dt;
      }
    }
    dots = dots.filter(d =>
      d.state === 'hit' ? d.t < HIT_END : d.x - d.tail < w + 10);
  }

  function drawComet(x, y, r, tail, rgb, a, tailA = 0.42, tailRgb = rgb, glow = 1) {
    const [cr, cg, cb] = rgb;
    const [tr, tgc, tb] = tailRgb;
    tail = Math.min(tail, Math.max(0, x + 60));
    if (tail > 1) {
      const tg = ctx.createLinearGradient(x - tail, 0, x, 0);
      tg.addColorStop(0, `rgba(${tr},${tgc},${tb},0)`);
      tg.addColorStop(0.7, `rgba(${tr},${tgc},${tb},${tailA * 0.55 * a})`);
      tg.addColorStop(1, `rgba(${tr},${tgc},${tb},${tailA * a})`);
      ctx.fillStyle = tg;
      ctx.fillRect(x - tail, y - r, tail, r * 2);
    }
    ctx.shadowColor = `rgba(${cr},${cg},${cb},${0.8 * a * glow})`;
    ctx.shadowBlur = r * 2.4 * glow;
    ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawDot(d) {
    if (d.state !== 'hit') {
      drawComet(d.x, d.y, d.r, d.tail, d.good ? C.green : C.red, d.alpha);
      return;
    }
    const t = d.t;
    let scale, tail, a, col;
    if (t < HIT_SWELL) {                         // flare: red -> grey, swell
      const k = easeOut(t / HIT_SWELL);
      col = mix(C.red, C.grey, k);
      scale = lerp(1, 2.8, k);
      tail = d.tail * lerp(1, 1.5, k);
      a = lerp(1, 0.8, k);
    } else if (t < HIT_HOLD) {                   // hold, big and bright
      col = C.grey; scale = 2.8; tail = d.tail * 1.5; a = 0.8;
    } else if (t < HIT_SHRINK) {                 // shrink to a speck, tail retracts
      const k = easeOut((t - HIT_HOLD) / (HIT_SHRINK - HIT_HOLD));
      col = C.grey; scale = lerp(2.8, 0.7, k); tail = d.tail * 1.5 * (1 - k); a = lerp(0.8, 0.55, k);
    } else {                                     // speck fades out
      const k = (t - HIT_SHRINK) / (HIT_END - HIT_SHRINK);
      col = C.grey; scale = 0.7; tail = 0; a = 0.55 * (1 - k);
    }
    // the dot turns grey, the tail stays red: the request is stopped, not changed
    drawComet(d.x, d.y, d.r * scale, tail, col, a * d.alpha, 0.26, C.red, 0.35);
  }

  function drawShield() {
    ctx.save();
    ctx.translate(shieldX - 50 * shieldS, shieldY - 58 * shieldS);
    ctx.scale(shieldS, shieldS);
    ctx.fillStyle = `rgba(${C.goldDark},0.16)`;
    ctx.fill(shieldPath);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.shadowColor = `rgba(${C.gold},0.5)`;
    ctx.shadowBlur = 10 * shieldS * 2;
    // outline runs gold to dark gold, top to bottom
    const sg = ctx.createLinearGradient(0, 0, 0, 116);
    sg.addColorStop(0, `rgb(${C.gold})`);
    sg.addColorStop(1, `rgb(${C.goldDark})`);
    ctx.strokeStyle = sg;
    ctx.lineWidth = 4;
    ctx.stroke(shieldPath);
    ctx.strokeStyle = `rgb(${C.gold})`;
    ctx.lineWidth = 6.5;
    ctx.stroke(checkPath);
    ctx.restore();
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(bg, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // greens pass over the shield, so the shield goes first
    drawShield();
    for (const d of dots) drawDot(d);
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    update(dt);
    render();
    if (running) raf = requestAnimationFrame(frame);
  }

  function seed() {
    dots = [];
    const n = Math.round(h / 32);
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
