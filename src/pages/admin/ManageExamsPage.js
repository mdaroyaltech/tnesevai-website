// src/pages/admin/ManageExamsPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { listenExams, addExam, updateExam, deleteExam } from '../../firebase/services';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaExternalLinkAlt } from 'react-icons/fa';

const EMPTY = { name:'', nameTa:'', body:'', icon:'🎓', lastDate:'', examDate:'', status:'upcoming', applyLink:'' };
const STATUSES = [
  { value:'upcoming', label:'Upcoming', cls:'badge-blue' },
  { value:'ongoing',  label:'Ongoing',  cls:'badge-green' },
  { value:'closed',   label:'Closed',   cls:'badge-red' },
];

const daysLeft = (d) => {
  if (!d) return null;
  return Math.ceil((new Date(d) - new Date()) / 86400000);
};
const fmt = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
};

export default function ManageExamsPage() {
  const { t } = useTranslation();
  const [exams,    setExams]   = useState([]);
  const [showForm, setShowForm]= useState(false);
  const [editing,  setEditing] = useState(null);
  const [form,     setForm]    = useState(EMPTY);
  const [saving,   setSaving]  = useState(false);

  useEffect(() => listenExams(setExams), []);

  const openAdd  = ()  => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (e) => {
    setForm({ name:e.name||'', nameTa:e.nameTa||'', body:e.body||'', icon:e.icon||'🎓',
              lastDate:e.lastDate||'', examDate:e.examDate||'', status:e.status||'upcoming', applyLink:e.applyLink||'' });
    setEditing(e.id); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name)     { toast.error('Exam name is required'); return; }
    if (!form.lastDate) { toast.error('Last date is required'); return; }
    setSaving(true);
    try {
      if (editing) { await updateExam(editing, form); toast.success('Exam updated!'); }
      else         { await addExam(form);              toast.success('Exam added!'); }
      closeForm();
    } catch { toast.error('Something went wrong'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam entry?')) return;
    try { await deleteExam(id); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const statusInfo = (key) => STATUSES.find(s => s.value === key) || STATUSES[0];

  return (
    <div className="max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-gray-800 text-xl">{t('manageExams')}</h1>
          <p className="text-gray-500 text-xs mt-0.5">{exams.length} exams / applications</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <FaPlus /> {t('addExam')}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-primary-50">
              <h2 className="font-display font-bold text-primary-800">
                {editing ? t('editExam') : t('addExam')}
              </h2>
              <button onClick={closeForm} className="p-1.5 hover:bg-primary-100 rounded-lg transition">
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('examName')} *</label>
                  <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. TNPSC Group 4" />
                </div>
                <div>
                  <label className="label">{t('examNameTa')}</label>
                  <input className="input-field font-tamil" value={form.nameTa} onChange={e => set('nameTa', e.target.value)} placeholder="e.g. TNPSC குழு 4" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('examBody')}</label>
                  <input className="input-field" value={form.body} onChange={e => set('body', e.target.value)} placeholder="e.g. Tamil Nadu PSC" />
                </div>
                <div>
                  <label className="label">{t('serviceIcon')} (Emoji)</label>
                  <input className="input-field text-2xl" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🎓" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('examLastDate')} * <span className="text-red-500">⚠️ Highlighted</span></label>
                  <input type="date" className="input-field" value={form.lastDate} onChange={e => set('lastDate', e.target.value)} />
                </div>
                <div>
                  <label className="label">{t('examExamDate')}</label>
                  <input type="date" className="input-field" value={form.examDate} onChange={e => set('examDate', e.target.value)} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('examStatus')}</label>
                  <select className="input-field" value={form.status} onChange={e => set('status', e.target.value)}>
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">{t('examLink')}</label>
                  <input className="input-field" value={form.applyLink} onChange={e => set('applyLink', e.target.value)} placeholder="https://tnpsc.gov.in" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={closeForm} className="btn-secondary text-sm flex-1 justify-center">{t('cancel')}</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex-1 justify-center disabled:opacity-60">
                {saving ? 'Saving...' : <><FaSave /> {t('save')}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exams List */}
      {exams.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <p className="text-5xl mb-3">📅</p>
          <p className="font-medium">No exams added yet. Add exam details to alert users!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map(e => {
            const days   = daysLeft(e.lastDate);
            const urgent = days !== null && days >= 0 && days <= 7;
            const si     = statusInfo(e.status);
            return (
              <div key={e.id}
                className={`card p-4 flex items-start gap-4 ${urgent ? 'ring-2 ring-red-400 ring-offset-1' : ''}`}
              >
                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {e.icon || '🎓'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display font-semibold text-gray-800 text-sm">{e.name}</p>
                    <span className={si.cls}>{si.label}</span>
                    {urgent && <span className="badge-red animate-pulse">⚠️ Urgent</span>}
                  </div>
                  {e.nameTa && <p className="text-xs text-gray-500 font-tamil">{e.nameTa}</p>}
                  {e.body   && <p className="text-xs text-gray-400 mt-0.5">{e.body}</p>}

                  <div className="flex flex-wrap gap-3 mt-2 text-xs">
                    <span className="text-orange-600 font-semibold">
                      📅 Last Date: {fmt(e.lastDate)}
                      {days !== null && days >= 0 && (
                        <span className={`ml-1 ${days <= 7 ? 'text-red-600 animate-pulse font-bold' : 'text-orange-400'}`}>
                          ({days === 0 ? 'TODAY!' : `${days} days left`})
                        </span>
                      )}
                      {days !== null && days < 0 && <span className="ml-1 text-gray-400">(Expired)</span>}
                    </span>
                    {e.examDate && <span className="text-primary-600 font-semibold">🎓 Exam: {fmt(e.examDate)}</span>}
                    {e.applyLink && (
                      <a href={e.applyLink} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <FaExternalLinkAlt className="text-[10px]" /> Apply Link
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(e)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition" title="Edit"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                  <button onClick={() => handleDelete(e.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition" title="Delete"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
