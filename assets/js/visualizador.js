/**
 * visualizador.js — Piezas comunes de los visualizadores de los módulos 1 a 4.
 *
 * Los cuatro métodos numéricos usan los mismos controles (función, a, b, n),
 * la misma validación, el mismo panel de resultados y la misma tabla. Para
 * no repetir ese código cuatro veces, vive aquí. Cada módulo solo decide
 * QUÉ figura dibujar (rectángulos, trapecios o parábolas).
 *
 * Flujo de cada módulo:  controles → leerControles() → funciones puras
 * de metodos-numericos.js → dibujarGrafica() / mostrarResultados().
 *
 * Depende de: funciones.js, metodos-numericos.js, layout.js y Plotly.
 */

/** Colores de las gráficas (los mismos de styles.css). */
const COLORES = {
  curva: '#1f3a8a',
  figura: 'rgba(14, 159, 142, 0.30)',
  bordeFigura: '#0e9f8e',
  punto: '#d9822b',
  exacto: '#c0392b'
};

/**
 * Convierte el texto de un límite en número.
 * Acepta decimales con punto o coma y múltiplos de π: "1.5", "1,5", "pi", "π/2", "3pi/4".
 * @param {string} texto - Lo que escribió el usuario.
 * @returns {number} El valor numérico, o NaN si no se entiende.
 */
function leerLimite(texto) {
  const t = texto.trim().toLowerCase().replace(/π/g, 'pi').replace(/\s+/g, '').replace(',', '.');
  if (t === '') return NaN;
  if (!t.includes('pi')) return Number(t);

  // Forma: [coeficiente][*]pi[/divisor], por ejemplo "pi/2" o "3*pi/4"
  const partes = t.match(/^(-?\d*\.?\d*)\*?pi(?:\/(\d*\.?\d+))?$/);
  if (!partes) return NaN;
  let coeficiente = 1;
  if (partes[1] === '-') coeficiente = -1;
  else if (partes[1] !== '') coeficiente = Number(partes[1]);
  const divisor = partes[2] ? Number(partes[2]) : 1;
  return (coeficiente * Math.PI) / divisor;
}

/**
 * Muestra un número de forma corta (sin ceros de sobra), para fórmulas y ejes.
 * @param {number} valor - Número a mostrar.
 * @returns {string} Por ejemplo 2, 0.5 o 1.5708.
 */
function numeroCorto(valor) {
  return String(Number(valor.toFixed(4)));
}

/**
 * Escribe un número como subíndice Unicode (4 → ₄, 12 → ₁₂), para textos
 * como "L₄" en la leyenda y en los resultados (donde no se usa KaTeX).
 * @param {number} n - Número entero.
 * @returns {string} El número con dígitos de subíndice.
 */
function subindice(n) {
  const digitos = '₀₁₂₃₄₅₆₇₈₉';
  return String(n).split('').map(function (d) { return digitos[Number(d)]; }).join('');
}

/**
 * Crea los controles comunes dentro de un contenedor.
 * @param {HTMLElement} contenedor - Donde se insertan los controles.
 * @param {object} opciones
 * @param {string} [opciones.funcion='cuadrado'] - Clave inicial del catálogo FUNCIONES.
 * @param {string} [opciones.a='0'] - Límite inferior inicial.
 * @param {string} [opciones.b='2'] - Límite superior inicial.
 * @param {number} [opciones.n=4] - Valor inicial de n.
 * @param {number} [opciones.nMin=1] - Mínimo del deslizador de n.
 * @param {number} [opciones.nPaso=1] - Paso del deslizador (2 en Simpson).
 * @param {string} [opciones.extra=''] - HTML de controles propios del módulo (va al inicio).
 * @param {Array} [opciones.ejemplos=[]] - Botones para cargar los ejemplos resueltos:
 *        [{ etiqueta, funcion, a, b, n }]
 */
function crearControles(contenedor, opciones) {
  const o = Object.assign({ funcion: 'cuadrado', a: '0', b: '2', n: 4, nMin: 1, nPaso: 1, extra: '', ejemplos: [] }, opciones);

  const opcionesFuncion = Object.keys(FUNCIONES).map(function (clave) {
    return '<option value="' + clave + '"' + (clave === o.funcion ? ' selected' : '') + '>f(x) = ' + FUNCIONES[clave].nombre + '</option>';
  }).join('');

  const botonesEjemplo = o.ejemplos.map(function (ej, i) {
    return '<button type="button" data-ejemplo="' + i + '">Ejemplo ' + ej.etiqueta + '</button>';
  }).join('');

  contenedor.innerHTML =
    o.extra +
    '<div class="control">' +
      '<label for="control-funcion">Función</label>' +
      '<select id="control-funcion">' + opcionesFuncion + '</select>' +
    '</div>' +
    '<div class="fila-limites">' +
      '<div class="control">' +
        '<label for="control-a">Límite a</label>' +
        '<input id="control-a" type="text" inputmode="decimal" value="' + o.a + '">' +
      '</div>' +
      '<div class="control">' +
        '<label for="control-b">Límite b</label>' +
        '<input id="control-b" type="text" inputmode="decimal" value="' + o.b + '">' +
      '</div>' +
    '</div>' +
    '<p class="ayuda">Puedes escribir decimales o múltiplos de π, por ejemplo <code>pi/2</code>.</p>' +
    '<div class="control">' +
      '<label for="control-n">Subintervalos: n = <span id="valor-n" class="valor-deslizador">' + o.n + '</span></label>' +
      '<input id="control-n" type="range" min="' + o.nMin + '" max="100" step="' + o.nPaso + '" value="' + o.n + '">' +
    '</div>' +
    '<div id="mensaje-error" class="mensaje-error" role="alert"></div>' +
    (botonesEjemplo ? '<div class="control"><span class="ayuda">Cargar un ejemplo resuelto:</span><div class="grupo-botones">' + botonesEjemplo + '</div></div>' : '');

  // Los botones de ejemplo llenan los controles con los datos del ejemplo
  contenedor.querySelectorAll('[data-ejemplo]').forEach(function (boton) {
    boton.addEventListener('click', function () {
      const ej = o.ejemplos[Number(boton.dataset.ejemplo)];
      document.getElementById('control-funcion').value = ej.funcion;
      document.getElementById('control-a').value = ej.a;
      document.getElementById('control-b').value = ej.b;
      document.getElementById('control-n').value = ej.n;
      // Avisamos que algo cambió para que la gráfica se actualice
      document.getElementById('control-n').dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
}

/**
 * Ejecuta "alCambiar" cada vez que el usuario mueve cualquier control
 * (así la gráfica se actualiza en tiempo real).
 * @param {HTMLElement} contenedor - El contenedor de los controles.
 * @param {function} alCambiar - Función que redibuja todo.
 */
function conectarControles(contenedor, alCambiar) {
  contenedor.addEventListener('input', alCambiar);
  contenedor.addEventListener('change', alCambiar);
}

/**
 * Revisa que los límites sean válidos para la función elegida.
 * @param {object} fn - Función del catálogo (con su dominio).
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @returns {string|null} Mensaje de error, o null si todo está bien.
 */
function validarLimites(fn, a, b) {
  if (isNaN(a) || isNaN(b)) return 'Escribe números válidos en los límites a y b (por ejemplo 0, 1.5 o pi/2).';
  if (Math.abs(a) > 50 || Math.abs(b) > 50) return 'Usa límites entre −50 y 50 para que la gráfica sea legible.';
  if (a >= b) return 'El límite inferior a debe ser menor que el límite superior b.';
  if (fn.dominio) {
    const fuera = fn.dominio.incluyeMinimo ? a < fn.dominio.minimo : a <= fn.dominio.minimo;
    if (fuera) return fn.dominio.mensaje;
  }
  return null;
}

/**
 * Muestra (o esconde, si el mensaje es null) el aviso de error.
 * @param {string|null} mensaje - Texto del error.
 */
function mostrarError(mensaje) {
  const caja = document.getElementById('mensaje-error');
  caja.textContent = mensaje || '';
  caja.classList.toggle('visible', Boolean(mensaje));
}

/**
 * Lee los controles comunes y los valida.
 * @returns {{clave: string, fn: object, a: number, b: number, n: number}|null}
 *          Los datos listos para calcular, o null si hay un error (ya mostrado).
 */
function leerControles() {
  const clave = document.getElementById('control-funcion').value;
  const fn = FUNCIONES[clave];
  const a = leerLimite(document.getElementById('control-a').value);
  const b = leerLimite(document.getElementById('control-b').value);
  const n = Number(document.getElementById('control-n').value);
  document.getElementById('valor-n').textContent = n;

  const error = validarLimites(fn, a, b);
  mostrarError(error);
  if (error) return null;
  return { clave: clave, fn: fn, a: a, b: b, n: n };
}

/**
 * Llena el panel de resultados: aproximación, valor exacto y errores.
 * Debajo muestra cómo se obtuvo el valor exacto con la antiderivada.
 * @param {string} etiqueta - Nombre de la aproximación, p. ej. "Trapecio T₄".
 * @param {number} aproximado - Resultado del método numérico.
 * @param {object} fn - Función del catálogo (para mostrar F(x)).
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 */
function mostrarResultados(etiqueta, aproximado, fn, a, b) {
  const exacto = valorExacto(fn.F, a, b);
  const relativo = errorRelativo(aproximado, exacto);

  document.getElementById('resultados').innerHTML =
    '<div class="resultado"><span>' + etiqueta + '</span><strong>' + formatearNumero(aproximado) + '</strong></div>' +
    '<div class="resultado"><span>Valor exacto</span><strong>' + formatearNumero(exacto) + '</strong></div>' +
    '<div class="resultado"><span>Error absoluto</span><strong>' + formatearNumero(errorAbsoluto(aproximado, exacto)) + '</strong></div>' +
    '<div class="resultado"><span>Error relativo</span><strong>' + (isNaN(relativo) ? '—' : relativo.toFixed(4) + ' %') + '</strong></div>';

  const formula = document.getElementById('formula-exacta');
  formula.innerHTML = 'Valor exacto con la antiderivada: $\\displaystyle\\int_{' + numeroCorto(a) + '}^{' + numeroCorto(b) + '} ' +
    fn.latex + '\\,dx = \\Big[' + fn.latexF + '\\Big]_{' + numeroCorto(a) + '}^{' + numeroCorto(b) + '} \\approx ' + formatearNumero(exacto) + '$';
  renderizarFormulas(formula);
}

/**
 * Llena la tabla plegable de valores.
 * @param {string[]} encabezados - Títulos de las columnas (pueden llevar HTML).
 * @param {Array<Array<number|string>>} filas - Valores de cada fila.
 */
function llenarTabla(encabezados, filas) {
  const tabla = document.getElementById('tabla');
  const cabecera = '<thead><tr>' + encabezados.map(function (e) { return '<th>' + e + '</th>'; }).join('') + '</tr></thead>';
  const cuerpo = '<tbody>' + filas.map(function (fila) {
    return '<tr>' + fila.map(function (celda) {
      return '<td>' + (typeof celda === 'number' ? formatearNumero(celda) : celda) + '</td>';
    }).join('') + '</tr>';
  }).join('') + '</tbody>';
  tabla.innerHTML = cabecera + cuerpo;
}

/**
 * Calcula el intervalo de x que se muestra en la gráfica: un poco más
 * ancho que [a, b], pero sin salirse del dominio de la función.
 * @param {object} fn - Función del catálogo.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @returns {number[]} [xMin, xMax]
 */
function rangoGrafica(fn, a, b) {
  const margen = (b - a) * 0.15;
  let xMin = a - margen;
  if (fn.dominio) {
    // Si el dominio excluye el mínimo (1/x, ln x) no nos acercamos demasiado a él
    const limite = fn.dominio.incluyeMinimo ? fn.dominio.minimo : a / 2;
    xMin = Math.max(xMin, limite);
  }
  return [xMin, b + margen];
}

/**
 * Crea la traza de Plotly con la curva y = f(x).
 * @param {function(number): number} f - Función a dibujar.
 * @param {number} xMin - Inicio del dibujo.
 * @param {number} xMax - Fin del dibujo.
 * @param {string} [nombre='f(x)'] - Nombre en la leyenda.
 * @returns {object} Traza de Plotly.
 */
function trazaCurva(f, xMin, xMax, nombre) {
  const x = [];
  const y = [];
  const puntos = 300;
  for (let i = 0; i <= puntos; i++) {
    const xi = xMin + ((xMax - xMin) * i) / puntos;
    x.push(xi);
    y.push(f(xi));
  }
  return { x: x, y: y, mode: 'lines', name: nombre || 'f(x)', line: { color: COLORES.curva, width: 3 } };
}

/**
 * Crea una sola traza con varias figuras rellenas (rectángulos, trapecios...).
 * Cada figura es una lista de puntos [x, y]; se separan con null para que
 * Plotly las cierre y las rellene por separado.
 * @param {Array<Array<number[]>>} figuras - Lista de figuras.
 * @param {string} nombre - Nombre en la leyenda.
 * @returns {object} Traza de Plotly.
 */
function trazaFiguras(figuras, nombre) {
  const x = [];
  const y = [];
  figuras.forEach(function (figura) {
    figura.forEach(function (punto) {
      x.push(punto[0]);
      y.push(punto[1]);
    });
    x.push(figura[0][0]); // volvemos al primer punto para cerrar el borde
    y.push(figura[0][1]);
    x.push(null);
    y.push(null);
  });
  return {
    x: x, y: y, mode: 'lines', name: nombre, fill: 'toself',
    fillcolor: COLORES.figura, line: { color: COLORES.bordeFigura, width: 1.5 },
    hoverinfo: 'skip'
  };
}

/**
 * Dibuja (o actualiza) una gráfica de Plotly con un diseño común.
 * Plotly.react solo cambia lo necesario, por eso es rápido al mover el deslizador.
 * @param {string} id - id del <div> de la gráfica.
 * @param {object[]} trazas - Trazas de Plotly.
 * @param {object} [extraLayout={}] - Ajustes adicionales del diseño.
 */
function dibujarGrafica(id, trazas, extraLayout) {
  const layout = Object.assign({
    margin: { l: 50, r: 20, t: 30, b: 40 },
    legend: { orientation: 'h', y: -0.15 },
    xaxis: { zeroline: true, zerolinecolor: '#98a2b3', gridcolor: '#eef1f6' },
    yaxis: { zeroline: true, zerolinecolor: '#98a2b3', gridcolor: '#eef1f6' },
    font: { family: 'Segoe UI, system-ui, sans-serif', size: 13 },
    hovermode: 'closest',
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff'
  }, extraLayout || {});

  const config = { responsive: true, displaylogo: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'] };
  Plotly.react(id, trazas, layout, config);
}
