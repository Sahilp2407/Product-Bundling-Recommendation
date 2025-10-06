import React, { useEffect, useMemo, useState } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import { catalog } from '../graph';

export default function BundleModal({ open, onClose, baseId, onConfirm, preselectedIds=[] }){
  const recs=useRecommendations(baseId,1);
  const [selected,setSelected]=useState(new Set(preselectedIds));
  useEffect(()=>{ setSelected(new Set(preselectedIds)); },[preselectedIds,open]);

  const items=recs||[];
  const subtotal=useMemo(()=>Array.from(selected).reduce((s,id)=>s+(catalog[id]?.price||0),0),[selected]);

  function toggle(id){ const next=new Set(selected); next.has(id)?next.delete(id):next.add(id); setSelected(next); }
  function confirm(){ onConfirm(Array.from(selected)); }
  if(!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={header}><h3 style={{margin:0,fontWeight:800}}>Complete your bundle</h3><button style={iconBtn} onClick={onClose}>×</button></div>
        <div style={grid}>
          {items.map(p=> (
            <label key={p.id} style={card(selected.has(p.id))}>
              <div style={imgBox}>
                <input type="checkbox" checked={selected.has(p.id)} onChange={()=>toggle(p.id)} style={chk}/>
                <div style={imgPh}>{p.name[0]}</div>
              </div>
              <div style={title}>{p.name}</div>
              <div style={price}>₹{p.price}</div>
            </label>
          ))}
        </div>
        <div style={{marginTop:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:800}}>Accessories Subtotal: ₹{subtotal}</div>
          <div style={{display:'flex',gap:8}}>
            <button style={btnGhost} onClick={onClose}>Skip</button>
            <button style={btnPrimary} onClick={confirm}>Add selected & continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const overlay={position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,backdropFilter:'blur(8px)'};
const modal={width:'min(920px,95vw)',background:'#121214',border:'1px solid #232427',borderRadius:16,padding:16,boxShadow:'0 24px 80px rgba(0,0,0,.28)'};
const header={display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8};
const iconBtn={background:'transparent',border:'none',color:'#fff',fontSize:22,cursor:'pointer'};
const grid={display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12};
const imgBox={position:'relative',background:'linear-gradient(180deg,#1b1c1f,#16171a)',height:140,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:12,overflow:'hidden'};
const imgPh={width:'100%',height:'100%',display:'grid',placeItems:'center',color:'#999',fontSize:48};
const title={fontWeight:800,marginTop:10};
const price={color:'#cfd3d7',fontWeight:700,marginTop:2};
const btnGhost={padding:'10px 12px',borderRadius:10,border:'1px solid #2f3136',background:'transparent',color:'#fff',cursor:'pointer'};
const btnPrimary={padding:'12px 16px',borderRadius:10,border:'none',background:'linear-gradient(180deg,#fff,#dfe3e6)',color:'#111',fontWeight:800,cursor:'pointer'};
const chk={position:'absolute',top:10,left:10,transform:'scale(1.15)',accentColor:'#ff2a2a'};

function card(checked){
  return {display:'block',border:'1px solid '+(checked?'#ff2a2a':'#232427'),background:'#16171a',borderRadius:14,padding:12,cursor:'pointer',boxShadow:checked?'0 0 0 2px #ff2a2a inset, 0 10px 22px rgba(0,0,0,.12)':'none',transition:'transform .18s, box-shadow .18s'};
}
