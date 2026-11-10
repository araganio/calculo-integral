# ∫ Cálculo Integral Interactivo

Plataforma web educativa e interactiva de **Cálculo Integral**: teoría, visualizadores y ejemplos resueltos paso a paso. Se construye a lo largo del semestre en tres fases y queda como material de estudio abierto para otros estudiantes.

- **Estudiante:** Juan Felipe Londoño Marín, de Tecnología en Desarrollo de Software en la Universidad Tecnológica de Pereira (UTP)
- **Asignatura:** Cálculo Integral, Evaluación Parcial 1, Parte II (Desarrollo de Software)
- **Aplicación desplegada:** https://araganio.github.io/calculo-integral/
- **Repositorio:** https://github.com/araganio/calculo-integral

---

## Módulos y fases

| # | Módulo | Fase | Estado |
|---|---|---|---|
| 1 | Sumas de Riemann | 1 | ✅ Disponible |
| 2 | Regla del Trapecio | 1 | ✅ Disponible |
| 3 | Regla del Punto Medio | 1 | ✅ Disponible |
| 4 | Regla de Simpson | 1 | ✅ Disponible |
| 5 | Integral Definida y Área bajo la Curva | 1 | ✅ Disponible |
| 6 | Integración Directa | 1 | ✅ Disponible |
| 7 | Integración por Sustitución | 2 | ✅ Disponible |
| 8 | Integrales Exponenciales | 2 | ✅ Disponible |
| 9 | Integrales Logarítmicas | 2 | ✅ Disponible |
| 10 | Integrales Trigonométricas | 2 | ✅ Disponible |
| 11 | Trigonométricas Inversas | 3 | ✅ Disponible |
| 12 | Hiperbólicas Inversas | 3 | ✅ Disponible |
| 13 | Trinomio Cuadrático | 3 | ✅ Disponible |
| 14 | Integración por Partes | 3 | ✅ Disponible |
| 15 | Volúmenes por Secciones | 3 | ✅ Disponible |
| 16 | Sólidos de Revolución | 3 | ✅ Disponible |

Cada módulo desarrollado tiene tres secciones, siempre en el mismo orden:

1. **Teoría** con las fórmulas renderizadas en KaTeX.
2. **Visualizador interactivo** con una gráfica de Plotly y sus controles.
3. **Ejemplos resueltos paso a paso**.

---

## Arquitectura

### Estructura de carpetas

```
/
├── index.html                  # Inicio: presentación, fases y tarjetas de los 16 módulos
├── README.md
├── assets/
│   ├── css/styles.css          # Estilos globales, variables CSS y media queries
│   └── js/
│       ├── modulos.js          # Lista única de los 16 módulos (fuente de verdad del menú)
│       ├── layout.js           # Encabezado, menú, pie, Anterior/Siguiente y render de KaTeX
│       ├── funciones.js        # Catálogo de funciones: f, F (antiderivada), LaTeX y dominio
│       ├── ejemplos-integrales.js # Catálogo de integrales indefinidas de los módulos 7-14
│       ├── antiderivadas.js    # Visualizador compartido f(x) y F(x) + C de los módulos 7-14
│       ├── metodos-numericos.js# Funciones puras: sumas de Riemann, trapecio, punto medio, Simpson...
│       └── visualizador.js     # Controles, validación, resultados y dibujo comunes (módulos 1-4)
├── modulos/
│   ├── 01-sumas-riemann/       # index.html (contenido) + script.js (visualizador)
│   ├── ...
│   ├── 06-integracion-directa/
│   ├── 07-sustitucion/         # index.html (usa antiderivadas.js, sin script propio)
│   ├── ...
│   ├── 14-integracion-por-partes/
│   ├── 15-volumenes-secciones/ # index.html + script.js (sólido 3D y suma de secciones)
│   └── 16-solidos-revolucion/  # index.html + script.js (discos, arandelas, cascarones en 3D)
└── pruebas/                    # Página que compara los métodos con los valores verificados
```

**Un módulo es una carpeta.** Cada carpeta tiene un `index.html` con el contenido y, si el módulo tiene visualizador, un `script.js`.

### Qué hace cada archivo JavaScript

| Archivo | Responsabilidad | ¿Toca el DOM? |
|---|---|---|
| `modulos.js` | Define el arreglo `MODULOS` (número, carpeta, nombre, fase, disponible). | No |
| `layout.js` | Inserta el encabezado con el menú, el pie de página y los botones Anterior/Siguiente, genera las tarjetas del inicio y renderiza las fórmulas con KaTeX. | Sí |
| `funciones.js` | Catálogo de funciones de ejemplo. Cada una trae `f`, su antiderivada `F`, su LaTeX y su dominio. Así **no se usa `eval()`**. | No |
| `metodos-numericos.js` | Funciones **puras**: reciben `f, a, b, n` y devuelven un número (`sumaIzquierda`, `sumaDerecha`, `puntoMedio`, `trapecio`, `simpson`, `valorExacto`, `errorAbsoluto`, `errorRelativo`, `parabolaPorTresPuntos`...). | No |
| `visualizador.js` | Partes compartidas por los visualizadores de los módulos 1 a 4: crear y leer los controles, validar los límites y el dominio, mostrar resultados y errores, llenar la tabla y dibujar con Plotly. | Sí |
| `ejemplos-integrales.js` y `antiderivadas.js` | El catálogo de integrales de los módulos 7 a 14 (cada una con su antiderivada verificada derivando) y el visualizador común que grafica f(x) y F(x) + C con la recta tangente. | Solo `antiderivadas.js` |
| `modulos/XX/script.js` | Lógica propia de cada módulo: decide qué figuras dibujar (rectángulos, trapecios, parábolas, áreas...). | Sí |

### Flujo de un visualizador

```
 Usuario mueve un control
          │
          ▼
 leerControles()        ← lee función, a, b y n, y los valida (dominio, a < b)
          │
          ▼
 funciones puras        ← trapecio(f, a, b, n), valorExacto(F, a, b), errorRelativo(...)
 (metodos-numericos.js)
          │
          ▼
 dibujarGrafica()       ← Plotly.react redibuja solo lo que cambió
 mostrarResultados()    ← aproximación, valor exacto, error absoluto y error relativo
```

Los cálculos están separados del dibujo. Por eso las mismas funciones se prueban solas en `pruebas/index.html`, que compara sus resultados con los valores verificados del enunciado.

### Cómo se genera el menú

`modulos.js` es la única lista de módulos. `layout.js` la recorre para construir:

- el desplegable **Módulos** del encabezado, que en celular se abre con el botón ☰,
- las **14 tarjetas** de la página de inicio,
- los botones **← Anterior / Siguiente →** al final de cada módulo.

Cada página indica en su `<body>` dónde está la raíz del sitio y qué módulo es:

```html
<body data-raiz="../../" data-modulo="3">
```

Con `data-raiz` todos los enlaces se construyen con **rutas relativas**. Es necesario porque GitHub Pages publica el sitio bajo `/<nombre-del-repo>/`, y las rutas absolutas como `/modulos/...` se romperían.

---

## Tecnologías y por qué

| Tecnología | Uso | Por qué |
|---|---|---|
| **HTML + CSS + JavaScript puro** | Todo el sitio | No necesita instalación, npm ni paso de *build*: los archivos se publican tal cual en GitHub Pages, y el código es fácil de leer y explicar. |
| **KaTeX** (CDN jsDelivr) + `auto-render` | Fórmulas matemáticas (`$...$` en línea y `$$...$$` en bloque) | Es mucho más rápido que MathJax y renderiza todo al cargar, sin parpadeos. |
| **Plotly.js** (CDN jsDelivr) | Gráficas interactivas | Trae zoom, desplazamiento y tooltips sin programarlos, y `Plotly.react` actualiza la gráfica en tiempo real al mover los controles. |
| **CSS Grid / Flexbox + media queries** | Diseño responsive | Se ve bien en celular, tablet y escritorio sin frameworks como Bootstrap. |
| **GitHub Pages** | Despliegue | Es gratis y publica directamente desde la rama `main`. |

---

## Ejecutarlo localmente

Las librerías se cargan desde un CDN, así que se necesita conexión a internet.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/araganio/calculo-integral.git
   cd calculo-integral
   ```
2. Sírvelo con un servidor estático, de cualquiera de estas formas:
   - **VS Code:** abre la carpeta y usa la extensión *Live Server* (clic derecho en `index.html` → *Open with Live Server*).
   - **Python:**
     ```bash
     python -m http.server 8080
     ```
     y abre http://localhost:8080
3. Para verificar los métodos numéricos abre http://localhost:8080/pruebas/.

---

## Cómo contribuir

### Agregar (o activar) un módulo

1. **Crea o ubica la carpeta** en `modulos/` con el formato `NN-nombre-en-minusculas`, por ejemplo `07-sustitucion`.
2. **Copia la plantilla.** Parte del `index.html` y el `script.js` de un módulo desarrollado, por ejemplo `05-integral-definida-area`. Mantén las tres secciones (Teoría, Visualizador, Ejemplos) y el `<body data-raiz="../../" data-modulo="N">`.
3. **Regístralo en `assets/js/modulos.js`:** cambia `disponible: false` por `true`, o agrega un objeto nuevo. El menú, las tarjetas y la navegación se actualizan solos.
4. **Si necesitas funciones nuevas**, agrégalas a `funciones.js` con su `f`, `F`, `latex` y `dominio`. Nunca uses `eval()`.
5. **Si agregas un método de cálculo**, escríbelo como función pura en `metodos-numericos.js`, con comentario JSDoc, y añade su caso a `pruebas/pruebas.js`.
6. Prueba la página a 375 px de ancho (vista de celular) antes de subirla.

### Convenciones

- **Idioma:** todo en español (interfaz, variables, funciones, comentarios y commits).
- **Nombres:** `camelCase` para variables y funciones (`calcularDeltaX`), `MAYUSCULAS` para constantes globales (`MODULOS`), `kebab-case` para carpetas y archivos (`metodos-numericos.js`).
- **Documentación:** comentario JSDoc en español en cada función (qué hace, `@param` y `@returns`).
- **Resultados** con 4 decimales (`formatearNumero`).
- **Commits** con el formato `tipo: descripción` en español:
  - `feat: módulo 7 sustitución con visualizador`
  - `fix: validación del dominio de ln x`
  - `docs: actualizar README`
  - `style: ajustes responsive del menú`

---

## Proceso de desarrollo y uso de IA

Como permite el enunciado, usé herramientas de inteligencia artificial (Claude / Claude Code) durante el desarrollo.

**Mi trabajo**
- Definí el proyecto a partir del enunciado, con apoyo de IA: los 14 módulos, las tres fases, las tecnologías y los ejemplos de cada módulo.
- Dirigí el desarrollo por etapas y revisé la plataforma y sus resultados.
- Estudié cómo funciona el código (métodos numéricos, gráficas y pruebas) para poder explicarlo.
- Creé el repositorio y publiqué la plataforma en GitHub Pages.
- Preparé la sustentación en video, incluida la explicación del ejercicio.

**Apoyo de la IA**
- Generó la base del código, los visualizadores y la documentación, y también la actualización que agregó los módulos 7 a 16 (hasta sólidos de revolución).
- Los resultados numéricos se verificaron con la página [`pruebas/`](pruebas/index.html) (34 de 34 coinciden con los valores esperados: los métodos numéricos, que F′ = f en las integrales de los módulos 7 a 14 y los volúmenes de los módulos 15 y 16).
