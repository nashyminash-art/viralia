import { ESTILOS, estilo, filtro, marcoPNG, marcoURL } from "./estilos.js";
// VIRALIA para el teléfono: crea los videos DENTRO del teléfono con su conexión (Wi-Fi o datos).
// Wikipedia (texto + fotos) · noticias (GDELT) · NASA · Pexels/Pixabay opcionales -> guion -> voz (Piper, en el teléfono)
// -> video vertical 1080x1920 con cortes cada 3 s y subtítulos -> se guarda en el teléfono -> botón "Publicar en TikTok".

const TTS_URL = "https://cdn.jsdelivr.net/npm/@mintplex-labs/piper-tts-web@1.0.5/+esm";
const W = 1080, H = 1920, CORTE = 3, PAUSA = 0.25;
const $ = s => document.querySelector(s);

// ------------------------------------------------------------------ guardado
const LS = {
  get(k, d) { try { const v = localStorage.getItem("viralia_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("viralia_" + k, JSON.stringify(v)); } catch (e) {} },
};

let _db = null;
function db() {
  if (_db) return _db;
  _db = new Promise((ok, mal) => {
    const r = indexedDB.open("viralia", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("videos", { keyPath: "id" });
    r.onsuccess = () => ok(r.result);
    r.onerror = () => mal(r.error);
  });
  return _db;
}
async function idb(modo, fn) {
  const d = await db();
  return new Promise((ok, mal) => {
    const tx = d.transaction("videos", modo);
    const req = fn(tx.objectStore("videos"));
    tx.oncomplete = () => ok(req && req.result);
    tx.onerror = () => mal(tx.error);
  });
}
const Videos = {
  todos: () => idb("readonly", s => s.getAll()),
  uno: id => idb("readonly", s => s.get(id)),
  guardar: v => idb("readwrite", s => s.put(v)),
  async borrar(id) {
    const v = await idb("readonly", s => s.get(id));
    if (v && v.ruta && window.Capacitor && Capacitor.Plugins.Motor) { try { await Capacitor.Plugins.Motor.borrar({ ruta: v.ruta }); } catch (e) {} }
    return idb("readwrite", s => s.delete(id));
  },
};

// ------------------------------------------------------------------ nichos y temas
const NICHOS = {
  curiosos: { nombre: "Datos curiosos", icono: "💡", tags: ["datoscuriosos", "sabiasque"], noticias: "descubrimiento científico curioso" },
  ovnis: { nombre: "Datos de OVNIs", icono: "🛸", tags: ["ovni", "misterio"], noticias: "ovni avistamiento" },
  animales: { nombre: "Animales", icono: "🐙", tags: ["animales", "naturaleza"], noticias: "nueva especie animal" },
  historia: { nombre: "Historia", icono: "🏛️", tags: ["historia", "sabiasque"], noticias: "hallazgo arqueológico" },
  planeta: { nombre: "Planeta y Vía Láctea", icono: "🌌", tags: ["universo", "astronomia"], noticias: "NASA descubrimiento espacio" },
  misterios: { nombre: "Misterios", icono: "🕯️", tags: ["misterios", "sinresolver"], noticias: "misterio sin resolver" },
  terror: { nombre: "Leyendas y terror", icono: "👻", tags: ["leyendas", "terror"], noticias: "leyenda urbana" },
  cuerpo: { nombre: "Cuerpo humano", icono: "🧠", tags: ["cuerpohumano", "salud"], noticias: "estudio cuerpo humano" },
  ciencia: { nombre: "Ciencia e inventos", icono: "🔬", tags: ["ciencia", "inventos"], noticias: "científicos descubren" },
  tecnologia: { nombre: "Tecnología", icono: "🤖", tags: ["tecnologia", "inteligenciaartificial"], noticias: "tecnología nueva" },
  lugares: { nombre: "Lugares del mundo", icono: "🌍", tags: ["viajes", "lugaresincreibles"], noticias: "lugar increíble descubierto" },
  comida: { nombre: "Comida", icono: "🍫", tags: ["comida", "curiosidades"], noticias: "comida curiosidad" },
  deportes: { nombre: "Deportes", icono: "⚽", tags: ["deportes", "futbol"], noticias: "récord deportivo" },
  famosos: { nombre: "Personajes históricos", icono: "👑", tags: ["historia", "personajes"], noticias: "historia personaje" },
};
const TEMAS_EXTRA = {
  terror: ["Llorona", "Chupacabras", "Bruja de Blair", "Drácula", "Vampiro", "Hombre lobo", "Isla de las Muñecas", "Poveglia",
    "Castillo de Bran", "Zombi", "Ouija", "Slender Man", "Annabelle", "Exorcismo", "Momia", "Fantasma", "Casa Winchester",
    "Mothman", "Bigfoot", "Yeti", "Nahual", "Chaneque", "Wendigo", "Banshee", "Catacumbas de París", "Bosque de Aokigahara"],
  cuerpo: ["Cerebro humano", "Corazón humano", "Ojo humano", "Piel", "Hueso", "Sangre", "ADN", "Sueño", "Bostezo", "Hipo", "Risa",
    "Huella dactilar", "Pulmón", "Hígado", "Riñón", "Estómago", "Diente", "Cabello", "Uña", "Memoria (proceso)", "Sistema inmunitario",
    "Músculo", "Lengua", "Oído", "Microbiota intestinal", "Estornudo"],
  ciencia: ["Agujero negro", "Electricidad", "Imán", "Rayo láser", "Penicilina", "Bombilla", "Teléfono", "Internet", "Avión",
    "Rayos X", "Energía nuclear", "Vacuna", "Microscopio", "Telescopio", "Dinamita", "Imprenta", "Rueda", "Brújula", "Reloj",
    "Radio (medio de comunicación)", "Televisión", "Cohete", "Satélite artificial", "Nikola Tesla", "Thomas Alva Edison", "Marie Curie"],
  tecnologia: ["Inteligencia artificial", "Robot", "Teléfono inteligente", "Videojuego", "Bitcoin", "Computadora cuántica",
    "Realidad virtual", "Dron", "Impresión 3D", "Tesla, Inc.", "Apple", "Google", "Steve Jobs", "Bill Gates", "Elon Musk",
    "Nintendo", "PlayStation", "Minecraft", "Wi-Fi", "Bluetooth", "GPS", "Código QR", "Hacker", "Fibra óptica", "Chip"],
  lugares: ["Machu Picchu", "Chichén Itzá", "Petra", "Taj Mahal", "Torre Eiffel", "Gran Muralla China", "Coliseo", "Islas Galápagos",
    "Salar de Uyuni", "Cataratas del Iguazú", "Cataratas del Niágara", "Gran Cañón del Colorado", "Monte Everest", "Antártida",
    "Isla de Pascua", "Venecia", "Dubái", "Burj Khalifa", "Santorini", "Bora Bora", "Islandia", "Groenlandia", "Desierto de Atacama",
    "Lago Titicaca", "Amazonia", "Teotihuacan", "Ciudad del Vaticano", "Mónaco", "Tokio", "Nueva York"],
  comida: ["Chocolate", "Café", "Pizza", "Hamburguesa", "Taco", "Sushi", "Helado", "Palomitas de maíz", "Miel", "Queso", "Pan",
    "Aguacate", "Plátano", "Fresa", "Tomate", "Papa", "Maíz", "Arroz", "Coca-Cola", "Chile (pimiento)", "Vainilla", "Azúcar",
    "Sal", "Té", "Ceviche", "Mole"],
  deportes: ["Fútbol", "Copa Mundial de la FIFA", "Juegos Olímpicos", "Lionel Messi", "Cristiano Ronaldo", "Pelé", "Diego Maradona",
    "Michael Jordan", "Usain Bolt", "Muhammad Ali", "Baloncesto", "Tenis", "Fórmula 1", "Boxeo", "Béisbol", "Surf", "Ajedrez",
    "Maratón", "Real Madrid Club de Fútbol", "Fútbol Club Barcelona", "Copa Libertadores", "Super Bowl", "Lucha libre mexicana"],
  famosos: ["Cleopatra", "Julio César", "Napoleón Bonaparte", "Alejandro Magno", "Cristóbal Colón", "Leonardo da Vinci",
    "Albert Einstein", "Isaac Newton", "Galileo Galilei", "Marie Curie", "Nikola Tesla", "Frida Kahlo", "Simón Bolívar",
    "Moctezuma II", "Atahualpa", "Genghis Khan", "Juana de Arco", "William Shakespeare", "Wolfgang Amadeus Mozart",
    "Vincent van Gogh", "Pablo Picasso", "Charles Darwin", "Abraham Lincoln", "Mahatma Gandhi", "Martin Luther King", "Tutankamón"],
};
const TEMAS = {
  ovnis: ["Incidente ovni de Roswell", "Área 51", "Luces de Phoenix", "Incidente del bosque de Rendlesham", "Ola ovni belga",
    "Proyecto Libro Azul", "Incidente ovni de Kecksburg", "Caso Varginha", "Abducción de Betty y Barney Hill", "Foo fighter",
    "Batalla de Los Ángeles", "Luces de Hessdalen", "Incidente ovni de Westall", "Triángulo de las Bermudas", "Señal Wow!",
    "Paradoja de Fermi", "Ecuación de Drake", "Objeto volador no identificado", "Fenómeno aéreo no identificado",
    "Incidente ovni de Shag Harbour", "Caso Manises", "Ovni de Tic Tac", "Proyecto Sign", "Kenneth Arnold", "Círculo en los cultivos",
    "Hombres de negro", "Búsqueda de inteligencia extraterrestre", "Oumuamua", "Incidente de Travis Walton", "Ufología",
    "Disco volador", "Incidente ovni de Socorro", "Incidente de Valentich"],
  curiosos: ["Pulpo", "Agujero negro", "Cerebro humano", "Tiburón blanco", "Pirámides de Guiza", "RMS Titanic", "Accidente de Chernóbil",
    "Monte Everest", "Ajolote", "Abeja", "Luna", "Marte", "Fosa de las Marianas", "Gran Muralla China", "Tyrannosaurus rex", "Colibrí",
    "Camaleón", "Turritopsis dohrnii", "Rayo", "Aurora polar", "Desierto del Sahara", "Río Amazonas", "Diamante", "Sueño", "ADN",
    "Corazón humano", "Ojo humano", "Coliseo", "Machu Picchu", "Stonehenge", "La Gioconda", "Leonardo da Vinci", "Nikola Tesla",
    "Albert Einstein", "Cleopatra", "Samurái", "Vikingo", "Momia", "Terremoto", "Tsunami", "Sol", "Júpiter (planeta)",
    "Saturno (planeta)", "Vía Láctea", "Big Bang", "Tardigrada", "Pingüino emperador", "Elefante africano", "Ballena azul", "Hormiga",
    "Cocodrilo", "Lobo", "Oso polar", "Koala", "Jirafa", "Delfín", "Tiburón ballena", "Mariposa monarca", "Café", "Chocolate",
    "Apolo 11", "Torre Eiffel", "Estatua de la Libertad", "Volcán", "Huracán", "Cometa Halley", "Estación Espacial Internacional",
    "Murciélago", "Búho", "Medusa", "Caballito de mar", "Calamar gigante", "Hipopótamo", "Antártida", "Isla de Pascua", "Petra",
    "Chichén Itzá", "Taj Mahal", "Napoleón Bonaparte", "Julio César", "Alejandro Magno", "Imperio romano", "Antiguo Egipto", "Aztecas",
    "Mayas", "Incas", "Peste negra", "Cristóbal Colón", "Marie Curie", "Isaac Newton", "Galileo Galilei"],
  animales: ["Pulpo", "Ajolote", "Colibrí", "Camaleón", "Tardigrada", "Pingüino emperador", "Elefante africano", "Ballena azul", "Hormiga",
    "Cocodrilo", "Lobo", "Oso polar", "Koala", "Jirafa", "Delfín", "Tiburón ballena", "Mariposa monarca", "Murciélago", "Búho", "Medusa",
    "Caballito de mar", "Calamar gigante", "Hipopótamo", "Tiburón blanco", "Ornitorrinco", "Perezoso", "Guepardo", "Abeja"],
  historia: ["Coliseo", "Machu Picchu", "Stonehenge", "Cleopatra", "Samurái", "Vikingo", "Momia", "Napoleón Bonaparte", "Julio César",
    "Alejandro Magno", "Imperio romano", "Antiguo Egipto", "Aztecas", "Mayas", "Incas", "Peste negra", "Cristóbal Colón",
    "Pirámides de Guiza", "Gran Muralla China", "Chichén Itzá", "Petra", "RMS Titanic", "Apolo 11", "Isla de Pascua", "Taj Mahal"],
  planeta: ["Agujero negro", "Luna", "Marte", "Sol", "Júpiter (planeta)", "Saturno (planeta)", "Vía Láctea", "Big Bang", "Cometa Halley",
    "Estación Espacial Internacional", "Aurora polar", "Venus (planeta)", "Neptuno (planeta)", "Nebulosa", "Exoplaneta",
    "Estrella de neutrones", "Supernova", "Galaxia de Andrómeda"],
  misterios: ["Triángulo de las Bermudas", "Manuscrito Voynich", "Mary Celeste", "Incidente del paso Diatlov", "Atlántida", "Stonehenge",
    "Isla de Pascua", "Señal Wow!", "Líneas de Nazca", "Mecanismo de Anticitera", "Monstruo del lago Ness", "Jack el Destripador", "Área 51"],
};

Object.assign(TEMAS, TEMAS_EXTRA);
TEMAS.ovnis.push("Extraterrestre", "Abducción", "Encuentro cercano", "Proyecto Blue Book", "Marfa lights", "Avistamiento ovni de 1561 en Núremberg");
TEMAS.animales.push("Pulpo de anillos azules", "Pez globo", "Axolote", "Mantis religiosa", "Lobo marino", "Orca", "Panda gigante",
  "León", "Tigre", "Águila real", "Cóndor andino", "Jaguar", "Anaconda", "Piraña", "Escorpión", "Tarántula", "Luciérnaga", "Pez abisal");
TEMAS.planeta.push("Plutón (planeta enano)", "Mercurio (planeta)", "Urano (planeta)", "Eclipse solar", "Meteorito", "Asteroide",
  "Agujero de gusano", "Materia oscura", "Telescopio espacial James Webb", "Voyager 1", "Gravedad", "Estrella fugaz");
TEMAS.misterios.push("Desaparición del vuelo 370 de Malaysia Airlines", "Ciudad perdida de Z", "El Dorado", "Santo Grial",
  "Arca de la Alianza", "Piedras de Ica", "Mapa de Piri Reis", "Pirámide de Bosnia", "Esfinge de Guiza", "Teotihuacan");
TEMAS.historia.push("Primera Guerra Mundial", "Segunda Guerra Mundial", "Revolución mexicana", "Revolución francesa",
  "Caída del muro de Berlín", "Hundimiento del Titanic", "Imperio inca", "Imperio mongol", "Esparta", "Gladiador", "Pirata", "Caballero medieval");

function temaNuevo(nicho) {
  const lista = TEMAS[nicho] || TEMAS.curiosos;
  const usados = LS.get("usados_" + nicho, []);
  let libres = lista.filter(t => !usados.includes(t));
  if (!libres.length) { LS.set("usados_" + nicho, []); libres = lista; }
  return libres[Math.floor(Math.random() * libres.length)];
}
function marcarUsado(t, nicho) {
  const u = LS.get("usados_" + nicho, []);
  if (!u.includes(t)) { u.push(t); LS.set("usados_" + nicho, u); }
}

// ------------------------------------------------------------------ fuentes (con la red del teléfono)
async function wiki(params) {
  const u = new URL("https://es.wikipedia.org/w/api.php");
  Object.entries({ ...params, format: "json", formatversion: "2", origin: "*" }).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u);
  return r.json();
}
const paginas = r => (r.query && r.query.pages) || [];

async function articulo(tema) {
  const r = await wiki({ action: "query", generator: "search", gsrsearch: tema, gsrlimit: 1, prop: "extracts", explaintext: 1, exlimit: 1 });
  const pg = paginas(r)[0];
  if (!pg || !pg.extract || pg.extract.length < 600) return null;
  return { titulo: pg.title, texto: pg.extract.slice(0, 14000), fotos: await fotosWiki(pg.title) };
}

async function fotosWiki(titulo) {
  const r = await wiki({ action: "query", titles: titulo, generator: "images", gimlimit: 50, prop: "imageinfo",
    iiprop: "url|size|mime", iiurlwidth: 1280 });
  const malas = /(icon|logo|flag|bandera|escudo|mapa|map|locator|commons-|wiki|symbol|disambig|edit|ambox|question|location|coat|seal)/i;
  const out = [];
  for (const p of paginas(r)) {
    const ii = (p.imageinfo || [])[0];
    if (!ii || malas.test(p.title || "")) continue;
    if (!/image\/(jpeg|png)/.test(ii.mime || "") || (ii.width || 0) < 600) continue;
    out.push(ii.thumburl || ii.url);
  }
  return out.slice(0, 14);
}

async function fotosNasa(q) {
  try {
    const u = new URL("https://images-api.nasa.gov/search"); u.searchParams.set("q", q); u.searchParams.set("media_type", "image");
    const j = await (await fetch(u)).json();
    return (j.collection.items || []).slice(0, 10).map(i => i.links && i.links[0] && i.links[0].href).filter(Boolean);
  } catch (e) { return []; }
}
async function fotosPexels(q) {
  const k = LS.get("pexels", ""); if (!k) return [];
  try {
    const u = new URL("https://api.pexels.com/v1/search"); u.searchParams.set("query", q); u.searchParams.set("per_page", 10);
    u.searchParams.set("orientation", "portrait"); u.searchParams.set("locale", "es-ES");
    const j = await (await fetch(u, { headers: { Authorization: k } })).json();
    return (j.photos || []).map(p => p.src && p.src.large2x).filter(Boolean);
  } catch (e) { return []; }
}
async function fotosPixabay(q) {
  const k = LS.get("pixabay", ""); if (!k) return [];
  try {
    const u = new URL("https://pixabay.com/api/");
    Object.entries({ key: k, q, lang: "es", image_type: "photo", orientation: "vertical", safesearch: "true", per_page: 10 })
      .forEach(([a, b]) => u.searchParams.set(a, b));
    const j = await (await fetch(u)).json();
    return (j.hits || []).map(h => h.largeImageURL).filter(Boolean);
  } catch (e) { return []; }
}
async function fotosExtra(q, nicho) {
  let out = [];
  if (nicho === "planeta" || nicho === "ovnis") out = out.concat(await fotosNasa(q));
  out = out.concat(await fotosPexels(q), await fotosPixabay(q));
  return out;
}

/** Noticias recientes en español del nicho (GDELT, gratis y sin clave). */
async function noticias(nicho) {
  try {
    const u = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
    Object.entries({ query: NICHOS[nicho].noticias + " sourcelang:spanish", mode: "artlist", format: "json", maxrecords: 25, timespan: "7d", sort: "hybridrel" })
      .forEach(([a, b]) => u.searchParams.set(a, b));
    const j = await (await fetch(u)).json();
    const vistos = LS.get("noticias_usadas", []);
    return (j.articles || []).map(a => a.title).filter(t => t && t.length > 25 && !vistos.includes(t));
  } catch (e) { return []; }
}

// ------------------------------------------------------------------ guion
const GANCHOS = [
  (t, n) => `¿Sabías esto de ${t}? Te cuento ${n} datos que casi nadie conoce.`,
  (t, n) => `${n} datos de ${t} que te van a volar la cabeza.`,
  (t, n) => `Lo que nadie te contó de ${t}: ${n} datos reales.`,
  (t, n) => `Quédate hasta el final: el último dato de ${t} es el más sorprendente.`,
];
const CIERRES = ["¿Cuál no sabías? Te leo en comentarios y sígueme para más.",
  "Comenta cuál te sorprendió más y sígueme para la parte dos.",
  "Guarda este video y compártelo con quien no lo sepa."];
const azar = a => a[Math.floor(Math.random() * a.length)];

function frases(texto) {
  let cuerpo = texto;
  for (const c of ["== Véase también", "== Referencias", "== Bibliografía", "== Enlaces externos", "== Notas"]) {
    const i = cuerpo.indexOf(c); if (i > 0) cuerpo = cuerpo.slice(0, i);
  }
  const limpio = cuerpo.split("\n").filter(l => !l.trim().startsWith("=")).join(" ")
    .replace(/\([^)]*\)/g, "").replace(/\[[^\]]*\]/g, "").replace(/\s{2,}/g, " ");
  let partes;
  if (window.Intl && Intl.Segmenter) partes = [...new Intl.Segmenter("es", { granularity: "sentence" }).segment(limpio)].map(s => s.segment);
  else partes = limpio.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡0-9])/);
  return partes.map(s => s.trim()).filter(s => s.length >= 45 && s.length <= 170 && !/[:;]/.test(s));
}

function mejores(fs, n) {
  const fuertes = ["más", "mayor", "menor", "único", "única", "primer", "récord", "millones", "miles", "hasta", "puede", "capaz",
    "nunca", "siempre", "descubr", "misterio", "secreto", "extraño", "increíble", "solo"];
  return fs.map((f, i) => {
    const l = f.toLowerCase();
    let p = /\d/.test(f) ? 3 : 0;
    p += fuertes.filter(x => l.includes(x)).length + (i < 3 ? 1 : 0);
    return [i, p];
  }).sort((a, b) => b[1] - a[1]).slice(0, n).map(x => x[0]).sort((a, b) => a - b).map(i => fs[i]);
}

const etiqueta = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const nombreTema = t => t.replace(/\s*\([^)]*\)/g, "");

function descripcion(tema, n, nicho, fuente) {
  const tags = [];
  for (const t of [etiqueta(tema), ...NICHOS[nicho].tags, "aprendeentiktok", "parati"])
    if (t.length > 2 && t.length <= 20 && !tags.includes(t)) tags.push(t);
  return `${azar(["💡", "🤯", "👀", "🔥", "✨"])} Datos curiosos de ${tema} que no sabías 🤯\n${n} datos reales, el último es el más sorprendente 👀 ` +
    `¿Cuál no conocías? Te leo en comentarios 👇 (Fuente: ${fuente})\n` + tags.map(t => "#" + t).join(" ");
}

async function guionWiki(tema, nicho, gancho) {
  paso(`Buscando ${tema} en Wikipedia…`);
  const a = await articulo(tema);
  if (!a) throw new Error(`No encontré ${tema} en Wikipedia.`);
  const fs = mejores(frases(a.texto), 6);
  if (fs.length < 6) throw new Error(`${a.titulo}: no hay suficientes datos verificables.`);
  // nombre que entiende la gente: el tema pedido ("Pulpo"), no el título científico del artículo ("Octopoda")
  const nombre = nombreTema(gancho ? a.titulo : tema);
  let fotos = a.fotos;
  if (fotos.length < 6) fotos = fotos.concat(await fotosExtra(nombre, nicho));
  if (fotos.length < 4) throw new Error(`${nombre}: muy pocas fotos del tema.`);
  return {
    tema: nombre, titulo: gancho ? gancho : `${fs.length} datos de ${nombre}`,
    escenas: [gancho ? `Es noticia: ${gancho}. Y esto es lo que debes saber de ${nombre}.` : azar(GANCHOS)(nombre, fs.length), ...fs, azar(CIERRES)],
    descripcion: descripcion(nombre, fs.length, nicho, gancho ? "Wikipedia y noticias" : "Wikipedia"),
    fotos,
  };
}

// ------------------------------------------------------------------ voz (Piper dentro del teléfono)
let _tts = null;
async function motorVoz() { if (!_tts) _tts = await import(TTS_URL); return _tts; }
const vozElegida = () => LS.get("voz", "es_MX-claude-high");

// el motor de la librería trae onnxruntime-web 1.27.0: sus archivos .wasm deben ser de esa misma versión
const RUTAS_WASM = {
  onnxWasm: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/",
  piperData: "https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.data",
  piperWasm: "https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.wasm",
};
let _sesion = null;
async function sesionVoz() {
  if (_sesion) return _sesion;
  const tts = await motorVoz();
  _sesion = await tts.TtsSession.create({
    voiceId: vozElegida(), wasmPaths: RUTAS_WASM,
    progress: p => { if (p && p.total) paso(`Descargando la voz (solo la primera vez)… ${Math.round(p.loaded * 100 / p.total)} %`); },
  });
  return _sesion;
}

async function hablar(texto, actx) {
  const s = await sesionVoz();
  const wav = await s.predict(texto);
  return actx.decodeAudioData(await wav.arrayBuffer());
}

// ------------------------------------------------------------------ fotos
async function cargarFoto(url) {
  try {
    const r = await fetch(url, { mode: "cors" });
    if (!r.ok) return null;
    const bmp = await createImageBitmap(await r.blob());
    if (bmp.width < 300) return null;
    const c = document.createElement("canvas");
    c.width = Math.round(W * 1.15); c.height = Math.round(H * 1.15);
    const g = c.getContext("2d");
    const s = Math.max(c.width / bmp.width, c.height / bmp.height);
    const w = bmp.width * s, h = bmp.height * s;
    g.drawImage(bmp, (c.width - w) / 2, (c.height - h) / 2, w, h);
    bmp.close && bmp.close();
    return c;
  } catch (e) { return null; }
}

// ------------------------------------------------------------------ dibujo de cada cuadro
function envolver(g, texto, ancho) {
  const palabras = texto.split(" "), lineas = [];
  let l = "";
  for (const p of palabras) {
    const prueba = l ? l + " " + p : p;
    if (g.measureText(prueba).width > ancho && l) { lineas.push(l); l = p; } else l = prueba;
  }
  if (l) lineas.push(l);
  return lineas;
}

function caja(g, texto, y, tam, fondo, color) {
  g.font = `900 ${tam}px -apple-system, system-ui, sans-serif`;
  const lineas = envolver(g, texto, W - 200);
  const alto = lineas.length * tam * 1.15 + 44;
  const ancho = Math.max(...lineas.map(l => g.measureText(l).width)) + 72;
  g.fillStyle = fondo;
  const x = (W - ancho) / 2, r = 28;
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y - 22, ancho, alto, r); else g.rect(x, y - 22, ancho, alto);
  g.fill();
  g.fillStyle = color; g.textAlign = "center"; g.textBaseline = "top";
  lineas.forEach((l, i) => g.fillText(l, W / 2, y + i * tam * 1.15));
}

function subtitulo(g, texto, y) {
  g.font = `900 86px -apple-system, system-ui, sans-serif`;
  g.textAlign = "center"; g.textBaseline = "top"; g.lineJoin = "round";
  envolver(g, texto, W - 120).forEach((l, i) => {
    const yy = y + i * 98;
    g.lineWidth = 16; g.strokeStyle = "#000"; g.strokeText(l, W / 2, yy);
    g.fillStyle = "#ffee33"; g.fillText(l, W / 2, yy);
  });
}

function dibujar(g, t, v) {
  const k = Math.max(0, v.escenas.findLastIndex ? v.escenas.findLastIndex(e => e.inicio <= t) : v.escenas.map(e => e.inicio <= t).lastIndexOf(true));
  const e = v.escenas[k];
  const local = t - e.inicio;
  const j = Math.min(v.tramos[k].length - 1, Math.floor(local / CORTE));
  g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
  if (v.fotos.length) {
    const n = v.tramos[k][j], foto = v.fotos[n];
    const p = Math.min(1, Math.max(0, (local - j * CORTE) / CORTE));
    const acerca = n % 2 === 0;
    const z = acerca ? 1 + 0.12 * p : 1.12 - 0.12 * p;
    const dw = W * z, dh = H * z, dx = (acerca ? 1 : -1) * 0.03 * W * p;
    g.drawImage(foto, (W - dw) / 2 + dx, (H - dh) / 2, dw, dh);
  }
  const gr = g.createLinearGradient(0, H * 0.5, 0, H);
  gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.78)");
  g.fillStyle = gr; g.fillRect(0, H * 0.5, W, H * 0.5);
  if (k === 0) caja(g, v.titulo.toUpperCase(), H * 0.13, 70, "rgba(255,138,0,0.93)", "#000");
  else if (k < v.escenas.length - 1) caja(g, "DATO " + k, H * 0.08, 52, "rgba(162,75,255,0.9)", "#fff");
  const pal = e.texto.split(" "), grupos = [];
  for (let i = 0; i < pal.length; i += 4) grupos.push(pal.slice(i, i + 4).join(" "));
  if (grupos.length) {
    const habla = Math.max(0.5, e.duracion - PAUSA);
    subtitulo(g, grupos[Math.min(grupos.length - 1, Math.floor(local / habla * grupos.length))].toUpperCase(), H * 0.66);
  }
}

// ------------------------------------------------------------------ montaje + grabación (MediaRecorder)
const MUXER_URL = "https://cdn.jsdelivr.net/npm/mp4-muxer@5.2.2/+esm";

/** La mejor configuración H.264 que el teléfono puede codificar (1080p si se puede, si no 720p) + audio AAC. */
async function configVideo() {
  if (!window.VideoEncoder || !window.AudioEncoder || !window.VideoFrame) return null;
  const acfg = { codec: "mp4a.40.2", sampleRate: 48000, numberOfChannels: 1, bitrate: 128000 };
  try { if (!(await AudioEncoder.isConfigSupported(acfg)).supported) return null; } catch (e) { return null; }
  const opciones = [[1080, 1920, "avc1.640028"], [1080, 1920, "avc1.4d0028"], [1080, 1920, "avc1.420034"],
    [720, 1280, "avc1.42001f"], [720, 1280, "avc1.420034"]];
  for (const [w, h, codec] of opciones) {
    const vcfg = { codec, width: w, height: h, bitrate: w >= 1080 ? 4000000 : 2500000, framerate: 30, avc: { format: "avc" } };
    try { if ((await VideoEncoder.isConfigSupported(vcfg)).supported) return { v: vcfg, a: acfg }; } catch (e) {}
  }
  return null;
}

async function a48k(pista) {
  if (pista.sampleRate === 48000) return pista;
  const off = new OfflineAudioContext(1, Math.ceil(pista.duration * 48000), 48000);
  const s = off.createBufferSource(); s.buffer = pista; s.connect(off.destination); s.start();
  return off.startRendering();
}

async function codificarMP4(v, pista, total, cfg) {
  const { Muxer, ArrayBufferTarget } = await import(MUXER_URL);
  const W2 = cfg.v.width, H2 = cfg.v.height;
  const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: "avc", width: W2, height: H2 },
    audio: { codec: "aac", numberOfChannels: 1, sampleRate: 48000 }, fastStart: "in-memory" });
  let fallo = null;
  const venc = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: e => { fallo = e; } });
  venc.configure(cfg.v);
  const aenc = new AudioEncoder({ output: (c, m) => muxer.addAudioChunk(c, m), error: e => { fallo = e; } });
  aenc.configure(cfg.a);

  // voz
  const datos = (await a48k(pista)).getChannelData(0), N = 4096;
  for (let i = 0; i < datos.length; i += N) {
    const trozo = datos.slice(i, Math.min(i + N, datos.length));
    const ad = new AudioData({ format: "f32-planar", sampleRate: 48000, numberOfFrames: trozo.length, numberOfChannels: 1,
      timestamp: Math.round(i / 48000 * 1e6), data: trozo });
    aenc.encode(ad); ad.close();
  }

  // imagen, cuadro a cuadro
  const lienzo = $("#lienzo"), g = lienzo.getContext("2d");
  const chico = W2 === W ? null : Object.assign(document.createElement("canvas"), { width: W2, height: H2 });
  const gc = chico && chico.getContext("2d");
  const cuadros = Math.ceil(total * 30);
  for (let i = 0; i < cuadros; i++) {
    if (parar) break;
    if (fallo) throw fallo;
    dibujar(g, i / 30, v);
    let fuente = lienzo;
    if (chico) { gc.drawImage(lienzo, 0, 0, W2, H2); fuente = chico; }
    const vf = new VideoFrame(fuente, { timestamp: Math.round(i * 1e6 / 30), duration: Math.round(1e6 / 30) });
    venc.encode(vf, { keyFrame: i % 60 === 0 }); vf.close();
    while (venc.encodeQueueSize > 4) await new Promise(r => setTimeout(r, 5));
    if (i % 15 === 0) { paso(`Montando el video… ${Math.round(i / cuadros * 100)} %`); await new Promise(r => setTimeout(r, 0)); }
  }
  await venc.flush(); await aenc.flush();
  if (fallo) throw fallo;
  muxer.finalize(); venc.close(); aenc.close();
  if (parar) throw new Error("Detenido.");
  return new Blob([muxer.target.buffer], { type: "video/mp4" });
}

function tipoVideo() {
  const t = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4;codecs=avc1,mp4a", "video/mp4",
    "video/webm;codecs=h264,opus", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  return t.find(x => window.MediaRecorder && MediaRecorder.isTypeSupported(x)) || "";
}

async function montar(guion, actx) {
  // 1) voz de cada frase
  const audios = [];
  for (let i = 0; i < guion.escenas.length; i++) {
    if (parar) throw new Error("Detenido.");
    paso(`Grabando la voz ${i + 1}/${guion.escenas.length}…`);
    audios.push(await hablar(guion.escenas[i], actx));
  }
  const sr = actx.sampleRate, hueco = Math.round(PAUSA * sr);
  const largo = audios.reduce((s, a) => s + a.length + hueco, 0);
  const pista = actx.createBuffer(1, largo, sr);
  const datos = pista.getChannelData(0);
  const escenas = [];
  let cursor = 0;
  audios.forEach((a, i) => {
    datos.set(a.getChannelData(0), cursor);
    escenas.push({ texto: guion.escenas[i], inicio: cursor / sr, duracion: (a.length + hueco) / sr });
    cursor += a.length + hueco;
  });
  const total = largo / sr;

  // 2) fotos
  paso(`Descargando fotos de ${guion.tema}…`);
  const fotos = [];
  for (const u of guion.fotos) { if (fotos.length >= 12) break; const f = await cargarFoto(u); if (f) fotos.push(f); }
  if (fotos.length < 3) throw new Error(`${guion.tema}: no se pudieron bajar las fotos.`);
  let n = 0;
  const tramos = escenas.map(e => Array.from({ length: Math.max(1, Math.ceil(e.duracion / CORTE)) }, () => (n++) % fotos.length));
  const v = { escenas, fotos, tramos, titulo: guion.titulo };

  // 3a) MP4 de verdad (H.264 + AAC) con WebCodecs: lo que TikTok acepta, y más rápido que grabar en tiempo real
  const cfg = await configVideo();
  if (cfg) {
    const lz = $("#lienzo");
    lz.style.display = "block";
    try { return await codificarMP4(v, pista, total, cfg); } finally { lz.style.display = "none"; }
  }

  // 3) grabar el lienzo + la voz en tiempo real
  const lienzo = $("#lienzo"), g = lienzo.getContext("2d");
  lienzo.style.display = "block";
  dibujar(g, 0, v);
  const mime = tipoVideo();
  if (!mime) throw new Error("Este navegador no puede grabar video. Usa Safari actualizado.");
  const destino = actx.createMediaStreamDestination();
  const fuente = actx.createBufferSource();
  fuente.buffer = pista;
  fuente.connect(destino);
  const flujo = new MediaStream([...lienzo.captureStream(30).getVideoTracks(), ...destino.stream.getAudioTracks()]);
  const rec = new MediaRecorder(flujo, { mimeType: mime, videoBitsPerSecond: 4000000, audioBitsPerSecond: 128000 });
  const trozos = [];
  rec.ondataavailable = ev => { if (ev.data && ev.data.size) trozos.push(ev.data); };
  const fin = new Promise(ok => { rec.onstop = ok; });
  rec.start(1000);
  const t0 = actx.currentTime + 0.15;
  fuente.start(t0);
  await new Promise(ok => {
    const cuadro = () => {
      const t = actx.currentTime - t0;
      if (t >= total || parar) { ok(); return; }
      if (t >= 0) dibujar(g, t, v);
      paso(`Montando el video… ${Math.max(0, Math.round(t / total * 100))} %`);
      setTimeout(cuadro, 1000 / 30);
    };
    cuadro();
  });
  dibujar(g, Math.max(0, total - 0.01), v);
  await new Promise(ok => setTimeout(ok, 300));
  rec.stop();
  await fin;
  try { fuente.stop(); } catch (e) {}
  flujo.getTracks().forEach(t => t.stop());
  lienzo.style.display = "none";
  if (parar) throw new Error("Detenido.");
  return new Blob(trozos, { type: mime.split(";")[0] });
}

// ------------------------------------------------------------------ crear desde un enlace (solo app Android: yt-dlp + ffmpeg)
const Motor = () => window.Capacitor.Plugins.Motor;
const TRANSICIONES = ["fade", "slideleft", "circleopen", "wipeleft", "slideup", "dissolve", "radial", "smoothleft",
  "circleclose", "wiperight", "smoothup", "fadeblack", "slideright"];

function segundos(hms) { const [h, m, s] = hms.split(":").map(Number); return h * 3600 + m * 60 + s; }

async function infoVideo(ruta) {
  const r = await Motor().ffmpeg({ args: ["-hide_banner", "-i", ruta] });
  const d = /Duration:\s*(\d+:\d+:[\d.]+)/.exec(r.salida || "");
  return { duracion: d ? segundos(d[1]) : 0, audio: /Stream #.*Audio:/.test(r.salida || "") };
}

const FUENTES = [["sans-serif-black", "Negrita extra · gruesa"], ["sans-serif-condensed", "Condensada · alta"], ["serif", "Serif · elegante"],
  ["cursive", "Cursiva"], ["casual", "Casual · divertida"], ["monospace", "Técnica"], ["sans-serif-medium", "Suave"]];
const RECETAS = {
  viral: { nombre: "Viral", desc: "Letras grandes con borde, zoom y cambios cada 3 s.", estilo: "ninguno", caja: false, fijo: false, tam: 110, color: "#FFE600" },
  cine: { nombre: "Cine", desc: "Color de película, bordes oscuros y texto en caja.", estilo: "color_cine", caja: "#000000", fijo: true, tam: 70, color: "#FFFFFF" },
  noticia: { nombre: "Noticia", desc: "Frases en caja azul, imagen sin tocar.", estilo: "noti_oceano", caja: "#1E64C8", fijo: true, tam: 76, color: "#FFFFFF" },
  limpio: { nombre: "Limpio", desc: "Texto pequeño y nada más.", estilo: "ninguno", caja: false, fijo: true, tam: 56, color: "#FFFFFF" },
};

const rr = (g, x, y, w, h, r) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); };
function envolverTxt(g, texto, ancho) {
  const out = []; let l = "";
  for (const p of texto.split(" ")) { const t = l ? l + " " + p : p; if (g.measureText(t).width > ancho && l) { out.push(l); l = p; } else l = t; }
  if (l) out.push(l); return out;
}

/** Título en letras grandes (tipo, tamaño y color elegidos), con borde negro o en caja. PNG transparente 1080x1920. */
async function pngTitulo(titulo, carpeta, op) {
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.font = `900 ${op.tam}px ${op.fuente}, sans-serif`; g.textAlign = "center"; g.textBaseline = "top"; g.lineJoin = "round";
  const lineas = envolverTxt(g, titulo.toUpperCase(), W - 140), alto = op.tam * 1.15;
  const y0 = op.pos != null ? op.pos : 230;
  if (op.caja) {
    const ancho = Math.min(W - 60, Math.max(...lineas.map(l => g.measureText(l).width)) + 70);
    g.fillStyle = op.caja; rr(g, (W - ancho) / 2, y0 - 22, ancho, lineas.length * alto + 40, 22); g.fill();
  }
  lineas.forEach((l, k) => {
    const y = y0 + k * alto;
    if (!op.caja) { g.lineWidth = Math.round(op.tam / 5); g.strokeStyle = "#000"; g.strokeText(l, W / 2, y); }
    g.fillStyle = op.color; g.fillText(l, W / 2, y);
  });
  const blob = await new Promise(ok => c.toBlob(ok, "image/png"));
  await window.Capacitor.Plugins.Filesystem.writeFile({ path: "links/titulo.png", data: await aBase64(blob), directory: "CACHE", recursive: true });
  return carpeta + "/titulo.png";
}

async function guardarPNG(blob, nombre, carpeta) {
  await window.Capacitor.Plugins.Filesystem.writeFile({ path: "links/" + nombre, data: await aBase64(blob), directory: "CACHE", recursive: true });
  return carpeta + "/" + nombre;
}

/** Volumen por segundo (0..1) del audio: los momentos intensos suelen ser los mejores. */
async function energiaVideo(ruta) {
  try {
    await Motor().ffmpeg({ args: ["-hide_banner", "-y", "-i", ruta, "-vn", "-ac", "1", "-af",
      "aresample=8000,asetnsamples=n=8000:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=rms.txt", "-f", "null", "-"] });
    const r = await window.Capacitor.Plugins.Filesystem.readFile({ path: "links/rms.txt", directory: "CACHE", encoding: "utf8" });
    const v = [...String(r.data).matchAll(/RMS_level=(-?[\d.]+|-inf)/g)].map(m => m[1] === "-inf" ? 0 : Math.pow(10, parseFloat(m[1]) / 20));
    if (v.length < 4) return [];
    const mx = [...v].sort((a, b) => a - b)[Math.floor(v.length * 0.98)] || 1;
    return v.map(x => Math.min(1, x / mx));
  } catch (e) { return []; }
}

/** Elige los n mejores momentos (picos de volumen y cambios bruscos), separados entre sí. Devuelve {inicios, puntos, etiquetas}. */
function mejoresMomentos(en, dur, n, D, antes) {
  const sm = (a, k) => a.map((_, i) => { let s = 0, c = 0; for (let j = Math.max(0, i - k); j <= Math.min(a.length - 1, i + k); j++) { s += a[j]; c++; } return s / c; });
  const salto = en.map((x, i) => Math.abs(x - (en[i - 1] ?? x)));
  const interes = sm(en, 1).map((x, i) => x + 0.8 * sm(salto, 1)[i]);
  const orden = interes.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]);
  const ini = [];
  for (const [, p] of orden) {
    const a = Math.max(0, Math.min(dur - D - 0.2, p - antes));
    if (ini.every(x => Math.abs(x - a) >= 4)) ini.push(a);
    if (ini.length >= n) break;
  }
  ini.sort((a, b) => a - b);
  const tope = Math.max(...interes, 0.001);
  const media = ini.map(a => { const s = en.slice(Math.floor(a), Math.ceil(a + D)); return s.reduce((x, y) => x + y, 0) / Math.max(1, s.length); });
  const pico = ini.map(a => Math.max(...interes.slice(Math.floor(a), Math.ceil(a + D)), 0) / tope);
  const puntos = Math.round(100 * (0.55 * (pico.reduce((x, y) => x + y, 0) / Math.max(1, pico.length)) + 0.45 * Math.min(1, (media.reduce((x, y) => x + y, 0) / Math.max(1, media.length)) / 0.6)));
  const etq = [];
  if (en[Math.floor(ini[0] || 0)] >= 0.45) etq.push("Arranque fuerte");
  if (salto.reduce((x, y) => x + y, 0) / Math.max(1, salto.length) > 0.12) etq.push("Mucha acción");
  if (media.reduce((x, y) => x + y, 0) / Math.max(1, media.length) < 0.12) etq.push("Sin diálogo");
  return { inicios: ini, puntos, etiquetas: etq };
}

async function crearDesdeLink(url, dur, tituloPedido, c, op) {
  if (!esAppAndroid()) throw new Error("Crear desde un enlace solo funciona en la app de Android (APK).");
  paso("Descargando el video del enlace…");
  const d = await Motor().descargar({ url });
  try {
    const info = await infoVideo(d.ruta);
    if (info.duracion < 4) throw new Error("El video es demasiado corto.");
    const D = 3.3, T = 0.3;                                         // cada corte dura 3 s visibles + 0,3 s de transición (una transición cada 3 s)
    let n = Math.round((dur - T) / (D - T));
    n = Math.max(2, Math.min(n, Math.floor(info.duracion * 0.9 / 3)));
    let puntos, resumen = "";
    if (op.mejores) {
      paso("Buscando los mejores momentos…");
      const en = await energiaVideo(d.ruta);
      if (en.length) {
        const m = mejoresMomentos(en, info.duracion, n, D, 1);
        puntos = m.inicios; n = puntos.length;
        resumen = `${m.puntos} puntos` + (m.etiquetas.length ? " · " + m.etiquetas.join(", ") : "");
      }
    }
    if (!puntos) {
      const ini = info.duracion * 0.05, fin = info.duracion * 0.95 - D;
      puntos = Array.from({ length: n }, (_, i) => ini + (fin - ini) * i / Math.max(1, n - 1));
    }
    const titulo = (tituloPedido || d.titulo || "Mira esto").slice(0, 70);
    const png = await pngTitulo(titulo, d.carpeta, op);
    let marco = null;
    const mb = await marcoPNG(op.estilo, titulo, c.nombre === "mi TikTok" ? "" : c.nombre);
    if (mb) marco = await guardarPNG(mb, "marco.png", d.carpeta);
    const fil = filtro(op.estilo);

    const salida = `${d.carpeta}/viralia_${Date.now()}.mp4`;
    const segs = [];
    let fase = "", base = 0, largo = 1;
    const oyente = await Motor().addListener("progreso", ev => {
      const m = /time=(\d+:\d+:[\d.]+)/.exec(ev.linea || "");
      if (m) paso(`${fase} ${Math.min(99, Math.round((base + segundos(m[1])) / largo * 100))} %`);
    });
    const correr = async args => {
      const r = await Motor().ffmpeg({ args: [...args, "-threads", "2"] });
      if (r.codigo !== 0) { const e = new Error("ffmpeg " + r.codigo + ": " + (r.salida || "").trim().split("\n").filter(l => !/^\s*frame=/.test(l)).slice(-3).join(" | ")); e.ffmpeg = true; throw e; }
    };
    const encuadre = op.completa
      ? "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p[v]"
      : "[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:2[f];" +
        "[b]scale=1080:1920:force_original_aspect_ratio=decrease[c];[f][c]overlay=(W-w)/2:(H-h)/2,setsar=1,fps=30,format=yuv420p[v]";
    try {
      // paso 1: cada corte de 3 s por separado (vertical) -> poca memoria. Si uno falla se reintenta y, si vuelve a fallar, se salta.
      for (let i = 0; i < n; i++) {
        if (parar) throw new Error("Detenido.");
        fase = `Preparando corte ${i + 1}/${n}…`; base = 0; largo = D;
        const seg = `${d.carpeta}/seg_${i}.mp4`;
        const a = ["-hide_banner", "-y", "-ss", puntos[i].toFixed(2), "-t", String(D), "-i", d.ruta];
        if (!info.audio) a.push("-f", "lavfi", "-t", String(D), "-i", "anullsrc=r=44100:cl=stereo");
        a.push("-filter_complex", encuadre, "-map", "[v]", "-map", info.audio ? "0:a:0" : "1:a", "-ac", "2", "-ar", "44100", "-t", String(D),
          "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-c:a", "aac", "-b:a", "160k", seg);
        let ok = false, ultimo = null;
        for (let k = 0; k < 2 && !ok; k++) { try { await correr(a); ok = true; } catch (e) { ultimo = e; } }
        if (ok) segs.push(seg); else if (!segs.length && i === n - 1) throw ultimo;
      }
      if (segs.length < 2) throw new Error("No se pudieron preparar los cortes del video.");
      const m = segs.length, total = m * D - (m - 1) * T;
      // paso 2: unir con una transición distinta cada 3 s, color del estilo, marco y título
      fase = "Uniendo con transiciones…"; base = 0; largo = total;
      const armar = conFiltro => {
        const args = ["-hide_banner", "-y"];
        segs.forEach(sg => args.push("-i", sg));
        let k = m; const idxTitulo = k++; args.push("-i", png);
        let idxMarco = -1; if (marco) { idxMarco = k++; args.push("-i", marco); }
        const f = [];
        for (let i = 0; i < m; i++) f.push(`[${i}:v]settb=AVTB,setpts=PTS-STARTPTS,fps=30,format=yuv420p[v${i}]`, `[${i}:a]asetpts=PTS-STARTPTS[s${i}]`);
        let vprev = "v0", aprev = "s0";
        for (let i = 1; i < m; i++) {
          const tr = TRANSICIONES[(i - 1) % TRANSICIONES.length];
          f.push(`[${vprev}][v${i}]xfade=transition=${tr}:duration=${T}:offset=${(i * (D - T)).toFixed(2)}[x${i}]`, `[${aprev}][s${i}]acrossfade=d=${T}[y${i}]`);
          vprev = `x${i}`; aprev = `y${i}`;
        }
        if (conFiltro && fil) { f.push(`[${vprev}]${fil}[vg]`); vprev = "vg"; }
        if (marco) { f.push(`[${vprev}][${idxMarco}:v]overlay=0:0[vm]`); vprev = "vm"; }
        f.push(`[${vprev}][${idxTitulo}:v]overlay=0:0${op.fijo ? "" : ":enable='lt(t,4)'"}[vf]`);
        args.push("-filter_complex", f.join(";"), "-map", "[vf]", "-map", `[${aprev}]`, "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
          "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-movflags", "+faststart", salida);
        return args;
      };
      try { await correr(armar(true)); }
      catch (e) { if (fil) await correr(armar(false)); else throw e; }       // si el celular no tiene ese filtro de color, sale sin él
    } finally {
      oyente && oyente.remove && oyente.remove();
      for (const sg of segs) { try { await Motor().borrar({ ruta: sg }); } catch (e) {} }
    }

    const palabras = titulo.split(/\s+/).map(etiqueta).filter(t => t.length > 3 && t.length <= 20).slice(0, 2);
    const tags = [...new Set([...palabras, "clips", "viral", "parati", "fyp"])];
    return {
      tema: titulo, ruta: salida, resumen,
      descripcion: `${titulo} 🎬🔥\n¿Qué opinas? Te leo en comentarios 👇\n` + tags.map(t => "#" + t).join(" "),
    };
  } finally {
    try { await Motor().borrar({ ruta: d.ruta }); } catch (e) {}
  }
}

/** Opciones elegidas en la pantalla (receta, estilo, letra, tamaño, color, encuadre, mejores momentos). */
function opcionesLink() {
  return { estilo: $("#lkEstilo").value, fuente: $("#lkFuente").value, tam: +$("#lkTam").value, color: $("#lkColor").value,
           caja: LINK.caja, fijo: LINK.fijo, completa: $("#lkEncuadre").value === "completa", mejores: $("#lkMejores").checked, pos: 230 };
}
const LINK = { caja: false, fijo: false };
function iniciarLink() {
  const r = $("#lkReceta");
  r.innerHTML = Object.entries(RECETAS).map(([k, v]) => `<button type="button" data-r="${k}"><b>${v.nombre}</b><small>${v.desc}</small></button>`).join("");
  const grupos = [...new Set(ESTILOS.map(e => e.grupo))];
  $("#lkEstilo").innerHTML = grupos.map(g => `<optgroup label="${g}">` + ESTILOS.filter(e => e.grupo === g).map(e => `<option value="${e.id}">${e.nombre}</option>`).join("") + "</optgroup>").join("");
  $("#lkFuente").innerHTML = FUENTES.map(([v, n]) => `<option value="${v}">${n}</option>`).join("");
  const vista = async () => {
    const u = await marcoURL($("#lkEstilo").value, "", "");
    $("#lkVista").style.backgroundImage = u ? `url(${u})` : "none";
    const t = $("#lkVistaTxt"); t.style.fontFamily = $("#lkFuente").value; t.style.color = $("#lkColor").value;
    t.style.fontSize = Math.round(+$("#lkTam").value / 4.2) + "px"; t.style.background = LINK.caja || "transparent";
    t.style.webkitTextStroke = LINK.caja ? "0" : "2px #000"; $("#lkTamN").textContent = $("#lkTam").value;
  };
  const aplicar = k => {
    const v = RECETAS[k]; LINK.caja = v.caja; LINK.fijo = v.fijo;
    $("#lkEstilo").value = v.estilo; $("#lkTam").value = v.tam; $("#lkColor").value = v.color;
    r.querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.r === k)); vista();
  };
  r.querySelectorAll("button").forEach(b => b.onclick = () => aplicar(b.dataset.r));
  ["lkEstilo", "lkFuente", "lkTam", "lkColor"].forEach(id => $("#" + id).oninput = vista);
  aplicar("viral");
}

// ------------------------------------------------------------------ crear (pestaña Crear)
let parar = false, trabajando = false, bloqueo = null;
function paso(t) { $("#paso").textContent = t; }
function anotar(t) {
  const h = new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  const l = LS.get("log", []); l.unshift(`${h}  ${t}`); LS.set("log", l.slice(0, 60)); pintarLog();
}
function pintarLog() { $("#log").textContent = LS.get("log", []).join("\n") || "—"; }

async function crear() {
  if (trabajando) return;
  const cuentas = LS.get("cuentas", []);
  const elegida = cuentas[+$("#cCuenta").value];
  // la categoría se elige aquí mismo; la cuenta es opcional (se publica en la que esté abierta en TikTok)
  const c = { nombre: elegida ? elegida.nombre : "mi TikTok", nicho: $("#cNicho").value };
  LS.set("ultima_categoria", c.nicho);
  const sel = $("#cTemaSel").value;
  const cant = +$("#cCant").value, modo = $("#cModo").value;
  const temaPedido = sel === "__otro" ? $("#cTema").value.trim() : (sel === "__auto" ? "" : sel);
  if (sel === "__otro" && !temaPedido) { toast("Escribe el tema"); return; }

  if (modo === "link") {
    const url = $("#cLink").value.trim();
    if (!/^https?:\/\/\S+/.test(url)) { toast("Pega un enlace de YouTube o TikTok"); return; }
    if (!esAppAndroid()) { toast("Crear desde un enlace funciona en la app de Android (APK).", 4000); return; }
    trabajando = true; parar = false;
    $("#bCrear").disabled = true; $("#progreso").style.display = "block"; $("#barra").style.width = "10%";
    try {
      const r = await crearDesdeLink(url, +$("#cDur").value, $("#cTitulo").value.trim(), c, opcionesLink());
      await Videos.guardar({ id: Date.now() + "_" + Math.random().toString(36).slice(2, 7), cuenta: c.nombre, tema: r.tema,
        descripcion: r.descripcion, fecha: Date.now(), publicado: false, ruta: r.ruta, tipo: "video/mp4" });
      anotar(`✔ Corto desde enlace: ${r.tema}` + (r.resumen ? " · " + r.resumen : ""));
      paso("Listo: corto creado. Ve a Publicar.");
      $("#cLink").value = "";
    } catch (e) {
      anotar(`✖ Enlace: ${e.message || e}`);
      paso("No se pudo: " + (e.message || e));
    }
    $("#barra").style.width = "100%";
    trabajando = false; $("#bCrear").disabled = false;
    pintarCola();
    return;
  }

  const actx = new (window.AudioContext || window.webkitAudioContext)();
  await actx.resume();                                         // el sonido se habilita con el toque del botón
  trabajando = true; parar = false;
  $("#bCrear").disabled = true; $("#progreso").style.display = "block";
  try { bloqueo = navigator.wakeLock && await navigator.wakeLock.request("screen"); } catch (e) {}
  let hechos = 0, intentos = 0;
  let titulares = modo === "noticias" ? await noticias(c.nicho) : [];
  while (hechos < cant && !parar && intentos < cant * 4) {
    intentos++;
    $("#barra").style.width = Math.round(hechos / cant * 100) + "%";
    try {
      let guion;
      if (modo === "noticias") {
        if (!titulares.length) throw new Error("No hay noticias nuevas de este nicho ahora.");
        const titular = titulares.shift();
        const u = LS.get("noticias_usadas", []); u.push(titular); LS.set("noticias_usadas", u.slice(-200));
        guion = await guionWiki(titular.split(/[:|–-]/)[0], c.nicho, titular);
      } else {
        const tema = temaPedido && hechos === 0 ? temaPedido : temaNuevo(c.nicho);
        guion = await guionWiki(tema, c.nicho);
        marcarUsado(tema, c.nicho);
      }
      const blob = await montar(guion, actx);
      await Videos.guardar({ id: Date.now() + "_" + Math.random().toString(36).slice(2, 7), cuenta: c.nombre, tema: guion.tema,
        descripcion: guion.descripcion, fecha: Date.now(), publicado: false, blob, tipo: blob.type });
      hechos++;
      anotar(`✔ @${c.nombre}: ${guion.tema}`);
    } catch (e) {
      anotar(`✖ ${e.message || e} (pruebo con otro tema)`);
    }
  }
  $("#barra").style.width = "100%";
  paso(parar ? "Detenido." : `Listo: ${hechos} video(s). Ve a Publicar.`);
  trabajando = false; $("#bCrear").disabled = false;
  try { bloqueo && bloqueo.release(); } catch (e) {}
  try { actx.close(); } catch (e) {}
  pintarCola();
}

// ------------------------------------------------------------------ publicar
let actual = null, archivoActual = null;
async function pintarCola() {
  const vs = (await Videos.todos()).filter(v => !v.publicado).sort((a, b) => a.fecha - b.fecha);
  const hoy = LS.get("pub_" + new Date().toDateString(), 0);
  $("#resumen").textContent = `Publicados hoy: ${hoy} · Recomendado: 3–4 al día en horas pico (12:30, 18:00, 20:30, 22:15).`;
  const L = $("#cola"); L.innerHTML = "";
  const por = {};
  vs.forEach(v => (por[v.cuenta] = por[v.cuenta] || []).push(v));
  if (!vs.length) { L.innerHTML = '<div class="box aviso">No hay videos en cola. Créalos en la pestaña Crear.</div>'; return; }
  for (const [cuenta, lista] of Object.entries(por)) {
    const b = document.createElement("div"); b.className = "box";
    b.innerHTML = `<b>@${esc(cuenta)}</b> <small class="aviso">· ${lista.length} en cola</small>`;
    lista.forEach(v => {
      const it = document.createElement("div"); it.className = "item";
      it.innerHTML = `<div><b>${esc(v.tema)}</b><small>${new Date(v.fecha).toLocaleString("es")}</small></div><button>Abrir</button>`;
      it.querySelector("button").onclick = () => abrir(v.id);
      b.appendChild(it);
    });
    L.appendChild(b);
  }
}
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function abrir(id) {
  actual = await Videos.uno(id);
  if (!actual) return;
  const vid = $("#dVideo");
  if (vid.src && vid.src.startsWith("blob:")) URL.revokeObjectURL(vid.src);
  if (actual.ruta) {                       // corto hecho desde un enlace: el archivo está en el teléfono
    archivoActual = { ruta: actual.ruta };
    vid.src = window.Capacitor.convertFileSrc("file://" + actual.ruta);
  } else {
    const ext = (actual.tipo || "").includes("mp4") ? "mp4" : "webm";
    archivoActual = new File([actual.blob], `viralia_${etiqueta(actual.tema).slice(0, 24)}.${ext}`, { type: actual.tipo || "video/mp4" });
    vid.src = URL.createObjectURL(actual.blob);
  }
  $("#dCuenta").innerHTML = `Abre TikTok en <b>@${esc(actual.cuenta)}</b>, toca PUBLICAR EN TIKTOK y elige TikTok. La descripción ya queda copiada: pégala y publica.`;
  $("#dTexto").textContent = actual.descripcion;
  $("#cola").style.display = "none"; $("#resumen").style.display = "none"; $("#detalle").style.display = "block";
  window.scrollTo(0, 0);
}
function cerrarDetalle() {
  $("#dVideo").pause();
  $("#detalle").style.display = "none"; $("#cola").style.display = "block"; $("#resumen").style.display = "block";
  actual = null; pintarCola();
}
// ------------------------------------------------------------------ app Android (APK): compartir con los plugins nativos
function esAppAndroid() {
  const c = window.Capacitor;
  return !!(c && c.isNativePlatform && c.isNativePlatform());
}
function aBase64(blob) {
  return new Promise((ok, mal) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(",", 2)[1]);
    r.onerror = () => mal(r.error);
    r.readAsDataURL(blob);
  });
}
async function compartirAndroid(file, texto) {
  const c = window.Capacitor;
  const { Filesystem, Share } = c.Plugins;
  if (file.ruta) {
    await Share.share({ title: "VIRALIA", text: texto, files: ["file://" + file.ruta], dialogTitle: "Publicar en TikTok" });
    return;
  }
  // por trozos: pasar 50 MB de una vez al sistema congela la app
  const TROZO = 1536 * 1024;
  for (let i = 0; i < file.size; i += TROZO) {
    const datos = await aBase64(file.slice(i, i + TROZO));
    if (i === 0) await Filesystem.writeFile({ path: file.name, data: datos, directory: "CACHE" });
    else await Filesystem.appendFile({ path: file.name, data: datos, directory: "CACHE" });
    toast(`Preparando el video… ${Math.round(i / file.size * 100)} %`, 1500);
  }
  const { uri } = await Filesystem.getUri({ path: file.name, directory: "CACHE" });
  await Share.share({ title: "VIRALIA", text: texto, files: [uri], dialogTitle: "Publicar en TikTok" });
}

function copiar(t) {
  if (esAppAndroid()) {
    try { window.Capacitor.Plugins.Clipboard.write({ string: t }); return; } catch (e) {}
  }
  try { navigator.clipboard.writeText(t); return; } catch (e) {}
  const a = document.createElement("textarea"); a.value = t; document.body.appendChild(a); a.select();
  try { document.execCommand("copy"); } catch (e) {} a.remove();
}

// ------------------------------------------------------------------ cuentas y ajustes
function pintarCuentas() {
  const cs = LS.get("cuentas", []);
  $("#cCuenta").innerHTML = '<option value="-1">La que tenga abierta en TikTok</option>' +
    cs.map((c, i) => `<option value="${i}">@${esc(c.nombre)}</option>`).join("");
  const L = $("#listaCuentas");
  L.innerHTML = "<b>Tus cuentas</b>";
  if (!cs.length) L.innerHTML += '<p class="aviso">Aún no hay cuentas.</p>';
  cs.forEach((c, i) => {
    const it = document.createElement("div"); it.className = "item";
    it.innerHTML = `<div><b>@${esc(c.nombre)}</b><small>${NICHOS[c.nicho].icono} ${NICHOS[c.nicho].nombre}</small></div><button class="no">Quitar</button>`;
    it.querySelector("button").onclick = () => {
      if (!confirm(`¿Quitar @${c.nombre} de VIRALIA? (no afecta a tu TikTok)`)) return;
      cs.splice(i, 1); LS.set("cuentas", cs); pintarCuentas();
    };
    L.appendChild(it);
  });
}

async function estadoVoz() {
  try {
    const tts = await motorVoz();
    const ya = await tts.stored();
    $("#estadoVoz").textContent = ya.includes(vozElegida()) ? "✔ Voz descargada en el teléfono." : "La voz se descargará la primera vez que crees un video (~63 MB, mejor con Wi-Fi).";
  } catch (e) { $("#estadoVoz").textContent = "No pude cargar el motor de voz: " + e.message; }
}

function toast(t, ms) {
  const e = $("#toast"); e.textContent = t; e.style.display = "block";
  clearTimeout(e._t); e._t = setTimeout(() => e.style.display = "none", ms || 2800);
}

// ------------------------------------------------------------------ clave de activación (se guarda solo su huella SHA-256)
const HUELLA_CLAVE = "3fae600d0a849b1eb008c1ae8ea08f86e5fce68134b94ac388dbe1e271689a19";
async function huella(t) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function candado() {
  if (LS.get("activado", "") === HUELLA_CLAVE) return;
  const c = $("#candado");
  c.style.display = "block";
  let fallos = 0;
  const probar = async () => {
    const v = $("#claveApp").value.trim().toUpperCase();
    if (v && await huella(v) === HUELLA_CLAVE) {
      LS.set("activado", HUELLA_CLAVE);
      c.style.display = "none";
      toast("VIRALIA activada ✔");
      return;
    }
    fallos++;
    $("#claveErr").textContent = "Clave incorrecta." + (fallos >= 3 ? " Revisa mayúsculas y números." : "");
    $("#claveApp").value = "";
  };
  $("#bActivar").onclick = probar;
  $("#claveApp").addEventListener("keyup", e => { if (e.key === "Enter") probar(); });
}

// ------------------------------------------------------------------ arranque
function iniciar() {
  candado();
  const nicho = $("#nNicho");
  nicho.innerHTML = Object.entries(NICHOS).map(([k, n]) => `<option value="${k}">${n.icono} ${n.nombre}</option>`).join("");
  pintarCuentas(); pintarLog(); pintarCola();

  // Crear: categoría -> lista de temas (o automático, o escribir otro)
  const cat = $("#cNicho"), tsel = $("#cTemaSel");
  cat.innerHTML = Object.entries(NICHOS).map(([k, n]) => `<option value="${k}">${n.icono} ${n.nombre} (${(TEMAS[k] || []).length} temas)</option>`).join("");
  cat.value = LS.get("ultima_categoria", "curiosos");
  const pintarTemas = () => {
    const lista = [...new Set(TEMAS[cat.value] || [])].sort((a, b) => a.localeCompare(b, "es"));
    tsel.innerHTML = '<option value="__auto">🎲 Automático (VIRALIA elige)</option>' +
      lista.map(t => `<option value="${esc(t)}">${esc(nombreTema(t))}</option>`).join("") +
      '<option value="__otro">✍️ Escribir otro tema…</option>';
    $("#cTema").style.display = "none";
  };
  cat.onchange = () => { LS.set("ultima_categoria", cat.value); pintarTemas(); };
  tsel.onchange = () => { $("#cTema").style.display = tsel.value === "__otro" ? "block" : "none"; if (tsel.value === "__otro") $("#cTema").focus(); };
  pintarTemas();
  const modoSel = $("#cModo");
  const pintarModo = () => {
    const link = modoSel.value === "link";
    $("#bloqueTema").style.display = link ? "none" : "block";
    $("#bloqueLink").style.display = link ? "block" : "none";
    $("#bloqueCant").style.display = link ? "none" : "block";
  };
  modoSel.onchange = pintarModo; pintarModo(); iniciarLink();
  if (esAppAndroid()) Motor().actualizar().catch(() => {});      // tener yt-dlp al día (YouTube/TikTok cambian seguido)

  document.querySelectorAll("nav button").forEach(b => b.onclick = () => {
    document.querySelectorAll("nav button").forEach(x => x.classList.toggle("on", x === b));
    document.querySelectorAll(".pag").forEach(p => p.classList.toggle("on", p.id === "p-" + b.dataset.p));
    if (b.dataset.p === "publicar") pintarCola();
    if (b.dataset.p === "ajustes") estadoVoz();
    window.scrollTo(0, 0);
  });

  $("#bCrear").onclick = crear;
  $("#bParar").onclick = () => { parar = true; paso("Deteniendo…"); };

  $("#bAnadir").onclick = () => {
    const n = $("#nNombre").value.trim().replace(/^@/, "");
    if (!n) return;
    const cs = LS.get("cuentas", []);
    if (cs.some(c => c.nombre === n)) { toast("Esa cuenta ya está"); return; }
    cs.push({ nombre: n, nicho: $("#nNicho").value }); LS.set("cuentas", cs);
    $("#nNombre").value = ""; pintarCuentas(); toast("Cuenta añadida");
  };

  $("#bPublicar").onclick = async () => {
    if (!archivoActual) return;
    copiar(actual.descripcion);
    if (esAppAndroid()) {
      try { await compartirAndroid(archivoActual, actual.descripcion); toast("Pega la descripción en TikTok y publica. Luego toca YA LO PUBLIQUÉ.", 4500); }
      catch (e) { if (!/cancel/i.test(String(e && e.message))) toast("No se pudo compartir: " + (e.message || e), 4500); }
      return;
    }
    if (!navigator.canShare || !navigator.canShare({ files: [archivoActual] })) {
      toast("Tu navegador no deja compartir videos. Abre VIRALIA en Safari.", 4500); return;
    }
    try { await navigator.share({ files: [archivoActual] }); toast("Pega la descripción en TikTok y publica. Luego toca YA LO PUBLIQUÉ.", 4500); }
    catch (e) { if (e.name !== "AbortError") toast("No se pudo compartir: " + e.message, 4500); }
  };
  $("#bCopiar").onclick = () => { if (actual) { copiar(actual.descripcion); toast("Descripción copiada"); } };
  $("#bBorrar").onclick = async () => {
    if (actual && confirm("¿Borrar este video? (no se publica)")) { await Videos.borrar(actual.id); cerrarDetalle(); toast("Borrado"); }
  };
  $("#bHecho").onclick = async () => {
    if (!actual || !confirm("¿Ya lo publicaste en TikTok? Se borrará del teléfono para no ocupar espacio.")) return;
    await Videos.borrar(actual.id);
    const k = "pub_" + new Date().toDateString(); LS.set(k, LS.get(k, 0) + 1);
    anotar(`📲 Publicado en @${actual.cuenta}: ${actual.tema}`);
    cerrarDetalle(); toast("¡Publicado! ✔");
  };
  $("#bVolver").onclick = cerrarDetalle;

  const voz = $("#aVoz"); voz.value = vozElegida();
  voz.onchange = () => { LS.set("voz", voz.value); location.reload(); };
  $("#bBajarVoz").onclick = async () => {
    try {
      const tts = await motorVoz();
      await tts.download(vozElegida(), p => { if (p && p.total) $("#estadoVoz").textContent = `Descargando… ${Math.round(p.loaded * 100 / p.total)} %`; });
      estadoVoz();
    } catch (e) { $("#estadoVoz").textContent = "Error al descargar: " + e.message; }
  };
  $("#bProbarVoz").onclick = async () => {
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    await actx.resume();
    try {
      $("#estadoVoz").textContent = "Preparando la voz…";
      const b = await hablar("Hola, soy la voz de VIRALIA. ¿Sabías que el pulpo tiene tres corazones?", actx);
      const s = actx.createBufferSource(); s.buffer = b; s.connect(actx.destination); s.start();
      estadoVoz();
    } catch (e) { $("#estadoVoz").textContent = "Error: " + e.message; }
  };
  const px = $("#aPexels"), pb = $("#aPixabay");
  px.value = LS.get("pexels", ""); pb.value = LS.get("pixabay", "");
  px.onchange = () => LS.set("pexels", px.value.trim());
  pb.onchange = () => LS.set("pixabay", pb.value.trim());

  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (ios && !navigator.standalone) $("#instalar").style.display = "block";
}
iniciar();
