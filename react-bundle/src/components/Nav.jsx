import React from 'react';

export default function Nav({ category, setCategory, onLoginClick, user }){
  const tabs = [
    { id: 'earbuds', label: 'Earbuds' },
    { id: 'phones', label: 'Phones' }
  ];
  return (
    <div style={wrap}>
      <div style={tabsWrap}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setCategory(t.id)}
            style={tabBtn(category === t.id)}
          >{t.label}</button>
        ))}
      </div>
      <div>
        {user ? (
          <span style={{fontWeight:700}}>Hi, {user.email || user.uid.slice(0,6)}</span>
        ) : (
          <button style={loginBtn} onClick={onLoginClick}>Login / Signup</button>
        )}
      </div>
    </div>
  );
}

const wrap = { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 };
const tabsWrap = { display:'flex', gap:8 };
const tabBtn = (active)=>({ padding:'10px 14px', borderRadius:12, border: active?'1px solid #ff2a2a':'1px solid #2f3136', background: active?'#1b1c1f':'transparent', color:'#fff', cursor:'pointer', fontWeight:800 });
const loginBtn = { padding:'10px 14px', borderRadius:10, border:'1px solid #2f3136', background:'transparent', color:'#fff', cursor:'pointer', fontWeight:700 };
