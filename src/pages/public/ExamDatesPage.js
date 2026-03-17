// src/pages/public/ExamDatesPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { listenExams } from '../../firebase/services';
import ExamCard from '../../components/public/ExamCard';
import { FaCalendarAlt } from 'react-icons/fa';

const STATUS = [
  { key:'all',     label:'All',     labelTa:'அனைத்தும்',          color:'#374151' },
  { key:'ongoing', label:'Ongoing', labelTa:'நடந்துகொண்டிருக்கும்', color:'#15803d' },
  { key:'upcoming',label:'Upcoming',labelTa:'வரவிருக்கும்',         color:'#1d4ed8' },
  { key:'closed',  label:'Closed',  labelTa:'மூடப்பட்டது',          color:'#b91c1c' },
];

export default function ExamDatesPage() {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const [exams, setExams]   = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { return listenExams(setExams); }, []);

  const counts = exams.reduce((a,e) => { a[e.status]=(a[e.status]||0)+1; return a; }, {});
  const display = exams.filter(e => filter==='all' || e.status===filter);

  return (
    <div style={{ background:'#f0fdf4', minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050f05,#0f2a1a,#1d4ed8 150%)', padding:'clamp(36px,6vw,56px) clamp(16px,4vw,24px) clamp(48px,7vw,72px)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(59,130,246,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.06) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div className="anim-fade-up" style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:60, height:60, background:'rgba(255,255,255,0.1)', borderRadius:20, marginBottom:20 }}>
            <FaCalendarAlt style={{ color:'white', fontSize:24 }} />
          </div>
          <h1 className="anim-fade-up d2" style={{ color:'white', fontWeight:900, fontSize:'clamp(1.8rem,4vw,2.75rem)', letterSpacing:'-0.03em', marginBottom:10 }}>
            {t('examAlerts')}
          </h1>
          <p className="anim-fade-up d3 font-tamil" style={{ color:'rgba(255,255,255,0.55)', fontSize:14, maxWidth:480, margin:'0 auto' }}>
            {t('examDesc')}
          </p>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'block' }}>
            <path d="M0 48V24C360 0 720 48 1080 24C1260 12 1380 36 1440 24V48H0Z" fill="#f0fdf4" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth:'80rem', margin:'0 auto', padding:'40px 1.5rem' }}>
        {/* Summary cards */}
        <div className="grid grid-cols-3 sm:grid-cols-3" style={{ gap:12, marginBottom:32 }}>
          {[
            { key:'ongoing',  label:'Ongoing',  labelTa:'நடந்துகொண்டிருக்கும்', bg:'#f0fdf4', color:'#15803d', border:'#bbf7d0' },
            { key:'upcoming', label:'Upcoming', labelTa:'வரவிருக்கும்',          bg:'#eff6ff', color:'#1d4ed8', border:'#bfdbfe' },
            { key:'closed',   label:'Closed',   labelTa:'மூடப்பட்டது',           bg:'#fef2f2', color:'#b91c1c', border:'#fecaca' },
          ].map(s => (
            <div key={s.key} className="reveal-scale" style={{
              background:s.bg, border:`2px solid ${s.border}`, borderRadius:20,
              padding:'20px 16px', textAlign:'center',
            }}>
              <p style={{ fontSize:'2rem', fontWeight:900, color:s.color, lineHeight:1 }}>{counts[s.key]||0}</p>
              <p style={{ fontSize:11, fontWeight:700, color:s.color, marginTop:4 }} className="font-tamil">
                {isTa ? s.labelTa : s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
          {STATUS.map(s => (
            <button key={s.key}
              onClick={() => setFilter(s.key)}
              style={{
                padding:'8px 20px', borderRadius:99, fontSize:12, fontWeight:700, cursor:'pointer',
                transition:'all 0.2s', border:'2px solid transparent',
                background: filter===s.key ? s.color : 'white',
                color: filter===s.key ? 'white' : '#374151',
                borderColor: filter===s.key ? s.color : '#e5e7eb',
                transform: filter===s.key ? 'translateY(-1px)' : 'none',
              }}
            >
              {isTa ? s.labelTa : s.label} {s.key!=='all' && `(${counts[s.key]||0})`}
            </button>
          ))}
        </div>

        {/* Exams grid */}
        {display.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#9ca3af' }}>
            <p style={{ fontSize:'3rem', marginBottom:12 }}>📅</p>
            <p style={{ fontWeight:600 }}>{t('noData')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap:18 }}>
            {display.map((e,i) => (
              <div key={e.id||i} className="reveal-scale" style={{ transitionDelay:`${(i%6)*0.07}s` }}>
                <ExamCard exam={e} />
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="reveal" style={{ marginTop:32, padding:20, background:'#fffbeb', border:'1px solid #fde68a', borderRadius:20 }}>
          <p style={{ fontSize:12, color:'#92400e' }}>
            ⚠️ <strong>Note:</strong> Dates shown are indicative. Always verify from official websites before applying.
          </p>
          <p style={{ fontSize:12, color:'#b45309', marginTop:4 }} className="font-tamil">
            ⚠️ <strong>குறிப்பு:</strong> காட்டப்பட்ட தேதிகள் தோராயமானவை. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ இணையதளத்தில் சரிபார்க்கவும்.
          </p>
        </div>
      </div>
    </div>
  );
}
