# FR eyewear studio 1.4.0

## Correcciones solicitadas en sistemaFR.pdf

Se revisaron sus dos páginas, tanto las indicaciones del usuario como los recursos gráficos. La imagen de los cristales vuelve a incluir los 27 códigos de la tabla ya disponible. Se añaden cuatro aperturas de los ejemplos nuevos: total 31 perfiles ópticos. La biblioteca del escritorio pasa de 20 a 25 bases: Recto 4 tipo Wayfarer, Cat-eye 2/3/4 y Panto 2 con caja exterior. El configurador público conserva únicamente Redondo y Cuadrado y todas sus herramientas.

La tapa del cristal se reprodujo en 144/240 combinaciones antiguas. La triangulación del cap original de ExtrudeGeometry se conservaba después de desplazar sus vértices para el bisel, atravesando las aberturas. Se sustituye por un sólido obtenido de regiones planas desplazadas, loft de sus contornos y triangulación de cada tapa real. El mismo acabado se usa en 3D, GLB y STL, con caché de geometrías. No se oculta el defecto con transparencia o desactivando piezas.

La caja exterior sigue el ancho proximal del brazo más 0,5 mm de material por lado, con saliente editable y esquinas redondeadas. La bisagra sigue la posición temporal editada. Se incorporan modos de aro vinculado al cristal e independiente; los nodos de aro y cristal tienen destinos separados. Desvincular conserva una base óptica editable para el aro. Las ediciones incompatibles se rechazan y mantienen el último sólido válido.

Terminales con longitud, ancho y espesor separados; el remate reduce conjuntamente alto y espesor para evitar una punta en forma de cuchilla. Se conservan longitud desarrollada del brazo y ángulo final. Los proyectos recientes conservan modo de pared, vínculo óptico, caja y terminal al reabrir, corrigiendo la migración que antes forzaba pared hacia dentro.

## Dimensiones y referencias

Cat-eye técnico: A51, B48, DBL17, ancho frontal150 y brazo125 mm, conforme a las anotaciones. Las otras imágenes carecen de una escala física conocida: sus contornos se digitalizan, regularizan y reciben una escala nominal editable. Se trasladan sus proporciones visuales de anchura, separación y alas, sin presentar esas dimensiones como cotas del fabricante. Los recursos originales no se redistribuyen; el script opcional digitize-system-profiles.py reproduce los trazados usando el PDF aportado.

## Comprobaciones

101 pruebas unitarias aprobadas antes del empaquetado; incluyen abertura óptica por rayos, caja/brazo, 31 ópticas vinculadas, dimensiones anotadas y reapertura. Auditoría ampliada de 300 combinaciones de puente: 300 válidas y cero aberturas tapadas. Aceptación de navegador de 25 bases/31 cristales y controles independientes; aplicación Electron sin conexión con proyecto, Worker local, GLB, STL y PDF de dos hojas. Se registrará la publicación de instaladores después de comprobarla.

## Alcance de fabricación y plataformas

Los modelos son construcciones editables y trazados de imágenes rasterizadas; no autentican CAD Ray-Ban ni certifican encaje RB2140. La ranura del cristal, herrajes concretos, tolerancias de material/conformado y viabilidad de montaje requieren validación física. Los planos permanecen a escala desarrollada 1:1 en dos hojas: frontal/cristales y brazos/lunetas.

Se mantienen Windows x64, Linux amd64 y macOS Apple Silicon. Mac Intel sigue pendiente de un entorno capaz de verificar arranque y WebGL. Instaladores sin firma Authenticode/notarización. La autoridad privada de licencias existente se conserva fuera del repositorio y no se regenera; la evaluación y activación permanecen offline.
