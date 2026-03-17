// src/pages/public/ServicesPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { listenServices } from '../../firebase/services';
import ServiceCard from '../../components/public/ServiceCard';
import { FaSearch, FaFilter } from 'react-icons/fa';

const CATS = [
  { key:'all',        label:'All',         labelTa:'அனைத்தும்',     icon:'🏛️' },
  { key:'tnesevai',   label:'TNeSevai',    labelTa:'TNeSevai',      icon:'📋' },
  { key:'digitalSeva',label:'Digital Seva',labelTa:'டிஜிட்டல் சேவா',icon:'💻' },
  { key:'tnpsc',      label:'TNPSC',       labelTa:'TNPSC',         icon:'🎓' },
  { key:'education',  label:'Education',   labelTa:'கல்வி',          icon:'📚' },
  { key:'other',      label:'Other',       labelTa:'மற்றவை',         icon:'⚙️' },
];

const DEFAULT_SERVICES = [
  { name:'Ration Card New', nameTa:'ரேஷன் கார்டு புதிய', icon:'🎫', category:'tnesevai', desc:'New ration card application', descTa:'புதிய ரேஷன் கார்டு விண்ணப்பம்' },
  { name:'Birth Certificate', nameTa:'பிறப்பு சான்றிதழ்', icon:'👶', category:'tnesevai', desc:'Apply and download', descTa:'விண்ணப்பிக்கவும் & பதிவிறக்கவும்' },
  { name:'Community Certificate', nameTa:'சாதி சான்றிதழ்', icon:'📋', category:'tnesevai', desc:'All community certificates', descTa:'அனைத்து சாதி சான்றிதழ்கள்' },
  { name:'Income Certificate', nameTa:'வருமான சான்றிதழ்', icon:'💰', category:'tnesevai', desc:'Annual income certificate', descTa:'ஆண்டு வருமான சான்றிதழ்' },
  { name:'PAN Card', nameTa:'பான் கார்டு', icon:'💳', category:'digitalSeva', desc:'New & correction', descTa:'புதிய & திருத்தம்' },
  { name:'Passport', nameTa:'பாஸ்போர்ட்', icon:'✈️', category:'digitalSeva', desc:'Fresh & renewal', descTa:'புதிய & புதுப்பித்தல்' },
  { name:'TNPSC Group 4', nameTa:'TNPSC குழு 4', icon:'🎓', category:'tnpsc', desc:'CCSE IV application', descTa:'CCSE IV விண்ணப்பம்' },
  { name:'NEET Application', nameTa:'NEET விண்ணப்பம்', icon:'🩺', category:'education', desc:'Medical entrance', descTa:'மருத்துவ நுழைவு' },
];

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const [services, setServices] = useState([]);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { return listenServices(setServices); }, []);

  const data = (services.length > 0 ? services : DEFAULT_SERVICES)
    .filter(s => cat === 'all' || s.category === cat)
    .filter(s => {
      const q = search.toLowerCase();
      return !q || (s.name||'').toLowerCase().includes(q) || (s.nameTa||'').includes(q);
    });

  return (
    <div style={{ background:'#f0fdf4', minHeight:'100vh' }}>
      {/* Header banner */}
      <div style={{
        background:'linear-gradient(135deg,#050f05,#0f2a1a,#15803d)',
        padding:'clamp(36px,6vw,56px) clamp(16px,4vw,24px) clamp(48px,7vw,72px)', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(34,197,94,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.05) 1px,transparent 1px)',
          backgroundSize:'40px 40px',
        }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <p className="anim-fade-up" style={{ color:'#86efac', fontSize:11, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:10 }}>
            ── All Services ──
          </p>
          <h1 className="anim-fade-up d2" style={{ color:'white', fontWeight:900, fontSize:'clamp(1.8rem,4vw,2.75rem)', letterSpacing:'-0.03em', marginBottom:10 }}>
            {t('ourServices')}
          </h1>
          <p className="anim-fade-up d3 font-tamil" style={{ color:'rgba(255,255,255,0.55)', fontSize:14, maxWidth:480, margin:'0 auto' }}>
            {t('servicesDesc')}
          </p>
        </div>
        {/* Wave bottom */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'block' }}>
            <path d="M0 48V24C360 0 720 48 1080 24C1260 12 1380 36 1440 24V48H0Z" fill="#f0fdf4" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth:'80rem', margin:'0 auto', padding:'40px 1.5rem' }}>
        {/* Search + Filter */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:32 }}>
          <div style={{ position:'relative', maxWidth:'100%' }}>
            <FaSearch style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:13 }} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              style={{
                width:'100%', padding:'14px 16px 14px 44px', borderRadius:16,
                border:'2px solid #bbf7d0', background:'white', fontSize:14, fontWeight:500,
                outline:'none', transition:'border-color 0.2s',
              }}
              className="font-tamil"
              onFocus={e => e.target.style.borderColor='#22c55e'}
              onBlur={e => e.target.style.borderColor='#bbf7d0'}
            />
          </div>

          {/* Category filter pills */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {CATS.map(c => (
              <button key={c.key}
                onClick={() => setCat(c.key)}
                style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'8px 18px', borderRadius:99, fontSize:12, fontWeight:700, cursor:'pointer',
                  transition:'all 0.2s', border:'2px solid transparent',
                  background: cat===c.key ? '#15803d' : 'white',
                  color: cat===c.key ? 'white' : '#374151',
                  borderColor: cat===c.key ? '#15803d' : '#e5e7eb',
                  boxShadow: cat===c.key ? '0 4px 16px rgba(21,128,61,0.3)' : 'none',
                  transform: cat===c.key ? 'translateY(-1px)' : 'none',
                }}
              >
                <span>{c.icon}</span>
                {isTa ? c.labelTa : c.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ color:'#6b7280', fontSize:12, fontWeight:600, marginBottom:20 }}>
          {data.length} services found
        </p>

        {data.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'#9ca3af' }}>
            <p style={{ fontSize:'3rem', marginBottom:12 }}>🔍</p>
            <p style={{ fontWeight:600 }}>{t('noData')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap:18 }}>
            {data.map((s,i) => (
              <div key={s.id||i} className="reveal-scale" style={{ transitionDelay:`${(i%8)*0.06}s` }}>
                <ServiceCard service={s} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
