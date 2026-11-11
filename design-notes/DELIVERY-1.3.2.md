# FR eyewear studio 1.3.2 — escritorio y configurador Miscante

## Alcance

El software completo es una aplicación offline de escritorio. Windows usa NSIS,
Linux Debian x64 y macOS DMG en Intel/Apple Silicon. La web pública Miscante parte
solo de Redondo y Cuadrado y conserva sus controles. `/fr/` público redirige al
configurador; `dist/fr/` contiene la aplicación completa para empaquetar.
No hay instalación móvil. Se retiró el manifiesto y se publica un worker de
retirada para desregistrar la caché anterior.

## Geometría y herramientas

- 20 bases: Panto, Boston y Recto 2 se revisaron con las páginas 5/7. Panto aplica
  las cotas anotadas 50 × 45, puente nominal 18 y brazo 140 mm. Se distinguen las
  alturas inferidas de los perfiles que no llevan B anotado.
- 27 perfiles de cristal de la tabla de la página 6: códigos 221–235 y 341–358
  presentes en la tabla, con sus A/B indicados. Curvas digitalizadas, suavizadas
  y reescaladas a esas cotas; no se anuncian como CAD original del fabricante.
- El cristal tiene perfil, anchura y altura independientes del aro. Al seleccionarlo
  se ajusta la base para alojarlo y se activa cristal fijo. Una edición que cruza
  contornos o superpone vaciados se rechaza y conserva el último diseño válido.
- Clásico con ceja cóncava, herradura con bóveda aplanada y hombros, doble con dos
  barras y ventana independiente. Grosor, descenso de ceja, bóveda y posición se
  controlan por separado; un radio de enlace redondea la unión real en el contorno compartido de render y fabricación. La posición de la bisagra se alinea con el hombro temporal.
- Conformado cilíndrico parametrizado por lado. El espesor sigue la normal y la
  unión de brazos/herrajes usa transformación rígida local. GLB/STL llevan el
  conformado; las dos hojas mantienen los patrones planos desarrollados.
- Contornos de las tapas calculados descartando las aristas compartidas de su
  triangulación antes del conformado. No se usa `material.wireframe`. Las guías
  de vista no se incorporan al GLB ni al STL.
- Fondo técnico gris, puntos visibles para medir, coordenadas P1/P2, ajuste a
  nodos y retícula y acceso automático al plano 2D.
- Foto/boceto: recorte en espacio ampliado, umbral, polaridad de fondo y limpieza
  opcional de trazos finos. La detección está en Worker local; no se ha entrenado
  un modelo de IA. Si la imagen no se segmenta, hay trazado cúbico asistido de
  8–64 puntos con calibración A. No se inventa geometría oculta desde una foto.
- Se corrigió un estado que mantenía el cristal de biblioteca activo después de
  importar una foto, impidiendo mostrar su contorno reconocido.

## Solicitudes de Miscante

El cliente descarga un JSON con contacto, medidas y todos los parámetros y puede
preparar un correo. El destino operativo es estudiomiscante@gmail.com; se deja
servicios@miscante.cl preparado mediante `corporateActive` en contact-config.js.
El usuario adjunta el JSON y confirma el envío en su cliente de correo. La web no
informa que haya recibido un pedido ni cobra ni envía correos automáticamente.

## Licencia del escritorio

Licencia comercial por equipo mediante archivo Ed25519 firmado. Evaluación local
30 días; después requiere activación. Se verifican producto, firma, identificador
del equipo y vencimiento. No hay servidor de activación ni envío automático de
identificadores. La autoridad privada del titular queda fuera del repositorio y
del instalador. Debe conservarse su copia segura para emitir licencias futuras.
La firma de licencias no es firma Authenticode/Apple del instalador.

## Validación

96 pruebas unitarias aprobadas de biblioteca, contornos, metrología, espesores, exportación STL,
licencias y solicitudes. Aceptación de navegador de las 20/2 bases, 27 cristales,
edición y deshacer óptico, medición con puntos, GLB sin líneas de guía y solicitud.
Dos referencias reales del PDF (negra y redonda) detectadas, aplicadas y calibradas,
y trazado asistido probado. Licencia firmada activada y conservada al reiniciar.
La publicación de cada instalador exige la prueba del programa empaquetado en su
plataforma; los resultados de CI se registran después de ejecutarse.

## Límites de precisión

Los dibujos mezclan escalas, fotografías, anotaciones y tamaños de fuentes
independientes. Las cotas anotadas se aplican como parámetros nominales; las
curvas rasterizadas se digitalizan y suavizan. Esto no autentica un contorno de
recambio RB2140 ni recupera ranuras, herrajes, compensación térmica, tolerancias
ni superficies ópticas de prescripción. El conformado es geométrico, no una
simulación mecánica del material. La calibración física de impresión y el ajuste
de piezas requieren verificación del taller. No se afirma equivalencia completa
con Rhino ni certificación de fabricación por superar pruebas digitales.

El enlace usa una operación de región con contornos firmados y agujeros. Se descartan únicamente islas numéricas menores de 0,00001 mm², por debajo de la tolerancia de discretización del redondeo; una regresión comprueba la edición de 0,1 mm en Cat-eye.

## Superficies conformadas y macOS

Se subdividen todas las caras mediante planos X comunes a intervalos de 2 mm antes de conformar, conservando grupos de materiales, UV y normales. Las normales se transforman con la inversa transpuesta de la deformación cilíndrica, evitando facetas de sombreado entre triángulos largos. El STL conformado mantiene mallas cerradas en las pruebas. La comprobación macOS espera el cierre real de todas las ventanas antes de simular la activación desde el Dock.

La ejecución automatizada usa SwiftShader en macOS Intel, Windows y Linux. Apple Silicon usa Metal. Estas opciones se aplican únicamente con `--headless-test`; la ejecución normal conserva la selección de GPU de Electron. El runner Intel de GitHub no soporta el Metal forzado y se rechazó su instalador anterior en lugar de publicarlo sin la prueba.

## Resultado de publicación y plataformas

Versión de instaladores 1.3.2, fuente etiquetada `20dfc18`. En la ejecución
https://github.com/fabianrcastroc/luxury-eyewear-atelier/actions/runs/43114635490
pasaron Windows x64 (NSIS instalado), Linux amd64 (paquete extraído) y macOS
Apple Silicon (DMG montado y aplicación copiada). Cada programa empaquetado
verificó WebGL, edición, Worker local, proyectos, GLB, STL y PDF de dos hojas,
sin solicitudes HTTP. Las 96 pruebas unitarias pasaron también en Linux CI.

El estado global de esa ejecución es fallido por la tarea adicional Intel x64:
el runner no pudo inicializar WebGL ni con Metal ni con SwiftShader. Un diagnóstico
posterior probó cuatro backends sin éxito; la prueba con Rosetta no completó
el arranque. No se publicó instalador Intel. No se afirma validación física de
hardware Intel. El flujo principal futuro publica únicamente las plataformas
verificadas; el diagnóstico x64 queda separado para retomar esa compatibilidad.

Se descargaron los tres instaladores públicos y se contrastaron sus SHA-256 con
los archivos publicados. El sitio ofrece Redondo y Cuadrado; `/fr/` redirige a
ese configurador. El estudio completo permanece dentro del paquete de escritorio.

```text
37866070e4b2590c5184f3896d67d191beaf71c9a1df4b7c50f8e64664716607  FR-eyewear-studio-1.3.2-linux-amd64.deb
f2a14a73143777fe30195821fe8996526c3268dd87921a1fad75b59ee7355d62  FR-eyewear-studio-1.3.2-mac-arm64.dmg
cfb077a1dacc3bca47b838ccdc56d38593bc7f3f00550c4ee14ea044271dd1e5  FR-eyewear-studio-1.3.2-win-x64.exe
```
