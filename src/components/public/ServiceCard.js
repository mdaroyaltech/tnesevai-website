// src/components/public/ServiceCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const CAT_COLORS = {
  tnesevai:  'badge-green',
  digitalSeva:'badge-blue',
  tnpsc:     'badge-yellow',
  education: 'badge-blue',
  other:     'bg-gray-100 text-gray-700 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
};
const CAT_LABELS = {
  tnesevai:'TNeSevai', digitalSeva:'Digital Seva', tnpsc:'TNPSC', education:'Education', other:'Other',
};

export default function ServiceCard({ service }) {
  const { t, i18n } = useTranslation();
  const isTa = i18n.language === 'ta';

  const name = (isTa && service.nameTa) ? service.nameTa : service.name;
  const desc = (isTa && service.descTa) ? service.descTa : service.desc;

  return (
    <div className="card group flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-primary-100 transition-colors">
            {service.icon || '📄'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-gray-800 text-sm leading-snug line-clamp-2 font-tamil">
              {name}
            </h3>
            <span className={`mt-1 ${CAT_COLORS[service.category] || CAT_COLORS.other}`}>
              {CAT_LABELS[service.category] || service.category}
            </span>
          </div>
        </div>
        {desc && (
          <p className="text-xs text-gray-500 line-clamp-2 font-tamil flex-1">{desc}</p>
        )}
      </div>
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-primary-600 font-semibold">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            {t('available')}
          </span>
          <span className="text-xs text-gray-400">✓ Authorized</span>
        </div>
      </div>
    </div>
  );
}
