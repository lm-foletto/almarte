/* ============================================================
   Almarte — painterly placeholder artwork
   Faithful to the real Almarte canvases: soft pastel washes,
   hand-drawn spirals (espirais) and prominent sparkle-stars,
   over canvas grain. Deterministic per seed.
   Exposes: window.Artwork
   ============================================================ */

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function _lum(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

const SPARKLE =
  "M0,-1 C0.1,-0.32 0.32,-0.1 1,0 C0.32,0.1 0.1,0.32 0,1 C-0.1,0.32 -0.32,0.1 -1,0 C-0.32,-0.1 -0.1,-0.32 0,-1 Z";

/* loose hand-drawn spiral as a polyline path */
function spiralPath(cx, cy, maxR, turns, rnd, startAngle) {
  const steps = Math.max(28, Math.floor(turns * 22));
  const total = turns * Math.PI * 2;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const th = (i / steps) * total;
    const r = (th / total) * maxR;
    const wob = 1 + (rnd() - 0.5) * 0.05;
    const x = cx + Math.cos(th + startAngle) * r * wob;
    const y = cy + Math.sin(th + startAngle) * r * wob;
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1) + " ";
  }
  return d;
}

function Artwork({ palette, seed = 1, sparkle = true, swirls = false, mood = "dreamy", className = "", style = {} }) {
  const rnd = mulberry32(seed * 2654435761);
  const W = 400, H = 500;
  const dreamy = mood !== "deep";

  // base wash colour
  const sorted = [...palette].sort((a, b) => _lum(a) - _lum(b));
  const base = dreamy ? sorted[sorted.length - 1] : sorted[0];

  // colour blobs (soft washes)
  const blobs = [];
  const n = 5 + Math.floor(rnd() * 2);
  for (let i = 0; i < n; i++) {
    blobs.push({
      cx: 40 + rnd() * (W - 80),
      cy: 40 + rnd() * (H - 80),
      rx: 95 + rnd() * 150,
      ry: 95 + rnd() * 150,
      fill: palette[i % palette.length],
      rot: rnd() * 360,
      op: dreamy ? 0.55 + rnd() * 0.32 : 0.82 + rnd() * 0.18,
    });
  }

  // spirals (the signature)
  const spirals = [];
  if (swirls) {
    const sc = 2 + Math.floor(rnd() * 2);
    const inks = palette.filter((c) => _lum(c) < 175);
    for (let i = 0; i < sc; i++) {
      spirals.push({
        cx: 60 + rnd() * (W - 120),
        cy: 70 + rnd() * (H - 140),
        maxR: 38 + rnd() * 64,
        turns: 2.2 + rnd() * 1.6,
        sa: rnd() * Math.PI * 2,
        col: (inks[i % inks.length]) || palette[0],
        w: 2.4 + rnd() * 2.2,
        op: 0.5 + rnd() * 0.3,
      });
    }
  }

  // sparkles
  const stars = [];
  if (sparkle) {
    const sn = (swirls ? 5 : 3) + Math.floor(rnd() * 4);
    const golds = ["#F2C84B", "#EFD79B", "#F4B43E"];
    const purples = ["#A98BC8", "#8E6FB0", "#C9B4DE"];
    for (let i = 0; i < sn; i++) {
      const kind = rnd();
      stars.push({
        x: 44 + rnd() * (W - 88),
        y: 44 + rnd() * (H - 88),
        s: 6 + rnd() * 14,
        op: 0.55 + rnd() * 0.45,
        col: kind > 0.62 ? golds[Math.floor(rnd() * 3)] : kind > 0.32 ? purples[Math.floor(rnd() * 3)] : "#FBF6EC",
        rot: rnd() * 45,
      });
    }
  }

  // tiny accent dots
  const dots = [];
  if (swirls) {
    const dn = 3 + Math.floor(rnd() * 4);
    for (let i = 0; i < dn; i++) {
      dots.push({ x: 40 + rnd() * (W - 80), y: 40 + rnd() * (H - 80), r: 2 + rnd() * 3.5,
        col: palette[Math.floor(rnd() * palette.length)], op: 0.4 + rnd() * 0.4 });
    }
  }

  const pid = `paint-${seed}`;
  const gid = `grain-${seed}`;
  const vid = `vig-${seed}`;

  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="obra abstrata"
    >
      <defs>
        <filter id={pid} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={dreamy ? 20 : 17} result="b" />
          <feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="b" in2="n" scale={dreamy ? 64 : 78} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={gid}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed + 4} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="linear" slope="0.5" /></feComponentTransfer>
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
        <radialGradient id={vid} cx="50%" cy="44%" r="78%">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor={dreamy ? "rgba(45,40,35,0.12)" : "rgba(20,16,12,0.34)"} />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill={base} />

      <g filter={`url(#${pid})`}>
        {blobs.map((b, i) => (
          <g key={i} transform={`rotate(${b.rot} ${b.cx} ${b.cy})`}>
            <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.fill} opacity={b.op} />
          </g>
        ))}
      </g>

      {/* spirals */}
      {spirals.map((s, i) => (
        <path key={i} d={spiralPath(s.cx, s.cy, s.maxR, s.turns, mulberry32(seed * 31 + i * 7), s.sa)}
          fill="none" stroke={s.col} strokeWidth={s.w} strokeLinecap="round" opacity={s.op} />
      ))}

      {/* accent dots */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.col} opacity={d.op} />
      ))}

      {/* depth vignette */}
      <rect width={W} height={H} fill={`url(#${vid})`} />

      {/* sparkles */}
      {stars.map((s, i) => (
        <path key={i} d={SPARKLE} transform={`translate(${s.x} ${s.y}) rotate(${s.rot}) scale(${s.s})`}
          fill={s.col} opacity={s.op} />
      ))}

      {/* canvas grain */}
      <rect width={W} height={H} filter={`url(#${gid})`} opacity={dreamy ? 0.45 : 0.55} style={{ mixBlendMode: "overlay" }} />
      <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="none" stroke="rgba(45,40,35,0.07)" />
    </svg>
  );
}

window.Artwork = Artwork;
