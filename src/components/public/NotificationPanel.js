// src/components/public/NotificationPanel.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../context/NotificationContext';
import { FaBell, FaBellSlash, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const timeAgo = (ts) => {
  if (!ts) return '';
  const d   = ts.toDate ? ts.toDate() : new Date(ts);
  const sec = Math.floor((Date.now() - d) / 1000);
  if (sec < 60)   return 'Just now';
  if (sec < 3600) return `${Math.floor(sec/60)}m ago`;
  if (sec < 86400)return `${Math.floor(sec/3600)}h ago`;
  return `${Math.floor(sec/86400)}d ago`;
};

export default function NotificationPanel({ onClose }) {
  const { t } = useTranslation();
  const { notifications, unreadCount, requestPermission, markAllRead } = useNotifications();

  const handleEnable = async () => {
    const token = await requestPermission();
    if (token) toast.success(t('notifEnabled'));
    else       toast.error('Allow notifications in browser settings');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-[110px] sm:top-[116px] right-3 sm:right-6 w-[calc(100vw-24px)] max-w-sm bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white">
          <div className="flex items-center gap-2">
            <FaBell className="text-sm" />
            <span className="font-semibold text-sm">{t('notifications')}</span>
            {unreadCount > 0 && (
              <span className="bg-gold-400 text-gov-dark text-xs font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs bg-primary-500 hover:bg-primary-400 px-2 py-0.5 rounded-full transition">
                {t('markAllRead')}
              </button>
            )}
            <button onClick={onClose} className="hover:bg-primary-500 p-1 rounded-lg transition"><FaTimes /></button>
          </div>
        </div>

        {/* Enable push */}
        {typeof Notification !== 'undefined' && Notification.permission !== 'granted' && (
          <div className="p-3 bg-amber-50 border-b border-amber-200">
            <button
              onClick={handleEnable}
              className="w-full flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-yellow-900 font-semibold py-2 px-4 rounded-xl text-sm transition-all"
            >
              <FaBell className="animate-bounce" /> {t('enableNotifications')}
            </button>
          </div>
        )}

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
              <FaBellSlash className="text-4xl" />
              <p className="text-sm">{t('noNotifications')}</p>
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="flex gap-3 p-3 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-lg">
                  {n.icon || '📢'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 leading-snug truncate">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
