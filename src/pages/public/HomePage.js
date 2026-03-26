// src/pages/public/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { listenServices, listenExams, getContactSettings } from '../../firebase/services';
import ServiceCard from '../../components/public/ServiceCard';
import DocsModal from '../../components/public/DocsModal';
import HomeSearch from '../../components/public/HomeSearch';
import ExamCard from '../../components/public/ExamCard';
import {
  FaConciergeBell, FaCalendarAlt, FaArrowRight, FaWhatsapp,
  FaCheckCircle, FaBolt, FaUsers, FaShieldAlt, FaLaptop, FaTools, FaPrint,
} from 'react-icons/fa';

const STATS = [
  {
    icon: '📄',
    value: '25,000+',
    label: 'Applications Processed',
    labelTa: 'செயல்படுத்தப்பட்ட விண்ணப்பங்கள்'
  },
  { icon: '⚡', value: '24hr', label: 'Fast Service', labelTa: 'வேக சேவை' },
  { icon: '✅', value: '100%', label: 'Authorized', labelTa: 'அங்கீகரிக்கப்பட்டது' },
  { icon: '🏆', value: '15+', label: 'Yrs Experience', labelTa: 'ஆண்டுகள் அனுபவம்' },
];

const QUICK = [
  { icon: '📋', en: 'Application Forms', ta: 'விண்ணப்ப படிவங்கள்' },
  { icon: '🎫', en: 'Ration Card', ta: 'ரேஷன் கார்டு' },
  { icon: '🎓', en: 'TNPSC / NEET', ta: 'TNPSC / NEET' },
  { icon: '💻', en: 'Digital Seva', ta: 'டிஜிட்டல் சேவா' },
  { icon: '📱', en: 'Mobile / DTH', ta: 'மொபைல் / DTH' },
  { icon: '🖨', en: 'Print & Xerox', ta: 'பிரிண்ட் & ஸீரோக்ஸ்' },
];

const DEFAULT_SVC = [
  { name: 'Ration Card', nameTa: 'ரேஷன் கார்டு', icon: '🎫', category: 'tnesevai', desc: 'New / Correction / Surrender', descTa: 'புதிய / திருத்தம் / ஒப்படைப்பு' },
  { name: 'Birth / Death Certificate', nameTa: 'பிறப்பு / இறப்பு சான்றிதழ்', icon: '📜', category: 'tnesevai', desc: 'Apply online & download', descTa: 'ஆன்லைனில் விண்ணப்பிக்கவும்' },
  { name: 'Community Certificate', nameTa: 'சாதி சான்றிதழ்', icon: '📋', category: 'tnesevai', desc: 'BC, MBC, SC, ST certificates', descTa: 'அனைத்து சாதி சான்றிதழ்கள்' },
  { name: 'Income Certificate', nameTa: 'வருமான சான்றிதழ்', icon: '💰', category: 'tnesevai', desc: 'Annual income certificate', descTa: 'ஆண்டு வருமான சான்றிதழ்' },
  { name: 'PAN Card', nameTa: 'பான் கார்டு', icon: '💳', category: 'digitalSeva', desc: 'New application & corrections', descTa: 'புதிய விண்ணப்பம் & திருத்தம்' },
  { name: 'TNPSC Application', nameTa: 'TNPSC விண்ணப்பம்', icon: '🎓', category: 'tnpsc', desc: 'Group 1, 2, 4, VAO & more', descTa: 'குழு 1, 2, 4, VAO மற்றும் மேலும்' },
];

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const [services, setServices] = useState([]);
  const [exams, setExams] = useState([]);
  const [waNum, setWaNum] = useState('');
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const u1 = listenServices(setServices);
    const u2 = listenExams(setExams);
    getContactSettings().then(d => { if (d?.whatsapp) setWaNum(d.whatsapp.replace(/\D/g, '')); });
    return () => { u1(); u2(); };
  }, []);

  const displaySvc = services.length > 0 ? services.slice(0, 6) : DEFAULT_SVC;
  const urgentExams = exams.filter(e => {
    const d = Math.ceil((new Date(e.lastDate) - new Date()) / 86400000);
    return d >= 0 && d <= 30;
  }).slice(0, 3);
  const waLink = waNum ? `https://wa.me/${waNum}` : '#';

  return (
    <div>

      {/* ══════════ HERO ══════════ */}
      <section className="hero-wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="hero-grid-bg" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />
        <div className="hero-glow-3" />

        {/* Orbs */}
        {[
          { s: 8, l: '15%', t: '20%', d: '0s', du: '6s' },
          { s: 10, l: '82%', t: '15%', d: '1s', du: '8s' },
          { s: 6, l: '65%', t: '72%', d: '2s', du: '5s' },
          { s: 9, l: '28%', t: '78%', d: '0.5s', du: '7s' },
          { s: 7, l: '90%', t: '55%', d: '1.5s', du: '9s' },
        ].map((o, i) => (
          <div key={i} className="orb" style={{ width: o.s, height: o.s, left: o.l, top: o.t, animationDelay: o.d, animationDuration: o.du }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '80rem', margin: '0 auto', padding: 'clamp(3rem,8vw,5rem) 1.25rem' }}>
          {/* Two-col on md+, single col on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(2rem,5vw,4rem)', alignItems: 'center' }}>

            {/* Left */}
            <div>
              <div className="anim-slide-up" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 99, padding: '6px 16px', marginBottom: 20,
              }}>
                <span className="badge-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                <span style={{ color: '#86efac', fontSize: 12, fontWeight: 700 }}>Govt Authorized · Tamil Nadu</span>
              </div>

              <h1 className="anim-slide-up d2" style={{
                fontSize: 'clamp(2rem,5.5vw,3.8rem)',
                fontWeight: 900, color: 'white', lineHeight: 1.1,
                letterSpacing: '-0.03em', marginBottom: 14,
              }}>
                {t('heroTitle')}
                <br />
                <span className="grad-text">{t('subText')}</span>
              </h1>

              <p className="anim-slide-up d3 font-tamil" style={{ color: '#86efac', fontSize: 'clamp(14px,2vw,17px)', fontWeight: 600, marginBottom: 8 }}>
                {t('heroSubtitle')}
              </p>
              <p className="anim-slide-up d4" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 32, maxWidth: 440, lineHeight: 1.7 }}>
                {t('heroDesc')}
              </p>

              {/* CTA buttons — wrap on mobile */}
              <div className="anim-slide-up d5" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>
                <Link to="/services" style={{ textDecoration: 'none' }}>
                  <div className="btn-glow" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg,#15803d,#22c55e)',
                    color: 'white', fontWeight: 700, padding: '13px 24px',
                    borderRadius: 16, fontSize: 14, cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(34,197,94,0.35)', transition: 'all 0.25s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                  >
                    <FaConciergeBell /> {t('viewServices')}
                  </div>
                </Link>
                <Link to="/exams" style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg,#d97706,#fbbf24)',
                    color: '#0f2a1a', fontWeight: 700, padding: '13px 24px',
                    borderRadius: 16, fontSize: 14, cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(251,191,36,0.3)', transition: 'all 0.25s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                  >
                    <FaCalendarAlt /> {t('importantDates')}
                  </div>
                </Link>
                <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div className="btn-wa btn-glow">
                    <FaWhatsapp style={{ fontSize: 16 }} /> WhatsApp
                  </div>
                </a>
              </div>

              {/* HomeSearch */}
              <div className="anim-slide-up d5b" style={{ marginBottom: 28, maxWidth: 520 }}>
                <HomeSearch />
              </div>

              {/* Mini stats — 3 across, always visible */}
              <div className="anim-slide-up d6" style={{ display: 'flex', gap: 'clamp(16px,4vw,32px)', flexWrap: 'wrap' }}>
                {[{ v: '25,000+', l: 'Applications Processed' }, { v: '73+', l: 'Services' }, { v: '15+', l: 'Years' }].map((s, i) => (
                  <div key={i}>
                    <p style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(18px,3vw,22px)', lineHeight: 1 }}>{s.v}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right quick grid — hidden on mobile, 2-col on md+ */}
            <div className="hidden md:grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {QUICK.map((item, i) => (
                <div key={i} className={`quick-item anim-pop-in d${i + 3}`}>
                  <span className="qi-icon">{item.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: 'white', fontSize: 13, lineHeight: 1.3 }}>
                      {isTa ? item.ta : item.en}
                    </p>
                    <p style={{ color: 'rgba(134,239,172,0.7)', fontSize: 11 }} className="font-tamil">
                      {isTa ? item.en : item.ta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
            <path d="M0 60V30C240 0 480 60 720 40C960 20 1200 50 1440 30V60H0Z" fill="#f0fdf4" />
          </svg>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section style={{ background: '#f0fdf4', padding: '0 0 56px' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem' }}>
          {/* 2 cols on mobile, 4 on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 'clamp(10px,2vw,20px)' }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-pill reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', marginBottom: 8 }}>{s.icon}</div>
                <p style={{ fontSize: 'clamp(1.5rem,3.5vw,2rem)', fontWeight: 900, color: '#14532d', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 'clamp(10px,1.5vw,12px)', color: '#6b7280', fontWeight: 600, marginTop: 4 }}>
                  {isTa ? s.labelTa : s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ URGENT EXAMS ══════════ */}
      {urgentExams.length > 0 && (
        <section style={{ background: 'white', borderTop: '1px solid #fee2e2', borderBottom: '1px solid #fee2e2', padding: '40px 0' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem' }}>
            <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🚨</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h2 style={{ fontWeight: 800, color: '#b91c1c', fontSize: 'clamp(1rem,2.5vw,1.1rem)' }}>Apply Soon — Deadline Approaching!</h2>
                <p style={{ color: '#ef4444', fontSize: 12 }}>Don't miss these exam deadlines</p>
              </div>
              <span className="badge-red">Urgent</span>
            </div>
            {/* 1 col mobile, 2 sm, 3 lg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
              {urgentExams.map((e, i) => (
                <div key={e.id} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <ExamCard exam={e} compact />
                </div>
              ))}
            </div>
            <Link to="/exams" style={{ textDecoration: 'none' }}>
              <div className="reveal" style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 6, color: '#dc2626', fontWeight: 700, fontSize: 14 }}>
                View all exam dates <FaArrowRight />
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ══════════ COMPUTER SALES & SERVICE ══════════ */}
      <section style={{ background: 'white', padding: 'clamp(40px,6vw,72px) 0' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 'clamp(24px,4vw,40px)', flexWrap: 'wrap' }}>
            <div className="reveal-left">
              <p style={{ color: '#1d4ed8', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>── Computer & Laptop ──</p>
              <h2 className="section-title" style={{ color: '#111827' }}>
                {isTa ? 'கம்ப்யூட்டர் & லேப்டாப் சேவைகள்' : 'Computer Sales & Service'}
              </h2>
              <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }}>
                {isTa ? 'அப்துல் ஜீலானி — 15+ ஆண்டுகள் அனுபவம்' : 'By Abdul Jeelani — 15+ Years Experience'}
              </p>
            </div>
            <Link to="/about" style={{ textDecoration: 'none' }} className="reveal">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#1d4ed8', fontWeight: 700, fontSize: 14,
                padding: '10px 20px', borderRadius: 12,
                border: '2px solid #bfdbfe', background: 'white',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                {isTa ? 'மேலும் அறிக' : 'Learn More'} <FaArrowRight />
              </div>
            </Link>
          </div>

          {/* 3 main service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 16, marginBottom: 20 }}>
            {[
              {
                icon: <FaLaptop style={{ fontSize: 28, color: '#1d4ed8' }} />,
                bg: '#eff6ff', border: '#bfdbfe', accent: '#1d4ed8',
                en: 'Laptop & Computer Sales',
                ta: 'லேப்டாப் & கம்ப்யூட்டர் விற்பனை',
                desc: 'New & second hand — HP, Dell, Lenovo, Asus, Acer, Apple & more',
                descTa: 'புதிய & பழைய — அனைத்து பிராண்டுகள்',
              },
              {
                icon: <FaTools style={{ fontSize: 28, color: '#7c3aed' }} />,
                bg: '#f5f3ff', border: '#ddd6fe', accent: '#7c3aed',
                en: 'Hardware & Software Repair',
                ta: 'ஹார்ட்வேர் & சாஃப்ட்வேர் பழுது',
                desc: 'Motherboard, Screen, Battery, RAM, HDD, Windows & drivers',
                descTa: 'அனைத்து வகை பழுதுபார்ப்பு',
              },
              {
                icon: <FaPrint style={{ fontSize: 28, color: '#0e7490' }} />,
                bg: '#ecfeff', border: '#a5f3fc', accent: '#0e7490',
                en: 'Printer Sales & Service',
                ta: 'பிரிண்டர் விற்பனை & சேவை',
                desc: 'HP, Canon, Epson, Brother — ink, toner & accessories',
                descTa: 'அனைத்து பிரிண்டர் பிராண்டுகள்',
              },
            ].map((item, i) => (
              <div key={i} className="reveal-scale" style={{
                background: item.bg, border: `2px solid ${item.border}`,
                borderRadius: 22, padding: 28, transition: 'all 0.25s',
                transitionDelay: `${i * 0.08}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: '#111827', marginBottom: 8 }} className="font-tamil">
                  {isTa ? item.ta : item.en}
                </h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }} className="font-tamil">
                  {isTa ? item.descTa : item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Brand tags */}
          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {['HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Apple', 'Canon', 'Epson', 'Brother', 'Samsung'].map(b => (
              <span key={b} style={{
                background: '#f9fafb', border: '1.5px solid #e5e7eb',
                borderRadius: 99, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: '#374151',
              }}>{b}</span>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════ SERVICES ══════════ */}
      <section style={{ background: '#f0fdf4', padding: 'clamp(40px,6vw,72px) 0' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem' }}>
          {/* Header row — stacks on mobile */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 'clamp(24px,4vw,48px)', flexWrap: 'wrap' }}>
            <div className="reveal-left">
              <p style={{ color: '#16a34a', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>── What We Offer ──</p>
              <h2 className="section-title">{t('ourServices')}</h2>
              <p style={{ color: '#6b7280', fontSize: 14, marginTop: 6 }} className="font-tamil">{t('servicesDesc')}</p>
            </div>
            <Link to="/services" style={{ textDecoration: 'none' }} className="reveal">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: '#15803d', fontWeight: 700, fontSize: 14,
                padding: '10px 20px', borderRadius: 12, border: '2px solid #bbf7d0', background: 'white',
                whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#dcfce7'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
              >
                {t('allServices')} <FaArrowRight />
              </div>
            </Link>
          </div>

          {/* 1 col mobile, 2 sm, 3 lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 'clamp(12px,2vw,20px)' }}>
            {displaySvc.map((s, i) => (
              <div key={s.id || i} className="reveal-scale" style={{ transitionDelay: `${i * 0.07}s` }}>
                <ServiceCard service={s} onShowDocs={(svc, docs, waLink) => setModal({ service: svc, docs, waLink })} />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ TRUST ══════════ */}
      <section style={{ background: 'white', padding: 'clamp(40px,6vw,64px) 0' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,48px)' }} className="reveal">
            <p style={{ color: '#16a34a', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Why Choose Us</p>
            <h2 className="section-title">Trusted by Thousands</h2>
          </div>
          {/* 1 col mobile, 3 sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 'clamp(12px,2vw,20px)' }}>
            {[
              { icon: <FaShieldAlt style={{ fontSize: '2rem', color: '#15803d' }} />, title: 'Govt Authorized', titleTa: 'அரசு அங்கீகரிக்கப்பட்டது', desc: 'Official TNeSevai & Digital Seva center', descTa: 'அதிகாரப்பூர்வ மையம்' },
              { icon: <FaBolt style={{ fontSize: '2rem', color: '#f59e0b' }} />, title: 'Fast & Reliable', titleTa: 'வேகமான & நம்பகமான', desc: 'Quick processing, zero delays', descTa: 'விரைவான சேவை' },
              {
                icon: <FaUsers style={{ fontSize: '2rem', color: '#15803d' }} />,
                title: '25,000+ Applications Processed',
                titleTa: '25,000+ விண்ணப்பங்கள் செயல்படுத்தப்பட்டது',
                desc: 'Across Tamil Nadu',
                descTa: 'தமிழ்நாடு முழுவதும் சேவைகள் வழங்கப்பட்டது'
              },
            ].map((item, i) => (
              <div key={i} className={`trust-item reveal`} style={{ transitionDelay: `${i * 0.1}s`, border: '2px solid #f0fdf4' }}>
                <div style={{ marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: '#1f2937', marginBottom: 8 }}>{isTa ? item.titleTa : item.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 13 }} className="font-tamil">{isTa ? item.descTa : item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="cta-section" style={{ padding: 'clamp(48px,8vw,80px) 0' }}>
        {[1, 2, 3, 4].map(n => <div key={n} className="cta-ring" style={{ animationDelay: `${n * 0.8}s` }} />)}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', margin: '0 auto', padding: '0 1.25rem', textAlign: 'center' }} className="reveal">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 99, padding: '6px 20px', marginBottom: 24,
          }}>
            <span style={{ color: '#86efac', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Get In Touch</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.6rem,4vw,2.75rem)', fontWeight: 900, color: 'white',
            letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.15,
          }}>
            Need Help with Any<br />
            <span className="grad-text">Govt Service?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 36 }} className="font-tamil">
            எந்த அரசு சேவைக்கும் உதவி தேவையா? இப்போதே வாருங்கள்!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14 }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="btn-wa btn-glow" style={{ padding: '15px 32px', fontSize: 15 }}>
                <FaWhatsapp style={{ fontSize: 18 }} /> Chat on WhatsApp
              </div>
            </a>
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.2)',
                color: 'white', fontWeight: 700, padding: '15px 28px', borderRadius: 16,
                fontSize: 14, cursor: 'pointer', transition: 'all 0.25s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = ''; }}
              >
                <FaConciergeBell /> {t('contactUs')}
              </div>
            </Link>
          </div>
        </div>
      </section>
      {modal && (
        <DocsModal
          service={modal.service}
          docs={modal.docs}
          waLink={modal.waLink}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}