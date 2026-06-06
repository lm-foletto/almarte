/* ============================================================
   Almarte — shared data, bilingual copy, reveal hooks
   Exposes: window.AL  (colors, strings, collection, config)
            window.useReveal, window.Reveal, window.useScrollProgress
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;

const C = {
  bg: "#FAF7F1",
  bgDeep: "#F3EEE4",
  surface: "#FFFFFF",
  ink: "#2D2823",
  inkSoft: "#857B70",
  inkFaint: "#B4A99A",
  accent: "#BC5B3C",
  accentDeep: "#993C1D",
  accentSoft: "#EFE2D9",
  line: "#E8E1D6",
};

/* WhatsApp placeholder — troque 55SEUNUMERO pelo número real */
const WA_NUMBER = "55SEUNUMERO";
const IG_HANDLE = "almarte.arts";

/* -------- Collection: feelings that became works (painterly placeholders)
   Ordered as a deliberate emotional arc:
   Calma → Paixão → (peak) Saudade → Força → Esperança → Liberdade
   gentle open · warmth rises · the tender ache · the turn · the lift · release -------- */
const collection = [
  {
    id: "mare",
    seed: 7,
    palette: ["#B5D4E0", "#D2E4DD", "#F0EAD9", "#6E9DB2", "#8E7BA8"],
    title: { pt: "Maré Mansa", en: "Still Tide" },
    feeling: { pt: "Calma", en: "Calm" },
    line: {
      pt: "Para alguém que precisava lembrar como é respirar fundo.",
      en: "For someone who needed to remember how to breathe.",
    },
  },
  {
    id: "conhecemos",
    seed: 23,
    palette: ["#EFC2A8", "#F2D6C4", "#E59B82", "#B5708F", "#F4E5D8"],
    title: { pt: "Quando Nos Conhecemos", en: "When We Met" },
    feeling: { pt: "Paixão", en: "Passion" },
    line: {
      pt: "A cor do céu no dia em que tudo começou.",
      en: "The colour of the sky the day it all began.",
    },
  },
  {
    id: "ficou",
    seed: 52,
    palette: ["#C3B4D8", "#D8CEE5", "#A892C0", "#7E689C", "#ECE5F0"],
    title: { pt: "O Que Ficou", en: "What Remained" },
    feeling: { pt: "Saudade", en: "Longing" },
    line: {
      pt: "Em memória de alguém que ela não quis esquecer.",
      en: "In memory of someone she could not let go.",
    },
  },
  {
    id: "coragem",
    seed: 68,
    palette: ["#EAC987", "#F1DEB2", "#E2A86C", "#C98F5C", "#F4EAD6"],
    title: { pt: "Coragem Pequena", en: "Small Courage" },
    feeling: { pt: "Força", en: "Strength" },
    line: {
      pt: "Para o dia em que ele decidiu recomeçar.",
      en: "For the day he chose to start over.",
    },
  },
  {
    id: "folego",
    seed: 36,
    palette: ["#BBD0A8", "#DCE6C8", "#E9E2CC", "#9DBA8A", "#C7B8D0"],
    title: { pt: "Primeiro Fôlego", en: "First Breath" },
    feeling: { pt: "Esperança", en: "Hope" },
    line: {
      pt: "Pintada para uma nova fase que ainda estava chegando.",
      en: "Painted for a new chapter still arriving.",
    },
  },
  {
    id: "madrugada",
    seed: 81,
    palette: ["#9FB3DA", "#C5C9E6", "#E9C9A8", "#7E92C0", "#F0E8DC"],
    title: { pt: "Madrugada", en: "Daybreak" },
    feeling: { pt: "Liberdade", en: "Freedom" },
    line: {
      pt: "O instante exato entre a noite e o primeiro sol.",
      en: "The exact moment between night and first light.",
    },
  },
];

const HERO_PALETTE = ["#9FB6DC", "#C3AEDA", "#EAC79C", "#7E92C0", "#EFE7D8"];
/* Deeper, richer field for the overture — colour emerging from night */
const OVERTURE_PALETTE = ["#5C6FB0", "#9A6BB8", "#DD8A45", "#16203E", "#283A66"];

/* -------- Bilingual strings -------- */
const T = {
  pt: {
    overture: {
      lines: ["Você sente algo —", "mesmo quando faltam as palavras.", "e o que você sente tem uma cor."],
      tag: "A sua alma em forma de cor.",
      skip: "entrar",
    },
    nav: { works: "As obras", create: "Crie a sua", story: "A artista" },
    langLabel: "EN",
    hero: {
      kicker: "ateliê almarte",
      title: ["A sua alma", "em forma de cor."],
      sub: "Quadros pintados à mão, a partir do que você sente.",
      seeWorks: "Conheça as obras",
      create: "Crie a sua",
      scroll: "role devagar",
    },
    story: {
      num: "01",
      kicker: "A artista · a guia",
      title: "Não sou a história.\nSou quem ajuda a contá-la.",
      body: [
        "Cada obra começa muito antes da tinta — começa no que você sente e nem sempre consegue dizer.",
        "Meu trabalho é escutar isso com cuidado e devolver em cor, gesto e silêncio. Pinto à mão, devagar, deixando que a sua emoção encontre a própria forma.",
        "Você traz a alma. Eu ajudo a torná-la visível.",
      ],
      signature: "Almarte",
      caption: "retrato da artista",
    },
    process: {
      num: "02",
      kicker: "o processo",
      title: "Cada gesto\né uma escolha.",
      body: "Da tela em branco à última pincelada — tudo feito à mão, devagar, deixando a emoção encontrar a forma.",
      watch: "assistir",
      note: "Feito à mão. Sem impressão. Sem inteligência artificial.",
    },
    collection: {
      num: "03",
      kicker: "A coleção",
      title: "Sentimentos que viraram obra.",
      body: "Cada peça nasceu de uma história real — não para decorar uma parede, mas para guardar um instante. Role devagar: cada obra é um sentimento.",
      note: "Imagens ilustrativas. Cada obra é única, pintada à mão sob encomenda.",
      mediumLabel: "Acrílica sobre tela · feita à mão",
      arc: "um percurso de emoções",
    },
    imagine: {
      num: "04",
      kicker: "imagine",
      title: "Como fica na sua parede.",
      body: "A mesma obra muda com a luz e o espaço de cada casa. Imagine a sua aqui.",
      rooms: ["sala de estar", "quarto", "escritório"],
      note: "Envie uma foto da sua parede e ajudamos a escolher o tamanho ideal.",
    },
    testimonials: {
      num: "05",
      kicker: "quem já sentiu",
      title: "Não levaram um quadro.\nLevaram um sentimento.",
      items: [
        { quote: "Quando vi a tela, chorei. Era exatamente o que eu sentia e nunca tinha conseguido dizer.", name: "Mariana", role: "presente para a mãe" },
        { quote: "Pedi algo sobre o nosso primeiro ano juntos. Hoje é a primeira coisa que a gente vê ao acordar.", name: "Rafael & Júlia", role: "sala do casal" },
        { quote: "Não sei pintar, mal sabia explicar. Mesmo assim ela entendeu — e devolveu em cor.", name: "Camila", role: "recomeço" },
      ],
    },
    howItWorks: {
      num: "06",
      kicker: "como funciona",
      title: "Da conversa à sua parede.",
      steps: [
        { icon: "chat", title: "Escolha ou co-crie", body: "Uma obra da coleção ou uma história só sua." },
        { icon: "brush", title: "A artista pinta", body: "À mão, devagar, interpretando a sua direção." },
        { icon: "box", title: "Embalagem segura", body: "Proteção e envio até sua casa." },
        { icon: "frame", title: "Na sua parede", body: "Consulte disponibilidade de entrega pelo WhatsApp." },
      ],
    },
    invite: {
      num: "07",
      kicker: "o convite",
      title: ["Agora", "é a sua vez."],
      body: "Toda obra aqui começou como um sentimento sem forma. A próxima pode ser a sua. Você não precisa saber pintar — só sentir. Eu cuido do resto.",
      cta: "Criar a minha obra",
      time: "Leva menos de 2 minutos.",
      unmute: "Ouvir a artista",
      mute: "Silenciar",
    },
    footer: {
      tag: "A sua alma em forma de cor.",
      handmade: "Cada peça é única, pintada à mão.",
      ig: "Instagram",
      back: "voltar ao topo",
      newsTitle: "Receba primeiro as novas obras.",
      newsPlaceholder: "seu e-mail",
      newsNote: "Sem spam. Só arte nova.",
      newsDone: "Pronto — você será o primeiro a ver. ✨",
    },
  },
  en: {
    overture: {
      lines: ["You feel something —", "even when words fall short.", "and what you feel has a colour."],
      tag: "Your soul, made colour.",
      skip: "enter",
    },
    nav: { works: "The works", create: "Create yours", story: "The artist" },
    langLabel: "PT",
    hero: {
      kicker: "almarte atelier",
      title: ["Your soul,", "made colour."],
      sub: "Hand-painted canvases, born from what you feel.",
      seeWorks: "See the works",
      create: "Create yours",
      scroll: "scroll slowly",
    },
    story: {
      num: "01",
      kicker: "The artist · the guide",
      title: "I am not the story.\nI'm the one who helps tell it.",
      body: [
        "Every work begins long before the paint — it begins in what you feel and cannot always put into words.",
        "My work is to listen closely and return it as colour, gesture and silence. I paint by hand, slowly, letting your emotion find its own shape.",
        "You bring the soul. I help make it visible.",
      ],
      signature: "Almarte",
      caption: "artist portrait",
    },
    process: {
      num: "02",
      kicker: "the process",
      title: "Every gesture\nis a choice.",
      body: "From the blank canvas to the last brushstroke — all made by hand, slowly, letting emotion find its form.",
      watch: "watch",
      note: "Made by hand. No prints. No artificial intelligence.",
    },
    collection: {
      num: "03",
      kicker: "The collection",
      title: "Feelings that became art.",
      body: "Each piece was born from a real story — not to fill a wall, but to hold a moment. Scroll slowly: each work is a feeling.",
      note: "Illustrative images. Each work is unique, hand-painted to order.",
      mediumLabel: "Acrylic on canvas · made by hand",
      arc: "a journey of emotions",
    },
    imagine: {
      num: "04",
      kicker: "imagine",
      title: "How it looks on your wall.",
      body: "The same work shifts with the light and space of each home. Picture yours here.",
      rooms: ["living room", "bedroom", "office"],
      note: "Send a photo of your wall and we'll help you choose the perfect size.",
    },
    testimonials: {
      num: "05",
      kicker: "those who felt it",
      title: "They didn't take home a painting.\nThey took home a feeling.",
      items: [
        { quote: "When I saw the canvas, I cried. It was exactly what I felt and had never been able to say.", name: "Mariana", role: "a gift for her mother" },
        { quote: "I asked for something about our first year together. It's now the first thing we see when we wake up.", name: "Rafael & Júlia", role: "the couple's living room" },
        { quote: "I can't paint, I could barely explain. Still, she understood — and gave it back in colour.", name: "Camila", role: "a fresh start" },
      ],
    },
    howItWorks: {
      num: "06",
      kicker: "how it works",
      title: "From conversation to your wall.",
      steps: [
        { icon: "chat", title: "Choose or co-create", body: "A work from the collection, or a story all your own." },
        { icon: "brush", title: "The artist paints", body: "By hand, slowly, interpreting your direction." },
        { icon: "box", title: "Secure packaging", body: "Professional protection for safe shipping." },
        { icon: "frame", title: "On your wall", body: "Delivery across Brazil." },
      ],
    },
    invite: {
      num: "07",
      kicker: "the invitation",
      title: ["Now", "it's your turn."],
      body: "Every work here began as a feeling with no shape. The next one could be yours. You don't need to know how to paint — only to feel. I'll take care of the rest.",
      cta: "Create my work",
      time: "Takes under 2 minutes.",
      unmute: "Hear the artist",
      mute: "Mute",
    },
    footer: {
      tag: "Your soul, made colour.",
      handmade: "Each piece is unique, painted by hand.",
      ig: "Instagram",
      back: "back to top",
      newsTitle: "Be the first to see new works.",
      newsPlaceholder: "your e-mail",
      newsNote: "No spam. Just new art.",
      newsDone: "Done — you'll be the first to see. ✨",
    },
  },
};

/* ============================================================
   Reveal hook — scroll-position based (IntersectionObserver does
   not fire reliably in the sandbox iframe), one-shot.
   ============================================================ */
function useReveal(options = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const offset = options.offset ?? 0.88; // reveal once top crosses vh*offset
    let done = false;
    const check = () => {
      if (done || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * offset && r.bottom > -40) {
        done = true;
        setShown(true);
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(check));
    const t1 = setTimeout(check, 60);
    const t2 = setTimeout(check, 320);
    const t3 = setTimeout(check, 800);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  return [ref, shown];
}

/* Reveal wrapper element */
function Reveal({ as = "div", slow = false, delay = 0, className = "", style = {}, children, ...rest }) {
  const [ref, shown] = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`rv ${slow ? "rv-slow" : ""} ${shown ? "in" : ""} ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms", ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Scroll progress (0..1) of an element through the viewport, for parallax */
function useScrollParallax() {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = (vh - r.top) / (vh + r.height); // ~0 entering bottom, ~1 leaving top
        setOffset(Math.max(0, Math.min(1, p)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return [ref, offset];
}

window.AL = { C, T, collection, HERO_PALETTE, OVERTURE_PALETTE, WA_NUMBER, IG_HANDLE };
window.useReveal = useReveal;
window.Reveal = Reveal;
window.useScrollParallax = useScrollParallax;
