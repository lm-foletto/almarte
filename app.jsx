/* ============================================================
   Almarte — app orchestration
   Language state · site ↔ co-creation journey handoff
   ============================================================ */
const { SiteAto1, CoCreate: CoCreateC, Overture: OvertureC, AL: ALapp } = window;

function prefersReduced() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
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
