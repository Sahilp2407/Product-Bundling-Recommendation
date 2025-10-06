export function createCartStore(){
  let items=[]; // [{id,name,price,qty}]
  const listeners=new Set();
  const notify=()=>listeners.forEach(l=>l(items));
  const subscribe=(fn)=>{listeners.add(fn); return ()=>listeners.delete(fn);} 
  const get=()=>items.slice();

  function addMany(newItems=[]){
    const map=new Map(items.map(i=>[i.id,{...i}]));
    for(const n of newItems){
      const cur=map.get(n.id);
      if(cur) cur.qty=(cur.qty||1)+(n.qty||1); else map.set(n.id,{...n, qty:n.qty||1});
    }
    items=Array.from(map.values());
    notify();
  }

  function replaceAccessories(selectedIds, catalog){
    const set=new Set(selectedIds);
    const next=items.filter(i=>catalog[i.id]?.type!=="accessory");
    for(const id of set){ next.push({ id, name:catalog[id].name, price:catalog[id].price, qty:1 }); }
    items=next; notify();
  }

  function totals(){
    const subtotal=items.reduce((s,i)=>s+i.price*(i.qty||1),0);
    return { subtotal };
  }

  return { subscribe, get, addMany, replaceAccessories, totals };
}
