# Verificación de FR eyewear studio

Revisión: 10 de noviembre de 2026.

## Alcance verificado

Web y aplicación FR usan el mismo núcleo. El nombre del editor es FR eyewear studio. El sitio comercial conserva su marca Miscante.

- Pared interior con envolvente fija; migración de proyectos anteriores.
- Apertura nasal localizada, sin elevar el aro ni alterar los otros cuadrantes; cotas frontales calculadas.
- Puentes silla clásica, herradura circular y doble barra separados; unión frontal conectada.
- Brazos de seis perfiles, B conservado, curva progresiva y terminales de longitud real con afinado declarado.
- Exactamente dos hojas: frontal y dos lunetas nasales; ambos brazos. A4, Carta y Oficio, sin reducir escala para acomodar piezas.
- Importación automática de referencias frontales contrastadas, corrección paramétrica posterior y calibración explícita.

## Evidencia de esta revisión

63 pruebas unitarias pasan. Incluyen topología de puentes para cuatro modelos y cinco espesores, contornos nasales, invariancia exterior y de B, orientación y cierre de mallas, papel y validación de importación.

Metrología binaria GLB: 20 combinaciones de modelo y plancha, escala métrica, profundidades reales, material opaco, laminados nasales separados y estabilidad de cámara.

Aceptación en navegador sobre compilación estática: editor, vistas, edición local, deshacer, referencia automática en Worker, JSON, GLB, tres PDF de exactamente dos páginas y adaptación móvil. Las capturas del modelo y los perfiles fueron revisadas visualmente.

## Límites pendientes de comprobación física

No se dispone de un contorno auténtico calibrado RB2140 50□22. El preset establece las medidas nominales aportadas por el usuario y no promete encaje de recambio. Tampoco se verificaron una impresión física, bisagra real, ranura óptica, tolerancias del taller ni compensación térmica. Las pruebas digitales no sustituyen esas verificaciones.

El PDF del usuario aporta requisitos de producto y referencias visuales; no autoriza por sí mismo envíos a terceros, cobros ni la invención de un sistema de licencias.


## Publicación y ejecutable verificados

Web: despliegue Pages `42889633816`, commit `30a5554`, correcto.

Instalador Windows x64 1.0.1: CI `42889636781`, compilación NSIS, instalación silenciosa y prueba del ejecutable instalado aprobadas antes de crear el Release. Prueba: WebGL, Worker local, guardar/reabrir JSON, GLB y PDF de dos hojas, sin solicitudes HTTP ni errores de página. Instalador sin firma Authenticode.

Se descargó de nuevo el archivo publicado: 121.522.907 bytes, cabecera ejecutable MZ y SHA256 coincidente con `SHA256SUMS.txt` del Release:

`5e88b9a515b5f4e13e7ac50235abab474c97379cbfd908e1f2937d443758c12c`


## Revisión posterior 1.1.0

La información anterior corresponde a 1.0.1. Para la revisión actual ampliada a ocho bases, consultar DELIVERY-1.1.0.md y REFERENCE-AUDIT-2026-11-10.md. La nueva entrega pasa 77 pruebas web, 74 independientes, 40 combinaciones GLB y el flujo completo con referencia real. Windows CI 42936793975 instaló y probó el ejecutable 1.1.0 sin conexión antes de publicar su Release.
