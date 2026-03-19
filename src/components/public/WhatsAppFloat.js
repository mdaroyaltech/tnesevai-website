// src/components/public/WhatsAppFloat.js
import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { listenContactSettings } from '../../firebase/services';

export default function WhatsAppFloat() {
    const [wa, setWa] = useState('');
    const [visible, setVisible] = useState(false);
    const [tooltip, setTooltip] = useState(true);
    const [pulse, setPulse] = useState(true);

    useEffect(() => {
        const unsub = listenContactSettings(d => {
            if (d?.whatsapp) setWa(d.whatsapp.replace(/\D/g, ''));
        });
        // Show after 2 sec
        const t1 = setTimeout(() => setVisible(true), 2000);
        // Hide tooltip after 6 sec
        const t2 = setTimeout(() => setTooltip(false), 6000);
        // Stop pulse after 8 sec
        const t3 = setTimeout(() => setPulse(false), 8000);
        return () => { unsub && unsub(); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    if (!visible || !wa) return null;

    const msg = encodeURIComponent('Hello Royal Computers,\n\nI need help with government services.\n\nPlease guide me. Thank you.');
    const link = `https://wa.me/${wa}?text=${msg}`;

    return (
        <>
            <style>{`
        @keyframes waBounce {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }
        @keyframes waSlideIn {
          from { opacity:0; transform: translateY(20px) scale(0.8); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes waPulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes tooltipIn {
          from { opacity:0; transform: translateX(10px); }
          to   { opacity:1; transform: translateX(0); }
        }
      `}</style>

            <div style={{
                position: 'fixed', bottom: 24, right: 24, zIndex: 9990,
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
                animation: 'waSlideIn 0.5s cubic-bezier(0.22,1,0.36,1)',
            }}>
                {/* Tooltip */}
                {tooltip && (
                    <div style={{
                        background: 'white', borderRadius: 14, padding: '10px 16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontSize: 13, fontWeight: 600,
                        color: '#1f2937', whiteSpace: 'nowrap', position: 'relative',
                        animation: 'tooltipIn 0.4s ease',
                        border: '1px solid #dcfce7',
                    }}>
                        💬 Need help? Chat with us!
                        <div style={{
                            position: 'absolute', right: 16, bottom: -6,
                            width: 12, height: 12, background: 'white',
                            transform: 'rotate(45deg)', borderRight: '1px solid #dcfce7', borderBottom: '1px solid #dcfce7',
                        }} />
                        <button
                            onClick={() => setTooltip(false)}
                            style={{
                                position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                                borderRadius: '50%', background: '#9ca3af', border: 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <FaTimes style={{ color: 'white', fontSize: 8 }} />
                        </button>
                    </div>
                )}

                {/* Main button */}
                <div style={{ position: 'relative' }}>
                    {/* Pulse rings */}
                    {pulse && <>
                        <div style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            background: 'rgba(37,211,102,0.3)',
                            animation: 'waPulseRing 2s ease-out infinite',
                        }} />
                        <div style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            background: 'rgba(37,211,102,0.2)',
                            animation: 'waPulseRing 2s ease-out infinite 0.5s',
                        }} />
                    </>}

                    <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <div style={{
                            width: 58, height: 58, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #25d366, #128c7e)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', position: 'relative', zIndex: 1,
                            boxShadow: '0 8px 24px rgba(37,211,102,0.5)',
                            animation: 'waBounce 3s ease-in-out infinite',
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(37,211,102,0.6)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.5)'; }}
                        >
                            <FaWhatsapp style={{ color: 'white', fontSize: 28 }} />
                        </div>
                    </a>
                </div>
            </div>
        </>
    );
}