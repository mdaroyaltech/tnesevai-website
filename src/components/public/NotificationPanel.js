// src/components/public/NotificationPanel.js
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../context/NotificationContext';
import { FaBell, FaBellSlash, FaTimes } from 'react-icons/fa';

const timeAgo = (ts) => {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const sec = Math.floor((Date.now() - d) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
};

export default function NotificationPanel({ onClose }) {
  const { t } = useTranslation();
  const { notifications, unreadCount, requestPermission, markAllRead } = useNotifications();

  // Lock scroll when panel is open
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollY}px`;
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleEnable = async () => {
    await requestPermission();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 48,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Panel — fixed position, works on all screen sizes */}
      <div style={{
        position: 'fixed',
        top: 'clamp(100px, 15vw, 120px)',
        right: 'clamp(8px, 3vw, 24px)',
        zIndex: 49,
        width: 'min(calc(100vw - 16px), 360px)',
        background: 'white',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        border: '1px solid #f0fdf4',
        overflow: 'hidden',
        maxHeight: 'calc(100vh - 140px)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUpFade 0.2s ease',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'linear-gradient(135deg,#15803d,#22c55e)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaBell style={{ color: 'white', fontSize: 14 }} />
            <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
              {t('notifications')}
            </span>
            {unreadCount > 0 && (
              <span style={{
                background: '#fbbf24', color: '#1a3d28',
                fontSize: 10, fontWeight: 800,
                padding: '2px 7px', borderRadius: 99,
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  padding: '4px 10px', borderRadius: 99, cursor: 'pointer',
                }}
              >
                {t('markAllRead')}
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: 9,
                background: 'rgba(255,255,255,0.15)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
              }}
            >
              <FaTimes style={{ fontSize: 12 }} />
            </button>
          </div>
        </div>

        {/* Enable push banner */}
        {typeof Notification !== 'undefined' && Notification.permission !== 'granted' && (
          <div style={{
            padding: '10px 14px',
            background: '#fffbeb', borderBottom: '1px solid #fde68a',
            flexShrink: 0,
          }}>
            <button
              onClick={handleEnable}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
                color: '#78350f', fontWeight: 700, fontSize: 12,
                padding: '9px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
              }}
            >
              <FaBell style={{ fontSize: 12 }} /> Enable Push Notifications
            </button>
          </div>
        )}

        {/* Notifications list */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {notifications.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '40px 20px', color: '#9ca3af', gap: 10,
            }}>
              <FaBellSlash style={{ fontSize: 32 }} />
              <p style={{ fontSize: 13, fontWeight: 600 }}>{t('noNotifications')}</p>
            </div>
          ) : (
            notifications.map((n, i) => (
              <div key={n.id} style={{
                display: 'flex', gap: 12, padding: '12px 14px',
                borderBottom: i < notifications.length - 1 ? '1px solid #f9fafb' : 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#f0fdf4', border: '2px solid #bbf7d0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>
                  {n.icon || '📢'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontWeight: 700, fontSize: 13, color: '#1f2937',
                    lineHeight: 1.3, marginBottom: 3,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {n.title}
                  </p>
                  <p style={{
                    fontSize: 12, color: '#6b7280', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {n.body}
                  </p>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}