/* ============================================================
   Almarte — app orchestration
   Language state · site ↔ co-creation journey handoff
   ============================================================ */
const { SiteAto1, CoCreate: CoCreateC, Overture: OvertureC, AL: ALapp } = window;
const { useState, useEffect, useRef } = React;
const MUSIC_SRC = (window.APP_CONFIG && window.APP_CONFIG.MUSIC_SRC) || "audio/NearLight.wav";

function prefersReduced() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
}

function BackgroundMusic() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const ytRef = useRef(null);
  const playerRef = useRef(null);

  const isYouTube = (src) => /(?:youtube\.com|youtu\.be)/i.test(String(src || ""));
  const getYouTubeId = (url) => {
    if (!url) return null;
    const m = url.match(/[?&]v=([^&]+)/);
    if (m && m[1]) return m[1];
    const m2 = url.match(/youtu\.be\/([^?&]+)/);
    if (m2 && m2[1]) return m2[1];
    return null;
  };

  // Load YouTube IFrame API once
  const loadYouTubeAPI = () => new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT);
    const existing = document.getElementById("yt-api-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.YT));
      return;
    }
    const s = document.createElement("script");
    s.id = "yt-api-script";
    s.src = "https://www.youtube.com/iframe_api";
    s.onload = () => {
      // YT will call onYouTubeIframeAPIReady — wait a tick
      const int = setInterval(() => { if (window.YT && window.YT.Player) { clearInterval(int); resolve(window.YT); } }, 50);
    };
    document.body.appendChild(s);
  });

  useEffect(() => {
    const src = MUSIC_SRC;
    if (isYouTube(src)) {
      const vid = getYouTubeId(src);
      if (!vid) return;
      let cancelled = false;
      loadYouTubeAPI().then((YT) => {
        if (cancelled) return;
        // create a small invisible player container
        const div = document.createElement("div");
        div.style.position = "fixed";
        div.style.right = "18px";
        div.style.bottom = "18px";
        div.style.width = "1px";
        div.style.height = "1px";
        div.style.overflow = "hidden";
        div.id = "almarte-yt-player";
        document.body.appendChild(div);
        ytRef.current = div;

        playerRef.current = new YT.Player(div.id, {
          height: '1', width: '1', videoId: vid,
          playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, playsinline: 1, mute: 1 },
          events: {
            onReady: (e) => {
              try { e.target.playVideo(); setPlaying(true); } catch (e) {}
            },
            onStateChange: (ev) => {
              // PLAYING = 1
              if (ev.data === 1) setPlaying(true);
              if (ev.data === 2 || ev.data === 0) setPlaying(false);
            }
          }
        });
      });
      return () => { cancelled = true; if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy(); if (ytRef.current) { try { document.body.removeChild(ytRef.current); } catch (e) {} } };
    }

    // else use native audio
    const audio = audioRef.current;
    if (!audio) return;
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0.18;
    audio.muted = false;
    audio.crossOrigin = "anonymous";

    const startAudio = async () => {
      try { await audio.play(); setPlaying(true); } catch (e) {}
    };
    startAudio();
    return () => { try { audio.pause(); } catch (e) {} };
  }, []);

  const toggle = async () => {
    if (isYouTube(MUSIC_SRC)) {
      const p = playerRef.current;
      if (!p) return;
      const state = p.getPlayerState && p.getPlayerState();
      // 1 playing, 2 paused
      if (state === 1) {
        p.pauseVideo();
        setPlaying(false);
      } else {
        try { p.playVideo(); p.unMute(); } catch (e) {}
        setPlaying(true);
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;
    if (!playing) {
      audio.currentTime = 0;
      try { await audio.play(); } catch (e) {}
      setPlaying(true);
    } else {
      try { audio.pause(); } catch (e) {}
      setPlaying(false);
    }
  };

  return (
    <>
      {!isYouTube(MUSIC_SRC) && <audio ref={audioRef} src={MUSIC_SRC} />}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 10000,
          minWidth: 180,
          borderRadius: 999,
          padding: "14px 18px",
          fontSize: "13px",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          background: playing ? "#BC5B3C" : "rgba(255,255,255,0.96)",
          color: playing ? "#fff" : "#2D2823",
          border: "1px solid rgba(45,40,35,0.18)",
          boxShadow: "0 22px 60px -30px rgba(45,40,35,0.38)",
          cursor: "pointer",
          lineHeight: 1.2,
          textAlign: "center",
          touchAction: "manipulation",
        }}
      >
        {playing ? "Silenciar música" : "Ouvir música"}
      </button>
    </>
  );
}

function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("almarte_lang") || "pt"; } catch (e) { return "pt"; }
  });
  const [overture, setOverture] = useState(() => {
    try {
      if (prefersReduced()) return false;
      return sessionStorage.getItem("almarte_entered") !== "1";
    } catch (e) { return true; }
  });
  const [journey, setJourney] = useState(false); // false | "in" | "closing"

  useEffect(() => { try { localStorage.setItem("almarte_lang", lang); } catch (e) {} }, [lang]);
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  // lock scroll while overture or journey is open
  useEffect(() => {
    const lock = overture || journey === "in";
    document.body.style.overflow = lock ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [overture, journey]);

  const t = { ...ALapp.T[lang], _lang: lang };
  const toggleLang = () => setLang((l) => (l === "pt" ? "en" : "pt"));

  const enterSite = () => {
    try { sessionStorage.setItem("almarte_entered", "1"); } catch (e) {}
    setOverture(false);
  };
  const openJourney = () => setJourney("in");
  const exitJourney = () => {
    setJourney("closing");
    setTimeout(() => setJourney(false), 600);
  };

  return (
    <React.Fragment>
      <SiteAto1 t={t} onToggleLang={toggleLang} onCreate={openJourney} />
      <BackgroundMusic />
      {journey && (
        <div style={{ opacity: journey === "closing" ? 0 : 1, transition: "opacity .55s ease" }}>
          <CoCreateC lang={lang} onToggleLang={toggleLang} onExit={exitJourney} />
        </div>
      )}
      {overture && <OvertureC t={t} onEnter={enterSite} />}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
