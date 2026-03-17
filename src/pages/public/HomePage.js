// src/pages/public/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { listenServices, listenExams, getContactSettings } from '../../firebase/services';
import ServiceCard from '../../components/public/ServiceCard';
import ExamCard from '../../components/public/ExamCard';
import {
    FaConciergeBell, FaCalendarAlt, FaArrowRight, FaWhatsapp,
    FaCheckCircle, FaBolt, FaUsers, FaMedal,
} from 'react-icons/fa';

const STATS = [
    { icon: <FaUsers className="text-primary-600 text-xl" />, value: '5000+', label: 'Customers Served', labelTa: 'வாடிக்கையாளர்கள்' },
    { icon: <FaBolt className="text-gold-500 text-xl" />, value: '24 hrs', label: 'Fast Processing', labelTa: 'வேக சேவை' },
    { icon: <FaCheckCircle className="text-primary-600 text-xl" />, value: '100%', label: 'Govt Authorized', labelTa: 'அங்கீகரிக்கப்பட்டது' },
    { icon: <FaMedal className="text-gold-500 text-xl" />, value: '10+', label: 'Years Experience', labelTa: 'ஆண்டுகள் அனுபவம்' },
];

const DEFAULT_SERVICES = [
    { name: 'Ration Card', nameTa: 'ரேஷன் கார்டு', icon: '🪪', category: 'tnesevai', desc: 'New / Correction / Surrender', descTa: 'புதிய / திருத்தம் / ஒப்படைப்பு' },
    { name: 'Birth / Death Certificate', nameTa: 'பிறப்பு / இறப்பு சான்றிதழ்', icon: '📜', category: 'tnesevai', desc: 'Apply online & download', descTa: 'ஆன்லைனில் விண்ணப்பிக்கவும்' },
    { name: 'Community Certificate', nameTa: 'சாதி சான்றிதழ்', icon: '📋', category: 'tnesevai', desc: 'Apply via TN eSevai portal', descTa: 'TN eSevai மூலம் விண்ணப்பிக்கவும்' },
    { name: 'Income Certificate', nameTa: 'வருமான சான்றிதழ்', icon: '💰', category: 'tnesevai', desc: 'Annual income certificate', descTa: 'ஆண்டு வருமான சான்றிதழ்' },
    { name: 'PAN Card', nameTa: 'பான் கார்டு', icon: '💳', category: 'digitalSeva', desc: 'New application & corrections', descTa: 'புதிய விண்ணப்பம் & திருத்தம்' },
    { name: 'TNPSC Application', nameTa: 'TNPSC விண்ணப்பம்', icon: '🎓', category: 'tnpsc', desc: 'Group 1, 2, 4, VAO & more', descTa: 'குழு 1, 2, 4, VAO மற்றும் மேலும்' },
];

export default function HomePage() {
    const { t, i18n } = useTranslation();
    const isTa = i18n.language === 'ta';
    const [services, setServices] = useState([]);
    const [exams, setExams] = useState([]);
    const [waNumber, setWaNumber] = useState('');

    useEffect(() => {
        const u1 = listenServices(setServices);
        const u2 = listenExams(setExams);
        getContactSettings().then(d => {
            if (d?.whatsapp) setWaNumber(d.whatsapp.replace(/\D/g, ''));
        });
        return () => { u1(); u2(); };
    }, []);

    const displayServices = services.length > 0 ? services.slice(0, 6) : DEFAULT_SERVICES;
    const urgentExams = exams.filter(e => {
        const days = Math.ceil((new Date(e.lastDate) - new Date()) / 86400000);
        return days >= 0 && days <= 30;
    }).slice(0, 3);

    return (
        <div>
            {/* ── Hero ── */}
            <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-500 text-white overflow-hidden min-h-[480px] flex items-center">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-32 -translate-y-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-16 translate-y-16 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20 w-full">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        {/* Left */}
                        <div className="animate-fade-up">
                            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-white/20">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Govt Authorized Center · Tamil Nadu
                            </span>

                            <h1 className="text-3xl md:text-5xl font-display font-extrabold leading-tight mb-3">
                                {t('heroTitle')}
                            </h1>
                            <p className="text-primary-100 text-base md:text-lg mb-2 font-tamil font-semibold">
                                {t('heroSubtitle')}
                            </p>
                            <p className="text-primary-200 text-sm mb-8">{t('heroDesc')}</p>

                            <div className="flex flex-wrap gap-3">
                                <Link to="/services"
                                    className="flex items-center gap-2 bg-white text-primary-700 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                                >
                                    <FaConciergeBell /> {t('viewServices')}
                                </Link>
                                <Link to="/exams"
                                    className="flex items-center gap-2 bg-gold-400 text-yellow-900 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                                >
                                    <FaCalendarAlt /> {t('importantDates')}
                                </Link>
                                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                                >
                                    <FaWhatsapp /> WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Right – quick icons grid */}
                        <div className="hidden md:grid grid-cols-2 gap-3">
                            {[
                                { icon: '📋', en: 'Application Forms', ta: 'விண்ணப்ப படிவங்கள்' },
                                { icon: '🪪', en: 'Ration Card', ta: 'ரேஷன் கார்டு' },
                                { icon: '🎓', en: 'TNPSC / NEET', ta: 'TNPSC / NEET' },
                                { icon: '🏦', en: 'Digital Seva', ta: 'டிஜிட்டல் சேவா' },
                                { icon: '📱', en: 'Mobile / DTH Recharge', ta: 'மொபைல் / DTH' },
                                { icon: '🖨️', en: 'Print & Xerox', ta: 'பிரிண்ட் & ஸீரோக்ஸ்' },
                            ].map((item, i) => (
                                <div key={i}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 flex items-center gap-3 hover:bg-white/20 transition-all border border-white/15 cursor-default"
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                        <p className="font-semibold text-sm leading-tight">{isTa ? item.ta : item.en}</p>
                                        <p className="text-xs text-primary-200 font-tamil leading-tight">{isTa ? item.en : item.ta}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STATS.map((s, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            {s.icon}
                            <p className="text-2xl font-display font-extrabold text-gray-800 mt-1">{s.value}</p>
                            <p className="text-xs text-gray-500 font-medium">{isTa ? s.labelTa : s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Urgent Exams ── */}
            {urgentExams.length > 0 && (
                <section className="bg-red-50 border-y border-red-200 py-7">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">🚨</span>
                            <h2 className="font-display font-bold text-red-700 text-lg">Apply Soon — Deadline Approaching!</h2>
                            <span className="badge-red animate-pulse">Urgent</span>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {urgentExams.map(e => <ExamCard key={e.id} exam={e} compact />)}
                        </div>
                        <Link to="/exams" className="mt-4 inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-semibold">
                            View all exam dates <FaArrowRight />
                        </Link>
                    </div>
                </section>
            )}

            {/* ── Services Preview ── */}
            <section className="page-pad">
                <div className="flex items-end justify-between mb-7">
                    <div>
                        <h2 className="section-title">{t('ourServices')}</h2>
                        <p className="text-gray-500 text-sm mt-1 font-tamil">{t('servicesDesc')}</p>
                    </div>
                    <Link to="/services" className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-semibold">
                        {t('allServices')} <FaArrowRight />
                    </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayServices.map((s, i) => <ServiceCard key={s.id || i} service={s} />)}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-gradient-to-r from-gov-dark to-gov-light py-14 text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="section-title text-white mb-2">Need Help with Any Govt Service?</h2>
                    <p className="text-gray-300 mb-7 font-tamil text-sm">
                        எந்த அரசு சேவைக்கும் உதவி தேவையா? இப்போதே வாருங்கள்!
                    </p>
                    <div className="flex justify-center flex-wrap gap-3">
                        <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-7 rounded-xl shadow-lg transition-all text-sm"
                        >
                            <FaWhatsapp className="text-lg" /> Chat on WhatsApp
                        </a>
                        <Link to="/contact"
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-7 rounded-xl transition-all text-sm"
                        >
                            {t('contactUs')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}