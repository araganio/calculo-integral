/**
 * Módulo 19 — Volúmenes por secciones transversales conocidas.
 *
 * Una región plana sirve de base y sobre cada x se levanta una figura
 * (cuadrado, semicírculo o triángulo equilátero) cuyo lado/diámetro es la
 * longitud s(x) de la base en ese x. El volumen es V = ∫ A(x) dx con
 * A(x) = k·s(x)², donde k depende de la figura.
 *
 * La página dibuja el sólido en 3D (secciones apiladas) y el área A(x),
 * y compara la suma de las n secciones con el valor exacto.
 */

// Bases: y0(x) es el borde inferior de la base y s(x) su longitud en x.
// integral = ∫ s(x)² dx (calculada a mano); los LaTeX del volumen están en BASES[].volumen.
const BASES = {
  circulo: {
    nombre: 'Círculo x² + y² = 1',
    a: -1, b: 1,
    y0: function (x) { return -Math.sqrt(Math.max(0, 1 - x * x)); },
    s: function (x) { return 2 * Math.sqrt(Math.max(0, 1 - x * x)); },
    integral: 16 / 3,
    latexS: '2\\sqrt{1-x^2}',
    volumen: { cuadrado: '\\frac{16}{3}', semicirculo: '\\frac{2\\pi}{3}', triangulo: '\\frac{4\\sqrt{3}}{3}' }
  },
  parabola: {
    nombre: 'Bajo y = 1 − x²/4 (primer cuadrante)',
    a: 0, b: 2,
    y0: function () { return 0; },
    s: function (x) { return 1 - (x * x) / 4; },
    integral: 16 / 15,
    latexS: '1-\\frac{x^2}{4}',
    volumen: { cuadrado: '\\frac{16}{15}', semicirculo: '\\frac{2\\pi}{15}', triangulo: '\\frac{4\\sqrt{3}}{15}' }
  },
  entre: {
    nombre: 'Entre y = x  y  y = x²',
    a: 0, b: 1,
    y0: function (x) { return x * x; },
    s: function (x) { return x - x * x; },
    integral: 1 / 30,
    latexS: 'x-x^2',
    volumen: { cuadrado: '\\frac{1}{30}', semicirculo: '\\frac{\\pi}{240}', triangulo: '\\frac{\\sqrt{3}}{120}' }
  }
};

// Figuras: k es el factor de A = k·s², y poligono() devuelve los vértices (y, z) de la sección.
const FORMAS = {
  cuadrado: {
    nombre: 'Cuadrados',
    k: 1,
    latexA: 's^2',
    poligono: function (y0, s) { return [[y0, 0], [y0 + s, 0], [y0 + s, s], [y0, s]]; }
  },
  semicirculo: {
    nombre: 'Semicírculos (diámetro en la base)',
    k: Math.PI / 8,
    latexA: '\\frac{\\pi}{8}s^2',
    poligono: function (y0, s) {
      const r = s / 2;
      const puntos = [];
      for (let i = 0; i <= 16; i++) {
        const t = (Math.PI * i) / 16;
        puntos.push([y0 + r + r * Math.cos(t), r * Math.sin(t)]);
      }
      return puntos;
    }
  },
  triangulo: {
    nombre: 'Triángulos equiláteros',
    k: Math.sqrt(3) / 4,
    latexA: '\\frac{\\sqrt{3}}{4}s^2',
    poligono: function (y0, s) { return [[y0, 0], [y0 + s, 0], [y0 + s / 2, (Math.sqrt(3) / 2) * s]]; }
  }
};

const selBase = document.getElementById('control-base');
const selForma = document.getElementById('control-forma');
const desN = document.getElementById('control-n');

selBase.innerHTML = Object.keys(BASES).map(function (k) { return '<option value="' + k + '">' + BASES[k].nombre + '</option>'; }).join('');
selForma.innerHTML = Object.keys(FORMAS).map(function (k) { return '<option value="' + k + '">' + FORMAS[k].nombre + '</option>'; }).join('');

/** Posiciones (puntos medios) de las n secciones. */
function posiciones(base, n) {
  const dx = (base.b - base.a) / n;
  const xs = [];
  for (let i = 0; i < n; i++) xs.push(base.a + (i + 0.5) * dx);
  return xs;
}

/** Sólido 3D: base en z = 0 y secciones perpendiculares al eje x. */
function dibujarSolido(base, forma, n) {
  const xs = posiciones(base, n);
  const dx = (base.b - base.a) / n;

  // Malla semitransparente de todas las secciones (cada una como un abanico de triángulos)
  const mx = [], my = [], mz = [], ti = [], tj = [], tk = [];
  // Contornos de las secciones (líneas)
  const lx = [], ly = [], lz = [];
  xs.forEach(function (x) {
    const poli = forma.poligono(base.y0(x), base.s(x));
    const inicio = mx.length;
    poli.forEach(function (p) { mx.push(x); my.push(p[0]); mz.push(p[1]); });
    for (let j = 1; j < poli.length - 1; j++) { ti.push(inicio); tj.push(inicio + j); tk.push(inicio + j + 1); }
    poli.concat([poli[0]]).forEach(function (p) { lx.push(x); ly.push(p[0]); lz.push(p[1]); });
    lx.push(null); ly.push(null); lz.push(null);
  });

  // Contorno de la base en el plano z = 0
  const bx = [], byInf = [], bySup = [], cero = [];
  for (let i = 0; i <= 80; i++) {
    const x = base.a + ((base.b - base.a) * i) / 80;
    bx.push(x); byInf.push(base.y0(x)); bySup.push(base.y0(x) + base.s(x)); cero.push(0);
  }
  const cierre = { x: [base.a, base.a, null, base.b, base.b], y: [base.y0(base.a), base.y0(base.a) + base.s(base.a), null, base.y0(base.b), base.y0(base.b) + base.s(base.b)], z: [0, 0, null, 0, 0] };

  const trazas = [
    { type: 'mesh3d', x: mx, y: my, z: mz, i: ti, j: tj, k: tk, color: '#0e9f8e', opacity: 0.35, name: 'Secciones', hoverinfo: 'skip', showscale: false },
    { type: 'scatter3d', mode: 'lines', x: lx, y: ly, z: lz, line: { color: '#0e9f8e', width: 3 }, name: 'Contorno de cada sección', hoverinfo: 'skip' },
    { type: 'scatter3d', mode: 'lines', x: bx, y: byInf, z: cero, line: { color: '#1f3a8a', width: 5 }, name: 'Base', hoverinfo: 'skip' },
    { type: 'scatter3d', mode: 'lines', x: bx, y: bySup, z: cero, line: { color: '#1f3a8a', width: 5 }, showlegend: false, hoverinfo: 'skip' },
    { type: 'scatter3d', mode: 'lines', x: cierre.x, y: cierre.y, z: cierre.z, line: { color: '#1f3a8a', width: 5 }, showlegend: false, hoverinfo: 'skip' }
  ];
  Plotly.react('grafica-3d', trazas, {
    margin: { l: 0, r: 0, t: 10, b: 0 },
    legend: { orientation: 'h', y: -0.05 },
    scene: {
      aspectmode: 'data',
      xaxis: { title: 'x' }, yaxis: { title: 'y' }, zaxis: { title: 'z' },
      camera: { eye: { x: 1.5, y: -1.7, z: 1.1 } }
    },
    paper_bgcolor: '#ffffff', font: { family: 'Segoe UI, system-ui, sans-serif', size: 13 }
  }, { responsive: true, displaylogo: false });
  return dx;
}

/** Gráfica de A(x) con los n rectángulos de la suma. */
function dibujarArea(base, forma, n) {
  const A = function (x) { return forma.k * Math.pow(base.s(x), 2); };
  const trazaA = trazaCurva(A, base.a, base.b, 'A(x)');
  trazaA.fill = 'tozeroy';
  trazaA.fillcolor = 'rgba(14, 159, 142, 0.12)';
  const xs = posiciones(base, n);
  const dx = (base.b - base.a) / n;
  const rects = xs.map(function (x) {
    const h = A(x);
    return [[x - dx / 2, 0], [x - dx / 2, h], [x + dx / 2, h], [x + dx / 2, 0]];
  });
  dibujarGrafica('grafica-area', [trazaFiguras(rects, 'A(xᵢ)·Δx'), trazaA], {
    xaxis: { title: 'x', zeroline: true, zerolinecolor: '#98a2b3', gridcolor: '#eef1f6' },
    yaxis: { title: 'A(x)', zeroline: true, zerolinecolor: '#98a2b3', gridcolor: '#eef1f6' }
  });
}

function actualizar() {
  const base = BASES[selBase.value];
  const forma = FORMAS[selForma.value];
  const n = Number(desN.value);
  document.getElementById('valor-n').textContent = n;

  const dx = dibujarSolido(base, forma, n);
  dibujarArea(base, forma, n);

  const A = function (x) { return forma.k * Math.pow(base.s(x), 2); };
  const aproximado = posiciones(base, n).reduce(function (suma, x) { return suma + A(x) * dx; }, 0);
  const exacto = forma.k * base.integral;

  document.getElementById('resultados').innerHTML =
    '<div class="resultado"><span>Secciones n</span><strong>' + n + '</strong></div>' +
    '<div class="resultado"><span>Suma de las secciones</span><strong>' + formatearNumero(aproximado) + '</strong></div>' +
    '<div class="resultado"><span>Volumen exacto</span><strong>' + formatearNumero(exacto) + '</strong></div>' +
    '<div class="resultado"><span>Error absoluto</span><strong>' + formatearNumero(Math.abs(aproximado - exacto)) + '</strong></div>';

  const f = document.getElementById('formula-exacta');
  f.innerHTML = 'Longitud de la base: $s(x) = ' + base.latexS + '$ &nbsp;·&nbsp; Área de la sección: $A(x) = ' + forma.latexA + '$<br>' +
    '$\\displaystyle V = \\int_{' + numeroCorto(base.a) + '}^{' + numeroCorto(base.b) + '} A(x)\\,dx = ' + base.volumen[selForma.value] + ' \\approx ' + formatearNumero(exacto) + '$';
  renderizarFormulas(f);
}

document.getElementById('controles').addEventListener('input', actualizar);
actualizar();
