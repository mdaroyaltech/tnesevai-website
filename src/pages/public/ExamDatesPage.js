// src/pages/public/ExamDatesPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { listenExams } from '../../firebase/services';
import ExamCard from '../../components/public/ExamCard';
import { FaCalendarAlt, FaFilter } from 'react-icons/fa';

const STATUS_FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'ongoing',  label: 'Ongoing' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'closed',   label: 'Closed' },
];

const DEFAULT_EXAMS = [
  {
    name: 'TNPSC Group 4 CCSE IV',
    nameTa: 'TNPSC குழு 4 CCSE IV',
    body: 'Tamil Nadu Public Service Commission',
    icon: '🎓',
    lastDate: '2025-05-31',
    examDate: '2025-07-20',
    status: 'upcoming',
    applyLink: 'https://www.tnpsc.gov.in',
  },
  {
    name: 'TNPSC Group 2 Interview Posts',
    nameTa: 'TNPSC குழு 2 நேர்காணல் பணிகள்',
    body: 'Tamil Nadu Public Service Commission',
    icon: '📋',
    lastDate: '2025-06-15',
    examDate: '2025-08-10',
    status: 'upcoming',
    applyLink: 'https://www.tnpsc.gov.in',
  },
  {
    name: 'NEET UG 2025',
    nameTa: 'NEET UG 2025',
    body: 'National Testing Agency (NTA)',
    icon: '🩺',
    lastDate: '2025-04-15',
    examDate: '2025-05-04',
    status: 'ongoing',
    applyLink: 'https://neet.nta.nic.in',
  },
  {
    name: 'TN Police SI Recruitment',
    nameTa: 'TN போலீஸ் SI ஆட்சேர்ப்பு',
    body: 'Tamil Nadu Uniformed Services Recruitment Board',
    icon: '👮',
    lastDate: '2025-05-20',
    examDate: '2025-08-01',
    status: 'upcoming',
    applyLink: 'https://www.tnusrbonline.org',
  },
  {
    name: 'TNPSC VAO Exam',
    nameTa: 'TNPSC VAO தேர்வு',
    body: 'Tamil Nadu Public Service Commission',
    icon: '🏛️',
    lastDate: '2025-03-10',
    examDate: '2025-04-20',
    status: 'closed',
    applyLink: '',
  },
  {
    name: 'TN TRB PG Teachers',
    nameTa: 'TN TRB PG ஆசிரியர்கள்',
    body: 'Teachers Recruitment Board Tamil Nadu',
    icon: '👩‍🏫',
    lastDate: '2025-07-01',
    examDate: '2025-09-15',
    status: 'upcoming',
    applyLink: 'https://www.trb.tn.nic.in',
  },
];

export default function ExamDatesPage() {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';
  const [exams,  setExams]  = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => listenExams(setExams), []);

  const display = (exams.length > 0 ? exams : DEFAULT_EXAMS)
    .filter(e => filter === 'all' || e.status === filter);

  const counts = (exams.length > 0 ? exams : DEFAULT_EXAMS).reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page-pad">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3">
          <FaCalendarAlt className="text-primary-600 text-2xl" />
        </div>
        <h1 className="section-title">{t('examAlerts')}</h1>
        <p className="text-gray-500 text-sm mt-2 font-tamil">{t('examDesc')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          { key: 'ongoing',  label: isTa ? 'நடந்துகொண்டிருக்கும்' : 'Ongoing',  color: 'bg-green-50 border-green-200 text-green-700' },
          { key: 'upcoming', label: isTa ? 'வரவிருக்கும்'         : 'Upcoming', color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { key: 'closed',   label: isTa ? 'மூடப்பட்டது'          : 'Closed',   color: 'bg-red-50 border-red-200 text-red-700' },
        ].map(s => (
          <div key={s.key} className={`rounded-2xl border p-3 text-center ${s.color}`}>
            <p className="text-2xl font-display font-extrabold">{counts[s.key] || 0}</p>
            <p className="text-xs font-semibold font-tamil">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <FaFilter className="text-gray-400 text-sm" />
        {STATUS_FILTERS.map(f => (
          <button key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all
              ${filter === f.key
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
              }`}
          >
            {f.label} {f.key !== 'all' && `(${counts[f.key] || 0})`}
          </button>
        ))}
      </div>

      {/* Exam Cards */}
      {display.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">📅</p>
          <p className="font-medium">{t('noData')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {display.map((e, i) => <ExamCard key={e.id || i} exam={e} />)}
        </div>
      )}

      {/* Note */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <p className="text-xs text-amber-700 font-medium">
          ⚠️ <strong>Note:</strong> Dates shown are indicative. Always verify from official websites before applying.
          Visit our center for application assistance.
        </p>
        <p className="text-xs text-amber-600 font-tamil mt-1">
          ⚠️ <strong>குறிப்பு:</strong> காட்டப்பட்ட தேதிகள் தோராயமானவை. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ இணையதளத்தில் சரிபார்க்கவும்.
        </p>
      </div>
    </div>
  );
}
