// src/pages/admin/ContactSettingsPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getContactSettings, saveContactSettings } from '../../firebase/services';
import toast from 'react-hot-toast';
import {
  FaSave, FaPhone, FaWhatsapp, FaMapMarkerAlt,
  FaClock, FaEnvelope, FaLink, FaIdBadge, FaInfoCircle,
} from 'react-icons/fa';

const DEFAULT = {
  phone:'', whatsapp:'', email:'',
  address:'', addressTa:'',
  timings:'Mon – Sat: 9:00 AM – 7:00 PM',
  timingsTa:'திங்கள் – சனி: காலை 9:00 – மாலை 7:00',
  mapLink:'',
  vleCode:'',
  vleId:'',
  cscId:'',
  centerName:'Royal Computers',
  centerNameTa:'ராயல் கம்ப்யூட்டர்ஸ்',
};

const Section = ({ title, icon, children }) => (
  <div className="card p-5 space-y-4">
    <h3 className="font-display font-bold text-gray-700 flex items-center gap-2 text-base border-b border-gray-100 pb-2">
      {icon} {title}
    </h3>
    {children}
  </div>
);

export default function ContactSettingsPage() {
  const { t } = useTranslation();
  const [form,   setForm]   = useState(DEFAULT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getContactSettings().then(data => { if (data) setForm({ ...DEFAULT, ...data }); });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContactSettings(form);
      toast.success('✅ Saved! Footer & Contact page updated automatically.');
    } catch { toast.error('Save failed. Check Firebase.'); }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="font-display font-extrabold text-gray-800 text-xl">{t('contactSettings')}</h1>
        <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5">
          <FaInfoCircle className="text-primary-500" />
          Changes here instantly update the <strong>Contact page</strong> &amp; <strong>Footer</strong> on the website.
        </p>
      </div>

      {/* ── Center Info ── */}
      <Section title="Center / Shop Name" icon="🏪">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Center Name (English)</label>
            <input className="input-field" value={form.centerName}
              onChange={e => set('centerName', e.target.value)} placeholder="Royal Computers" />
          </div>
          <div>
            <label className="label">Center Name (Tamil)</label>
            <input className="input-field font-tamil" value={form.centerNameTa}
              onChange={e => set('centerNameTa', e.target.value)} placeholder="ராயல் கம்ப்யூட்டர்ஸ்" />
          </div>
        </div>
      </Section>

      {/* ── Contact ── */}
      <Section title="Phone & WhatsApp" icon="📞">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label flex items-center gap-1.5"><FaPhone className="text-primary-500 text-xs" /> Phone Number</label>
            <input type="tel" className="input-field" value={form.phone}
              onChange={e => set('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><FaWhatsapp className="text-green-500 text-xs" /> WhatsApp Number</label>
            <input type="tel" className="input-field" value={form.whatsapp}
              onChange={e => set('whatsapp', e.target.value)} placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><FaEnvelope className="text-blue-500 text-xs" /> Email (Optional)</label>
          <input type="email" className="input-field" value={form.email}
            onChange={e => set('email', e.target.value)} placeholder="royalcomputers@gmail.com" />
        </div>
      </Section>

      {/* ── Address ── */}
      <Section title="Address" icon="📍">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label flex items-center gap-1.5"><FaMapMarkerAlt className="text-red-500 text-xs" /> Address (English)</label>
            <textarea className="input-field resize-none" rows={3} value={form.address}
              onChange={e => set('address', e.target.value)}
              placeholder="Shop No. X, Street Name, Town, District, TN – PINCODE" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><FaMapMarkerAlt className="text-red-500 text-xs" /> Address (Tamil)</label>
            <textarea className="input-field resize-none font-tamil" rows={3} value={form.addressTa}
              onChange={e => set('addressTa', e.target.value)}
              placeholder="கடை எண். X, தெரு, நகரம், மாவட்டம்" />
          </div>
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><FaLink className="text-primary-500 text-xs" /> Google Maps Link</label>
          <input type="url" className="input-field" value={form.mapLink}
            onChange={e => set('mapLink', e.target.value)} placeholder="https://maps.google.com/?q=..." />
          <p className="text-xs text-gray-400 mt-1">💡 Google Maps → Share → Copy Link → Paste here</p>
        </div>
      </Section>

      {/* ── Timings ── */}
      <Section title="Working Hours" icon="⏰">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label flex items-center gap-1.5"><FaClock className="text-gold-500 text-xs" /> Timings (English)</label>
            <input className="input-field" value={form.timings}
              onChange={e => set('timings', e.target.value)} placeholder="Mon – Sat: 9:00 AM – 7:00 PM" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><FaClock className="text-gold-500 text-xs" /> Timings (Tamil)</label>
            <input className="input-field font-tamil" value={form.timingsTa}
              onChange={e => set('timingsTa', e.target.value)} placeholder="திங்கள் – சனி: 9:00 – 7:00" />
          </div>
        </div>
      </Section>

      {/* ── Digital Seva VLE ── */}
      <Section title="Digital Seva VLE / CSC Details" icon="💻">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
          <FaInfoCircle className="text-blue-500 flex-shrink-0 mt-0.5 text-sm" />
          <p className="text-xs text-blue-700">
            Your <strong>VLE Code</strong> will be displayed on the website footer and Contact page as proof of being an authorized Digital Seva / CSC center.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label flex items-center gap-1.5"><FaIdBadge className="text-primary-500 text-xs" /> VLE Code</label>
            <input type="text" className="input-field font-mono tracking-widest uppercase" value={form.vleCode}
              onChange={e => set('vleCode', e.target.value.toUpperCase())}
              placeholder="e.g. TN123456" />
            <p className="text-xs text-gray-400 mt-1">Digital Seva VLE Code</p>
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><FaIdBadge className="text-blue-500 text-xs" /> VLE User ID</label>
            <input type="text" className="input-field font-mono" value={form.vleId}
              onChange={e => set('vleId', e.target.value)} placeholder="VLE Login ID" />
            <p className="text-xs text-gray-400 mt-1">Portal login username</p>
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><FaIdBadge className="text-green-500 text-xs" /> CSC ID (Optional)</label>
            <input type="text" className="input-field font-mono" value={form.cscId}
              onChange={e => set('cscId', e.target.value)} placeholder="CSC Centre ID" />
            <p className="text-xs text-gray-400 mt-1">Common Service Centre ID</p>
          </div>
        </div>
      </Section>

      {/* Save Button */}
      <button onClick={handleSave} disabled={saving}
        className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60 shadow-lg"
      >
        {saving
          ? <><span className="animate-spin inline-block mr-1">⏳</span> Saving to Firebase...</>
          : <><FaSave /> Save All Settings — Updates Footer &amp; Contact Page Instantly</>
        }
      </button>

      {/* ── Live Footer Preview ── */}
      <div className="card overflow-hidden">
        <div className="bg-gray-800 px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <p className="text-gray-400 text-xs ml-2">🔴 Live Footer Preview — exactly how it looks on the public website</p>
        </div>

        {/* Simulated footer */}
        <div className="bg-[#0f2a1a] text-white p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-4">
            {/* Col 1 — Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 bg-primary-700 rounded-xl flex items-center justify-center font-black text-white text-xs flex-shrink-0">RC</div>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">{form.centerName || 'Royal Computers'}</p>
                  <p className="text-[11px] text-gray-400 font-tamil">{form.centerNameTa || 'ராயல் கம்ப்யூட்டர்ஸ்'}</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs">TNeSevai & Digital Seva</p>
              <p className="text-gray-400 text-xs">Authorized Government Service Center</p>
              {form.vleCode && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-primary-900/60 border border-primary-700 rounded-lg px-2 py-1">
                  <FaIdBadge className="text-primary-400 text-xs" />
                  <span className="text-xs text-primary-300 font-mono font-bold tracking-wider">VLE: {form.vleCode}</span>
                </div>
              )}
              {form.cscId && (
                <div className="mt-1 inline-flex items-center gap-1.5 bg-green-900/40 border border-green-800 rounded-lg px-2 py-1">
                  <span className="text-xs text-green-400 font-mono">CSC: {form.cscId}</span>
                </div>
              )}
            </div>

            {/* Col 2 — Quick Links */}
            <div>
              <p className="text-gray-300 font-semibold text-xs mb-2">Quick Links</p>
              <div className="space-y-1 text-xs text-gray-400">
                {['Home', 'Services', 'Exam Dates', 'About', 'Contact'].map(l => (
                  <p key={l} className="hover:text-primary-400 transition-colors cursor-default">{l}</p>
                ))}
              </div>
            </div>

            {/* Col 3 — Contact */}
            <div>
              <p className="text-gray-300 font-semibold text-xs mb-2">Contact Us</p>
              <div className="space-y-1 text-xs text-gray-400">
                {form.timings  ? <p>⏰ {form.timings}</p>  : <p className="text-gray-600 italic">Timings not set</p>}
                {form.phone    ? <p>📞 {form.phone}</p>    : <p className="text-gray-600 italic">Phone not set</p>}
                {form.whatsapp ? <p>💬 {form.whatsapp}</p> : null}
                {form.email    ? <p>✉️ {form.email}</p>   : null}
                {form.address  ? <p className="line-clamp-2">📍 {form.address}</p> : <p className="text-gray-600 italic">Address not set</p>}
                {form.mapLink  ? <p className="text-primary-400 cursor-default">🗺️ View on Google Maps ↗</p> : null}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-3 flex flex-col sm:flex-row justify-between items-center gap-1">
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} {form.centerName || 'Royal Computers'} · TNeSevai & Digital Seva</p>
            <p className="text-xs text-gray-600">Authorized TNeSevai & Digital Seva Center</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center pb-4">
        💡 This preview updates in real-time as you type above. Click Save to apply changes to the live website.
      </p>
    </div>
  );
}
