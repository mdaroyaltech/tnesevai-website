// src/pages/admin/BulkImportPage.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ALL_SERVICES, ALL_EXAMS } from '../../data/seedData';
import toast from 'react-hot-toast';
import {
  FaUpload, FaTrash, FaCheckCircle, FaExclamationTriangle,
  FaSpinner, FaConciergeBell, FaCalendarAlt, FaLayerGroup,
} from 'react-icons/fa';

const CAT_COUNTS = ALL_SERVICES.reduce((acc, s) => {
  acc[s.category] = (acc[s.category] || 0) + 1; return acc;
}, {});
const CAT_LABELS = { tnesevai: 'TNeSevai', digitalSeva: 'Digital Seva', tnpsc: 'TNPSC', education: 'Education' };
const CAT_ICONS = { tnesevai: '🏛️', digitalSeva: '💻', tnpsc: '🎓', education: '📚' };
const CAT_COLORS = { tnesevai: 'bg-green-50 border-green-200 text-green-700', digitalSeva: 'bg-blue-50 border-blue-200 text-blue-700', tnpsc: 'bg-yellow-50 border-yellow-200 text-yellow-700', education: 'bg-purple-50 border-purple-200 text-purple-700' };

export default function BulkImportPage() {
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, step: '' });
  const [existCount, setExistCount] = useState({ services: 0, exams: 0 });
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState({ services: true, exams: true });

  // Check existing counts
  useEffect(() => {
    const check = async () => {
      const [sSnap, eSnap] = await Promise.all([
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'exams')),
      ]);
      setExistCount({ services: sSnap.size, exams: eSnap.size });
    };
    check();
  }, [done]);

  const clearCollection = async (name) => {
    const snap = await getDocs(collection(db, name));
    await Promise.all(snap.docs.map(d => deleteDoc(doc(db, name, d.id))));
  };

  const handleImport = async () => {
    if (!selected.services && !selected.exams) {
      toast.error('Select at least one type to import'); return;
    }
    setImporting(true);
    setDone(false);

    try {
      const toImport = [];
      if (selected.services) toImport.push({ label: 'Services', items: ALL_SERVICES, col: 'services' });
      if (selected.exams) toImport.push({ label: 'Exams', items: ALL_EXAMS, col: 'exams' });

      const total = toImport.reduce((a, t) => a + t.items.length, 0);
      let done = 0;

      for (const { label, items, col } of toImport) {
        setProgress({ done, total, step: `Importing ${label}...` });
        for (const item of items) {
          await addDoc(collection(db, col), {
            ...item,
            order: Date.now() + done,
            createdAt: serverTimestamp(),
          });
          done++;
          setProgress({ done, total, step: `Importing ${label}... (${done}/${total})` });
        }
      }

      setDone(true);
      toast.success(`✅ ${done} items imported successfully!`);
    } catch (err) {
      console.error(err);
      toast.error('Import failed: ' + err.message);
    }
    setImporting(false);
    setProgress({ done: 0, total: 0, step: '' });
  };

  const handleClearAll = async () => {
    if (!window.confirm('⚠️ This will DELETE all existing services and exams. Are you sure?')) return;
    setClearing(true);
    try {
      if (selected.services) await clearCollection('services');
      if (selected.exams) await clearCollection('exams');
      toast.success('Cleared successfully');
      setDone(false);
    } catch { toast.error('Clear failed'); }
    setClearing(false);
  };

  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <FaLayerGroup className="text-2xl" />
          <h1 className="font-display font-extrabold text-xl">Bulk Import</h1>
        </div>
        <p className="text-primary-200 text-sm">
          Import all pre-loaded TNeSevai, Digital Seva, TNPSC & Education services in one click.
          <br />No need to add one by one!
        </p>
      </div>

      {/* Current DB status */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
            <FaConciergeBell className="text-primary-600 text-xl" />
          </div>
          <div>
            <p className="text-2xl font-display font-extrabold text-gray-800">{existCount.services}</p>
            <p className="text-xs text-gray-500">Services currently in Firebase</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <FaCalendarAlt className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-2xl font-display font-extrabold text-gray-800">{existCount.exams}</p>
            <p className="text-xs text-gray-500">Exams currently in Firebase</p>
          </div>
        </div>
      </div>

      {/* Warning if data exists */}
      {(existCount.services > 0 || existCount.exams > 0) && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <FaExclamationTriangle className="text-amber-500 text-lg flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Data Already Exists!</p>
            <p className="text-amber-700 text-xs mt-0.5">
              You already have {existCount.services} services and {existCount.exams} exams.
              Importing again will <strong>add duplicates</strong>. Use "Clear & Re-Import" to replace all data cleanly.
            </p>
          </div>
        </div>
      )}

      {/* What will be imported */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-gray-800 mb-4">What Will Be Imported</h2>

        {/* Select checkboxes */}
        <div className="flex gap-4 mb-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={selected.services} onChange={e => setSelected(s => ({ ...s, services: e.target.checked }))}
              className="w-4 h-4 accent-primary-600 rounded" />
            <span className="font-semibold text-sm text-gray-700">
              {ALL_SERVICES.length} Services
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={selected.exams} onChange={e => setSelected(s => ({ ...s, exams: e.target.checked }))}
              className="w-4 h-4 accent-primary-600 rounded" />
            <span className="font-semibold text-sm text-gray-700">
              {ALL_EXAMS.length} Exams / Alerts
            </span>
          </label>
        </div>

        {/* Category breakdown */}
        {selected.services && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {Object.entries(CAT_COUNTS).map(([cat, count]) => (
              <div key={cat} className={`rounded-2xl border p-3 text-center ${CAT_COLORS[cat]}`}>
                <div className="text-2xl mb-1">{CAT_ICONS[cat]}</div>
                <p className="text-xl font-display font-extrabold">{count}</p>
                <p className="text-xs font-semibold">{CAT_LABELS[cat]}</p>
              </div>
            ))}
          </div>
        )}

        {/* Services preview list */}
        {selected.services && (
          <details className="mb-3">
            <summary className="cursor-pointer text-sm font-semibold text-primary-600 hover:text-primary-700 select-none">
              👁️ Preview all {ALL_SERVICES.length} services
            </summary>
            <div className="mt-3 max-h-60 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50">
              {ALL_SERVICES.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
                  <span className="text-sm">{s.icon}</span>
                  <span className="text-xs text-gray-700 flex-1">{s.name}</span>
                  <span className="text-xs text-gray-400 font-tamil truncate max-w-[120px]">{s.nameTa}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Exams preview list */}
        {selected.exams && (
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-primary-600 hover:text-primary-700 select-none">
              📅 Preview all {ALL_EXAMS.length} exam entries
            </summary>
            <div className="mt-3 max-h-48 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50">
              {ALL_EXAMS.map((e, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
                  <span className="text-sm">{e.icon}</span>
                  <span className="text-xs text-gray-700 flex-1">{e.name}</span>
                  <span className="text-xs text-orange-500">Last: {e.lastDate}</span>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Progress bar */}
      {importing && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <FaSpinner className="text-primary-600 animate-spin" />
            <p className="text-sm font-semibold text-gray-700">{progress.step}</p>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">{progress.done} / {progress.total} ({pct}%)</p>
        </div>
      )}

      {/* Success */}
      {done && !importing && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
          <FaCheckCircle className="text-green-500 text-2xl flex-shrink-0" />
          <div>
            <p className="font-bold text-green-800">Import Complete! 🎉</p>
            <p className="text-green-700 text-xs mt-0.5">
              All data is now live on your website. Go check Services and Exams pages!
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Main import */}
        <button
          onClick={handleImport}
          disabled={importing || clearing}
          className="btn-primary flex-1 justify-center py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {importing
            ? <><FaSpinner className="animate-spin" /> Importing... ({pct}%)</>
            : <><FaUpload /> Import {
              selected.services && selected.exams ? `${ALL_SERVICES.length + ALL_EXAMS.length} Items` :
                selected.services ? `${ALL_SERVICES.length} Services` :
                  selected.exams ? `${ALL_EXAMS.length} Exams` : 'Nothing selected'
            } to Firebase</>
          }
        </button>

        {/* Clear + Re-import */}
        <button
          onClick={async () => {
            if (!window.confirm('⚠️ Clear existing data first, then import fresh?\n\nThis is recommended if you already have data.')) return;
            setClearing(true);
            try {
              if (selected.services) await clearCollection('services');
              if (selected.exams) await clearCollection('exams');
              toast.success('Cleared! Now importing...');
            } catch { toast.error('Clear failed'); setClearing(false); return; }
            setClearing(false);
            handleImport();
          }}
          disabled={importing || clearing}
          className="btn-secondary flex-1 justify-center py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {clearing
            ? <><FaSpinner className="animate-spin" /> Clearing...</>
            : <><FaTrash /> Clear & Re-Import (Fresh)</>
          }
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        After import, you can edit/delete individual items from Manage Services & Manage Exams pages.
      </p>
    </div>
  );
}
