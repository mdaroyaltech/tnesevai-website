// src/pages/public/ContactPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getContactSettings } from '../../firebase/services';
import {
  FaWhatsapp, FaPhone, FaMapMarkerAlt, FaClock,
  FaEnvelope, FaDirections,
} from 'react-icons/fa';

const DEFAULT_CONTACT = {
  phone:    '+91 XXXXX XXXXX',
  whatsapp: '+91 XXXXX XXXXX',
  email:    '',
  address:  'Update your address in Admin → Contact Settings',
  addressTa:'நிர்வாகி → தொடர்பு அமைப்புகளில் முகவரியை புதுப்பிக்கவும்',
  timings:  'Mon – Sat: 9:00 AM – 7:00 PM',
  timingsTa:'திங்கள் – சனி: காலை 9:00 – மாலை 7:00',
  mapLink:  '',
};

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const [info, setInfo] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    getContactSettings().then(data => { if (data) setInfo({ ...DEFAULT_CONTACT, ...data }); });
  }, []);

  const wa = info.whatsapp?.replace(/\D/g, '');

  return (
    <div className="page-pad max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="section-title">{t('contactUs')}</h1>
        <p className="text-gray-500 text-sm mt-2 font-tamil">{t('tagline')}</p>
      </div>

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">

        {/* Phone */}
        <a href={`tel:${info.phone}`}
          className="card p-5 flex items-center gap-4 hover:border-primary-300 border-2 border-transparent transition-all group"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
            <FaPhone className="text-primary-600 text-lg" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{t('phone')}</p>
            <p className="font-display font-bold text-gray-800 text-sm">{info.phone}</p>
          </div>
        </a>

        {/* WhatsApp */}
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
          className="card p-5 flex items-center gap-4 hover:border-green-300 border-2 border-transparent transition-all group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <FaWhatsapp className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{t('whatsapp')}</p>
            <p className="font-display font-bold text-gray-800 text-sm">{info.whatsapp}</p>
          </div>
        </a>

        {/* Address */}
        <div className="card p-5 flex items-start gap-4 sm:col-span-2">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <FaMapMarkerAlt className="text-red-500 text-lg" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">{t('address')}</p>
            <p className="font-semibold text-gray-800 text-sm mt-0.5 font-tamil">
              {isTa && info.addressTa ? info.addressTa : info.address}
            </p>
            {info.mapLink && (
              <a href={info.mapLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-semibold mt-2"
              >
                <FaDirections /> {t('getDirections')}
              </a>
            )}
          </div>
        </div>

        {/* Timings */}
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold-300/30 rounded-2xl flex items-center justify-center">
            <FaClock className="text-gold-600 text-lg" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{t('timings')}</p>
            <p className="font-semibold text-gray-800 text-sm font-tamil">
              {isTa && info.timingsTa ? info.timingsTa : info.timings}
            </p>
          </div>
        </div>

        {/* Email (optional) */}
        {info.email && (
          <a href={`mailto:${info.email}`} className="card p-5 flex items-center gap-4 hover:border-blue-300 border-2 border-transparent transition-all group">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <FaEnvelope className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <p className="font-semibold text-gray-800 text-sm">{info.email}</p>
            </div>
          </a>
        )}
      </div>

      {/* WhatsApp CTA */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-6 text-white text-center">
        <p className="font-display font-bold text-lg mb-1">
          {isTa ? 'இப்போதே வாட்ஸ்அப்பில் பேசுங்கள்!' : 'Chat with us on WhatsApp!'}
        </p>
        <p className="text-green-100 text-xs mb-4 font-tamil">
          {isTa
            ? 'உங்கள் கேள்விகளுக்கு விரைவான பதில் பெறுங்கள்'
            : 'Get quick answers to all your questions'}
        </p>
        <a href={`https://wa.me/${wa}?text=Hello, I need help with government services`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-green-700 font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
        >
          <FaWhatsapp className="text-xl" /> {t('sendWhatsapp')}
        </a>
      </div>
    </div>
  );
}
