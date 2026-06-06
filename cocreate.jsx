/* ============================================================
   Almarte — Atos 2 & 3 (the co-creation journey)
   Immersive one-question-at-a-time flow → Claude → essence + briefing
   Exposes: window.CoCreate
   ============================================================ */
const { AL: ALj } = window;

(function injectJourneyCSS() {
  if (document.getElementById("almarte-journey-css")) return;
  const css = `
  .j-overlay { position: fixed; inset: 0; z-index: 500; background: var(--bg);
    display: flex; flex-direction: column; overflow-y: auto; animation: jOverlayIn .85s cubic-bezier(.16,.7,.2,1) both; }
  @keyframes jOverlayIn {
    0% { opacity: 0; clip-path: circle(0% at 50% 64%); }
    60% { opacity: 1; }
    100% { opacity: 1; clip-path: circle(150% at 50% 64%); }
  }
  .j-wash { position: fixed; inset: 0; opacity: 0; transition: opacity 1.2s ease; pointer-events: none;
    filter: blur(10px); }
  .j-wash.show { opacity: .42; }

  .j-bar { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between;
    padding: 20px clamp(20px,5vw,56px); background: linear-gradient(var(--bg), rgba(250,247,241,0)); }
  .j-mark { font-family: var(--script); font-size: 34px; color: var(--ink); line-height: 1; padding-top: 4px; }
  .j-barright { display: flex; align-items: center; gap: 18px; }
  .j-close { font-size: 12.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft);
    border: none; background: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: color .3s; }
  .j-close:hover { color: var(--accent); }
  .j-lang { font-size: 12px; letter-spacing: .1em; color: var(--ink); border: 1px solid var(--line);
    background: transparent; border-radius: 40px; padding: 6px 13px; cursor: pointer; transition: all .3s; }
  .j-lang:hover { border-color: var(--accent); color: var(--accent); }

  .j-stage { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 24px clamp(20px,5vw,56px) 60px; position: relative; z-index: 2; }
  .j-card { width: 100%; max-width: 600px; }
  .j-fade { transition: opacity .42s ease, transform .42s ease; }

  .j-progress { display: flex; gap: 7px; align-items: center; margin-bottom: 34px; }
  .j-dot { height: 6px; border-radius: 4px; background: var(--line); transition: all .5s cubic-bezier(.16,.7,.2,1); width: 7px; }
  .j-dot.done { background: var(--accent-soft); }
  .j-dot.now { background: var(--accent); width: 30px; }
  .j-count { font-size: 12px; letter-spacing: .22em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 14px; }

  .j-q { font-family: var(--serif); font-weight: 300; font-size: clamp(1.85rem, 4vw, 3rem); line-height: 1.1;
    letter-spacing: -0.015em; color: var(--ink); margin-bottom: 14px; }
  .j-q em { font-style: italic; color: var(--accent-deep); }
  .j-hint { font-size: 15px; color: var(--ink-soft); line-height: 1.6; margin-bottom: 34px; max-width: 480px; }
  .j-peakmark { font-size: 12px; letter-spacing: .28em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; display:inline-block; }

  .j-opts { display: flex; flex-direction: column; gap: 11px; }
  .j-opt { text-align: left; background: var(--surface); border: 1.5px solid var(--line); border-radius: 16px;
    padding: 17px 22px; font-size: 16px; color: var(--ink); cursor: pointer; font-family: var(--sans);
    transition: border-color .25s, background .25s, transform .25s, box-shadow .25s; position: relative; }
  .j-opt:hover { border-color: var(--ink-faint); transform: translateX(4px); }
  .j-opt.on { border-color: var(--accent); background: var(--accent-soft); font-weight: 600;
    box-shadow: 0 10px 30px -16px rgba(188,91,60,.5); }

  .j-chips { display: flex; flex-wrap: wrap; gap: 10px; }
  .j-chip { background: var(--surface); border: 1.5px solid var(--line); border-radius: 40px;
    padding: 12px 22px; font-size: 15px; color: var(--ink); cursor: pointer; font-family: var(--sans);
    transition: all .22s; }
  .j-chip:hover { border-color: var(--ink-faint); }
  .j-chip.on { border-color: var(--accent); background: var(--accent-soft); color: var(--accent-deep); font-weight: 600; }

  .j-textarea { width: 100%; border: 1.5px solid var(--line); border-radius: 16px; padding: 18px 20px;
    font-size: 16px; font-family: var(--sans); color: var(--ink); resize: vertical; outline: none;
    background: var(--surface); line-height: 1.6; min-height: 130px; transition: border-color .25s; }
  .j-textarea:focus { border-color: var(--accent); }

  .j-nav { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 40px; }
  .j-back { background: none; border: none; color: var(--ink-soft); font-size: 14.5px; cursor: pointer;
    font-family: var(--sans); display: inline-flex; align-items: center; gap: 8px; transition: color .3s; padding: 10px 0; }
  .j-back:hover { color: var(--accent); }
  .j-next { background: var(--accent); color: #fff; border: none; border-radius: 44px; padding: 15px 34px;
    font-size: 15.5px; cursor: pointer; font-family: var(--sans); display: inline-flex; align-items: center; gap: 10px;
    transition: background .3s, transform .3s, box-shadow .3s; box-shadow: 0 12px 30px -14px rgba(153,60,29,.4); }
  .j-next:hover:not(:disabled) { background: var(--accent-deep); transform: translateY(-2px); }
  .j-next:disabled { opacity: .32; cursor: not-allowed; }

  /* generating */
  .j-gen { text-align: center; }
  .j-pulse { width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 30px;
    background: radial-gradient(circle at 50% 45%, var(--accent), var(--accent-soft) 72%);
    animation: jpulse 2.4s ease-in-out infinite; }
  @keyframes jpulse { 0%,100%{ transform: scale(.92); box-shadow: 0 0 0 0 rgba(188,91,60,.28); }
    50%{ transform: scale(1.04); box-shadow: 0 0 0 26px rgba(188,91,60,0); } }

  /* result */
  .j-res-kick { font-size: 12px; letter-spacing: .3em; text-transform: uppercase; color: var(--accent); text-align: center; }
  .j-res-title { font-family: var(--serif); font-weight: 300; font-size: clamp(2rem,4.5vw,3.2rem); font-style: italic;
    text-align: center; line-height: 1.1; letter-spacing: -0.02em; margin: 14px 0 8px; }
  .j-refl { font-family: var(--serif); font-weight: 300; font-size: clamp(1.15rem,2vw,1.5rem); line-height: 1.5;
    font-style: italic; color: var(--ink); text-align: center; margin: 26px auto 38px; max-width: 540px; }
  .j-brief { background: var(--surface); border: 1px solid var(--line); border-radius: 22px; padding: 8px 26px;
    box-shadow: 0 30px 70px -40px rgba(45,40,35,.3); }
  .j-brief-head { font-size: 11px; letter-spacing: .26em; text-transform: uppercase; color: var(--accent);
    padding: 22px 0 12px; }
  .j-brow { padding: 16px 0; border-bottom: 1px solid var(--line); }
  .j-brow:last-child { border-bottom: none; }
  .j-blabel { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 6px; }
  .j-bval { font-size: 16px; line-height: 1.55; color: var(--ink); }
  .j-disc { font-size: 13.5px; color: var(--ink-soft); line-height: 1.6; text-align: center; font-style: italic;
    margin: 26px auto; max-width: 540px; }
  .j-whats { display: flex; align-items: center; justify-content: center; gap: 11px; width: 100%; text-align: center;
    background: var(--accent); color: #fff; border-radius: 44px; padding: 18px 28px; font-size: 16px;
    text-decoration: none; border: none; cursor: pointer; font-family: var(--sans);
    transition: background .3s, transform .3s, box-shadow .3s; box-shadow: 0 16px 40px -16px rgba(153,60,29,.45); }
  .j-whats:hover { background: var(--accent-deep); transform: translateY(-2px); }
  .j-restart { background: none; border: none; color: var(--ink-soft); font-size: 14px; cursor: pointer;
    font-family: var(--sans); width: 100%; margin-top: 16px; padding: 12px; transition: color .3s; }
  .j-restart:hover { color: var(--accent); }
  .j-foot { text-align: center; font-size: 12px; color: var(--ink-faint); padding: 0 0 30px; letter-spacing: .04em; }

  /* lead capture */
  .j-lead { margin-top: 16px; background: var(--bg-deep); border: 1px solid var(--line); border-radius: 20px;
    padding: 22px 24px; text-align: center; }
  .j-lead-divider { display: flex; align-items: center; gap: 14px; color: var(--ink-faint);
    font-size: 11px; letter-spacing: .22em; text-transform: uppercase; margin: 18px 0; }
  .j-lead-divider::before, .j-lead-divider::after { content: ""; flex: 1; height: 1px; background: var(--line); }
  .j-lead-title { font-family: var(--serif); font-weight: 400; font-style: italic; font-size: 19px; color: var(--ink); }
  .j-lead-body { font-size: 13.5px; color: var(--ink-soft); line-height: 1.55; margin: 8px auto 16px; max-width: 380px; }
  .j-lead-form { display: flex; gap: 9px; max-width: 420px; margin: 0 auto; }
  .j-lead-input { flex: 1; min-width: 0; border: 1.5px solid var(--line); border-radius: 40px; padding: 13px 20px;
    font-size: 15px; font-family: var(--sans); color: var(--ink); outline: none; background: var(--surface);
    transition: border-color .25s; }
  .j-lead-input:focus { border-color: var(--accent); }
  .j-lead-input.err { border-color: #C0492B; }
  .j-lead-btn { border: none; background: var(--ink); color: #fff; border-radius: 40px; padding: 13px 22px;
    font-size: 14.5px; font-family: var(--sans); cursor: pointer; white-space: nowrap; transition: background .3s, transform .3s; }
  .j-lead-btn:hover { background: #1d1a16; transform: translateY(-1px); }
  .j-lead-done { font-size: 14.5px; color: var(--accent-deep); line-height: 1.5; font-family: var(--serif); font-style: italic; }
  .j-lead-err { font-size: 12px; color: #C0492B; margin-top: 8px; }
  @media (max-width: 520px){ .j-lead-form { flex-direction: column; } }

  /* ---- PHONE refinements (journey) ---- */
  @media (max-width: 560px){
    .j-bar { padding: 16px 20px; }
    .j-mark { font-size: 30px; }
    .j-stage { padding: 18px 22px 48px; }
    .j-lang { padding: 9px 14px; }
    .j-close { padding: 8px 0; }
    .j-opt { padding: 16px 18px; }
    .j-chip { padding: 13px 20px; }            /* ≥44px touch */
    .j-next { padding: 15px 28px; }
    .j-whats { padding: 17px 22px; }
    .j-q { font-size: clamp(1.7rem, 7vw, 2.2rem); }
    .j-brief { padding: 6px 20px; }
  }
  `;
  const el = document.createElement("style");
  el.id = "almarte-journey-css";
  el.textContent = css;
  document.head.appendChild(el);
})();

/* ---- bilingual journey content ---- */
const JT = {
  pt: {
    intro: {
      kick: "ateliê · co-criação",
      title: "Vamos criar algo\nque é só seu.",
      body: "Conte o que você sente, o que busca, a história que quer guardar. Suas palavras são sinais e direções que guiam a artista — que então pinta tudo à mão, do jeito dela.",
      time: "Leva menos de 2 minutos.",
      start: "Começar a criar",
    },
    of: "de",
    back: "Voltar",
    next: "Continuar",
    finish: "Criar minha obra",
    peak: "o coração da obra",
    gen: { title: "Dando forma à sua história…", hint: "Transformando o que você sente em uma direção de obra." },
    res: {
      kick: "a essência da sua obra",
      forArtist: "Para a artista",
      labels: { emotion: "Sentimento", story: "Essência da história", palette: "Paleta", mood: "Clima visual", format: "Formato sugerido", direction: "Direção" },
      disclaimer: "O que você compartilhou são sinais e direções para a artista — não uma cópia exata do resultado. É a leitura livre dela, feita à mão, que torna cada obra única e impossível de repetir.",
      whats: "Enviar para a artista no WhatsApp",
      lead: {
        title: "Prefere receber com calma?",
        body: "Deixe seu e-mail e a artista envia a essência da sua obra + uma conversa sem compromisso.",
        placeholder: "seu melhor e-mail",
        button: "Guardar a minha obra",
        done: "Pronto — a sua obra está guardada. A artista entra em contato em breve. ✨",
        invalid: "Confira o e-mail, por favor.",
      },
      restart: "↻ Recomeçar",
      foot: "A obra final é pintada à mão. Cada peça é única.",
      exit: "voltar ao site",
    },
  },
  en: {
    intro: {
      kick: "atelier · co-creation",
      title: "Let's create something\nthat is only yours.",
      body: "Tell me what you feel, what you're looking for, the story you want to keep. Your words are signs and directions that guide the artist — who then paints it all by hand, in her own way.",
      time: "Takes under 2 minutes.",
      start: "Begin creating",
    },
    of: "of",
    back: "Back",
    next: "Continue",
    finish: "Create my work",
    peak: "the heart of the work",
    gen: { title: "Giving your story a shape…", hint: "Turning what you feel into a direction for the work." },
    res: {
      kick: "the essence of your work",
      forArtist: "For the artist",
      labels: { emotion: "Feeling", story: "Story essence", palette: "Palette", mood: "Visual mood", format: "Suggested format", direction: "Direction" },
      disclaimer: "What you shared are signs and directions for the artist — not an exact copy of the result. It's her free reading, made by hand, that makes each work unique and impossible to repeat.",
      whats: "Send to the artist on WhatsApp",
      lead: {
        title: "Rather take your time?",
        body: "Leave your e-mail and the artist will send your work's essence + a no-pressure conversation.",
        placeholder: "your best e-mail",
        button: "Save my work",
        done: "Done — your work is saved. The artist will be in touch soon. ✨",
        invalid: "Please check the e-mail.",
      },
      restart: "↻ Start over",
      foot: "The final work is hand-painted. Each piece is unique.",
      exit: "back to the site",
    },
  },
};

const QUESTIONS = [
  {
    id: "forWhom", type: "single",
    q: { pt: "Para quem é esta obra?", en: "Who is this work for?" },
    hint: { pt: "Toda peça começa por uma intenção.", en: "Every piece begins with an intention." },
    options: [
      { id: "me", pt: "Para mim", en: "For me" },
      { id: "gift", pt: "Um presente para alguém especial", en: "A gift for someone special" },
    ],
  },
  {
    id: "occasion", type: "single",
    q: { pt: "Que momento ela marca?", en: "What moment does it mark?" },
    hint: { pt: "Pode ser grande ou pequeno — o que importa é o significado.", en: "Big or small — what matters is the meaning." },
    options: [
      { id: "just", pt: "Só porque sim", en: "Just because" },
      { id: "love", pt: "Um amor / um casal", en: "A love / a couple" },
      { id: "phase", pt: "Uma nova fase", en: "A new chapter" },
      { id: "win", pt: "Uma conquista", en: "An achievement" },
      { id: "memory", pt: "Em memória de alguém", en: "In memory of someone" },
      { id: "restart", pt: "Um recomeço", en: "A fresh start" },
    ],
  },
  {
    id: "feeling", type: "multi", max: 3,
    q: { pt: "Que sentimento ela deve despertar?", en: "What feeling should it awaken?" },
    hint: { pt: "Toda vez que você olhar. Escolha até 3.", en: "Every time you look at it. Choose up to 3." },
    options: [
      { id: "calm", pt: "Calma", en: "Calm" }, { id: "passion", pt: "Paixão", en: "Passion" },
      { id: "strength", pt: "Força", en: "Strength" }, { id: "joy", pt: "Alegria", en: "Joy" },
      { id: "nostalgia", pt: "Nostalgia", en: "Nostalgia" }, { id: "hope", pt: "Esperança", en: "Hope" },
      { id: "freedom", pt: "Liberdade", en: "Freedom" }, { id: "warmth", pt: "Aconchego", en: "Warmth" },
    ],
  },
  {
    id: "story", type: "text", peak: true,
    q: { pt: "Há uma memória ou história que essa obra deveria carregar?", en: "Is there a memory or story this work should carry?" },
    hint: { pt: "Escreva com suas palavras. É daqui que nasce a alma da peça. (opcional)", en: "In your own words. This is where the soul of the piece is born. (optional)" },
    placeholder: { pt: "Ex: o mar onde passei minha infância, a cor do céu no dia em que nos conhecemos…", en: "E.g. the sea of my childhood, the colour of the sky the day we met…" },
  },
  {
    id: "palette", type: "multi", max: 2,
    q: { pt: "Que cores ou clima combinam com isso?", en: "What colours or mood fit this?" },
    hint: { pt: "Escolha até 2 — ou deixe a artista decidir.", en: "Choose up to 2 — or let the artist decide." },
    options: [
      { id: "warm", pt: "Tons quentes", en: "Warm tones" }, { id: "cool", pt: "Tons frios", en: "Cool tones" },
      { id: "earth", pt: "Terrosos e naturais", en: "Earthy & natural" }, { id: "vivid", pt: "Vibrantes e intensos", en: "Vivid & intense" },
      { id: "soft", pt: "Suaves e claros", en: "Soft & light" }, { id: "deep", pt: "Escuros e profundos", en: "Dark & deep" },
      { id: "artist", pt: "Deixa a artista escolher", en: "Let the artist choose" },
    ],
  },
  {
    id: "where", type: "single",
    q: { pt: "Onde ela vai viver?", en: "Where will it live?" },
    hint: { pt: "Isso ajuda a pensar o tamanho e a presença da obra.", en: "This helps shape the size and presence of the work." },
    options: [
      { id: "living", pt: "Sala", en: "Living room" }, { id: "bed", pt: "Quarto", en: "Bedroom" },
      { id: "office", pt: "Escritório", en: "Office" }, { id: "hall", pt: "Entrada / Hall", en: "Entrance / Hall" },
      { id: "unsure", pt: "Ainda não sei", en: "Not sure yet" },
    ],
  },
];

function lbl(opt, lang) { return opt ? opt[lang] : ""; }

function buildPrompt(answers, lang) {
  const get = (id) => answers[id];
  const single = (id) => { const v = get(id); return v ? v[lang] : (lang === "pt" ? "não informado" : "not specified"); };
  const multi = (id) => { const v = get(id); return Array.isArray(v) && v.length ? v.map((o) => o[lang]).join(", ") : (lang === "pt" ? "não informado" : "not specified"); };
  const story = get("story") || (lang === "pt" ? "não informado" : "not specified");

  if (lang === "en") {
    return `You are the co-creation assistant of an atelier where an artist hand-paints colourful abstract canvases. A visitor answered a few questions to co-create the MEANING of a work the artist will paint by hand (the artist makes the art; the client gives the emotional direction).

Visitor's answers:
- For whom: ${single("forWhom")}
- Moment/occasion: ${single("occasion")}
- Desired feelings: ${multi("feeling")}
- Personal story/memory: ${story}
- Colour/mood preference: ${multi("palette")}
- Where it will live: ${single("where")}

Return ONLY valid JSON (no markdown, no backticks, no text outside the JSON), in English, with this exact shape:
{"reflection":"2-3 warm, poetic sentences addressed to the visitor (use 'you'), reflecting what this work means to them. Make them feel seen. Don't mention being an AI.","title_suggestion":"an evocative short title (2-4 words)","emotion":"the central emotion, few words","story_essence":"1-2 sentences capturing the essence of the personal story/meaning","palette":"a colour palette suggestion described in words","mood":"the visual mood in few words","format_suggestion":"format/orientation suggestion based on where it lives","painting_direction":"2-3 sentences of concrete direction for the artist (composition, movement, feeling) — inspiring but leaving freedom for her hand"}
Be sensitive, warm and concise. Make clear in tone that this is interpretive direction for the artist — never promise a literal or exact result. Respond only with the JSON.`;
  }
  return `Você é o assistente de co-criação do ateliê de uma artista que pinta quadros abstratos coloridos à mão. Um visitante respondeu perguntas para co-criar o SIGNIFICADO de uma obra que a artista pintará à mão (a artista cria a arte; o cliente dá a direção emocional).

Respostas do visitante:
- Para quem: ${single("forWhom")}
- Momento/ocasião: ${single("occasion")}
- Sentimentos desejados: ${multi("feeling")}
- História/memória pessoal: ${story}
- Preferência de cores/clima: ${multi("palette")}
- Onde a obra vai ficar: ${single("where")}

Gere uma resposta APENAS em JSON válido (sem markdown, sem crases, sem texto fora do JSON), em português do Brasil, com este formato exato:
{"reflection":"2 a 3 frases calorosas e poéticas dirigidas ao visitante (use 'você'), refletindo o que essa obra representa para ele. Faça-o se sentir visto. Não mencione que é uma IA.","title_suggestion":"um título evocativo e curto (2 a 4 palavras)","emotion":"a emoção central, em poucas palavras","story_essence":"1 a 2 frases capturando a essência da história/significado pessoal","palette":"sugestão de paleta de cores descrita em palavras","mood":"o clima visual em poucas palavras","format_suggestion":"sugestão de formato/orientação com base em onde a obra vai ficar","painting_direction":"2 a 3 frases de direção concreta para a artista (composição, movimento, sensação) — inspiradora mas deixando liberdade para a mão dela"}
Seja sensível, caloroso e conciso. Deixe claro no tom que isso é direção interpretativa para a artista — nunca prometa representação literal. Responda só com o JSON.`;
}

function fallbackResult(answers, lang) {
  const feel = (answers.feeling || []).map((o) => o[lang]).join(", ");
  const palArr = answers.palette || [];
  const isArtist = palArr.some((o) => o.id === "artist") || palArr.length === 0;
  const where = answers.where;
  if (lang === "en") {
    return {
      reflection: "What you described carries something deeply yours. The work will hold that feeling and return it to you each time you look at it.",
      title_suggestion: "Your Essence",
      emotion: feel || "emotion",
      story_essence: answers.story || "a personal story to be translated into colour and form.",
      palette: isArtist ? "the artist's choice, in harmony with the feeling" : palArr.map((o) => o.en).join(" & "),
      mood: "fluid and emotional",
      format_suggestion: where && where.id !== "unsure" ? `considered for the ${where.en.toLowerCase()}` : "to be defined with the artist",
      painting_direction: "An abstract composition translating the feeling into movement and colour, with freedom for the artist's interpretation.",
    };
  }
  return {
    reflection: "O que você descreveu carrega uma intenção muito sua. A obra vai guardar esse sentimento e devolvê-lo a você toda vez que olhar para ela.",
    title_suggestion: "Sua Essência",
    emotion: feel || "emoção",
    story_essence: answers.story || "uma história pessoal a ser traduzida em cor e forma.",
    palette: isArtist ? "à escolha da artista, em harmonia com o sentimento" : palArr.map((o) => o.pt).join(" e "),
    mood: "fluido e emocional",
    format_suggestion: where && where.id !== "unsure" ? `pensado para ${where.pt.toLowerCase()}` : "a definir com a artista",
    painting_direction: "Uma composição abstrata que traduz o sentimento em movimento e cor, com liberdade para a interpretação da artista.",
  };
}

/* ---- Steps ---- */
function StepView({ qd, index, total, answers, setAnswer, lang, j, onNext, onBack }) {
  const v = answers[qd.id];
  const toggleMulti = (opt) => {
    const cur = Array.isArray(v) ? v : [];
    if (cur.find((x) => x.id === opt.id)) setAnswer(qd.id, cur.filter((x) => x.id !== opt.id));
    else if (cur.length < (qd.max || 99)) setAnswer(qd.id, [...cur, opt]);
  };
  const can = qd.type === "text" ? true : qd.type === "multi" ? Array.isArray(v) && v.length > 0 : !!v;

  return (
    <div>
      <div className="j-progress">
        {QUESTIONS.map((_, i) => (
          <div key={i} className={`j-dot ${i === index ? "now" : i < index ? "done" : ""}`} />
        ))}
      </div>
      <div className="j-count">{index + 1} {j.of} {total}</div>
      {qd.peak && <span className="j-peakmark">✦ {j.peak}</span>}
      <h2 className="j-q">{qd.q[lang]}</h2>
      <p className="j-hint">{qd.hint[lang]}</p>

      {qd.type === "single" && (
        <div className="j-opts">
          {qd.options.map((opt) => (
            <button key={opt.id} className={`j-opt ${v && v.id === opt.id ? "on" : ""}`} onClick={() => setAnswer(qd.id, opt)}>
              {opt[lang]}
            </button>
          ))}
        </div>
      )}
      {qd.type === "multi" && (
        <div className="j-chips">
          {qd.options.map((opt) => {
            const on = Array.isArray(v) && v.find((x) => x.id === opt.id);
            return (
              <button key={opt.id} className={`j-chip ${on ? "on" : ""}`} onClick={() => toggleMulti(opt)}>{opt[lang]}</button>
            );
          })}
        </div>
      )}
      {qd.type === "text" && (
        <textarea className="j-textarea" rows={4} placeholder={qd.placeholder[lang]}
          value={v || ""} onChange={(e) => setAnswer(qd.id, e.target.value)} />
      )}

      <div className="j-nav">
        <button className="j-back" onClick={onBack}>← {j.back}</button>
        <button className="j-next" id={index + 1 === total ? "ga-cocreate-finish" : undefined} disabled={!can} onClick={onNext}>
          {index + 1 === total ? `${j.finish} ✦` : j.next}
        </button>
      </div>
    </div>
  );
}

function Intro({ j, onStart }) {
  return (
    <div style={{ textAlign: "center" }}>
      <span className="j-res-kick">{j.intro.kick}</span>
      <h1 className="j-q" style={{ whiteSpace: "pre-line", marginTop: 18, textAlign: "center" }}>{j.intro.title}</h1>
      <p className="j-hint" style={{ margin: "0 auto 8px", textAlign: "center" }}>{j.intro.body}</p>
      <p className="j-count" style={{ marginTop: 14 }}>{j.intro.time}</p>
      <button className="j-next" id="ga-cocreate-start" style={{ marginTop: 28 }} onClick={onStart}>{j.intro.start} ✦</button>
    </div>
  );
}

function Generating({ j }) {
  return (
    <div className="j-gen">
      <div className="j-pulse" />
      <h2 className="j-q" style={{ textAlign: "center" }}>{j.gen.title}</h2>
      <p className="j-hint" style={{ margin: "0 auto", textAlign: "center" }}>{j.gen.hint}</p>
    </div>
  );
}

function BriefRow({ label, value }) {
  return (<div className="j-brow"><div className="j-blabel">{label}</div><div className="j-bval">{value}</div></div>);
}

function Result({ result, j, lang, answers, onRestart }) {
  const L = j.res.labels;
  const [email, setEmail] = useState("");
  const [leadState, setLeadState] = useState("idle"); // idle | error | done
  const waText = encodeURIComponent(
    (lang === "pt"
      ? `Olá! Criei a essência de uma obra no site da Almarte ✦\n\n`
      : `Hello! I created the essence of a work on the Almarte site ✦\n\n`) +
    `✦ ${result.title_suggestion}\n` +
    `✦ ${L.emotion}: ${result.emotion}\n` +
    `✦ ${L.palette}: ${result.palette}\n` +
    `✦ ${L.format}: ${result.format_suggestion}\n\n` +
    (lang === "pt" ? `Gostaria de conversar sobre encomendar essa peça.` : `I'd love to talk about commissioning this piece.`)
  );
  const waLink = `https://wa.me/${ALj.WA_NUMBER}?text=${waText}`;

  const submitLead = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) { setLeadState("error"); return; }
    try {
      const leads = JSON.parse(localStorage.getItem("almarte_leads") || "[]");
      leads.push({ email: email.trim(), title: result.title_suggestion, emotion: result.emotion,
        palette: result.palette, story: result.story_essence, lang, at: new Date().toISOString() });
      localStorage.setItem("almarte_leads", JSON.stringify(leads));
    } catch (e) {}
    setLeadState("done");
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <span className="j-res-kick">{j.res.kick}</span>
        <h1 className="j-res-title">{result.title_suggestion}</h1>
      </div>
      <p className="j-refl">“{result.reflection}”</p>
      <div className="j-brief">
        <div className="j-brief-head">{j.res.forArtist}</div>
        <BriefRow label={L.emotion} value={result.emotion} />
        <BriefRow label={L.story} value={result.story_essence} />
        <BriefRow label={L.palette} value={result.palette} />
        <BriefRow label={L.mood} value={result.mood} />
        <BriefRow label={L.format} value={result.format_suggestion} />
        <BriefRow label={L.direction} value={result.painting_direction} />
      </div>
      <p className="j-disc">{j.res.disclaimer}</p>
      <a className="j-whats" id="ga-whatsapp-click" href={waLink} target="_blank" rel="noreferrer">{j.res.whats} →</a>

      <div className="j-lead-divider">{lang === "pt" ? "ou" : "or"}</div>
      <div className="j-lead">
        {leadState === "done" ? (
          <p className="j-lead-done">{j.res.lead.done}</p>
        ) : (
          <React.Fragment>
            <div className="j-lead-title">{j.res.lead.title}</div>
            <p className="j-lead-body">{j.res.lead.body}</p>
            <div className="j-lead-form">
              <input
                className={`j-lead-input ${leadState === "error" ? "err" : ""}`}
                type="email" inputMode="email" placeholder={j.res.lead.placeholder}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (leadState === "error") setLeadState("idle"); }}
                onKeyDown={(e) => { if (e.key === "Enter") submitLead(); }}
              />
              <button className="j-lead-btn" onClick={submitLead}>{j.res.lead.button}</button>
            </div>
            {leadState === "error" && <div className="j-lead-err">{j.res.lead.invalid}</div>}
          </React.Fragment>
        )}
      </div>

      <button className="j-restart" onClick={onRestart}>{j.res.restart}</button>
    </div>
  );
}

function CoCreate({ lang, onToggleLang, onExit }) {
  const j = JT[lang];
  const [stage, setStage] = useState("intro"); // intro | 0..n | generating | result
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [fade, setFade] = useState(true);

  useEffect(() => { const el = document.querySelector(".j-overlay"); if (el) el.scrollTop = 0; }, [stage]);

  const idx = typeof stage === "number" ? stage : -1;
  const setAnswer = (id, val) => setAnswers((a) => ({ ...a, [id]: val }));

  const go = (next) => { setFade(false); setTimeout(() => { setStage(next); setFade(true); }, 230); };

  const next = () => { if (idx + 1 < QUESTIONS.length) go(idx + 1); else generate(); };
  const back = () => { if (idx > 0) go(idx - 1); else go("intro"); };

  const generate = async () => {
    go("generating");
    try {
      const raw = await window.claude.complete(buildPrompt(answers, lang));
      const clean = String(raw).replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
      setResult(parsed);
    } catch (e) {
      setResult(fallbackResult(answers, lang));
    }
    setTimeout(() => go("result"), 500);
  };

  const restart = () => { setAnswers({}); setResult(null); go("intro"); };
  const peakNow = idx >= 0 && QUESTIONS[idx].peak;

  return (
    <div className="j-overlay">
      <div className={`j-wash ${peakNow || stage === "result" ? "show" : ""}`}>
        <window.Artwork palette={ALj.HERO_PALETTE} seed={stage === "result" ? 5 : 9} sparkle={false} style={{ width: "100%", height: "100%" }} />
      </div>

      <div className="j-bar">
        <div className="j-mark">Almarte</div>
        <div className="j-barright">
          <button className="j-lang" onClick={onToggleLang}>{lang === "pt" ? "EN" : "PT"}</button>
          <button className="j-close" onClick={onExit}>✕ {j.res.exit}</button>
        </div>
      </div>

      <div className="j-stage">
        <div className="j-card j-fade" style={{ opacity: fade ? 1 : 0, transform: fade ? "none" : "translateY(10px)" }}>
          {stage === "intro" && <Intro j={j} onStart={() => go(0)} />}
          {idx >= 0 && (
            <StepView key={idx} qd={QUESTIONS[idx]} index={idx} total={QUESTIONS.length}
              answers={answers} setAnswer={setAnswer} lang={lang} j={j} onNext={next} onBack={back} />
          )}
          {stage === "generating" && <Generating j={j} />}
          {stage === "result" && result && <Result result={result} j={j} lang={lang} answers={answers} onRestart={restart} />}
        </div>
      </div>

      <div className="j-foot">{j.res.foot}</div>
    </div>
  );
}

window.CoCreate = CoCreate;
