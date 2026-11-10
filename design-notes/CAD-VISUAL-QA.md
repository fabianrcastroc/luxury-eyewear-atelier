# Inspección independiente del espacio CAD

La revisión contrasta el editor ejecutado con el PDF de nueve páginas, no solamente con el número de pruebas.

## Evidencia visual

Se abrió la compilación estática, incluida su entrada anidada `/fr/`, en Chromium con WebGL. Capturas de la ronda de revisión en `/tmp/cad-acceptance/`: `perspective.png`, `four-views.png`, `front.png`, `side.png`, `mobile320.png`.

El espacio nuevo muestra barra de menús y herramientas, explorador de seis componentes, panel de propiedades numéricas, cuatro vistas, navegación y medición. Frente unido y cantos redondeados sustituyen los aros y puente de bloques separados; los brazos muestran material opaco y las lunetas nasales se sitúan detrás de la zona nasal. Esta observación no equivale a certificar que replique FrameMaker ni a comprobar encaje real de herrajes o fabricación.

## Defectos identificados durante la inspección

1. El despliegue FR omitía `cad-workspace.css`: el editor aparecía sin su estructura visual. Se informó al integrador para corregir el empaquetado.
2. Los controles de pared y posición del puente no tenían efecto y mostraban un valor fuera de su propio rango; se solicitaron retirar en vez de presentar herramientas sin función.
3. Las vistas nominales frontal y lateral conservaban proyección perspectiva. Se solicitaron cámaras ortográficas para esas vistas.
4. La etiqueta A/DBL del dibujo usaba las medidas base en vez de la apertura realmente resultante después de variar la pared interior.
5. El menú desbordaba el documento a 396 px en una pantalla de 320 px. El menú debe adaptarse sin ocultar controles fuera de pantalla.
6. La barra inferior heredaba estilos del pie de la web, y el estado inicial de retícula no coincidía con el renderizador.
7. La línea de comando de la herramienta Medir calculaba la distancia entre el segundo punto y él mismo; el dibujo sí calculaba la distancia correcta. Se solicitó coherencia entre ambas lecturas.
8. Se señaló la necesidad de conservar la geometría de proyectos antiguos sin `wallMode` mediante migración explícita, en vez de reinterpretarlos silenciosamente con otro modo de pared.

## Comprobación reproducible

`scripts/cad-acceptance.mjs` abre la aplicación real y comprueba que la hoja de estilos carga, que existen explorador y herramientas, que variar la pared interior conserva exterior y anclajes, que las cajas de bisagra corresponden al modo seleccionado, que las zonas nasal y temporal se editan, que hay cuatro proyecciones, que los nodos se pueden deshacer y rehacer y que la medición informa el mismo valor en dibujo y comando.

La salida exige exactamente dos páginas en A4, Carta y Oficio: frontal y dos lunetas nasales en la primera, ambos brazos en la segunda, sin añadir por defecto discos de cristal. Se comprueba además la descarga del proyecto y los límites horizontales móviles. Las comprobaciones de geometría digital no sustituyen medir una impresión física ni validar la ranura, la bisagra y las operaciones del taller.

Ejemplo de ejecución sobre una compilación estática servida localmente:

```sh
CAD_URL=http://127.0.0.1:3035 CAD_PAGE=/fr/ node scripts/cad-acceptance.mjs
```

La primera ronda funcional llegó hasta las comprobaciones móviles: estructura y exportación funcionaban, pero el desbordamiento impedía aprobarla. Las rondas posteriores deben registrarse con la versión efectivamente recompilada después de los arreglos.

## Ronda de aceptación posterior a los arreglos

La ejecución sobre FR compilado terminó con código 0. Pasaron las comprobaciones de hoja de estilos, explorador, herramientas, conservación de exterior y bisagra al variar la pared, modificación de apertura interior, bisagra oculta/con caja, zonas nasal y temporal, cuatro vistas, selección y ocultación de capas, edición reversible por nodos, medición real entre dos puntos, terminales, guardado y anchos de 320/390/768 px.

Se imprimieron realmente los tres papeles. PyMuPDF verificó dos páginas por archivo y el rótulo «LUNETAS NASALES» en la primera. Barra de 100 mm: A4 99,998321 mm; Carta 99,999989 mm; Oficio 99,999994 mm. Los cuadrados de 20 × 20 mm quedaron dentro de 0,00035 mm de la dimensión digital. Esto mide la conversión del navegador al PDF, no una impresión física. Archivo de evidencia local: `/tmp/cad-acceptance/pdf-independent-metrology.json`.

Las capturas muestran cantos redondeados y un frente continuo, sin las cajas flotantes exteriores del prototipo inicial. Las vistas nominales ahora usan proyección ortográfica. La geometría sigue siendo un modelo paramétrico poligonal: esta revisión no certifica equivalencia con un núcleo industrial de CAD, una luneta comercial auténtica ni el ajuste de un herraje real.


## Revisión 10 de noviembre: puentes, nasal y terminales

Capturas inspeccionadas: comparativa frontal 4×3 puentes; seis perfiles de brazo; modelo 3D frontal/lateral/perspectiva y editor de cuatro vistas. La silla clásica tiene hombros y concavidad inferior; la herradura abre una bóveda; el doble conserva dos barras y ventana. Las curvas distales son continuas y el afinado de espesor evita terminales sobredimensionados de stock completo.

Aceptación ejecutada sobre dist/fr con WebGL real: 63 pruebas unitarias; matriz GLB de 20 modelos/stock; edición y exportación real a tres PDF de dos hojas. Los datos calculados de zona nasal son cotas del modelo, no una recomendación clínica o antropométrica.
