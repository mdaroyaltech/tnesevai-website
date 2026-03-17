// src/firebase/services.js
import { db } from './config';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, onSnapshot, serverTimestamp, setDoc, getDoc
} from 'firebase/firestore';

/* ── SERVICES ── */
export const listenServices = (cb) =>
  onSnapshot(query(collection(db,'services'), orderBy('order','asc')), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

export const addService = (data) =>
  addDoc(collection(db,'services'), { ...data, createdAt: serverTimestamp(), order: Date.now() });

export const updateService = (id, data) =>
  updateDoc(doc(db,'services',id), { ...data, updatedAt: serverTimestamp() });

export const deleteService = (id) => deleteDoc(doc(db,'services',id));

/* ── EXAMS ── */
export const listenExams = (cb) =>
  onSnapshot(query(collection(db,'exams'), orderBy('lastDate','asc')), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

export const addExam    = (data) => addDoc(collection(db,'exams'), { ...data, createdAt: serverTimestamp() });
export const updateExam = (id, data) => updateDoc(doc(db,'exams',id), { ...data, updatedAt: serverTimestamp() });
export const deleteExam = (id) => deleteDoc(doc(db,'exams',id));

/* ── NOTIFICATIONS ── */
export const listenNotifications = (cb) =>
  onSnapshot(query(collection(db,'notifications'), orderBy('createdAt','desc')), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

export const addNotification = (data) =>
  addDoc(collection(db,'notifications'), { ...data, createdAt: serverTimestamp() });

/* ── CONTACT SETTINGS ── */
export const getContactSettings = async () => {
  const snap = await getDoc(doc(db,'settings','contact'));
  return snap.exists() ? snap.data() : {};
};
export const saveContactSettings = (data) =>
  setDoc(doc(db,'settings','contact'), data, { merge: true });
