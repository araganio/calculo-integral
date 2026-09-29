/**
 * Módulo 6 — Integración Directa.
 * Grafica f(x) junto con su antiderivada F(x) + C. El deslizador de C
 * desplaza F verticalmente y se puede mostrar la familia de antiderivadas.
 * Además dibuja la recta tangente a F en un punto para ver que su
 * pendiente es f(x): eso es justamente lo que significa F'(x) = f(x).
 */

const COLOR_ANTIDERIVADA = '#0e9f8e';
const COLOR_FAMILIA = 'rgba(14, 159, 142, 0.25)';
const VALORES_FAMILIA = [-6, -4, -2, 2, 4, 6];

const selectEjemplo = document.getElementById('control-ejemplo');
const deslizadorC = document.getElementById('control-c');
const casillaFamilia = document.getElementById('control-familia');
const deslizadorX = document.getElementById('control-x');

// Llenar el selector con los ejemplos de funciones.js
selectEjemplo.innerHTML = Object.keys(EJEMPLOS_DIRECTA).map(function (clave) {
  return '<option value="' + clave + '">' + EJEMPLOS_DIRECTA[clave].nombre + '</option>';
}).join('');
selectEjemplo.value = 'VI.5'; // el ejemplo más sencillo de ver al abrir la página

/**
 * Genera los puntos de una función en el intervalo del ejemplo.
 * @param {function(number): number} g - Función a muestrear.
 * @param {number} desde - Inicio.
 * @param {number} hasta - Fin.
 * @returns {{x: number[], y: number[]}}
 */
function muestrear(g, desde, hasta) {
  const x = [];
  const y = [];
  const pasos = 300;
  for (let i = 0; i <= pasos; i++) {
    const xi = desde + ((hasta - desde) * i) / pasos;
    x.push(xi);
    y.push(g(xi));
  }
  return { x: x, y: y };
}

/** Lee los controles y redibuja la gráfica. */
function actualizar() {
  const ej = EJEMPLOS_DIRECTA[selectEjemplo.value];
  const C = Number(deslizadorC.value);
  const desde = ej.dominioMin;
  const hasta = ej.xMax;

  // El deslizador de x va de 0 a 100; lo convertimos a un x dentro del dominio
  const x0 = desde + ((hasta - desde) * Number(deslizadorX.value)) / 100;
  document.getElementById('valor-c').textContent = C.toFixed(1);
  document.getElementById('valor-x').textContent = x0.toFixed(2);

  /** Antiderivada con la constante elegida. */
  const F_C = function (x) { return ej.F(x) + C; };

  const trazas = [];

  // Familia de antiderivadas (curvas tenues)
  if (casillaFamilia.checked) {
    VALORES_FAMILIA.forEach(function (k, i) {
      const curva = muestrear(function (x) { return ej.F(x) + k; }, desde, hasta);
      trazas.push({
        x: curva.x, y: curva.y, mode: 'lines', line: { color: COLOR_FAMILIA, width: 1.5 },
        name: 'Familia F(x) + C', legendgroup: 'familia', showlegend: i === 0, hoverinfo: 'skip'
      });
    });
  }

  const curvaF = muestrear(ej.f, desde, hasta);
  const curvaAnti = muestrear(F_C, desde, hasta);
  trazas.push({ x: curvaF.x, y: curvaF.y, mode: 'lines', name: 'f(x)', line: { color: COLORES.curva, width: 3 } });
  trazas.push({ x: curvaAnti.x, y: curvaAnti.y, mode: 'lines', name: 'F(x) + C', line: { color: COLOR_ANTIDERIVADA, width: 3 } });

  // Recta tangente a F + C en x0: su pendiente es f(x0)
  const pendiente = ej.f(x0);
  const medioAncho = (hasta - desde) * 0.12;
  trazas.push({
    x: [x0 - medioAncho, x0 + medioAncho],
    y: [F_C(x0) - pendiente * medioAncho, F_C(x0) + pendiente * medioAncho],
    mode: 'lines', name: 'Tangente a F (pendiente f(x))', line: { color: COLORES.punto, width: 2, dash: 'dash' }
  });
  trazas.push({
    x: [x0, x0], y: [F_C(x0), pendiente], mode: 'markers', showlegend: false,
    marker: { color: COLORES.punto, size: 9 }, hoverinfo: 'x+y'
  });

  dibujarGrafica('grafica', trazas);

  document.getElementById('resultados').innerHTML =
    '<div class="resultado"><span>x elegido</span><strong>' + formatearNumero(x0) + '</strong></div>' +
    '<div class="resultado"><span>f(x) = pendiente de F</span><strong>' + formatearNumero(pendiente) + '</strong></div>' +
    '<div class="resultado"><span>F(x) + C</span><strong>' + formatearNumero(F_C(x0)) + '</strong></div>' +
    '<div class="resultado"><span>Constante C</span><strong>' + formatearNumero(C) + '</strong></div>';

  const formula = document.getElementById('formula-exacta');
  const signo = C < 0 ? ' - ' + numeroCorto(-C) : ' + ' + numeroCorto(C);
  // Dos fórmulas separadas para que en celular puedan pasar a otra línea
  formula.innerHTML = '$\\displaystyle\\int \\left(' + ej.latex + '\\right) dx = ' + ej.latexF + ' + C$ ' +
    '<br>Con $C = ' + numeroCorto(C) + '$: $\\displaystyle F(x) = ' + ej.latexF + (C === 0 ? '' : signo) + '$';
  renderizarFormulas(formula);
}

document.getElementById('controles').addEventListener('input', actualizar);
actualizar();
