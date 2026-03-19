// src/pages/admin/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../firebase/config';
import {
  collection, onSnapshot, query, orderBy,
  doc, setDoc, getDoc, increment, serverTimestamp,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {
  FaConciergeBell, FaCalendarAlt, FaBell, FaPhoneAlt,
  FaImage, FaLayerGroup, FaWhatsapp, FaEye, FaChartBar,
  FaArrowUp, FaUsers, FaClock,
} from 'react-icons/fa';

const QUICK_LINKS = [
  { to: '/admin/bulk-import', icon: <FaLayerGroup />, label: 'Bulk Import', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  { to: '/admin/services', icon: <FaConciergeBell />, label: 'Manage Services', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  { to: '/admin/exams', icon: <FaCalendarAlt />, label: 'Manage Exams', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  { to: '/admin/notifications', icon: <FaBell />, label: 'Send Notification', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  { to: '/admin/logo-settings', icon: <FaImage />, label: 'Logo & Icon', color: '#0e7490', bg: '#ecfeff', border: '#a5f3fc' },
  { to: '/admin/contact-settings', icon: <FaPhoneAlt />, label: 'Contact Settings', color: '#be185d', bg: '#fdf2f8', border: '#fbcfe8' },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState({ services: 0, exams: 0, notifications: 0 });
  const [stats, setStats] = useState({ waClicks: 0, pageViews: 0, topService: '' });
  const [loading, setLoading] = useState(true);
  const [recentNotifs, setRecentNotifs] = useState([]);

  useEffect(() => {
    // Live counts
    const u1 = onSnapshot(collection(db, 'services'), s => setCounts(c => ({ ...c, services: s.size })));
    const u2 = onSnapshot(collection(db, 'exams'), s => setCounts(c => ({ ...c, exams: s.size })));
    const u3 = onSnapshot(collection(db, 'notifications'), s => setCounts(c => ({ ...c, notifications: s.size })));

    // Recent notifications
    const u4 = onSnapshot(
      query(collection(db, 'notifications'), orderBy('createdAt', 'desc')),
      s => {
        setRecentNotifs(s.docs.slice(0, 3).map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );

    // Stats
    getDoc(doc(db, 'stats', 'dashboard')).then(snap => {
      if (snap.exists()) setStats(snap.data());
    });

    // Track page view
    setDoc(doc(db, 'stats', 'dashboard'), { pageViews: increment(1) }, { merge: true });

    return () => { u1(); u2(); u3(); u4(); };
  }, []);

  const statCards = [
    { icon: <FaConciergeBell style={{ fontSize: 22, color: '#15803d' }} />, value: counts.services, label: 'Total Services', bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d' },
    { icon: <FaCalendarAlt style={{ fontSize: 22, color: '#1d4ed8' }} />, value: counts.exams, label: 'Total Exams', bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
    { icon: <FaBell style={{ fontSize: 22, color: '#7c3aed' }} />, value: counts.notifications, label: 'Notifications Sent', bg: '#f5f3ff', border: '#ddd6fe', color: '#7c3aed' },
    { icon: <FaEye style={{ fontSize: 22, color: '#b45309' }} />, value: stats.pageViews || 0, label: 'Admin Page Views', bg: '#fffbeb', border: '#fde68a', color: '#b45309' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div>
        <h1 className="font-display font-extrabold text-gray-800 text-xl flex items-center gap-2">
          <FaChartBar className="text-primary-600" /> Dashboard
        </h1>
        <p className="text-gray-500 text-xs mt-0.5">
          Welcome back! Here is your live overview.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} style={{
            background: s.bg, border: `2px solid ${s.border}`,
            borderRadius: 20, padding: '20px 18px',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <div style={{ marginBottom: 12 }}>{s.icon}</div>
            <p style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1f2937', lineHeight: 1 }}>
              {loading ? '...' : s.value}
            </p>
            <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="font-display font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
          <FaArrowUp className="text-primary-500" style={{ fontSize: 12 }} /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map((l, i) => (
            <Link key={i} to={l.to} style={{ textDecoration: 'none' }}>
              <div style={{
                background: l.bg, border: `2px solid ${l.border}`,
                borderRadius: 18, padding: '18px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: l.color, fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0,
                }}>
                  {l.icon}
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#1f2937', lineHeight: 1.3 }}>{l.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Status grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Website link */}
        <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 20, padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Live Website</p>
          <a href="https://spt-royal-computers.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#15803d', color: 'white', fontWeight: 700,
              padding: '10px 16px', borderRadius: 12, fontSize: 12, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
              onMouseLeave={e => e.currentTarget.style.background = '#15803d'}
            >
              <FaEye style={{ fontSize: 12 }} /> View Website ↗
            </div>
          </a>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 10 }}>spt-royal-computers.vercel.app</p>
        </div>

        {/* WhatsApp quick link */}
        <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 20, padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>WhatsApp</p>
          <Link to="/admin/contact-settings" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#25d366', color: 'white', fontWeight: 700,
              padding: '10px 16px', borderRadius: 12, fontSize: 12, cursor: 'pointer',
            }}>
              <FaWhatsapp style={{ fontSize: 12 }} /> Update Number
            </div>
          </Link>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 10 }}>Keep your WhatsApp number updated</p>
        </div>

        {/* Recent notifications */}
        <div style={{ background: '#f5f3ff', border: '2px solid #ddd6fe', borderRadius: 20, padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Recent Notifications
          </p>
          {recentNotifs.length === 0 ? (
            <p style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>No notifications yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentNotifs.map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaBell style={{ color: '#7c3aed', fontSize: 10, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: '#374151', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.title || 'Notification'}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/notifications" style={{ textDecoration: 'none' }}>
            <p style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, marginTop: 10 }}>Send New →</p>
          </Link>
        </div>
      </div>

      {/* Setup checklist */}
      <div style={{ background: 'white', border: '2px solid #e5e7eb', borderRadius: 20, padding: 24 }}>
        <h2 className="font-display font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
          <FaClock style={{ color: '#f59e0b', fontSize: 14 }} /> Setup Checklist
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Add contact info (phone, WhatsApp, address)', link: '/admin/contact-settings' },
            { label: 'Upload your logo', link: '/admin/logo-settings' },
            { label: 'Import all 73 services + 12 exams', link: '/admin/bulk-import' },
            { label: 'Send first push notification', link: '/admin/notifications' },
            { label: 'Submit sitemap to Google Search Console', link: null },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                background: counts.services > 0 && i === 2 ? '#dcfce7' : '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
                color: counts.services > 0 && i === 2 ? '#15803d' : '#9ca3af',
              }}>
                {counts.services > 0 && i === 2 ? '✓' : i + 1}
              </div>
              {item.link ? (
                <Link to={item.link} style={{ textDecoration: 'none' }}>
                  <p style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.label}</p>
                </Link>
              ) : (
                <p style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.label}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}