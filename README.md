# Miscante — Estudio de gafas

Sitio editorial en español con colección de autor y estudio de diseño personal. Precios en pesos chilenos.

**Web publicada:** https://fabianrcastroc.github.io/luxury-eyewear-atelier/

- Inicio: `index.html`
- Colección: `coleccion.html`
- Estudio personal: `disena.html`

Son páginas independientes. La bolsa se conserva entre páginas. Los enlaces anteriores `/#disena` y `/#coleccion` llevan a las nuevas páginas.

## Desarrollo

Node.js 22 o posterior:

```sh
npm ci
npm start
```

Abre el puerto 3000 del equipo donde ejecutas el servidor. Para cambiarlo, usa `PORT`. El servidor empaqueta el JavaScript con esbuild durante desarrollo.

```sh
npm run build
```

Genera el sitio estático completo en `docs/` y `dist/`. Conserva las tres páginas, módulos empaquetados y archivos locales. Sirve esa carpeta con un servidor estático; ya no se distribuye como un único HTML independiente. `Miscante.html` mantiene compatibilidad redirigiendo al inicio del sitio.

## Estudio personal

- Cuatro siluetas: Recto de proporción compacta, Redondo circular, Ovalado de inspiración aviador sin doble puente predeterminado y Curvo con ceja de acetato y aro inferior fino.
- Vista 3D interactiva con Three.js: volumen, luces, materiales, lentes y brazos de sección plana y curva variable. Cámara frontal, lateral y perspectiva; cambiar una opción conserva la posición girada por el usuario. Geometría compartida con el SVG alternativo si WebGL no está disponible.
- Estudio de producto de pantalla completa con cuatro paneles accesibles: Modelo, Montura, Cristales y Receta. Solo un panel visible; navegación por teclado y Receta disponible al seleccionar graduación.
- Tallas A/P 48/16, 52/17 y 56/18, patillas B de 135/140/145/150 mm; cambiar talla conserva la silueta. Puente clásico, doble o herradura, posiciones relativas alta/media/baja, espesor y curva solo del borde nasal: los controles de diseño del puente no separan los aros. Ancho del brazo desde 4 mm hasta la altura completa del aro; el gancho conserva su geometría y su posición depende solo del largo nominal B. Se retiró la extensión manual. Puente de 5 a 12 mm. Todos los modelos incluyen medias lunas nasales interiores fijas. La pronunciación modifica exclusivamente el borde nasal del propio aro; no altera las medias lunas ni el cristal, y en Curvo también pertenece al mismo aro metálico. Colores independientes por pieza.
- Seis diseños de brazos con una selección común para ambos lados. Se normalizan los diseños antiguos para impedir combinaciones independientes. La sección del brazo se limita a los extremos verticales del aro, incluyendo el desplazamiento de su eje.
- **Base de $209.000**, incluyendo todas las personalizaciones de montura y cristales solares sin graduación. Sin recargos por modelo, espesor, brazos o colores.
- Los únicos suplementos corresponden a cristales graduados y sus tratamientos. Monofocales +$45.000, bifocales +$85.000, multifocales +$145.000. Bluelight +$20.000, antirreflejos +$18.000, fotocromático +$45.000, sol óptico +$25.000.
- **Sol óptico elimina y deshabilita bluelight, fotocromático y antirreflejos**, incluso al restaurar un diseño guardado.
- Fotocromático combinable con antirreflejos, en gris negro, café o lila.
- El precio se recalcula desde la configuración en el estudio y la bolsa, sin confiar en importes guardados.

Son precios referenciales por el par de cristales; falta validación profesional de receta, graduación, índice y viabilidad de fabricación antes de confirmar una cotización real.

## Fotografías y modelos

Se retiraron las fotografías de terceros del selector porque no correspondían de manera consistente a las siluetas personalizables. Las imágenes de `public/assets/forms/` se generan desde la misma geometría y materiales que la vista editable. No se presentan como fotografías de producto ni como modelos Ray-Ban. Con el servidor iniciado, `npm run render:previews` vuelve a generarlas si se modifica la geometría. Las pruebas verifican las cuatro siluetas, la separación constante al editar el puente y la conservación del gancho de la patilla al variar la anchura.

La portada editorial (`atelier-editorial.webp`) es una imagen original generada con IA; no es una fotografía documental del taller Miscante ni una imagen de Maison Bonnet. La nueva invitación al estudio (`personal-atelier.webp`) es una composición editorial original generada con IA, tampoco una fotografía documental de producto. Las otras imágenes editoriales y de la colección de demostración (`editorial-solar.png`, `collection-studio.png`) también son generadas con IA y no fotografías de inventario disponible.

El usuario puede abrir «Comparar una referencia» y seleccionar una foto personal o un GLB 2.0 autocontenido de hasta 15 MB. La foto se muestra en un diálogo separado. El GLB se muestra en otra vista 3D dentro del mismo diálogo; nunca reemplaza el diseño principal. Las referencias no se deforman ni sustituyen silenciosamente el producto al usar sus controles. Se rechazan modelos que requieren descargar geometría o imágenes externas. Los archivos de referencia son temporales y no se transmiten ni se guardan en el repositorio. Para cambiar permanentemente fotos, fichas y geometría hay que actualizar los archivos fuente y publicar el sitio; no existe un panel de administración.

El render 3D es una visualización de diseño, no un archivo CAD listo para fabricación.

## Recetas y compra de prueba

Recetas PDF, JPEG, PNG o WebP hasta 10 MB, con validación de extensión, MIME y firma; las imágenes tienen vista previa. El documento se mantiene **solo en memoria durante la página actual**. Nunca se sube a un servidor, guarda en localStorage o incorpora al repositorio. Al recargar o navegar a otra página se debe adjuntar nuevamente. La bolsa permite reemplazarlo, retirarlo o dejarlo pendiente. No usar datos médicos reales para probar.

El carrito, favoritos y diseños se guardan localmente. No hay cobros, pedidos comerciales, inventario, recepción de documentos ni envío de correos. Para operar ventas se necesita un backend con validación de precios y recepción segura de recetas, además de pagos y gestión de pedidos.

## Pruebas

```sh
npm test
# Con el servidor iniciado y Chromium instalado:
npm run test:browser
npm run test:designer
```

`CHROMIUM_PATH` permite usar otra ruta del navegador. Se verifican el catálogo, bolsa, compra de prueba, navegación entre páginas, generación real de la vista 3D con renderizado de software, conservación de cámara, cambios de píxeles ante modificaciones de geometría y materiales, seis brazos visualmente distintos, referencias separadas, paneles por teclado, precio base, compatibilidades, colores fotocromáticos, recetas, foto/GLB de referencia y diseños adaptables a 320, 390 y 768 px.

## Publicación

El flujo `.github/workflows/pages.yml` se ejecuta al subir a `main`: instala con lockfile, ejecuta las pruebas, genera el sitio y despliega `docs/` en GitHub Pages. Pages está habilitado con GitHub Actions. La URL de cada despliegue se confirma en el entorno `github-pages`.

![Inicio de Miscante](.github/miscante-preview.png)

## Guía de talla

El código A □ P–B usa medidas nominales en milímetros. No constituye un plano de fabricación. La guía compara el ancho frontal aproximado con una medida de rostro facilitada por el usuario; no guarda esa medida y no aplica una recomendación fuera del rango disponible. No infiere distancia pupilar ni largo de patilla.

Se leyó la [guía pública comunitaria SPECS](https://github.com/GODFREYnganga/Specs/blob/648c536e2b967157699546e1d58521d6560c2790/components/size-guide.tsx) para contrastar las definiciones y señales de comodidad. No es una norma clínica. Los enlaces adicionales de Warby Parker y Zenni son consultas complementarias: su contenido no se pudo verificar desde este entorno por restricciones de red. Las posiciones del puente y la recomendación geométrica son decisiones del configurador y requieren evaluación óptica profesional.

## Cristales en la colección

Cada ficha permite añadir graduación monofocal, bifocal o multifocal, tratamientos y colores fotocromáticos con las mismas exclusiones y suplementos del estudio. Se conserva el precio base de cada producto. `productQuote` reutiliza los suplementos de `designQuote`; la bolsa recalcula cada importe desde la configuración. Las variantes de una misma montura se conservan separadas. Los artículos de bolsa antiguos sin opciones conservan su precio base.

Se puede adjuntar PDF o imagen de receta en la ficha o en la bolsa, con validación de formato, firma y tamaño. El archivo nunca se serializa ni se envía. Al recargar queda pendiente. La compra sigue siendo de demostración.

Con el servidor activo, `npm run test:collection` verifica los seis productos, graduación, tratamientos, precios, archivos, variantes, persistencia, bolsa y móvil.
