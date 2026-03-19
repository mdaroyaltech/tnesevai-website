// src/pages/admin/BulkImportPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase/config';
import {
  collection, addDoc, serverTimestamp,
  getDocs, deleteDoc, doc, writeBatch,
} from 'firebase/firestore';
import { ALL_SERVICES, ALL_EXAMS } from '../../data/seedData';
import toast from 'react-hot-toast';
import {
  FaUpload, FaTrash, FaCheckCircle, FaSpinner,
  FaConciergeBell, FaCalendarAlt, FaLayerGroup,
  FaExclamationTriangle, FaSync,
} from 'react-icons/fa';

const BATCH_SIZE = 400;

const clearCollection = async (colName, onProgress) => {
  let deleted = 0;
  while (true) {
    const snap = await getDocs(collection(db, colName));
    if (snap.empty) break;
    const chunks = [];
    for (let i = 0; i < snap.docs.length; i += BATCH_SIZE) {
      chunks.push(snap.docs.slice(i, i + BATCH_SIZE));
    }
    for (const chunk of chunks) {
      const batch = writeBatch(db);
      chunk.forEach(d => batch.delete(doc(db, colName, d.id)));
      await batch.commit();
      deleted += chunk.length;
      onProgress?.(deleted);
    }
    if (snap.docs.length < BATCH_SIZE) break;
  }
  return deleted;
};

const CAT_COUNTS = ALL_SERVICES.reduce((acc, s) => {
  acc[s.category] = (acc[s.category] || 0) + 1;
  return acc;
}, {});

const CAT_INFO = {
  tnesevai:   { label:'TNeSevai',    icon:'🏛️', cls:'bg-green-50 border-green-200 text-green-700' },
  digitalSeva:{ label:'Digital Seva',icon:'💻', cls:'bg-blue-50 border-blue-200 text-blue-700' },
  tnpsc:      { label:'TNPSC',       icon:'🎓', cls:'bg-yellow-50 border-yellow-200 text-yellow-700' },
  education:  { label:'Education',   icon:'📚', cls:'bg-purple-50 border-purple-200 text-purple-700' },
};

export default function BulkImportPage() {
  const [importing,  setImporting]  = useState(false);
  const [clearing,   setClearing]   = useState(false);
  const [progress,   setProgress]   = useState({ done: 0, total: 0, step: '' });
  const [counts,     setCounts]     = useState({ services: 0, exams: 0 });
  const [selected,   setSelected]   = useState({ services: true, exams: true });
  const [status,     setStatus]     = useState('idle');

  const refreshCounts = useCallback(async () => {
    const [s, e] = await Promise.all([
      getDocs(collection(db, 'services')),
      getDocs(collection(db, 'exams')),
    ]);
    setCounts({ services: s.size, exams: e.size });
  }, []);

  useEffect(() => { refreshCounts(); }, [refreshCounts]);

  // ── Clear Only ──
  const handleClearOnly = async () => {
    const what = [];
    if (selected.services) what.push('Services');
    if (selected.exams)    what.push('Exams');
    if (!what.length) { toast.error('Select at least one'); return; }
    if (!window.confirm(`⚠️ This will permanently DELETE:\n${what.join(' + ')}\n\nAre you sure?`)) return;

    setClearing(true);
    setStatus('idle');
    let totalDeleted = 0;

    try {
      if (selected.services) {
        setProgress({ done: 0, total: counts.services, step: '🗂️ Deleting Services...' });
        const n = await clearCollection('services', d => {
          setProgress(p => ({ ...p, done: d, step: `🗂️ Services: ${d} deleted...` }));
        });
        totalDeleted += n;
      }
      if (selected.exams) {
        setProgress({ done: 0, total: counts.exams, step: '🗂️ Deleting Exams...' });
        const n = await clearCollection('exams', d => {
          setProgress(p => ({ ...p, done: d, step: `🗂️ Exams: ${d} deleted...` }));
        });
        totalDeleted += n;
      }
      await refreshCounts();
      setStatus('cleared');
      toast.success(`✅ ${totalDeleted} records deleted successfully!`);
    } catch (err) {
      console.error(err);
      toast.error('Delete failed: ' + err.message);
    }

    setClearing(false);
    setProgress({ done: 0, total: 0, step: '' });
  };

  // ── Import Only ──
  const handleImport = async () => {
    if (!selected.services && !selected.exams) {
      toast.error('Select at least one type'); return;
    }
    setImporting(true);
    setStatus('idle');

    const toImport = [];
    if (selected.services) toImport.push({ label:'Services', items: ALL_SERVICES, col:'services' });
    if (selected.exams)    toImport.push({ label:'Exams',    items: ALL_EXAMS,    col:'exams' });
    const total = toImport.reduce((a, t) => a + t.items.length, 0);
    let done = 0;

    try {
      for (const { label, items, col } of toImport) {
        for (const item of items) {
          await addDoc(collection(db, col), {
            ...item, order: Date.now() + done, createdAt: serverTimestamp(),
          });
          done++;
          setProgress({ done, total, step: `📥 Importing ${label}: ${done}/${total}` });
        }
      }
      await refreshCounts();
      setStatus('done');
      toast.success(`🎉 ${done} items imported successfully!`);
    } catch (err) {
      console.error(err);
      toast.error('Import failed: ' + err.message);
    }

    setImporting(false);
    setProgress({ done: 0, total: 0, step: '' });
  };

  // ── Clear + Re-Import ──
  const handleClearAndImport = async () => {
    if (!selected.services && !selected.exams) {
      toast.error('Select at least one type'); return;
    }
    if (!window.confirm('⚠️ All existing data will be deleted first, then fresh data will be imported. Are you sure?')) return;

    setImporting(true);
    setStatus('idle');
    let totalDeleted = 0;

    try {
      // Step 1: Clear
      if (selected.services) {
        setProgress({ done: 0, total: counts.services, step: '🗂️ Clearing existing services...' });
        const n = await clearCollection('services', d =>
          setProgress(p => ({ ...p, done: d, step: `🗂️ Deleting services: ${d}...` }))
        );
        totalDeleted += n;
      }
      if (selected.exams) {
        setProgress({ done: 0, total: counts.exams, step: '🗂️ Clearing existing exams...' });
        const n = await clearCollection('exams', d =>
          setProgress(p => ({ ...p, done: d, step: `🗂️ Deleting exams: ${d}...` }))
        );
        totalDeleted += n;
      }

      toast.success(`${totalDeleted} records cleared. Starting import now...`);

      // Step 2: Import
      const toImport = [];
      if (selected.services) toImport.push({ label:'Services', items: ALL_SERVICES, col:'services' });
      if (selected.exams)    toImport.push({ label:'Exams',    items: ALL_EXAMS,    col:'exams' });
      const total = toImport.reduce((a, t) => a + t.items.length, 0);
      let done = 0;

      for (const { label, items, col } of toImport) {
        for (const item of items) {
          await addDoc(collection(db, col), {
            ...item, order: Date.now() + done, createdAt: serverTimestamp(),
          });
          done++;
          setProgress({ done, total, step: `📥 Importing ${label}: ${done}/${total}` });
        }
      }

      await refreshCounts();
      setStatus('done');
      toast.success(`🎉 ${done} items imported fresh successfully!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed: ' + err.message);
    }

    setImporting(false);
    setProgress({ done: 0, total: 0, step: '' });
  };

  const pct  = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const busy = importing || clearing;

  return (
    <div className="max-w-3xl space-y-5">

      {/* Header */}
      <div>
        <h1 className="font-display font-extrabold text-gray-800 text-xl flex items-center gap-2">
          <FaLayerGroup className="text-primary-600" /> Bulk Import / Clear Data
        </h1>
        <p className="text-gray-500 text-xs mt-1">
          Bulk import or delete Services and Exams in one click
        </p>
      </div>

      {/* Firebase Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center">
            <FaConciergeBell className="text-primary-600 text-lg" />
          </div>
          <div>
            <p className="text-2xl font-display font-extrabold text-gray-800">{counts.services}</p>
            <p className="text-xs text-gray-500">Services in Firebase</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
            <FaCalendarAlt className="text-blue-600 text-lg" />
          </div>
          <div>
            <p className="text-2xl font-display font-extrabold text-gray-800">{counts.exams}</p>
            <p className="text-xs text-gray-500">Exams in Firebase</p>
          </div>
        </div>
      </div>

      {/* Select what to work on */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-gray-700 mb-3">Select Data to Work On</h3>
        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 accent-primary-600 rounded"
              checked={selected.services}
              onChange={e => setSelected(s => ({ ...s, services: e.target.checked }))} />
            <span className="text-sm font-semibold text-gray-700">
              Services ({ALL_SERVICES.length} items)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 accent-primary-600 rounded"
              checked={selected.exams}
              onChange={e => setSelected(s => ({ ...s, exams: e.target.checked }))} />
            <span className="text-sm font-semibold text-gray-700">
              Exams ({ALL_EXAMS.length} items)
            </span>
          </label>
        </div>

        {/* Category breakdown */}
        {selected.services && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            {Object.entries(CAT_INFO).map(([key, info]) => (
              <div key={key} className={`rounded-xl border p-2.5 text-center ${info.cls}`}>
                <span className="text-lg">{info.icon}</span>
                <p className="text-lg font-extrabold font-display">{CAT_COUNTS[key] || 0}</p>
                <p className="text-xs font-semibold">{info.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {busy && progress.total > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <FaSpinner className="text-primary-600 animate-spin" />
            <p className="text-sm font-semibold text-gray-700">{progress.step}</p>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width:`${pct}%`, background:'linear-gradient(90deg,#22c55e,#86efac)' }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <p className="text-xs text-gray-500">{progress.done} / {progress.total}</p>
            <p className="text-xs font-bold text-primary-600">{pct}%</p>
          </div>
        </div>
      )}

      {/* Status messages */}
      {status === 'done' && !busy && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
          <FaCheckCircle className="text-green-500 text-2xl flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800">Import Complete! 🎉</p>
            <p className="text-green-700 text-xs mt-0.5">
              Data successfully saved to Firebase. Check the Services and Exams pages.
            </p>
          </div>
        </div>
      )}
      {status === 'cleared' && !busy && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <FaCheckCircle className="text-orange-500 text-2xl flex-shrink-0" />
          <div>
            <p className="font-bold text-orange-800">Data Cleared Successfully! ✅</p>
            <p className="text-orange-700 text-xs mt-0.5">
              All selected data has been removed from Firebase. You can now import fresh data.
            </p>
          </div>
        </div>
      )}

      {/* 3 Action Buttons */}
      <div className="grid gap-3">

        {/* 1. Delete Only */}
        <button
          onClick={handleClearOnly}
          disabled={busy}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: clearing ? '#fca5a5' : '#fee2e2', color:'#991b1b', border:'2px solid #fca5a5' }}
        >
          {clearing
            ? <><FaSpinner className="animate-spin" /> Deleting... ({pct}%)</>
            : <><FaTrash /> Delete Only (No Import)</>
          }
        </button>

        {/* 2. Import Only */}
        <button
          onClick={handleImport}
          disabled={busy}
          className="btn-primary w-full justify-center py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {importing && !clearing
            ? <><FaSpinner className="animate-spin" /> Importing... ({pct}%)</>
            : <><FaUpload /> Import Only (No Delete)</>
          }
        </button>

        {/* 3. Clear + Re-Import */}
        <button
          onClick={handleClearAndImport}
          disabled={busy}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background:'#eff6ff', color:'#1e40af', border:'2px solid #bfdbfe' }}
        >
          {importing && clearing
            ? <><FaSpinner className="animate-spin" /> Processing... ({pct}%)</>
            : <><FaSync /> Clear + Fresh Import (Recommended)</>
          }
        </button>
      </div>

      {/* Guide */}
      <div className="card p-4 bg-gray-50">
        <h4 className="font-bold text-gray-700 text-sm mb-3">When to Use Which Button?</h4>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FaTrash className="text-red-600 text-xs" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Delete Only</p>
              <p className="text-xs text-gray-500">
                Use when you want to remove all data from Firebase. Manually added services will also be deleted.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FaUpload className="text-primary-600 text-xs" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Import Only</p>
              <p className="text-xs text-gray-500">
                Existing data remains. New data is added on top. Duplicates may occur if used multiple times.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FaSync className="text-blue-600 text-xs" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Clear + Fresh Import ✅ Recommended</p>
              <p className="text-xs text-gray-500">
                Deletes all existing data first, then imports 73 services + 12 exams fresh. No duplicates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh */}
      <button onClick={refreshCounts} className="btn-secondary text-xs py-2 px-4" disabled={busy}>
        <FaSync className={busy ? 'animate-spin' : ''} /> Refresh Firebase Count
      </button>

    </div>
  );
}
