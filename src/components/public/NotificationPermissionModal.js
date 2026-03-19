// src/components/public/NotificationPermissionModal.js
import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';

export default function NotificationPermissionModal({ onAllow, onDeny }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const scrollY = window.scrollY;
        // ✅ CSS class inject — most reliable on all devices
        document.body.classList.add('modal-open');
        document.body.style.top = `-${scrollY}px`;
        return () => {
            document.body.classList.remove('modal-open');
            document.body.style.top = '';
            window.scrollTo(0, scrollY);
        };
    }, []);

    const handleAllow = async () => {
        setLoading(true);
        await onAllow();
        setLoading(false);
    };

    return (
        <>
            <style>{`
        @keyframes modalSlideUp {
          from { opacity:0; transform:translateY(30px) scale(0.95); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes bellRing {
          0%,100% { transform: rotate(0deg); }
          15%     { transform: rotate(15deg); }
          30%     { transform: rotate(-12deg); }
          45%     { transform: rotate(10deg); }
          60%     { transform: rotate(-8deg); }
          75%     { transform: rotate(5deg); }
        }
      `}</style>

            {/* Backdrop — touch-action:none stops scroll on mobile */}
            <div
                onClick={onDeny}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9990,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    touchAction: 'none',        // ← stops touch scroll
                    overscrollBehavior: 'none',        // ← stops overscroll
                    WebkitOverflowScrolling: 'auto',
                }}
            />

            {/* Centering wrapper */}
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9991,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                touchAction: 'none',
                overscrollBehavior: 'none',
            }}>
                {/* Modal */}
                <div
                    onClick={e => e.stopPropagation()}
                    style={{
                        background: 'white',
                        borderRadius: 28,
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: 380,
                        boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                        animation: 'modalSlideUp 0.4s cubic-bezier(0.22,1,0.36,1)',
                        touchAction: 'auto',   // allow scroll inside modal
                    }}
                >
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg,#15803d,#22c55e)',
                        padding: '32px 28px 24px',
                        textAlign: 'center',
                        position: 'relative',
                    }}>
                        {/* Close X */}
                        <button
                            onClick={onDeny}
                            style={{
                                position: 'absolute', top: 14, right: 14,
                                width: 32, height: 32, borderRadius: 10,
                                background: 'rgba(255,255,255,0.2)', border: 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', color: 'white', fontSize: 14,
                            }}
                        >
                            <FaTimes />
                        </button>

                        <div style={{
                            width: 72, height: 72, borderRadius: 24,
                            background: 'rgba(255,255,255,0.2)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', fontSize: 32,
                            animation: 'bellRing 2s ease-in-out infinite',
                        }}>🔔</div>

                        <h2 style={{ color: 'white', fontWeight: 900, fontSize: '1.25rem', marginBottom: 6, letterSpacing: '-0.02em' }}>
                            Stay Updated!
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                            Get instant alerts for exam deadlines & new services
                        </p>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '24px 28px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                            {[
                                { icon: '📅', text: 'Exam deadline reminders' },
                                { icon: '🆕', text: 'New service alerts' },
                                { icon: '⚡', text: 'Important announcements' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{item.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Allow button */}
                        <button
                            onClick={handleAllow}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px', borderRadius: 16, border: 'none',
                                background: loading ? '#9ca3af' : 'linear-gradient(135deg,#15803d,#22c55e)',
                                color: 'white', fontWeight: 800, fontSize: 15,
                                cursor: loading ? 'wait' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: '0 8px 24px rgba(34,197,94,0.35)',
                                marginBottom: 10, transition: 'all 0.2s',
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', display: 'inline-block', animation: 'spinBtn 0.7s linear infinite' }} />
                                    Enabling...
                                </>
                            ) : (
                                <><FaBell style={{ fontSize: 14 }} /> Allow Notifications</>
                            )}
                        </button>

                        {/* Deny button */}
                        <button
                            onClick={onDeny}
                            style={{
                                width: '100%', padding: '11px', borderRadius: 16,
                                border: '2px solid #e5e7eb', background: 'white',
                                color: '#6b7280', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                            }}
                        >
                            Not Now
                        </button>

                        <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 12 }}>
                            You can change this anytime in browser settings
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}