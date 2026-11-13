# FR eyewear studio 1.5.0

La observación nueva describe aros con bultos y recuerda que el puente forma parte de la misma plancha. Se revisó la página del PDF y se contrastó con la construcción existente y los recursos gráficos previos.

## Construcción y edición

Se elimina la unión de lóbulos `base + shaped + seat` como contorno final de cada aro; una envolvente convexa integra la reserva temporal. Los modificadores paramétricos siguen terminando en una envolvente convexa y no crean reflexiones o montañas automáticas. Esto cambia la construcción, no solo el suavizado de pantalla.

El editor utiliza B-splines periódicas cúbicas, 4–32 controles y coordenadas reales X/Y, con escala ancho/alto y movimientos por control, vecinos, mitad o conjunto. La curva tiene continuidad C2, está protegida por convexidad salvo autorización explícita de concavidades intencionales, y rechaza cruces y paredes menores al mínimo configurado. Abrir el editor prepara un borrador sin alterar la geometría. La reconstrucción es aproximada: se muestra la desviación contra el perfil anterior. Las ediciones exteriores congelan la abertura óptica; las curvas interiores pueden editarse por separado. Las capas y el material de aros y puente quedan ligados como frontal integral.

Los proyectos versión 6 almacenan controles y contornos congelados; versiones 1–5 siguen siendo legibles con actualización declarada. El render 3D se difiere mientras se arrastra un control en 2D y se confirma al soltar. Las exportaciones conservan curvas, medidas y material; se eliminan los colores temporales de selección del GLB.

## Biblioteca óptica

31 tarjetas SVG con códigos, medidas, buscador y vista ampliada. Las cotas de la tabla se mantienen; las curvas se reconstruyen como perfiles cúbicos convexos y se conserva el calco rasterizado en `referenceContour` para trazabilidad. Los entrantes por sombras y oclusiones no se consideran formas físicas de lentes. La edición permite concavidades intencionales si el diseñador las necesita. El script `regularize-optical-library.mjs` reproduce la autoría a partir de los calcos guardados; no se afirma haber entrenado un modelo de aprendizaje automático ni recuperar CAD auténtico de fotografías.

## Verificación

107 pruebas unitarias aprobadas: límites paramétricos, continuidad cúbica, 31 A/B, apertura congelada, paredes, color integral, sólidos STL, referencias y licencias. Aceptación de navegador: tarjetas, X/Y, borrador sin modificación, rechazo de pared insegura, proyecto v6 y frontal GLB de un material. Aceptación completa: cuatro vistas, deshacer/rehacer, papel A4/Carta/Oficio con dos hojas y funcionamiento de controles. Se registrarán los resultados de los paquetes y del despliegue una vez ejecutados.

## Referencia de video y alcance

El usuario aportó https://www.youtube.com/watch?v=zllB1l6evfY . La conexión fue rechazada por la política de red. Se guardó una propuesta de acceso, que no equivale a aplicarla: la observación de la revisión 3 seguía sin permitir YouTube. No se afirma haber visto el video. El trabajo se fundamenta en el PDF y las referencias gráficas disponibles.

Sin cambio de clave de licencias; la autoridad privada se conserva fuera del repositorio. Windows x64, Linux amd64 y macOS Apple Silicon; Intel pendiente de validación. Sin firma/notarización. Las ranuras, herrajes, tolerancias y encajes requieren comprobación física de taller; se mantiene el plano desarrollado y no se certifica encaje RB2140.

La prueba local de Electron terminó correctamente: WebGL, Worker sin conexión, edición cúbica, proyecto versión 6, GLB, STL y PDF de dos hojas; cero solicitudes HTTP externas y cero errores. Capturas del selector y del editor verificadas visualmente, además de la aceptación DOM.
