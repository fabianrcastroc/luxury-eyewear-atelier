# Miscante — Handmade Eyewear

Tienda de gafas de estética editorial, en español y con precios ilustrativos en pesos chilenos. Aplicación adaptable a móviles, sin dependencias de ejecución ni servicios externos.

## Ver la tienda

Con Node.js 22 o posterior, desde este directorio:

```sh
npm start
```

Abre el navegador en el puerto 3000 del equipo donde ejecutas el comando. Puedes cambiarlo con la variable `PORT`. En una máquina remota necesitas reenvío de puerto; el servidor no crea un enlace público.

También puedes ejecutar `npm run build` y abrir `dist/Miscante.html` directamente en un navegador. Este archivo incluye todos los estilos, ilustraciones y funciones; no necesita servidor ni conexión. Para una URL pública, puedes subir el contenido de `public/` a un alojamiento estático como Netlify o Cloudflare Pages, o subir el HTML generado renombrado a `index.html`. Publicar requiere una cuenta de alojamiento; esta implementación no ha sido publicada.

## Funciones

- Catálogo de seis modelos con imágenes locales de estudio, categorías, búsqueda y ordenación.
- Detalle de materiales, medidas, color y precio de cada modelo.
- Favoritos y carrito persistentes en el navegador, cantidades y eliminación de productos.
- Cálculo de envío: $5.000, gratis desde $200.000.
- Compra de demostración con validación de formulario y confirmación sin cobros.
- Registro local de suscripción, preguntas frecuentes, cuidados y privacidad.
- Diálogos accesibles con cierre por Escape, etiquetas de formulario, foco visible y respeto por movimiento reducido.

## Validación

```sh
npm test
npm run build
# Con Chromium instalado (o CHROMIUM_PATH definido):
npm run test:browser
```

Las pruebas automatizadas verifican importes, envío, entrega de recursos y protección contra acceso fuera de la carpeta pública. También se comprobó con Chromium el recorrido de búsqueda, favoritos, carrito persistente, compra de prueba y diseño móvil.

## Antes de vender

El catálogo, precios, atributos e ilustraciones son de demostración. No hay backend, inventario real, pagos, envío de correos ni recepción de formularios. El contacto explica su disponibilidad futura. La suscripción solo registra una preferencia local; no envía el correo. Los datos de entrega no se transmiten ni se conservan al confirmar la prueba. No introduzcas información real en la demostración.

Para habilitar ventas se deben confirmar el catálogo y las políticas comerciales, conectar pagos con validación de precios en el servidor, inventario, pedidos, envíos y atención al cliente. Nunca incluir claves privadas en el código del navegador.

## Publicación en GitHub Pages

El repositorio incluye el workflow `.github/workflows/pages.yml`: verifica la tienda, genera los archivos y despliega `docs/` al subir cambios a `main`. En GitHub, **Settings → Pages → Build and deployment → Source → GitHub Actions** debe estar habilitado. El resultado de cada publicación aparece en **Actions → Publicar Miscante**. La URL definitiva y su estado se muestran en el entorno **github-pages**; una URL prevista no confirma que la publicación haya terminado.

También se puede publicar desde una rama seleccionando `main` y `/docs` en Pages. No combines ambos modos.

`npm run build` actualiza `docs/` y crea `dist/Miscante.html`, con imágenes incrustadas para abrirlo sin servidor. En GitHub puedes descargar la copia `docs/Miscante.html` con **Download raw file** y abrir el archivo descargado.

Las fotografías editoriales y de catálogo fueron generadas con IA para representar el concepto visual; no son fotografías de productos físicos disponibles. Deben reemplazarse con fotografías y especificaciones verificadas antes de vender.

![Vista de Miscante](.github/miscante-preview.png)
