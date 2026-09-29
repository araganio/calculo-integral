/**
 * Módulo 5 — Integral Definida y Área bajo la Curva.
 *
 * Dos modos:
 *  - "area":  área bajo una curva entre a y b (deslizadores). Muestra
 *             F(b) − F(a) en vivo y colorea distinto lo que está sobre y
 *             bajo el eje x.
 *  - "entre": área entre dos curvas, usando sus puntos de corte como límites.
 */

/** Colores propios de este módulo. */
const COLOR_POSITIVO = 'rgba(14, 159, 142, 0.35)';
const COLOR_NEGATIVO = 'rgba(192, 57, 43, 0.35)';
const COLOR_SEGUNDA_CURVA = '#d9822b';

/** Subintervalos para calcular áreas con valor absoluto (Simpson, muy preciso). */
const N_PRECISO = 1000;

let modo = 'area';

const selectFuncion = document.getElementById('control-funcion');
const selectPar = document.getElementById('control-par');
const deslizadorA = document.getElementById('control-a');
const deslizadorB = document.getElementById('control-b');

// Llenar los selectores desde el catálogo de funciones.js
selectFuncion.innerHTML = Object.keys(FUNCIONES_AREA).map(function (clave) {
  return '<option value="' + clave + '">f(x) = ' + FUNCIONES_AREA[clave].nombre + '</option>';
}).join('');
selectPar.innerHTML = Object.keys(PARES_CURVAS).map(function (clave) {
  return '<option value="' + clave + '">' + PARES_CURVAS[clave].nombre + '</option>';
}).join('');

/**
 * Genera puntos (x, y) de una función en un intervalo.
 * @param {function(number): number} f - Función.
 * @param {number} desde - Inicio.
 * @param {number} hasta - Fin.
 * @param {number} [cantidad=300] - Número de tramos.
 * @returns {{x: number[], y: number[]}}
 */
function muestrear(f, desde, hasta, cantidad) {
  const pasos = cantidad || 300;
  const x = [];
  const y = [];
  for (let i = 0; i <= pasos; i++) {
    const xi = desde + ((hasta - desde) * i) / pasos;
    x.push(xi);
    y.push(f(xi));
  }
  return { x: x, y: y };
}

/**
 * Escribe las tarjetas de resultados.
 * @param {Array<string[]>} tarjetas - Lista de [título, valor].
 */
function escribirResultados(tarjetas) {
  document.getElementById('resultados').innerHTML = tarjetas.map(function (t) {
    return '<div class="resultado"><span>' + t[0] + '</span><strong>' + t[1] + '</strong></div>';
  }).join('');
}

/**
 * Escribe una fórmula en KaTeX debajo de la gráfica.
 * @param {string} latex - Fórmula (sin los signos $).
 */
function escribirFormula(latex) {
  const p = document.getElementById('formula-exacta');
  p.innerHTML = '$\\displaystyle ' + latex + '$';
  renderizarFormulas(p);
}

/** Modo "área bajo la curva": sombrea [a, b] y calcula F(b) − F(a). */
function actualizarArea() {
  const fn = FUNCIONES_AREA[selectFuncion.value];
  const a = Number(deslizadorA.value);
  const b = Number(deslizadorB.value);
  document.getElementById('valor-a').textContent = a.toFixed(1);
  document.getElementById('valor-b').textContent = b.toFixed(1);

  if (a >= b) {
    mostrarError('El límite a debe ser menor que b. Mueve los deslizadores.');
    return;
  }
  mostrarError(null);

  // TFC: valor exacto de la integral (con signo)
  const integral = valorExacto(fn.F, a, b);

  // Áreas geométricas: se integran la parte positiva y la negativa por separado
  const areaArriba = simpson(function (x) { return Math.max(fn.f(x), 0); }, a, b, N_PRECISO);
  const areaAbajo = simpson(function (x) { return Math.min(fn.f(x), 0); }, a, b, N_PRECISO);

  // Relleno: una traza con la parte positiva y otra con la negativa
  // La curva se dibuja un poco más allá de [a, b] para dar contexto
  const margen = Math.max(1, (b - a) * 0.3);
  const tramo = muestrear(fn.f, a, b);
  const curva = muestrear(fn.f, a - margen, b + margen);

  dibujarGrafica('grafica', [
    { x: tramo.x, y: tramo.y.map(function (y) { return Math.max(y, 0); }), mode: 'lines', fill: 'tozeroy',
      fillcolor: COLOR_POSITIVO, line: { width: 0 }, name: 'Área sobre el eje (+)', hoverinfo: 'skip' },
    { x: tramo.x, y: tramo.y.map(function (y) { return Math.min(y, 0); }), mode: 'lines', fill: 'tozeroy',
      fillcolor: COLOR_NEGATIVO, line: { width: 0 }, name: 'Área bajo el eje (−)', hoverinfo: 'skip' },
    { x: curva.x, y: curva.y, mode: 'lines', name: 'f(x) = ' + fn.nombre, line: { color: COLORES.curva, width: 3 } },
    { x: [a, b], y: [fn.f(a), fn.f(b)], mode: 'markers+text', text: ['a', 'b'], textposition: 'top center',
      name: 'Límites', marker: { color: COLORES.punto, size: 9 } }
  ]);

  escribirResultados([
    ['Integral F(b) − F(a)', formatearNumero(integral)],
    ['Área total ∫|f(x)|dx', formatearNumero(areaArriba - areaAbajo)],
    ['Área sobre el eje', formatearNumero(areaArriba)],
    ['Área bajo el eje', formatearNumero(-areaAbajo)]
  ]);

  escribirFormula('\\int_{' + numeroCorto(a) + '}^{' + numeroCorto(b) + '} \\left(' + fn.latex + '\\right) dx = \\Big[' + fn.latexF +
    '\\Big]_{' + numeroCorto(a) + '}^{' + numeroCorto(b) + '} = ' + formatearNumero(fn.F(b)) + ' - (' + formatearNumero(fn.F(a)) + ') = ' + formatearNumero(integral));
}

/** Modo "área entre curvas": sombrea la región entre f y g y calcula ∫|f − g|. */
function actualizarEntreCurvas() {
  mostrarError(null);
  const par = PARES_CURVAS[selectPar.value];
  const primero = par.cortes[0];
  const ultimo = par.cortes[par.cortes.length - 1];

  // Área numérica con Simpson sobre |f − g| (se compara con el valor exacto)
  const areaNumerica = simpson(function (x) { return Math.abs(par.f(x) - par.g(x)); }, primero, ultimo, N_PRECISO);

  // Intervalo de dibujo: un poco más allá de los cortes (√x solo existe para x ≥ 0)
  const margen = (ultimo - primero) * 0.3;
  const desde = selectPar.value === 'raizParabola' ? 0 : primero - margen;
  const hasta = ultimo + margen;

  const curvaF = muestrear(par.f, desde, hasta);
  const curvaG = muestrear(par.g, desde, hasta);
  const regionF = muestrear(par.f, primero, ultimo);
  const regionG = muestrear(par.g, primero, ultimo);

  dibujarGrafica('grafica', [
    // Relleno entre curvas: se dibuja g y luego f con fill "tonexty" (rellena hasta la traza anterior)
    { x: regionG.x, y: regionG.y, mode: 'lines', line: { width: 0 }, showlegend: false, hoverinfo: 'skip' },
    { x: regionF.x, y: regionF.y, mode: 'lines', fill: 'tonexty', fillcolor: COLOR_POSITIVO,
      line: { width: 0 }, name: 'Región entre curvas', hoverinfo: 'skip' },
    { x: curvaF.x, y: curvaF.y, mode: 'lines', name: 'f(x) = ' + par.nombreF, line: { color: COLORES.curva, width: 3 } },
    { x: curvaG.x, y: curvaG.y, mode: 'lines', name: 'g(x) = ' + par.nombreG, line: { color: COLOR_SEGUNDA_CURVA, width: 3 } },
    { x: par.cortes, y: par.cortes.map(par.f), mode: 'markers+text', name: 'Puntos de corte',
      text: par.cortes.map(function (c) { return 'x = ' + c; }), textposition: 'top left',
      marker: { color: COLORES.exacto, size: 10 } }
  ]);

  escribirResultados([
    ['Puntos de corte', par.cortes.map(function (c) { return 'x = ' + c; }).join(', ')],
    ['Área (Simpson, n = 1000)', formatearNumero(areaNumerica)],
    ['Área exacta', formatearNumero(par.areaExacta)],
    ['Error absoluto', formatearNumero(errorAbsoluto(areaNumerica, par.areaExacta))]
  ]);

  escribirFormula('A = \\int_{' + primero + '}^{' + ultimo + '} \\left|\\,' + par.latexF + ' - ' + par.latexG +
    '\\,\\right| dx = ' + par.latexArea + ' \\approx ' + formatearNumero(par.areaExacta));
}

/** Redibuja según el modo activo. */
function actualizar() {
  if (modo === 'area') actualizarArea();
  else actualizarEntreCurvas();
}

/**
 * Cambia entre los dos modos del visualizador.
 * @param {'area'|'entre'} nuevoModo - Modo a mostrar.
 */
function cambiarModo(nuevoModo) {
  modo = nuevoModo;
  document.getElementById('panel-area').hidden = modo !== 'area';
  document.getElementById('panel-entre').hidden = modo !== 'entre';
  document.getElementById('modo-area').classList.toggle('activo', modo === 'area');
  document.getElementById('modo-entre').classList.toggle('activo', modo === 'entre');
  document.getElementById('modo-area').setAttribute('aria-pressed', modo === 'area');
  document.getElementById('modo-entre').setAttribute('aria-pressed', modo === 'entre');
  actualizar();
}

// Eventos
document.getElementById('modo-area').addEventListener('click', function () { cambiarModo('area'); });
document.getElementById('modo-entre').addEventListener('click', function () { cambiarModo('entre'); });
document.getElementById('controles').addEventListener('input', actualizar);

document.getElementById('ejemplo-v1').addEventListener('click', function () {
  selectFuncion.value = 'polinomio';
  deslizadorA.value = 0;
  deslizadorB.value = 2;
  cambiarModo('area');
});
document.getElementById('ejemplo-v4').addEventListener('click', function () {
  selectPar.value = 'rectaParabola';
  cambiarModo('entre');
});

actualizar();
