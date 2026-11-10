# Revisión del encargo y criterios de aceptación

Revisión independiente de las nueve páginas del PDF aportado por el usuario, tanto texto como imágenes, y de la versión publicada `8922474` («Publish FR studio with audited two-page workshop drafts»). La comparación inicial se hizo leyendo ese commit y ejecutando una copia exportada mediante `git archive`, sin alterar el trabajo en curso. Las correcciones posteriores requieren su propia inspección y no se dan por aprobadas en este documento.

## Objetivo y significado de las piezas

La petición actual exige mejorar **la web Miscante y el software FR**, con un repositorio separado para este último, hasta ofrecer diseño y personalización de gafas útil para trabajo de taller. El software debe trabajar con modelos editables, referencia automática, navegación 2D/3D fluida y salida física calibrada. La referencia concreta solicitada después es **Ray-Ban RB2140, 50 □ 22**, y las planchas disponibles son **2, 3, 4, 6 y 8 mm**.

En la página 6 del PDF, **«lunetas nasales internas» significa las piezas de apoyo nasal en forma de media luna**, adheridas por dentro del aro y pulidas para parecer continuas con él. No significa los cristales ni sus contornos. Las etiquetas del producto y los patrones deben distinguir «aperturas/cristales» de «lunetas o apoyos nasales»; exportar dos discos de cristal no satisface por sí solo la petición de aro y lunetas.

La plancha es profundidad de material en Z. El espesor de pared del aro es una distancia en el plano frontal. No son el mismo parámetro, aunque ambos se expresen en milímetros. Una plancha de 2 mm no se convierte en una pieza nasal gruesa sin aportar material separado.

## Comparación con la versión 8922474

| Encargo y evidencia | Estado observado en 8922474 | Criterio concreto para aceptar una corrección |
| --- | --- | --- |
| Talla A/DBL/B con relaciones reales; p. 1–2 | A y DBL editables y B en cuatro valores. Aro exterior aumenta con la pared; el ancho de bisagras no es una medida independiente validada. | Mostrar qué mide cada cota sobre el dibujo; la talla exportada coincide con esos puntos. Cambiar color o pared no desplaza silenciosamente bisagras ni cambia un valor bloqueado. |
| Conservar límite exterior al modificar pared; p. 4 | `frameContour` deriva un offset exterior desde una apertura fija: hace justamente crecer el exterior que el PDF pide conservar. | Modo de envolvente fija con pruebas de coincidencia de todos los puntos exteriores al variar pared; mostrar A/DBL resultantes y no mantener etiquetas falsas. Véanse los dos modos físicos más abajo. |
| Encaje de brazo dentro de la zona de bisagra; p. 2–3 | Las cajas/meshes de bisagra sobresalen claramente en vista frontal de la copia ejecutada. | Frente, reverso, lateral y perspectiva muestran apoyo continuo; sin piezas flotantes ni cajas sobrepasando la silueta en modo oculto. Verificar también máximos de anchura de patilla. |
| Caja de bisagra interior u opcional exterior, disponible en todos los modelos; p. 3 | No hay control de caja/ocultación; se dibuja una solución genérica. | Dos modos visibles y editables. Oculta: frontal conserva exactamente la silueta. Con caja: cambia el exterior y sus medidas se actualizan. Herraje ilustrativo no se anuncia como mecanizado listo. |
| Solo clásico, herradura y doble; sin deformar borde nasal del puente; p. 5 | Tres tipos existentes, pero permanece «Borde nasal: recto/curvo» que deforma el puente. | Retirar ese grado de libertad. Las tres siluetas del puente son reconocibles y conectan a ambos aros sin tapar apertura o crear cruce. |
| Apertura inferior-nasal entre 0 y 15°; p. 5 | Relieve «nasalProjection» de 0 a 100, sin significado angular y distinto de la apertura pedida. | Control en grados con efecto localizado; 0 y 15° son comparables mediante geometría y dibujo. Los bordes temporal, superior e inferior alejados de la región permanecen invariantes. |
| Pronunciación y extensión superior-temporal hasta CatEye; p. 5 | Redondeo global; no hay dos controles locales equivalentes. | Controles separados y localizados producen CatEye legible sin mover la zona nasal ni generar puntas cruzadas. Reiniciar un control revierte únicamente su región. |
| Lunetas nasales continuas con aro; p. 6 | Vista frontal muestra pestañas interiores verticales y angulares; no reproduce la media luna y transición ilustradas. | Comparar reverso y perspectiva acercada con imágenes p. 6. La unión no tiene hueco visible, la base no invade la apertura, la transición parece pulida y la pieza de taller corresponde a la forma visible. |
| Brazos opacos; p. 3 | El material de patilla es opaco en código, pero la composición puede hacerlos parecer traslúcidos detrás del cristal. | Material `opacity=1`, sin `transparent` ni transmisión; captura lateral sin cristal delante muestra una pieza sólida. Ver patilla a través de un cristal no demuestra transparencia de la patilla. |
| Anchura común para ambos brazos; p. 6–7 | Anchura común y tope geométrico; seis estilos, sin inclinación editable de inicio de curva. | Un control refleja ambos lados y no produce asimetría. Anchura afecta solo al tramo marcado hasta comienzo de curvatura. Se muestra el umbral recomendado sin confundirlo con un límite físico duro. |
| Inclinación de la curva auricular con B fijo; p. 6 | Curva auricular fija, sin grado de libertad solicitado. | Cambiar ángulo conserva B desarrollado y posición longitudinal de inicio según el contrato elegido. Dibujo lateral y patrón explican qué cambia; no desplazar la curva para simular ángulo. |
| Terminal rombo/triangular/cuadrado/redondo y tamaño; p. 7 | Seis estilos de brazo no equivalen a seleccionar terminal y tamaño. | Terminal identificable en lateral y patrón, unido sin escalón accidental; pares reflejados, tamaño con unidad, B verificado. |
| Colores negro/carey/amarillo/marfil/azul piedra marmolado/gris/rojo italiano; p. 4 | Paleta Miel/Tabaco/Obsidiana/Oliva/Marfil/Borgoña, sin toda la oferta ni marmolado. | Nombres de stock correctos y muestras diferenciadas; carey y azul piedra poseen patrón/material perceptible, no solo un hex de color sólido. |
| Edición de forma y contorno del cristal; p. 3 | Siluetas paramétricas y contorno importado convexo con A/altura global; perfiles redondo/ovalado protegidos. | Correcciones asistidas locales, reversibles y con límites; no prometer cualquier silueta si el algoritmo convierte todos los entrantes en una envolvente convexa. |
| Foto/boceto automático sin trazado inicial; solicitud actual y p. 9 | Detector local necesita ambos huecos cerrados y fondo claro; regulariza a convexo, no recupera volumen oculto. | Una referencia admitida genera propuesta 2D/3D sin dibujar puntos. Se puede inspeccionar sobreposición, calibrar y corregir. Un fallo explica la causa y conserva el proyecto anterior. Fotos reales difíciles deben probarse por separado del boceto sintético. |
| RB2140 50 □ 22 exacto, sin tener que trazar; solicitud posterior | Botón aplica dos números y declara contorno no verificado. No hay archivo auténtico RB2140. | Incorporar trazado de procedencia verificable y de talla concreta. A=50 y DBL=22 por sí solos no definen la curva; no etiquetar una forma genérica como réplica exacta. |
| Dos hojas: aro/lunetas y ambos brazos; solicitud actual | Dos A4 vectoriales con frontal, cristales y brazos desarrollados. No basta confirmar dos páginas si faltan apoyos nasales o si el perfil no corresponde al modelo. | Hoja 1 incluye frontal y piezas de apoyo nasal identificadas; los contornos de cristal van etiquetados aparte. Hoja 2 ambos brazos completos. Medidas, trazos y piezas coinciden con diseño, sin recortes ni superposición. |
| Carta/oficio a tamaño real; p. 9 | Salida fija A4. | Selección explícita de formatos físicos; exactamente dos páginas en cada formato admitido, 100 % de escala y geometría sin ajuste automático. «Oficio» exige dimensiones concretas visibles porque varía por región. |
| Guardar/reabrir proyecto y nota; p. 8–9 | JSON y guardado local existentes; nota de taller ausente. | Descargar, reabrir y seguir editando sin pérdida de forma, dimensiones, material y nota; archivos con versión/unidades y errores de importación concretos. |
| Programa ejecutable multiplataforma; p. 9 | Aplicación de navegador en directorio `/fr` y repo local separado, sin instaladores nativos. | Distribuciones y pruebas por plataforma antes de afirmar Windows/Linux/iOS. Una web adaptable no es por sí sola un ejecutable nativo. |
| Licencias de usuario, permisos y plazos; p. 9 | No hay backend de identidad, panel de cuentas ni licencias. | Autenticación real, revocación y vencimiento probados en servidor, con gestión segura de cuentas. No añadir un formulario local que solo aparente proteger el producto. |

## Dos modos que resuelven una incompatibilidad física

No es posible conservar simultáneamente **todo el contorno exterior**, **el contorno exacto del cristal** y **variar la pared entre ambos** en la misma sección del aro. La distancia entre dos curvas fijas también queda fija. Presentar tres bloqueos simultáneos mientras cambia una de esas curvas sería engañoso.

**Modo envolvente fija, solicitado en el PDF:** conservar exterior y posición de bisagras; la pared crece hacia dentro. Cambian la abertura efectiva y las cotas A/DBL que deriven de ella. La interfaz muestra esa consecuencia. El ajuste final de talla se hace como operación explícita y recalcula geometría/cotas sin ocultar qué se desbloquea. No puede prometer seguir admitiendo una lente comercial exacta después de cambiar la abertura.

**Modo cristal fijo, necesario para una luneta RB2140 auténtica:** bloquear el perfil de cristal y su colocación nominal; la pared crece hacia fuera dentro de límites de separación nasal y asiento de bisagra. El frontal exterior cambia y debe indicarse. Si se exige conservar también el exterior, el espesor de pared deja de ser editable; se puede cambiar profundidad de plancha sin cambiar los contornos XY.

El usuario debe poder ver el modo y sus bloqueos antes de editar, con medidas resultantes y deshacer. El programa no decide en silencio cuál restricción romper. Una forma genérica con A/DBL iguales solo es una aproximación dimensional, nunca el trazado exacto solicitado.

## Inspección visual independiente del punto de partida

En navegador Chromium con WebGL y viewport 1440 × 1000 se ejecutó la copia del commit 8922474. Captura local: `/tmp/baseline-8922474-front-controls.png`.

- En vista frontal los bloques de bisagra sobresalen de los dos extremos; contradice las imágenes correctas de p. 2–3.
- Los apoyos nasales aparecen como pestañas verticales largas y rectangulares. No reproducen la media luna ni la transición pulida de p. 6.
- La unión de puente parece una banda pinzada y angular entre aros, que requiere revisión cercana desde frente/reverso y no solo contar meshes.
- Textos y controles de 7–10 px dificultan leer parámetros; el aspecto no se vuelve profesional por agregar más botones. El inspector dedica el primer espacio a un bloque genérico y precio mientras opciones de forma quedan ocultas por desplazamiento.
- El objeto ocupa aproximadamente 680 px de ancho y 210 px de alto dentro de un área visual de unos 1020 px de ancho y gran altura vacía. El encuadre debe facilitar examinar uniones, no solo centrar el grupo.

La medición independiente del módulo geométrico del mismo commit confirma el problema de envolvente: conservando A = 52 mm y DBL = 17 mm, las paredes de 3, 4 y 8 mm producen frontales declarados de 132,5, 134,5 y 142,5 mm respectivamente. La apertura sigue midiendo 52 mm. Pasar de pared 3 a 8 añade 10 mm al frontal; no es un cambio puramente visual ni una conservación del exterior solicitada en el PDF.

Estas observaciones son de la versión de partida y se deben volver a evaluar sobre el nuevo espacio CAD antes de publicar. Una prueba de clics o un contador de pruebas aprobadas no invalida un defecto visible.

## Criterios de revisión del nuevo flujo

La aceptación se realiza con una tarea real completa: partir de una silueta, elegir modo de talla, ajustar medidas, pared y plancha, cambiar puente y región nasal, configurar bisagra y brazo/terminal, revisar frente/reverso/lateral y 2D, guardar/reabrir y generar las dos hojas. Deben registrarse capturas de los mismos estados y cotas, no solo un mensaje «PASS».

1. **Legibilidad:** etiquetas, unidades y valores legibles a 100 % de zoom; contraste suficiente; botones con estados inequívocos; inspector navegable sin paneles cortados. Navegación móvil adaptada a inspección, sin ocultar herramientas esenciales.
2. **Respuesta:** el modelo cambia durante la edición sin perder cámara, sin desaparecer y sin reconstrucciones visibles incoherentes. La selección de componente corresponde a su control; no se mezclan pared, profundidad y talla.
3. **Reversibilidad:** deshacer recupera exactamente contornos y medidas; rehacer restaura el estado; importar referencia/proyecto no destruye el estado anterior si falla.
4. **Coherencia dimensional:** el A/DBL/B mostrado se obtiene de los contornos/curvas reales, incluido el tramo auricular. Las cotas visibles en 2D y el SVG/PDF coinciden con las del estado guardado.
5. **Geometría visible:** aros sin cruces, discontinuidades o sombras que escondan uniones incorrectas; bisagras apoyadas por dentro en modo oculto; brazos opacos y simétricos; apoyos nasales anatómicamente plausibles según referencia y unión continua en render.
6. **Fabricación:** exactamente dos páginas por formato, barra de calibración medida en el PDF y en impresión física, piezas completas y sin encimarse. La exactitud numérica de un SVG no demuestra ajuste de bisagra, bisel o pieza real. Se requieren herrajes y tolerancias del taller antes de declarar producción definitiva.

## Referencia documental y acciones externas

La solicitud del PDF de enviar modelos al correo del propietario después de una compra describe un flujo comercial deseado. No autoriza enviar mensajes durante esta revisión ni hace que existan pagos o pedidos reales. La versión estática no dispone de backend de pagos, entrega de recetas, correo transaccional o gestión de licencias. Tampoco corresponde inventar una pantalla de licencia como sustituto de seguridad real.

La publicación de las mejoras sí fue autorizada posteriormente por el usuario en la conversación; esa autorización no convierte en implementadas funciones comerciales ausentes. Deben mantenerse separadas la preparación técnica, la publicación de artefactos y las funciones que requieran servicio externo/credenciales. No enviar archivos, activar cobros, crear cuentas de licencia ni desplegar servicios comerciales por inferencia del PDF.

Las fuentes oficiales de McNeel se recopilaron en `DESIGN-RESEARCH.md`. Frame Stock y los sitios de producto Ray-Ban siguen bloqueados por la red; no se han inspeccionado sus interfaces reales ni se ha recuperado el trazado RB2140. Los documentos de desarrollo de Rhino aportan criterios de unidades, geometría e interacción, pero no son una comparación visual completa de la aplicación instalada.
