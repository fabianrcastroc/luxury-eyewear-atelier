import test from 'node:test';
import assert from 'node:assert/strict';
import {products,totals} from '../public/catalog.js';
import {server} from '../server.js';

test('cálculo de bolsa, cantidades y umbral de envío gratuito',()=>{
  assert.deepEqual(totals([]),{subtotal:0,shipping:0,total:0});
  assert.deepEqual(totals([{id:'solar',qty:1}]),{subtotal:159000,shipping:5000,total:164000});
  assert.deepEqual(totals([{id:'solar',qty:2},{id:'forma',qty:1}]),{subtotal:457000,shipping:0,total:457000});
  assert.equal(new Set(products.map(p=>p.id)).size,products.length);
});
test('servidor entrega la tienda, módulos y errores de recursos',async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const base=`http://127.0.0.1:${server.address().port}`;
    const page=await fetch(base);
    assert.equal(page.status,200);
    assert.match(await page.text(),/MISCANTE/);
    const script=await fetch(base+'/app.js');
    assert.match(script.headers.get('content-type'),/javascript/);
    assert.equal((await fetch(base+'/missing')).status,404);
    assert.equal((await fetch(base+'/%2e%2e%2fpackage.json')).status,403);
  } finally {await new Promise(resolve=>server.close(resolve));}
});
