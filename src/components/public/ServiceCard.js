// src/components/public/ServiceCard.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaArrowRight, FaFileAlt } from 'react-icons/fa';
import { getContactSettings } from '../../firebase/services';
import { getDocuments } from '../../data/documentsData';

const CAT = {
  tnesevai: { label: 'TNeSevai', bg: '#f0fdf4', accent: '#15803d', dot: '#22c55e', border: '#bbf7d0' },
  digitalSeva: { label: 'Digital Seva', bg: '#eff6ff', accent: '#1d4ed8', dot: '#3b82f6', border: '#bfdbfe' },
  tnpsc: { label: 'TNPSC', bg: '#fffbeb', accent: '#b45309', dot: '#f59e0b', border: '#fde68a' },
  education: { label: 'Education', bg: '#f5f3ff', accent: '#6d28d9', dot: '#8b5cf6', border: '#ddd6fe' },
  other: { label: 'Other', bg: '#f9fafb', accent: '#374151', dot: '#9ca3af', border: '#e5e7eb' },
};

let _waCache = '';
const getWa = async () => {
  if (_waCache) return _waCache;
  try { const d = await getContactSettings(); _waCache = d?.whatsapp?.replace(/\D/g, '') || ''; }
  catch { _waCache = ''; }
  return _waCache;
};

export default function ServiceCard({ service, onShowDocs }) {
  const { i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const name = (isTa && service.nameTa) ? service.nameTa : service.name;
  const desc = (isTa && service.descTa) ? service.descTa : service.desc;
  const cat = CAT[service.category] || CAT.other;
  const docs = getDocuments(service.name || '');
  const [wa, setWa] = useState('');

  useEffect(() => { getWa().then(setWa); }, []);

  const waMessage = encodeURIComponent(
    `Hello Royal Computers,\n\nI would like to apply for: ${service.name}${service.nameTa ? ` / ${service.nameTa}` : ''}.\n\nPlease help me with the process. Thank you.`
  );
  const waLink = wa ? `https://wa.me/${wa}?text=${waMessage}` : `https://wa.me/?text=${waMessage}`;

  return (
    <div className="svc-card" style={{ padding: 22, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Icon + name + desc */}
      <div style={{ display: 'flex', gap: 14, flex: 1 }}>
        <div className="icon-box" style={{
          width: 54, height: 54, flexShrink: 0, borderRadius: 16,
          background: cat.bg, border: `2px solid ${cat.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        }}>
          {service.icon || '📄'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="font-tamil" style={{
            fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 4, lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{name}</h3>
          {desc && (
            <p className="font-tamil" style={{
              fontSize: 12, color: '#6b7280', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{desc}</p>
          )}
        </div>
      </div>

      {/* Category + available */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: `1px solid ${cat.border}`, marginBottom: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: cat.bg, color: cat.accent, border: `1px solid ${cat.border}` }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.dot }} />
          {cat.label}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#16a34a', fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'bounceDot 1.8s ease-in-out infinite' }} />
          Available
        </span>
      </div>

      {/* Documents button — calls parent handler, NOT local modal */}
      {docs.length > 0 && (
        <button
          onClick={() => onShowDocs && onShowDocs(service, docs, waLink)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '9px 14px', marginBottom: 10,
            borderRadius: 12, border: '1.5px solid #bbf7d0',
            background: '#f0fdf4', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#dcfce7'; e.currentTarget.style.borderColor = '#86efac'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaFileAlt style={{ color: '#15803d', fontSize: 12 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#15803d' }}>Documents Required</span>
            <span style={{ background: '#15803d', color: 'white', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 99 }}>
              {docs.length}
            </span>
          </div>
          <FaArrowRight style={{ color: '#15803d', fontSize: 10 }} />
        </button>
      )}

      {/* Apply Now */}
      <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '11px 16px', borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          background: 'linear-gradient(135deg,#15803d,#16a34a)', color: 'white',
          boxShadow: '0 4px 12px rgba(34,197,94,0.25)', transition: 'all 0.25s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(34,197,94,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 12px rgba(34,197,94,0.25)'; }}
        >
          <FaWhatsapp style={{ fontSize: 15 }} />
          Apply Now
          <FaArrowRight style={{ fontSize: 10, opacity: 0.8 }} />
        </div>
      </a>
    </div>
  );
}
