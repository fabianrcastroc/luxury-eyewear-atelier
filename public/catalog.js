export const products = [
  {id:'solar',name:'Solar',category:'sol',shape:'square',color:'Miel translúcida',hex:'#98602f',lens:'#544d31',price:159000,material:'Acetato',size:'51 · 21 · 145',tag:'SELECCIÓN MISCANTE',bg:'#ece9e0'},
  {id:'noir',name:'Noir',category:'sol',shape:'cat',color:'Negro profundo',hex:'#242422',lens:'#343a35',price:169000,material:'Acetato',size:'53 · 19 · 145',tag:'',bg:'#e5e7e2'},
  {id:'forma',name:'Forma',category:'optica',shape:'round',color:'Champagne',hex:'#baa078',lens:'#d5d9ce',price:139000,material:'Titanio',size:'49 · 20 · 140',tag:'NUEVA PERSPECTIVA',bg:'#eee6dc'},
  {id:'terra',name:'Terra',category:'sol',shape:'round',color:'Carey cálido',hex:'#71432d',lens:'#5c4837',price:179000,material:'Acetato',size:'50 · 22 · 145',tag:'',bg:'#e9e1d5'},
  {id:'linea',name:'Línea',category:'optica',shape:'square',color:'Oliva transparente',hex:'#72765b',lens:'#d7ddd0',price:149000,material:'Acetato',size:'51 · 20 · 145',tag:'',bg:'#e1e5dc'},
  {id:'aura',name:'Aura',category:'sol',shape:'cat',color:'Ámbar',hex:'#af713c',lens:'#705238',price:189000,material:'Acetato',size:'52 · 20 · 145',tag:'EDICIÓN DE ESTUDIO',bg:'#eee4d6'}
];
export const money = n => new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n);
export function totals(cart) {
  const subtotal = cart.reduce((n,item)=>n+(products.find(p=>p.id===item.id)?.price || 0)*item.qty,0);
  const shipping = subtotal === 0 || subtotal >= 200000 ? 0 : 5000;
  return {subtotal,shipping,total:subtotal+shipping};
}
export function glasses(p) {
  const index = products.findIndex(item=>item.id===p.id);
  return `<span class="studio-product" role="img" aria-label="Gafas ${p.name}, ${p.color}" style="--photo-x:${index%3*50}%;--photo-y:${index<3?0:100}%"></span>`;
}
