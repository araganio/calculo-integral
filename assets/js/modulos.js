/**
 * modulos.js — Lista única de los 20 módulos de la plataforma.
 *
 * Es la "fuente de verdad" del sitio: el menú de navegación, las tarjetas
 * de la página de inicio y los botones "Anterior / Siguiente" se generan
 * a partir de este arreglo. Para agregar o activar un módulo en la
 * Fase 2 o 3 solo hay que editar este archivo (y crear su carpeta).
 *
 * Campos de cada módulo:
 *  - numero:      número del módulo (1 a 20)
 *  - carpeta:     nombre de la carpeta dentro de /modulos
 *  - nombre:      título que se muestra en el menú y en las tarjetas
 *  - fase:        fase del proyecto en la que se desarrolla (1, 2 o 3)
 *  - disponible:  true si el módulo ya está desarrollado
 *  - descripcion: frase corta para la tarjeta del inicio
 */
const MODULOS = [
  { numero: 1, carpeta: '01-sumas-riemann', nombre: 'Sumas de Riemann', fase: 1, disponible: true,
    descripcion: 'Aproxima el área con rectángulos: sumas izquierda, derecha y de punto medio.' },
  { numero: 2, carpeta: '02-regla-trapecio', nombre: 'Regla del Trapecio', fase: 1, disponible: true,
    descripcion: 'Reemplaza los rectángulos por trapecios para una mejor aproximación.' },
  { numero: 3, carpeta: '03-regla-punto-medio', nombre: 'Regla del Punto Medio', fase: 1, disponible: true,
    descripcion: 'Rectángulos cuya altura se toma en el centro de cada subintervalo.' },
  { numero: 4, carpeta: '04-regla-simpson', nombre: 'Regla de Simpson', fase: 1, disponible: true,
    descripcion: 'Ajusta parábolas cada dos subintervalos; muy precisa con pocos puntos.' },
  { numero: 5, carpeta: '05-integral-definida-area', nombre: 'Integral Definida y Área', fase: 1, disponible: true,
    descripcion: 'Teorema Fundamental del Cálculo, área bajo la curva y área entre curvas.' },
  { numero: 6, carpeta: '06-integracion-directa', nombre: 'Integración Directa', fase: 1, disponible: true,
    descripcion: 'Regla de la potencia, linealidad y la familia de antiderivadas F(x) + C.' },
  { numero: 7, carpeta: '07-sustitucion', nombre: 'Integración por Sustitución', fase: 2, disponible: true,
    descripcion: 'Cambio de variable u = g(x) para simplificar integrales.' },
  { numero: 8, carpeta: '08-exponenciales', nombre: 'Integrales Exponenciales', fase: 2, disponible: true,
    descripcion: 'Integrales con funciones de la forma eˣ y aˣ.' },
  { numero: 9, carpeta: '09-logaritmicas', nombre: 'Integrales Logarítmicas', fase: 2, disponible: true,
    descripcion: 'Integrales que conducen a ln|u|.' },
  { numero: 10, carpeta: '10-trigonometricas', nombre: 'Integrales Trigonométricas', fase: 2, disponible: true,
    descripcion: 'Integrales de seno, coseno, tangente y sus potencias.' },
  { numero: 11, carpeta: '11-trigonometricas-inversas', nombre: 'Trigonométricas Inversas', fase: 3, disponible: true,
    descripcion: 'Integrales que dan como resultado arcsen, arctan y arcsec.' },
  { numero: 12, carpeta: '12-hiperbolicas-inversas', nombre: 'Hiperbólicas Inversas', fase: 3, disponible: true,
    descripcion: 'Integrales que dan como resultado funciones hiperbólicas inversas.' },
  { numero: 13, carpeta: '13-trinomio-cuadratico', nombre: 'Trinomio Cuadrático', fase: 3, disponible: true,
    descripcion: 'Completar el cuadrado para integrar expresiones ax² + bx + c.' },
  { numero: 14, carpeta: '14-integracion-por-partes', nombre: 'Integración por Partes', fase: 3, disponible: true,
    descripcion: 'La fórmula ∫u dv = uv − ∫v du y sus aplicaciones.' },
  { numero: 15, carpeta: '15-integrales-racionales', nombre: 'Integrales Racionales', fase: 3, disponible: true,
    descripcion: 'Fracciones parciales: raíces reales simples, múltiples y complejas.' },
  { numero: 16, carpeta: '16-integrales-irracionales', nombre: 'Integrales Irracionales', fase: 3, disponible: true,
    descripcion: 'Cambios de variable x = tⁿ que convierten raíces en una integral racional.' },
  { numero: 17, carpeta: '17-sustitucion-trigonometrica', nombre: 'Sustitución Trigonométrica', fase: 3, disponible: true,
    descripcion: 'Integrales con √(a²−x²), √(a²+x²) y √(x²−a²) mediante x = a·sen θ, a·tan θ, a·sec θ.' },
  { numero: 18, carpeta: '18-sustitucion-universal', nombre: 'Sustitución Universal', fase: 3, disponible: true,
    descripcion: 'Con z = tan(x/2) cualquier expresión racional de sen x y cos x se vuelve racional en z.' },
  { numero: 19, carpeta: '19-volumenes-secciones', nombre: 'Volúmenes por Secciones', fase: 3, disponible: true,
    descripcion: 'Apila secciones transversales conocidas (cuadrados, semicírculos, triángulos) para hallar el volumen.' },
  { numero: 20, carpeta: '20-solidos-revolucion', nombre: 'Sólidos de Revolución', fase: 3, disponible: true,
    descripcion: 'Discos, arandelas y cascarones cilíndricos: el volumen de una región al girar sobre un eje.' }
];
