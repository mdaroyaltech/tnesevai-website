// public/firebase-messaging-sw.js
// ⚠️ REPLACE CONFIG VALUES BELOW — must match your src/firebase/config.js

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

// Handle background (app not open) push messages
messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification || {};
    self.registration.showNotification(title || 'Royal Computers', {
        body: body || 'New notification',
        icon: icon || '/logo192.png',
        badge: '/logo192.png',
        data: payload.data || {},
        actions: [
            { action: 'open', title: 'Open App' },
            { action: 'close', title: 'Dismiss' },
        ],
    });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'open' || !event.action) {
        event.waitUntil(clients.openWindow('/'));
    }
});
