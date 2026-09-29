/**
 * layout.js — Partes comunes de todas las páginas.
 *
 * Inserta el encabezado con el menú, el pie de página y la navegación
 * "Anterior / Siguiente" entre módulos, y renderiza las fórmulas con KaTeX.
 * Así esas partes se escriben una sola vez y no se repiten en cada HTML.
 *
 * Cada página indica en su <body> dos datos:
 *  - data-raiz:   ruta relativa hasta la raíz del sitio ("" en el inicio,
 *                 "../../" dentro de un módulo). Se usan rutas relativas
 *                 porque GitHub Pages publica el sitio bajo /<nombre-repo>/.
 *  - data-modulo: número del módulo actual (no existe en el inicio).
 *
 * Depende de: modulos.js (arreglo MODULOS) y KaTeX auto-render.
 */

/**
 * Devuelve la ruta relativa hasta la raíz del sitio.
 * @returns {string} Por ejemplo "" o "../../".
 */
function rutaRaiz() {
  return document.body.dataset.raiz || '';
}

/**
 * Construye el enlace a la página de un módulo.
 * @param {object} modulo - Un elemento del arreglo MODULOS.
 * @returns {string} Ruta relativa al index.html del módulo.
 */
function rutaModulo(modulo) {
  return rutaRaiz() + 'modulos/' + modulo.carpeta + '/index.html';
}

/**
 * Formatea un número con 4 decimales (formato usado en todos los resultados).
 * @param {number} valor - Número a mostrar.
 * @returns {string} El número con 4 decimales, o "—" si no es un número válido.
 */
function formatearNumero(valor) {
  if (typeof valor !== 'number' || !isFinite(valor)) return '—';
  if (Math.abs(valor) < 0.00005) return '0.0000'; // evita mostrar "-0.0000"
  return valor.toFixed(4);
}

/**
 * Renderiza con KaTeX todas las fórmulas que haya dentro de un elemento.
 * Delimitadores: $...$ en línea y $$...$$ en bloque.
 * Se llama al cargar la página y cada vez que se inserta texto nuevo con fórmulas.
 * @param {HTMLElement} elemento - Contenedor donde buscar fórmulas.
 */
function renderizarFormulas(elemento) {
  if (typeof renderMathInElement !== 'function') return; // KaTeX no cargó (sin internet)
  renderMathInElement(elemento, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }
    ],
    throwOnError: false
  });
}

/**
 * Crea el encabezado con el logo y el menú (con el desplegable de módulos).
 * En pantallas pequeñas el menú se abre con el botón "hamburguesa".
 * @param {number|null} moduloActual - Número del módulo abierto, o null en el inicio.
 * @returns {HTMLElement} El elemento <header> listo para insertar.
 */
function crearEncabezado(moduloActual) {
  const encabezado = document.createElement('header');
  encabezado.className = 'encabezado';

  // Lista de enlaces a los 14 módulos, generada desde MODULOS
  const enlaces = MODULOS.map(function (m) {
    const clases = [];
    if (m.numero === moduloActual) clases.push('activo');
    if (!m.disponible) clases.push('pendiente');
    return '<li><a class="' + clases.join(' ') + '" href="' + rutaModulo(m) + '">' +
      '<span class="menu-num">' + m.numero + '</span> ' + m.nombre +
      (m.disponible ? '' : ' <small>(Fase ' + m.fase + ')</small>') + '</a></li>';
  }).join('');

  encabezado.innerHTML =
    '<div class="encabezado-contenido">' +
      '<a class="logo" href="' + rutaRaiz() + 'index.html"><span class="logo-simbolo">∫</span> Cálculo Integral</a>' +
      '<button class="boton-menu" type="button" aria-expanded="false" aria-controls="menu-principal" aria-label="Abrir menú">☰</button>' +
      '<nav id="menu-principal" class="menu" aria-label="Menú principal">' +
        '<a href="' + rutaRaiz() + 'index.html"' + (moduloActual ? '' : ' class="activo"') + '>Inicio</a>' +
        '<details class="menu-modulos">' +
          '<summary>Módulos</summary>' +
          '<ul>' + enlaces + '</ul>' +
        '</details>' +
      '</nav>' +
    '</div>';

  // Botón hamburguesa: muestra u oculta el menú en móvil
  const boton = encabezado.querySelector('.boton-menu');
  const menu = encabezado.querySelector('.menu');
  boton.addEventListener('click', function () {
    const abierto = menu.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', abierto);
  });

  // Cerrar el desplegable de módulos al hacer clic fuera de él
  const desplegable = encabezado.querySelector('.menu-modulos');
  document.addEventListener('click', function (evento) {
    if (!desplegable.contains(evento.target)) desplegable.removeAttribute('open');
  });

  return encabezado;
}

/**
 * Crea la navegación "← Anterior / Siguiente →" entre módulos.
 * @param {number} numero - Número del módulo actual.
 * @returns {HTMLElement} El elemento <nav> con los dos enlaces.
 */
function crearNavegacionModulos(numero) {
  const anterior = MODULOS.find(function (m) { return m.numero === numero - 1; });
  const siguiente = MODULOS.find(function (m) { return m.numero === numero + 1; });

  const nav = document.createElement('nav');
  nav.className = 'nav-modulos';
  nav.setAttribute('aria-label', 'Navegación entre módulos');
  nav.innerHTML =
    (anterior
      ? '<a class="nav-anterior" href="' + rutaModulo(anterior) + '">← Anterior<span>' + anterior.nombre + '</span></a>'
      : '<a class="nav-anterior" href="' + rutaRaiz() + 'index.html">← Inicio<span>Todos los módulos</span></a>') +
    (siguiente
      ? '<a class="nav-siguiente" href="' + rutaModulo(siguiente) + '">Siguiente →<span>' + siguiente.nombre + '</span></a>'
      : '<a class="nav-siguiente" href="' + rutaRaiz() + 'index.html">Inicio →<span>Todos los módulos</span></a>');
  return nav;
}

/**
 * Crea el pie de página con los datos del estudiante.
 * @returns {HTMLElement} El elemento <footer>.
 */
function crearPie() {
  const pie = document.createElement('footer');
  pie.className = 'pie';
  pie.innerHTML =
    '<p><strong>Juan Felipe Londoño Marín</strong> · Tecnología en Desarrollo de Software</p>' +
    '<p>Cálculo Integral · Universidad Tecnológica de Pereira (UTP) · 2026</p>';
  return pie;
}

/**
 * Llena la grilla de la página de inicio con una tarjeta por módulo.
 * Solo se ejecuta si la página tiene un elemento con id "grilla-modulos".
 */
function crearTarjetasInicio() {
  const grilla = document.getElementById('grilla-modulos');
  if (!grilla) return;

  grilla.innerHTML = MODULOS.map(function (m) {
    return '<a class="tarjeta' + (m.disponible ? '' : ' tarjeta-pendiente') + '" href="' + rutaModulo(m) + '">' +
      '<span class="tarjeta-num">' + String(m.numero).padStart(2, '0') + '</span>' +
      '<h3>' + m.nombre + '</h3>' +
      '<p>' + m.descripcion + '</p>' +
      '<div class="tarjeta-etiquetas">' +
        '<span class="etiqueta etiqueta-fase' + m.fase + '">Fase ' + m.fase + '</span>' +
        '<span class="etiqueta ' + (m.disponible ? 'etiqueta-disponible' : 'etiqueta-proximamente') + '">' +
          (m.disponible ? 'Disponible' : 'Próximamente') + '</span>' +
      '</div>' +
    '</a>';
  }).join('');
}

/**
 * Punto de entrada: arma el layout común de la página.
 * Los scripts se cargan con "defer", así que el HTML ya está listo aquí.
 */
function iniciarLayout() {
  const numero = Number(document.body.dataset.modulo) || null;

  document.body.prepend(crearEncabezado(numero));

  const principal = document.querySelector('main');
  if (numero && principal) principal.appendChild(crearNavegacionModulos(numero));

  document.body.appendChild(crearPie());
  crearTarjetasInicio();
  renderizarFormulas(document.body);
}

iniciarLayout();
