# FR eyewear studio 1.6.1

## Correcciones realizadas

La selección óptica componía el documento de fabricación para aceptar un cristal. Se sustituyó por la validación del frontal; se añadió una opción visible para adaptar el aro al elegir otro cristal o conservar el exterior y comprobar el encaje. Los 31 acabados ópticos se comprueban en el navegador contra el estado aplicado, no solo contra la miniatura.

El acabado del frontal y de ambos cristales se calcula en un Worker local, empaquetado también para escritorio offline. Una vista previa geométrica mantiene el frontal y las aberturas actualizados mientras termina el acabado. El cliente limita la cola a la última petición pendiente, descarta resultados obsoletos y la exportación GLB espera al último sólido. No se confunde la vista previa con el acabado exportado. Se reutilizan cálculos por contenido, se descartan reconstrucciones repetidas y se agrupan eventos por fotograma. La detección de intersecciones y de pared usa rechazo por cajas y distancias al cuadrado sin sustituir las pruebas de validez.

El editor conserva B-spline y añade Bézier con anclas y tangentes: grados/longitud, tangentes alineadas/simétricas/independientes, movimiento libre/horizontal/vertical/por ángulo, tramos rectos u oblicuos, división polinómica exacta y eliminación de nodos. Las tangentes son visibles y arrastrables. El suavizado compara la desviación máxima en mm y rechaza una reconstrucción que exceda la tolerancia. Se conservan las cajas dimensionales. El exterior puede congelarse punto por punto al pasar a edición independiente; ancho/alto ópticos escalan también las anclas y tangentes Bézier. Proyectos v7; lectura de v1–v6.

Wayfarer y tres Cat-eye incluyen referencias exteriores distintas de las aberturas. Se leyeron hitos del frontal del PDF sistemaFR.pdf, se reconstruyeron curvas y se integraron reservas mínimas de material sin recortar silenciosamente la apertura nominal. Cat-eye 2 conserva A51/B48/DBL17/frontal150/L125. Panto y Panto 2 diferencian pared inferior y ceja y corrigen el punto de partida del puente. Estos hitos y curvas son una reconstrucción de imágenes, no datos CAD originales ni certificación del fabricante.

La detección automática incorpora separación cromática para el Cat-eye rojo con cristales tintados, que fallaba por luminosidad. Se probaron las dos fotografías reales negra y roja de los PDF. La importación conserva la abertura calibrada como contorno óptico explícito. En el trazado manual se corrigió la transformación de coordenadas SVG, se añadió la línea de revisión y se puede deshacer o borrar. Se conserva el recorte, umbral y limpieza de trazos finos. No se infieren profundidad, puente ni herrajes de una foto.

El plano frontal sigue siendo ortogonal, con el conmutador de proyección deshabilitado en 2D. Se verifican cuatro vistas, medida, deshacer/rehacer, patrón desarrollado y dos hojas con frontal/cristales y brazos/lunetas.

## Evidencia local

113 pruebas unitarias aprobadas. Se añadieron pruebas de equivalencia B-spline/Bézier, división exacta, tramos rectos, traslación de tangentes, sólidos STL cerrados, conservación del exterior y correcta invalidación de cachés cuando cambia la entrada. Las expectativas anteriores sobre la modificación de pared se ajustaron para no exigir diferencias cuando la nueva pared coincide con el valor original.

Aceptación de navegador de Bézier: conversión, división exacta, recta, ángulo y longitud independientes, tangentes visibles, reapertura de proyecto v7 y acabado asíncrono. Aceptación de editor anterior: borrador sin cambios, pared mínima, proyecto v7 y GLB del último cambio dentro del mismo fotograma. Aceptación profesional: 25 bases en escritorio / 2 en web de clientes, cristales, medición, conformado y cotización. Aceptación CAD: cuatro vistas, invariantes geométricos y PDF de dos hojas para A4, Carta y Oficio. Importación: las fotografías reales negra y roja y el trazado asistido funcionan con A calibrado.

Comparación de respuesta en Chromium local con SwiftShader, mismo tamaño de ventana y cinco selecciones de cristal (221,222,231,341,354):

| Versión | Duración del manejador del control, ms | Mediana |
|---|---|---|
| 1.5.1 | 513, 402, 466, 584, 459 | 466 ms |
| 1.6.1 | 263, 168, 80, 85, 82 | 85 ms |

La reducción de la mediana es aproximadamente 82 %. Mide el bloqueo del control, no la terminación del acabado 3D ni garantiza 60 FPS. La primera selección es más costosa; el rendimiento depende del equipo y de la complejidad del perfil. El script `scripts/latency-acceptance.mjs` compara una compilación 1.5.1 en 3041 con la candidata en 3040.

## Publicación y alcance

La entrega completa incluye paquetes Windows x64, Linux amd64 y macOS Apple Silicon. La CI debe instalar/extraer/montar cada paquete, probar el funcionamiento offline y adjuntar hashes; se incorporará el recibo tras la ejecución. Misma autoridad de licencias, fuera del repositorio. Instaladores sin firma ni notarización; Intel pendiente. Solo software de ordenador.

La web de Miscante conserva dos bases (redondo/cuadrado) y controles; el estudio completo de 25 bases se distribuye para escritorio. `/fr/` público lleva al configurador de clientes. No se presenta como prueba web del estudio completo.

Se mantiene la necesidad de validar escala de impresión, tolerancias, ranura y herrajes con piezas físicas. Una foto calibrada no certifica exactitud metrológica ni encaje RB2140. No se afirma entrenamiento de un modelo de IA.

La prueba final local de Electron también ejercita conversión y división Bézier antes de importar una imagen. Resultado aprobado: WebGL, Worker local, Bézier, guardar/reabrir v7, GLB, STL y PDF de dos hojas; cero peticiones HTTP externas y cero errores. Se corrigió la espera del arnés para el primer sólido asíncrono; los controles pueden estar listos antes del acabado. Los Workers llevan versión en su URL para evitar mezclar una aplicación nueva con código de cálculo almacenado en caché.

La revisión 1.6.0 falló antes de generar el instalador: al actualizar la versión de la aplicación se alteró una dependencia transitiva del lockfile. Se restauró íntegro el árbol de dependencias de 1.5.1 y se cambiaron únicamente las dos versiones raíz. No se cambió el código funcional al crear 1.6.1.

La instalación limpia del lockfile corregido se verificó con `npm ci --prefix desktop-fr --ignore-scripts`: 293 paquetes instalados. Se desactivaron únicamente los scripts de descarga del binario para esta comprobación local; la CI ejecuta la instalación completa y prueba el binario instalado. El suavizado también se comprobó en navegador: desviación 0,045 mm bajo tolerancia 0,15 mm, A54/B41 conservados.
