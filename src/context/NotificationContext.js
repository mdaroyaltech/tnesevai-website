// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { messaging, getToken, onMessage, VAPID_KEY } from '../firebase/config';
import { db } from '../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { listenNotifications } from '../firebase/services';
import toast from 'react-hot-toast';
import NotificationPermissionModal from '../components/public/NotificationPermissionModal';

const Ctx = createContext();
export const useNotifications = () => useContext(Ctx);

// ── Notification chime sound ──
function playNotifSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1100, 1320].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.35);
    });
  } catch (_) { }
}

// ── Save FCM token to Firestore ──
async function saveFcmToken(token) {
  try {
    await setDoc(doc(db, 'fcm_tokens', token), {
      token,
      savedAt: serverTimestamp(),
      userAgent: navigator.userAgent,
    }, { merge: true });
    console.log('FCM token saved ✅');
  } catch (e) {
    console.warn('Could not save FCM token:', e);
  }
}

// ── Detect exact block reason & show correct instructions ──
function getPermissionError() {
  const ua = navigator.userAgent;
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad/i.test(ua);
  const isChrome = /Chrome/i.test(ua) && !/Edge/i.test(ua);
  const isFirefox = /Firefox/i.test(ua);

  if (isAndroid) {
    return {
      title: 'Notifications Blocked',
      message: 'Enable Chrome notifications in Android Settings.',
      steps: [
        '1. Open your phone Settings',
        '2. Go to Apps (or App Management)',
        '3. Find and tap Chrome',
        '4. Tap Notifications',
        '5. Turn ON "Allow notifications"',
        '6. Come back and refresh this page',
      ],
      // Android intent URL — opens Chrome app notification settings
      settingsUrl: 'intent://settings/app/com.android.chrome#Intent;scheme=android-app;end',
      btnText: 'How to Enable (See Steps Above)',
    };
  }
  if (isIOS) {
    return {
      title: 'Notifications Blocked',
      message: 'Enable notifications for Safari in iPhone Settings.',
      steps: [
        '1. Open iPhone Settings',
        '2. Scroll down → tap Safari',
        '3. Tap Notifications',
        '4. Turn ON "Allow Notifications"',
        '5. Refresh this page',
      ],
      settingsUrl: null,
      btnText: 'OK, I Will Enable It',
    };
  }
  if (isFirefox) {
    return {
      title: 'Notifications Blocked in Firefox',
      message: 'Change notification permission in Firefox.',
      steps: [
        '1. Click the 🔒 lock icon in address bar',
        '2. Click "Connection secure" → More Information',
        '3. Go to Permissions tab',
        '4. Find "Send Notifications" → Allow',
        '5. Refresh page',
      ],
      settingsUrl: null,
      btnText: 'OK, Got It',
    };
  }
  // Desktop Chrome default
  return {
    title: 'Notifications Blocked in Chrome',
    message: 'Allow notifications for this site in Chrome settings.',
    steps: [
      '1. Click the 🔒 lock icon in the address bar (top left)',
      '2. Find "Notifications" in the dropdown',
      '3. Change it from "Block" to "Allow"',
      '4. Refresh this page',
    ],
    // This works in desktop Chrome — opens site settings directly
    settingsUrl: `chrome://settings/content/siteDetails?site=${encodeURIComponent(window.location.origin)}`,
    btnText: 'Open Site Settings in Chrome',
    copyText: `chrome://settings/content/siteDetails?site=${window.location.origin}`,
  };
}

// ── localStorage keys ──
const KEY_PERM = 'rc_notif_permission';
const KEY_SHOWN = 'rc_notif_prompt_shown';
const KEY_READ = 'rc_readNotifs';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fcmToken, setFcmToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  const prevCountRef = useRef(0);
  const isFirstLoad = useRef(true);

  // ── Live Firestore notifications ──
  useEffect(() => {
    return listenNotifications(notifs => {
      setNotifications(notifs);
      const readIds = JSON.parse(localStorage.getItem(KEY_READ) || '[]');
      const cutoff = Date.now() - 48 * 3600 * 1000;
      const unread = notifs.filter(n => {
        const t = n.createdAt?.toMillis?.() ?? 0;
        return t > cutoff && !readIds.includes(n.id);
      });
      if (!isFirstLoad.current && unread.length > prevCountRef.current) {
        playNotifSound();
        const newest = notifs[0];
        if (newest) {
          toast.custom((t) => (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              background: 'white', borderRadius: 20, padding: '14px 18px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              borderLeft: '4px solid #22c55e', maxWidth: 360,
              position: 'relative',
              opacity: t.visible ? 1 : 0, transition: 'opacity 0.2s ease',
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{newest.icon || '🔔'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 800, color: '#1f2937', fontSize: 14, marginBottom: 3, paddingRight: 20 }}>{newest.title}</p>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>{newest.body}</p>
              </div>
              <button onClick={() => toast.dismiss(t.id)} style={{
                position: 'absolute', top: 10, right: 10, width: 22, height: 22,
                borderRadius: 6, background: '#f3f4f6', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9ca3af', fontSize: 12,
              }}>✕</button>
            </div>
          ), { duration: 6000, position: 'top-right' });
        }
      }
      prevCountRef.current = unread.length;
      isFirstLoad.current = false;
      setUnreadCount(unread.length);
    });
  }, []);

  // ── Foreground FCM ──
  useEffect(() => {
    if (!messaging) return;
    return onMessage(messaging, payload => {
      const { title, body } = payload.notification || {};
      playNotifSound();
      toast.custom((t) => (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          background: 'white', borderRadius: 20, padding: '14px 18px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          borderLeft: '4px solid #22c55e', maxWidth: 360,
          position: 'relative',
          opacity: t.visible ? 1 : 0, transition: 'opacity 0.2s ease',
        }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>🔔</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 800, color: '#1f2937', fontSize: 14, marginBottom: 3, paddingRight: 20 }}>{title}</p>
            <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>{body}</p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} style={{
            position: 'absolute', top: 10, right: 10, width: 22, height: 22,
            borderRadius: 6, background: '#f3f4f6', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9ca3af', fontSize: 12,
          }}>✕</button>
        </div>
      ), { duration: 6000, position: 'top-right' });
    });
  }, []);

  // ── ✅ KEY FIX: App load hote hi already-allowed users ka token save karo ──
  useEffect(() => {
    if (!messaging) return;
    if (typeof Notification === 'undefined') return;

    // Agar permission already granted hai → token fetch + save karo
    if (Notification.permission === 'granted') {
      getToken(messaging, { vapidKey: VAPID_KEY })
        .then(token => {
          if (token) {
            setFcmToken(token);
            saveFcmToken(token);
            localStorage.setItem(KEY_PERM, 'granted');
          }
        })
        .catch(e => console.warn('Token fetch on load failed:', e));
      return;
    }

    // Show modal on first visit if not granted
    if (Notification.permission === 'denied') return;
    if (sessionStorage.getItem(KEY_SHOWN)) return;
    if (localStorage.getItem(KEY_PERM) === 'granted') return;

    const t = setTimeout(() => {
      setShowModal(true);
      sessionStorage.setItem(KEY_SHOWN, 'true');
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  // ── Request permission ──
  const requestPermission = async () => {
    if (!messaging) {
      toast.error('Push notifications not supported in this browser.');
      return null;
    }
    try {
      if (Notification.permission === 'denied') {
        setErrorInfo(getPermissionError());
        return null;
      }
      const perm = await Notification.requestPermission();
      if (perm === 'denied') {
        localStorage.setItem(KEY_PERM, 'denied');
        setErrorInfo(getPermissionError());
        return null;
      }
      if (perm !== 'granted') return null;

      localStorage.setItem(KEY_PERM, 'granted');
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (!token) {
        toast.error('Could not get notification token. Check Firebase config.');
        return null;
      }
      setFcmToken(token);
      await saveFcmToken(token);
      return token;
    } catch (e) {
      console.error('Permission error:', e);
      setErrorInfo(getPermissionError());
      return null;
    }
  };

  const handleModalAllow = async () => {
    const token = await requestPermission();
    setShowModal(false);
    if (token) {
      playNotifSound();
      toast.success('Notifications enabled!', { duration: 4000 });
    }
  };

  const handleModalDeny = () => {
    localStorage.setItem(KEY_PERM, 'denied');
    setShowModal(false);
  };

  const markAllRead = () => {
    const ids = notifications.map(n => n.id);
    localStorage.setItem(KEY_READ, JSON.stringify(ids));
    setUnreadCount(0);
  };

  return (
    <Ctx.Provider value={{ notifications, unreadCount, fcmToken, requestPermission, markAllRead }}>
      {children}
      {showModal && !errorInfo && (
        <NotificationPermissionModal
          onAllow={handleModalAllow}
          onDeny={handleModalDeny}
        />
      )}
      {errorInfo && (
        <PermissionErrorModal
          info={errorInfo}
          onClose={() => setErrorInfo(null)}
        />
      )}
    </Ctx.Provider>
  );
};

// ── Permission Error Modal ──────────────────────────────────
function PermissionErrorModal({ info, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleSettings = () => {
    if (info.copyText) {
      // Copy URL to clipboard — user can paste in address bar
      navigator.clipboard.writeText(info.copyText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => { });
    }
    // Try opening — works in some cases
    if (info.settingsUrl) {
      try { window.location.href = info.settingsUrl; } catch (_) { }
    }
  };

  return (
    <>
      <style>{`
        @keyframes errorSlideUp {
          from { opacity:0; transform:translateY(24px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9995, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }} onClick={onClose} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 9996, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{
          background: 'white', borderRadius: 28, overflow: 'hidden',
          width: '100%', maxWidth: 400,
          boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
          animation: 'errorSlideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
        }} onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#7f1d1d,#dc2626)', padding: '24px 24px 20px', position: 'relative', textAlign: 'center' }}>
            <button onClick={onClose} style={{
              position: 'absolute', top: 14, right: 14, width: 30, height: 30,
              borderRadius: 9, background: 'rgba(255,255,255,0.2)', border: 'none',
              cursor: 'pointer', color: 'white', fontSize: 14,
            }}>✕</button>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔕</div>
            <h2 style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', marginBottom: 4 }}>{info.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{info.message}</p>
          </div>

          {/* Steps */}
          <div style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              How to fix:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {info.steps.map((step, i) => (
                <div key={i} style={{
                  padding: '10px 14px', borderRadius: 12,
                  background: i === 0 ? '#fff7ed' : '#f9fafb',
                  border: i === 0 ? '1px solid #fed7aa' : '1px solid #f0fdf4',
                }}>
                  <p style={{ fontSize: 13, color: '#374151', fontWeight: i === 0 ? 700 : 500, lineHeight: 1.4 }}>{step}</p>
                </div>
              ))}
            </div>

            {/* Copy URL button for desktop Chrome */}
            {info.copyText && (
              <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '12px 14px', marginBottom: 12, border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: 11, color: '#15803d', fontWeight: 700, marginBottom: 6 }}>
                  📋 Copy this URL → paste in Chrome address bar:
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ fontSize: 11, color: '#374151', flex: 1, background: 'white', padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', wordBreak: 'break-all' }}>
                    {info.copyText}
                  </code>
                  <button
                    onClick={handleSettings}
                    style={{
                      padding: '6px 14px', borderRadius: 10, border: 'none',
                      background: copied ? '#15803d' : '#22c55e',
                      color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                      flexShrink: 0, transition: 'all 0.2s',
                    }}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            <button onClick={onClose} style={{
              width: '100%', padding: '12px', borderRadius: 16,
              border: '2px solid #e5e7eb', background: 'white',
              color: '#6b7280', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}