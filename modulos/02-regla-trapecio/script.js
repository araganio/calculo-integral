/**
 * Módulo 2 — Regla del Trapecio.
 * Dibuja un trapecio por subintervalo, uniendo (x(i−1), f(x(i−1))) con (xi, f(xi)).
 */

const contenedorControles = document.getElementById('controles');

crearControles(contenedorControles, {
  ejemplos: [
    { etiqueta: 'II.1', funcion: 'cuadrado', a: '0', b: '2', n: 4 },
    { etiqueta: 'II.4', funcion: 'seno', a: '0', b: 'pi/2', n: 4 }
  ]
});

/** Lee los controles, calcula y redibuja todo. */
function actualizar() {
  const datos = leerControles();
  if (!datos) return;

  const { fn, a, b, n } = datos;
  const nodos = calcularNodos(a, b, n);

  // 1) Cálculo con la función pura
  const aproximado = trapecio(fn.f, a, b, n);

  // 2) Un trapecio por cada par de nodos consecutivos
  const trapecios = [];
  for (let i = 1; i <= n; i++) {
    const x0 = nodos[i - 1];
    const x1 = nodos[i];
    trapecios.push([[x0, 0], [x0, fn.f(x0)], [x1, fn.f(x1)], [x1, 0]]);
  }

  // Tabla: nodo, valor y coeficiente (1 en los extremos, 2 en los interiores)
  const filas = nodos.map(function (x, i) {
    const coeficiente = (i === 0 || i === n) ? 1 : 2;
    return ['x' + subindice(i), x, fn.f(x), coeficiente, coeficiente * fn.f(x)];
  });

  const [xMin, xMax] = rangoGrafica(fn, a, b);
  dibujarGrafica('grafica', [
    trazaFiguras(trapecios, 'Trapecios (T' + subindice(n) + ')'),
    trazaCurva(fn.f, xMin, xMax, 'f(x) = ' + fn.nombre),
    { x: nodos, y: nodos.map(fn.f), mode: 'markers', name: 'Nodos', marker: { color: COLORES.punto, size: n > 40 ? 4 : 7 } }
  ]);

  mostrarResultados('Trapecio T' + subindice(n), aproximado, fn, a, b);
  llenarTabla(['Nodo', 'x<sub>i</sub>', 'f(x<sub>i</sub>)', 'Coeficiente', 'Coef. · f(x<sub>i</sub>)'], filas);
}

conectarControles(contenedorControles, actualizar);
actualizar();
