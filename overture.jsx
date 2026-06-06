/* ============================================================
   Almarte — Overture (the entrance / "gerar sentimento")
   Cinematic intro: colour born from darkness while a few lines
   name what the visitor feels, then lifts to reveal the hero.
   Exposes: window.Overture
   ============================================================ */
const { Artwork: ArtworkOv, AL: ALov } = window;

(function injectOvertureCSS() {
  if (document.getElementById("almarte-overture-css")) return;
  const css = `
  .ov { position: fixed; inset: 0; z-index: 800; background: #0E0B09; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    animation: ovLift 5.5s cubic-bezier(.7,0,.25,1) forwards; }
  @keyframes ovLift {
    0%, 78% { opacity: 1; visibility: visible; transform: scale(1); }
    100% { opacity: 0; visibility: hidden; transform: scale(1.06); }
  }

  .ov-color { position: absolute; inset: -8%; }
  .ov-color > svg { width: 100%; height: 100%; }
  .ov-bloom { position: absolute; inset: -8%; animation: ovBloom 5.5s cubic-bezier(.2,.6,.2,1) forwards;
    transform-origin: 50% 46%; }
  @keyframes ovBloom {
    0% { opacity: 0; transform: scale(1.4); }
    26% { opacity: 1; }
    100% { opacity: 0.96; transform: scale(1.0); }
  }
  /* cinematic vignette + darken for legibility and drama */
  .ov-vig { position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(115% 95% at 50% 44%, rgba(14,11,9,0) 22%, rgba(14,11,9,0.5) 60%, rgba(14,11,9,0.88) 100%),
      linear-gradient(rgba(14,11,9,0.18), rgba(14,11,9,0.40)); }

  .ov-stage { position: relative; z-index: 2; text-align: center; padding: 0 24px; width: 100%;
    max-width: 1000px; }
  .ov-lines { position: relative; height: 1px; }
  .ov-line { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%);
    font-family: var(--serif); font-weight: 300; color: #F2E7D6;
    font-size: clamp(1.7rem, 4.6vw, 3.6rem); line-height: 1.16; letter-spacing: -0.015em;
    opacity: 0; text-wrap: balance; text-shadow: 0 2px 40px rgba(0,0,0,0.35); }
  @keyframes ovLine {
    0% { opacity: 0; transform: translateY(calc(-50% + 22px)); filter: blur(8px); }
    18% { opacity: 1; transform: translateY(-50%); filter: blur(0); }
    80% { opacity: 1; transform: translateY(-50%); filter: blur(0); }
    100% { opacity: 0; transform: translateY(calc(-50% - 16px)); filter: blur(6px); }
  }

  .ov-brand { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%);
    opacity: 0; animation: ovBrand 2.1s cubic-bezier(.16,.7,.2,1) 3.7s forwards; }
  @keyframes ovBrand {
    0% { opacity: 0; transform: translateY(calc(-50% + 22px)) scale(.97); filter: blur(12px); }
    42% { opacity: 1; transform: translateY(-50%) scale(1); filter: blur(0); }
    100% { opacity: 1; transform: translateY(-50%) scale(1); filter: blur(0); }
  }
  .ov-mark { font-family: var(--script); color: #F7EFE2; line-height: .9;
    font-size: clamp(4.2rem, 13vw, 9rem); }
  .ov-tag { font-family: var(--serif); font-style: italic; font-weight: 300; color: #E6D6C0;
    font-size: clamp(1rem, 2vw, 1.4rem); letter-spacing: .01em; margin-top: 6px; }

  .ov-skip { position: absolute; bottom: 38px; left: 50%; transform: translateX(-50%); z-index: 3;
    display: inline-flex; align-items: center; gap: 10px; background: none; border: none;
    color: rgba(242,231,214,0.62); font-family: var(--sans); font-size: 12px; letter-spacing: .26em;
    text-transform: uppercase; cursor: pointer; opacity: 0; animation: ovSkipIn .8s ease .25s forwards;
    transition: color .3s; }
  .ov-skip:hover { color: #F2E7D6; }
  .ov-skip .ring { width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(242,231,214,0.4);
    display: grid; place-items: center; font-size: 11px; }
  @keyframes ovSkipIn { to { opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    .ov { animation: none; opacity: 0; visibility: hidden; }
  }
  `;
  const el = document.createElement("style");
  el.id = "almarte-overture-css";
  el.textContent = css;
  document.head.appendChild(el);
})();

function Overture({ t, onEnter }) {
  const ov = t.overture;
  // line windows (s): start + duration, must match the visual rhythm
  const windows = [
    { delay: 0.25, dur: 1.4 },
    { delay: 1.45, dur: 1.45 },
    { delay: 2.75, dur: 1.6 },
  ];
  useEffect(() => {
    const id = setTimeout(() => onEnter(), 5550);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="ov" role="dialog" aria-label="Almarte">
      <div className="ov-color">
        <div className="ov-bloom">
          <ArtworkOv palette={ALov.OVERTURE_PALETTE} seed={3} sparkle={true} style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="ov-vig"></div>
      </div>

      <div className="ov-stage">
        <div className="ov-lines">
          {ov.lines.map((line, i) => (
            <div
              key={i}
              className="ov-line"
              style={{ animation: `ovLine ${windows[i].dur}s cubic-bezier(.16,.7,.2,1) ${windows[i].delay}s both` }}
            >
              {line}
            </div>
          ))}
          <div className="ov-brand">
            <div className="ov-mark">Almarte</div>
            <div className="ov-tag">{ov.tag}</div>
          </div>
        </div>
      </div>

      <button className="ov-skip" onClick={onEnter}>
        <span className="ring">↵</span>{ov.skip}
      </button>
    </div>
  );
}

window.Overture = Overture;
