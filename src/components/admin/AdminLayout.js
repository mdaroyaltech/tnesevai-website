// src/components/admin/AdminLayout.js
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaTachometerAlt, FaConciergeBell, FaCalendarAlt, FaBell,
  FaPhoneAlt, FaSignOutAlt, FaBars, FaTimes, FaShieldAlt,
  FaExternalLinkAlt, FaLayerGroup, FaImage, FaTrash,
} from 'react-icons/fa';

const NAV = [
  { to:'/admin',                  label:'dashboard',       Icon:FaTachometerAlt, exact:true },
  { to:'/admin/bulk-import',      label:'Bulk Import',     Icon:FaLayerGroup,    badge:'NEW' },
  { to:'/admin/services',         label:'manageServices',  Icon:FaConciergeBell },
  { to:'/admin/exams',            label:'manageExams',     Icon:FaCalendarAlt },
  { to:'/admin/notifications',    label:'sendNotif',       Icon:FaBell },
  { to:'/admin/logo-settings',    label:'Logo & Icon',     Icon:FaImage },
  { to:'/admin/contact-settings', label:'contactSettings', Icon:FaPhoneAlt },
];

function SideContent({ t, pathname, handleLogout, setSideOpen }) {
  const isActive = (to, exact) => exact ? pathname===to : pathname===to || (pathname.startsWith(to) && to!=='/admin');
  const getLabel = (label) => {
    if (label==='Bulk Import'||label==='Logo & Icon') return label;
    return t(label);
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'linear-gradient(180deg,#050f05 0%,#0f2a1a 100%)' }}>
      {/* Logo */}
      <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, background:'linear-gradient(135deg,#15803d,#22c55e)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'white', fontSize:15, flexShrink:0 }}>
            RC
          </div>
          <div>
            <p style={{ color:'white', fontWeight:800, fontSize:14, lineHeight:1.2 }}>Royal Computers</p>
            <p style={{ color:'#86efac', fontSize:10 }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
        {NAV.map(({ to, label, Icon, badge, exact }) => (
          <Link key={to} to={to} onClick={() => setSideOpen && setSideOpen(false)} style={{ textDecoration:'none', display:'block' }}>
            <div className={`admin-nav-item ${isActive(to,exact)?'active':''}`} style={{ marginBottom:2 }}>
              <Icon style={{ fontSize:14, flexShrink:0 }} />
              <span style={{ flex:1 }}>{getLabel(label)}</span>
              {badge && <span style={{ background:'#fbbf24', color:'#0f2a1a', fontSize:9, fontWeight:800, padding:'2px 7px', borderRadius:99 }}>{badge}</span>}
            </div>
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding:'10px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', display:'block' }}>
          <div className="admin-nav-item" style={{ marginBottom:4 }}>
            <FaExternalLinkAlt style={{ fontSize:12 }} /> View Website
          </div>
        </a>
        <button onClick={handleLogout} style={{ width:'100%', background:'none', border:'none', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:14, fontSize:13, fontWeight:600, color:'#f87171', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(248,113,113,0.1)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}
          >
            <FaSignOutAlt style={{ fontSize:13 }} /> {t('logout')}
          </div>
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <div style={{ display:'flex', height:'100vh', background:'#f0fdf4', overflow:'hidden' }}>
      {/* Desktop sidebar */}
      <aside style={{ width:220, flexShrink:0, height:'100%', overflow:'hidden' }} className="hidden lg:block">
        <SideContent t={t} pathname={pathname} handleLogout={handleLogout} />
      </aside>

      {/* Mobile overlay */}
      {sideOpen && (
        <>
          <div onClick={() => setSideOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:40 }} />
          <aside style={{ position:'fixed', left:0, top:0, bottom:0, width:220, zIndex:50 }}>
            <SideContent t={t} pathname={pathname} handleLogout={handleLogout} setSideOpen={setSideOpen} />
          </aside>
        </>
      )}

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        {/* Topbar */}
        <header style={{
          background:'white', padding:'12px 20px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          borderBottom:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
          flexShrink:0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => setSideOpen(true)} className="lg:hidden" style={{ padding:8, borderRadius:10, background:'#f0fdf4', border:'none', cursor:'pointer' }}>
              <FaBars style={{ color:'#15803d', fontSize:16 }} />
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <FaShieldAlt style={{ color:'#15803d', fontSize:14 }} />
              <span style={{ fontWeight:800, color:'#1f2937', fontSize:14 }}>Admin Dashboard</span>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display:'flex', alignItems:'center', gap:6, padding:'7px 16px', borderRadius:10,
            background:'#fef2f2', border:'1px solid #fecaca', color:'#b91c1c',
            fontSize:12, fontWeight:700, cursor:'pointer',
          }}>
            <FaSignOutAlt /> {t('logout')}
          </button>
        </header>

        {/* Content */}
        <main style={{ flex:1, overflowY:'auto', padding:'clamp(12px,3vw,24px) clamp(12px,3vw,20px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
