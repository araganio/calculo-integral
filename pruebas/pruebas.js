/**
 * pruebas.js — Verifica los métodos numéricos contra los valores verificados de los ejemplos resueltos.
 * Cada prueba compara el resultado redondeado a 4 decimales con el esperado.
 */

const f = FUNCIONES;
const PI = Math.PI;

/**
 * Mayor diferencia |F'(x) − f(x)| de un módulo (módulos 7 a 14), con una derivada
 * numérica centrada en 7 puntos de cada intervalo. Si F es de verdad una
 * antiderivada de f, el resultado es prácticamente 0.
 * @param {number} modulo - Número del módulo en EJEMPLOS_INTEGRALES.
 * @returns {number} El peor error relativo encontrado.
 */
function peorErrorDerivada(modulo) {
  const h = 1e-6;
  let peor = 0;
  Object.keys(EJEMPLOS_INTEGRALES[modulo]).forEach(function (clave) {
    const ej = EJEMPLOS_INTEGRALES[modulo][clave];
    for (let i = 1; i <= 7; i++) {
      const x = ej.xMin + ((ej.xMax - ej.xMin) * i) / 8;
      const derivada = (ej.F(x + h) - ej.F(x - h)) / (2 * h);
      const error = Math.abs(derivada - ej.f(x)) / Math.max(1, Math.abs(ej.f(x)));
      peor = Math.max(peor, error);
    }
  });
  return peor < 1e-4 ? 0 : peor; // por debajo de 1e-4 es ruido de la derivada numérica
}

/** Lista de pruebas: [ejemplo, descripción, valor esperado, valor obtenido] */
const PRUEBAS = [
  ['I.1', 'L₄ de x² en [0, 2]', 1.75, sumaIzquierda(f.cuadrado.f, 0, 2, 4)],
  ['I.1', 'R₄ de x² en [0, 2]', 3.75, sumaDerecha(f.cuadrado.f, 0, 2, 4)],
  ['I.1', 'M₄ de x² en [0, 2]', 2.625, puntoMedio(f.cuadrado.f, 0, 2, 4)],
  ['I.1', 'Exacto de x² en [0, 2]', 2.6667, valorExacto(f.cuadrado.F, 0, 2)],
  ['I.2', 'L₅ de 1/x en [1, 3]', 1.2436, sumaIzquierda(f.inversa.f, 1, 3, 5)],
  ['I.2', 'R₅ de 1/x en [1, 3]', 0.9769, sumaDerecha(f.inversa.f, 1, 3, 5)],
  ['I.2', 'M₅ de 1/x en [1, 3]', 1.0929, puntoMedio(f.inversa.f, 1, 3, 5)],
  ['I.2', 'Exacto de 1/x en [1, 3]', 1.0986, valorExacto(f.inversa.F, 1, 3)],
  ['II.1', 'T₄ de x² en [0, 2]', 2.75, trapecio(f.cuadrado.f, 0, 2, 4)],
  ['II.4', 'T₄ de sen x en [0, π/2]', 0.9871, trapecio(f.seno.f, 0, PI / 2, 4)],
  ['II.4', 'Exacto de sen x en [0, π/2]', 1, valorExacto(f.seno.F, 0, PI / 2)],
  ['III.4', 'M₄ de cos x en [0, π/2]', 1.0065, puntoMedio(f.coseno.f, 0, PI / 2, 4)],
  ['III.5', 'M₄ de ln x en [1, 2]', 0.3876, puntoMedio(f.logaritmo.f, 1, 2, 4)],
  ['III.5', 'Exacto de ln x en [1, 2]', 0.3863, valorExacto(f.logaritmo.F, 1, 2)],
  ['IV.1', 'S₄ de x² en [0, 2]', 2.6667, simpson(f.cuadrado.f, 0, 2, 4)],
  ['IV.2', 'S₄ de 1/x en [1, 3]', 1.1, simpson(f.inversa.f, 1, 3, 4)],
  ['V.1', '∫ (3x² − 2x + 1) en [0, 2]', 6, valorExacto(FUNCIONES_AREA.polinomio.F, 0, 2)],
  ['V.4', 'Área entre 2x y x² (Simpson n = 1000)', 1.3333,
    simpson(function (x) { return Math.abs(2 * x - x * x); }, 0, 2, 1000)],
  ['VI.5', 'F(2) − F(0) de x³/3 − x', 0.6667, valorExacto(EJEMPLOS_DIRECTA['VI.5'].F, 0, 2)],

  // Módulos 7 a 14: F'(x) = f(x) en todos los ejemplos del visualizador (se espera error 0)
  ['VII', "Sustitución: F' = f en los 3 ejemplos", 0, peorErrorDerivada(7)],
  ['VIII', "Exponenciales: F' = f en los 3 ejemplos", 0, peorErrorDerivada(8)],
  ['IX', "Logarítmicas: F' = f en los 3 ejemplos", 0, peorErrorDerivada(9)],
  ['X', "Trigonométricas: F' = f en los 3 ejemplos", 0, peorErrorDerivada(10)],
  ['XI', "Trig. inversas: F' = f en los 3 ejemplos", 0, peorErrorDerivada(11)],
  ['XII', "Hiperbólicas inversas: F' = f en los 3 ejemplos", 0, peorErrorDerivada(12)],
  ['XIII', "Trinomio cuadrático: F' = f en los 3 ejemplos", 0, peorErrorDerivada(13)],
  ['XIV', "Por partes: F' = f en los 3 ejemplos", 0, peorErrorDerivada(14)],
  ['XV', "Racionales: F' = f en los 3 ejemplos", 0, peorErrorDerivada(15)],
  ['XVI', "Irracionales: F' = f en los 3 ejemplos", 0, peorErrorDerivada(16)],
  ['XVII', "Sustitución trigonométrica: F' = f en los 3 ejemplos", 0, peorErrorDerivada(17)],
  ['XVIII', "Sustitución universal: F' = f en los 3 ejemplos", 0, peorErrorDerivada(18)],

  // Módulo 19: volúmenes por secciones (Simpson n = 1000 sobre A(x))
  ['XIX.1', 'Círculo, triángulos equiláteros: 4√3/3', 2.3094,
    simpson(function (x) { return Math.sqrt(3) * (1 - x * x); }, -1, 1, 1000)],
  ['XIX.2', 'Bajo y = 1 − x²/4, cuadrados: 16/15', 1.0667,
    simpson(function (x) { return Math.pow(1 - x * x / 4, 2); }, 0, 2, 1000)],
  ['XIX.3', 'Círculo, semicírculos: 2π/3', 2.0944,
    simpson(function (x) { return (PI / 2) * (1 - x * x); }, -1, 1, 1000)],

  // Módulo 20: sólidos de revolución
  ['XX.1', 'Discos: y = √x, [0, 4], eje x → 8π', 25.1327,
    simpson(function (x) { return PI * x; }, 0, 4, 1000)],
  ['XX.2', 'Arandelas: √x y x², eje x → 3π/10', 0.9425,
    simpson(function (x) { return PI * (x - Math.pow(x, 4)); }, 0, 1, 1000)],
  ['XX.3', 'Cascarones: y = x², [0, 2], eje y → 8π', 25.1327,
    simpson(function (x) { return 2 * PI * x * x * x; }, 0, 2, 1000)],
  ['XX.3', 'Mismo sólido por arandelas en y (comprobación)', 25.1327,
    simpson(function (y) { return PI * (4 - y); }, 0, 4, 1000)]
];

let aprobadas = 0;
const cuerpo = document.getElementById('cuerpo-pruebas');

PRUEBAS.forEach(function (prueba) {
  const [ejemplo, descripcion, esperado, obtenido] = prueba;
  const coincide = obtenido.toFixed(4) === esperado.toFixed(4);
  if (coincide) aprobadas++;

  const fila = document.createElement('tr');
  fila.innerHTML =
    '<td>' + ejemplo + '</td><td style="text-align:left">' + descripcion + '</td>' +
    '<td>' + esperado.toFixed(4) + '</td><td>' + obtenido.toFixed(4) + '</td>' +
    '<td>' + (coincide ? '✔' : '✘') + '</td>';
  if (!coincide) fila.style.color = 'var(--color-error)';
  cuerpo.appendChild(fila);

  // También se reporta en la consola del navegador
  console.log((coincide ? 'OK   ' : 'FALLA') + ' ' + ejemplo + ' ' + descripcion + ': ' + obtenido.toFixed(4));
});

document.getElementById('resumen').textContent =
  aprobadas + ' de ' + PRUEBAS.length + ' pruebas coinciden con los valores verificados.';
