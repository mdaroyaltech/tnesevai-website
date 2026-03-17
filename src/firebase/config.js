// src/firebase/config.js
// ⚠️  REPLACE ALL VALUES BELOW WITH YOUR OWN FIREBASE PROJECT CONFIG
// Firebase Console → Project Settings → Your Apps → Web App → SDK Setup & Configuration

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyA8mit4qKrPUGkg8CTIgM444xhLNILTsz4",
    authDomain: "tnesevai-website.firebaseapp.com",
    projectId: "tnesevai-website",
    storageBucket: "tnesevai-website.firebasestorage.app",
    messagingSenderId: "533843473284",
    appId: "1:533843473284:web:957c4b35bf46aa124c23d1",
};

// VAPID key → Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Generate key pair
export const VAPID_KEY = "BB5MYUB248bSkzgkS-ZaMz7-Il_r0vsVKUuyKm-sdGJYQRUUOPvwTP0V8U1woQX2gHdf1VhBU6Qmp0cGvejiBKM";

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

let messaging = null;
try { messaging = getMessaging(app); } catch (_) { }
export { messaging, getToken, onMessage };
export default app;
