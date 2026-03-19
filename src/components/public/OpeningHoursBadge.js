// src/components/public/OpeningHoursBadge.js
import React, { useState, useEffect } from 'react';
import { listenContactSettings } from '../../firebase/services';

function parseTime(str) {
    // Parse "9:00 AM" or "9:00" or "09:00"
    if (!str) return null;
    const clean = str.trim().toUpperCase();
    const match = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
    if (!match) return null;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const period = match[3];
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
}

function isOpenNow(timings) {
    if (!timings) return null;
    // e.g. "Mon – Sat: 9:00 AM – 7:00 PM"
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon...6=Sat
    const curMin = now.getHours() * 60 + now.getMinutes();

    // Check Sunday closed
    const isSunday = day === 0;
    if (isSunday && !timings.toLowerCase().includes('sun')) return false;

    // Extract open/close times
    const times = timings.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[–\-]\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    if (!times) return null;
    const open = parseTime(times[1]);
    const close = parseTime(times[2]);
    if (!open || !close) return null;
    return curMin >= open && curMin <= close;
}

export default function OpeningHoursBadge() {
    const [status, setStatus] = useState(null); // null | true | false
    const [timings, setTimings] = useState('');

    useEffect(() => {
        const unsub = listenContactSettings(d => {
            const t = d?.timings || '';
            setTimings(t);
            const open = isOpenNow(t);
            setStatus(open);
        });
        // Refresh every minute
        const interval = setInterval(() => {
            const open = isOpenNow(timings);
            setStatus(open);
        }, 60000);
        return () => { unsub && unsub(); clearInterval(interval); };
    }, [timings]);

    if (status === null) return null;

    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700,
            background: status ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${status ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: status ? '#86efac' : '#fca5a5',
            letterSpacing: '0.03em',
        }}>
            <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: status ? '#22c55e' : '#ef4444',
                animation: status ? 'bounceDot 1.5s ease-in-out infinite' : 'none',
                flexShrink: 0,
            }} />
            {status ? 'Open Now' : 'Closed'}
        </div>
    );
}