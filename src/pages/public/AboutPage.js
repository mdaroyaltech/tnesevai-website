// src/pages/public/AboutPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaCheckCircle, FaShieldAlt, FaBolt, FaUsers, FaLeaf, FaMedal, FaLaptop,
} from 'react-icons/fa';
import { listenContactSettings } from '../../firebase/services';

const GOVT_SERVICES = [
  { en: 'All TNeSevai Services', ta: 'அனைத்து TNeSevai சேவைகள்' },
  { en: 'Digital Seva — PAN, Passport, Voter ID', ta: 'Digital Seva — PAN, Passport, Voter ID' },
  { en: 'TNPSC & Govt Exam Applications', ta: 'TNPSC & அரசு தேர்வு விண்ணப்பங்கள்' },
  { en: 'NEET, JEE, Engineering Admissions', ta: 'NEET, JEE, பொறியியல் சேர்க்கை' },
  { en: 'Community, Income, Nativity Certificates', ta: 'சாதி, வருமான, பூர்வீக சான்றிதழ்கள்' },
  { en: 'Ration Card — New, Correction, Surrender', ta: 'ரேஷன் கார்டு — புதிய, திருத்தம்' },
  { en: 'Aadhar Update & Linking', ta: 'ஆதார் புதுப்பிப்பு & இணைப்பு' },
  { en: 'Mobile, DTH Recharge & Bill Payment', ta: 'மொபைல், DTH ரீசார்ஜ் & பில் பேமென்ட்' },
  { en: 'Print, Xerox & Scanning Services', ta: 'பிரிண்ட், ஸீரோக்ஸ் & ஸ்கேனிங்' },
  { en: 'Driving Licence & Vehicle RC Services', ta: 'ஓட்டுனர் உரிமம் & வாகன RC சேவைகள்' },
];

const COMPUTER_SERVICES = [
  { icon: '💻', en: 'Laptop & Computer Sales', ta: 'லேப்டாப் & கம்ப்யூட்டர் விற்பனை', desc: 'New & second hand — all brands' },
  { icon: '🔧', en: 'Hardware Repair & Service', ta: 'ஹார்ட்வேர் பழுது & சேவை', desc: 'Motherboard, RAM, HDD, Battery, Screen' },
  { icon: '💿', en: 'Software Installation & Support', ta: 'சாஃப்ட்வேர் நிறுவல் & ஆதரவு', desc: 'Windows, Drivers, Antivirus, Office' },
  { icon: '🖨️', en: 'Printer Sales & Service', ta: 'பிரிண்டர் விற்பனை & சேவை', desc: 'All brands — HP, Canon, Epson, Brother' },
  { icon: '🖥️', en: 'Desktop Assembly & Upgrade', ta: 'டெஸ்க்டாப் அசெம்பிள் & அப்கிரேட்', desc: 'Custom builds & upgrades' },
  { icon: '📦', en: 'Printer Ink & Accessories', ta: 'பிரிண்டர் இங்க் & ஆக்சசரிஸ்', desc: 'Genuine & compatible cartridges' },
];

const BRANDS = ['HP', 'Dell', 'Lenovo', 'Asus', 'Acer', 'Apple', 'Canon', 'Epson', 'Brother', 'Samsung'];

const WHY = [
  { icon: <FaShieldAlt />, en: 'Govt Authorized Center', ta: 'அரசு அங்கீகரிக்கப்பட்ட மையம்', color: '#15803d' },
  { icon: <FaBolt />, en: 'Fast & Reliable Service', ta: 'வேகமான & நம்பகமான சேவை', color: '#b45309' },
  {
    icon: <FaUsers />,
    en: '25,000+ Applications Processed',
    ta: '25,000+ விண்ணப்பங்கள் செயல்படுத்தப்பட்டது',
    color: '#1d4ed8'
  },
  { icon: <FaMedal />, en: '15+ Years Experience', ta: '15+ ஆண்டுகள் அனுபவம்', color: '#7c3aed' },
  { icon: <FaLeaf />, en: 'Honest & Transparent', ta: 'நேர்மையான & வெளிப்படையான', color: '#15803d' },
];

export default function AboutPage() {
  const { i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const [info, setInfo] = useState({});

  // ✅ Firebase se live data
  useEffect(() => {
    const unsub = listenContactSettings(d => { if (d) setInfo(d); });
    return () => unsub && unsub();
  }, []);

  const vleCode = info.vleCode || '642198200013';
  const centerName = info.centerName || 'Royal Computers';
  const phone = info.phone || '';
  const timings = info.timings || 'Mon – Sat: 9:00 AM – 8:00 PM';

  return (
    <div style={{ background: '#f0fdf4', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg,#050f05,#0f2a1a,#15803d)',
        padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px) clamp(56px,8vw,80px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(34,197,94,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="anim-fade-up" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, background: 'linear-gradient(135deg,#15803d,#22c55e)', borderRadius: 22, marginBottom: 24, fontSize: 32, boxShadow: '0 12px 32px rgba(34,197,94,0.4)' }}>
            🏛️
          </div>
          <h1 className="anim-fade-up d2" style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-0.03em', marginBottom: 12 }}>
            {isTa ? 'எங்களை பற்றி' : `About ${centerName}`}
          </h1>
          <p className="anim-fade-up d3" style={{ color: '#86efac', fontSize: 14 }}>
            TNeSevai & Digital Seva · Computer Sales & Service · Singarapettai
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
            <path d="M0 48V24C360 0 720 48 1080 24C1260 12 1380 36 1440 24V48H0Z" fill="#f0fdf4" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 1.5rem' }}>

        {/* Who We Are */}
        <div className="card reveal" style={{ padding: 40, marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111827', marginBottom: 16 }}>
            {isTa ? 'நாங்கள் யார்?' : 'Who We Are'}
          </h2>
          <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: 15 }} className="font-tamil">
            {isTa
              ? 'ராயல் கம்ப்யூட்டர்ஸ் ஒரு அங்கீகரிக்கப்பட்ட TNeSevai & Digital Seva மையமாகும். அரசு சேவைகளுடன், கம்ப்யூட்டர், லேப்டாப் மற்றும் பிரிண்டர் விற்பனை மற்றும் சேவையும் வழங்குகிறோம். 15+ ஆண்டுகள் அனுபவத்துடன் நம்பகமான சேவை.'
              : 'Royal Computers is an authorized TNeSevai & Digital Seva center, and also a trusted computer, laptop & printer sales and service center in Singarapettai. With 15+ years of experience, we provide fast, reliable and affordable services for all your government and technical needs.'
            }
          </p>
          {/* Live info from Firebase */}
          {(phone || timings) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
              {phone && (
                <a href={`tel:${phone}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 12, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#15803d' }}>
                  📞 {phone}
                </a>
              )}
              {timings && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: 12, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#b45309' }}>
                  ⏰ {timings}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Abdul Jeelani Profile */}
        <div className="card reveal" style={{ marginBottom: 24, overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(135deg,#050f05,#0f2a1a,#15803d)',
            padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24, flexShrink: 0,
              background: 'linear-gradient(135deg,#22c55e,#15803d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, boxShadow: '0 8px 24px rgba(34,197,94,0.4)',
              border: '3px solid rgba(255,255,255,0.2)',
            }}>👨‍💻</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1.3rem' }}>Abdul Jeelani</h3>
                <span style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 99, padding: '3px 12px', fontSize: 11, fontWeight: 800, color: '#86efac' }}>
                  Founder & Tech Expert
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }} className="font-tamil">
                {isTa ? 'ராயல் கம்ப்யூட்டர்ஸ் நிறுவனர்' : 'Royal Computers, Singarapettai'}
              </p>
            </div>
          </div>

          {/* Stats — NO customer count for computer service */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', borderBottom: '1px solid #f0fdf4' }}>
            {[
              { icon: '⭐', value: '15+', label: isTa ? 'ஆண்டுகள் அனுபவம்' : 'Years Experience' },
              { icon: '🔧', value: 'All', label: isTa ? 'அனைத்து பிராண்டுகள்' : 'Brands Served' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '20px 16px', textAlign: 'center', borderRight: i === 0 ? '1px solid #f0fdf4' : 'none' }}>
                <p style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</p>
                <p style={{ fontWeight: 900, fontSize: '1.4rem', color: '#111827', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, marginTop: 4 }} className="font-tamil">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div style={{ padding: '24px 32px' }}>
            <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: 14 }} className="font-tamil">
              {isTa
                ? 'அப்துல் ஜீலானி அவர்கள் 15+ ஆண்டுகளாக கம்ப்யூட்டர், லேப்டாப் மற்றும் பிரிண்டர் விற்பனை மற்றும் சேவையில் நிபுணத்துவம் பெற்றவர். HP, Dell, Lenovo, Asus உள்ளிட்ட அனைத்து பிராண்டுகளிலும் சேவை வழங்குகிறார்.'
                : 'Abdul Jeelani has 15+ years of hands-on experience in computer, laptop, and printer sales & service. He specializes in hardware repair, software installation, and technical support for all major brands including HP, Dell, Lenovo, Asus, Canon, and Epson.'
              }
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {BRANDS.map(b => (
                <span key={b} style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 99, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: '#15803d' }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Computer Services */}
        <div className="card reveal" style={{ padding: 40, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <FaLaptop style={{ color: '#1d4ed8' }} />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#111827' }}>
                {isTa ? 'கம்ப்யூட்டர் & லேப்டாப் சேவைகள்' : 'Computer & Laptop Services'}
              </h2>
              <p style={{ fontSize: 12, color: '#6b7280' }}>Sales · Repair · Service · Accessories</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 12 }}>
            {COMPUTER_SERVICES.map((s, i) => (
              <div key={i} className="reveal-scale" style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 18px', borderRadius: 16,
                background: '#f9fafb', border: '2px solid #eff6ff',
                transition: 'all 0.2s', transitionDelay: `${i * 0.05}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#eff6ff'; }}
              >
                <span style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{s.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#1f2937', marginBottom: 3 }} className="font-tamil">
                    {isTa ? s.ta : s.en}
                  </p>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Govt Services */}
        <div className="card reveal" style={{ padding: 40, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <FaShieldAlt style={{ color: '#15803d' }} />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#111827' }}>
                {isTa ? 'அரசு சேவைகள்' : 'Government Services'}
              </h2>
              <p style={{ fontSize: 12, color: '#6b7280' }}>TNeSevai · Digital Seva · VLE: {vleCode}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 8 }}>
            {GOVT_SERVICES.map((s, i) => (
              <div key={i} className="reveal" style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderRadius: 14, background: '#f0fdf4', transitionDelay: `${i * 0.04}s`,
              }}>
                <FaCheckCircle style={{ color: '#22c55e', fontSize: 14, flexShrink: 0 }} />
                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }} className="font-tamil">
                  {isTa ? s.ta : s.en}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="card reveal" style={{ padding: 40 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#111827', marginBottom: 24 }}>
            {isTa ? 'ஏன் எங்களை தேர்வு செய்யவும்?' : 'Why Choose Us?'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 12 }}>
            {WHY.map((w, i) => (
              <div key={i} className="reveal-scale" style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                borderRadius: 16, background: '#f9fafb', border: '2px solid #f0fdf4',
                transitionDelay: `${i * 0.06}s`,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: 'white', color: w.color, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0 }}>
                  {w.icon}
                </div>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#1f2937' }} className="font-tamil">
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