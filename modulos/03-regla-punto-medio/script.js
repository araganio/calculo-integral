/**
 * Módulo 3 — Regla del Punto Medio.
 * Dibuja rectángulos cuya altura es f evaluada en el punto medio de cada
 * subintervalo y marca ese punto medio sobre la curva.
 */

const contenedorControles = document.getElementById('controles');

crearControles(contenedorControles, {
  ejemplos: [
    { etiqueta: 'III.4', funcion: 'coseno', a: '0', b: 'pi/2', n: 4 },
    { etiqueta: 'III.5', funcion: 'logaritmo', a: '1', b: '2', n: 4 }
  ]
});

/** Lee los controles, calcula y redibuja todo. */
function actualizar() {
  const datos = leerControles();
  if (!datos) return;

  const { fn, a, b, n } = datos;
  const dx = calcularDeltaX(a, b, n);
  const medios = calcularPuntosMedios(a, b, n);

  // 1) Cálculo con la función pura
  const aproximado = puntoMedio(fn.f, a, b, n);

  // 2) Rectángulo i: base [x̄i − Δx/2, x̄i + Δx/2] y altura f(x̄i)
  const rectangulos = medios.map(function (xm) {
    const altura = fn.f(xm);
    return [[xm - dx / 2, 0], [xm - dx / 2, altura], [xm + dx / 2, altura], [xm + dx / 2, 0]];
  });

  const filas = medios.map(function (xm, i) {
    return [i + 1, xm - dx / 2, xm + dx / 2, xm, fn.f(xm)];
  });

  const [xMin, xMax] = rangoGrafica(fn, a, b);
  dibujarGrafica('grafica', [
    trazaFiguras(rectangulos, 'Rectángulos (M' + subindice(n) + ')'),
    trazaCurva(fn.f, xMin, xMax, 'f(x) = ' + fn.nombre),
    {
      x: medios, y: medios.map(fn.f), mode: 'markers', name: 'Punto medio x̄ᵢ',
      marker: { color: COLORES.punto, size: n > 40 ? 5 : 9, symbol: 'diamond', line: { color: '#fff', width: 1 } }
    }
  ]);

  mostrarResultados('Punto medio M' + subindice(n), aproximado, fn, a, b);
  llenarTabla(['i', 'x<sub>i−1</sub>', 'x<sub>i</sub>', 'Punto medio x̄<sub>i</sub>', 'f(x̄<sub>i</sub>)'], filas);
}

conectarControles(contenedorControles, actualizar);
actualizar();
