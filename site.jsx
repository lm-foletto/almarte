/* ============================================================
   Almarte — Ato 1 (the narrative frame / site)
   Nav · Hero (silence) · A História · A Coleção · O Convite · Footer
   Exposes: window.SiteAto1
   ============================================================ */
const { Artwork: ArtworkC, Reveal: RevealC, useReveal: useRevealH, useScrollParallax: useParallaxH, AL: ALdata } = window;

/* ---- component-scoped styles ---- */
(function injectSiteCSS() {
  if (document.getElementById("almarte-site-css")) return;
  const css = `
  .s-wrap { position: relative; }

  /* NAV */
  .s-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px clamp(20px, 5vw, 64px);
    transition: background .6s ease, padding .5s ease, box-shadow .6s ease, border-color .6s ease;
    border-bottom: 1px solid transparent; }
  .s-nav.solid { background: rgba(250,247,241,0.86); backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--line); padding-top: 16px; padding-bottom: 16px; }
  .s-mark { font-family: var(--script); font-size: clamp(30px, 4vw, 40px); line-height: 1;
    color: var(--ink); letter-spacing: .5px; cursor: pointer; padding-top: 6px; }
  .s-navright { display: flex; align-items: center; gap: clamp(16px, 3vw, 34px); }
  .s-navlink { font-size: 12.5px; letter-spacing: .14em; text-transform: uppercase;
    color: var(--ink-soft); text-decoration: none; cursor: pointer; background: none; border: none;
    transition: color .3s; position: relative; }
  .s-navlink:hover { color: var(--accent); }
  .s-navlink::after { content:''; position:absolute; left:0; bottom:-5px; height:1px; width:0; background: var(--accent); transition: width .35s ease; }
  .s-navlink:hover::after { width: 100%; }
  .s-lang { font-size: 12px; letter-spacing: .12em; color: var(--ink); border: 1px solid var(--line);
    background: transparent; border-radius: 40px; padding: 7px 14px; cursor: pointer; transition: all .3s; }
  .s-lang:hover { border-color: var(--accent); color: var(--accent); }
  @media (max-width: 720px){ .s-navlink.hide-sm { display:none; } }

  /* HERO */
  .s-hero { min-height: 100svh; display: grid; grid-template-columns: 0.78fr 1.22fr;
    align-items: center; gap: clamp(30px, 6vw, 96px);
    padding: 150px clamp(20px, 5vw, 64px) 110px; position: relative; }
  .s-hero-text { max-width: 480px; }
  .s-kicker { font-size: 10.5px; letter-spacing: .34em; text-transform: uppercase; color: var(--ink-faint);
    display: inline-block; margin-bottom: 30px; white-space: nowrap; }
  .s-h1 { font-family: var(--serif); font-weight: 300; font-size: clamp(2.3rem, 4.9vw, 4rem);
    line-height: 1.06; letter-spacing: -0.02em; color: var(--ink); }
  .s-h1 em { font-style: italic; color: var(--accent-deep); font-weight: 300; }
  .s-hero-sub { font-size: clamp(15px, 1.5vw, 18px); color: var(--ink-soft); margin-top: 26px;
    max-width: 360px; line-height: 1.7; }
  .s-hero-links { display: flex; align-items: center; gap: 24px; margin-top: 40px; flex-wrap: wrap; }
  .s-link-q { font-size: 13.5px; letter-spacing: .02em; color: var(--ink-soft); text-decoration: none;
    border: none; background: none; cursor: pointer; display: inline-flex; align-items: center; gap: 9px;
    position: relative; padding-bottom: 4px; transition: color .3s; }
  .s-link-q .ln { position: absolute; left: 0; bottom: 0; height: 1px; width: 100%; background: var(--line); }
  .s-link-q .ln::after { content:''; position:absolute; inset:0; width:0; background: var(--accent); transition: width .4s ease; }
  .s-link-q:hover { color: var(--accent); }
  .s-link-q:hover .ln::after { width: 100%; }
  .s-link-q .ar { transition: transform .4s ease; }
  .s-link-q:hover .ar { transform: translateX(4px); }
  .s-link-create { color: var(--accent-deep); background: transparent; padding: 10px 20px; border-radius: 40px;
    font-size: 13.5px; letter-spacing: .02em; border: 1px solid var(--accent); cursor: pointer;
    transition: background .35s, color .35s, transform .35s; }
  .s-link-create:hover { background: var(--accent); color: #fff; transform: translateY(-1px); }

  .s-hero-art { position: relative; justify-self: center; width: 100%; max-width: 540px; }
  .s-canvas { position: relative; border-radius: 2px; overflow: hidden;
    box-shadow: 0 40px 90px -30px rgba(45,40,35,0.4), 0 8px 24px -12px rgba(45,40,35,0.25);
    aspect-ratio: 4/5; background: var(--bg-deep); }
  .s-canvas-frame { position: absolute; inset: 0; border: 1px solid rgba(255,255,255,0.35);
    box-shadow: inset 0 0 0 10px rgba(250,247,241,0.0); pointer-events: none; }
  .s-hero-fade { animation: heroBorn 1.8s cubic-bezier(.16,.7,.2,1) .25s both; }
  @keyframes heroBorn { from { opacity: 0; transform: scale(1.05); filter: blur(10px); } to { opacity: 1; transform: none; filter: blur(0); } }

  .s-scrollcue { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--ink-faint); }
  .s-scrollcue span { font-size: 10.5px; letter-spacing: .3em; text-transform: uppercase; }
  .s-scrollcue .dot { width: 1px; height: 46px; background: linear-gradient(var(--ink-faint), transparent);
    position: relative; overflow: hidden; }
  .s-scrollcue .dot::after { content:''; position:absolute; top:-50%; left:0; width:1px; height:50%;
    background: var(--accent); animation: cuefall 2.6s cubic-bezier(.7,0,.3,1) infinite; }
  @keyframes cuefall { 0%{ transform: translateY(-100%);} 60%,100%{ transform: translateY(300%);} }

  @media (max-width: 860px){
    .s-hero { grid-template-columns: 1fr; text-align: left; padding: 104px 22px 70px; min-height: 100svh;
      gap: 30px; align-content: center; }
    .s-hero-art { max-width: 90vw; order: -1; margin-bottom: 4px; justify-self: center; }
    .s-canvas { height: 56vh; width: auto; aspect-ratio: 4/5; max-width: 90vw; margin: 0 auto; }
    .s-hero-text { max-width: 100%; }
    .s-scrollcue { display: none; }
  }

  /* SECTION shell */
  .s-sec { padding: clamp(80px, 13vh, 170px) clamp(20px, 5vw, 64px); position: relative; }
  .s-secnum { font-family: var(--serif); font-weight: 300; font-size: clamp(13px,1vw,14px);
    letter-spacing: .3em; color: var(--accent); }
  .s-seckick { font-size: 12px; letter-spacing: .3em; text-transform: uppercase; color: var(--ink-soft); white-space: nowrap; }
  .s-eyebrow { display: flex; align-items: center; gap: 16px; margin-bottom: 30px; }
  .s-eyebrow .rule { height: 1px; width: 46px; background: var(--line); }

  /* STORY */
  .s-story { display: grid; grid-template-columns: 0.82fr 1.18fr; gap: clamp(36px, 6vw, 96px); align-items: center;
    max-width: 1220px; margin: 0 auto; }
  .s-story-h { font-family: var(--serif); font-weight: 300; font-size: clamp(1.9rem, 3.6vw, 3.1rem);
    line-height: 1.12; letter-spacing: -0.015em; white-space: pre-line; margin: 6px 0 30px; }
  .s-story-h em { font-style: italic; color: var(--accent-deep); }
  .s-story-p { font-size: clamp(15px, 1.35vw, 17.5px); color: var(--ink-soft); line-height: 1.78;
    max-width: 540px; margin-bottom: 18px; }
  .s-sign { font-family: var(--script); font-size: 46px; color: var(--accent-deep); margin-top: 12px; line-height: 1; }
  @media (max-width: 860px){ .s-story { grid-template-columns: 1fr; } }

  /* PHOTO placeholder */
  .s-photo { position: relative; aspect-ratio: 4/5; border-radius: 2px; overflow: hidden;
    background: repeating-linear-gradient(135deg, #EFE8DC 0 14px, #EAE2D4 14px 28px);
    border: 1px solid var(--line); box-shadow: 0 30px 70px -34px rgba(45,40,35,0.35);
    display: flex; align-items: center; justify-content: center; }
  .s-photo span { font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: .12em;
    text-transform: uppercase; color: var(--ink-faint); background: rgba(250,247,241,.7);
    padding: 6px 12px; border-radius: 3px; }

  /* COLLECTION */
  .s-col-intro { max-width: 720px; margin: 0 auto clamp(50px,8vh,96px); text-align: center; }
  .s-col-h { font-family: var(--serif); font-weight: 300; font-size: clamp(2rem, 4.4vw, 3.5rem);
    line-height: 1.08; letter-spacing: -0.02em; margin: 6px 0 24px; }
  .s-col-body { font-size: clamp(15px,1.45vw,18px); color: var(--ink-soft); line-height: 1.75; max-width: 560px; margin: 0 auto; }
  .s-col-note { font-size: 12px; color: var(--ink-faint); letter-spacing: .04em; margin-top: 26px; font-style: italic; }
  .s-eyebrow.center { justify-content: center; }
  .s-arc { display: inline-flex; align-items: center; gap: 14px; margin-top: 22px;
    font-size: 11.5px; letter-spacing: .28em; text-transform: uppercase; color: var(--accent); }
  .s-arc-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); opacity: .6; }

  /* drawing-rule eyebrow animation (cinematic reveal) */
  .s-eyebrow .rule { width: 0; transition: width 1.1s cubic-bezier(.16,.7,.2,1) .15s; }
  .rv.in .rule { width: 46px; }

  /* WASH DIVIDER — colour bleeding between moments */
  .s-wash-div { position: relative; height: clamp(130px, 24vh, 260px); overflow: hidden; }
  .s-wash-art { position: absolute; inset: -28% 0; opacity: .5; filter: blur(16px); will-change: transform; }
  .s-wash-grad { position: absolute; inset: 0; pointer-events: none; }

  /* TESTIMONIALS */
  .s-test-intro { max-width: 760px; margin: 0 auto clamp(46px,7vh,84px); text-align: center; }
  .s-test-h { font-family: var(--serif); font-weight: 300; font-size: clamp(1.8rem, 3.8vw, 3rem);
    line-height: 1.12; letter-spacing: -0.018em; white-space: pre-line; margin-top: 6px; }
  .s-test-h em { font-style: italic; color: var(--accent-deep); }
  .s-test-grid { max-width: 1140px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr);
    gap: clamp(18px, 2.4vw, 30px); }
  .s-test-card { background: var(--surface); border: 1px solid var(--line); border-radius: 20px;
    padding: clamp(26px, 2.6vw, 38px); display: flex; flex-direction: column;
    box-shadow: 0 30px 70px -44px rgba(45,40,35,0.32); position: relative; overflow: hidden; }
  .s-test-card::before { content: "\\201C"; position: absolute; top: -22px; right: 18px;
    font-family: var(--serif); font-size: 110px; color: var(--accent-soft); line-height: 1; }
  .s-test-quote { font-family: var(--serif); font-weight: 300; font-style: italic;
    font-size: clamp(16px, 1.5vw, 19px); line-height: 1.55; color: var(--ink); position: relative; z-index: 1; }
  .s-test-by { margin-top: auto; padding-top: 24px; display: flex; align-items: center; gap: 12px; }
  .s-test-orb { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
    box-shadow: inset 0 0 0 1px rgba(45,40,35,0.08); }
  .s-test-who { display: flex; flex-direction: column; gap: 3px; }
  .s-test-name { font-size: 14.5px; font-weight: 600; color: var(--ink); line-height: 1.25; }
  .s-test-role { font-size: 12.5px; color: var(--ink-soft); letter-spacing: .01em; line-height: 1.25; }
  @media (max-width: 820px){ .s-test-grid { grid-template-columns: 1fr; max-width: 520px; } }

  .s-works { max-width: 1180px; margin: 0 auto; display: flex; flex-direction: column; gap: clamp(70px, 12vh, 150px); }
  .s-work { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(30px, 5vw, 80px); align-items: center; }
  .s-work.alt { direction: rtl; }
  .s-work.alt > * { direction: ltr; }
  .s-work-frame { position: relative; aspect-ratio: 4/5; padding: clamp(14px, 1.6vw, 22px);
    background: #fff; border: 1px solid var(--line);
    box-shadow: 0 44px 100px -40px rgba(45,40,35,0.42), 0 10px 30px -16px rgba(45,40,35,0.22); }
  .s-work-canvas { position: relative; width: 100%; height: 100%; overflow: hidden;
    transition: filter 1.5s ease, transform 1.6s cubic-bezier(.16,.7,.2,1), opacity 1.3s ease;
    filter: blur(16px) saturate(.55); transform: scale(1.07); opacity: 0; }
  .s-work-canvas.born { filter: blur(0) saturate(1); transform: scale(1); opacity: 1; }
  .s-work-meta { max-width: 420px; }
  .s-work-feel { display: inline-block; font-size: 11.5px; letter-spacing: .26em; text-transform: uppercase;
    color: var(--accent); padding-bottom: 14px; }
  .s-work-title { font-family: var(--serif); font-weight: 400; font-style: italic;
    font-size: clamp(1.7rem, 3vw, 2.5rem); line-height: 1.1; letter-spacing: -0.01em; }
  .s-work-line { font-size: clamp(15px,1.35vw,17px); color: var(--ink-soft); line-height: 1.7; margin: 20px 0 26px; }
  .s-work-med { font-size: 11.5px; letter-spacing: .15em; text-transform: uppercase; color: var(--ink-faint);
    display: flex; align-items: center; gap: 12px; }
  .s-work-med .rule { height:1px; width: 30px; background: var(--line); }
  @media (max-width: 760px){
    .s-work, .s-work.alt { grid-template-columns: 1fr; direction: ltr; gap: 26px; }
    .s-work-frame { max-width: 360px; }
  }

  /* PROCESS (video) */
  .s-process { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr;
    gap: clamp(34px, 5vw, 80px); align-items: center; }
  .s-video { position: relative; aspect-ratio: 16/9; border-radius: 4px; overflow: hidden;
    background: #1a1714; box-shadow: 0 44px 100px -44px rgba(45,40,35,0.5); cursor: pointer; }
  .s-video-art { position: absolute; inset: 0; opacity: .42; }
  .s-video-veil { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(26,23,20,.2), rgba(26,23,20,.72)); }
  .s-video-play { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
  .s-play-circle { width: 76px; height: 76px; border-radius: 50%; border: 1px solid rgba(247,239,226,0.6);
    background: rgba(247,239,226,0.08); display: grid; place-items: center;
    transition: background .35s, transform .35s, border-color .35s; }
  .s-video:hover .s-play-circle { background: rgba(247,239,226,0.16); transform: scale(1.06); border-color: rgba(247,239,226,0.9); }
  .s-play-tri { width: 0; height: 0; border-top: 11px solid transparent; border-bottom: 11px solid transparent;
    border-left: 18px solid #F7EFE2; margin-left: 5px; }
  .s-video-watch { font-size: 11.5px; letter-spacing: .3em; text-transform: uppercase; color: rgba(247,239,226,0.85); }
  .s-process-meta { max-width: 380px; }
  .s-process-h { font-family: var(--serif); font-weight: 300; font-size: clamp(1.9rem, 3.6vw, 3rem);
    line-height: 1.1; letter-spacing: -0.015em; white-space: pre-line; margin: 6px 0 22px; }
  .s-process-body { font-size: clamp(15px,1.35vw,17px); color: var(--ink-soft); line-height: 1.7; }
  .s-process-note { font-family: var(--serif); font-style: italic; font-size: 15px; color: var(--accent-deep);
    margin-top: 26px; line-height: 1.5; }
  @media (max-width: 860px){ .s-process { grid-template-columns: 1fr; } .s-process-meta { max-width: 100%; } }

  /* IMAGINE (wall mockups) */
  .s-imagine-intro { max-width: 720px; margin: 0 auto clamp(44px,7vh,80px); text-align: center; }
  .s-imagine-h { font-family: var(--serif); font-weight: 300; font-size: clamp(2rem, 4.2vw, 3.3rem);
    line-height: 1.08; letter-spacing: -0.02em; margin: 6px 0 22px; }
  .s-imagine-body { font-size: clamp(15px,1.4vw,18px); color: var(--ink-soft); line-height: 1.7; max-width: 540px; margin: 0 auto; }
  .s-mockups { max-width: 1080px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(22px, 3vw, 40px); }
  .s-mockup { display: flex; flex-direction: column; gap: 16px; }
  .s-wall { position: relative; aspect-ratio: 4/3; border-radius: 4px; overflow: hidden;
    background: linear-gradient(160deg, #F3EFE7 0%, #EBE4D7 100%);
    box-shadow: inset 0 0 80px rgba(45,40,35,0.05); display: flex; align-items: center; justify-content: center; }
  .s-wall::after { content:''; position:absolute; left:0; right:0; bottom:0; height: 26%;
    background: linear-gradient(transparent, rgba(45,40,35,0.045)); }
  .s-wall-frame { position: relative; height: 70%; aspect-ratio: 4/5; background: #fff; padding: 9px;
    box-shadow: 0 24px 50px -22px rgba(45,40,35,0.45), 0 6px 14px -8px rgba(45,40,35,0.3);
    border: 1px solid rgba(45,40,35,0.06); z-index: 1; }
  .s-wall-canvas { width: 100%; height: 100%; overflow: hidden; }
  .s-mockup-cap { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-soft); text-align: center; }
  .s-imagine-note { text-align: center; font-family: var(--serif); font-style: italic; font-size: clamp(15px,1.5vw,18px);
    color: var(--accent-deep); max-width: 540px; margin: clamp(40px,6vh,64px) auto 0; line-height: 1.55; }
  @media (max-width: 760px){ .s-mockups { grid-template-columns: 1fr; max-width: 420px; } }

  /* HOW IT WORKS */
  .s-how-intro { max-width: 720px; margin: 0 auto clamp(48px,7vh,84px); text-align: center; }
  .s-how-h { font-family: var(--serif); font-weight: 300; font-size: clamp(2rem, 4.2vw, 3.3rem);
    line-height: 1.08; letter-spacing: -0.02em; margin-top: 6px; }
  .s-steps { max-width: 1140px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr);
    gap: clamp(16px, 2.2vw, 30px); position: relative; }
  .s-step { text-align: center; position: relative; }
  .s-step-ico { width: 62px; height: 62px; margin: 0 auto 20px; border-radius: 50%; background: var(--surface);
    border: 1px solid var(--line); display: grid; place-items: center; color: var(--accent); position: relative; z-index: 2; }
  .s-step-ico svg { width: 28px; height: 28px; }
  .s-step-n { font-family: var(--serif); font-size: 12px; color: var(--accent); letter-spacing: .2em; display: block; margin-bottom: 8px; }
  .s-step-t { font-family: var(--serif); font-weight: 500; font-size: clamp(16px,1.5vw,19px); color: var(--ink); margin-bottom: 8px; }
  .s-step-b { font-size: 13.5px; color: var(--ink-soft); line-height: 1.55; max-width: 220px; margin: 0 auto; }
  .s-step-link { position: absolute; top: 31px; left: 50%; width: 100%; height: 1px; z-index: 1;
    background-image: linear-gradient(to right, var(--ink-faint) 35%, rgba(0,0,0,0) 0%);
    background-size: 8px 1px; background-repeat: repeat-x; opacity: .5; }
  .s-step:last-child .s-step-link { display: none; }
  @media (max-width: 760px){
    .s-steps { grid-template-columns: 1fr; gap: 34px; max-width: 360px; }
    .s-step-link { display: none; }
  }

  /* FOOTER NEWSLETTER */
  .s-news { margin-top: 16px; }
  .s-news-title { font-family: var(--serif); font-style: italic; font-weight: 300; font-size: 16px; color: var(--ink-soft); margin-bottom: 12px; }
  .s-news-form { display: flex; gap: 8px; max-width: 340px; }
  .s-news-input { flex: 1; min-width: 0; border: 1px solid var(--line); border-radius: 40px; padding: 11px 18px;
    font-size: 14px; font-family: var(--sans); color: var(--ink); background: var(--surface); outline: none; transition: border-color .25s; }
  .s-news-input:focus { border-color: var(--accent); }
  .s-news-input.err { border-color: #C0492B; }
  .s-news-btn { border: none; background: var(--accent); color: #fff; border-radius: 50%; width: 42px; height: 42px;
    flex-shrink: 0; cursor: pointer; font-size: 17px; transition: background .3s, transform .3s; }
  .s-news-btn:hover { background: var(--accent-deep); transform: translateY(-1px); }
  .s-news-note { font-size: 11.5px; color: var(--ink-faint); letter-spacing: .03em; margin-top: 10px; }
  .s-news-done { font-family: var(--serif); font-style: italic; font-size: 15px; color: var(--accent-deep); }

  /* INVITE */
  .s-invite { position: relative; text-align: center; overflow: hidden;
    padding: clamp(110px, 20vh, 220px) clamp(20px,5vw,64px); }
  .s-invite-wash { position: absolute; inset: -10% -10% auto -10%; height: 120%; opacity: .5;
    filter: blur(8px); pointer-events: none; }
  .s-invite-inner { position: relative; max-width: 760px; margin: 0 auto; }
  .s-invite-h { font-family: var(--serif); font-weight: 300; font-size: clamp(2.6rem, 7vw, 5.6rem);
    line-height: 1.0; letter-spacing: -0.025em; }
  .s-invite-h em { font-style: italic; color: var(--accent-deep); }
  .s-invite-body { font-size: clamp(16px, 1.6vw, 19px); color: var(--ink-soft); line-height: 1.7;
    max-width: 520px; margin: 34px auto 44px; }
  .s-invite-cta { font-size: 16px; letter-spacing: .01em; color: #fff; background: var(--accent);
    border: none; border-radius: 44px; padding: 19px 44px; cursor: pointer; display: inline-flex; align-items: center; gap: 12px;
    transition: background .35s, transform .35s, box-shadow .35s; box-shadow: 0 16px 40px -14px rgba(153,60,29,.4); }
  .s-invite-cta:hover { background: var(--accent-deep); transform: translateY(-3px); box-shadow: 0 24px 54px -16px rgba(153,60,29,.5); }
  .s-invite-cta .ar { transition: transform .4s ease; }
  .s-invite-cta:hover .ar { transform: translateX(5px); }
  .s-invite-time { font-size: 12.5px; letter-spacing: .05em; color: var(--ink-faint); margin-top: 22px; }

  /* FOOTER */
  .s-foot { border-top: 1px solid var(--line); padding: clamp(50px,8vh,80px) clamp(20px,5vw,64px) 44px;
    display: grid; grid-template-columns: 1fr auto; gap: 30px; align-items: end; max-width: 1280px; margin: 0 auto; }
  .s-foot-mark { font-family: var(--script); font-size: 42px; color: var(--ink); line-height: 1; }
  .s-foot-tag { font-family: var(--serif); font-style: italic; font-weight: 300; font-size: 18px; color: var(--ink-soft); margin-top: 10px; }
  .s-foot-right { text-align: right; display: flex; flex-direction: column; gap: 12px; align-items: flex-end; }
  .s-foot-link { font-size: 13px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-soft);
    text-decoration: none; cursor: pointer; transition: color .3s; }
  .s-foot-link:hover { color: var(--accent); }
  .s-foot-note { font-size: 11.5px; color: var(--ink-faint); letter-spacing: .04em; }
  @media (max-width: 640px){ .s-foot { grid-template-columns: 1fr; } .s-foot-right{ text-align:left; align-items:flex-start; } }

  /* ---- PHONE refinements ---- */
  @media (max-width: 560px){
    .s-nav { padding: 16px 18px; }
    .s-mark { font-size: 30px; }
    .s-navright { gap: 14px; }
    .s-navlink { font-size: 12px; }
    .s-lang { padding: 9px 15px; }            /* ≥44px touch */
    .s-hero { padding: 100px 22px 64px; gap: 34px; }
    .s-hero-art { max-width: 78vw; }
    .s-h1 { font-size: clamp(2.5rem, 12vw, 3.3rem); }
    .s-link-create { padding: 14px 26px; }
    .s-sec { padding: 72px 22px; }
    .s-story { gap: 30px; }
    .s-photo { max-width: 78vw; }
    .s-work-frame { max-width: 82vw; margin: 0 auto; }
    .s-test-card { padding: 26px 24px; }
    .s-invite { padding: 96px 22px; }
    .s-invite-cta { padding: 18px 34px; width: 100%; max-width: 340px; justify-content: center; }
    .s-arc { text-align: center; }
  }
  /* avoid sideways overscroll from wash bleed on small screens */
  @media (max-width: 560px){ .s-wash-div { height: clamp(96px, 18vh, 160px); } }
  `;
  const el = document.createElement("style");
  el.id = "almarte-site-css";
  el.textContent = css;
  document.head.appendChild(el);
})();

/* ---- Nav ---- */
function Nav({ t, onToggleLang, onCreate, onNav }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`s-nav ${solid ? "solid" : ""}`}>
      <div className="s-mark" onClick={() => onNav("top")}>Almarte</div>
      <div className="s-navright">
        <button className="s-navlink hide-sm" onClick={() => onNav("story")}>{t.nav.story}</button>
        <button className="s-navlink hide-sm" onClick={() => onNav("works")}>{t.nav.works}</button>
        <button className="s-navlink" onClick={onCreate}>{t.nav.create}</button>
        <button className="s-lang" onClick={onToggleLang}>{t.langLabel}</button>
      </div>
    </nav>
  );
}

/* ---- Hero ---- */
function Hero({ t, onCreate, onNav }) {
  const [pRef, p] = useParallaxH();
  return (
    <section className="s-hero" id="top">
      <div className="s-hero-text">
        <RevealC as="span" className="s-kicker">{t.hero.kicker}</RevealC>
        <h1 className="s-h1">
          <RevealC as="span" delay={80} style={{ display: "block" }}>{t.hero.title[0]}</RevealC>
          <RevealC as="span" delay={220} style={{ display: "block" }}><em>{t.hero.title[1]}</em></RevealC>
        </h1>
        <RevealC as="p" className="s-hero-sub" delay={360}>{t.hero.sub}</RevealC>
        <RevealC className="s-hero-links" delay={480}>
          <button className="s-link-q" id="ga-hero-works" onClick={() => onNav("works")}>
            {t.hero.seeWorks}<span className="ar">↓</span><span className="ln"></span>
          </button>
          <button className="s-link-create" id="ga-hero-create" onClick={onCreate}>{t.hero.create}</button>
        </RevealC>
      </div>

      <div className="s-hero-art" ref={pRef}>
        <div className="s-canvas" style={{ transform: `translateY(${(p - 0.5) * -36}px)` }}>
          <div className="s-hero-fade" style={{ position: "absolute", inset: 0 }}>
            <ArtworkC palette={ALdata.HERO_PALETTE} seed={3} swirls={true} style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="s-canvas-frame"></div>
        </div>
      </div>

      <div className="s-scrollcue">
        <div className="dot"></div>
        <span>{t.hero.scroll}</span>
      </div>
    </section>
  );
}

/* ---- Story (the guide) ---- */
function Story({ t }) {
  return (
    <section className="s-sec" id="story">
      <div className="s-story">
        <RevealC className="s-photo" slow>
          <span>{t.story.caption}</span>
        </RevealC>
        <div>
          <RevealC className="s-eyebrow">
            <span className="s-secnum">{t.story.num}</span>
            <span className="rule"></span>
            <span className="s-seckick">{t.story.kicker}</span>
          </RevealC>
          <RevealC as="h2" className="s-story-h" delay={80}>{t.story.title}</RevealC>
          {t.story.body.map((p, i) => (
            <RevealC as="p" className="s-story-p" key={i} delay={140 + i * 90}>{p}</RevealC>
          ))}
          <RevealC className="s-sign" delay={420}>{t.story.signature}</RevealC>
        </div>
      </div>
    </section>
  );
}

/* ---- Collection item with "born on screen" reveal ---- */
function Work({ w, t, alt, i }) {
  const [ref, shown] = useRevealH({ offset: 0.78 });
  return (
    <div className={`s-work ${alt ? "alt" : ""}`} ref={ref} data-ga="view-artwork" data-artwork-id={w.id}>
      <div className="s-work-frame">
        <div className={`s-work-canvas ${shown ? "born" : ""}`}>
          <ArtworkC palette={w.palette} seed={w.seed} swirls={true} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      <div className="s-work-meta">
        <RevealC className="s-work-feel" delay={120}>{w.feeling[t._lang]}</RevealC>
        <RevealC as="h3" className="s-work-title" delay={180}>{w.title[t._lang]}</RevealC>
        <RevealC as="p" className="s-work-line" delay={250}>{w.line[t._lang]}</RevealC>
        <RevealC className="s-work-med" delay={320}>
          <span className="rule"></span>{t.collection.mediumLabel}
        </RevealC>
      </div>
    </div>
  );
}

/* ---- Collection ---- */
function Collection({ t }) {
  return (
    <section className="s-sec" id="works" style={{ background: "var(--bg-deep)" }}>
      <div className="s-col-intro">
        <RevealC className="s-eyebrow center">
          <span className="s-secnum">{t.collection.num}</span>
          <span className="rule"></span>
          <span className="s-seckick">{t.collection.kicker}</span>
        </RevealC>
        <RevealC as="h2" className="s-col-h" delay={80}>{t.collection.title}</RevealC>
        <RevealC as="p" className="s-col-body" delay={160}>{t.collection.body}</RevealC>
        <RevealC className="s-arc" delay={220}>
          <span className="s-arc-dot"></span>{t.collection.arc}<span className="s-arc-dot"></span>
        </RevealC>
        <RevealC className="s-col-note" delay={300}>{t.collection.note}</RevealC>
      </div>
      <div className="s-works">
        {ALdata.collection.map((w, i) => (
          <Work key={w.id} w={w} t={t} alt={i % 2 === 1} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ---- Wash divider (cinematic colour bleed between sections) ---- */
function WashDivider({ seed, from, to }) {
  const [ref, off] = useParallaxH();
  return (
    <div className="s-wash-div" ref={ref} aria-hidden="true">
      <div className="s-wash-art" style={{ transform: `translateY(${(off - 0.5) * -46}px) scale(1.18)` }}>
        <ArtworkC palette={ALdata.HERO_PALETTE} seed={seed} sparkle={false} swirls={false} style={{ width: "100%", height: "100%" }} />
      </div>
      <div className="s-wash-grad" style={{ background: `linear-gradient(${from} 2%, rgba(0,0,0,0) 42%, rgba(0,0,0,0) 58%, ${to} 98%)` }}></div>
    </div>
  );
}

/* ---- Testimonials (closing the loop / social proof) ---- */
function Testimonials({ t }) {
  const ts = t.testimonials;
  return (
    <section className="s-sec" id="testimonials">
      <div className="s-test-intro">
        <RevealC className="s-eyebrow center">
          <span className="s-secnum">{ts.num}</span>
          <span className="rule"></span>
          <span className="s-seckick">{ts.kicker}</span>
        </RevealC>
        <RevealC as="h2" className="s-test-h" delay={80}>{ts.title}</RevealC>
      </div>
      <div className="s-test-grid">
        {ts.items.map((it, i) => (
          <RevealC className="s-test-card" key={i} delay={i * 120}>
            <p className="s-test-quote">{it.quote}</p>
            <div className="s-test-by">
              <div className="s-test-orb">
                <ArtworkC palette={ALdata.collection[(i * 2) % ALdata.collection.length].palette} seed={40 + i * 9} sparkle={false} style={{ width: "100%", height: "100%" }} />
              </div>
              <div className="s-test-who">
                <div className="s-test-name">{it.name}</div>
                <div className="s-test-role">{it.role}</div>
              </div>
            </div>
          </RevealC>
        ))}
      </div>
    </section>
  );
}

/* ---- Process (the human hand / video) ---- */
function Process({ t }) {
  const p = t.process;
  return (
    <section className="s-sec" id="process">
      <div className="s-process">
        <RevealC className="s-video" slow>
          <div className="s-video-art">
            <ArtworkC palette={ALdata.HERO_PALETTE} seed={17} swirls={true} mood="deep" style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="s-video-veil"></div>
          <div className="s-video-play">
            <div className="s-play-circle"><div className="s-play-tri"></div></div>
            <span className="s-video-watch">{p.watch}</span>
          </div>
        </RevealC>
        <div className="s-process-meta">
          <RevealC className="s-eyebrow">
            <span className="s-secnum">{p.num}</span>
            <span className="rule"></span>
            <span className="s-seckick">{p.kicker}</span>
          </RevealC>
          <RevealC as="h2" className="s-process-h" delay={80}>{p.title}</RevealC>
          <RevealC as="p" className="s-process-body" delay={150}>{p.body}</RevealC>
          <RevealC as="p" className="s-process-note" delay={230}>{p.note}</RevealC>
        </div>
      </div>
    </section>
  );
}

/* ---- Imagine (wall mockups) ---- */
function Imagine({ t }) {
  const im = t.imagine;
  const picks = [ALdata.collection[1], ALdata.collection[5], ALdata.collection[3]];
  return (
    <section className="s-sec" id="imagine">
      <div className="s-imagine-intro">
        <RevealC className="s-eyebrow center">
          <span className="s-secnum">{im.num}</span>
          <span className="rule"></span>
          <span className="s-seckick">{im.kicker}</span>
        </RevealC>
        <RevealC as="h2" className="s-imagine-h" delay={80}>{im.title}</RevealC>
        <RevealC as="p" className="s-imagine-body" delay={150}>{im.body}</RevealC>
      </div>
      <div className="s-mockups">
        {picks.slice(0, 2).map((w, i) => (
          <RevealC className="s-mockup" key={w.id} delay={i * 130}>
            <div className="s-wall">
              <div className="s-wall-frame">
                <div className="s-wall-canvas">
                  <ArtworkC palette={w.palette} seed={w.seed} swirls={true} style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
            </div>
            <div className="s-mockup-cap">{im.rooms[i]}</div>
          </RevealC>
        ))}
      </div>
      <RevealC as="p" className="s-imagine-note">{im.note}</RevealC>
    </section>
  );
}

/* ---- How it works (4 steps) ---- */
const StepIcon = ({ kind }) => {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "chat") return (
    <svg viewBox="0 0 24 24" {...common}><path d="M4 5h16v11H9l-4 3v-3H4z" /><path d="M8 9.5h8M8 12.5h5" /></svg>
  );
  if (kind === "brush") return (
    <svg viewBox="0 0 24 24" {...common}><path d="M15 4l5 5-8.5 8.5a3 3 0 0 1-2 .9l-3.2.3.3-3.2a3 3 0 0 1 .9-2z" /><path d="M5 19c1.5.6 3-.4 3-2" /></svg>
  );
  if (kind === "box") return (
    <svg viewBox="0 0 24 24" {...common}><path d="M4 8l8-4 8 4v8l-8 4-8-4z" /><path d="M4 8l8 4 8-4M12 12v8" /></svg>
  );
  return (
    <svg viewBox="0 0 24 24" {...common}><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M8 15l3-3.5 2.5 2.5 1.5-2 2 3" /><circle cx="9" cy="9" r="1.2" /></svg>
  );
};

function HowItWorks({ t }) {
  const h = t.howItWorks;
  return (
    <section className="s-sec" id="how" style={{ background: "var(--bg-deep)" }}>
      <div className="s-how-intro">
        <RevealC className="s-eyebrow center">
          <span className="s-secnum">{h.num}</span>
          <span className="rule"></span>
          <span className="s-seckick">{h.kicker}</span>
        </RevealC>
        <RevealC as="h2" className="s-how-h" delay={80}>{h.title}</RevealC>
      </div>
      <div className="s-steps">
        {h.steps.map((s, i) => (
          <RevealC className="s-step" key={i} delay={i * 130}>
            <div className="s-step-link"></div>
            <div className="s-step-ico"><StepIcon kind={s.icon} /></div>
            <span className="s-step-n">0{i + 1}</span>
            <div className="s-step-t">{s.title}</div>
            <p className="s-step-b">{s.body}</p>
          </RevealC>
        ))}
      </div>
    </section>
  );
}

/* ---- Invite (handoff) ---- */
function Invite({ t, onCreate }) {
  return (
    <section className="s-invite" id="invite">
      <div className="s-invite-wash">
        <ArtworkC palette={ALdata.HERO_PALETTE} seed={11} sparkle={false} swirls={true} style={{ width: "100%", height: "100%" }} />
      </div>
      <div className="s-invite-inner">
        <RevealC className="s-eyebrow center">
          <span className="s-secnum">{t.invite.num}</span>
          <span className="rule"></span>
          <span className="s-seckick">{t.invite.kicker}</span>
        </RevealC>
        <h2 className="s-invite-h">
          <RevealC as="span" style={{ display: "block" }}>{t.invite.title[0]}</RevealC>
          <RevealC as="span" delay={120} style={{ display: "block" }}><em>{t.invite.title[1]}</em></RevealC>
        </h2>
        <RevealC as="p" className="s-invite-body" delay={220}>{t.invite.body}</RevealC>
        <RevealC delay={320}>
          <button className="s-invite-cta" id="ga-invite-create" onClick={onCreate}>
            {t.invite.cta}<span className="ar">→</span>
          </button>
          <div className="s-invite-time">{t.invite.time}</div>
        </RevealC>
      </div>
    </section>
  );
}

/* ---- Footer ---- */
function Footer({ t, onNav }) {
  const wa = `https://wa.me/${ALdata.WA_NUMBER}`;
  const ig = `https://www.instagram.com/${ALdata.IG_HANDLE}/`;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);
  const submit = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) { setErr(true); return; }
    try {
      const subs = JSON.parse(localStorage.getItem("almarte_subscribers") || "[]");
      subs.push({ email: email.trim(), at: new Date().toISOString() });
      localStorage.setItem("almarte_subscribers", JSON.stringify(subs));
    } catch (e) {}
    setDone(true);
  };
  return (
    <footer className="s-foot">
      <div>
        <div className="s-foot-mark">Almarte</div>
        <div className="s-foot-tag">{t.footer.tag}</div>
        <div className="s-news">
          {done ? (
            <div className="s-news-done">{t.footer.newsDone}</div>
          ) : (
            <React.Fragment>
              <div className="s-news-title">{t.footer.newsTitle}</div>
              <div className="s-news-form" id="ga-email-signup">
                <input className={`s-news-input ${err ? "err" : ""}`} type="email" inputMode="email"
                  placeholder={t.footer.newsPlaceholder} value={email}
                  onChange={(e) => { setEmail(e.target.value); if (err) setErr(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
                <button className="s-news-btn" onClick={submit} aria-label="ok">→</button>
              </div>
              <div className="s-news-note">{t.footer.newsNote}</div>
            </React.Fragment>
          )}
        </div>
        <div className="s-foot-note" style={{ marginTop: 18 }}>{t.footer.handmade}</div>
      </div>
      <div className="s-foot-right">
        <a className="s-foot-link" href={ig} target="_blank" rel="noreferrer">@{ALdata.IG_HANDLE}</a>
        <a className="s-foot-link" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
        <button className="s-foot-link" style={{ border: "none", background: "none" }} onClick={() => onNav("top")}>↑ {t.footer.back}</button>
      </div>
    </footer>
  );
}

/* ---- Site composition ---- */
function SiteAto1({ t, onToggleLang, onCreate }) {
  const scrollTo = useCallback((id) => {
    if (id === "top") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const map = { works: "works", story: "story", invite: "invite", testimonials: "testimonials" };
    const el = document.getElementById(map[id] || id);
    if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 60; window.scrollTo({ top: y, behavior: "smooth" }); }
  }, []);
  return (
    <div className="s-wrap">
      <Nav t={t} onToggleLang={onToggleLang} onCreate={onCreate} onNav={scrollTo} />
      <Hero t={t} onCreate={onCreate} onNav={scrollTo} />
      <Story t={t} />
      <Process t={t} />
      <WashDivider seed={14} from="#FAF7F1" to="#F3EEE4" />
      <Collection t={t} />
      <WashDivider seed={27} from="#F3EEE4" to="#FAF7F1" />
      <Imagine t={t} />
      <Testimonials t={t} />
      <WashDivider seed={33} from="#FAF7F1" to="#F3EEE4" />
      <HowItWorks t={t} />
      <WashDivider seed={41} from="#F3EEE4" to="#FAF7F1" />
      <Invite t={t} onCreate={onCreate} />
      <Footer t={t} onNav={scrollTo} />
    </div>
  );
}

window.SiteAto1 = SiteAto1;
