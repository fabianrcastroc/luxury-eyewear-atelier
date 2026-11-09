# Verificación previa a publicar web y FR

Fecha: 9 de noviembre de 2026.

## Resultado y alcance

La web y FR se pueden publicar para diseñar, revisar geometría y preparar pruebas de taller. No se verificó el encaje físico de una luneta RB2140: faltan su contorno auténtico calibrado y la comprobación con la pieza real. Los archivos se identifican como patrones planos preliminares; no constituyen un plano completo de mecanizado ni una validación física de fabricación.

## Requisitos de esta conversación

- Web y software comparten correcciones; FR conserva repositorio local independiente y se aloja en `/fr/` del mismo despliegue web.
- Medidas de referencia aportadas: RB2140 50 □ 22. El botón establece A y DBL; no autentica ni sustituye el contorno pendiente.
- Stock editable de 2, 3, 4, 6 y 8 mm, independiente de la anchura radial del aro.
- Importación automática de fotos frontales o bocetos cerrados sobre fondo claro. El perfil se regulariza y se revisa antes de aplicar; la fotografía no proporciona profundidad ni metrología física exacta.
- Dos A4, sin ajuste automático: frontal y lunetas; ambos brazos desarrollados. Ambas hojas incluyen barra de 100 mm, cuadrado de 20 × 20 mm y marcas de alineación.

## Comprobaciones ejecutadas

- Web: 41 pruebas unitarias, cero fallos y cero omitidas.
- Software independiente: 38 pruebas unitarias, cero fallos y cero omitidas.
- Metrología 3D: 20 combinaciones de modelo y stock, examinando vértices del GLB, unidades, simetría, profundidad de frontal y patillas y estabilidad de cámara.
- Navegador sobre compilación estática: edición 2D/3D, medidas, stock, deshacer/rehacer, análisis en Worker, ambas entradas de fotografía, guardado/reapertura JSON, GLB y PDF real de dos páginas. Verificado también con base de publicación anidada `/fr/`.
- Regresión de catálogo y compra de demostración: aprobada. Revisión del diseñador: incluye comprobación visual de seis brazos distintos.
- Ocho PDF examinados con PyMuPDF, 16 páginas A4 en total: cero solapes de texto y trazos dentro de página. Barra: 99,998319 mm. Cuadrado: 19,999651 × 19,999684 mm. Los perfiles de 50 mm y el ancho frontal quedaron dentro de 0,003 mm del redondeo digital del navegador.

Estos valores comprueban la conversión digital de los polígonos actuales a papel; no miden una impresión física ni la diferencia entre el polígono y una luneta comercial.

## Correcciones de la revisión

Curvo ahora respeta A y DBL reales, pero se bloquea su patrón íntegro de acetato porque el 3D representa una estructura mixta. Los terminales frontales respetan la plancha seleccionada. Los apoyos nasales se identifican como laminados añadidos de 3 mm; los herrajes son ilustrativos. Los vaciados superpuestos, piezas desconectadas, abertura nasal insuficiente y piezas fuera del área útil se rechazan con una corrección concreta. Las patillas anchas se comprueban por su desarrollo real, no solamente por el ancho de entrada.

## Para autorizar una pieza definitiva en el taller

Hace falta comprobar el contorno auténtico de luneta, su alojamiento y bisel/ranura, bisagras y perforaciones, tolerancias de las herramientas, conformado y contracción del acetato, además de medir una impresión física de la calibración en ambos ejes. No se inventaron valores universales para estos parámetros ni se marcaron como resueltos mediante una casilla de usuario.
