// VIRALIA (celular): pestañas CRECER (cazador de nichos, ganchos, reels de prueba, estrategias) y APRENDER (guionista, curso, plan de 7 días).
import { puntuar, ideas } from "./ganchos.js";

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const mil = n => n == null ? "—" : Number(n).toLocaleString("es");
const nativo = () => !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
const leer = (k, d) => { try { const v = localStorage.getItem("viralia_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
const guardar = (k, v) => { try { localStorage.setItem("viralia_" + k, JSON.stringify(v)); } catch (e) {} };

function tarjeta(r) {
  return `<div class="item" style="display:block"><b>${esc(r.gancho)}</b>
    <small>${r.veredicto}/100 · ${esc(r.banda)} · ${esc(r.formula)}<br>Mejora: ${esc(r.arreglo)}</small></div>`;
}

/** Ir a Crear con un tema escrito (y la categoría si se indica). */
function crearCon(tema, nicho) {
  const nav = $$("nav button").find(b => b.dataset.p === "crear"); if (nav) nav.click();
  $("#cModo").value = "datos"; $("#cModo").dispatchEvent(new Event("change"));
  if (nicho && [...$("#cNicho").options].some(o => o.value === nicho)) { $("#cNicho").value = nicho; $("#cNicho").dispatchEvent(new Event("change")); }
  $("#cTemaSel").value = "__otro"; $("#cTemaSel").dispatchEvent(new Event("change"));
  $("#cTema").value = tema; $("#cTema").scrollIntoView({ block: "center" });
}
function clipsCon(url) {
  const nav = $$("nav button").find(b => b.dataset.p === "crear"); if (nav) nav.click();
  $("#cModo").value = "link"; $("#cModo").dispatchEvent(new Event("change"));
  $("#cLink").value = url;
  const g = $$("#lkReceta button").find(b => b.dataset.r === "gta6");
  if (g && /gta/i.test(url + ($("#czQ").value || ""))) g.click();
  $("#cLink").scrollIntoView({ block: "center" });
}

// ------------------------------------------------------------------ CRECER
async function cazar() {
  const q = $("#czQ").value.trim();
  if (q.length < 2) { $("#czRes").innerHTML = '<p class="aviso">Escribe un tema.</p>'; return; }
  if (!nativo()) { $("#czRes").innerHTML = '<p class="aviso">El cazador funciona en la app de Android (APK).</p>'; return; }
  const b = $("#bCazar"); b.disabled = true;
  $("#czRes").innerHTML = '<p class="aviso">Buscando shorts de YouTube y los seguidores de cada canal… (1-2 minutos)</p>';
  let oy = null;
  try {
    const M = Capacitor.Plugins.Motor;
    oy = await M.addListener("buscando", e => { $("#czRes").innerHTML = `<p class="aviso">Revisando canales… ${e.n}</p>`; });
    const r = await M.buscar({ q, max: 12 });
    const L = JSON.parse(r.resultados || "[]").map(v => {
      const veces = v.suscriptores ? Math.round(v.vistas / Math.max(100, v.suscriptores) * 10) / 10 : 0;
      return { ...v, veces, senal: !v.suscriptores ? "❔" : veces >= 10 ? "🔥" : veces >= 2 ? "📈" : "·", g: puntuar(v.titulo) };
    }).filter(v => !v.suscriptores || v.suscriptores <= 200000).sort((a, b) => b.veces - a.veces);
    if (!L.length) { $("#czRes").innerHTML = '<p class="aviso">No encontré canales pequeños con ese tema. Prueba otra palabra.</p>'; return; }
    $("#czRes").innerHTML = '<p class="aviso">🔥 = las vistas son más de 10 veces sus seguidores: el tema tiene demanda y poca competencia. Copia el molde del gancho, no el video.</p>' +
      L.map((v, i) => `<div class="item" style="display:block"><b>${v.senal} ${esc(v.titulo)}</b>
        <small>${esc(v.canal)} · ${mil(v.suscriptores)} seguidores · ${mil(v.vistas)} vistas · ${v.veces ? v.veces + "×" : "—"} · gancho ${v.g.veredicto}/100</small>
        <div class="fila" style="margin-top:8px"><button data-c="${i}">✨ Crear este video</button><button data-k="${i}">✂️ Clips</button></div></div>`).join("");
    $$("#czRes button[data-c]").forEach(x => x.onclick = () => crearCon(L[+x.dataset.c].titulo, /gta/i.test(q) ? "gta6" : null));
    $$("#czRes button[data-k]").forEach(x => x.onclick = () => clipsCon(L[+x.dataset.k].url));
  } catch (e) {
    $("#czRes").innerHTML = `<p class="aviso">No pude buscar: ${esc(e.message || e)}</p>`;
  } finally { b.disabled = false; oy && oy.remove && oy.remove(); }
}

const ESTRATEGIAS = [
  ["Monetiza con una página, no con tu perfil", "Crea una página de creador en Facebook y conéctala a Instagram: ahí se activan los pagos por Reels."],
  ["Sube reels de prueba", "Hasta 10 versiones del mismo tema con ganchos distintos. Quédate con la que más retiene."],
  ["Analiza cada video", "Si la gente se va en el segundo 3, falla el gancho; si se va a la mitad, el ritmo."],
  ["Copia el molde, no el video", "Toma la estructura (gancho, dato, cierre) de un video que funcionó y cámbiale el tema."],
  ["Si un video funcionó, repite su fórmula", "Mismo formato, otro dato. No lo cambies todo."],
  ["Que te sigan, no solo que te vean", "Cierra con una razón para seguirte: la parte 2, el próximo dato."],
  ["Fábrica de curiosidades", "Un nicho, muchos datos, siempre más de 1 minuto."],
  ["Método GTA 6 + IA (@jairoalvarezz_)", "Busca en el cazador «GTA 6», pulsa ✂️ Clips y usa la receta GTA 6 Clipping. Cierra con «comenta GTA y te paso la guía». Los clips de otros pueden no contar como contenido original: añade tu voz."],
];

// ------------------------------------------------------------------ APRENDER
const CURSO = [
  ["1 · Elige un nicho", ["Un tema que puedas repetir 100 veces.", "Un nicho por cuenta: así TikTok sabe a quién mostrarte.", "Mira en Crecer qué temas están petando."]],
  ["2 · Estrategia viral", ["El gancho decide todo: puntúalo antes de crear (meta: más de 70).", "Haz 10 reels de prueba con ganchos distintos.", "Copia el molde de lo que ya funciona."]],
  ["3 · Crea y edita", ["Crear: datos reales, voz natural, fotos y subtítulos. Todo dura más de 1 minuto.", "Una transición cada 3 segundos.", "Cada video trae su miniatura para usarla de portada."]],
  ["4 · Publica", ["Publicar abre tu app de TikTok con el video listo: pega la descripción, elige la portada y publica.", "Publica en horas pico: 12:30, 18:00, 20:30, 22:15.", "3-4 videos al día por cuenta."]],
  ["5 · Monetiza", ["TikTok pide en general 10.000 seguidores, 100.000 vistas en 30 días y videos originales de más de 1 minuto.", "Diversifica: página de Facebook, YouTube Shorts y productos propios.", "Nadie garantiza ingresos."]],
];
const PLAN7 = ["Día 1: añade tu cuenta y elige el nicho.", "Día 2: puntúa 10 ganchos y elige los 3 mejores.", "Día 3: crea 3 videos y publica uno.",
  "Día 4: crea 3 videos con el mejor gancho y otro estilo (prueba GTA 6 o Bloques).", "Día 5: crea clips desde un enlace de TikTok o YouTube.",
  "Día 6: publica en horas pico y responde comentarios.", "Día 7: mira qué video retuvo más y repite su fórmula."];

async function guionista() {
  const idea = $("#gdIdea").value.trim();
  if (idea.length < 3) { $("#gdRes").innerHTML = '<p class="aviso">Escribe tu idea o tema.</p>'; return; }
  const b = $("#bGuion"); b.disabled = true; $("#gdRes").innerHTML = '<p class="aviso">Buscando datos reales en Wikipedia y escribiendo el guion…</p>';
  try {
    const g = await window.VIRALIA.guion(idea);
    const palabras = g.escenas.join(" ").split(/\s+/).length;
    const gc = puntuar(g.escenas[0]);
    $("#gdRes").innerHTML = `<div class="item" style="display:block"><b>${esc(g.titulo)}</b><small>${g.escenas.length} escenas · ${palabras} palabras · gancho ${gc.veredicto}/100 (${esc(gc.banda)}). Si la voz dura menos de 1 minuto, el video se alarga solo.</small></div>` +
      g.escenas.map((t, i) => `<div class="item" style="display:block"><small>${i + 1}.</small> ${esc(t)}</div>`).join("") +
      `<div class="fila" style="margin-top:10px"><button id="gdCopiar">📋 Copiar guion</button><button class="pri" id="gdCrear">✨ Crear el video</button></div>`;
    $("#gdCopiar").onclick = () => { window.VIRALIA.copiar(g.titulo + "\n\n" + g.escenas.join("\n")); window.VIRALIA.toast("Guion copiado"); };
    $("#gdCrear").onclick = () => crearCon(g.tema);
  } catch (e) {
    $("#gdRes").innerHTML = `<p class="aviso">${esc(e.message || e)} Prueba con un tema más concreto (ej: «Pulpo», «Grand Theft Auto VI»).</p>`;
  } finally { b.disabled = false; }
}

export function iniciarCrecer() {
  $("#bCazar").onclick = cazar;
  $("#bCazarGta").onclick = () => { $("#czQ").value = "GTA 6 tráiler gameplay"; cazar(); };
  $("#bPuntuar").onclick = () => {
    const l = $("#gnTexto").value.split("\n").map(x => x.trim()).filter(Boolean);
    $("#gnRes").innerHTML = l.length ? l.map(puntuar).sort((a, b) => b.veredicto - a.veredicto).map(tarjeta).join("") : '<p class="aviso">Escribe al menos un gancho.</p>';
  };
  $("#bPruebas").onclick = () => {
    const t = $("#prTema").value.trim();
    if (!t) { $("#prRes").innerHTML = '<p class="aviso">Escribe un tema.</p>'; return; }
    $("#prRes").innerHTML = '<p class="aviso">10 ganchos distintos del mismo tema: crea 10 versiones y quédate con la que más retiene.</p>' + ideas(t).slice(0, 10).map(tarjeta).join("");
  };
  $("#estrat").innerHTML = ESTRATEGIAS.map(([t, d], i) => `<div class="item" style="display:block"><b>${i + 1} · ${esc(t)}</b><small>${esc(d)}</small></div>`).join("");

  $("#bGuion").onclick = guionista;
  $("#curso").innerHTML = CURSO.map(([t, l]) => `<div class="item" style="display:block"><b>${esc(t)}</b>${l.map(x => `<small style="display:block">• ${esc(x)}</small>`).join("")}</div>`).join("");
  const hechos = leer("plan7", []);
  $("#plan7").innerHTML = PLAN7.map((t, i) => `<label class="item" style="justify-content:flex-start;gap:12px;margin:0;font-size:14px;color:var(--tx);font-weight:500">
    <input type="checkbox" data-d="${i}" ${hechos.includes(i) ? "checked" : ""} style="width:22px;height:22px"> ${esc(t)}</label>`).join("");
  $$("#plan7 input").forEach(c => c.onchange = () => {
    const h = new Set(leer("plan7", [])); c.checked ? h.add(+c.dataset.d) : h.delete(+c.dataset.d); guardar("plan7", [...h]);
  });
}
