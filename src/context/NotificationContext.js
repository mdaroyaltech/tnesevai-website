// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { messaging, getToken, onMessage, VAPID_KEY } from '../firebase/config';
import { listenNotifications } from '../firebase/services';
import toast from 'react-hot-toast';

const Ctx = createContext();
export const useNotifications = () => useContext(Ctx);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [fcmToken,      setFcmToken]      = useState(null);

  // Live notifications from Firestore
  useEffect(() => listenNotifications(notifs => {
    setNotifications(notifs);
    const readIds = JSON.parse(localStorage.getItem('rc_readNotifs') || '[]');
    const cutoff  = Date.now() - 48 * 3600 * 1000;
    const unread  = notifs.filter(n => {
      const t = n.createdAt?.toMillis?.() ?? 0;
      return t > cutoff && !readIds.includes(n.id);
    });
    setUnreadCount(unread.length);
  }), []);

  // Foreground push messages
  useEffect(() => {
    if (!messaging) return;
    return onMessage(messaging, payload => {
      const { title, body } = payload.notification || {};
      toast.custom(t => (
        <div className={`flex items-start gap-3 bg-white shadow-2xl rounded-2xl p-4 border-l-4 border-primary-600 max-w-sm w-full ${t.visible ? 'animate-slide-in' : 'opacity-0'}`}>
          <span className="text-2xl mt-0.5">🔔</span>
          <div>
            <p className="font-bold text-gray-800 text-sm">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{body}</p>
          </div>
        </div>
      ), { duration: 6000 });
    });
  }, []);

  const requestPermission = async () => {
    if (!messaging) return null;
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return null;
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      setFcmToken(token);
      return token;
    } catch (e) { console.error(e); return null; }
  };

  const markAllRead = () => {
    const ids = notifications.map(n => n.id);
    localStorage.setItem('rc_readNotifs', JSON.stringify(ids));
    setUnreadCount(0);
  };

  return (
    <Ctx.Provider value={{ notifications, unreadCount, fcmToken, requestPermission, markAllRead }}>
      {children}
    </Ctx.Provider>
  );
};
