# FR eyewear studio 1.7.1

## Causas verificadas y corrección

El método de movimiento comprobaba `source.outerSpline / opticalSpline` y retornaba antes de entrar en la rama Bézier. Los nodos se mostraban, pero el gesto nunca llegaba a modificar sus anclas. Se incluyen Bézier y el borrador en la selección de puntos. El gesto recibe una instantánea que conserva su origen durante todos los eventos del ratón, incluso después de confirmar el primer movimiento.

Las líneas de tangente también interceptaban clics sobre las anclas. Ahora no reciben eventos; las anclas tienen prioridad de hit-test y no se dibujan manejadores colapsados sobre el nodo. Los movimientos anteriores al pointerdown no se reutilizan al seleccionar: un clic selecciona y no desplaza.

## Edición directa

Clic y Shift para selección múltiple; marco para conjuntos y selección de tramo sobre su curva. Movimiento del conjunto conservando sus distancias; recto/curvo y suave/esquina aplicados a la selección; división exacta, eliminación de varios nodos (mínimo cuatro), rotación y escala en torno a la selección, distribución X/Y. Doble clic sobre un tramo inserta un nodo en ese lugar. Alt+arrastrar un nodo permite crear su tangente. Las tangentes también se editan por grados y longitud. El exterior y la abertura se editan por separado y el par se refleja.

Abrir edición prepara un borrador y mide la desviación real de reconstrucción sin cambiar el proyecto. La reconstrucción conserva segmentos rectos largos en lugar de convertir todo en B-spline. Bézier admite concavidades, con controles de cruce, cotas y pared; la protección convexa queda como opción de B-spline. Deshacer/rehacer agrupa cada arrastre y restaura los controles para seguir editando.

Wayfarer utiliza curvas y rectas declaradas por separado y bisagra en una altura revisada contra la foto. Tres bases originales de nombres genéricos añaden construcciones explícitas: Rectangular facetado, Hexagonal y Mariposa lineal. Son 28 bases en escritorio; la web Miscante conserva dos. Se mantienen las cotas nominales y se comprueban sólidos, paredes y cierres. No se afirma equivalencia a CAD original de marca.

## Referencias y marca

Se puede detectar un único cristal recortado, sin inventar DBL, o ambos. El usuario elige derecho, izquierdo reflejado o promedio; ya no se promedian ambos por defecto. El trazado manual admite cuatro a 64 puntos, rectas o curvas, arrastre de puntos y Alt+clic para eliminarlos. Cambiar puntos invalida el resultado previo hasta preparar de nuevo. Se corrigió el encuadre del área de imagen: altura limitada, coordenadas SVG reales y marcadores con tamaño visible.

La F invertida es un dibujo vectorial: estudio, cabecera, licencia e iconos. El texto accesible, nombre de archivo y producto de licencia siguen siendo FR eyewear studio para conservar compatibilidad.

## Verificación

118 pruebas unitarias aprobadas, incluidas conservación de rectas en reconstrucción, segmentos declarados, cotas independientes, 28 sólidos por pieza, un cristal sin DBL inventado y boceto de cuatro puntos. Pruebas reales de navegador con pointerdown/move/up: arrastre de varios fotogramas, Shift, marco, tramo, conjunto, tangentes, recto/curvo, clic sin movimiento, deshacer/rehacer y proyecto reabierto. La referencia se probó con un recorte real de Wayfarer, trazado de cuatro puntos y arrastre de marcador; también con las fotos negra y roja anteriores. Se verifican las cuatro vistas, dos hojas A4/Carta/Oficio, GLB y STL.

La prueba nativa offline ahora incluye explícitamente arrastre con ratón, además de teclado y división Bézier. Se registrarán los resultados de los paquetes y las descargas al publicarlos. Misma autoridad de licencias, conservada fuera del repositorio. Windows x64, Linux amd64 y macOS Apple Silicon; sin firma/notarización. Intel pendiente.

Las fotos no proporcionan profundidad ni ajuste mecánico certificado. Calibra A y verifica impresión, ranuras, tolerancias y herrajes con piezas físicas. No se certifica RB2140 ni se afirma entrenamiento de un modelo de IA.

Resultado nativo local final: aprobado, 28 bases, `directMouseEditing: true`, Worker local, proyecto v7, GLB, STL y PDF de dos hojas; cero errores y cero solicitudes HTTP externas. La prueba de referencias también aprobó el recorte real de un cristal y el arrastre manual, invalidando el resultado anterior. Se ajustó el repintado de tangentes al cambiar de nodo por teclado/desplegable y al insertar o eliminar, para no mostrar manejadores de otro nodo.

La revisión final elimina la precondición de suavizado B-spline al abrir selección directa. Se ajustan curvas por tramos, se conservan los segmentos rectos y se comprueban las 28 bases por ambos perfiles. El muestreo adaptativo conserva líneas exactas y limita la desviación de las curvas. Hasta 128 anclas Bézier; no se usa una B-spline global para redondear previamente los modelos facetados.

Se preparan los 56 perfiles de las 28 bases y se comprueba una desviación digital de reconstrucción inferior a 0,03 mm. El borrador se puede abrir aunque deba corregirse su pared: la geometría del proyecto no cambia y la confirmación de cada modificación conserva la validación completa. Rotación de 1°, escala 101 %, distribución X y eliminación múltiple se ejercitaron en pantalla sobre nodos de un tramo recto.
