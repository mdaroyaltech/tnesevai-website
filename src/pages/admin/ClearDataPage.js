// src/pages/admin/ClearDataPage.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import {
  collection, getDocs, deleteDoc, doc, writeBatch
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { FaTrash, FaExclamationTriangle, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const COLLECTIONS = [
  { key: 'services',      label: 'Services',       icon: '🛠️', color: '#16a34a' },
  { key: 'exams',         label: 'Exams / Alerts',  icon: '📅', color: '#2563eb' },
  { key: 'notifications', label: 'Notifications',   icon: '🔔', color: '#d97706' },
];

export default function ClearDataPage() {
  const [counts,   setCounts]   = useState({});
  const [loading,  setLoading]  = useState({});
  const [cleared,  setCleared]  = useState({});
  const [confirm,  setConfirm]  = useState(null); // which collection is pending confirm

  // Load counts on mount
  useEffect(() => { fetchCounts(); }, []);

  const fetchCounts = async () => {
    const result = {};
    for (const c of COLLECTIONS) {
      const snap = await getDocs(collection(db, c.key));
      result[c.key] = snap.size;
    }
    setCounts(result);
  };

  // Delete all docs in a collection using batches
  const clearCollection = async (colKey) => {
    setConfirm(null);
    setLoading(l => ({ ...l, [colKey]: true }));
    try {
      let deleted = 0;
      // Firebase batch max = 500 per batch
      let snap = await getDocs(collection(db, colKey));
      while (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach(d => batch.delete(doc(db, colKey, d.id)));
        await batch.commit();
        deleted += snap.docs.length;
        snap = await getDocs(collection(db, colKey));
      }
      setCleared(c => ({ ...c, [colKey]: true }));
      setCounts(c => ({ ...c, [colKey]: 0 }));
      toast.success(`✅ ${deleted} items deleted from ${colKey}!`);
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    }
    setLoading(l => ({ ...l, [colKey]: false }));
  };

  const clearAll = async () => {
    setConfirm(null);
    for (const c of COLLECTIONS.filter(c => c.key !== 'notifications')) {
      await clearCollection(c.key);
    }
  };

  return (
    <div style={{ maxWidth: 600 }} className="space-y-5">

      {/* Header */}
      <div>
        <h1 className="font-display font-extrabold text-gray-800 text-xl">Clear / Delete Data</h1>
        <p className="text-gray-500 text-xs mt-1">
          Delete imported data — individual collections or all at once
        </p>
      </div>

      {/* Warning box */}
      <div className="card p-4 border-2 border-red-200 bg-red-50">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-700 text-sm">⚠️ This action cannot be undone!</p>
            <p className="text-red-600 text-xs mt-1">
              Once deleted, data cannot be recovered. Only proceed if you are certain.
              You can then re-import fresh data from the Bulk Import page.
            </p>
          </div>
        </div>
      </div>

      {/* Collection cards */}
      {COLLECTIONS.map(({ key, label, icon, color }) => (
        <div key={key} className="card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{
                width: 48, height: 48, borderRadius: 14, fontSize: 22,
                background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {icon}
              </div>
              <div>
                <p className="font-display font-bold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {counts[key] === undefined
                    ? 'Loading...'
                    : counts[key] === 0
                      ? '✅ Empty — nothing to delete'
                      : <span className="font-semibold text-orange-600">{counts[key]} items in Firebase</span>
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cleared[key] ? (
                <span className="flex items-center gap-1 text-xs text-green-600 font-bold">
                  <FaCheckCircle /> Cleared!
                </span>
              ) : loading[key] ? (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <FaSpinner className="animate-spin" /> Deleting...
                </span>
              ) : confirm === key ? (
                /* Confirm step */
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 font-semibold">Sure ho?</span>
                  <button
                    onClick={() => clearCollection(key)}
                    className="btn-danger text-xs py-1.5 px-3"
                  >
                    Haan Delete
                  </button>
                  <button
                    onClick={() => setConfirm(null)}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirm(key)}
                  disabled={counts[key] === 0}
                  className="btn-danger text-xs py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaTrash /> Delete All
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Clear All button */}
      <div className="card p-5 bg-gray-50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-gray-700">Clear Services + Exams (Both)</p>
            <p className="text-xs text-gray-500 mt-0.5">Delete both Services and Exams without removing Notifications</p>
          </div>

          {confirm === 'ALL' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600 font-semibold">Dono delete karein?</span>
              <button onClick={clearAll} className="btn-danger text-sm py-2 px-5">
                Haan, Clear Karo
              </button>
              <button onClick={() => setConfirm(null)} className="btn-secondary text-sm py-2 px-4">
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirm('ALL')}
              disabled={counts['services'] === 0 && counts['exams'] === 0}
              className="btn-danger py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaTrash /> Clear Services + Exams
            </button>
          )}
        </div>
      </div>

      {/* Refresh counts */}
      <button
        onClick={fetchCounts}
        className="btn-secondary w-full justify-center py-2.5 text-sm"
      >
        🔄 Refresh Counts
      </button>

      {/* Next step hint */}
      <div className="card p-4 bg-primary-50 border-primary-200">
        <p className="text-primary-700 text-sm font-semibold">💡 What to do after clearing?</p>
        <p className="text-primary-600 text-xs mt-1">
          Go to Admin → <strong>Bulk Import</strong> → Import fresh data ✅
        </p>
      </div>
    </div>
  );
}
