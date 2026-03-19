// public/firebase-messaging-sw.js
// ⚠️ This file MUST be in /public root — NOT inside /src
// Background notifications work even when browser is closed

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyA8mit4qKrPUGkg8CTIgM444xhLNILTsz4",
    authDomain: "tnesevai-website.firebaseapp.com",
    projectId: "tnesevai-website",
    storageBucket: "tnesevai-website.firebasestorage.app",
    messagingSenderId: "533843473284",
    appId: "1:533843473284:web:957c4b35bf46aa124c23d1",
});

const messaging = firebase.messaging();

// ── Background message handler ──────────────────────────────
// Fires when app is in background OR browser tab is closed
messaging.onBackgroundMessage(payload => {
    console.log('[SW] Background message:', payload);

    const { title, body, icon, image } = payload.notification || {};
    const data = payload.data || {};

    self.registration.showNotification(title || 'Royal Computers', {
        body: body || 'You have a new notification',
        icon: icon || '/logo192.png',
        image: image || undefined,
        badge: '/logo192.png',
        vibrate: [200, 100, 200],
        data: { url: data.url || '/', ...data },
        actions: [
            { action: 'open', title: 'Open Website' },
            { action: 'close', title: 'Dismiss' },
        ],
        requireInteraction: false,
        tag: 'rc-notification', // Replaces previous unread notification
    });
});

// ── Notification click handler ──────────────────────────────
self.addEventListener('notificationclick', event => {
    event.notification.close();

    const url = event.notification.data?.url || '/';

    if (event.action === 'close') return;

    // Open or focus existing tab
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // If tab already open → focus it
            for (const client of windowClients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    client.navigate(url);
                    return;
                }
            }
            // Otherwise open new tab
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

// ── Push event fallback ─────────────────────────────────────
self.addEventListener('push', event => {
    if (!event.data) return;

    let payload;
    try { payload = event.data.json(); }
    catch { payload = { notification: { title: 'Royal Computers', body: event.data.text() } }; }

    const { title, body, icon } = payload.notification || {};

    event.waitUntil(
        self.registration.showNotification(title || 'Royal Computers', {
            body: body || 'New update from Royal Computers',
            icon: icon || '/logo192.png',
            badge: '/logo192.png',
            vibrate: [200, 100, 200],
            data: { url: '/' },
        })
    );
});