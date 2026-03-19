// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey:            "AIzaSyA8mit4qKrPUGkg8CTIgM444xhLNILTsz4",
  authDomain:        "tnesevai-website.firebaseapp.com",
  projectId:         "tnesevai-website",
  storageBucket:     "tnesevai-website.firebasestorage.app",
  messagingSenderId: "533843473284",
  appId:             "1:533843473284:web:957c4b35bf46aa124c23d1",
};

export const VAPID_KEY = "BB5MYUB248bSkzgkS-ZaMz7-Il_r0vsVKUuyKm-sdGJYQRUUOPvwTP0V8U1woQX2gHdf1VhBU6Qmp0cGvejiBKM";

const app = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);

// ✅ Enable offline cache — data IndexedDB mein save hoga
// Pehli baar slow, baad ke page loads instant!
enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open — sirf ek tab mein kaam karta hai
    console.warn('Firestore persistence: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // Browser support nahi karta
    console.warn('Firestore persistence not supported');
  }
});

let messaging = null;
try { messaging = getMessaging(app); } catch (_) {}
export { messaging, getToken, onMessage };
export default app;
