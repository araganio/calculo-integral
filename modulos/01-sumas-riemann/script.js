/**
 * Módulo 1 — Sumas de Riemann.
 * Dibuja los rectángulos de la suma elegida (izquierda, derecha o punto
 * medio) y una segunda gráfica con la convergencia de la suma cuando n crece.
 */

/** Nombre y símbolo de cada tipo de suma. */
const TIPOS_SUMA = {
  izquierda: { nombre: 'Suma izquierda', simbolo: 'L' },
  derecha: { nombre: 'Suma derecha', simbolo: 'R' },
  medio: { nombre: 'Punto medio', simbolo: 'M' }
};

const contenedorControles = document.getElementById('controles');

crearControles(contenedorControles, {
  // Control propio de este módulo: el tipo de suma
  extra:
    '<div class="control">' +
      '<label for="control-tipo">Tipo de suma</label>' +
      '<select id="control-tipo">' +
        '<option value="izquierda">Izquierda (Lₙ)</option>' +
        '<option value="derecha">Derecha (Rₙ)</option>' +
        '<option value="medio">Punto medio (Mₙ)</option>' +
      '</select>' +
    '</div>',
  ejemplos: [
    { etiqueta: 'I.1', funcion: 'cuadrado', a: '0', b: '2', n: 4 },
    { etiqueta: 'I.2', funcion: 'inversa', a: '1', b: '3', n: 5 }
  ]
});

/**
 * Devuelve el x donde se mide la altura del rectángulo i (i = 0 ... n−1).
 * @param {number} xIzq - Extremo izquierdo del subintervalo.
 * @param {number} dx - Ancho del subintervalo.
 * @param {string} tipo - 'izquierda', 'derecha' o 'medio'.
 * @returns {number} Punto de muestra del subintervalo.
 */
function puntoDeMuestra(xIzq, dx, tipo) {
  if (tipo === 'izquierda') return xIzq;
  if (tipo === 'derecha') return xIzq + dx;
  return xIzq + dx / 2;
}

/** Lee los controles, calcula y redibuja todo. */
function actualizar() {
  const datos = leerControles();
  if (!datos) return; // hay un error y ya se mostró el mensaje

  const { fn, a, b, n } = datos;
  const tipo = document.getElementById('control-tipo').value;
  const dx = calcularDeltaX(a, b, n);

  // 1) Cálculo con la función pura
  const aproximado = riemann(fn.f, a, b, n, tipo);

  // 2) Rectángulos y tabla
  const rectangulos = [];
  const muestrasX = [];
  const muestrasY = [];
  const filas = [];
  for (let i = 0; i < n; i++) {
    const xIzq = a + i * dx;
    const xMuestra = puntoDeMuestra(xIzq, dx, tipo);
    const altura = fn.f(xMuestra);
    rectangulos.push([[xIzq, 0], [xIzq, altura], [xIzq + dx, altura], [xIzq + dx, 0]]);
    muestrasX.push(xMuestra);
    muestrasY.push(altura);
    filas.push([i + 1, xMuestra, altura, altura * dx]);
  }

  const [xMin, xMax] = rangoGrafica(fn, a, b);
  const simbolo = TIPOS_SUMA[tipo].simbolo;
  dibujarGrafica('grafica', [
    trazaFiguras(rectangulos, 'Rectángulos (' + simbolo + subindice(n) + ')'),
    trazaCurva(fn.f, xMin, xMax, 'f(x) = ' + fn.nombre),
    { x: muestrasX, y: muestrasY, mode: 'markers', name: 'Punto de altura', marker: { color: COLORES.punto, size: n > 40 ? 4 : 7 } }
  ]);

  mostrarResultados(TIPOS_SUMA[tipo].nombre + ' ' + simbolo + subindice(n), aproximado, fn, a, b);
  llenarTabla(['Rectángulo', 'x donde se mide', 'Altura f(x)', 'Área f(x)·Δx'], filas);

  // 3) Gráfica de convergencia: la suma para n = 1 ... 100
  const valoresN = [];
  const aproximaciones = [];
  for (let k = 1; k <= 100; k++) {
    valoresN.push(k);
    aproximaciones.push(riemann(fn.f, a, b, k, tipo));
  }
  const exacto = valorExacto(fn.F, a, b);
  dibujarGrafica('grafica-convergencia', [
    { x: valoresN, y: aproximaciones, mode: 'lines+markers', name: simbolo + 'ₙ', line: { color: COLORES.bordeFigura }, marker: { size: 4 } },
    { x: [1, 100], y: [exacto, exacto], mode: 'lines', name: 'Valor exacto', line: { color: COLORES.exacto, dash: 'dash' } },
    { x: [n], y: [aproximado], mode: 'markers', name: 'n actual', marker: { color: COLORES.punto, size: 12, symbol: 'diamond' } }
  ], { xaxis: { title: { text: 'n' }, gridcolor: '#eef1f6' }, yaxis: { gridcolor: '#eef1f6' } });
}

conectarControles(contenedorControles, actualizar);
actualizar();
