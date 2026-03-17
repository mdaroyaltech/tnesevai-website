// src/components/public/ExamCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

const STATUS_STYLE = {
  upcoming:{ bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe', label:'Upcoming', labelTa:'வரவிருக்கும்' },
  ongoing: { bg:'#f0fdf4', color:'#15803d', border:'#bbf7d0', label:'Ongoing',  labelTa:'நடந்துகொண்டிருக்கும்' },
  closed:  { bg:'#fef2f2', color:'#b91c1c', border:'#fecaca', label:'Closed',   labelTa:'மூடப்பட்டது' },
};

const fmt = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
};
const daysLeft = (d) => {
  if (!d) return null;
  return Math.ceil((new Date(d) - new Date()) / 86400000);
};

export default function ExamCard({ exam, compact = false }) {
  const { i18n } = useTranslation();
  const isTa  = i18n.language === 'ta';
  const name  = (isTa && exam.nameTa) ? exam.nameTa : exam.name;
  const days  = daysLeft(exam.lastDate);
  const urgent= days !== null && days >= 0 && days <= 7;
  const st    = STATUS_STYLE[exam.status] || STATUS_STYLE.upcoming;

  return (
    <div className="exam-card" style={{ padding:20 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:compact?8:14 }}>
        <div style={{
          width:44, height:44, borderRadius:14, flexShrink:0,
          background:st.bg, border:`2px solid ${st.border}`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
        }}>
          {exam.icon || '🎓'}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
            <h3 style={{ fontWeight:800, fontSize:14, color:'#111827', lineHeight:1.35 }} className="font-tamil">
              {name}
            </h3>
            <span style={{
              flexShrink:0, display:'inline-flex', padding:'3px 10px', borderRadius:99,
              fontSize:10, fontWeight:800, background:st.bg, color:st.color, border:`1px solid ${st.border}`,
            }}>
              {isTa ? st.labelTa : st.label}
            </span>
          </div>
          {exam.body && <p style={{ color:'#6b7280', fontSize:11, marginTop:2 }}>{exam.body}</p>}
        </div>
      </div>

      {!compact && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          <div style={{ background:'#fffbeb', borderRadius:14, padding:'12px 14px' }}>
            <p style={{ fontSize:10, fontWeight:800, color:'#b45309', display:'flex', alignItems:'center', gap:4, marginBottom:4 }}>
              <FaClock style={{ fontSize:9 }} /> Last Date
            </p>
            <p style={{ fontWeight:800, color:'#92400e', fontSize:13 }}>{fmt(exam.lastDate)}</p>
            {days !== null && days >= 0 && (
              <p style={{ fontSize:10, fontWeight:700, color: days<=7?'#ef4444':'#b45309', marginTop:2 }}>
                {days === 0 ? '🚨 Today!' : `${days} days left`}
              </p>
            )}
            {days !== null && days < 0 && <p style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>Expired</p>}
          </div>
          <div style={{ background:'#eff6ff', borderRadius:14, padding:'12px 14px' }}>
            <p style={{ fontSize:10, fontWeight:800, color:'#1d4ed8', display:'flex', alignItems:'center', gap:4, marginBottom:4 }}>
              <FaCalendarAlt style={{ fontSize:9 }} /> Exam Date
            </p>
            <p style={{ fontWeight:800, color:'#1e40af', fontSize:13 }}>{fmt(exam.examDate)}</p>
          </div>
        </div>
      )}

      {compact && exam.lastDate && (
        <p style={{ fontSize:11, color:'#b45309', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
          <FaClock style={{ fontSize:9 }} /> Last Date: {fmt(exam.lastDate)}
          {days !== null && days >= 0 && (
            <span style={{ color: days<=7?'#ef4444':'#b45309', marginLeft:4 }}>
              ({days===0?'Today!': `${days}d left`})
            </span>
          )}
        </p>
      )}

      {exam.applyLink && exam.status !== 'closed' && (
        <a href={exam.applyLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', display:'block' }}>
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            background:'linear-gradient(135deg,#15803d,#22c55e)',
            color:'white', fontWeight:700, padding:'10px 16px',
            borderRadius:14, fontSize:12, cursor:'pointer', marginTop:12,
            boxShadow:'0 4px 12px rgba(34,197,94,0.3)', transition:'all 0.2s',
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';}}
          >
            <FaExternalLinkAlt style={{ fontSize:10 }} /> Apply Now
          </div>
        </a>
      )}
    </div>
  );
}
