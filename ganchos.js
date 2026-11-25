// Ganchos de VIRALIA (generado desde ganchos.py del PC): 22 fórmulas, puntaje 0-100 en 5 propiedades y 22 ideas por tema.
// El puntaje separa ganchos flojos de ganchos reales, pero NO predice cuáles serán virales.

export const FORMULAS = [
  { nombre: "La estadística", forma: "Un dato que no sabías, dicho en seco, y luego la consecuencia.", plantilla: "El 90 % de la gente no sabe esto de {t}, y cambia todo.", patrones: [new RegExp("\\d+\\s?%", 'i'), new RegExp("\\d[\\d.,]*\\s(millones|mil)\\b", 'i'), new RegExp("\\bde cada \\d+", 'i')] },
  { nombre: "El resultado de otro", forma: "El resultado de una persona con nombre, y luego el mecanismo.", plantilla: "Este creador pasó de 400 a 200.000 seguidores hablando de {t}. Mira cómo.", patrones: [new RegExp("\\bpas[o\u00f3] de\\b", 'i'), new RegExp("\\bde \\d[\\d.,]* a \\d", 'i'), new RegExp("\\b(consigui[o\u00f3]|logr[o\u00f3])\\b.*\\d", 'i')] },
  { nombre: "El error", forma: "Nombra el error que quizá estás cometiendo ahora mismo.", plantilla: "Si te pasa esto con {t}, estás cometiendo un error.", patrones: [new RegExp("\\b(tu|tus)\\b.*\\b(error|culpa|motivo)", 'i'), new RegExp("\\best[a\u00e1]s (haciendo|cometiendo)", 'i'), new RegExp("\\bel error\\b", 'i')] },
  { nombre: "El giro contrario", forma: "Dices el consejo aceptado y luego lo rechazas.", plantilla: "Todos creen esto de {t}. Es mentira.", patrones: [new RegExp("\\btodos (dicen|creen|piensan)", 'i'), new RegExp("\\bmentira\\b", 'i'), new RegExp("\\bal rev[e\u00e9]s", 'i'), new RegExp("\\bno es (lo que|como)", 'i')] },
  { nombre: "La revelación", forma: "Prometes mostrar algo concreto y lo muestras.", plantilla: "Te voy a mostrar lo que esconde {t}, mira.", patrones: [new RegExp("\\bte voy a (mostrar|ense[n\u00f1]ar)", 'i'), new RegExp("\\bvoy a mostrarte", 'i'), new RegExp("\\ben pantalla", 'i')] },
  { nombre: "El superlativo", forma: "Lo mejor, lo peor, lo más rápido de una categoría.", plantilla: "Este es el dato más extraño de {t} y casi nadie lo conoce.", patrones: [new RegExp("\\b(el|la|lo) (m[a\u00e1]s|mejor|peor|[u\u00fa]nic[oa]|primer[oa]?)\\b", 'i'), new RegExp("\\bla forma m[a\u00e1]s\\b", 'i')] },
  { nombre: "El reloj", forma: "Pones un tiempo al resultado.", plantilla: "En 30 segundos vas a entender {t}.", patrones: [new RegExp("\\ben (los pr[o\u00f3]ximos )?\\d+\\s?(segundos|minutos|horas|d[i\u00ed]as)", 'i'), new RegExp("\\bsolo \\d+ (segundos|minutos)", 'i')] },
  { nombre: "Lo probé", forma: "Un experimento en primera persona con un costo dicho.", plantilla: "Investigué {t} durante 30 días. Esto encontré.", patrones: [new RegExp("\\b(prob[e\u00e9]|intent[e\u00e9]|dej[e\u00e9]|pas[e\u00e9])\\b.*\\b(d[i\u00ed]as|semanas|mes|horas)", 'i'), new RegExp("\\bdurante \\d+", 'i')] },
  { nombre: "La pregunta", forma: "La pregunta exacta que la gente escribiría al buscar.", plantilla: "¿Por qué nadie habla de esto sobre {t}?", patrones: [new RegExp("^\\s*\u00bf", 'i'), new RegExp("\\?\\s*$", 'i'), new RegExp("\\b(por qu[e\u00e9]|qu[e\u00e9] pasa)\\b", 'i')] },
  { nombre: "El cómo exprés", forma: "«Cómo» + resultado concreto + sin esfuerzo, en menos de un minuto. (Sacada de @elbecariodemurphy.ia: sus 5 mayores éxitos usan esta forma.)", plantilla: "Cómo entender {t} en 45 segundos, sin complicarte.", patrones: [new RegExp("^\\s*c[o\u00f3]mo (hacer|usar|crear|conseguir|tener|ganar|ahorrar|entender|saber|aprender)", 'i'), new RegExp("\\b(escribiendo|en una sola|con una sola|1 sola|1 frase)\\b", 'i'), new RegExp("\\bsin (estudiar|complic\\w+|saber|esfuerzo|pagar|gastar|experiencia|ser experto)\\b", 'i')] },
  { nombre: "Antes y después", forma: "Dos estados y un corte entre ellos.", plantilla: "Antes creía esto de {t}. Ahora sé la verdad.", patrones: [new RegExp("\\bantes\\b.*\\bahora\\b", 'i'), new RegExp("\\bantes y despu[e\u00e9]s", 'i')] },
  { nombre: "La disección", forma: "Desmontas algo real en público.", plantilla: "Analicé todo lo que se sabe de {t}. Esto es lo que encontré.", patrones: [new RegExp("\\b(analic[e\u00e9]|desmont[e\u00e9]|revis[e\u00e9]|investigu[e\u00e9])\\b", 'i'), new RegExp("\\bpor dentro\\b", 'i')] },
  { nombre: "La combinación", forma: "Dos cosas con nombre juntas dan un resultado.", plantilla: "{t} y un detalle que nadie había unido hasta hoy.", patrones: [new RegExp("\\bcon\\s[A-Z\u00c1\u00c9\u00cd\u00d3\u00da]\\w+\\s(y|\\+)\\s[A-Z\u00c1\u00c9\u00cd\u00d3\u00da]\\w+", 'i')] },
  { nombre: "La advertencia", forma: "Un costo que el espectador está por pagar.", plantilla: "Antes de creer lo que dicen de {t}, mira esto.", patrones: [new RegExp("\\b(no (hagas|subas|compres|uses|sigas)|cuidado|evita|deja de)\\b", 'i'), new RegExp("\\bantes de\\b", 'i')] },
  { nombre: "La lista", forma: "Un conjunto contado, con el número en la primera línea.", plantilla: "7 cosas que no sabías de {t}. La última es increíble.", patrones: [new RegExp("\\b\\d+ (cosas|formas|trucos|datos|razones|maneras|errores|herramientas|secretos)\\b", 'i')] },
  { nombre: "El recibo", forma: "Muestras la prueba primero y explicas después.", plantilla: "Esta es la prueba de {t}. Ahora te explico.", patrones: [new RegExp("\\b(esta es|aqu[i\u00ed] est[a\u00e1]|mira) (la|el|mi)\\b", 'i'), new RegExp("\\b(captura|pantalla|resultado)\\b", 'i')] },
  { nombre: "El informado", forma: "Información de dentro de un sistema.", plantilla: "Lo que casi nadie te cuenta de {t}.", patrones: [new RegExp("\\b(nadie te cuenta|casi nadie|pocos saben|lo que no te dicen|secreto)\\b", 'i')] },
  { nombre: "La afirmación imposible", forma: "Dices algo que suena falso y lo demuestras.", plantilla: "Entender {t} sin estudiar nada es posible. Te lo demuestro.", patrones: [new RegExp("\\bsin (saber|tener|abrir|grabar|editar|escribir|estudiar|leer)\\b", 'i'), new RegExp("\\bsin (ning[u\u00fa]n|ninguna)\\b", 'i')] },
  { nombre: "La comparación", forma: "Dos opciones con nombre y una gana.", plantilla: "{t}: lo que te contaron frente a lo que es de verdad.", patrones: [new RegExp("\\b(vs|versus|frente a|contra)\\b", 'i'), new RegExp("\\bcompar[e\u00e9]\\b", 'i'), new RegExp("\\b(mejor|peor) que\\b", 'i')] },
  { nombre: "El origen", forma: "De dónde salió realmente un resultado.", plantilla: "Todo sobre {t} empieza con un solo hecho.", patrones: [new RegExp("\\b(todo (empieza|viene|sale)|de d[o\u00f3]nde sale)\\b", 'i')] },
  { nombre: "La fecha límite", forma: "Algo cambia en una fecha.", plantilla: "Esto sobre {t} se sabe desde hoy.", patrones: [new RegExp("\\b(este (jueves|viernes|lunes|mes|a[n\u00f1]o)|termina|ma[n\u00f1]ana|desde hoy)\\b", 'i')] },
  { nombre: "Dirigido a ti", forma: "Nombras al espectador exacto en las primeras 6 palabras.", plantilla: "Si te gusta {t}, este video es para ti.", patrones: [new RegExp("^\\s*(si (tienes|eres|quieres|te gusta)|para (ti|los que|quien))", 'i'), new RegExp("\\bsi eres\\b", 'i')] },
];
const FILLER = new Set(["amigos", "bienvenidos", "bueno", "canal", "entonces", "gente", "hola", "hoy", "pues", "sigueme", "suscribete", "suscríbete", "sígueme", "video", "vídeo"]);
const VAGUE = new Set(["alucinante", "brutal", "definitivo", "enorme", "epico", "espectacular", "impresionante", "increible", "increíble", "loco", "mejor", "poderoso", "secreto", "tremendo", "épico"]);
const ARREGLO = {"ESPECIFICIDAD": "cambia un adjetivo por un número, un nombre o una fecha", "DIRIGIDO A TI": "di «tú» o «tu» en las primeras 6 palabras", "EN JUEGO": "di qué pierde la persona si sigue como hasta ahora", "CURIOSIDAD": "corta la mitad de la frase que ya responde sola", "BREVEDAD": "entre 6 y 18 palabras: léelo en voz alta y para donde te falte el aire"};
const CONCRETO = /(\d[\d.,]*\s?(%|k|m|x|segundos?|minutos?|horas?|d[ií]as?|semanas?|meses|a[nñ]os?)?)|\$\s?\d/gi;
const TU = /(^|[^\wáéíóúñ])(t[uú]|tus|te|ti|contigo|tienes|sabes|eres|quieres|puedes)(?![\wáéíóúñ])/gi;
const JUEGO = /(pierdes|perder|perdiste|desperdicias|fracas\w*|cuesta|riesgo|antes de|deja de|nunca|muere|morir|muerto|peligro|error|culpa|mentira)/gi;
const CURIOSO = /(por qu[eé]|c[oó]mo|qu[eé]|cu[aá]l|hasta que|antes de|pero|nadie|casi|excepto|raz[oó]n|realmente|en realidad|nunca)/gi;
const CERRADO = /(porque|por lo tanto|lo que significa)/i;
const cuenta = (re, t) => (t.match(re) || []).length;
const pal = t => t.toLowerCase().match(/[\wáéíóúñü'%$.]+/g) || [];
const lim = v => Math.max(0, Math.min(100, v));
function especificidad(t) {
  const w = pal(t); if (!w.length) return 0;
  let s = 34 + cuenta(CONCRETO, t) * 22 - w.filter(x => VAGUE.has(x)).length * 16 - w.filter(x => FILLER.has(x)).length * 5;
  s += Math.min(18, 6 * t.split(/\s+/).slice(1).filter(x => /^[A-ZÁÉÍÓÚÑ]/.test(x)).length);
  return lim(s);
}
const dirigido = t => lim(26 + cuenta(TU, t) * 20 + (cuenta(TU, t.split(/\s+/).slice(0, 6).join(" ")) ? 30 : 0));
const juego = t => lim(22 + cuenta(JUEGO, t) * 26 + (cuenta(CONCRETO, t) ? 14 : 0));
const curiosidad = t => lim(24 + cuenta(CURIOSO, t) * 17 + (t.trim().endsWith("?") ? 18 : 0) - (CERRADO.test(t) ? 18 : 0));
function brevedad(t) {
  const n = pal(t).length; if (!n) return 0;
  if (n >= 6 && n <= 18) return 100;
  return n < 6 ? Math.max(30, 100 - (6 - n) * 12) : Math.max(10, 100 - (n - 18) * 7);
}
const PROPS = [["ESPECIFICIDAD", especificidad], ["DIRIGIDO A TI", dirigido], ["EN JUEGO", juego], ["CURIOSIDAD", curiosidad], ["BREVEDAD", brevedad]];
export const banda = v => v >= 72 ? "FUERTE" : v >= 55 ? "ACEPTABLE" : "DÉBIL";
export function puntuar(t) {
  t = (t || "").trim();
  const partes = Object.fromEntries(PROPS.map(([n, fn]) => [n, fn(t)]));
  const v = Object.values(partes);
  const veredicto = t ? Math.round(0.6 * (v.reduce((a, b) => a + b, 0) / v.length) + 0.4 * Math.min(...v)) : 0;
  let formula = "Sin fórmula", golpes = 0;
  for (const f of FORMULAS) { const n = f.patrones.filter(p => p.test(t)).length; if (n > golpes) { formula = f.nombre; golpes = n; } }
  const debil = Object.keys(partes).reduce((a, b) => partes[a] <= partes[b] ? a : b);
  return { gancho: t, propiedades: partes, veredicto, banda: banda(veredicto), formula, mas_debil: debil, arreglo: ARREGLO[debil] };
}
/** Una idea de gancho por fórmula, ya puntuada, de mejor a peor. */
export function ideas(tema, cuantas = 22) {
  tema = (tema || "este tema").trim();
  return FORMULAS.slice(0, cuantas).map(f => ({ ...puntuar(f.plantilla.replace("{t}", tema)), formula: f.nombre })).sort((a, b) => b.veredicto - a.veredicto);
}
