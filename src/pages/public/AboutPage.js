// src/pages/public/AboutPage.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaShieldAlt, FaBolt, FaUsers, FaLeaf, FaMedal } from 'react-icons/fa';

const SERVICES = [
  { en:'All TNeSevai Services',                    ta:'அனைத்து TNeSevai சேவைகள்' },
  { en:'Digital Seva — PAN, Passport, Voter ID',   ta:'Digital Seva — PAN, Passport, Voter ID' },
  { en:'TNPSC & Govt Exam Applications',           ta:'TNPSC & அரசு தேர்வு விண்ணப்பங்கள்' },
  { en:'NEET, JEE, Engineering Admissions',        ta:'NEET, JEE, பொறியியல் சேர்க்கை' },
  { en:'Community, Income, Nativity Certificates', ta:'சாதி, வருமான, பூர்வீக சான்றிதழ்கள்' },
  { en:'Ration Card — New, Correction, Surrender', ta:'ரேஷன் கார்டு — புதிய, திருத்தம்' },
  { en:'Aadhar Update & Linking',                  ta:'ஆதார் புதுப்பிப்பு & இணைப்பு' },
  { en:'Mobile, DTH Recharge & Bill Payment',      ta:'மொபைல், DTH ரீசார்ஜ் & பில் பேமென்ட்' },
  { en:'Print, Xerox & Scanning Services',         ta:'பிரிண்ட், ஸீரோக்ஸ் & ஸ்கேனிங்' },
  { en:'Driving Licence & Vehicle RC Services',    ta:'ஓட்டுனர் உரிமம் & வாகன RC சேவைகள்' },
];

const WHY = [
  { icon:<FaShieldAlt/>, en:'Govt Authorized Center',   ta:'அரசு அங்கீகரிக்கப்பட்ட மையம்',       color:'#15803d' },
  { icon:<FaBolt/>,      en:'Fast & Reliable Service',   ta:'வேகமான & நம்பகமான சேவை',              color:'#b45309' },
  { icon:<FaUsers/>,     en:'5000+ Happy Customers',     ta:'5000+ திருப்தியான வாடிக்கையாளர்கள்',  color:'#1d4ed8' },
  { icon:<FaMedal/>,     en:'10+ Years Experience',      ta:'10+ ஆண்டுகள் அனுபவம்',                color:'#7c3aed' },
  { icon:<FaLeaf/>,      en:'Honest & Transparent',      ta:'நேர்மையான & வெளிப்படையான',             color:'#15803d' },
];

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';

  return (
    <div style={{ background:'#f0fdf4', minHeight:'100vh' }}>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,#050f05,#0f2a1a,#15803d)', padding:'clamp(40px,6vw,64px) clamp(16px,4vw,24px) clamp(56px,8vw,80px)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(34,197,94,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.05) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div className="anim-fade-up" style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:72, height:72, background:'linear-gradient(135deg,#15803d,#22c55e)', borderRadius:22, marginBottom:24, fontSize:32, boxShadow:'0 12px 32px rgba(34,197,94,0.4)' }}>
            🏛️
          </div>
          <h1 className="anim-fade-up d2" style={{ color:'white', fontWeight:900, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.03em', marginBottom:12 }}>
            {isTa ? 'எங்களை பற்றி' : 'About Royal Computers'}
          </h1>
          <p className="anim-fade-up d3" style={{ color:'#86efac', fontSize:14 }}>TNeSevai & Digital Seva · Authorized Center</p>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'block' }}>
            <path d="M0 48V24C360 0 720 48 1080 24C1260 12 1380 36 1440 24V48H0Z" fill="#f0fdf4" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'48px 1.5rem' }}>

        {/* About card */}
        <div className="card reveal" style={{ padding:40, marginBottom:24 }}>
          <h2 style={{ fontWeight:800, fontSize:'1.4rem', color:'#111827', marginBottom:16 }}>
            {isTa ? 'நாங்கள் யார்?' : 'Who We Are'}
          </h2>
          <p style={{ color:'#4b5563', lineHeight:1.8, fontSize:15 }} className="font-tamil">
            {isTa
              ? 'ராயல் கம்ப்யூட்டர்ஸ் ஒரு அங்கீகரிக்கப்பட்ட TNeSevai & Digital Seva மையமாகும். நாங்கள் பல ஆண்டுகளாக தமிழ்நாட்டு மக்களுக்கு நம்பகமான, வேகமான மற்றும் மலிவான அரசு டிஜிட்டல் சேவைகளை வழங்கி வருகிறோம்.'
              : 'Royal Computers is an authorized TNeSevai & Digital Seva center serving the people of Tamil Nadu with fast, reliable, and affordable government digital services. We have been helping thousands of customers with all government service needs for over 10 years.'}
          </p>
        </div>

        {/* Services list */}
        <div className="card reveal" style={{ padding:40, marginBottom:24 }}>
          <h2 style={{ fontWeight:800, fontSize:'1.4rem', color:'#111827', marginBottom:24 }}>
            {isTa ? 'நாங்கள் வழங்கும் சேவைகள்' : 'Services We Offer'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap:8 }}>
            {SERVICES.map((s,i) => (
              <div key={i} className="reveal" style={{
                display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                borderRadius:14, background:'#f0fdf4', transitionDelay:`${i*0.04}s`,
              }}>
                <FaCheckCircle style={{ color:'#22c55e', fontSize:14, flexShrink:0 }} />
                <p style={{ fontSize:13, fontWeight:600, color:'#374151' }} className="font-tamil">
                  {isTa ? s.ta : s.en}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why us */}
        <div className="card reveal" style={{ padding:40 }}>
          <h2 style={{ fontWeight:800, fontSize:'1.4rem', color:'#111827', marginBottom:24 }}>
            {isTa ? 'ஏன் எங்களை தேர்வு செய்யவும்?' : 'Why Choose Us?'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap:12 }}>
            {WHY.map((w,i) => (
              <div key={i} className="reveal-scale" style={{
                display:'flex', alignItems:'center', gap:14, padding:'16px 18px',
                borderRadius:16, background:'#f9fafb', border:'2px solid #f0fdf4',
                transitionDelay:`${i*0.06}s`,
              }}>
                <div style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, background:'white', color:w.color, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', flexShrink:0 }}>
                  {w.icon}
                </div>
                <p style={{ fontWeight:700, fontSize:13, color:'#1f2937' }} className="font-tamil">
                  {isTa ? w.ta : w.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
