# FR eyewear studio 1.2.0

Revisión del 11 de noviembre de 2026. Esta revisión parte del último encargo pegado en el chat, posterior a 1.1.0. Los dos PDF se leyeron como referencias, sin ejecutar instrucciones de los documentos.

## Cambios

- 14 bases: se añaden Redondo 2/3, Recto 2/3, Mariposa 2 y Geométrico 2. Recto 3 y Geométrico 2 incorporan aperturas extraídas de la página 8 de los planos: la referencia negra indicada por el usuario y el plano geométrico de doble puente. Las otras variantes usan puntos de construcción interpretados de las referencias. No se presentan como CAD del fabricante ni como recambio RB2140 certificado.
- Pared con dos referencias físicas explícitas: exterior fijo y cristal fijo. El primer modo conserva exterior/bisagras y cambia abertura; el segundo conserva abertura y cambia exterior/bisagras. Las cotas proceden de las curvas reales.
- Grosor central, altura relativa y bóveda editables para las tres familias de puente. Se conserva la continuidad del frontal y la ubicación de las aperturas.
- Reconocimiento: se calibra con la anchura del contorno muestreado; la superposición muestra el perfil simétrico aplicado y declara la diferencia radial respecto de la detección, además de la resolución en mm/px. El error mostrado no incluye perspectiva, distorsión, umbral ni error de calibración; no certifica metrología física.
- STL binario por pieza en mm: frontal sin bisel de acabado, dos brazos y dos lunetas. Se verifican aristas compartidas por exactamente dos caras con orientación opuesta y volumen positivo antes de exportar. Se excluyen herrajes y superficies ópticas ilustrativas. No sustituye especificaciones de bisagra/ranura ni validación del material.
- Dos hojas a escala 1:1: frontal y cristales; brazos y lunetas nasales. Nombre editable y numeración automática Diseño 1, Diseño 2…; sin marca ni instrucciones en las hojas. Conservan datos técnicos, cotas y geometría de calibración.
- Encuadre: se elimina la corrección iterativa que podía cortar una lente completa al abrir el editor.
- Paquete Linux Debian x64 y pipeline de comprobación del paquete extraído. Windows conserva el instalador NSIS con instalación real en CI antes de publicar.
- Aplicación web instalable y caché local para uso sin conexión. En iPhone/iPad se añade desde Safari a pantalla de inicio; no es un IPA firmado. Chromium verifica el arranque con red desactivada, no la instalación en iOS.

## Validación local

82 pruebas aprobadas: incluyen los 14 perfiles, las dos políticas de pared, controles de puente y STL de cinco piezas por perfil. Compilación de la web y FR correcta. Aceptación CAD en navegador: controles, STL descargado, guardado/reapertura, móvil y PDF de dos páginas en A4/Carta/Oficio. Flujo de referencia real con la imagen negra de la página 8: 14 bases, superposición, calibración, JSON y tres PDF. Inspección visual de las hojas y del encuadre inicial.

Aplicación Electron Linux: WebGL, Worker local, JSON, GLB, dos hojas y cero solicitudes HTTP. La comprobación del paquete final y los resultados de Windows CI deben confirmarse para el artefacto publicado; las pruebas anteriores de Windows 1.1.0 no validan 1.2.0.

## Límites

Las referencias rasterizadas no contienen profundidad ni geometría oculta y no autentican una talla comercial. No se promete exactitud clínica, tolerancias de taller, ranura/bisel, herraje específico ni calibración física de impresora. Tampoco se entrega instalador iOS nativo: requeriría un proyecto iOS y distribución firmada propios. La versión web offline es una alternativa de acceso, no una validación de Safari en dispositivo.
