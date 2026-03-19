// src/components/public/HomeSearch.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { listenServices } from '../../firebase/services';
import { FaSearch, FaArrowRight } from 'react-icons/fa';

export default function HomeSearch() {
    const { i18n } = useTranslation();
    const isTa = i18n.language === 'ta';
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [services, setServices] = useState([]);
    const [focused, setFocused] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const unsub = listenServices(setServices);
        return () => unsub && unsub();
    }, []);

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const q = query.toLowerCase();
        const found = services
            .filter(s =>
                (s.name || '').toLowerCase().includes(q) ||
                (s.nameTa || '').includes(q) ||
                (s.desc || '').toLowerCase().includes(q)
            )
            .slice(0, 6);
        setResults(found);
    }, [query, services]);

    // Close on outside click
    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setFocused(false); };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    const goToService = () => {
        navigate(`/services?q=${encodeURIComponent(query)}`);
        setQuery('');
        setFocused(false);
    };

    return (
        <div ref={ref} style={{ position: 'relative', maxWidth: 520, width: '100%' }}>
            {/* Search input */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 0,
                background: 'rgba(255,255,255,0.12)',
                border: `2px solid ${focused ? 'rgba(134,239,172,0.6)' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: 16, overflow: 'hidden',
                transition: 'all 0.25s', backdropFilter: 'blur(8px)',
                boxShadow: focused ? '0 0 0 4px rgba(34,197,94,0.15)' : 'none',
            }}>
                <FaSearch style={{ color: '#86efac', fontSize: 14, marginLeft: 16, flexShrink: 0 }} />
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onKeyDown={e => { if (e.key === 'Enter' && query.trim()) goToService(); }}
                    placeholder="Search any service... (e.g. Ration Card, PAN Card)"
                    className="font-tamil"
                    style={{
                        flex: 1, padding: '14px 12px', background: 'transparent',
                        border: 'none', outline: 'none', color: 'white',
                        fontSize: 14, fontWeight: 500,
                    }}
                />
                {query && (
                    <button
                        onClick={goToService}
                        style={{
                            padding: '10px 18px', background: '#22c55e', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                            color: 'white', fontWeight: 700, fontSize: 13, margin: 4, borderRadius: 12,
                            transition: 'all 0.2s', flexShrink: 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
                        onMouseLeave={e => e.currentTarget.style.background = '#22c55e'}
                    >
                        Search <FaArrowRight style={{ fontSize: 10 }} />
                    </button>
                )}
            </div>

            {/* Dropdown results */}
            {focused && results.length > 0 && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                    background: 'white', borderRadius: 18, overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                    border: '1px solid #f0fdf4', zIndex: 100,
                    animation: 'slideUpFade 0.2s ease',
                }}>
                    {results.map((s, i) => (
                        <div
                            key={i}
                            onClick={() => { navigate(`/services`); setQuery(''); setFocused(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 16px', cursor: 'pointer', transition: 'background 0.15s',
                                borderBottom: i < results.length - 1 ? '1px solid #f9fafb' : 'none',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                            <span style={{ fontSize: 22, flexShrink: 0 }}>{s.icon || '📄'}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 700, fontSize: 13, color: '#111827', marginBottom: 2 }} className="font-tamil">
                                    {isTa && s.nameTa ? s.nameTa : s.name}
                                </p>
                                {s.desc && (
                                    <p style={{ fontSize: 11, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {s.desc}
                                    </p>
                                )}
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: '#f0fdf4', color: '#15803d', flexShrink: 0 }}>
                                {s.category}
                            </span>
                        </div>
                    ))}
                    <div
                        onClick={goToService}
                        style={{
                            padding: '11px 16px', textAlign: 'center', cursor: 'pointer',
                            background: '#f9fafb', fontSize: 12, fontWeight: 700, color: '#15803d',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f9fafb'}
                    >
                        View all results for "{query}" <FaArrowRight style={{ fontSize: 10 }} />
                    </div>
                </div>
            )}

            {/* No results */}
            {focused && query.trim() && results.length === 0 && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                    background: 'white', borderRadius: 16, padding: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)', zIndex: 100, textAlign: 'center',
                }}>
                    <p style={{ fontSize: 13, color: '#6b7280' }}>No services found for "<strong>{query}</strong>"</p>
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Try: Ration Card, PAN Card, Community Certificate</p>
                </div>
            )}
        </div>
    );
}