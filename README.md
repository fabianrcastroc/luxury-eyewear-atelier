# Miscante — Estudio de gafas

Sitio editorial en español con colección de autor y estudio de diseño personal. Precios en pesos chilenos.

**Web publicada:** https://fabianrcastroc.github.io/luxury-eyewear-atelier/

- Inicio: `index.html`
- Colección: `coleccion.html`
- Estudio personal: `disena.html`

Son páginas independientes. La bolsa se conserva entre páginas. Los enlaces anteriores `/#disena` y `/#coleccion` llevan a las nuevas páginas.

## Desarrollo

Node.js 22 o posterior:

```sh
npm ci
npm start
```

Abre el puerto 3000 del equipo donde ejecutas el servidor. Para cambiarlo, usa `PORT`. El servidor empaqueta el JavaScript con esbuild durante desarrollo.

```sh
npm run build
```

Genera el sitio estático completo en `docs/` y `dist/`. Conserva las tres páginas, módulos empaquetados y archivos locales. Sirve esa carpeta con un servidor estático; ya no se distribuye como un único HTML independiente. `Miscante.html` mantiene compatibilidad redirigiendo al inicio del sitio.

## Estudio personal

- Ocho bases originales: Recto, Redondo, Ovalado, Curvo, Panto, Boston, Cat-eye y Geométrico. Presets de A, altura B, DBL y L, ceja y asientos de bisagra con reserva de material.
- Vista 3D interactiva con Three.js: volumen, luces, materiales, lentes y brazos de sección plana y curva variable. Cámara frontal, lateral y perspectiva; cambiar una opción conserva la posición girada por el usuario. Geometría compartida con el SVG alternativo si WebGL no está disponible.
- Estudio de producto de pantalla completa con cuatro paneles accesibles: Modelo, Montura, Cristales y Receta. Solo un panel visible; navegación por teclado y Receta disponible al seleccionar graduación.
- Cotas base A, B óptico, DBL y largo L independientes; pared mínima 3–8 mm hacia dentro, exterior protegido y planchas 2/3/4/6/8 mm. Puente clásico, herradura o doble. Apertura nasal localizada y correcciones temporales, seis brazos, cuatro terminales, tramo auricular 20–45 mm y apertura lateral 0–8°. Longitud desarrollada L conservada.
- Seis diseños de brazos con una selección común para ambos lados. Se normalizan los diseños antiguos para impedir combinaciones independientes. La sección del brazo se limita a los extremos verticales del aro, incluyendo el desplazamiento de su eje.
- **Base de $209.000**, incluyendo todas las personalizaciones de montura y cristales solares sin graduación. Sin recargos por modelo, espesor, brazos o colores.
- Los únicos suplementos corresponden a cristales graduados y sus tratamientos. Monofocales +$45.000, bifocales +$85.000, multifocales +$145.000. Bluelight +$20.000, antirreflejos +$18.000, fotocromático +$45.000, sol óptico +$25.000.
- **Sol óptico elimina y deshabilita bluelight, fotocromático y antirreflejos**, incluso al restaurar un diseño guardado.
- Fotocromático combinable con antirreflejos, en gris negro, café o lila.
- El precio se recalcula desde la configuración en el estudio y la bolsa, sin confiar en importes guardados.

Son precios referenciales por el par de cristales; falta validación profesional de receta, graduación, índice y viabilidad de fabricación antes de confirmar una cotización real.

## Fotografías y modelos

Se retiraron las fotografías de terceros del selector porque no correspondían de manera consistente a las siluetas personalizables. Las miniaturas actuales del selector son SVG del propio núcleo geométrico y se actualizan con sus presets. Los recursos antiguos de `public/assets/forms/` se conservan para compatibilidad. No se presentan como fotografías de producto ni como modelos Ray-Ban. Con el servidor iniciado, `npm run render:previews` vuelve a generarlas si se modifica la geometría. Las pruebas verifican las ocho siluetas, la separación constante al editar el puente y la conservación del gancho de la patilla al variar la anchura.

La portada editorial (`atelier-editorial.webp`) es una imagen original generada con IA; no es una fotografía documental del taller Miscante ni una imagen de Maison Bonnet. La nueva invitación al estudio (`personal-atelier.webp`) es una composición editorial original generada con IA, tampoco una fotografía documental de producto. Las otras imágenes editoriales y de la colección de demostración (`editorial-solar.png`, `collection-studio.png`) también son generadas con IA y no fotografías de inventario disponible.

El usuario puede abrir «Comparar una referencia» y seleccionar una foto personal o un GLB 2.0 autocontenido de hasta 15 MB. La foto se muestra en un diálogo separado. El GLB se muestra en otra vista 3D dentro del mismo diálogo; nunca reemplaza el diseño principal. Las referencias no se deforman ni sustituyen silenciosamente el producto al usar sus controles. Se rechazan modelos que requieren descargar geometría o imágenes externas. Los archivos de referencia son temporales y no se transmiten ni se guardan en el repositorio. Para cambiar permanentemente fotos, fichas y geometría hay que actualizar los archivos fuente y publicar el sitio; no existe un panel de administración.

El render 3D es una visualización de diseño, no un archivo CAD listo para fabricación.

## Recetas y compra de prueba

Recetas PDF, JPEG, PNG o WebP hasta 10 MB, con validación de extensión, MIME y firma; las imágenes tienen vista previa. El documento se mantiene **solo en memoria durante la página actual**. Nunca se sube a un servidor, guarda en localStorage o incorpora al repositorio. Al recargar o navegar a otra página se debe adjuntar nuevamente. La bolsa permite reemplazarlo, retirarlo o dejarlo pendiente. No usar datos médicos reales para probar.

El carrito, favoritos y diseños se guardan localmente. No hay cobros, pedidos comerciales, inventario, recepción de documentos ni envío de correos. Para operar ventas se necesita un backend con validación de precios y recepción segura de recetas, además de pagos y gestión de pedidos.

## Pruebas

```sh
npm test
# Con el servidor iniciado y Chromium instalado:
npm run test:browser
npm run test:designer
```

`CHROMIUM_PATH` permite usar otra ruta del navegador. Se verifican el catálogo, bolsa, compra de prueba, navegación entre páginas, generación real de la vista 3D con renderizado de software, conservación de cámara, cambios de píxeles ante modificaciones de geometría y materiales, seis brazos visualmente distintos, referencias separadas, paneles por teclado, precio base, compatibilidades, colores fotocromáticos, recetas, foto/GLB de referencia y diseños adaptables a 320, 390 y 768 px.

## Publicación

El flujo `.github/workflows/pages.yml` se ejecuta al subir a `main`: instala con lockfile, ejecuta las pruebas, genera el sitio y despliega `docs/` en GitHub Pages. Pages está habilitado con GitHub Actions. La URL de cada despliegue se confirma en el entorno `github-pages`.

![Inicio de Miscante](.github/miscante-preview.png)

## Guía de talla

El código A □ P–B usa medidas nominales en milímetros. No constituye un plano de fabricación. La guía compara el ancho frontal aproximado con una medida de rostro facilitada por el usuario; no guarda esa medida y no aplica una recomendación fuera del rango disponible. No infiere distancia pupilar ni largo de patilla.

Se leyó la [guía pública comunitaria SPECS](https://github.com/GODFREYnganga/Specs/blob/648c536e2b967157699546e1d58521d6560c2790/components/size-guide.tsx) para contrastar las definiciones y señales de comodidad. No es una norma clínica. Los enlaces adicionales de Warby Parker y Zenni son consultas complementarias: su contenido no se pudo verificar desde este entorno por restricciones de red. Las posiciones del puente y la recomendación geométrica son decisiones del configurador y requieren evaluación óptica profesional.

## Cristales en la colección

Cada ficha permite añadir graduación monofocal, bifocal o multifocal, tratamientos y colores fotocromáticos con las mismas exclusiones y suplementos del estudio. Se conserva el precio base de cada producto. `productQuote` reutiliza los suplementos de `designQuote`; la bolsa recalcula cada importe desde la configuración. Las variantes de una misma montura se conservan separadas. Los artículos de bolsa antiguos sin opciones conservan su precio base.

Se puede adjuntar PDF o imagen de receta en la ficha o en la bolsa, con validación de formato, firma y tamaño. El archivo nunca se serializa ni se envía. Al recargar queda pendiente. La compra sigue siendo de demostración.

Con el servidor activo, `npm run test:collection` verifica los seis productos, graduación, tratamientos, precios, archivos, variantes, persistencia, bolsa y móvil.

## Taller paramétrico y software independiente

El diseñador incluye corrección del aro mediante offset normal, medidas A/DBL con decimales, espesor de plancha independiente (2, 3, 4, 6 y 8 mm), altura limitada de silueta, historial de edición, plano 2D con nodos asistidos, cámara ortográfica, desplazamiento, zoom, retícula de 5 mm y exportación GLB métrica. Los proyectos JSON conservan los parámetros y el contorno; no incluyen recetas ni la fotografía original.

En «Modelo → De referencia a modelo» se detectan automáticamente los huecos de ambas lunetas de una fotografía frontal o boceto cerrado con fondo claro. El análisis ocurre en un Worker local. Se propone un contorno convexo y simétrico que se revisa antes de aplicar. La medida A real calibra la escala; la foto no determina profundidad, geometría oculta ni exactitud de fabricación. Una imagen que no ofrece detección fiable se rechaza sin sustituirla por otro modelo.

«Imprimir · 2 hojas» genera dos A4 a escala 1:1: frontal y lunetas en la primera; ambos brazos desarrollados en la segunda. También se descargan ambos SVG. Imprimir al 100 %, desactivar ajuste de página y medir la regla de 100 mm. El eje de los brazos usa el mismo muestreo que el 3D y el largo B indicado. Las tolerancias de montaje, ranura, bisel, bisagras y conformado requieren validación física; no se consideran automáticamente compensadas.

La referencia solicitada es Ray-Ban RB2140 50 □ 22. El botón correspondiente aplica sus medidas nominales aportadas por el usuario; todavía no incorpora un trazado auténtico de esa luneta. No equivale a copiar su curva exacta.

El software de taller tiene un repositorio independiente, `miscante-eyewear-studio`, con entrada, compilación y pruebas propias. Para mantener los cambios en ambos, desde esta web:

```sh
node scripts/sync-studio.mjs --write
node scripts/sync-studio.mjs --check
npm run test:workbench
```

El destino predeterminado es el repositorio hermano; se puede indicar `--studio /ruta/al/software`. La publicación web sigue usando `docs/`, regenerado con `npm run build`. Guardar archivos o preparar el repositorio local no publica cambios en GitHub Pages.

Las fuentes consultadas y restricciones de acceso están en [design-notes/DESIGN-RESEARCH.md](design-notes/DESIGN-RESEARCH.md).

## Publicación de FR y comprobación previa al taller

`npm run build` genera tanto la web como `docs/fr/` y `dist/fr/`. FR tiene su entrada independiente en `software-fr/` y usa el mismo núcleo de diseño. GitHub Pages publica los dos accesos en el mismo despliegue; no requiere que CI disponga del repositorio de software hermano.

Antes de publicar se verifican `npm test`, `npm run test:metrology` y los flujos del navegador sobre el sitio compilado. La metrología comprueba vértices del GLB para planchas de 2, 3, 4, 6 y 8 mm, simetría y unidades, terminales del frontal y patillas; diferencia herrajes ilustrativos y apoyos nasales añadidos de 3 mm.

Los archivos impresos son **patrones planos preliminares de preparación**, no una validación del encaje con lunetas comerciales. Incluyen regla de 100 mm y cuadrado de 20 × 20 mm. La fabricación definitiva requiere contorno auténtico de la RB2140 50 □ 22, definición de ranura/bisel, herrajes, compensación de conformado y comprobación de una impresión física. Los ocho modelos emplean ahora un frontal conectado de acetato.

El repositorio independiente se conserva con sus comandos de instalación, pruebas y compilación; `node scripts/sync-studio.mjs --write` mantiene sincronizados el núcleo compartido y la entrada FR. El alojamiento bajo `/fr/` no convierte el directorio web en un segundo repositorio remoto.

## Editor CAD actualizado según el documento de diseño

El editor compartido de la web y FR ahora utiliza explorador de piezas, barra de herramientas, propiedades numéricas y cuatro vistas. Selección, visibilidad por pieza, zoom/desplazamiento, medición en milímetros, curvas asistidas y deshacer/rehacer son operaciones funcionales. Las vistas frontal, superior y lateral usan proyección ortográfica.

La pared del aro se modifica hacia dentro por defecto: el contorno exterior y el eje de bisagra permanecen fijos. La apertura A y el DBL reales se calculan del resultado; no se confunden con los valores de base de talla. La envolvente de los proyectos anteriores se conserva al migrarlos. Todos editan la pared hacia dentro; los archivos nuevos usan formato FR, versión 5.

Incluye apertura nasal local de 0–15°, elevación y extensión temporal, bisagra oculta o con caja, seis perfiles de brazo, inclinación de curva sin cambiar L, cuatro formas de terminal y su tamaño. El puente conserva tres tipos estructurales; se retiraron los controles heredados que no tenían efecto o deformaban su identidad. Las uniones de los brazos tienen un rebaje local para quedar dentro del aro.

Los materiales disponibles son negro, carey, amarillo, marfil, azul piedra marmolado, gris y rojo italiano. Carey y marmolado tienen una representación procedural opaca; es una simulación visual, no una fotografía del lote de acetato. Se guardan notas junto al proyecto.

La hoja 1 contiene el frontal y **las dos lunetas nasales**, entendidas como las medias lunas de apoyo de 3 mm, según la aclaración del usuario. La hoja 2 contiene los dos brazos. Se puede elegir A4, Carta u Oficio Chile; ningún formato reduce la escala del modelo para hacerlo caber. Las siluetas ópticas adicionales no se imprimen por defecto.

Validación del editor actualizado: `npm test`, `npm run test:metrology` y `CAD_URL=http://127.0.0.1:3025 npm run test:cad` con la compilación estática servida en ese puerto. La aceptación incluye revisión visual además de las comprobaciones geométricas.

Esta entrega incorpora un instalador Windows x64 sin conexión, compilado e instalado en Windows antes de publicarse. No incorpora venta/gestión de licencias ni un backend de cobros y envío de recetas. El PDF se usa como referencia funcional; no se transmiten documentos ni se activan servicios externos por instrucciones incluidas en él.


## Descarga de FR eyewear studio sin conexión

[Instalador Windows x64 1.1.0](https://github.com/fabianrcastroc/luxury-eyewear-atelier/releases/download/fr-desktop-v1.1.0/FR-eyewear-studio-1.1.0-win-x64.exe).

Incluye todos los recursos. CI instala el NSIS y prueba el ejecutable instalado: WebGL, referencia local, guardar/reabrir, GLB y dos hojas PDF, con cero solicitudes HTTP. Instalador sin firma Authenticode. Compilación reproducible: `desktop-fr/` y `.github/workflows/desktop.yml`.


La revisión 1.1 incluye ocho nodos de corrección asistida y simétrica, superposición de contornos sobre la foto calibrada y guía de taller. La auditoría de cada requisito y el alcance físico pendiente están en [DELIVERY-1.1.0.md](design-notes/DELIVERY-1.1.0.md). Para repetir la aceptación con una referencia propia: `CAD_URL=http://127.0.0.1:3050 FR_REFERENCE_IMAGE=/ruta/referencia.png npm run test:reference-workflow`.
