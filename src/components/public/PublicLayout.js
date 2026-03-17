// src/components/public/PublicLayout.js
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../context/NotificationContext';
import { getContactSettings } from '../../firebase/services';
import { useLogoSettings } from '../../hooks/useLogoSettings';
import NotificationPanel from './NotificationPanel';
import LanguageToggle from '../shared/LanguageToggle';
import {
    FaHome, FaConciergeBell, FaCalendarAlt, FaInfoCircle,
    FaPhoneAlt, FaBell, FaBars, FaTimes, FaShieldAlt, FaIdBadge,
} from 'react-icons/fa';

const LINKS = [
    { to: '/', label: 'home', Icon: FaHome },
    { to: '/services', label: 'services', Icon: FaConciergeBell },
    { to: '/exams', label: 'examDates', Icon: FaCalendarAlt },
    { to: '/about', label: 'about', Icon: FaInfoCircle },
    { to: '/contact', label: 'contact', Icon: FaPhoneAlt },
];

// ─── Custom logo with React-state fallback ───────────────────────────────────
function NavLogo({ logo, t, lang, subText }) {
    const [imgFailed, setImgFailed] = useState(false);

    // Custom logo URL hai aur image load ho gayi
    if (logo.showCustomLogo && !imgFailed) {
        return (
            <img
                src={logo.logoUrl}
                alt={logo.shopNameEn || 'Royal Computers'}
                className="h-10 max-w-[180px] object-contain"
                onError={() => setImgFailed(true)}
            />
        );
    }

    // Default: RC circle + text
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-md font-display font-black text-primary-700 text-lg flex-shrink-0">
                {logo.navLogoText || 'RC'}
            </div>
            <div>
                <p className="text-white font-display font-bold text-base leading-tight">
                    {logo.shopNameEn || t('shopName')}
                </p>
                <p className="text-primary-200 text-xs font-tamil leading-none">
                    {(lang === 'ta' && logo.shopNameTa) ? logo.shopNameTa : subText}
                </p>
            </div>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function PublicLayout() {
    const { t, i18n } = useTranslation();
    const { pathname } = useLocation();
    const { unreadCount } = useNotifications();
    const logo = useLogoSettings();
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [contact, setContact] = useState({});

    useEffect(() => {
        getContactSettings().then(data => { if (data) setContact(data); });
    }, []);

    const active = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* ── Ticker bar ── */}
            <div className="bg-gov-dark text-white py-1.5 px-4 text-xs overflow-hidden">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="marquee-wrap flex-1">
                        <span className="marquee-content text-gold-300 font-medium">
                            🔔 TNPSC Group 1 Notification Out &nbsp;|&nbsp;
                            NEET 2026 Application Open &nbsp;|&nbsp;
                            Ration Card New Application Available &nbsp;|&nbsp;
                            Digital Seva Services Available &nbsp;|&nbsp;
                            Community Certificate Apply Online &nbsp;|&nbsp;
                            Income Certificate – Apply Here &nbsp;|&nbsp;
                            PAN Card, Passport, Voter ID – All Services Available
                        </span>
                    </div>
                    <LanguageToggle dark />
                </div>
            </div>

            {/* ── Header ── */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

                    {/* ✅ FIXED Logo */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                        <NavLogo
                            logo={logo}
                            t={t}
                            lang={i18n.language}
                            subText={t('subText')}
                        />
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-0.5">
                        {LINKS.map(({ to, label, Icon }) => (
                            <Link key={to} to={to}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${active(to) ? 'bg-white text-primary-700 shadow-md' : 'text-white hover:bg-primary-500'}`}
                            >
                                <Icon className="text-xs" /> {t(label)}
                            </Link>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="relative p-2.5 rounded-xl bg-primary-500 hover:bg-primary-400 transition-all"
                        >
                            <FaBell className="text-white" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gold-400 text-gov-dark text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce px-0.5">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <Link to="/admin"
                            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-gov-dark hover:bg-gov-medium rounded-xl text-xs font-semibold text-white transition-all"
                        >
                            <FaShieldAlt /> {t('adminLogin')}
                        </Link>

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden p-2.5 rounded-xl bg-primary-500 hover:bg-primary-400 transition-all"
                        >
                            {menuOpen ? <FaTimes className="text-white" /> : <FaBars className="text-white" />}
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                {menuOpen && (
                    <div className="lg:hidden border-t border-primary-600 bg-primary-800 px-4 py-3 grid grid-cols-2 gap-1.5">
                        {LINKS.map(({ to, label, Icon }) => (
                            <Link key={to} to={to}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active(to) ? 'bg-white text-primary-700' : 'text-white hover:bg-primary-600'}`}
                            >
                                <Icon className="text-xs" /> {t(label)}
                            </Link>
                        ))}
                        <Link to="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gold-300 hover:bg-primary-600 col-span-2"
                        >
                            <FaShieldAlt /> {t('adminLogin')}
                        </Link>
                    </div>
                )}
            </header>

            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}

            <main className="flex-1"><Outlet /></main>

            {/* ── Footer ── */}
            <footer className="bg-gov-dark text-white pt-10 pb-5">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center font-black text-white text-sm">RC</div>
                            <div>
                                <p className="font-display font-bold text-white">
                                    {contact.centerName || t('shopName')}
                                </p>
                                <p className="text-xs text-gray-400 font-tamil">
                                    {(i18n.language === 'ta' && contact.centerNameTa) ? contact.centerNameTa : t('subText')}
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">{t('tagline')}</p>
                        {contact.vleCode && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                <div className="inline-flex items-center gap-1.5 bg-primary-900/60 border border-primary-700 rounded-lg px-2 py-1">
                                    <FaIdBadge className="text-primary-400 text-xs" />
                                    <span className="text-xs text-primary-300 font-mono font-bold tracking-wider">
                                        VLE: {contact.vleCode}
                                    </span>
                                </div>
                                {contact.cscId && (
                                    <div className="inline-flex items-center gap-1 bg-green-900/40 border border-green-800 rounded-lg px-2 py-1">
                                        <span className="text-xs text-green-400 font-mono">CSC: {contact.cscId}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-300 text-sm mb-3">Quick Links</h4>
                        <div className="grid grid-cols-2 gap-1">
                            {LINKS.map(({ to, label }) => (
                                <Link key={to} to={to} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                                    {t(label)}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-300 text-sm mb-3">{t('contactUs')}</h4>
                        <div className="space-y-1.5">
                            {(contact.timings || contact.timingsTa) && (
                                <p className="text-gray-400 text-sm font-tamil">
                                    ⏰ {(i18n.language === 'ta' && contact.timingsTa) ? contact.timingsTa : contact.timings || t('timings')}
                                </p>
                            )}
                            {contact.phone && (
                                <a href={`tel:${contact.phone}`} className="block text-gray-400 hover:text-white text-sm transition-colors">
                                    📞 {contact.phone}
                                </a>
                            )}
                            {contact.whatsapp && (
                                <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="block text-gray-400 hover:text-green-400 text-sm transition-colors">
                                    💬 {contact.whatsapp}
                                </a>
                            )}
                            {contact.address && (
                                <p className="text-gray-400 text-sm font-tamil line-clamp-2">
                                    📍 {(i18n.language === 'ta' && contact.addressTa) ? contact.addressTa : contact.address}
                                </p>
                            )}
                            {contact.mapLink && (
                                <a href={contact.mapLink} target="_blank" rel="noopener noreferrer"
                                    className="text-primary-400 hover:text-primary-300 text-xs flex items-center gap-1 transition-colors">
                                    🗺️ View on Google Maps ↗
                                </a>
                            )}
                            {!contact.phone && !contact.timings && (
                                <>
                                    <p className="text-gray-400 text-sm">⏰ {t('timings')}</p>
                                    <p className="text-gray-400 text-sm">📍 Tamil Nadu</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 border-t border-gray-700 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} {contact.centerName || t('shopName')} · {t('subText')}
                    </p>
                    <p className="text-xs text-gray-600">Authorized TNeSevai & Digital Seva Center</p>
                </div>
            </footer>
        </div>
    );
}