// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { messaging, getToken, onMessage, VAPID_KEY } from '../firebase/config';
import { listenNotifications } from '../firebase/services';
import toast from 'react-hot-toast';
import NotificationPermissionModal from '../components/public/NotificationPermissionModal';

const Ctx = createContext();
export const useNotifications = () => useContext(Ctx);

// ── Notification chime sound ──────────────────────────────
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

// ── Detect exact block reason ─────────────────────────────
function getPermissionError() {
  const perm = Notification.permission;
  if (perm === 'denied') {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad/i.test(ua);
    const isChrome = /Chrome/i.test(ua);

    if (isAndroid && isChrome) {
      return {
        type: 'android_chrome',
        title: 'Notifications Blocked',
        message: 'Chrome notifications are blocked on your device.',
        steps: [
          '1. Open phone Settings',
          '2. Go to Apps → Chrome',
          '3. Tap Notifications',
          '4. Turn ON "Allow notifications"',
          '5. Come back and refresh this page',
        ],
        settingsUrl: 'app-settings:', // Android deep link
        btnText: 'Open Chrome Settings',
      };
    }
    if (isIOS) {
      return {
        type: 'ios',
        title: 'Notifications Blocked',
        message: 'Enable notifications for Safari in iOS Settings.',
        steps: [
          '1. Open iPhone Settings',
          '2. Scroll down to Safari',
          '3. Tap Notifications',
          '4. Turn ON "Allow Notifications"',
          '5. Refresh this page',
        ],
        settingsUrl: null,
        btnText: 'OK, I will do it',
      };
    }
    if (isChrome) {
      return {
        type: 'chrome_desktop',
        title: 'Notifications Blocked in Chrome',
        message: 'You have blocked notifications for this site.',
        steps: [
          '1. Click the 🔒 lock icon in the address bar',
          '2. Find "Notifications" → Change to "Allow"',
          '3. Refresh the page',
        ],
        settingsUrl: 'chrome://settings/content/notifications',
        btnText: 'Open Chrome Settings',
      };
    }
    return {
      type: 'browser',
      title: 'Notifications Blocked',
      message: 'Please allow notifications in your browser settings.',
      steps: [
        '1. Click the lock/info icon in the address bar',
        '2. Find Notifications → Set to Allow',
        '3. Refresh the page',
      ],
      settingsUrl: null,
      btnText: 'OK, Got it',
    };
  }
  return null;
}

// ── localStorage keys ─────────────────────────────────────
const KEY_PERM = 'rc_notif_permission';
const KEY_SHOWN = 'rc_notif_prompt_shown';
const KEY_READ = 'rc_readNotifs';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fcmToken, setFcmToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null); // permission error modal
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

      // Play sound + toast only when NEW notification arrives
      if (!isFirstLoad.current && unread.length > prevCountRef.current) {
        playNotifSound();
        const newest = notifs[0];
        if (newest) {
          toast.custom(() => (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              background: 'white', borderRadius: 20, padding: '14px 18px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              borderLeft: '4px solid #22c55e', maxWidth: 360,
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{newest.icon || '🔔'}</span>
              <div>
                <p style={{ fontWeight: 800, color: '#1f2937', fontSize: 14, marginBottom: 3 }}>{newest.title}</p>
                <p style={{ fontSize: 12, color: '#6b7280' }}>{newest.body}</p>
              </div>
            </div>
          ), { duration: 6000, position: 'top-right' });
        }
      }
      prevCountRef.current = unread.length;
      isFirstLoad.current = false;
      setUnreadCount(unread.length);
    });
  }, []);

  // ── Foreground FCM push ──
  useEffect(() => {
    if (!messaging) return;
    return onMessage(messaging, payload => {
      const { title, body } = payload.notification || {};
      playNotifSound();
      toast.custom(() => (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          background: 'white', borderRadius: 20, padding: '14px 18px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          borderLeft: '4px solid #22c55e', maxWidth: 360,
        }}>
          <span style={{ fontSize: 24 }}>🔔</span>
          <div>
            <p style={{ fontWeight: 800, color: '#1f2937', fontSize: 14, marginBottom: 3 }}>{title}</p>
            <p style={{ fontSize: 12, color: '#6b7280' }}>{body}</p>
          </div>
        </div>
      ), { duration: 6000, position: 'top-right' });
    });
  }, []);

  // ── Auto show modal on first visit ──
  useEffect(() => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') return;
    if (sessionStorage.getItem(KEY_SHOWN)) return;
    const saved = localStorage.getItem(KEY_PERM);
    if (saved === 'granted') return;

    const t = setTimeout(() => {
      setShowModal(true);
      sessionStorage.setItem(KEY_SHOWN, 'true');
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  // ── Request permission with full error detection ──
  const requestPermission = async () => {
    if (!messaging) {
      toast.error('Push notifications not supported in this browser.');
      return null;
    }

    try {
      // Check if already denied
      if (Notification.permission === 'denied') {
        const err = getPermissionError();
        setErrorInfo(err);
        return null;
      }

      const perm = await Notification.requestPermission();

      if (perm === 'denied') {
        localStorage.setItem(KEY_PERM, 'denied');
        const err = getPermissionError();
        setErrorInfo(err);
        return null;
      }

      if (perm !== 'granted') {
        localStorage.setItem(KEY_PERM, 'denied');
        return null;
      }

      // Get FCM token
      localStorage.setItem(KEY_PERM, 'granted');
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (!token) {
        toast.error('Could not get notification token. Check Firebase config.');
        return null;
      }
      setFcmToken(token);
      return token;

    } catch (e) {
      console.error('Permission error:', e);
      if (e.message?.includes('messaging/permission-blocked')) {
        const err = getPermissionError();
        setErrorInfo(err);
      } else {
        toast.error(`Error: ${e.message}`);
      }
      return null;
    }
  };

  const handleModalAllow = async () => {
    const token = await requestPermission();
    setShowModal(false);
    if (token) {
      playNotifSound();
      toast.success('Notifications enabled successfully!', { duration: 4000 });
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

      {/* Auto permission modal */}
      {showModal && !errorInfo && (
        <NotificationPermissionModal
          onAllow={handleModalAllow}
          onDeny={handleModalDeny}
        />
      )}

      {/* Permission error modal with exact steps */}
      {errorInfo && (
        <PermissionErrorModal
          info={errorInfo}
          onClose={() => setErrorInfo(null)}
        />
      )}
    </Ctx.Provider>
  );
};

// ── Error modal — shows exact steps based on device ──────
function PermissionErrorModal({ info, onClose }) {
  const openSettings = () => {
    if (info.settingsUrl) {
      // Try to open settings
      try {
        window.open(info.settingsUrl, '_blank');
      } catch (_) { }
    }
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes errorSlideUp {
          from { opacity:0; transform:translateY(24px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9995,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
      }} onClick={onClose} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9996,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}>
        <div style={{
          background: 'white', borderRadius: 28, overflow: 'hidden',
          width: '100%', maxWidth: 380,
          boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
          animation: 'errorSlideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
        }} onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#7f1d1d,#dc2626)',
            padding: '24px 24px 20px', position: 'relative',
          }}>
            <div style={{ fontSize: 36, marginBottom: 10, textAlign: 'center' }}>🔕</div>
            <h2 style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', textAlign: 'center', marginBottom: 4 }}>
              {info.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center' }}>
              {info.message}
            </p>
          </div>

          {/* Steps */}
          <div style={{ padding: '20px 24px' }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              How to fix:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {info.steps.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 14px', borderRadius: 12,
                  background: i === 0 ? '#fff7ed' : '#f9fafb',
                  border: i === 0 ? '1px solid #fed7aa' : '1px solid #f0fdf4',
                }}>
                  <p style={{ fontSize: 13, color: '#374151', fontWeight: i === 0 ? 700 : 500, lineHeight: 1.4 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Open Settings button */}
            <button
              onClick={openSettings}
              style={{
                width: '100%', padding: '13px', borderRadius: 16,
                background: 'linear-gradient(135deg,#dc2626,#ef4444)',
                color: 'white', fontWeight: 800, fontSize: 14,
                border: 'none', cursor: 'pointer', marginBottom: 10,
                boxShadow: '0 8px 24px rgba(220,38,38,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              ⚙️ {info.btnText}
            </button>

            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '11px', borderRadius: 16,
                border: '2px solid #e5e7eb', background: 'white',
                color: '#6b7280', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}