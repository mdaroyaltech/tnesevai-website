// src/pages/admin/ManageServicesPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { listenServices, addService, updateService, deleteService } from '../../firebase/services';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';

const CATEGORIES = [
  { value:'tnesevai',    label:'TNeSevai' },
  { value:'digitalSeva', label:'Digital Seva' },
  { value:'tnpsc',       label:'TNPSC' },
  { value:'education',   label:'Education' },
  { value:'other',       label:'Other' },
];

const EMPTY = { name:'', nameTa:'', desc:'', descTa:'', icon:'📄', category:'tnesevai' };

export default function ManageServicesPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => listenServices(setServices), []);

  const openAdd  = ()  => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (s) => { setForm({ name:s.name||'', nameTa:s.nameTa||'', desc:s.desc||'', descTa:s.descTa||'', icon:s.icon||'📄', category:s.category||'tnesevai' }); setEditing(s.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  const handleSave = async () => {
    if (!form.name) { toast.error('Service name is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateService(editing, form);
        toast.success('Service updated!');
      } else {
        await addService(form);
        toast.success('Service added!');
      }
      closeForm();
    } catch { toast.error('Something went wrong'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setDeleting(id);
    try { await deleteService(id); toast.success('Service deleted'); }
    catch { toast.error('Delete failed'); }
    setDeleting(null);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const CAT_BADGE = { tnesevai:'badge-green', digitalSeva:'badge-blue', tnpsc:'badge-yellow', education:'badge-blue', other:'bg-gray-100 text-gray-600 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold' };

  return (
    <div className="max-w-5xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-extrabold text-gray-800 text-xl">{t('manageServices')}</h1>
          <p className="text-gray-500 text-xs mt-0.5">{services.length} services added</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <FaPlus /> {t('addService')}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-primary-50">
              <h2 className="font-display font-bold text-primary-800">
                {editing ? t('editService') : t('addService')}
              </h2>
              <button onClick={closeForm} className="p-1.5 hover:bg-primary-100 rounded-lg transition"><FaTimes className="text-gray-500" /></button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('serviceName')} *</label>
                  <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Ration Card" />
                </div>
                <div>
                  <label className="label">{t('serviceNameTa')}</label>
                  <input className="input-field font-tamil" value={form.nameTa} onChange={e => set('nameTa', e.target.value)} placeholder="e.g. ரேஷன் கார்டு" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('serviceDesc')}</label>
                  <textarea className="input-field resize-none" rows={2} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Short description in English" />
                </div>
                <div>
                  <label className="label">{t('serviceDescTa')}</label>
                  <textarea className="input-field resize-none font-tamil" rows={2} value={form.descTa} onChange={e => set('descTa', e.target.value)} placeholder="குறுகிய விவரம் தமிழில்" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('serviceIcon')} (Emoji)</label>
                  <input className="input-field text-2xl" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="📄" />
                  <p className="text-xs text-gray-400 mt-1">Paste any emoji here</p>
                </div>
                <div>
                  <label className="label">{t('serviceCategory')}</label>
                  <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
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

      {/* Services List */}
      {services.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <p className="text-5xl mb-3">🛠️</p>
          <p className="font-medium">No services yet. Add your first service!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {services.map(s => (
            <div key={s.id} className="card p-4 flex items-start gap-3">
              <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {s.icon || '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-gray-800 text-sm truncate">{s.name}</p>
                {s.nameTa && <p className="text-xs text-gray-500 font-tamil truncate">{s.nameTa}</p>}
                {s.desc   && <p className="text-xs text-gray-400 mt-0.5 truncate">{s.desc}</p>}
                <span className={`mt-1.5 ${CAT_BADGE[s.category] || CAT_BADGE.other}`}>
                  {CATEGORIES.find(c => c.value === s.category)?.label || s.category}
                </span>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(s)}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                  title="Edit"
                >
                  <FaEdit className="text-sm" />
                </button>
                <button onClick={() => handleDelete(s.id)}
                  disabled={deleting === s.id}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition disabled:opacity-40"
                  title="Delete"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
