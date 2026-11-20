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
  borrar: id => idb("readwrite", s => s.delete(id)),
};

// ------------------------------------------------------------------ nichos y temas
const NICHOS = {
  curiosos: { nombre: "Datos curiosos", icono: "💡", tags: ["datoscuriosos", "sabiasque"], noticias: "descubrimiento científico curioso" },
  ovnis: { nombre: "Datos de OVNIs", icono: "🛸", tags: ["ovni", "misterio"], noticias: "ovni avistamiento" },
  animales: { nombre: "Animales", icono: "🐙", tags: ["animales", "naturaleza"], noticias: "nueva especie animal" },
  historia: { nombre: "Historia", icono: "🏛️", tags: ["historia", "sabiasque"], noticias: "hallazgo arqueológico" },
  planeta: { nombre: "Planeta y Vía Láctea", icono: "🌌", tags: ["universo", "astronomia"], noticias: "NASA descubrimiento espacio" },
  misterios: { nombre: "Misterios", icono: "🕯️", tags: ["misterios", "sinresolver"], noticias: "misterio sin resolver" },
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
function tipoVideo() {
  const t = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4;codecs=avc1,mp4a", "video/mp4",
    "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
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
  const c = cuentas[+$("#cCuenta").value];
  if (!c) { toast("Primero añade una cuenta"); return; }
  const cant = +$("#cCant").value, modo = $("#cModo").value, temaPedido = $("#cTema").value.trim();
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
  const ext = (actual.tipo || "").includes("mp4") ? "mp4" : "webm";
  archivoActual = new File([actual.blob], `viralia_${etiqueta(actual.tema).slice(0, 24)}.${ext}`, { type: actual.tipo || "video/mp4" });
  const vid = $("#dVideo");
  if (vid.src) URL.revokeObjectURL(vid.src);
  vid.src = URL.createObjectURL(actual.blob);
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
  const Filesystem = c.registerPlugin("Filesystem"), Share = c.registerPlugin("Share");
  toast("Preparando el video…", 2000);
  const r = await Filesystem.writeFile({ path: file.name, data: await aBase64(file), directory: "CACHE" });
  await Share.share({ title: "VIRALIA", text: texto, files: [r.uri], dialogTitle: "Publicar en TikTok" });
}

function copiar(t) {
  if (esAppAndroid()) {
    try { window.Capacitor.registerPlugin("Clipboard").write({ string: t }); return; } catch (e) {}
  }
  try { navigator.clipboard.writeText(t); return; } catch (e) {}
  const a = document.createElement("textarea"); a.value = t; document.body.appendChild(a); a.select();
  try { document.execCommand("copy"); } catch (e) {} a.remove();
}

// ------------------------------------------------------------------ cuentas y ajustes
function pintarCuentas() {
  const cs = LS.get("cuentas", []);
  $("#cCuenta").innerHTML = cs.map((c, i) => `<option value="${i}">@${esc(c.nombre)} · ${NICHOS[c.nicho].icono} ${NICHOS[c.nicho].nombre}</option>`).join("")
    || '<option value="-1">— añade una cuenta —</option>';
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
