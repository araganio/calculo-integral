/**
 * funciones.js — Catálogo de funciones de ejemplo.
 *
 * En lugar de dejar que el usuario escriba cualquier fórmula (lo que
 * obligaría a usar eval(), que es inseguro), cada función está definida
 * aquí con todo lo que la plataforma necesita:
 *  - nombre: texto para el selector
 *  - latex:  f(x) en LaTeX (para KaTeX)
 *  - f:      la función en JavaScript
 *  - F:      una antiderivada, para calcular el valor exacto con el TFC
 *  - latexF: la antiderivada en LaTeX
 *  - dominio: restricción del límite inferior (o null si no hay):
 *      { minimo, incluyeMinimo, mensaje }
 */

/** Funciones de los visualizadores de los módulos 1 a 4. */
const FUNCIONES = {
  cuadrado: {
    nombre: 'x²',
    latex: 'x^2',
    f: function (x) { return x * x; },
    F: function (x) { return (x * x * x) / 3; },
    latexF: '\\frac{x^3}{3}',
    dominio: null
  },
  inversa: {
    nombre: '1/x',
    latex: '\\frac{1}{x}',
    f: function (x) { return 1 / x; },
    F: function (x) { return Math.log(x); }, // válida para x > 0
    latexF: '\\ln x',
    dominio: { minimo: 0, incluyeMinimo: false, mensaje: 'Para 1/x el límite inferior a debe ser mayor que 0 (la función no está definida en x = 0).' }
  },
  raiz: {
    nombre: '√x',
    latex: '\\sqrt{x}',
    f: function (x) { return Math.sqrt(x); },
    F: function (x) { return (2 / 3) * Math.pow(x, 1.5); },
    latexF: '\\frac{2}{3}x^{3/2}',
    dominio: { minimo: 0, incluyeMinimo: true, mensaje: 'Para √x el límite inferior a debe ser mayor o igual que 0.' }
  },
  exponencial: {
    nombre: 'eˣ',
    latex: 'e^x',
    f: function (x) { return Math.exp(x); },
    F: function (x) { return Math.exp(x); },
    latexF: 'e^x',
    dominio: null
  },
  seno: {
    nombre: 'sen x',
    latex: '\\sin x',
    f: function (x) { return Math.sin(x); },
    F: function (x) { return -Math.cos(x); },
    latexF: '-\\cos x',
    dominio: null
  },
  coseno: {
    nombre: 'cos x',
    latex: '\\cos x',
    f: function (x) { return Math.cos(x); },
    F: function (x) { return Math.sin(x); },
    latexF: '\\sin x',
    dominio: null
  },
  logaritmo: {
    nombre: 'ln x',
    latex: '\\ln x',
    f: function (x) { return Math.log(x); },
    F: function (x) { return x * Math.log(x) - x; },
    latexF: 'x\\ln x - x',
    dominio: { minimo: 0, incluyeMinimo: false, mensaje: 'Para ln x el límite inferior a debe ser mayor que 0 (el logaritmo no está definido en x ≤ 0).' }
  }
};

/**
 * Funciones del módulo 5 (área bajo la curva). Todas están definidas en
 * toda la recta real para poder mover a y b libremente; algunas cruzan
 * el eje x para ver áreas positivas y negativas.
 */
const FUNCIONES_AREA = {
  polinomio: {
    nombre: '3x² − 2x + 1',
    latex: '3x^2-2x+1',
    f: function (x) { return 3 * x * x - 2 * x + 1; },
    F: function (x) { return x * x * x - x * x + x; },
    latexF: 'x^3-x^2+x'
  },
  cubica: {
    nombre: 'x³ − 4x',
    latex: 'x^3-4x',
    f: function (x) { return x * x * x - 4 * x; },
    F: function (x) { return Math.pow(x, 4) / 4 - 2 * x * x; },
    latexF: '\\frac{x^4}{4}-2x^2'
  },
  cuadrado: FUNCIONES.cuadrado,
  seno: FUNCIONES.seno,
  coseno: FUNCIONES.coseno,
  exponencial: FUNCIONES.exponencial
};

/**
 * Pares de funciones para el modo "área entre curvas" del módulo 5.
 * nombreF / nombreG: texto plano para la leyenda de la gráfica.
 * cortes: abscisas donde f(x) = g(x), calculadas a mano (resolviendo f = g).
 * areaExacta: valor de ∫ |f − g| dx entre el primer y el último corte.
 */
const PARES_CURVAS = {
  rectaParabola: {
    nombre: 'f(x) = 2x,  g(x) = x²',
    latexF: '2x', latexG: 'x^2', nombreF: '2x', nombreG: 'x²',
    f: function (x) { return 2 * x; },
    g: function (x) { return x * x; },
    cortes: [0, 2],
    areaExacta: 4 / 3,
    latexArea: '\\frac{4}{3}'
  },
  raizParabola: {
    nombre: 'f(x) = √x,  g(x) = x²',
    latexF: '\\sqrt{x}', latexG: 'x^2', nombreF: '√x', nombreG: 'x²',
    f: function (x) { return Math.sqrt(x); },
    g: function (x) { return x * x; },
    cortes: [0, 1],
    areaExacta: 1 / 3,
    latexArea: '\\frac{1}{3}'
  },
  rectaParabola2: {
    nombre: 'f(x) = x + 2,  g(x) = x²',
    latexF: 'x+2', latexG: 'x^2', nombreF: 'x + 2', nombreG: 'x²',
    f: function (x) { return x + 2; },
    g: function (x) { return x * x; },
    cortes: [-1, 2],
    areaExacta: 9 / 2,
    latexArea: '\\frac{9}{2}'
  },
  rectaCubica: {
    nombre: 'f(x) = x,  g(x) = x³',
    latexF: 'x', latexG: 'x^3', nombreF: 'x', nombreG: 'x³',
    f: function (x) { return x; },
    g: function (x) { return x * x * x; },
    cortes: [-1, 0, 1],
    areaExacta: 1 / 2,
    latexArea: '\\frac{1}{2}'
  }
};

/**
 * Ejemplos de integración directa del módulo 6 (VI.2, VI.3 y VI.5).
 * dominioMin: menor x donde el ejemplo está definido (para graficar).
 */
const EJEMPLOS_DIRECTA = {
  'VI.2': {
    nombre: 'VI.2:  3/x² − 9/√x',
    latex: '\\frac{3}{x^2}-\\frac{9}{\\sqrt{x}}',
    f: function (x) { return 3 / (x * x) - 9 / Math.sqrt(x); },
    F: function (x) { return -3 / x - 18 * Math.sqrt(x); },
    latexF: '-\\frac{3}{x}-18\\sqrt{x}',
    dominioMin: 0.25,
    xMax: 6
  },
  'VI.3': {
    nombre: 'VI.3:  x + 4√x − 4/x',
    latex: 'x+4\\sqrt{x}-\\frac{4}{x}',
    f: function (x) { return x + 4 * Math.sqrt(x) - 4 / x; },
    F: function (x) { return (x * x) / 2 + (8 / 3) * Math.pow(x, 1.5) - 4 * Math.log(Math.abs(x)); },
    latexF: '\\frac{x^2}{2}+\\frac{8}{3}x^{3/2}-4\\ln|x|',
    dominioMin: 0.2,
    xMax: 5
  },
  'VI.5': {
    nombre: 'VI.5:  (x − 1)(x + 1)',
    latex: '(x-1)(x+1)',
    f: function (x) { return (x - 1) * (x + 1); },
    F: function (x) { return (x * x * x) / 3 - x; },
    latexF: '\\frac{x^3}{3}-x',
    dominioMin: -3,
    xMax: 3
  },
  'VI.6': {
    nombre: 'VI.6:  (x² + 4x − 4)/√x',
    latex: '\\frac{x^2+4x-4}{\\sqrt{x}}',
    f: function (x) { return (x * x + 4 * x - 4) / Math.sqrt(x); },
    F: function (x) { return (2 / 5) * Math.pow(x, 2.5) + (8 / 3) * Math.pow(x, 1.5) - 8 * Math.sqrt(x); },
    latexF: '\\frac{2}{5}x^{5/2}+\\frac{8}{3}x^{3/2}-8\\sqrt{x}',
    dominioMin: 0.1,
    xMax: 4
  }
};
