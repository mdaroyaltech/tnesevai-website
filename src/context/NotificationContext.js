// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { messaging, getToken, onMessage, VAPID_KEY } from '../firebase/config';
import { listenNotifications } from '../firebase/services';
import toast from 'react-hot-toast';
import NotificationPermissionModal from '../components/public/NotificationPermissionModal';

const Ctx = createContext();
export const useNotifications = () => useContext(Ctx);

// ── Notification sound using Web Audio API (no file needed) ──
function playNotifSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const freq = [880, 1100, 1320];
    freq.forEach((f, i) => {
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
  } catch (e) {
    console.log('Audio not available:', e);
  }
}

// ── localStorage keys ──
const KEY_PERM = 'rc_notif_permission'; // 'granted' | 'denied' | null
const KEY_SHOWN = 'rc_notif_prompt_shown'; // 'true' if shown this session
const KEY_READ = 'rc_readNotifs';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fcmToken, setFcmToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const prevCountRef = useRef(0);
  const isFirstLoad = useRef(true);

  // ── Live notifications from Firestore ──
  useEffect(() => {
    return listenNotifications(notifs => {
      setNotifications(notifs);
      const readIds = JSON.parse(localStorage.getItem(KEY_READ) || '[]');
      const cutoff = Date.now() - 48 * 3600 * 1000;
      const unread = notifs.filter(n => {
        const t = n.createdAt?.toMillis?.() ?? 0;
        return t > cutoff && !readIds.includes(n.id);
      });

      // ✅ Play sound when NEW notification arrives (not on first load)
      if (!isFirstLoad.current && unread.length > prevCountRef.current) {
        playNotifSound();
        // Show toast
        const newest = notifs[0];
        if (newest) {
          toast.custom(() => (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              background: 'white', borderRadius: 20, padding: '14px 18px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              borderLeft: '4px solid #22c55e', maxWidth: 360,
              animation: 'slideUpFade 0.3s ease',
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

  // ── Foreground FCM push messages ──
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

  // ── Auto-show permission modal on FIRST VISIT ──
  useEffect(() => {
    // Don't show if already granted
    if (Notification.permission === 'granted') return;
    // Don't show if already shown this session
    if (sessionStorage.getItem(KEY_SHOWN)) return;
    // Don't show if user previously allowed (browser handles it)
    const saved = localStorage.getItem(KEY_PERM);
    if (saved === 'granted') return;

    // Show modal after 3 seconds
    const t = setTimeout(() => {
      setShowModal(true);
      sessionStorage.setItem(KEY_SHOWN, 'true');
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  // ── Request browser permission + get FCM token ──
  const requestPermission = async () => {
    if (!messaging) return null;
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        localStorage.setItem(KEY_PERM, 'denied');
        return null;
      }
      // ✅ Save granted — never show modal again
      localStorage.setItem(KEY_PERM, 'granted');
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      setFcmToken(token);
      return token;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleModalAllow = async () => {
    const token = await requestPermission();
    setShowModal(false);
    if (token) {
      playNotifSound();
      toast.success('Notifications enabled! You will receive alerts for exams and services.', { duration: 4000 });
    } else {
      toast.error('Could not enable notifications. Please allow in browser settings.');
    }
  };

  const handleModalDeny = () => {
    // Don't save to localStorage — next visit will show again
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

      {/* ✅ Auto permission modal — shows on first visit */}
      {showModal && (
        <NotificationPermissionModal
          onAllow={handleModalAllow}
          onDeny={handleModalDeny}
        />
      )}
    </Ctx.Provider>
  );
};