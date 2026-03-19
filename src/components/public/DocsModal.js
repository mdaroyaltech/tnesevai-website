// src/components/public/DocsModal.js
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

export default function DocsModal({ service, docs, waLink, onClose }) {
    const { i18n } = useTranslation();
    const isTa = i18n.language === 'ta';
    const name = (isTa && service?.nameTa) ? service.nameTa : service?.name;

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // ESC to close
    useEffect(() => {
        const fn = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [onClose]);

    if (!service) return null;

    return (
        <>
            {/* ── Backdrop ── */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, zIndex: 9998,
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    animation: 'backdropIn 0.2s ease forwards',
                }}
            />

            {/* ── Centering wrapper — handles position, NO animation ── */}
            <div
                style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px',
                    pointerEvents: 'none',
                }}
            >
                {/* ── Modal inner — animation ONLY here ── */}
                <div
                    onClick={e => e.stopPropagation()}
                    style={{
                        width: '100%',
                        maxWidth: 440,
                        maxHeight: '85vh',
                        background: 'white',
                        borderRadius: 24,
                        overflow: 'hidden',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
                        display: 'flex', flexDirection: 'column',
                        pointerEvents: 'auto',
                        // ✅ Animation only on this element — no transform conflict
                        animation: 'modalPopIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg,#15803d,#22c55e)',
                        padding: '18px 20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                            <div style={{
                                width: 42, height: 42, background: 'rgba(255,255,255,0.2)',
                                borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 22, flexShrink: 0,
                            }}>
                                {service.icon || '📄'}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
                                    Documents Required
                                </p>
                                <p className="font-tamil" style={{
                                    color: 'white', fontWeight: 800, fontSize: 14, lineHeight: 1.3,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {name}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                width: 34, height: 34, borderRadius: 11, flexShrink: 0,
                                background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        >
                            <FaTimes style={{ fontSize: 13 }} />
                        </button>
                    </div>

                    {/* Info strip */}
                    <div style={{
                        background: '#f0fdf4', borderBottom: '1px solid #bbf7d0',
                        padding: '9px 20px', fontSize: 12, color: '#15803d', fontWeight: 600, flexShrink: 0,
                    }}>
                        📋 Bring these documents to our center for quick processing
                    </div>

                    {/* Documents list — scrollable */}
                    <div style={{ overflowY: 'auto', flex: 1, padding: '14px 16px' }}>
                        {docs.length === 0 ? (
                            <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
                                Please contact us for document requirements.
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {docs.map((doc, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'flex-start', gap: 12,
                                        padding: '10px 14px', borderRadius: 14,
                                        background: '#f9fafb', border: '1px solid #f0fdf4',
                                        transition: 'background 0.15s, border-color 0.15s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#f0fdf4'; }}
                                    >
                                        <div style={{
                                            width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                                            background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            marginTop: 1,
                                        }}>
                                            <span style={{ color: '#15803d', fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                                        </div>
                                        <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', lineHeight: 1.55 }}>{doc}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer CTA */}
                    <div style={{
                        padding: '14px 16px', borderTop: '1px solid #f0fdf4',
                        background: 'white', display: 'flex', gap: 10, flexShrink: 0,
                    }}>
                        <a
                            href={waLink} target="_blank" rel="noopener noreferrer"
                            style={{ textDecoration: 'none', flex: 1 }}
                            onClick={onClose}
                        >
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                background: 'linear-gradient(135deg,#15803d,#22c55e)',
                                color: 'white', fontWeight: 700, padding: '12px 16px',
                                borderRadius: 14, fontSize: 13, cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(34,197,94,0.35)', transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                            >
                                <FaWhatsapp style={{ fontSize: 15 }} />
                                Apply Now via WhatsApp
                            </div>
                        </a>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '12px 18px', borderRadius: 14,
                                border: '2px solid #e5e7eb', background: 'white',
                                color: '#6b7280', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}