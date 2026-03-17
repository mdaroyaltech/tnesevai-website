// src/components/public/ServiceCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const CAT = {
  tnesevai:   { label:'TNeSevai',    bg:'#f0fdf4', accent:'#15803d', dot:'#22c55e', border:'#bbf7d0' },
  digitalSeva:{ label:'Digital Seva',bg:'#eff6ff', accent:'#1d4ed8', dot:'#3b82f6', border:'#bfdbfe' },
  tnpsc:      { label:'TNPSC',       bg:'#fffbeb', accent:'#b45309', dot:'#f59e0b', border:'#fde68a' },
  education:  { label:'Education',   bg:'#f5f3ff', accent:'#6d28d9', dot:'#8b5cf6', border:'#ddd6fe' },
  other:      { label:'Other',       bg:'#f9fafb', accent:'#374151', dot:'#9ca3af', border:'#e5e7eb' },
};

export default function ServiceCard({ service }) {
  const { i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const name = (isTa && service.nameTa) ? service.nameTa : service.name;
  const desc = (isTa && service.descTa) ? service.descTa : service.desc;
  const cat  = CAT[service.category] || CAT.other;

  return (
    <div className="svc-card" style={{ padding:24, height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', gap:16, flex:1 }}>
        <div className="icon-box" style={{
          width:56, height:56, flexShrink:0, borderRadius:18,
          background:cat.bg, border:`2px solid ${cat.border}`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:26,
        }}>
          {service.icon || '📄'}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <h3 style={{
            fontWeight:700, fontSize:14, color:'#111827', marginBottom:5, lineHeight:1.4,
            display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
          }} className="font-tamil">
            {name}
          </h3>
          {desc && (
            <p style={{
              fontSize:12, color:'#6b7280', lineHeight:1.55,
              display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
            }} className="font-tamil">
              {desc}
            </p>
          )}
        </div>
      </div>

      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        marginTop:18, paddingTop:14, borderTop:`1px solid ${cat.border}`,
      }}>
        <span style={{
          display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px',
          borderRadius:99, fontSize:11, fontWeight:700,
          background:cat.bg, color:cat.accent, border:`1px solid ${cat.border}`,
        }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:cat.dot }} />
          {cat.label}
        </span>
        <span style={{
          display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#16a34a', fontWeight:700,
        }}>
          <span style={{
            width:6, height:6, borderRadius:'50%', background:'#22c55e',
            animation:'bounceDot 1.8s ease-in-out infinite',
          }} />
          Available
        </span>
      </div>
    </div>
  );
}
