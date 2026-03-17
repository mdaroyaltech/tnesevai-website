// src/pages/public/AboutPage.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaUsers, FaBolt, FaMedal, FaLeaf } from 'react-icons/fa';

const SERVICES_LIST = [
  { en: 'All TNeSevai (Tamil Nadu e-Sevai) Services',        ta: 'அனைத்து TNeSevai சேவைகள்' },
  { en: 'Digital Seva – PAN, Passport, Voter ID & more',     ta: 'Digital Seva – PAN, Passport, Voter ID மற்றும் மேலும்' },
  { en: 'TNPSC & Government Exam Applications',              ta: 'TNPSC & அரசு தேர்வு விண்ணப்பங்கள்' },
  { en: 'NEET, Engineering Entrance Applications',           ta: 'NEET, பொறியியல் நுழைவு விண்ணப்பங்கள்' },
  { en: 'Certificates – Community, Income, Nativity & more', ta: 'சான்றிதழ்கள் – சாதி, வருமானம் மற்றும் மேலும்' },
  { en: 'Ration Card – New, Correction, Surrender',          ta: 'ரேஷன் கார்டு – புதிய, திருத்தம், ஒப்படைப்பு' },
  { en: 'Aadhar Update & Linking Services',                  ta: 'ஆதார் புதுப்பிப்பு & இணைப்பு சேவைகள்' },
  { en: 'Mobile & DTH Recharge, Bill Payment',               ta: 'மொபைல் & DTH ரீசார்ஜ், பில் பேமென்ட்' },
  { en: 'Print, Xerox, Scanning Services',                   ta: 'பிரிண்ட், ஸீரோக்ஸ், ஸ்கேனிங் சேவைகள்' },
  { en: 'Driving Licence & Vehicle RC Services',             ta: 'ஓட்டுனர் உரிமம் & வாகன RC சேவைகள்' },
];

const WHY_US = [
  { icon: <FaCheckCircle className="text-primary-600 text-xl" />, en: 'Govt Authorized Center', ta: 'அரசு அங்கீகரிக்கப்பட்ட மையம்' },
  { icon: <FaBolt className="text-gold-500 text-xl" />,           en: 'Fast & Reliable Service', ta: 'வேகமான & நம்பகமான சேவை' },
  { icon: <FaUsers className="text-primary-600 text-xl" />,       en: '5000+ Happy Customers',   ta: '5000+ திருப்தியான வாடிக்கையாளர்கள்' },
  { icon: <FaMedal className="text-gold-500 text-xl" />,          en: '10+ Years Experience',    ta: '10+ ஆண்டுகள் அனுபவம்' },
  { icon: <FaLeaf className="text-primary-600 text-xl" />,        en: 'Honest & Transparent',    ta: 'நேர்மையான & வெளிப்படையான' },
];

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';

  return (
    <div className="page-pad max-w-4xl mx-auto">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-500 rounded-3xl p-8 md:p-12 text-white text-center mb-10">
        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl font-black text-white">
          RC
        </div>
        <h1 className="section-title text-white mb-2">{t('aboutTitle')}</h1>
        <p className="text-primary-100 text-sm font-tamil">{t('subText')}</p>
        <p className="text-primary-200 text-xs mt-1">{t('tagline')}</p>
      </div>

      {/* About text */}
      <div className="card p-6 md:p-8 mb-6">
        <h2 className="font-display font-bold text-gray-800 text-xl mb-3">
          {isTa ? 'எங்களை பற்றி' : 'Who We Are'}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed font-tamil">
          {isTa
            ? 'ராயல் கம்ப்யூட்டர்ஸ் ஒரு அங்கீகரிக்கப்பட்ட TNeSevai & Digital Seva மையமாகும். நாங்கள் பல ஆண்டுகளாக தமிழ்நாட்டு மக்களுக்கு நம்பகமான, வேகமான மற்றும் மலிவான அரசு டிஜிட்டல் சேவைகளை வழங்கி வருகிறோம். எங்கள் மையத்தில் அனைத்து TNeSevai, Digital Seva சேவைகள் மற்றும் TNPSC, NEET போன்ற தேர்வு விண்ணப்பங்களும் கிடைக்கும்.'
            : 'Royal Computers is an authorized TNeSevai & Digital Seva center serving the people of Tamil Nadu with fast, reliable, and affordable government digital services. We have been helping thousands of customers with all TNeSevai services, Digital Seva services, and government exam applications including TNPSC, NEET, and more. Our goal is to make government services accessible and hassle-free for everyone.'}
        </p>
      </div>

      {/* Services we offer */}
      <div className="card p-6 md:p-8 mb-6">
        <h2 className="font-display font-bold text-gray-800 text-xl mb-4">
          {isTa ? 'நாங்கள் வழங்கும் சேவைகள்' : 'Services We Offer'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {SERVICES_LIST.map((s, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl hover:bg-primary-50 transition-colors">
              <FaCheckCircle className="text-primary-500 text-sm flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 font-tamil">{isTa ? s.ta : s.en}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why choose us */}
      <div className="card p-6 md:p-8">
        <h2 className="font-display font-bold text-gray-800 text-xl mb-5">
          {isTa ? 'ஏன் எங்களை தேர்வு செய்யவும்?' : 'Why Choose Us?'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {WHY_US.map((w, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              {w.icon}
              <p className="font-semibold text-sm text-gray-700 font-tamil">
                {isTa ? w.ta : w.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
