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

- Cinco siluetas: Panto, Recto, Cat-eye, Aviador y Clubmaster.
- Vista 3D interactiva con Three.js: volumen, luces, materiales, lentes y brazos; cámara frontal, lateral y perspectiva. Alternativa SVG si WebGL no está disponible.
- Aro, espesor, curvatura y ancho del puente, largo de brazos y colores de cada pieza.
- Seis diseños de brazos que se pueden combinar por separado a izquierda y derecha.
- **Base de $209.000**, incluyendo todas las personalizaciones de montura y cristales solares sin graduación. Sin recargos por modelo, espesor, brazos o colores.
- Los únicos suplementos corresponden a cristales graduados y sus tratamientos. Monofocales +$45.000, bifocales +$85.000, multifocales +$145.000. Bluelight +$20.000, antirreflejos +$18.000, fotocromático +$45.000, sol óptico +$25.000.
- **Sol óptico elimina y deshabilita bluelight, fotocromático y antirreflejos**, incluso al restaurar un diseño guardado.
- Fotocromático combinable con antirreflejos, en gris negro, café o lila.
- El precio se recalcula desde la configuración en el estudio y la bolsa, sin confiar en importes guardados.

Son precios referenciales por el par de cristales; falta validación profesional de receta, graduación, índice y viabilidad de fabricación antes de confirmar una cotización real.

## Fotografías y modelos

Las cinco fotografías del selector representan productos físicos de terceros como referencia de silueta: Ray-Ban RB7140, Jeffrey RB4448L, Aviator RB3025-L y Clubmaster RB3016L, más Vogue VO5369S para Cat-eye. No son productos Miscante ni anuncian una colaboración con esas marcas. Procedencia pública y revisión fijada en `public/assets/references/sources.json` y en el selector. Se visualizaron para comprobar que corresponden a cada forma y se optimizaron sin generar o alterar los productos con IA. `scripts/import-reference-photos.mjs` reproduce la importación desde la fuente documentada.

Las imágenes editoriales y de la colección de demostración (`editorial-solar.png`, `collection-studio.png`) siguen siendo imágenes generadas con IA y no fotografías de inventario disponible.

El usuario puede reemplazar la foto de referencia desde su dispositivo, o importar un modelo GLB 2.0 autocontenido de hasta 15 MB. El GLB se visualiza como referencia, no se deforma mediante los controles del modelo paramétrico. Se rechazan modelos que requieren descargar geometría o imágenes externas. Los archivos de referencia son temporales y no se transmiten ni se guardan en el repositorio. Para cambiar permanentemente fotos, fichas y geometría hay que actualizar los archivos fuente y publicar el sitio; no existe un panel de administración.

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

`CHROMIUM_PATH` permite usar otra ruta del navegador. Se verifican el catálogo, bolsa, compra de prueba, navegación entre páginas, generación real de la vista 3D con renderizado de software, brazos combinables, precio base, compatibilidades, colores fotocromáticos, recetas, foto/GLB de referencia y diseños adaptables a 320, 390 y 768 px.

## Publicación

El flujo `.github/workflows/pages.yml` se ejecuta al subir a `main`: instala con lockfile, ejecuta las pruebas, genera el sitio y despliega `docs/` en GitHub Pages. Pages está habilitado con GitHub Actions. La URL de cada despliegue se confirma en el entorno `github-pages`.

![Inicio de Miscante](.github/miscante-preview.png)
