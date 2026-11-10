/**
 * Módulo 16 — Sólidos de revolución.
 *
 * Una región plana (entre y = f(x) y y = g(x), con x de a a b) gira alrededor
 * de un eje y genera un sólido. Tres métodos para su volumen:
 *  - discos:     V = π ∫ f(x)² dx                  (giro sobre el eje x, g = 0)
 *  - arandelas:  V = π ∫ (f(x)² − g(x)²) dx        (giro sobre el eje x)
 *  - cascarones: V = 2π ∫ x·(f(x) − g(x)) dx       (giro sobre el eje y)
 *
 * La página dibuja la región con sus n rectángulos representativos, el sólido
 * en 3D (con un deslizador para "abrirlo" y ver adentro) y compara la suma de
 * las n piezas con el valor exacto.
 */

const cero = function () { return 0; };

// exacto: volumen calculado a mano; latexV: cuenta completa en LaTeX.
const EJEMPLOS_REV = {
  'D1': {
    nombre: 'Discos: y = √x, x de 0 a 4, gira sobre el eje x',
    metodo: 'discos', eje: 'x', a: 0, b: 4, f: Math.sqrt, g: cero, hayInterior: false,
    exacto: 8 * Math.PI,
    latexV: '\\pi\\int_0^4 \\left(\\sqrt{x}\\right)^2 dx = \\pi\\int_0^4 x\\,dx = \\pi\\cdot 8 = 8\\pi'
  },
  'D2': {
    nombre: 'Discos: y = x², x de 0 a 1, gira sobre el eje x',
    metodo: 'discos', eje: 'x', a: 0, b: 1, f: function (x) { return x * x; }, g: cero, hayInterior: false,
    exacto: Math.PI / 5,
    latexV: '\\pi\\int_0^1 \\left(x^2\\right)^2 dx = \\pi\\int_0^1 x^4\\,dx = \\frac{\\pi}{5}'
  },
  'A1': {
    nombre: 'Arandelas: entre y = x y y = x², gira sobre el eje x',
    metodo: 'arandelas', eje: 'x', a: 0, b: 1, f: function (x) { return x; }, g: function (x) { return x * x; }, hayInterior: true,
    exacto: (2 * Math.PI) / 15,
    latexV: '\\pi\\int_0^1 \\left(x^2 - x^4\\right) dx = \\pi\\left(\\frac13 - \\frac15\\right) = \\frac{2\\pi}{15}'
  },
  'A2': {
    nombre: 'Arandelas: entre y = √x y y = x², gira sobre el eje x',
    metodo: 'arandelas', eje: 'x', a: 0, b: 1, f: Math.sqrt, g: function (x) { return x * x; }, hayInterior: true,
    exacto: (3 * Math.PI) / 10,
    latexV: '\\pi\\int_0^1 \\left(x - x^4\\right) dx = \\pi\\left(\\frac12 - \\frac15\\right) = \\frac{3\\pi}{10}'
  },
  'C1': {
    nombre: 'Cascarones: y = x², x de 0 a 2, gira sobre el eje y',
    metodo: 'cascarones', eje: 'y', a: 0, b: 2, f: function (x) { return x * x; }, g: cero, hayInterior: false,
    exacto: 8 * Math.PI,
    latexV: '2\\pi\\int_0^2 x\\cdot x^2\\,dx = 2\\pi\\cdot\\frac{x^4}{4}\\Big|_0^2 = 2\\pi\\cdot 4 = 8\\pi'
  },
  'C2': {
    nombre: 'Cascarones: y = x − x², x de 0 a 1, gira sobre el eje y',
    metodo: 'cascarones', eje: 'y', a: 0, b: 1, f: function (x) { return x - x * x; }, g: cero, hayInterior: false,
    exacto: Math.PI / 6,
    latexV: '2\\pi\\int_0^1 x\\left(x - x^2\\right) dx = 2\\pi\\left(\\frac13 - \\frac14\\right) = \\frac{\\pi}{6}'
  },
  'C3': {
    nombre: 'Cascarones: y = √x, x de 0 a 1, gira sobre el eje y',
    metodo: 'cascarones', eje: 'y', a: 0, b: 1, f: Math.sqrt, g: cero, hayInterior: false,
    exacto: (4 * Math.PI) / 5,
    latexV: '2\\pi\\int_0^1 x\\cdot x^{1/2}\\,dx = 2\\pi\\cdot\\frac{2}{5} = \\frac{4\\pi}{5}'
  }
};

const FORMULAS = {
  discos: 'V = \\pi\\int_a^b [f(x)]^2\\,dx',
  arandelas: 'V = \\pi\\int_a^b \\left([f(x)]^2 - [g(x)]^2\\right) dx',
  cascarones: 'V = 2\\pi\\int_a^b x\\,\\big(f(x) - g(x)\\big)\\,dx'
};

const selEjemplo = document.getElementById('control-ejemplo');
const desN = document.getElementById('control-n');
const desAngulo = document.getElementById('control-angulo');

selEjemplo.innerHTML = Object.keys(EJEMPLOS_REV).map(function (k) {
  return '<option value="' + k + '">' + EJEMPLOS_REV[k].nombre + '</option>';
}).join('');
selEjemplo.value = 'A1';

/** Aporte de una pieza (disco, arandela o cascarón) de ancho dx en x. */
function aportePieza(ej, x, dx) {
  if (ej.metodo === 'cascarones') return 2 * Math.PI * x * (ej.f(x) - ej.g(x)) * dx;
  return Math.PI * (Math.pow(ej.f(x), 2) - Math.pow(ej.g(x), 2)) * dx;
}

/** Región 2D con los n rectángulos representativos y el eje de giro. */
function dibujarRegion(ej, n) {
  const dx = (ej.b - ej.a) / n;
  const rects = [];
  for (let i = 0; i < n; i++) {
    const xm = ej.a + (i + 0.5) * dx;
    rects.push([[xm - dx / 2, ej.g(xm)], [xm - dx / 2, ej.f(xm)], [xm + dx / 2, ej.f(xm)], [xm + dx / 2, ej.g(xm)]]);
  }
  const alto = Math.max(ej.f(ej.a), ej.f(ej.b), ej.f((ej.a + ej.b) / 2), ej.f(ej.a + 0.9 * (ej.b - ej.a))) * 1.15;
  const trazas = [trazaFiguras(rects, ej.metodo === 'cascarones' ? 'Rectángulo → cascarón' : 'Rectángulo → ' + (ej.hayInterior ? 'arandela' : 'disco')),
    trazaCurva(ej.f, ej.a, ej.b, 'y = f(x)')];
  if (ej.hayInterior) {
    const g = trazaCurva(ej.g, ej.a, ej.b, 'y = g(x)');
    g.line.color = COLORES.punto;
    trazas.push(g);
  }
  // Eje de giro
  const eje = ej.eje === 'x'
    ? { x: [ej.a - 0.1 * (ej.b - ej.a), ej.b + 0.1 * (ej.b - ej.a)], y: [0, 0] }
    : { x: [0, 0], y: [-0.05 * alto, alto] };
  trazas.push({ x: eje.x, y: eje.y, mode: 'lines', name: 'Eje de giro (eje ' + ej.eje + ')', line: { color: COLORES.exacto, width: 3, dash: 'dash' } });
  dibujarGrafica('grafica-region', trazas, {
    xaxis: { title: 'x', zeroline: true, zerolinecolor: '#98a2b3', gridcolor: '#eef1f6' },
    yaxis: { title: 'y', zeroline: true, zerolinecolor: '#98a2b3', gridcolor: '#eef1f6' }
  });
}

/** Una superficie de Plotly de un solo color. */
function superficie(x, y, z, color, opacidad, nombre) {
  return { type: 'surface', x: x, y: y, z: z, showscale: false, opacity: opacidad,
    colorscale: [[0, color], [1, color]], name: nombre, hoverinfo: 'skip', lighting: { ambient: 0.8, diffuse: 0.6 } };
}

/** Malla (filas × columnas) a partir de una función de (u, v). */
function malla(nu, nv, u0, u1, v0, v1, punto) {
  const X = [], Y = [], Z = [];
  for (let i = 0; i < nu; i++) {
    const fx = [], fy = [], fz = [];
    for (let j = 0; j < nv; j++) {
      const p = punto(u0 + ((u1 - u0) * i) / (nu - 1), v0 + ((v1 - v0) * j) / (nv - 1));
      fx.push(p[0]); fy.push(p[1]); fz.push(p[2]);
    }
    X.push(fx); Y.push(fy); Z.push(fz);
  }
  return { x: X, y: Y, z: Z };
}

/** Sólido de revolución en 3D, con el giro limitado a "angulo" grados. */
function dibujarSolido(ej, angulo) {
  const tMax = (angulo * Math.PI) / 180;
  const AZUL = '#1f3a8a', VERDE = '#0e9f8e', NARANJA = '#d9822b';
  const N = 50;
  const trazas = [];
  let titulos;

  if (ej.eje === 'x') {
    // Giro sobre el eje x: el punto (x, r) pasa a (x, r·cos t, r·sin t)
    const girar = function (r) { return function (x, t) { return [x, r(x) * Math.cos(t), r(x) * Math.sin(t)]; }; };
    const ext = malla(N, N, ej.a, ej.b, 0, tMax, function (x, t) { return girar(ej.f)(x, t); });
    trazas.push(superficie(ext.x, ext.y, ext.z, VERDE, 0.95, 'Superficie exterior'));
    if (ej.hayInterior) {
      const int = malla(N, N, ej.a, ej.b, 0, tMax, function (x, t) { return girar(ej.g)(x, t); });
      trazas.push(superficie(int.x, int.y, int.z, NARANJA, 0.95, 'Superficie interior'));
    }
    // Tapas en x = b y x = a (disco o arandela)
    [ej.a, ej.b].forEach(function (xt) {
      const tapa = malla(N, N, ej.g(xt), ej.f(xt), 0, tMax, function (r, t) { return [xt, r * Math.cos(t), r * Math.sin(t)]; });
      trazas.push(superficie(tapa.x, tapa.y, tapa.z, AZUL, 0.9, 'Tapa'));
    });
    trazas.push({ type: 'scatter3d', mode: 'lines', x: [ej.a, ej.b], y: [0, 0], z: [0, 0], line: { color: '#c0392b', width: 6 }, name: 'Eje x', hoverinfo: 'skip' });
    titulos = ['x', 'y', 'z'];
  } else {
    // Giro sobre el eje y: el punto (r, y) pasa a (r·cos t, r·sin t, y). Se dibuja y como altura.
    const ext = malla(N, N, ej.a, ej.b, 0, tMax, function (r, t) { return [r * Math.cos(t), r * Math.sin(t), ej.f(r)]; });
    trazas.push(superficie(ext.x, ext.y, ext.z, VERDE, 0.95, 'Superficie superior y = f(x)'));
    const inf = malla(N, N, ej.a, ej.b, 0, tMax, function (r, t) { return [r * Math.cos(t), r * Math.sin(t), ej.g(r)]; });
    trazas.push(superficie(inf.x, inf.y, inf.z, NARANJA, 0.9, 'Base'));
    // Pared exterior (cilindro de radio b) entre g(b) y f(b)
    const pared = malla(N, N, 0, tMax, ej.g(ej.b), ej.f(ej.b), function (t, z) { return [ej.b * Math.cos(t), ej.b * Math.sin(t), z]; });
    trazas.push(superficie(pared.x, pared.y, pared.z, AZUL, 0.9, 'Pared exterior'));
    const alto = Math.max(ej.f(ej.b), 0.01);
    trazas.push({ type: 'scatter3d', mode: 'lines', x: [0, 0], y: [0, 0], z: [0, alto * 1.15], line: { color: '#c0392b', width: 6 }, name: 'Eje y', hoverinfo: 'skip' });
    titulos = ['x', 'z', 'y'];
  }

  Plotly.react('grafica-3d', trazas, {
    margin: { l: 0, r: 0, t: 10, b: 0 },
    showlegend: false,
    scene: {
      aspectmode: 'data',
      xaxis: { title: titulos[0] }, yaxis: { title: titulos[1] }, zaxis: { title: titulos[2] },
      camera: { eye: { x: 1.6, y: -1.6, z: 1.1 } }
    },
    paper_bgcolor: '#ffffff', font: { family: 'Segoe UI, system-ui, sans-serif', size: 13 }
  }, { responsive: true, displaylogo: false });
}

function actualizar() {
  const ej = EJEMPLOS_REV[selEjemplo.value];
  const n = Number(desN.value);
  const angulo = Number(desAngulo.value);
  document.getElementById('valor-n').textContent = n;
  document.getElementById('valor-angulo').textContent = angulo + '°';

  dibujarRegion(ej, n);
  dibujarSolido(ej, angulo);

  const dx = (ej.b - ej.a) / n;
  let aproximado = 0;
  for (let i = 0; i < n; i++) aproximado += aportePieza(ej, ej.a + (i + 0.5) * dx, dx);

  const etiqueta = ej.metodo === 'cascarones' ? 'Suma de cascarones' : (ej.hayInterior ? 'Suma de arandelas' : 'Suma de discos');
  document.getElementById('resultados').innerHTML =
    '<div class="resultado"><span>Piezas n</span><strong>' + n + '</strong></div>' +
    '<div class="resultado"><span>' + etiqueta + '</span><strong>' + formatearNumero(aproximado) + '</strong></div>' +
    '<div class="resultado"><span>Volumen exacto</span><strong>' + formatearNumero(ej.exacto) + '</strong></div>' +
    '<div class="resultado"><span>Error absoluto</span><strong>' + formatearNumero(Math.abs(aproximado - ej.exacto)) + '</strong></div>';

  const f = document.getElementById('formula-exacta');
  f.innerHTML = 'Método: <strong>' + ej.metodo + '</strong> &nbsp;·&nbsp; $' + FORMULAS[ej.metodo] + '$<br>' +
    '$\\displaystyle ' + ej.latexV + ' \\approx ' + formatearNumero(ej.exacto) + '$';
  renderizarFormulas(f);
}

document.getElementById('controles').addEventListener('input', actualizar);
actualizar();
