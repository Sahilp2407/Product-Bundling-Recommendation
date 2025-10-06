// Graph model for recommendations (O(V+E) BFS)
export const catalog = {
  // Core devices
  'sonic-pro': { id:'sonic-pro', name:'Techno‑Gen Sonic Pro', price:1499, type:'device' },
  'wave-call-2': { id:'wave-call-2', name:'Techno‑Gen Wave Call 2', price:1699, type:'device' },
  // Phones category
  'iphone-15': { id:'iphone-15', name:'iPhone 15', price:69999, type:'device', category:'phones' },
  'galaxy-s23': { id:'galaxy-s23', name:'Samsung Galaxy S23', price:64999, type:'device', category:'phones' },
  'oneplus-12': { id:'oneplus-12', name:'OnePlus 12', price:59999, type:'device', category:'phones' },
  'tg-laptop-a1': { id:'tg-laptop-a1', name:'Techno‑Gen Laptop A1', price:45999, type:'device' },

  // Accessories
  'earbuds-case': { id:'earbuds-case', name:'Earbuds Silicone Case', price:299, type:'accessory' },
  'foam-tips': { id:'foam-tips', name:'Memory Foam Ear Tips (Pack)', price:199, type:'accessory' },
  'fast-charger': { id:'fast-charger', name:'20W Type‑C Fast Charger', price:799, type:'accessory' },
  'watch-strap': { id:'watch-strap', name:'Watch Strap', price:399, type:'accessory' },
  'watch-guard': { id:'watch-guard', name:'Watch Screen Guard', price:199, type:'accessory' },
  'watch-charger': { id:'watch-charger', name:'Watch Charger', price:599, type:'accessory' },
  'phone-cover': { id:'phone-cover', name:'Phone Cover', price:299, type:'accessory' },
  'power-bank': { id:'power-bank', name:'10,000mAh Power Bank', price:1299, type:'accessory' },
  'earbuds': { id:'earbuds', name:'Wireless Earbuds', price:1499, type:'accessory' },
  'laptop-bag': { id:'laptop-bag', name:'Laptop Bag', price:999, type:'accessory' },
  'cooling-pad': { id:'cooling-pad', name:'Cooling Pad', price:899, type:'accessory' },
  'mouse': { id:'mouse', name:'Wireless Mouse', price:599, type:'accessory' }
};

export const graph = new Map(Object.keys(catalog).map(id => [id, new Set()]));
function link(a,b){ graph.get(a)?.add(b); graph.get(b)?.add(a); }

// Edges
link('sonic-pro','earbuds-case');
link('sonic-pro','foam-tips');
link('sonic-pro','fast-charger');
link('wave-call-2','watch-strap');
link('wave-call-2','watch-guard');
link('wave-call-2','watch-charger');
// Phone edges
for (const pid of ['iphone-15','galaxy-s23','oneplus-12']) {
  link(pid,'phone-cover');
  link(pid,'power-bank');
  link(pid,'earbuds');
}
link('tg-laptop-a1','laptop-bag');
link('tg-laptop-a1','cooling-pad');
link('tg-laptop-a1','mouse');
link('power-bank','fast-charger');

// BFS traversal to gather related accessories for a base node
export function bfsAccessories(startId, maxDepth=1){
  const visited = new Set();
  const queue = [{id:startId, depth:0}];
  const results = new Set();
  while(queue.length){
    const {id, depth} = queue.shift();
    if(visited.has(id)) continue; visited.add(id);
    if(id!==startId && catalog[id]?.type==='accessory') results.add(id);
    if(depth < maxDepth){
      for(const nei of (graph.get(id)||[])) if(!visited.has(nei)) queue.push({id:nei, depth:depth+1});
    }
  }
  return Array.from(results);
}
