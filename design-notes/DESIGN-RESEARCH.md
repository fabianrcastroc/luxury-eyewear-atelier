# Criterios del estudio digital de gafas

Investigación realizada el 9 de noviembre de 2026. Este documento separa las fuentes verificadas, los criterios de diseño derivados y las comprobaciones pendientes. Se guarda fuera de `docs/` porque esa carpeta se regenera al compilar el sitio.

## Fuentes realmente consultadas

La política de red de esta sesión bloqueó las conexiones HTTPS a `frame-stock.com`, `www.rhino3d.com` y al chat compartido de `chatgpt.com` con `CONNECT tunnel failed, response 403`. No se pudo inspeccionar el Maker de Frame Stock ni recuperar el contexto del chat. La solicitud de ampliación de dominios no tuvo guardado confirmado por el servicio de configuración. Por tanto, no se atribuyen a Frame Stock prestaciones, capturas ni decisiones técnicas que no se pudieron observar.

Se consultó el código fuente oficial de la documentación de McNeel en [mcneel/developer.rhino3d.com](https://github.com/mcneel/developer.rhino3d.com), revisión `0488468f3b4f3223028cb30274ecdac31932cdf6`, recuperado mediante HTTPS con verificación TLS. El README confirma que ese repositorio contiene el sitio `developer.rhino3d.com`. Estas fuentes permiten revisar conceptos y contratos técnicos de Rhino; no constituyen una prueba interactiva de Rhino instalado.

| Fuente oficial revisada | Evidencia útil | Aplicación al estudio óptico |
| --- | --- | --- |
| [NURBS Geometry Overview](https://github.com/mcneel/developer.rhino3d.com/blob/0488468f3b4f3223028cb30274ecdac31932cdf6/content/en/guides/opennurbs/nurbs-geometry-overview/index.md) | Grado, puntos de control, nudos y regla de evaluación definen una curva; variar puntos o nudos puede cambiar su continuidad. | La silueta debe tener un estado geométrico estable, separado de la malla de visualización. Cambiar material o espesor no debe redibujar arbitrariamente la apertura del cristal. |
| [Getting the Units of the Active Document](https://github.com/mcneel/developer.rhino3d.com/blob/0488468f3b4f3223028cb30274ecdac31932cdf6/content/en/guides/cpp/getting-units-of-active-document/index.md) | Existen unidades del modelo y de página independientes, además de unidades y tolerancias del documento. | Mantener milímetros explícitos y una conversión única entre geometría, vista y papel. Una vista que parece correcta no demuestra escala física. |
| [Offsetting Curves on Surfaces](https://github.com/mcneel/developer.rhino3d.com/blob/0488468f3b4f3223028cb30274ecdac31932cdf6/content/en/guides/cpp/offsetting-curves-on-surfaces/index.md) | El offset recibe tolerancia absoluta; unir y extender curvas son operaciones explícitas posteriores. | Un aro no se obtiene escalando por separado X e Y. Debe derivarse de una separación geométrica controlada, comprobar cierres e intersecciones y conservar el cristal. La fuente trata curvas sobre superficies, no certifica el algoritmo 2D propio. |
| [Calculating Lengths of NURBS Curves](https://github.com/mcneel/developer.rhino3d.com/blob/0488468f3b4f3223028cb30274ecdac31932cdf6/content/en/guides/cpp/calculating-lengths-of-nurbs-curves/index.md) | La longitud se evalúa sobre la curva con una tolerancia; no se identifica con distancia entre extremos. | El largo nominal de patilla debe contrastarse con la longitud desarrollada del eje. Una proyección lateral o distancia en Z no basta. |
| [Creating Linear Dimensions](https://github.com/mcneel/developer.rhino3d.com/blob/0488468f3b4f3223028cb30274ecdac31932cdf6/content/en/guides/opennurbs/creating-linear-dimensions/index.md) | Una cota tiene plano, estilo, posición, texto y puntos geométricos de referencia. | Las cotas deben calcularse desde los contornos exportados; no escribir valores nominales que no coincidan con la geometría. |
| [Add Layout](https://github.com/mcneel/developer.rhino3d.com/blob/0488468f3b4f3223028cb30274ecdac31932cdf6/content/en/samples/rhinocommon/add-layout/index.md) | Define página en mm, proyección de detalle, escala explícita y bloqueo de proyección. El ejemplo usa 1:10, no 1:1. | La impresión solicitada exige páginas físicas fijas, proyección ortogonal y escala 1:1, sin ajuste automático al papel. |
| [Custom Undo Events](https://github.com/mcneel/developer.rhino3d.com/blob/0488468f3b4f3223028cb30274ecdac31932cdf6/content/en/guides/cpp/custom-undo-events/index.md) | El estado del complemento se integra en transacciones de deshacer/rehacer. | Cada edición, importación o cambio de modelo debe ser reversible. Una operación fallida no debe destruir el diseño anterior. |
| [In-Viewport User Interface](https://github.com/mcneel/developer.rhino3d.com/blob/0488468f3b4f3223028cb30274ecdac31932cdf6/content/en/guides/general/rhino-ui-system/in-viewport-ui/index.md) | Describe controles junto al objeto, grips restringidos a curvas/líneas/arcos, puntos de snap y entradas numéricas. | Priorizar correcciones restringidas, valores visibles y respuesta directa. Esta página indica **Rhino 9** y estado de documentación en progreso; no debe presentarse como comportamiento verificado de Rhino 8. |

## Contrato de geometría para gafas

El estudio necesita un único modelo compartido por web y software. Debe separar apertura de cristal, material del aro, puente, apoyos nasales, bisagras y patillas. Cada opción tendrá una unidad y efecto concreto. El contorno de cristal se conserva al modificar espesor, color, brazos o relieve nasal. La simetría se aplica por reflexión geométrica; no se aproximan dos lados con fórmulas distintas. El DBL declarado en la talla debe coincidir con la separación de las cajas horizontales de ambos cristales.

El perfil exterior del aro deriva del interior mediante offset; una ampliación radial o escalado anisotrópico cambia el espesor en las esquinas y puede producir deformaciones visuales. Deben probarse combinaciones extremas de talla, silueta, espesores y puente. Las comprobaciones incluyen coordenadas finitas, orientación, área positiva, ausencia de cruces y de solapamiento entre aros, continuidad del puente y conservación de la apertura. Los límites usados por el programa son límites geométricos del diseño; no deben atribuirse a una norma óptica si no se dispone de esa norma.

Hay una diferencia entre una malla Three.js, un contorno poligonal en SVG y una superficie NURBS/B-rep. Comparten coordenadas cuando se diseñan así, pero ninguna conversión los vuelve equivalentes automáticamente. La aplicación no incorpora el motor de Rhino por adoptar su organización de herramientas. La compatibilidad futura con Rhino requiere formatos geométricos y unidades comprobadas, sin anunciar exportación CAD de fabricación que todavía no exista.

## Flujo de trabajo que debe ofrecer la interfaz

1. **Proyecto:** abrir, guardar, exportar e importar el estado; historial de deshacer y rehacer; identificación de unidades y talla. Evitar que una fotografía, receta o archivo personal termine en el repositorio o se envíe inadvertidamente.
2. **Referencia:** seleccionar foto frontal o boceto, analizar automáticamente y mostrar el resultado. Solicitar una medida conocida para calibrar. Presentar diagnóstico cuando la imagen no permite reconocer el contorno. El trazado manual no debe ser requisito inicial.
3. **Modelo:** generar contornos simétricos compartidos entre 2D y 3D. Permitir correcciones posteriores dentro de límites, conservar una copia del resultado automático y ofrecer restablecer o deshacer.
4. **Navegación:** giro, zoom y encuadre, vistas frontal/lateral/perspectiva y dibujo 2D; controles activos visibles, atajos documentados y paneles accesibles por teclado. La cámara no debe saltar al modificar una dimensión o color.
5. **Inspección:** valores numéricos junto a controles, cotas derivadas de la geometría, contornos/guías diferenciados, estado de validación y errores concretos. Una entrada inválida conserva el último estado válido.
6. **Salida:** exactamente dos hojas a escala 1:1 con calibración física. La vista 3D se usa para revisar forma y volumen; la plantilla plana se usa para medir y transferir trazos.

Los paneles por componentes, la edición restringida y las operaciones reversibles son criterios derivados de las fuentes y del uso artesanal solicitado. No se afirma que sean una reproducción de Frame Stock.

## Foto o boceto: automatización y exactitud

Una sola foto no determina espesor, curvatura frontal, escala física, profundidad del puente, bisagras ni deformación por perspectiva. El programa puede detectar siluetas y proponer un modelo; para obtener milímetros necesita al menos una dimensión real conocida y una referencia aproximadamente frontal. Esa calibración debe verse en pantalla antes de imprimir.

El análisis debe trabajar a resolución acotada, detectar regiones y aberturas de contraste, regularizar el ruido y rechazar contornos que se crucen o no se parezcan a una luneta válida. Debe indicarse qué se extrajo y qué se generó mediante parámetros. Si no reconoce el objeto, se conserva la foto y el modelo anterior; no se transforma un fondo o una sombra en una montura aparentemente válida. Las correcciones asistidas deben mantener cierre, simetría y espesor mínimo geométrico. Hace falta validar por separado fotos reales con cristales transparentes, oscuros, reflejos, manos y fondos complejos; una prueba con boceto sintético no demuestra cobertura de esos casos.

## Dos hojas para el taller

**Hoja 1:** frontal completo, contornos de las dos aberturas de cristal y lunetas separadas, con indicación de izquierda/derecha, ejes y cotas A, altura de apertura, DBL y ancho frontal. Las lunetas reproducen el perfil nominal del cristal; la ranura/bisel y su compensación requieren datos de fabricación adicionales.

**Hoja 2:** ambos brazos identificados y sus perfiles de corte desarrollados, largo del eje y cotas de anchura, con información de dónde empieza el tramo destinado al curvado. Una proyección de una patilla curva no es automáticamente su desarrollo plano. Debe declararse el método de desarrollo y comprobar su longitud.

Ambas hojas deben tener página física A4, unidades milimétricas, barra de 100 mm y cuadrado de control. Imprimir a tamaño real/100 %, desactivar encabezados y pies del navegador y comprobar la barra con regla. No reducir silenciosamente una pieza para que quepa. La geometría fuera del área útil produce un error accionable.

La precisión numérica del archivo y la precisión del taller son comprobaciones distintas. Antes de cortar acetato se deben verificar impresora, espesor de plancha, bisagra, ranura/bisel, herramienta, contracción/curvado y holguras. Estos datos no se deducen de una imagen y no tienen valores profesionales universales que se puedan inventar. La primera pieza debe ser una prueba calibrada.

## Aceptación y trabajo pendiente de referencia

- Probar regresión geométrica en todas las tallas y siluetas, con extremos de controles y contornos importados.
- Probar navegador: importar imagen, obtener contorno sin trazado inicial, corregir, deshacer/rehacer, guardar/reabrir, cambiar vistas y exportar sin alterar la cámara.
- Generar un PDF real mediante impresión automatizada y comprobar que tiene dos páginas A4, que los trazos caben y que la conversión mm/puntos conserva la escala; después comprobar una impresión física.
- Mantener web y repositorio separado sincronizados con un procedimiento reproducible y comprobación de equivalencia del núcleo compartido.
- Completar revisión interactiva de Frame Stock y Rhino cuando el entorno permita sus dominios. Falta comparar navegación real, herramientas de edición, transiciones, importaciones y formatos de salida; no dar esa evaluación por realizada.
- Recuperar el contenido del chat compartido cuando sea accesible o se facilite como texto. Su contenido no se ha usado para inferir requisitos ocultos.

## Referencia solicitada: Ray-Ban RB2140, talla 50 □ 22

El usuario especificó el modelo **RB2140** y las medidas nominales **A = 50 mm** y **DBL = 22 mm**. Estos datos se registran como aportados por el usuario. En esta sesión no se recuperó una ficha técnica del fabricante que los confirme para una variante concreta, ni un trazado auténtico de luneta.

Se intentó consultar por HTTPS, sin desactivar TLS ni el proxy, la página de producto de Ray-Ban y páginas de venta o recambio de lentes. Los siguientes destinos devolvieron `CONNECT tunnel failed, response 403` o respuesta 403 y no pudieron usarse como evidencia del contorno:

- `www.ray-ban.com`: ruta de producto RB2140 Original Wayfarer y portada.
- `www.framesdirect.com`: página RB2140 Original Wayfarer.
- `www.revantoptics.com`: ruta de recambios RB2140 Original Wayfarer 50 mm.
- `www.thesunglassfix.com`: ruta de recambios RB2140 Wayfarer 50 mm.
- `frame-stock.com`: Maker.

Las rutas de recambio fueron intentos de búsqueda; una ruta bloqueada no demuestra que exista, que el producto esté disponible o que proporcione datos vectoriales. La búsqueda pública de repositorios en GitHub por `RB2140` devolvió cero resultados; la búsqueda de código mostró que requiere iniciar sesión. `api.github.com` también resultó bloqueado. Nada de ello demuestra que no existan plantillas en otras fuentes.

**A y DBL no determinan la silueta.** Dos lentes con ancho horizontal 50 mm pueden tener alturas, esquinas, curva nasal y perímetros muy distintos. Tampoco una foto de catálogo identifica la curva exacta de corte: perspectiva, distorsión de lente, inclinación de la montura y bisel afectan la correspondencia. Por tanto, no se debe sustituir el trazado por una forma genérica Wayfarer escalada y etiquetarla como RB2140 exacto.

Para una plantilla fiel hace falta recuperar un archivo de trazador o una plantilla vectorial calibrada del **modelo y talla concretos**, con procedencia identificada. Antes de aceptarla se comprueban unidades, orientación derecha/izquierda, cierre y continuidad de contorno, ancho y alto de caja, perímetro, coincidencia con 50 mm nominales y qué superficie representa el trazado (contorno de referencia, borde o bisel). DBL 22 mm posiciona las lunetas en el frontal, pero no aporta su forma. El perfil exterior del frontal y sus bisagras tampoco queda definido por el trazado de cristal.

Si no se dispone de ese archivo, se puede ofrecer una propuesta paramétrica con dimensiones 50 □ 22 claramente identificada como **aproximación**, manteniendo pendiente la validación de correspondencia con RB2140. El flujo automático de importación debe utilizar el archivo auténtico cuando se consiga, sin exigir al usuario dibujar de nuevo la luneta.

Para completar esta búsqueda se requiere habilitar los dominios anteriores en la configuración de red del entorno. Las redirecciones y dominios de descarga se deben añadir solo después de observarlos. Habilitar un dominio permite investigar la fuente; no garantiza que publique una plantilla descargable ni sustituye comprobar procedencia y escala.
