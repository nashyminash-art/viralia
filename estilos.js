// Estilos de VIRALIA para el celular: un marco (PNG transparente 1080x1920 que va encima del video) + un filtro de color de ffmpeg.
// Mismos estilos que VIRALIA del PC.
export const W = 1080, H = 1920;

export const FILTROS = {
  ninguno: "",
  cine: "eq=contrast=1.12:saturation=0.82:gamma=0.96,colorbalance=rs=0.04:bs=-0.05:rh=0.05:bh=-0.04,vignette=PI/5",
  calido: "eq=contrast=1.06:saturation=1.12,colorbalance=rs=0.06:gs=0.02:bs=-0.06",
  frio: "eq=contrast=1.06:saturation=1.05,colorbalance=rs=-0.05:bs=0.07",
  neon: "eq=contrast=1.12:saturation=1.35",
  camara: "hue=s=0.15,colorbalance=gs=0.10:gm=0.06,eq=contrast=1.15:brightness=-0.04",
  vhs: "eq=saturation=1.3:contrast=1.08",
  sepia: "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131,eq=contrast=1.1",
  oro: "eq=contrast=1.08:saturation=1.05,colorbalance=rs=0.05:gs=0.03:bs=-0.08:rh=0.06:gh=0.04",
};

const L = [];
const add = (id, nombre, grupo, tipo, filtro = "ninguno", k = {}) => L.push({ id, nombre, grupo, tipo, filtro, ...k });
add("ninguno", "Sin marco", "Básicos", null);
add("cine", "Cine (barras negras)", "Básicos", "cine", "cine");
add("color_cine", "Solo color de película", "Básicos", null, "cine");
add("calido", "Tono cálido", "Básicos", null, "calido");
add("frio", "Tono frío", "Básicos", null, "frio");
for (const [cid, nom, c1, c2, fil] of [["atardecer", "atardecer", "#FF2E88", "#FF8A00", "calido"], ["oceano", "océano", "#00C2FF", "#0047FF", "frio"],
  ["patrulla", "patrulla", "#FF2B2B", "#2B5BFF", "ninguno"], ["oro", "oro", "#FFC83D", "#B8860B", "oro"],
  ["pantano", "pantano", "#7CFF4F", "#2E7D32", "ninguno"], ["noche", "noche", "#A24BFF", "#FF2BD6", "frio"]]) {
  add("noti_" + cid, "Noticiero " + nom, "Noticiero", "noticiero", fil, { c1, c2 });
  add("noti_" + cid + "_m", "Noticiero " + nom + " · marco", "Noticiero", "noticiero", fil, { c1, c2, marco: true });
}
add("feed_claro", "Publicación clara", "Feed del celular", "feed", "ninguno", { c1: "#FF2BD6" });
add("feed_oscuro", "Publicación oscura", "Feed del celular", "feed", "ninguno", { c1: "#00C2FF", oscuro: true });
add("feed_claro_m", "Publicación clara · marco", "Feed del celular", "feed", "ninguno", { c1: "#FF8A00", marco: true });
add("camara_verde", "Cámara de seguridad", "Cámara de seguridad", "camara", "camara", { c1: "#B6FF3B" });
add("camara_blanca", "Cámara de seguridad blanca", "Cámara de seguridad", "camara", "camara", { c1: "#FFFFFF" });
add("vhs", "VHS ochentero", "VHS ochentero", "vhs", "vhs");
add("neon_rosa", "Neón rosa", "Neón", "neon", "neon", { c1: "#FF2BD6" });
add("neon_azul", "Neón azul", "Neón", "neon", "neon", { c1: "#00E5FF" });
add("neon_verde", "Neón verde", "Neón", "neon", "neon", { c1: "#B6FF3B" });
add("postal", "Postal", "Postal", "postal", "calido", { c1: "#1E64C8" });
add("marco_oro", "Marco dorado", "Elegante", "oro", "oro");
add("sebusca", "Se busca", "Se busca", "sebusca", "sepia");
add("lucha_1", "Lucha libre", "Lucha libre", "lucha", "neon");
add("lucha_2", "Lucha libre oscura", "Lucha libre", "lucha", "cine");
add("persecucion_1", "Persecución", "Persecución", "persecucion", "cine");
add("persecucion_2", "Persecución nocturna", "Persecución", "persecucion", "frio");
add("atraco_1", "Atraco", "Atraco", "atraco", "camara");
add("atraco_2", "Atraco · cine", "Atraco", "atraco", "cine");
add("gps_1", "GPS y mapa", "GPS y mapa", "gps");
add("gps_2", "GPS · frío", "GPS y mapa", "gps", "frio");
add("deco_playa", "Playa art déco", "Playa art déco", "artdeco", "calido", { c1: "#2EC4B6", c2: "#FF8FA3" });
add("deco_oro", "Art déco dorado", "Playa art déco", "artdeco", "oro", { c1: "#E8B84A", c2: "#FFF1C1" });
add("neon_atardecer", "Atardecer neón", "Atardecer neón", "neon", "calido", { c1: "#FF7A3D" });
add("neon_atardecer_2", "Atardecer neón rosa", "Atardecer neón", "neon", "calido", { c1: "#FF2E88" });
add("pantano_1", "Pantano", "Pantano", "pantano", "camara");
add("pantano_2", "Pantano oscuro", "Pantano", "pantano", "cine");
export const ESTILOS = L;
export const estilo = id => L.find(e => e.id === id) || L[0];
export const filtro = id => FILTROS[estilo(id).filtro] || "";

// ------------------------------------------------------------------ dibujo (canvas 1080x1920, fondo transparente)
const rr = (g, x, y, w, h, r) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); };
const fillRR = (g, x, y, w, h, r, c) => { g.fillStyle = c; rr(g, x, y, w, h, r); g.fill(); };
const txt = (g, t, x, y, tam, c, al = "center", base = "middle", fam = "sans-serif-black") => {
  g.font = `900 ${tam}px ${fam}, 'Roboto', sans-serif`; g.fillStyle = c; g.textAlign = al; g.textBaseline = base; g.fillText(t, x, y);
};
const marco = (g, c, gr = 10, r = 46, m = 18) => { g.strokeStyle = c; g.lineWidth = gr; rr(g, m, m, W - 2 * m, H - 2 * m, r); g.stroke(); };
const BL = "#FFFFFF";

const D = {
  noticiero(g, e, t) {
    g.strokeStyle = e.c1; g.lineWidth = 7; g.beginPath(); g.arc(W - 140, 120, 50, 0, 7); g.stroke();
    txt(g, "TV", W - 140, 122, 44, e.c1);
    const y = H - 250;
    fillRR(g, 0, y, W, 96, 0, "rgba(10,10,18,.92)"); fillRR(g, 0, y, 300, 96, 0, e.c1);
    g.fillStyle = BL; g.beginPath(); g.arc(48, y + 48, 14, 0, 7); g.fill();
    txt(g, "EN VIVO", 165, y + 50, 40, BL);
    txt(g, (t || "ÚLTIMA HORA · DESDE LA CIUDAD").toUpperCase().slice(0, 34), 330, y + 50, 32, BL, "left");
    fillRR(g, 0, y + 96, W, 14, 0, e.c2);
    if (e.marco) marco(g, e.c1, 10);
  },
  feed(g, e, t, cuenta) {
    const f = e.oscuro ? "rgba(18,18,22,.94)" : "rgba(255,255,255,.96)", l = e.oscuro ? "#fff" : "#141414";
    fillRR(g, 40, 60, W - 80, 170, 34, f);
    g.fillStyle = e.c1; g.beginPath(); g.arc(120, 145, 50, 0, 7); g.fill();
    txt(g, (cuenta || "V")[0].toUpperCase(), 120, 148, 54, BL);
    txt(g, "@" + (cuenta || "viralia"), 195, 122, 38, l, "left"); txt(g, "Hace 2 min", 195, 172, 28, "#8c8c96", "left");
    txt(g, "•••", W - 90, 145, 40, l);
    const y = H - 230; fillRR(g, 40, y, W - 80, 150, 34, f);
    const cy = y + 75; g.fillStyle = "#FF2D55"; g.beginPath(); g.arc(102, cy - 12, 14, 0, 7); g.arc(122, cy - 12, 14, 0, 7); g.fill();
    g.beginPath(); g.moveTo(88, cy - 8); g.lineTo(136, cy - 8); g.lineTo(112, cy + 24); g.fill();
    txt(g, "12,4 mil", 152, cy, 32, l, "left"); txt(g, "1.208", 478, cy, 32, l, "left"); txt(g, "Compartir", 730, cy, 32, l, "left");
    if (e.marco) marco(g, e.c1, 8);
  },
  camara(g, e) {
    g.fillStyle = "#FF1E1E"; g.beginPath(); g.arc(88, 100, 18, 0, 7); g.fill();
    txt(g, "REC", 122, 100, 44, BL, "left"); txt(g, "CAM 01", W - 70, 100, 40, e.c1, "right");
    const d = new Date(), p = n => String(n).padStart(2, "0");
    txt(g, `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}  ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`, 70, H - 110, 38, e.c1, "left");
    g.strokeStyle = e.c1; g.lineWidth = 8;
    for (const [x, y, sx, sy] of [[50, 50, 1, 1], [W - 50, 50, -1, 1], [50, H - 50, 1, -1], [W - 50, H - 50, -1, -1]]) {
      g.beginPath(); g.moveTo(x + sx * 90, y); g.lineTo(x, y); g.lineTo(x, y + sy * 90); g.stroke();
    }
  },
  vhs(g) {
    txt(g, "PLAY", 70, 100, 52, "#eee", "left"); g.fillStyle = "#eee"; g.beginPath(); g.moveTo(250, 78); g.lineTo(290, 100); g.lineTo(250, 122); g.fill();
    txt(g, "SP", W - 70, 100, 52, "#eee", "right"); txt(g, "OCT 23 1987", 70, H - 120, 44, "#eee", "left"); txt(g, "AM 3:07", W - 70, H - 120, 44, "#eee", "right");
    g.fillStyle = "rgba(0,0,0,.09)"; for (let y = 0; y < H; y += 6) g.fillRect(0, y, W, 2);
  },
  neon(g, e) {
    g.save(); g.shadowColor = e.c1; g.shadowBlur = 40; marco(g, e.c1, 26, 60, 30); marco(g, e.c1, 26, 60, 30); g.restore();
    marco(g, "rgba(255,255,255,.9)", 6, 60, 30); marco(g, e.c1, 4, 60, 38);
  },
  postal(g, e, t) {
    g.fillStyle = "#FAF8F0"; const b = 44; g.fillRect(0, 0, W, b); g.fillRect(0, 0, b, H); g.fillRect(W - b, 0, b, H); g.fillRect(0, H - 200, W, 200);
    txt(g, (t || "Saludos desde aquí").slice(0, 30), W / 2, H - 110, 46, e.c1);
  },
  oro(g) {
    marco(g, "#E8B84A", 12, 30, 24); marco(g, "rgba(255,241,193,.8)", 3, 24, 44);
    g.fillStyle = "#E8B84A"; for (const [x, y] of [[60, 60], [W - 60, 60], [60, H - 60], [W - 60, H - 60]]) { g.beginPath(); g.moveTo(x, y - 26); g.lineTo(x + 26, y); g.lineTo(x, y + 26); g.lineTo(x - 26, y); g.fill(); }
  },
  sebusca(g) {
    fillRR(g, 0, 0, W, 260, 0, "#E8D6AA"); fillRR(g, 0, H - 260, W, 260, 0, "#E8D6AA");
    txt(g, "SE BUSCA", W / 2, 135, 120, "#462814"); txt(g, "RECOMPENSA: $ 10 000", W / 2, H - 150, 58, "#462814");
  },
  cine(g) { g.fillStyle = "#000"; g.fillRect(0, 0, W, 300); g.fillRect(0, H - 300, W, 300); },
  lucha(g, e, t, cuenta) {
    g.fillStyle = "#E3262B"; g.beginPath(); g.moveTo(0, 70); g.lineTo(W / 2 - 40, 70); g.lineTo(W / 2 - 90, 190); g.lineTo(0, 190); g.fill();
    g.fillStyle = "#1F4FD8"; g.beginPath(); g.moveTo(W, 70); g.lineTo(W / 2 + 40, 70); g.lineTo(W / 2 + 90, 190); g.lineTo(W, 190); g.fill();
    txt(g, "VS", W / 2, 130, 80, BL); txt(g, (cuenta || "LUCHADOR 1").toUpperCase().slice(0, 12), 40, 130, 46, BL, "left"); txt(g, "LUCHADOR 2", W - 40, 130, 46, BL, "right");
    const y = H - 230; fillRR(g, 0, y, W, 100, 0, "rgba(15,15,15,.92)");
    txt(g, (t || "LUCHA LIBRE · GRAN FINAL").toUpperCase().slice(0, 30), W / 2, y + 50, 40, "#FFD740");
    fillRR(g, 0, y + 100, W / 2, 12, 0, "#E3262B"); fillRR(g, W / 2, y + 100, W / 2, 12, 0, "#1F4FD8");
  },
  persecucion(g, e, t) {
    g.save(); g.filter = "blur(40px)"; g.fillStyle = "rgba(255,43,43,.5)"; g.fillRect(0, 0, 90, H); g.fillStyle = "rgba(43,91,255,.5)"; g.fillRect(W - 90, 0, 90, H); g.restore();
    fillRR(g, 60, 80, W - 120, 110, 18, "rgba(200,20,20,.94)"); txt(g, "PERSECUCIÓN EN CURSO", W / 2, 135, 54, BL);
    g.fillStyle = "rgba(10,10,20,.9)"; g.fillRect(0, H - 190, W, 90);
    txt(g, (t || "UNIDADES SIGUEN AL SOSPECHOSO").toUpperCase().slice(0, 32), W / 2, H - 145, 36, BL);
  },
  atraco(g) {
    for (const y of [70, H - 150]) {
      g.fillStyle = "#FFD400"; g.fillRect(0, y, W, 80); g.fillStyle = "#111";
      for (let x = -80; x < W + 80; x += 80) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 40, y); g.lineTo(x + 80, y + 80); g.lineTo(x + 40, y + 80); g.fill(); }
    }
    fillRR(g, W / 2 - 380, 190, 760, 100, 14, "rgba(0,0,0,.85)"); txt(g, "ATRACO EN CURSO", W / 2, 240, 60, "#FFD400");
  },
  gps(g, e, t) {
    fillRR(g, 40, 70, W - 80, 180, 34, "rgba(20,24,40,.94)"); fillRR(g, 70, 100, 150, 120, 24, "#1A73E8");
    g.fillStyle = BL; g.beginPath(); g.moveTo(145, 115); g.lineTo(190, 165); g.lineTo(162, 165); g.lineTo(162, 205); g.lineTo(128, 205); g.lineTo(128, 165); g.lineTo(100, 165); g.fill();
    txt(g, "Gira a la derecha", 250, 135, 48, BL, "left"); txt(g, (t || "en 200 m").slice(0, 26), 250, 195, 36, "#AABEFF", "left");
    const y = H - 230; fillRR(g, 40, y, W - 80, 150, 34, "rgba(20,24,40,.94)");
    txt(g, "12 min", 120, y + 75, 52, "#78E696", "left"); txt(g, "4,8 km · llegada 18:42", 470, y + 75, 36, BL, "left");
  },
  artdeco(g, e, t) {
    [[22, e.c1], [44, e.c2], [66, e.c1]].forEach(([m, c]) => { g.strokeStyle = c; g.lineWidth = 6; rr(g, m, m, W - 2 * m, H - 2 * m, 10); g.stroke(); });
    for (const x of [W / 4, W / 2, 3 * W / 4]) for (const r of [130, 95, 60]) { g.strokeStyle = r === 95 ? e.c2 : e.c1; g.lineWidth = 6; g.beginPath(); g.arc(x, 0, r, 0, Math.PI); g.stroke(); }
    g.fillStyle = "rgba(10,10,25,.82)"; g.fillRect(0, H - 190, W, 70); txt(g, (t || "VERANO · PLAYA").toUpperCase().slice(0, 28), W / 2, H - 155, 44, e.c2);
  },
  pantano(g, e, t) {
    g.fillStyle = "rgba(25,70,20,.92)";
    for (let x = 0; x < W; x += 36) { const h = 140 + (x * 7) % 90; g.beginPath(); g.moveTo(x, H); g.lineTo(x + 18, H - h); g.lineTo(x + 36, H); g.fill(); }
    marco(g, "#6FBF3A", 10, 40, 22); fillRR(g, 60, 80, W - 120, 110, 22, "rgba(20,45,15,.9)");
    txt(g, (t || "EN LO PROFUNDO DEL PANTANO").toUpperCase().slice(0, 28), W / 2, 135, 42, "#C8FF8C");
  },
};

/** PNG (blob) transparente 1080x1920 con el marco del estilo, o null si el estilo no lleva marco. */
export async function marcoPNG(id, texto = "", cuenta = "") {
  const e = estilo(id);
  if (!e.tipo) return null;
  const c = Object.assign(document.createElement("canvas"), { width: W, height: H });
  D[e.tipo](c.getContext("2d"), e, texto, cuenta);
  return new Promise(ok => c.toBlob(ok, "image/png"));
}
export async function marcoURL(id, texto = "", cuenta = "") {
  const b = await marcoPNG(id, texto, cuenta);
  return b ? URL.createObjectURL(b) : "";
}
