/**
 * metodos-numericos.js — Métodos numéricos de integración.
 *
 * Todas son FUNCIONES PURAS: reciben la función f, los límites a y b y el
 * número de subintervalos n, y devuelven un número. No leen ni modifican
 * la página (DOM). Así se pueden probar solas en la consola del navegador
 * o en pruebas/index.html, y cualquier módulo las puede reutilizar.
 */

/**
 * Calcula el ancho de cada subintervalo.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @param {number} n - Número de subintervalos.
 * @returns {number} Δx = (b − a) / n
 */
function calcularDeltaX(a, b, n) {
  return (b - a) / n;
}

/**
 * Genera los n + 1 nodos que dividen [a, b] en n partes iguales.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @param {number} n - Número de subintervalos.
 * @returns {number[]} [x0, x1, ..., xn] con xi = a + i·Δx
 */
function calcularNodos(a, b, n) {
  const dx = calcularDeltaX(a, b, n);
  const nodos = [];
  for (let i = 0; i <= n; i++) {
    nodos.push(a + i * dx);
  }
  return nodos;
}

/**
 * Genera los n puntos medios de los subintervalos.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @param {number} n - Número de subintervalos.
 * @returns {number[]} [x̄1, ..., x̄n] con x̄i = (x(i−1) + xi) / 2
 */
function calcularPuntosMedios(a, b, n) {
  const dx = calcularDeltaX(a, b, n);
  const medios = [];
  for (let i = 1; i <= n; i++) {
    medios.push(a + (i - 0.5) * dx);
  }
  return medios;
}

/**
 * Suma de Riemann por la izquierda: la altura de cada rectángulo es f en
 * el extremo izquierdo del subintervalo.
 * @param {function(number): number} f - Función a integrar.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @param {number} n - Número de subintervalos.
 * @returns {number} Ln = Δx · [f(x0) + f(x1) + ... + f(x(n−1))]
 */
function sumaIzquierda(f, a, b, n) {
  const dx = calcularDeltaX(a, b, n);
  let suma = 0;
  for (let i = 0; i < n; i++) {
    suma += f(a + i * dx);
  }
  return suma * dx;
}

/**
 * Suma de Riemann por la derecha: la altura de cada rectángulo es f en
 * el extremo derecho del subintervalo.
 * @param {function(number): number} f - Función a integrar.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @param {number} n - Número de subintervalos.
 * @returns {number} Rn = Δx · [f(x1) + f(x2) + ... + f(xn)]
 */
function sumaDerecha(f, a, b, n) {
  const dx = calcularDeltaX(a, b, n);
  let suma = 0;
  for (let i = 1; i <= n; i++) {
    suma += f(a + i * dx);
  }
  return suma * dx;
}

/**
 * Regla del punto medio: la altura de cada rectángulo es f en el centro
 * del subintervalo.
 * @param {function(number): number} f - Función a integrar.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @param {number} n - Número de subintervalos.
 * @returns {number} Mn = Δx · [f(x̄1) + ... + f(x̄n)]
 */
function puntoMedio(f, a, b, n) {
  const dx = calcularDeltaX(a, b, n);
  let suma = 0;
  for (let i = 1; i <= n; i++) {
    suma += f(a + (i - 0.5) * dx);
  }
  return suma * dx;
}

/**
 * Suma de Riemann del tipo indicado (atajo para el módulo 1).
 * @param {function(number): number} f - Función a integrar.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @param {number} n - Número de subintervalos.
 * @param {'izquierda'|'derecha'|'medio'} tipo - Tipo de suma.
 * @returns {number} Ln, Rn o Mn según el tipo.
 */
function riemann(f, a, b, n, tipo) {
  if (tipo === 'izquierda') return sumaIzquierda(f, a, b, n);
  if (tipo === 'derecha') return sumaDerecha(f, a, b, n);
  return puntoMedio(f, a, b, n);
}

/**
 * Regla del trapecio: une los puntos de la curva con segmentos rectos y
 * suma el área de los trapecios. Los extremos pesan 1 y los interiores 2.
 * @param {function(number): number} f - Función a integrar.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @param {number} n - Número de subintervalos.
 * @returns {number} Tn = (Δx/2) · [f(x0) + 2f(x1) + ... + 2f(x(n−1)) + f(xn)]
 */
function trapecio(f, a, b, n) {
  const dx = calcularDeltaX(a, b, n);
  let suma = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    suma += 2 * f(a + i * dx);
  }
  return (dx / 2) * suma;
}

/**
 * Regla de Simpson: ajusta una parábola cada dos subintervalos.
 * Coeficientes: 1, 4, 2, 4, 2, ..., 4, 1. Exige que n sea par.
 * @param {function(number): number} f - Función a integrar.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @param {number} n - Número de subintervalos (par).
 * @returns {number} Sn = (Δx/3) · [f(x0) + 4f(x1) + 2f(x2) + ... + 4f(x(n−1)) + f(xn)]
 * @throws {Error} Si n es impar.
 */
function simpson(f, a, b, n) {
  if (n % 2 !== 0) {
    throw new Error('La regla de Simpson necesita un número par de subintervalos.');
  }
  const dx = calcularDeltaX(a, b, n);
  let suma = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    const coeficiente = (i % 2 === 1) ? 4 : 2; // impares pesan 4, pares pesan 2
    suma += coeficiente * f(a + i * dx);
  }
  return (dx / 3) * suma;
}

/**
 * Devuelve el coeficiente de Simpson del nodo i (1, 4, 2, 4, ..., 4, 1).
 * Se usa para mostrar la tabla del módulo 4.
 * @param {number} i - Índice del nodo (0 a n).
 * @param {number} n - Número de subintervalos.
 * @returns {number} 1, 2 o 4.
 */
function coeficienteSimpson(i, n) {
  if (i === 0 || i === n) return 1;
  return (i % 2 === 1) ? 4 : 2;
}

/**
 * Construye la parábola que pasa por tres puntos (interpolación de Lagrange).
 * La usa el módulo 4 para dibujar las parábolas de Simpson.
 * @param {number} x0 @param {number} y0 - Primer punto.
 * @param {number} x1 @param {number} y1 - Punto del medio.
 * @param {number} x2 @param {number} y2 - Último punto.
 * @returns {function(number): number} p(x), polinomio de grado ≤ 2 con p(xi) = yi.
 */
function parabolaPorTresPuntos(x0, y0, x1, y1, x2, y2) {
  return function (x) {
    const l0 = ((x - x1) * (x - x2)) / ((x0 - x1) * (x0 - x2));
    const l1 = ((x - x0) * (x - x2)) / ((x1 - x0) * (x1 - x2));
    const l2 = ((x - x0) * (x - x1)) / ((x2 - x0) * (x2 - x1));
    return y0 * l0 + y1 * l1 + y2 * l2;
  };
}

/**
 * Valor exacto de la integral definida con el Teorema Fundamental del Cálculo.
 * @param {function(number): number} F - Antiderivada de f.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @returns {number} F(b) − F(a)
 */
function valorExacto(F, a, b) {
  return F(b) - F(a);
}

/**
 * Error absoluto de una aproximación.
 * @param {number} aproximado - Valor obtenido con el método numérico.
 * @param {number} exacto - Valor exacto.
 * @returns {number} |aproximado − exacto|
 */
function errorAbsoluto(aproximado, exacto) {
  return Math.abs(aproximado - exacto);
}

/**
 * Error relativo porcentual de una aproximación.
 * @param {number} aproximado - Valor obtenido con el método numérico.
 * @param {number} exacto - Valor exacto.
 * @returns {number} |aproximado − exacto| / |exacto| · 100, o NaN si el exacto es 0.
 */
function errorRelativo(aproximado, exacto) {
  if (exacto === 0) return NaN; // no se puede dividir entre cero
  return (Math.abs(aproximado - exacto) / Math.abs(exacto)) * 100;
}
