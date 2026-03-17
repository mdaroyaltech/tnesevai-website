// src/pages/public/ServicesPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { listenServices } from '../../firebase/services';
import ServiceCard from '../../components/public/ServiceCard';
import { FaSearch } from 'react-icons/fa';

const CATS = [
  { key:'all',        label:'catAll' },
  { key:'tnesevai',   label:'catTnesevai' },
  { key:'digitalSeva',label:'catDigital' },
  { key:'tnpsc',      label:'catTnpsc' },
  { key:'education',  label:'catEducation' },
  { key:'other',      label:'catOther' },
];

const DEFAULT_SERVICES = [
  { name:'Ration Card New',       nameTa:'ரேஷன் கார்டு புதிய',          icon:'🪪', category:'tnesevai',    desc:'New ration card application',           descTa:'புதிய ரேஷன் கார்டு விண்ணப்பம்' },
  { name:'Ration Card Correction',nameTa:'ரேஷன் கார்டு திருத்தம்',      icon:'📝', category:'tnesevai',    desc:'Name, address correction',              descTa:'பெயர், முகவரி திருத்தம்' },
  { name:'Birth Certificate',     nameTa:'பிறப்பு சான்றிதழ்',           icon:'👶', category:'tnesevai',    desc:'Apply and download',                    descTa:'விண்ணப்பிக்கவும் & பதிவிறக்கவும்' },
  { name:'Death Certificate',     nameTa:'இறப்பு சான்றிதழ்',            icon:'📜', category:'tnesevai',    desc:'Apply and download',                    descTa:'விண்ணப்பிக்கவும் & பதிவிறக்கவும்' },
  { name:'Community Certificate', nameTa:'சாதி சான்றிதழ்',              icon:'📋', category:'tnesevai',    desc:'All community certificates',            descTa:'அனைத்து சாதி சான்றிதழ்கள்' },
  { name:'Income Certificate',    nameTa:'வருமான சான்றிதழ்',            icon:'💰', category:'tnesevai',    desc:'Annual income certificate',             descTa:'ஆண்டு வருமான சான்றிதழ்' },
  { name:'Nativity Certificate',  nameTa:'பூர்வீக சான்றிதழ்',          icon:'🏡', category:'tnesevai',    desc:'Nativity / domicile certificate',       descTa:'பூர்வீக / ஆதிக்கால சான்றிதழ்' },
  { name:'Encumbrance Certificate',nameTa:'வில்லங்க சான்றிதழ்',         icon:'📑', category:'tnesevai',    desc:'Property encumbrance check',            descTa:'சொத்து வில்லங்க சோதனை' },
  { name:'Patta Transfer',        nameTa:'பட்டா மாற்றம்',               icon:'🏛️', category:'tnesevai',    desc:'Land patta name change',                descTa:'நில பட்டா பெயர் மாற்றம்' },
  { name:'PAN Card New',          nameTa:'பான் கார்டு புதிய',           icon:'💳', category:'digitalSeva', desc:'New PAN card application',              descTa:'புதிய PAN கார்டு விண்ணப்பம்' },
  { name:'PAN Card Correction',   nameTa:'பான் கார்டு திருத்தம்',      icon:'🔄', category:'digitalSeva', desc:'Name, DOB, address correction',         descTa:'பெயர், DOB திருத்தம்' },
  { name:'Passport Application',  nameTa:'பாஸ்போர்ட் விண்ணப்பம்',     icon:'✈️', category:'digitalSeva', desc:'Fresh & renewal passport',              descTa:'புதிய & புதுப்பித்தல்' },
  { name:'Voter ID',              nameTa:'வாக்காளர் அடையாள அட்டை',    icon:'🗳️', category:'digitalSeva', desc:'New, correction, address change',       descTa:'புதிய, திருத்தம், முகவரி மாற்றம்' },
  { name:'Driving Licence',       nameTa:'ஓட்டுனர் உரிமம்',            icon:'🚗', category:'digitalSeva', desc:'New, renewal, address change',          descTa:'புதிய, புதுப்பித்தல்' },
  { name:'Aadhar Update',         nameTa:'ஆதார் புதுப்பிப்பு',         icon:'🪪', category:'digitalSeva', desc:'Name, DOB, address, mobile update',     descTa:'பெயர், முகவரி, மொபைல் புதுப்பிப்பு' },
  { name:'Mobile Recharge',       nameTa:'மொபைல் ரீசார்ஜ்',           icon:'📱', category:'digitalSeva', desc:'All networks recharge',                 descTa:'அனைத்து நெட்வொர்க் ரீசார்ஜ்' },
  { name:'DTH Recharge',          nameTa:'DTH ரீசார்ஜ்',               icon:'📺', category:'digitalSeva', desc:'All DTH service recharge',              descTa:'அனைத்து DTH சேவை ரீசார்ஜ்' },
  { name:'TNPSC Application',     nameTa:'TNPSC விண்ணப்பம்',          icon:'🎓', category:'tnpsc',       desc:'Group 1, 2, 2A, 4, VAO, CCSE & more', descTa:'குழு 1, 2, 4, VAO மற்றும் மேலும்' },
  { name:'NEET Application',      nameTa:'NEET விண்ணப்பம்',           icon:'🩺', category:'education',   desc:'Medical entrance exam application',     descTa:'மருத்துவ நுழைவு தேர்வு விண்ணப்பம்' },
  { name:'Print & Xerox',         nameTa:'பிரிண்ட் & ஸீரோக்ஸ்',      icon:'🖨️', category:'other',       desc:'Color & B/W printing, xerox',          descTa:'வண்ண & கருப்பு வெள்ளை பிரிண்ட்' },
  { name:'Photo Copy',            nameTa:'புகைப்பட நகல்',              icon:'📸', category:'other',       desc:'Passport size & ID photos',            descTa:'பாஸ்போர்ட் அளவு புகைப்படங்கள்' },
];

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const [services, setServices] = useState([]);
  const [cat,      setCat]      = useState('all');
  const [search,   setSearch]   = useState('');

  useEffect(() => listenServices(setServices), []);

  const display = (services.length > 0 ? services : DEFAULT_SERVICES)
    .filter(s => cat === 'all' || s.category === cat)
    .filter(s => {
      const q = search.toLowerCase();
      return !q
        || (s.name || '').toLowerCase().includes(q)
        || (s.nameTa || '').includes(q)
        || (s.desc || '').toLowerCase().includes(q);
    });

  return (
    <div className="page-pad">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="section-title">{t('ourServices')}</h1>
        <p className="text-gray-500 text-sm mt-2 font-tamil">{t('servicesDesc')}</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-7">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 font-tamil"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATS.map(c => (
            <button key={c.key}
              onClick={() => setCat(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all
                ${cat === c.key
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}
            >
              {t(c.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 mb-4 font-medium">{display.length} services found</p>

      {/* Grid */}
      {display.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">🔍</p>
          <p className="font-medium">{t('noData')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {display.map((s, i) => <ServiceCard key={s.id || i} service={s} />)}
        </div>
      )}
    </div>
  );
}
