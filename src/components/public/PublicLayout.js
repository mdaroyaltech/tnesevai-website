// src/components/public/PublicLayout.js
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../context/NotificationContext';
import { getContactSettings } from '../../firebase/services';
import { useLogoSettings } from '../../hooks/useLogoSettings';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import NotificationPanel from './NotificationPanel';
import LanguageToggle from '../shared/LanguageToggle';
import {
  FaHome, FaConciergeBell, FaCalendarAlt, FaInfoCircle,
  FaPhoneAlt, FaBell, FaBars, FaTimes, FaShieldAlt, FaIdBadge,
} from 'react-icons/fa';

const LINKS = [
  { to:'/',         label:'home',      Icon:FaHome },
  { to:'/services', label:'services',  Icon:FaConciergeBell },
  { to:'/exams',    label:'examDates', Icon:FaCalendarAlt },
  { to:'/about',    label:'about',     Icon:FaInfoCircle },
  { to:'/contact',  label:'contact',   Icon:FaPhoneAlt },
];

function NavLogo({ logo, t, lang }) {
  const [fail, setFail] = useState(false);
  if (logo.showCustomLogo && !fail) {
    return (
      <img
        src={logo.logoUrl}
        alt={logo.shopNameEn || 'Royal Computers'}
        style={{ height:40, maxWidth:'clamp(100px,30vw,180px)', objectFit:'contain' }}
        onError={() => setFail(true)}
      />
    );
  }
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{
        width:42, height:42, background:'white', borderRadius:13,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontWeight:900, color:'#15803d', fontSize:15,
        boxShadow:'0 4px 16px rgba(0,0,0,0.2)', flexShrink:0,
      }}>
        {logo.navLogoText || 'RC'}
      </div>
      <div>
        <p style={{ color:'white', fontWeight:800, fontSize:'clamp(13px,2vw,15px)', lineHeight:1.2, letterSpacing:'-0.01em' }}>
          {logo.shopNameEn || t('shopName')}
        </p>
        <p style={{ color:'#86efac', fontSize:11, lineHeight:1 }} className="font-tamil">
          {lang === 'ta' && logo.shopNameTa ? logo.shopNameTa : t('subText')}
        </p>
      </div>
    </div>
  );
}

export default function PublicLayout() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();
  const logo = useLogoSettings();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [contact,   setContact]   = useState({});
  const [scrolled,  setScrolled]  = useState(false);

  useScrollReveal();

  useEffect(() => { getContactSettings().then(d => { if(d) setContact(d); }); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const active = (to) => to==='/' ? pathname==='/' : pathname.startsWith(to);

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', overflowX:'hidden' }}>
      <div id="scroll-bar" />

      {/* ── Ticker ── */}
      <div style={{ background:'#050f05', padding:'5px 16px', overflow:'hidden', flexShrink:0 }}>
        <div style={{ maxWidth:'80rem', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <div className="marquee-wrap" style={{ flex:1, minWidth:0 }}>
            <span className="marquee-content" style={{ color:'#fbbf24', fontSize:11, fontWeight:600 }}>
              🔔&nbsp; TNPSC Group 2A Mains — 15 Mar 2026 &nbsp;|&nbsp;
              NEET UG 2026 — 3 May 2026 &nbsp;|&nbsp;
              Ration Card · Community Cert · Income Cert Available &nbsp;|&nbsp;
              PAN Card · Passport · Voter ID · Aadhar Update &nbsp;|&nbsp;
              Digital Seva All Services — Apply Here
            </span>
          </div>
          <div style={{ flexShrink:0 }}>
            <LanguageToggle dark />
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <header
        className={scrolled ? 'nav-scrolled' : ''}
        style={{
          position:'sticky', top:0, zIndex:50, flexShrink:0,
          background: scrolled ? undefined : 'linear-gradient(135deg,#050f05 0%,#0f2a1a 60%,#15803d 100%)',
          padding:'10px clamp(12px,3vw,20px)',
          transition:'background 0.3s, box-shadow 0.3s',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ maxWidth:'80rem', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>

          <Link to="/" style={{ textDecoration:'none', flexShrink:0 }}>
            <NavLogo logo={logo} t={t} lang={i18n.language} />
          </Link>

          {/* Desktop nav — hidden below lg */}
          <nav style={{ display:'flex', alignItems:'center', gap:2 }} className="hidden lg:flex">
            {LINKS.map(({ to, label, Icon }) => (
              <Link key={to} to={to} style={{ textDecoration:'none' }}>
                <div
                  className={active(to) ? 'nav-link-active' : ''}
                  style={{
                    display:'flex', alignItems:'center', gap:6,
                    padding:'8px 13px', borderRadius:11, fontSize:13, fontWeight:600,
                    cursor:'pointer', color: active(to) ? 'white' : 'rgba(255,255,255,0.8)',
                    transition:'all 0.2s', whiteSpace:'nowrap',
                  }}
                  onMouseEnter={e=>{ if(!active(to)) e.currentTarget.style.background='rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e=>{ if(!active(to)) e.currentTarget.style.background='transparent'; }}
                >
                  <Icon style={{ fontSize:11, opacity:0.7 }} /> {t(label)}
                </div>
              </Link>
            ))}
          </nav>

          <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
            {/* Bell */}
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                position:'relative', width:38, height:38, borderRadius:11,
                background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)',
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.2s', flexShrink:0,
              }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            >
              <FaBell style={{ color:'white', fontSize:14 }} />
              {unreadCount > 0 && (
                <span style={{
                  position:'absolute', top:-4, right:-4, minWidth:17, height:17,
                  borderRadius:'50%', background:'#fbbf24', color:'#0f2a1a',
                  fontSize:9, fontWeight:800, display:'flex', alignItems:'center',
                  justifyContent:'center', padding:'0 2px',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Admin — hidden on small mobile */}
            <Link to="/admin" className="hidden sm:block" style={{ textDecoration:'none' }}>
              <div style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'8px 14px', borderRadius:11,
                background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)',
                fontSize:12, fontWeight:700, color:'white', cursor:'pointer',
                transition:'all 0.2s', whiteSpace:'nowrap',
              }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              >
                <FaShieldAlt style={{ fontSize:11 }} /> {t('adminLogin')}
              </div>
            </Link>

            {/* Hamburger — show below lg */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden"
              style={{
                width:38, height:38, borderRadius:11,
                background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)',
                cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0,
              }}
            >
              {menuOpen
                ? <FaTimes  style={{ color:'white', fontSize:14 }} />
                : <FaBars   style={{ color:'white', fontSize:14 }} />
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            borderTop:'1px solid rgba(255,255,255,0.1)',
            marginTop:8, padding:'8px 0',
            animation:'slideUpFade 0.2s ease',
          }}>
            {LINKS.map(({ to, label, Icon }) => (
              <Link key={to} to={to} style={{ textDecoration:'none' }}>
                <div
                  className={active(to) ? 'nav-link-active' : ''}
                  style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding:'11px clamp(12px,3vw,20px)',
                    borderRadius:11, margin:'2px 0',
                    color: active(to) ? 'white' : 'rgba(255,255,255,0.8)',
                    fontSize:14, fontWeight:600,
                  }}
                >
                  <Icon style={{ fontSize:12 }} /> {t(label)}
                </div>
              </Link>
            ))}
            <Link to="/admin" style={{ textDecoration:'none' }}>
              <div style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'11px clamp(12px,3vw,20px)',
                borderRadius:11, color:'#fbbf24', fontSize:14, fontWeight:600,
              }}>
                <FaShieldAlt style={{ fontSize:12 }} /> {t('adminLogin')}
              </div>
            </Link>
          </div>
        )}
      </header>

      {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
      <main style={{ flex:1, overflowX:'hidden' }}><Outlet /></main>

      {/* ── Footer ── */}
      <footer style={{ background:'#050f05', color:'white', paddingTop:'clamp(32px,6vw,56px)', paddingBottom:24 }}>
        <div style={{ maxWidth:'80rem', margin:'0 auto', padding:'0 clamp(16px,4vw,24px)' }}>

          {/* Footer grid: 1 col mobile → 3 col md+ */}
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap:'clamp(24px,4vw,40px)', marginBottom:'clamp(24px,4vw,40px)' }}>

            {/* Brand */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <div style={{
                  width:48, height:48, flexShrink:0,
                  background:'linear-gradient(135deg,#15803d,#22c55e)',
                  borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:900, color:'white', fontSize:17,
                }}>
                  {logo.navLogoText || 'RC'}
                </div>
                <div>
                  <p style={{ fontWeight:800, fontSize:15, color:'white', lineHeight:1.2 }}>
                    {contact.centerName || logo.shopNameEn || t('shopName')}
                  </p>
                  <p style={{ fontSize:11, color:'#86efac' }} className="font-tamil">TNeSevai & Digital Seva</p>
                </div>
              </div>
              <p style={{ color:'#4b5563', fontSize:13, marginBottom:16, lineHeight:1.6 }}>{t('tagline')}</p>
              {(contact.vleCode || logo.vleCode) && (
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:10,
                  background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)',
                  borderRadius:14, padding:'10px 14px',
                }}>
                  <FaIdBadge style={{ color:'#86efac', fontSize:15 }} />
                  <div>
                    <p style={{ color:'#86efac', fontSize:9, fontWeight:800, letterSpacing:'0.15em' }}>VLE CODE</p>
                    <p style={{ color:'white', fontFamily:'monospace', fontWeight:700, fontSize:14, letterSpacing:'0.1em' }}>
                      {contact.vleCode || logo.vleCode}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Links */}
            <div>
              <p style={{ color:'#374151', fontSize:11, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:16 }}>
                Navigation
              </p>
              {/* 2-col link grid on mobile for space efficiency */}
              <div className="grid grid-cols-2 sm:grid-cols-1" style={{ gap:8 }}>
                {LINKS.map(({ to, label, Icon }) => (
                  <Link key={to} to={to} style={{ textDecoration:'none' }}>
                    <div className="footer-link">
                      <Icon style={{ fontSize:11, opacity:0.5 }} /> {t(label)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p style={{ color:'#374151', fontSize:11, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:16 }}>
                {t('contactUs')}
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {contact.timings   && <p style={{ color:'#6b7280', fontSize:13, display:'flex', gap:8 }}><span>⏰</span><span className="font-tamil" style={{ wordBreak:'break-word' }}>{i18n.language==='ta'&&contact.timingsTa?contact.timingsTa:contact.timings}</span></p>}
                {contact.phone     && <a href={`tel:${contact.phone}`} style={{ color:'#6b7280', fontSize:13, display:'flex', gap:8, textDecoration:'none' }}><span>📞</span>{contact.phone}</a>}
                {contact.whatsapp  && <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ color:'#6b7280', fontSize:13, display:'flex', gap:8, textDecoration:'none' }}><span>💬</span>{contact.whatsapp}</a>}
                {contact.address   && <p style={{ color:'#6b7280', fontSize:13, display:'flex', gap:8 }}><span style={{flexShrink:0}}>📍</span><span className="font-tamil" style={{ wordBreak:'break-word' }}>{i18n.language==='ta'&&contact.addressTa?contact.addressTa:contact.address}</span></p>}
                {contact.mapLink   && <a href={contact.mapLink} target="_blank" rel="noopener noreferrer" style={{ color:'#86efac', fontSize:12, fontWeight:700, textDecoration:'none' }}>🗺️ View on Google Maps ↗</a>}
                {!contact.phone&&!contact.timings && <p style={{color:'#374151',fontSize:12,fontStyle:'italic'}}>Add info in Admin → Contact Settings</p>}
              </div>
            </div>
          </div>

          <div style={{
            borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:20,
            display:'flex', justifyContent:'space-between', alignItems:'center',
            flexWrap:'wrap', gap:8,
          }}>
            <p style={{ fontSize:12, color:'#374151' }}>
              © {new Date().getFullYear()} {contact.centerName || logo.shopNameEn || 'Royal Computers'} · TNeSevai & Digital Seva
            </p>
            <p style={{ fontSize:12, color:'#1f2937' }}>Authorized Center · Tamil Nadu 🌐</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
