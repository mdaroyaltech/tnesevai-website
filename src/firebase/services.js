// src/firebase/services.js
import { db } from './config';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, onSnapshot, serverTimestamp, setDoc, getDoc,
} from 'firebase/firestore';

// ── localStorage cache helpers ──────────────────────────────
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const saveCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch { }
};

const loadCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null; // expired
    return data;
  } catch { return null; }
};

// ── SERVICES ────────────────────────────────────────────────
export const listenServices = (cb) => {
  // ✅ Step 1: Show cached data instantly (0ms delay)
  const cached = loadCache('rc_services');
  if (cached && cached.length > 0) cb(cached);

  // ✅ Step 2: Listen for live updates from Firebase
  const unsub = onSnapshot(
    query(collection(db, 'services'), orderBy('order', 'asc')),
    snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      cb(data);
      saveCache('rc_services', data); // update cache
    },
    err => console.error('Services listen error:', err)
  );
  return unsub;
};

export const addService = (data) =>
  addDoc(collection(db, 'services'), { ...data, createdAt: serverTimestamp(), order: Date.now() });
export const updateService = (id, data) =>
  updateDoc(doc(db, 'services', id), { ...data, updatedAt: serverTimestamp() });
export const deleteService = (id) => deleteDoc(doc(db, 'services', id));

// ── EXAMS ────────────────────────────────────────────────────
export const listenExams = (cb) => {
  const cached = loadCache('rc_exams');
  if (cached && cached.length > 0) cb(cached);

  const unsub = onSnapshot(
    query(collection(db, 'exams'), orderBy('lastDate', 'asc')),
    snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      cb(data);
      saveCache('rc_exams', data);
    },
    err => console.error('Exams listen error:', err)
  );
  return unsub;
};

export const addExam = (data) =>
  addDoc(collection(db, 'exams'), { ...data, createdAt: serverTimestamp() });
export const updateExam = (id, data) =>
  updateDoc(doc(db, 'exams', id), { ...data, updatedAt: serverTimestamp() });
export const deleteExam = (id) => deleteDoc(doc(db, 'exams', id));

// ── NOTIFICATIONS ────────────────────────────────────────────
export const listenNotifications = (cb) =>
  onSnapshot(
    query(collection(db, 'notifications'), orderBy('createdAt', 'desc')),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );

export const addNotification = (data) =>
  addDoc(collection(db, 'notifications'), { ...data, createdAt: serverTimestamp() });

// ── CONTACT SETTINGS ─────────────────────────────────────────
export const getContactSettings = async () => {
  // ✅ Cache contact settings too
  const cached = loadCache('rc_contact');
  if (cached) return cached;

  try {
    const snap = await getDoc(doc(db, 'settings', 'contact'));
    const data = snap.exists() ? snap.data() : {};
    saveCache('rc_contact', data);
    return data;
  } catch { return {}; }
};

// ✅ Live listener — updates instantly when admin saves
export const listenContactSettings = (cb) => {
  // Clear old cache first so fresh data loads
  try { localStorage.removeItem('rc_contact'); } catch { }
  return onSnapshot(
    doc(db, 'settings', 'contact'),
    snap => {
      const data = snap.exists() ? snap.data() : {};
      saveCache('rc_contact', data);
      cb(data);
    },
    err => console.error('Contact settings error:', err)
  );
};

export const saveContactSettings = (data) =>
  setDoc(doc(db, 'settings', 'contact'), data, { merge: true });