// src/pages/admin/SendNotificationPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addNotification, listenNotifications } from '../../firebase/services';
import toast from 'react-hot-toast';
import { FaBell, FaPaperPlane, FaTrash } from 'react-icons/fa';

const QUICK_TEMPLATES = [
  { icon:'🔔', title:'New Service Added',       body:'We have added a new service at Royal Computers. Visit us today!' },
  { icon:'📅', title:'Exam Notification',        body:'Important exam deadline approaching. Come and apply today!' },
  { icon:'⏰', title:'Holiday Notice',           body:'Our center will be closed on {date}. We will reopen on {next day}.' },
  { icon:'🎉', title:'Special Offer',            body:'Special service today at Royal Computers. Visit us now!' },
  { icon:'📋', title:'TNPSC Alert',              body:'TNPSC application dates are announced. Apply before the deadline!' },
  { icon:'🩺', title:'NEET Application Open',    body:'NEET 2025 application is now open. Last date is approaching. Apply now!' },
];

const fmt = (ts) => {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
};

export default function SendNotificationPage() {
  const { t } = useTranslation();
  const [notifs,  setNotifs]  = useState([]);
  const [title,   setTitle]   = useState('');
  const [body,    setBody]    = useState('');
  const [icon,    setIcon]    = useState('🔔');
  const [sending, setSending] = useState(false);

  useEffect(() => listenNotifications(setNotifs), []);

  const handleSend = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!body.trim())  { toast.error('Message body is required'); return; }
    setSending(true);
    try {
      await addNotification({ title: title.trim(), body: body.trim(), icon });
      toast.success('Notification sent!');
      setTitle(''); setBody(''); setIcon('🔔');
    } catch { toast.error('Failed to send notification'); }
    setSending(false);
  };

  const useTemplate = (tpl) => {
    setTitle(tpl.title);
    setBody(tpl.body);
    setIcon(tpl.icon);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-gray-800 text-xl">{t('sendNotif')}</h1>
        <p className="text-gray-500 text-xs mt-0.5">Notifications appear in the bell icon on the public portal</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="card p-5 space-y-4">
          <h2 className="font-display font-bold text-gray-800">Compose Notification</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="label">Icon</label>
              <input className="input-field text-2xl text-center" value={icon} onChange={e => setIcon(e.target.value)} />
            </div>
            <div className="col-span-3">
              <label className="label">{t('notifTitle')} *</label>
              <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title" />
            </div>
          </div>

          <div>
            <label className="label">{t('notifBody')} *</label>
            <textarea
              className="input-field resize-none"
              rows={4}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Notification message body..."
            />
            <p className="text-xs text-gray-400 mt-1">{body.length}/200 characters</p>
          </div>

          {/* Preview */}
          {(title || body) && (
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200">
              <p className="text-xs text-gray-400 font-semibold mb-2">PREVIEW</p>
              <div className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm border-l-4 border-primary-500">
                <span className="text-xl">{icon || '🔔'}</span>
                <div>
                  <p className="font-bold text-sm text-gray-800">{title || 'Notification Title'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{body || 'Notification body text...'}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={sending}
            className="btn-primary w-full justify-center py-3 disabled:opacity-60"
          >
            {sending
              ? <><span className="animate-spin">⏳</span> Sending...</>
              : <><FaPaperPlane /> {t('sendNotifBtn')}</>
            }
          </button>
        </div>

        {/* Quick Templates */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-display font-bold text-gray-800 mb-3">Quick Templates</h2>
            <div className="space-y-2">
              {QUICK_TEMPLATES.map((tpl, i) => (
                <button key={i}
                  onClick={() => useTemplate(tpl)}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-primary-50 rounded-xl transition-all border border-transparent hover:border-primary-200 text-left"
                >
                  <span className="text-xl flex-shrink-0">{tpl.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{tpl.title}</p>
                    <p className="text-xs text-gray-400 truncate">{tpl.body}</p>
                  </div>
                  <span className="text-xs text-primary-600 font-semibold flex-shrink-0">Use →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sent Notifications History */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-gray-800">Sent Notifications ({notifs.length})</h2>
        </div>
        {notifs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FaBell className="text-4xl mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications sent yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {notifs.map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl flex-shrink-0">{n.icon || '📢'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{n.title}</p>
                  <p className="text-xs text-gray-500 truncate">{n.body}</p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">{fmt(n.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
