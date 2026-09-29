/**
 * Módulo 4 — Regla de Simpson.
 * Por cada par de subintervalos construye la parábola que pasa por sus tres
 * nodos (interpolación cuadrática) y sombrea el área bajo ella.
 * El deslizador de n va de 2 en 2 porque Simpson exige n par.
 */

const contenedorControles = document.getElementById('controles');

crearControles(contenedorControles, {
  nMin: 2,
  nPaso: 2,
  ejemplos: [
    { etiqueta: 'IV.1', funcion: 'cuadrado', a: '0', b: '2', n: 4 },
    { etiqueta: 'IV.2', funcion: 'inversa', a: '1', b: '3', n: 4 }
  ]
});

/** Lee los controles, calcula y redibuja todo. */
function actualizar() {
  const datos = leerControles();
  if (!datos) return;

  const { fn, a, b, n } = datos;
  const nodos = calcularNodos(a, b, n);
  const valores = nodos.map(fn.f);

  // 1) Cálculo con la función pura
  const aproximado = simpson(fn.f, a, b, n);

  // 2) Una parábola por cada par de subintervalos: nodos i, i+1, i+2
  const figuras = [];
  const puntosPorParabola = 30;
  for (let i = 0; i < n; i += 2) {
    const p = parabolaPorTresPuntos(nodos[i], valores[i], nodos[i + 1], valores[i + 1], nodos[i + 2], valores[i + 2]);
    const figura = [[nodos[i], 0]];
    for (let k = 0; k <= puntosPorParabola; k++) {
      const x = nodos[i] + ((nodos[i + 2] - nodos[i]) * k) / puntosPorParabola;
      figura.push([x, p(x)]);
    }
    figura.push([nodos[i + 2], 0]);
    figuras.push(figura);
  }

  // Tabla con el coeficiente de Simpson de cada nodo (1, 4, 2, ..., 4, 1)
  const filas = nodos.map(function (x, i) {
    const coeficiente = coeficienteSimpson(i, n);
    return ['x' + subindice(i), x, valores[i], coeficiente, coeficiente * valores[i]];
  });

  const [xMin, xMax] = rangoGrafica(fn, a, b);
  dibujarGrafica('grafica', [
    trazaFiguras(figuras, 'Parábolas de Simpson (' + n / 2 + ')'),
    trazaCurva(fn.f, xMin, xMax, 'f(x) = ' + fn.nombre),
    { x: nodos, y: valores, mode: 'markers', name: 'Nodos', marker: { color: COLORES.punto, size: n > 40 ? 4 : 7 } }
  ]);

  mostrarResultados('Simpson S' + subindice(n), aproximado, fn, a, b);
  llenarTabla(['Nodo', 'x<sub>i</sub>', 'f(x<sub>i</sub>)', 'Coeficiente', 'Coef. · f(x<sub>i</sub>)'], filas);
}

conectarControles(contenedorControles, actualizar);
actualizar();
