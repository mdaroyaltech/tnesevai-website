// src/pages/public/ServicesPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { listenServices } from '../../firebase/services';
import ServiceCard from '../../components/public/ServiceCard';
import DocsModal from '../../components/public/DocsModal';
import SkeletonCard from '../../components/public/SkeletonCard';
import { FaSearch } from 'react-icons/fa';

const CATS = [
  { key: 'all', label: 'All', labelTa: 'அனைத்தும்', icon: '🏛️' },
  { key: 'tnesevai', label: 'TNeSevai', labelTa: 'TNeSevai', icon: '📋' },
  { key: 'digitalSeva', label: 'Digital Seva', labelTa: 'டிஜிட்டல் சேவா', icon: '💻' },
  { key: 'tnpsc', label: 'TNPSC', labelTa: 'TNPSC', icon: '🎓' },
  { key: 'education', label: 'Education', labelTa: 'கல்வி', icon: '📚' },
  { key: 'other', label: 'Other', labelTa: 'மற்றவை', icon: '⚙️' },
];

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';

  const [services, setServices] = useState([]);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenServices(data => {
      setServices(data);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  const filtered = services
    .filter(s => cat === 'all' || s.category === cat)
    .filter(s => {
      const q = search.toLowerCase();
      return !q || (s.name || '').toLowerCase().includes(q) || (s.nameTa || '').includes(q);
    });

  return (
    <div style={{ background: '#f0fdf4', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#050f05,#0f2a1a,#15803d)',
        padding: 'clamp(36px,6vw,56px) clamp(16px,4vw,24px) clamp(48px,7vw,72px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(34,197,94,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="anim-fade-up" style={{ color: '#86efac', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>── All Services ──</p>
          <h1 className="anim-fade-up d2" style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.75rem)', letterSpacing: '-0.03em', marginBottom: 10 }}>{t('ourServices')}</h1>
          <p className="anim-fade-up d3 font-tamil" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, maxWidth: 480, margin: '0 auto' }}>{t('servicesDesc')}</p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
            <path d="M0 48V24C360 0 720 48 1080 24C1260 12 1380 36 1440 24V48H0Z" fill="#f0fdf4" />
          </svg>
        </div>
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '40px 1.25rem' }}>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 13 }} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder') || 'Search services...'}
            className="font-tamil"
            style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: 16, border: '2px solid #bbf7d0', background: 'white', fontSize: 14, fontWeight: 500, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#22c55e'}
            onBlur={e => e.target.style.borderColor = '#bbf7d0'}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {CATS.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              border: '2px solid transparent', transition: 'all 0.2s',
              background: cat === c.key ? '#15803d' : 'white',
              color: cat === c.key ? 'white' : '#374151',
              borderColor: cat === c.key ? '#15803d' : '#e5e7eb',
              boxShadow: cat === c.key ? '0 4px 16px rgba(21,128,61,0.3)' : 'none',
              transform: cat === c.key ? 'translateY(-1px)' : 'none',
            }}>
              {c.icon} {isTa ? c.labelTa : c.label}
            </button>
          ))}
        </div>

        {/* ── State 1: Loading ── */}
        {loading && (
          <>
            <p style={{ color: '#9ca3af', fontSize: 12, fontWeight: 600, marginBottom: 20 }}>Loading services...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 18 }}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        )}

        {/* ── State 2: Loaded with results ── */}
        {!loading && filtered.length > 0 && (
          <>
            <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
              {filtered.length} services found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ gap: 18 }}>
              {filtered.map((s, i) => (
                <div key={s.id || i} className="reveal-scale" style={{ transitionDelay: `${(i % 8) * 0.06}s` }}>
                  <ServiceCard
                    service={s}
                    onShowDocs={(svc, docs, waLink) => setModal({ service: svc, docs, waLink })}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── State 3: Loaded but no results ── */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
            <p style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</p>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#374151', marginBottom: 6 }}>No services found</p>
            <p style={{ fontSize: 13 }}>Try a different search or category</p>
            {(search || cat !== 'all') && (
              <button
                onClick={() => { setSearch(''); setCat('all'); }}
                style={{
                  marginTop: 16, padding: '10px 24px', borderRadius: 12,
                  background: '#15803d', color: 'white', fontWeight: 700,
                  fontSize: 13, border: 'none', cursor: 'pointer',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

      </div>

      {/* Single modal — rendered once at page level */}
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