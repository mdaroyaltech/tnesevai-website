// src/components/shared/LanguageToggle.js
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle({ dark = false }) {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const toggle = () => i18n.changeLanguage(isEn ? 'ta' : 'en');

  return (
    <button
      onClick={toggle}
      title="Switch Language"
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all border
        ${dark
          ? 'bg-white/10 hover:bg-white/20 text-white border-white/30'
          : 'bg-primary-50 hover:bg-primary-100 text-primary-700 border-primary-200'
        }`}
    >
      <span className="text-base">{isEn ? '🇮🇳' : '🇬🇧'}</span>
      <span>{isEn ? 'தமிழ்' : 'English'}</span>
    </button>
  );
}
