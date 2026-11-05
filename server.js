import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('./public/', import.meta.url)));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
export const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    const data = await readFile(target);
    res.writeHead(200, {'Content-Type':types[path.extname(target)] || 'application/octet-stream','X-Content-Type-Options':'nosniff'}).end(data);
  } catch { res.writeHead(404).end('No encontrado'); }
});
if (process.argv[1] === fileURLToPath(import.meta.url)) server.listen(Number(process.env.PORT || 3000),'0.0.0.0',()=>console.log('Miscante disponible en el puerto ' + (process.env.PORT || 3000)));
