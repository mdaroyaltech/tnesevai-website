// src/pages/admin/SendNotificationPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { FaBell, FaPaperPlane, FaUsers, FaSpinner } from 'react-icons/fa';

const ICONS = ['📢', '🔔', '🎓', '📅', '⚡', '✅', '🆕', '🏛️', '💡', '🚨'];

const TEMPLATES = [
  { title: 'New Service Available', body: 'A new government service is now available. Visit us today!', icon: '🆕' },
  { title: 'Exam Deadline Alert', body: 'Important exam deadline approaching. Come and apply today!', icon: '🎓' },
  { title: 'Holiday Notice', body: 'Our center will be closed tomorrow. We will reopen next day.', icon: '📅' },
  { title: 'Important Announcement', body: 'Important update from Royal Computers. Please visit our website.', icon: '📢' },
];

export default function SendNotificationPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ title: '', body: '', icon: '📢' });
  const [sending, setSending] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);

  // Count registered FCM tokens
  useEffect(() => {
    getDocs(collection(db, 'fcm_tokens')).then(snap => setTokenCount(snap.size));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSend = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Title and message are required');
      return;
    }
    setSending(true);
    try {
      // Save to Firestore — all open tabs will get it via onSnapshot
      await addDoc(collection(db, 'notifications'), {
        title: form.title.trim(),
        body: form.body.trim(),
        icon: form.icon,
        createdAt: serverTimestamp(),
      });
      toast.success('Notification sent to all users!');
      setForm({ title: '', body: '', icon: '📢' });
    } catch (err) {
      toast.error('Failed: ' + err.message);
    }
    setSending(false);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="font-display font-extrabold text-gray-800 text-xl flex items-center gap-2">
          <FaBell className="text-primary-600" /> {t('sendNotif')}
        </h1>
        <p className="text-gray-500 text-xs mt-1">
          Send push notification to all website visitors
        </p>
      </div>

      {/* Token count */}
      <div style={{
        background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 16,
        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <FaUsers style={{ color: '#15803d', fontSize: 18 }} />
        <div>
          <p style={{ fontWeight: 800, color: '#15803d', fontSize: 15 }}>{tokenCount} subscribers</p>
          <p style={{ fontSize: 11, color: '#6b7280' }}>Users who allowed notifications</p>
        </div>
      </div>

      {/* Templates */}
      <div className="card p-4">
        <p className="font-bold text-sm text-gray-700 mb-3">Quick Templates</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TEMPLATES.map((tmpl, i) => (
            <button key={i}
              onClick={() => setForm({ title: tmpl.title, body: tmpl.body, icon: tmpl.icon })}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 14px', borderRadius: 14, border: '2px solid #e5e7eb',
                background: 'white', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.background = '#f0fdf4'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white'; }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{tmpl.icon}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 12, color: '#1f2937' }}>{tmpl.title}</p>
                <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.4, marginTop: 2 }}>{tmpl.body}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="card p-5 space-y-4">
        <p className="font-bold text-sm text-gray-700 border-b pb-2">Compose Notification</p>

        {/* Icon picker */}
        <div>
          <label className="label">Icon</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ICONS.map(ic => (
              <button key={ic}
                onClick={() => set('icon', ic)}
                style={{
                  width: 42, height: 42, borderRadius: 12, fontSize: 20,
                  border: `2px solid ${form.icon === ic ? '#22c55e' : '#e5e7eb'}`,
                  background: form.icon === ic ? '#f0fdf4' : 'white',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >{ic}</button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="label">Title *</label>
          <input
            className="input-field"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. New Service Available"
            maxLength={60}
          />
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, textAlign: 'right' }}>{form.title.length}/60</p>
        </div>

        {/* Body */}
        <div>
          <label className="label">Message *</label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={form.body}
            onChange={e => set('body', e.target.value)}
            placeholder="e.g. Important update for all customers..."
            maxLength={200}
          />
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, textAlign: 'right' }}>{form.body.length}/200</p>
        </div>

        {/* Preview */}
        {(form.title || form.body) && (
          <div style={{
            background: '#f9fafb', borderRadius: 16, padding: '14px 16px',
            border: '1px solid #e5e7eb',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Preview</p>
            <div style={{
              display: 'flex', gap: 12, background: 'white', borderRadius: 14,
              padding: '12px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              borderLeft: '3px solid #22c55e',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{form.icon}</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 13, color: '#1f2937', marginBottom: 3 }}>{form.title || 'Title'}</p>
                <p style={{ fontSize: 12, color: '#6b7280' }}>{form.body || 'Message...'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={sending || !form.title || !form.body}
          className="btn-primary w-full justify-center py-3.5 disabled:opacity-50"
        >
          {sending
            ? <><FaSpinner className="animate-spin" /> Sending...</>
            : <><FaPaperPlane /> Send Notification</>
          }
        </button>
      </div>

      {/* How it works */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 16, padding: '16px 18px' }}>
        <p style={{ fontWeight: 800, fontSize: 13, color: '#1d4ed8', marginBottom: 10 }}>How notifications work</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            '📱 Users who allowed notifications → get system notification even when browser is closed',
            '🌐 Users with website open → see popup toast on screen',
            '🔔 Bell icon shows unread count badge',
            '📋 All notifications saved in Notification panel',
          ].map((item, i) => (
            <p key={i} style={{ fontSize: 12, color: '#1e40af' }}>{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
}