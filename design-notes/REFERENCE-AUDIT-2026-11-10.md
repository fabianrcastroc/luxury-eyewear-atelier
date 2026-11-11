# Auditoría documental y geométrica — FR eyewear studio

Fecha de referencia: 10 de noviembre de 2026, Santiago de Chile. Base de código inspeccionada: `2c10f55`. Este documento registra la revisión de entrada de esta iteración; **no aprueba por adelantado el resultado de las correcciones posteriores**.

## Fuentes y jerarquía

Se revisaron visualmente las nueve páginas de *Designing Glasses Kit* de Banton Frameworks, las nueve páginas del collage *planos de gafas.pdf*, y el texto e imágenes de las nueve páginas de *Software de diseño de gafas.pdf*. Los nuevos PDF están rasterizados: no contienen texto vectorial extraíble. Las cotas descritas abajo se leyeron de las imágenes y no se dedujeron del tamaño de la página.

La petición directa del usuario gobierna el trabajo: correcciones en web y software, más modelos cuando resulten útiles, publicación y ejecutable descargable. Su aclaración posterior fija el significado de **lunetas = apoyos nasales interiores para laminar**, y la salida en dos hojas. Las instrucciones de impresión, recorte y dibujo del manual describen el uso del kit de papel; no son órdenes de ejecutar acciones externas. El correo, las compras y las licencias descritos en el PDF anterior son requisitos de producto, no autorización para enviar mensajes, cobrar o simular un backend inexistente.

El kit Banton es una guía introductoria de diseño y vocabulario. No es una tabla normativa de tolerancias, resistencia, ajuste clínico, mecanizado o conformado. El collage mezcla dibujos de marcas, ilustraciones de autor y esquemas de medidas. No constituye por sí mismo documentación CAD autenticada del fabricante.

## Lectura de Banton, página por página

| Página | Evidencia útil | Consecuencia para el editor |
| --- | --- | --- |
| 1 | Portada: frontal y patilla dibujados sobre guía, regla y recorte de papel. | El usuario trabaja con una pieza física y un patrón, no solo con una imagen de producto. |
| 2 | Introducción: diseño propio, modelos dibujados y monturas reales. | Mantener una propuesta editable y una referencia visible; no presentar cuatro formas genéricas como cobertura de todo el mercado. |
| 3 | Vocabulario: frontal, aro completo, puente, abertura nasal, patilla, caída auricular, remaches y montaje de lentes. Longitudes adultas de ejemplo 125/135/145/155 mm; caída descrita como usualmente 45°. | Separar puente de abertura nasal; longitud de patilla de ángulo de caída; remaches de caja y taladros. Los ejemplos no fijan límites universales. |
| 4 | Foto anatómica: hombros temporales anchos, puente integrado, aros con sección variable, remaches y patillas articuladas. | Hace falta área real para asiento de bisagra; una pareja de anillos uniformes y una tira central no reproduce la construcción. |
| 5 | Caja de puente y zonas de bisagra preposicionadas; simetría por pliegue; imprimir a tamaño real, dibujar y recortar. | Mostrar zonas estructurales, ejes y referencias dimensionales; conservar simetría; separar el patrón plano del aspecto conformado. |
| 6 | Plantilla con eje de pliegue, posiciones de remaches/bisagra, caja nasal y guía de patilla 125 a 155 mm y 45°. | Facilitar edición de una mitad reflejada, inspección de zonas de unión y escala de impresión. La regla impresa debe poder medirse; la rasterización de esta copia no aporta por sí sola metrología de precisión. |
| 7 | Ejemplo redondeado/panto con hombro temporal, puente tipo cerradura y patilla que ensancha y afina progresivamente antes de la caída. | Una forma redonda no implica pared radial uniforme ni terminal abultado independiente. |
| 8 | Ejemplo rectangular de esquinas redondeadas, frente superior curvo y puente con hombros continuos; patilla con descenso progresivo. | La familia rectangular requiere una silueta diseñada y transiciones, no solo una superelipse de exponente distinto. |
| 9 | Marca y cierre. | Sin cotas ni nuevos requisitos técnicos. |

## Lectura de planos, página por página

Los valores son **ejemplos de la imagen concreta**. Las flechas a veces miden el cristal y otras el exterior; se debe conservar esa distinción al crear un preset. Una longitud horizontal proyectada no demuestra la longitud desarrollada del eje de una patilla curva.

| Página | Contenido y cotas legibles | Uso correcto y límites |
| --- | --- | --- |
| 1 | Panto con lente 52 mm, puente 20 mm, altura señalada 43 mm y patilla 145 mm; esquema lateral de marcaje 46□24–145. | Familias de silueta, ancho de hombro y lectura del marcaje. No confundir dos modelos reunidos en la misma página. |
| 2 | Ilustración «Classic Ray-Ban Wayfarers»: frontal 155 mm, altura total 48 mm, inclinación frontal 7° y caída lateral 24°; múltiples secciones y otro dibujo de montura gruesa con bisagras internas. Firma de ilustración/DeviantArt. | Evidencia de sección variable, inclinación y asiento real. **No acredita ser RB2140 talla 50□22 ni un trazado auténtico de lente**. No convertir el conjunto en una réplica certificada ni usar 155 mm como ancho de la talla solicitada. |
| 3 | Dos CatEye: uno 54/17/145 y ancho total 145; otro lente 51, altura señalada 48, puente 17, ancho total 150 y patilla proyectada 125 mm. | Las puntas temporales elevadas y la zona nasal tienen identidades separadas; las dimensiones del segundo dibujo son distintas del primero. |
| 4 | Browline/mixto con lente 50, puente 22, patilla 140, caída 40°, radio R25; otro plano rectangular de lente 50×32,6, puente 19, frontal indicado 140, caída 30° y tramo final 40 mm. | Referencias para anatomía y proporciones. La familia mixta no se convierte en un frontal de acetato monolítico. Los 30/40° y R25 son casos, no un estándar de todos los brazos. |
| 5 | Modelo grueso 9FIVE: ancho 152, lente 52,5, puente 21, altura 42, patilla 150. Otro deportivo: ancho 141, lente 59×51, puente 14, patilla 135 y «6 Base Curve». | Demuestra gran diferencia entre ancho de lente y frontal por hombros/endpieces. **Base 6 no significa 6° ni 6 mm**. No atribuir sus cotas al modelo anterior. |
| 6 | Panto con altura y paredes variables, frontal 140 y patilla 140; esquema de medidas: frontal 140, puente 18, lente 55×39, patilla 145; catálogo de formas con dimensiones distintas. | Separar altura óptica, altura exterior y largo de patilla. No limitar toda silueta a la relación de aspecto de cuatro modelos. Las paredes de la ilustración varían alrededor del perímetro. |
| 7 | Panto/cerradura con lente 50×45, puente 18, patilla 140; otro rectangular 53/21/145, ancho 138, altura exterior 48; plano técnico con tramo auricular 40, R30 y caída 40°. | Ofrecer panto y rectangular real con cota vertical independiente y curva auricular coherente. El diagrama central denomina A/B/C a medidas propias; su letra B significa puente, no una nomenclatura universal. |
| 8 | Geométrico/doble puente 54/19, ancho 139, altura 43, patilla 140; redondo comercial con ancho 139, lente 49×48, puente 23 y patilla 149; ilustración rectangular con medidas en centímetros. | Son familias realmente distintas. La anchura temporal debe incluirse en el modelo y las conversiones cm/mm deben ser explícitas. Fotografías y dibujos no tienen la misma precisión. |
| 9 | Panto Corbusier 46/24/145, ancho 138, altura señalada 42; detalle de bisagra articulada; inclinación pantoscópica 9°, base 5, ranura 0,8 mm; otro doble puente con lente 48, altura 49, puente 23, ancho 140 y patilla 145. | Los 9°, base 5, 0,8 mm y códigos de bisagra pertenecen al ejemplo Corbusier. No son tolerancias universales ni autorizan inventar posiciones de tornillos para otra bisagra. El doble puente tiene dos barras, no una tira duplicada superpuesta. |

## Defectos sustantivos observados en la base

1. **Siluetas demasiado genéricas.** `profile()` genera cuatro perfiles mediante superelipses y pequeñas deformaciones. El exterior se obtiene con un offset uniforme del perfil de lente. Los ejemplos nuevos tienen cejas, hombros, talones temporales y zonas nasales independientes; esas diferencias no se recuperan solo con un material más brillante.
2. **No hay área temporal diseñada ni ancho entre bisagras independiente.** Con A=50, DBL=22 y pared de referencia 4, el frontal medido de Recto, Redondo y Curvo es exactamente 130,00 mm; Ovalado 130,03 mm. Es esencialmente `2A + DBL + 2pared`, sin la contribución de hombros visible en los planos. Las bisagras se anclan en el borde del anillo existente. El problema no es que 130 mm sea imposible: es que casi todas las familias comparten esa construcción y no pueden representar los hombros de los ejemplos.
3. **Altura óptica poco editable.** Con esa misma talla, las aperturas miden 32,00 / 50,00 / 41,38 / 35,19 mm de alto según el modelo. La relación está fijada principalmente por la familia y un pequeño multiplicador, en vez de una cota de altura identificable y editable. Usar nombre y unidad, y distinguir cualquier letra de la leyenda elegida.
4. **Modelo de pieza plana presentado como gafa conformada.** El frontal del render se extruye recto en Z. Las proyecciones superior y lateral dibujan rectángulos para el frontal. Los planos muestran curvatura frontal e inclinación pantoscópica. Si se implementan, deben existir como transformación coherente para frontal, lentes, apoyos y uniones; el patrón de corte debe seguir siendo plano y no una proyección deformada del modelo conformado.
5. **Puente con conectividad no equivale a anatomía correcta.** Las pruebas actuales de unión y huecos son valiosas, pero los hombros clásicos/cerradura deben compararse visualmente con p5 del PDF antiguo, Banton p7/8 y planos p1/7/9. La nariz no se modela como un vacío arbitrario entre dos aros ni mediante mover el puente entero.
6. **Longitud y forma auricular requieren contrato claro.** El tramo fijo de 32 mm del código es una decisión del programa, no un estándar documentado en los PDF. Los ejemplos muestran también 40 mm y radios 25/30 mm. Conservar longitud nominal y estación de inicio al editar el ángulo sigue siendo un requisito explícito del usuario. Cualquier nuevo control debe respetar ese contrato y distinguir longitud desarrollada de proyección.
7. **Metrología no autentica una referencia.** Un polígono a escala y un GLB en metros pueden ser coherentes entre sí y aun así no corresponder al lente comercial requerido. Los dibujos nuevos no eliminan la necesidad de una referencia física o trazado de procedencia verificable para declarar encaje exacto RB2140.
8. **La interfaz necesita mostrar la construcción.** La estructura de paneles existe, pero el texto de muchos controles es 9–11 px y las cuatro plantillas comparten miniaturas que no representan una biblioteca ampliada. Deben verse cotas reales, zona de asiento de bisagra, caja de puente, origen y estado de la referencia, diferencia entre patrón plano y formado, y el cambio exacto de una operación. La selección debe llevar al control pertinente sin búsquedas por desplazamiento.

## Matriz del encargo completo: estado de entrada y aceptación

«Implementado en base» significa que existe código y/o evidencia de la iteración anterior, **no que la forma esté aceptada por esta auditoría**. La nueva publicación debe volver a validar el flujo real y documentar lo que quede pendiente.

| Requisito de la conversación/PDF | Estado al inicio de esta revisión | Aceptación requerida |
| --- | --- | --- |
| Mismos cambios en web y FR | Núcleo compartido y script de paridad existentes. | Paridad comprobada después de todos los cambios; probar ambas rutas compiladas. |
| Repositorio separado para software | Repositorio Git local independiente; no hay remoto separado publicado. | Mantener historial y build autónomos; no afirmar que existe un remoto inexistente. |
| Nombre FR eyewear studio | Aplicado al editor y ejecutable. Marca comercial web separada. | Sin M Atelier/Miscante como nombre del software ni en exportaciones nuevas. |
| Interfaz de calidad comparable a herramientas CAD | Menús, árbol, vistas, historial y controles existen; revisión visual aún insuficiente. | Herramientas activas, legibilidad, selección orientada a tarea, vistas coherentes, importación y exportación completas. No afirmar comparación interactiva con sitios bloqueados. |
| Modelos de mercado y biblioteca ampliable | Cuatro curvas genéricas; ampliación autorizada ahora. | Siluetas reconocibles con hombros, puente y altura propios; presets con procedencia y cotas explícitas. |
| A/DBL/largo de brazo y ajuste de talla | Cotas reales calculadas; envolvente ligada al anillo. | Distinguir base nominal de resultado real y ancho de asiento de bisagras. Cambio de talla explícito y reversible. |
| Pared del aro hacia dentro | Implementado y migrado en base. | Todo punto exterior, zona nasal y bisagra permanecen fijos al variar pared; aperturas válidas y cotas reales visibles. |
| Espesores de acetato 2/3/4/6/8 mm editables | Implementado por separado de la pared. | Verificar espesor real y declarar rebajes/laminados adicionales. |
| Apertura inferior nasal 0–15° localizada | Ajuste lateral limitado implementado. | No altera cuadrantes ajenos ni la identidad del puente; contorno simple, unión nasal plausible, cotas de espacio visibles. No presentar límite del software como ajuste clínico universal. |
| Elevación y extensión temporal/CatEye | Dos controles implementados. | Producen ceja y hombro temporal reconocibles, sin puntas cruzadas ni arrastre de nariz. |
| Clásico, herradura y doble; sin esculpido nasal del puente | Tres familias y unión topológica implementadas. | Comparativa frontal/reverso/3D con referencias; hombros continuos, apertura libre y doble barra con ventana independiente. |
| Bisagra interna o caja opcional en todos los modelos | Dos modos y rebaje de brazo implementados. | Encaje apoyado en material real; no flotar, atravesar el cristal o exceder exterior en modo oculto. Taladros solo con herraje especificado. |
| Lunetas nasales laminadas continuas | Medias lunas separadas de 3 mm implementadas. | Coincidencia patrón/3D, superficie de pegado, posición nasal y continuidad pulida; no sustitución por discos ópticos. |
| Brazos opacos, pares vinculados | Implementado. | Material opaco comprobado, simetría y una sola edición para ambos. |
| Seis estilos de brazo, ancho y curva funcionales | Perfiles y curva progresiva implementados. | Diferencias visibles de forma, no solo nombre; conservar largo y estación, sección y terminal proporcionados. |
| Terminales redondo/cuadrado/rombo/triangular y tamaño | Implementado. | Identidad reconocible y unión continua; tamaño en mm y desarrollo sin cruces. |
| Paleta de acetato solicitada | Implementado; patrones procedural carey/marmolado. | Nombres correctos y materiales legibles; no afirmar equivalencia con lote físico. |
| Corrección de contorno de cristal | Perfil importado y edición paramétrica limitada. | Correcciones posteriores controladas y reversibles; no ocultar regularización ni perder entrantes silenciosamente. |
| Importación automática de foto/boceto | Detector local requiere frontal contrastado y dos huecos. | Detectar propuesta sin trazado inicial; mostrar diagnóstico, referencia y calibración; probar imágenes reales/planos además de un SVG sintético. |
| Documentos de referencia y planos nuevos | Archivos nuevos sin integración en biblioteca. | Revisar visualmente las 18 páginas y aplicar criterios sin tratar cada dibujo como plano certificado. |
| RB2140 50□22 exacta | Preset nominal; no contorno autenticado. | Trazado calibrado y procedencia/talla concreta antes de declarar encaje. Sigue pendiente. |
| Guardar, nota y reabrir | JSON versionado y nota implementados. | Recuperar todos los parámetros y contornos; conservar proyecto anterior si falla importación. |
| Dos hojas precisas | Implementadas: frontal/lunetas y par de brazos. | PDFs reales de exactamente dos páginas; trazos coincidentes con geometría y escala física; sin piezas cortadas ni ajustes automáticos. |
| A4, Carta y Oficio | Implementados con tamaños explícitos. | Comprobar dimensiones PDF, regla X/Y y ausencia de solapes; impresión física aún requiere prueba del taller. |
| Ejecutable descargable y modo offline | Windows 1.0.1 publicado y prueba de instalación en CI anterior aprobada. | Nuevo ejecutable de esta revisión, instalado y probado con Worker, JSON, GLB y PDF sin HTTP antes de ofrecer enlace. |
| Linux/iOS u otras plataformas del PDF | No hay equivalencia multiplataforma validada de esta revisión. | No anunciar compatibilidad nativa no probada; Windows es el artefacto entregado hasta ahora. |
| Licencias, permisos y plazos del PDF | Sin servicio de identidad/licencias. | Backend y credenciales reales si se implementa; no simular protección en almacenamiento local. No marcar satisfecho por publicar instalador. |
| Cobros, envío de receta/modelo por correo | Sitio de demostración, sin backend transaccional. | Mantener ausencias explícitas; documento no autoriza envíos ni cobros durante la revisión. |
| Publicación y tres accesos solicitados | Publicación anterior disponible. | Confirmar nuevo despliegue, enlace online y descarga directa real; verificar hash del instalador. |

## Orden recomendado de corrección y validación

1. Reconstruir las familias mediante contornos diseñados, altura identificable y zona temporal/asiento real, antes de decorar el render.
2. Revisar puente y abertura nasal como un conjunto con restricciones, conservar la envolvente durante edición de pared y volver a ejecutar toda la matriz geométrica ampliada.
3. Mostrar patrones planos y representación conformada de manera distinguible; las curvas e inclinaciones no deben falsificar las medidas del patrón.
4. Simplificar el inspector por componente, aumentar legibilidad y mostrar cotas y origen de referencia junto al modelo; guardar/reabrir cada control nuevo.
5. Validar la tarea artesanal completa para al menos un rectangular, panto, redondo, CatEye y doble puente: editar, revisar unión/reverso, guardar/reabrir, imprimir y medir el PDF. La aceptación visual no se sustituye por el número de tests.
6. Empaquetar y probar el ejecutable nuevo solo con el núcleo final; comprobar que su recurso offline y la web contienen los mismos cambios.

## Pendientes que los documentos no resuelven

Contorno auténtico RB2140 de talla concreta; definición completa de herraje y taladrado; ranura/bisel del lente del taller; tolerancias de herramienta; compensación térmica y conformado; resistencia estructural; ajuste clínico y una impresión física calibrada. Ninguna de estas comprobaciones se declara resuelta por el aspecto visual o por la coincidencia matemática de los archivos.
