/**
 * ejemplos-integrales.js — Catálogo de integrales indefinidas de los módulos 7 a 14.
 *
 * Igual que funciones.js, cada ejemplo trae todo lo que necesita el
 * visualizador (nada de eval): f, una antiderivada F y sus versiones en LaTeX.
 * Cada antiderivada se verificó derivándola (F' = f); la página de
 * pruebas/ repite esa comprobación con una derivada numérica.
 *
 * Campos de cada ejemplo:
 *  - nombre:  texto del selector
 *  - latex / latexF: f(x) y F(x) en LaTeX
 *  - f / F:   las funciones en JavaScript
 *  - xMin / xMax: intervalo donde se grafica (dentro del dominio de f y F)
 */
const EJEMPLOS_INTEGRALES = {
  // Módulo 7 — Sustitución
  7: {
    'VII.1': {
      nombre: 'VII.1:  2x(x² + 1)³',
      latex: '2x(x^2+1)^3',
      f: function (x) { return 2 * x * Math.pow(x * x + 1, 3); },
      F: function (x) { return Math.pow(x * x + 1, 4) / 4; },
      latexF: '\\frac{(x^2+1)^4}{4}',
      xMin: -1.5, xMax: 1.5
    },
    'VII.2': {
      nombre: 'VII.2:  x√(x² + 4)',
      latex: 'x\\sqrt{x^2+4}',
      f: function (x) { return x * Math.sqrt(x * x + 4); },
      F: function (x) { return Math.pow(x * x + 4, 1.5) / 3; },
      latexF: '\\frac{(x^2+4)^{3/2}}{3}',
      xMin: -3, xMax: 3
    },
    'VII.3': {
      nombre: 'VII.3:  x / (x² + 1)',
      latex: '\\frac{x}{x^2+1}',
      f: function (x) { return x / (x * x + 1); },
      F: function (x) { return Math.log(x * x + 1) / 2; },
      latexF: '\\frac{1}{2}\\ln(x^2+1)',
      xMin: -4, xMax: 4
    }
  },

  // Módulo 8 — Exponenciales
  8: {
    'VIII.1': {
      nombre: 'VIII.1:  e^(3x)',
      latex: 'e^{3x}',
      f: function (x) { return Math.exp(3 * x); },
      F: function (x) { return Math.exp(3 * x) / 3; },
      latexF: '\\frac{e^{3x}}{3}',
      xMin: -1.5, xMax: 1.2
    },
    'VIII.2': {
      nombre: 'VIII.2:  x·e^(x²)',
      latex: 'x\\,e^{x^2}',
      f: function (x) { return x * Math.exp(x * x); },
      F: function (x) { return Math.exp(x * x) / 2; },
      latexF: '\\frac{e^{x^2}}{2}',
      xMin: -1.5, xMax: 1.5
    },
    'VIII.3': {
      nombre: 'VIII.3:  2ˣ',
      latex: '2^x',
      f: function (x) { return Math.pow(2, x); },
      F: function (x) { return Math.pow(2, x) / Math.LN2; },
      latexF: '\\frac{2^x}{\\ln 2}',
      xMin: -2, xMax: 3
    }
  },

  // Módulo 9 — Logarítmicas
  9: {
    'IX.1': {
      nombre: 'IX.1:  1 / (2x + 1)',
      latex: '\\frac{1}{2x+1}',
      f: function (x) { return 1 / (2 * x + 1); },
      F: function (x) { return Math.log(Math.abs(2 * x + 1)) / 2; },
      latexF: '\\frac{1}{2}\\ln|2x+1|',
      xMin: -0.45, xMax: 4
    },
    'IX.2': {
      nombre: 'IX.2:  x² / (x³ + 1)',
      latex: '\\frac{x^2}{x^3+1}',
      f: function (x) { return (x * x) / (x * x * x + 1); },
      F: function (x) { return Math.log(Math.abs(x * x * x + 1)) / 3; },
      latexF: '\\frac{1}{3}\\ln|x^3+1|',
      xMin: -0.9, xMax: 3
    },
    'IX.3': {
      nombre: 'IX.3:  1 / (x·ln x)',
      latex: '\\frac{1}{x\\ln x}',
      f: function (x) { return 1 / (x * Math.log(x)); },
      F: function (x) { return Math.log(Math.abs(Math.log(x))); },
      latexF: '\\ln|\\ln x|',
      xMin: 1.2, xMax: 6
    }
  },

  // Módulo 10 — Trigonométricas
  10: {
    'X.1': {
      nombre: 'X.1:  sen²x',
      latex: '\\sin^2 x',
      f: function (x) { return Math.sin(x) * Math.sin(x); },
      F: function (x) { return x / 2 - Math.sin(2 * x) / 4; },
      latexF: '\\frac{x}{2}-\\frac{\\sin 2x}{4}',
      xMin: -3.2, xMax: 3.2
    },
    'X.2': {
      nombre: 'X.2:  sen x · cos²x',
      latex: '\\sin x\\cos^2 x',
      f: function (x) { return Math.sin(x) * Math.cos(x) * Math.cos(x); },
      F: function (x) { return -Math.pow(Math.cos(x), 3) / 3; },
      latexF: '-\\frac{\\cos^3 x}{3}',
      xMin: -3.2, xMax: 3.2
    },
    'X.3': {
      nombre: 'X.3:  tan x',
      latex: '\\tan x',
      f: function (x) { return Math.tan(x); },
      F: function (x) { return -Math.log(Math.abs(Math.cos(x))); },
      latexF: '-\\ln|\\cos x|',
      xMin: -1.3, xMax: 1.3
    }
  },

  // Módulo 11 — Trigonométricas inversas
  11: {
    'XI.1': {
      nombre: 'XI.1:  1 / √(1 − x²)',
      latex: '\\frac{1}{\\sqrt{1-x^2}}',
      f: function (x) { return 1 / Math.sqrt(1 - x * x); },
      F: function (x) { return Math.asin(x); },
      latexF: '\\arcsin x',
      xMin: -0.95, xMax: 0.95
    },
    'XI.2': {
      nombre: 'XI.2:  1 / (1 + x²)',
      latex: '\\frac{1}{1+x^2}',
      f: function (x) { return 1 / (1 + x * x); },
      F: function (x) { return Math.atan(x); },
      latexF: '\\arctan x',
      xMin: -5, xMax: 5
    },
    'XI.3': {
      nombre: 'XI.3:  1 / √(4 − x²)',
      latex: '\\frac{1}{\\sqrt{4-x^2}}',
      f: function (x) { return 1 / Math.sqrt(4 - x * x); },
      F: function (x) { return Math.asin(x / 2); },
      latexF: '\\arcsin\\frac{x}{2}',
      xMin: -1.9, xMax: 1.9
    }
  },

  // Módulo 12 — Hiperbólicas inversas
  12: {
    'XII.1': {
      nombre: 'XII.1:  1 / √(x² + 1)',
      latex: '\\frac{1}{\\sqrt{x^2+1}}',
      f: function (x) { return 1 / Math.sqrt(x * x + 1); },
      F: function (x) { return Math.asinh(x); },
      latexF: '\\ln\\!\\left(x+\\sqrt{x^2+1}\\right)',
      xMin: -5, xMax: 5
    },
    'XII.2': {
      nombre: 'XII.2:  1 / √(x² − 1)',
      latex: '\\frac{1}{\\sqrt{x^2-1}}',
      f: function (x) { return 1 / Math.sqrt(x * x - 1); },
      F: function (x) { return Math.acosh(x); },
      latexF: '\\ln\\!\\left(x+\\sqrt{x^2-1}\\right)',
      xMin: 1.05, xMax: 5
    },
    'XII.3': {
      nombre: 'XII.3:  1 / (1 − x²)',
      latex: '\\frac{1}{1-x^2}',
      f: function (x) { return 1 / (1 - x * x); },
      F: function (x) { return Math.atanh(x); },
      latexF: '\\frac{1}{2}\\ln\\frac{1+x}{1-x}',
      xMin: -0.9, xMax: 0.9
    }
  },

  // Módulo 13 — Trinomio cuadrático
  13: {
    'XIII.1': {
      nombre: 'XIII.1:  1 / (x² + 2x + 5)',
      latex: '\\frac{1}{x^2+2x+5}',
      f: function (x) { return 1 / (x * x + 2 * x + 5); },
      F: function (x) { return Math.atan((x + 1) / 2) / 2; },
      latexF: '\\frac{1}{2}\\arctan\\frac{x+1}{2}',
      xMin: -6, xMax: 4
    },
    'XIII.2': {
      nombre: 'XIII.2:  1 / √(3 − 2x − x²)',
      latex: '\\frac{1}{\\sqrt{3-2x-x^2}}',
      f: function (x) { return 1 / Math.sqrt(3 - 2 * x - x * x); },
      F: function (x) { return Math.asin((x + 1) / 2); },
      latexF: '\\arcsin\\frac{x+1}{2}',
      xMin: -2.9, xMax: 0.9
    },
    'XIII.3': {
      nombre: 'XIII.3:  1 / (x² − 4x + 3)',
      latex: '\\frac{1}{x^2-4x+3}',
      f: function (x) { return 1 / (x * x - 4 * x + 3); },
      F: function (x) { return Math.log(Math.abs((x - 3) / (x - 1))) / 2; },
      latexF: '\\frac{1}{2}\\ln\\left|\\frac{x-3}{x-1}\\right|',
      xMin: 3.2, xMax: 8
    }
  },

  // Módulo 14 — Integración por partes
  14: {
    'XIV.1': {
      nombre: 'XIV.1:  x·eˣ',
      latex: 'x\\,e^x',
      f: function (x) { return x * Math.exp(x); },
      F: function (x) { return (x - 1) * Math.exp(x); },
      latexF: '(x-1)\\,e^x',
      xMin: -4, xMax: 2
    },
    'XIV.2': {
      nombre: 'XIV.2:  x·cos x',
      latex: 'x\\cos x',
      f: function (x) { return x * Math.cos(x); },
      F: function (x) { return x * Math.sin(x) + Math.cos(x); },
      latexF: 'x\\sin x+\\cos x',
      xMin: -6, xMax: 6
    },
    'XIV.3': {
      nombre: 'XIV.3:  x·ln x',
      latex: 'x\\ln x',
      f: function (x) { return x * Math.log(x); },
      F: function (x) { return (x * x / 2) * Math.log(x) - (x * x) / 4; },
      latexF: '\\frac{x^2}{2}\\ln x-\\frac{x^2}{4}',
      xMin: 0.2, xMax: 5
    }
  }
};
