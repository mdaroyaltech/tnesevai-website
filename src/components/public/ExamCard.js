// src/components/public/ExamCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

const daysLeft = (dateStr) => {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  return diff;
};

const fmt = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
};

export default function ExamCard({ exam, compact = false }) {
  const { t, i18n } = useTranslation();
  const isTa  = i18n.language === 'ta';
  const name  = (isTa && exam.nameTa) ? exam.nameTa : exam.name;
  const days  = daysLeft(exam.lastDate);
  const urgent = days !== null && days >= 0 && days <= 7;
  const status = exam.status || 'upcoming';

  const statusStyle = {
    upcoming: 'badge-blue',
    ongoing:  'badge-green',
    closed:   'badge-red',
  }[status] || 'badge-blue';

  return (
    <div className={`card p-4 ${urgent ? 'ring-2 ring-red-400 ring-offset-1' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xl flex-shrink-0">
          {exam.icon || '🎓'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-gray-800 text-sm leading-snug font-tamil line-clamp-2">
              {name}
            </h3>
            <span className={statusStyle}>{t(status)}</span>
          </div>
          {exam.body && <p className="text-xs text-gray-500 mt-0.5">{exam.body}</p>}
        </div>
      </div>

      {!compact && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-orange-50 rounded-xl p-2.5">
            <p className="text-xs text-orange-600 font-semibold flex items-center gap-1">
              <FaClock className="text-[10px]" /> {t('lastDate')}
            </p>
            <p className="text-sm font-bold text-orange-700 mt-0.5">{fmt(exam.lastDate)}</p>
            {days !== null && days >= 0 && (
              <p className={`text-xs mt-0.5 font-medium ${days <= 7 ? 'text-red-600 animate-pulse' : 'text-orange-500'}`}>
                {days === 0 ? 'Today!' : `${days} days left`}
              </p>
            )}
          </div>
          <div className="bg-primary-50 rounded-xl p-2.5">
            <p className="text-xs text-primary-600 font-semibold flex items-center gap-1">
              <FaCalendarAlt className="text-[10px]" /> {t('examDate')}
            </p>
            <p className="text-sm font-bold text-primary-700 mt-0.5">{fmt(exam.examDate)}</p>
          </div>
        </div>
      )}

      {compact && exam.lastDate && (
        <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 font-semibold">
          <FaClock className="text-[10px]" />
          {t('lastDate')}: {fmt(exam.lastDate)}
          {days !== null && days >= 0 && (
            <span className={`ml-1 ${days <= 7 ? 'text-red-600 animate-pulse' : ''}`}>
              ({days === 0 ? 'Today!' : `${days}d left`})
            </span>
          )}
        </div>
      )}

      {exam.applyLink && status !== 'closed' && (
        <a
          href={exam.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 btn-primary text-xs py-1.5 w-full justify-center"
        >
          <FaExternalLinkAlt className="text-[10px]" /> {t('applyNow')}
        </a>
      )}
    </div>
  );
}
