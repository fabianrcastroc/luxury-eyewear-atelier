# FR eyewear studio 1.1.0 — revisión del encargo

## Referencias revisadas

Se revisaron visualmente las nueve páginas del documento original de diseño, las nueve del kit Banton y las nueve del PDF de planos, junto con los requisitos visibles de esta conversación. La auditoría página por página y la matriz de 29 requisitos están en REFERENCE-AUDIT-2026-11-10.md. El enlace de chat externo no aportó contenido adicional accesible; no se inventan requisitos de ese enlace.

El kit Banton orienta el dibujo, anatomía, simetría y posición de componentes; no es una norma de tolerancias. Los planos incluyen fotografías, diseños y cotas de fuentes distintas, no una escala única certificada. El dibujo Wayfarer de 155 mm no autentica un contorno RB2140 50□22.

## Correcciones concretas

- Ocho perfiles originales: Recto, Redondo, Ovalado, Curvo, Panto, Boston, Cat-eye y Geométrico. Curvas de construcción y presets propios, con cejas y extremos de bisagra más anchos que la pared mínima.
- Ancho A, altura óptica B, separación DBL y largo de brazo L identificados y editables. Cotas reales visibles junto al modelo; la pared mínima y la profundidad de plancha son independientes.
- Envolvente y bisagras fijas al cambiar pared. Apertura nasal localizada, saturación suave y espacio nasal medido. Tres familias de puente y unión frontal comprobada.
- Brazo con tramo auricular de 20–45 mm y apertura lateral de 0–8°, conservando L. Radio mínimo de la curva calculado, no confundido con una norma universal. Terminales y rebajes dimensionados.
- Ocho nodos de corrección de perfil vinculados por simetría. Movimiento acotado por gesto, menor en zona nasal; contorno simple validado, A/B conservados, deshacer/rehacer.
- Detección automática que conserva entrantes suaves, acepta fondo gris y cristales oscuros, y superpone el trazo sobre la fotografía. Aplicación calibrada con A conocido; imagen sin profundidad inferida ni promesa de exactitud metrológica desde píxeles.
- Lentes sólidos ilustrativos con canto; bisagras con hojas, nudillos y tornillo; remaches enrasados; lunetas laminadas con superficie curva pulida y huella de pegado coherente.
- Plano frontal unido sin costuras artificiales del puente, guías de asiento y caja de puente, reverso accesible, cotas legibles, navegación por secciones, biblioteca buscable y guía de taller.
- Guardado FR versión 5 y reapertura con todos los parámetros nuevos. Proyectos anteriores se admiten con aviso de revisión de cotas por actualización geométrica.
- Dos hojas físicas: frontal y dos lunetas nasales; ambos brazos. A4, Carta y Oficio, 1:1 sin reducir para acomodar piezas. Se anotan L, estación, curva y mecanizado distal.

## Validación digital

77 pruebas unitarias en web y 74 en el repositorio independiente aprobadas. Incluyen 120 combinaciones de ocho modelos, tres puentes y cinco planchas; altura/ancho independientes; contornos; mallas cerradas; laminados; movimientos nasales y conservación de L con tramo auricular/apertura variables.

Aceptación en navegador: selección de las ocho bases, A/B/DBL/L, pared con exterior fijo, altura y brazos nuevos, ocho nodos con deshacer/rehacer, foto real de los planos con superposición y calibración, guardar/reabrir y tres PDF de exactamente dos páginas. Se inspeccionaron las capturas de perfiles, modelo y reverso.

La prueba local Electron incluye WebGL, las ocho bases, corrección de perfil, Worker local, JSON, GLB y PDF, con cero solicitudes HTTP. La publicación del instalador queda condicionada a repetir la instalación y prueba del ejecutable en Windows.

## Requisitos que necesitan datos o verificación adicionales

No se declara exactitud de recambio RB2140 sin un trazado auténtico de la talla concreta. Tampoco se certifican ajuste clínico, resistencia, bisagra y taladros específicos, ranura/bisel ópticos, compensación térmica ni impresión física. El frontal 3D representa el blank de acetato, no una simulación de conformado y curvatura óptica.

La entrega es web y Windows x64 offline. No se anuncian instaladores iOS/macOS ni un servicio inexistente de licencias, cobros o correo. El software conserva un repositorio Git local independiente; no se afirma que tenga un remoto separado que no ha podido crearse.


Los seis PDF reales del flujo de referencia tienen dos páginas por formato y cero solapes de texto. Las barras nominales de 100 mm miden 99,998–100,000 mm en el PDF. Esto mide la conversión digital; no una impresión física.
