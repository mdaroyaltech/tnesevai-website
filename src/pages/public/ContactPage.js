// src/pages/public/ContactPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getContactSettings } from '../../firebase/services';
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope, FaDirections } from 'react-icons/fa';
import SEO from '../../components/shared/SEO';

const DEFAULT = {
  phone: '+91 XXXXX XXXXX', whatsapp: '+91 XXXXX XXXXX', email: '',
  address: 'Update your address in Admin → Contact Settings',
  addressTa: 'நிர்வாகி → தொடர்பு அமைப்புகளில் முகவரியை புதுப்பிக்கவும்',
  timings: 'Mon – Sat: 9:00 AM – 7:00 PM',
  timingsTa: 'திங்கள் – சனி: காலை 9:00 – மாலை 7:00', mapLink: '',
};

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const [info, setInfo] = useState(DEFAULT);
  useEffect(() => { getContactSettings().then(d => { if (d) setInfo({ ...DEFAULT, ...d }); }); }, []);
  const wa = info.whatsapp?.replace(/\D/g, '');

  const CONTACTS = [
    { href: `tel:${info.phone}`, icon: <FaPhone />, label: t('phone'), value: info.phone, color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
    { href: `https://wa.me/${wa}`, icon: <FaWhatsapp />, label: t('whatsapp'), value: info.whatsapp, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', target: '_blank' },
    { icon: <FaClock />, label: t('timings'), value: isTa && info.timingsTa ? info.timingsTa : info.timings, color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  ];
  if (info.email) CONTACTS.push({ href: `mailto:${info.email}`, icon: <FaEnvelope />, label: 'Email', value: info.email, color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' });

  return (
    <>
      <SEO
        title="Contact Us – Royal Computers TNeSevai & Digital Seva"
        description="Contact Royal Computers for all government services — TNeSevai, Digital Seva, TNPSC applications, NEET applications. Visit us in Tamil Nadu or WhatsApp us anytime. Authorized VLE center."
        keywords="Royal Computers contact, TNeSevai center contact Tamil Nadu, Digital Seva WhatsApp, government service center contact, VLE center Tamil Nadu"
        url="/contact"
      />
      <div style={{ background: '#f0fdf4', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#050f05,#0f2a1a,#15803d)', padding: 'clamp(40px,6vw,64px) clamp(16px,4vw,24px) clamp(56px,8vw,80px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(34,197,94,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="anim-fade-up" style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-0.03em', marginBottom: 12 }}>
              {t('contactUs')}
            </h1>
            <p className="anim-fade-up d2 font-tamil" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>
              {t('tagline')}
            </p>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
              <path d="M0 48V24C360 0 720 48 1080 24C1260 12 1380 36 1440 24V48H0Z" fill="#f0fdf4" />
            </svg>
          </div>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 1.5rem' }}>
          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16, marginBottom: 24 }}>
            {CONTACTS.map((c, i) => (
              <div key={i} className="reveal-scale" style={{ transitionDelay: `${i * 0.08}s` }}>
                {c.href ? (
                  <a href={c.href} target={c.target || '_self'} rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                    <ContactCard {...c} />
                  </a>
                ) : <ContactCard {...c} />}
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="reveal card" style={{ padding: 28, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FaMapMarkerAlt style={{ color: '#ef4444', fontSize: 18 }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{t('address')}</p>
                <p style={{ fontWeight: 700, color: '#1f2937', fontSize: 14, lineHeight: 1.6 }} className="font-tamil">
                  {isTa && info.addressTa ? info.addressTa : info.address}
                </p>
                {info.mapLink && (
                  <a href={info.mapLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 700, fontSize: 12, marginTop: 10, textDecoration: 'none' }}>
                    <FaDirections /> {t('getDirections')} ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="reveal" style={{
            background: 'linear-gradient(135deg,#16a34a,#22c55e)',
            borderRadius: 28, padding: '40px 32px', textAlign: 'center',
            boxShadow: '0 20px 48px rgba(34,197,94,0.3)',
          }}>
            <p style={{ fontWeight: 900, color: 'white', fontSize: '1.4rem', marginBottom: 8 }}>
              {isTa ? 'இப்போதே வாட்ஸ்அப்பில் பேசுங்கள்!' : 'Chat with us on WhatsApp!'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 28 }} className="font-tamil">
              {isTa ? 'உங்கள் கேள்விகளுக்கு விரைவான பதில் பெறுங்கள்' : 'Get quick answers to all your questions'}
            </p>
            <a href={`https://wa.me/${wa}?text=Hello, I need help with government services`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'white', color: '#16a34a', fontWeight: 800, padding: '16px 36px',
                borderRadius: 18, fontSize: 15, cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
              >
                <FaWhatsapp style={{ fontSize: 20 }} /> {t('sendWhatsapp')}
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactCard({ icon, label, value, color, bg, border }) {
  return (
    <div style={{
      background: bg, border: `2px solid ${border}`, borderRadius: 20,
      padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14,
      transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 14, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 800, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ fontWeight: 700, color: '#1f2937', fontSize: 14, marginTop: 2 }}>{value}</p>
      </div>
    </div>
  );
}
