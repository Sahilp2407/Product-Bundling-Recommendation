import React, { useMemo, useState } from 'react';
import BundleModal from './components/BundleModal';
import { createCartStore } from './cart';
import { catalog } from './graph';
import { ensureUser, db, serverTimestamp, collection, addDoc } from './firebase';

const cart=createCartStore();

export default function App(){
  const [modalOpen,setModalOpen]=useState(false);
  const baseId='sonic-pro';
  const base=catalog[baseId];

  const selectedAccessoryIds=useMemo(()=>{
    return cart.get().filter(i=> (catalog[i.id]?.type==='accessory')).map(i=>i.id);
  },[]);

  async function openBundle(){ setModalOpen(true); }

  async function confirmBundle(ids){
    cart.replaceAccessories(ids, catalog);
    const user=await ensureUser();
    const items=[{ id: base.id, name: base.name, price: base.price, qty: 1 }];
    const accessories=ids.map(id=>({ id, name: catalog[id].name, price: catalog[id].price, qty: 1 }));
    const subtotal= base.price + accessories.reduce((s,a)=>s+a.price*a.qty,0);

    await addDoc(collection(db,'orders'),{
      userId:user.uid,
      createdAt:serverTimestamp(),
      items,
      accessories,
      subtotal
    });

    setModalOpen(false);
  }

  const totals=cart.totals();
  const cartItems=cart.get();

  return (
    <div className="container">
      <h1 className="title">Techno‑Gen Sonic Pro</h1>
      <div className="spacer"></div>

      <div className="card">
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>
            <div style={{fontWeight:800,fontSize:20}}>{base.name}</div>
            <div style={{color:'#cfd3d7',fontWeight:700}}>₹{base.price}</div>
          </div>
          <button className="btn" onClick={openBundle}>Bundle & Save</button>
        </div>

        <div className="spacer"></div>
        <div style={{fontWeight:800,marginBottom:6}}>Cart</div>
        <ul style={{margin:0,paddingLeft:18}}>
          {cartItems.map(i=> (
            <li key={i.id}>{i.name} × {i.qty} — <strong>₹{i.price * i.qty}</strong></li>
          ))}
        </ul>
        <div className="spacer"></div>
        <div style={{display:'flex',justifyContent:'space-between',fontWeight:800}}>
          <span>Total</span>
          <span>₹{totals.subtotal}</span>
        </div>
      </div>

      <BundleModal
        open={modalOpen}
        onClose={()=>setModalOpen(false)}
        baseId={baseId}
        preselectedIds={selectedAccessoryIds}
        onConfirm={confirmBundle}
      />
    </div>
  );
}
