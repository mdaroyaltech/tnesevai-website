// src/pages/admin/LogoSettingsPage.js
import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../../firebase/config';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import {
  FaSave, FaImage, FaCheck, FaTrash, FaExclamationTriangle, FaInfoCircle,
} from 'react-icons/fa';

const DEFAULTS = {
  logoUrl:'', faviconUrl:'', useCustom:false,
  showVleCode:true, vleCode:'642198200013',
  navLogoText:'RC', shopNameEn:'Royal Computers', shopNameTa:'ராயல் கம்ப்யூட்டர்ஸ்',
};

export default function LogoSettingsPage() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const logoRef = useRef();

  useEffect(() => {
    const unsub = onSnapshot(doc(db,'settings','logo'), snap => {
      if (snap.exists()) setSettings({ ...DEFAULTS, ...snap.data() });
    });
    return unsub;
  }, []);

  const save = async (data) => {
    await setDoc(doc(db,'settings','logo'), data, { merge:true });
  };

  const set = (k, v) => setSettings(s => ({ ...s, [k]:v }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('File too large. Max 2MB allowed.'); return; }
    setUploading(true);
    try {
      const storageRef = ref(storage, `logos/logo_${Date.now()}.${file.name.split('.').pop()}`);
      const snap = await uploadBytes(storageRef, file);
      const url  = await getDownloadURL(snap.ref);
      const updated = { ...settings, logoUrl:url, useCustom:true };
      setSettings(updated);
      await save(updated);
      toast.success('Logo uploaded and saved successfully!');
      e.target.value = '';
    } catch (err) {
      console.error(err);
      toast.error('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) { toast.error('Favicon too large. Max 500KB.'); return; }
    try {
      const storageRef = ref(storage, `logos/favicon_${Date.now()}.${file.name.split('.').pop()}`);
      const snap = await uploadBytes(storageRef, file);
      const url  = await getDownloadURL(snap.ref);
      const updated = { ...settings, faviconUrl:url };
      setSettings(updated);
      await save(updated);
      toast.success('Favicon uploaded and saved!');
    } catch (err) { toast.error('Favicon upload failed: ' + err.message); }
  };

  const removeLogo = async () => {
    const updated = { ...settings, logoUrl:'', useCustom:false };
    setSettings(updated);
    await save(updated);
    toast.success('Logo removed. Default RC logo is now active.');
  };

  const handleSave = async () => {
    setSaving(true);
    try { await save(settings); toast.success('Settings saved!'); }
    catch { toast.error('Save failed'); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="font-display font-extrabold text-gray-800 text-xl">Logo & Icon Settings</h1>
        <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5">
          <FaInfoCircle className="text-primary-500" />
          After uploading, the logo appears automatically in the navbar — no need to click Save separately.
        </p>
      </div>

      {/* Status preview */}
      <div className={`card p-4 border-2 ${settings.logoUrl ? 'border-primary-400 bg-primary-50' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-sm text-gray-700">Current Status</p>
          <span className={settings.logoUrl ? 'badge-green' : 'badge-yellow'}>
            {settings.logoUrl ? '✅ Custom Logo Active' : 'Using Default RC Logo'}
          </span>
        </div>
        <div className="bg-primary-700 rounded-xl px-4 py-3 flex items-center gap-3">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="h-10 max-w-[160px] object-contain"
              onError={e => { e.target.style.display='none'; }} />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-primary-700 text-base">
                {settings.navLogoText || 'RC'}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{settings.shopNameEn}</p>
                <p className="text-primary-200 text-xs">TNeSevai & Digital Seva</p>
              </div>
            </div>
          )}
          <span className="text-primary-300 text-xs ml-auto">Navbar preview</span>
        </div>
      </div>

      {/* Logo upload */}
      <div className="card p-5 space-y-4">
        <h3 className="font-bold text-gray-700 border-b pb-2">Upload Logo</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 space-y-1">
          <p>✅ <strong>Best format:</strong> PNG with transparent background, 400×100px</p>
          <p>✅ <strong>Max size:</strong> 2MB &nbsp;|&nbsp; Formats: PNG, JPG, SVG, WebP</p>
          <p>✅ Logo is saved automatically after upload — no separate Save needed</p>
        </div>
        <div
          onClick={() => !uploading && logoRef.current.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
            ${uploading ? 'opacity-60 cursor-wait' : 'hover:border-primary-400 hover:bg-primary-50'}
            ${settings.logoUrl ? 'border-primary-300 bg-primary-50/40' : 'border-gray-200'}`}
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-primary-600 font-medium">Uploading to Firebase Storage...</p>
              <p className="text-xs text-gray-400">Please wait — do not close this page</p>
            </div>
          ) : settings.logoUrl ? (
            <div className="space-y-2">
              <img src={settings.logoUrl} alt="Logo" className="h-14 mx-auto object-contain rounded-lg"
                onError={e => e.target.style.display='none'} />
              <p className="text-xs text-primary-600 font-semibold flex items-center justify-center gap-1">
                <FaCheck /> Uploaded successfully · Click to replace
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <FaImage className="text-4xl text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-600">Click here to upload your logo</p>
              <p className="text-xs text-gray-400">PNG / JPG / SVG · Max 2MB</p>
            </div>
          )}
        </div>
        <input ref={logoRef} type="file" accept="image/*,.svg" onChange={handleUpload} className="hidden" />
        {settings.logoUrl && (
          <button onClick={removeLogo} className="btn-danger text-xs py-2 px-4">
            <FaTrash /> Remove Custom Logo (Use Default RC)
          </button>
        )}
      </div>

      {/* Favicon upload */}
      <div className="card p-5 space-y-3">
        <h3 className="font-bold text-gray-700 border-b pb-2">Favicon (Browser Tab Icon)</h3>
        <div className="border-2 border-dashed border-gray-200 hover:border-primary-300 rounded-2xl p-5 text-center cursor-pointer transition-all hover:bg-gray-50"
          onClick={() => document.getElementById('fav-input').click()}>
          {settings.faviconUrl ? (
            <div className="flex items-center justify-center gap-3">
              <img src={settings.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain rounded"
                onError={e => e.target.style.display='none'} />
              <p className="text-xs text-primary-600 font-semibold flex items-center gap-1">
                <FaCheck /> Favicon uploaded · Click to replace
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 font-medium">Upload favicon (browser tab icon)</p>
              <p className="text-xs text-gray-400 mt-1">ICO / PNG · 32×32px recommended · Max 500KB</p>
            </div>
          )}
        </div>
        <input id="fav-input" type="file" accept="image/*,.ico" onChange={handleFaviconUpload} className="hidden" />
      </div>

      {/* Shop name */}
      <div className="card p-5 space-y-4">
        <h3 className="font-bold text-gray-700 border-b pb-2">Shop Name (Navbar Display)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Name (English)</label>
            <input className="input-field" value={settings.shopNameEn}
              onChange={e => set('shopNameEn', e.target.value)} placeholder="Royal Computers" />
          </div>
          <div>
            <label className="label">Name (Tamil)</label>
            <input className="input-field font-tamil" value={settings.shopNameTa}
              onChange={e => set('shopNameTa', e.target.value)} placeholder="ராயல் கம்ப்யூட்டர்ஸ்" />
          </div>
        </div>
        <div>
          <label className="label">Nav Circle Letters (when no custom logo)</label>
          <input className="input-field w-20 text-center font-bold uppercase tracking-widest" maxLength={3}
            value={settings.navLogoText} onChange={e => set('navLogoText', e.target.value.toUpperCase())} />
          <p className="text-xs text-gray-400 mt-1">2–3 letters shown in the circle (e.g. RC)</p>
        </div>
      </div>

      {/* VLE code */}
      <div className="card p-5 space-y-3">
        <h3 className="font-bold text-gray-700 border-b pb-2">VLE Code</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-primary-600" checked={settings.showVleCode}
            onChange={e => set('showVleCode', e.target.checked)} />
          <span className="text-sm font-medium text-gray-700">Show VLE Code badge in footer</span>
        </label>
        <input className="input-field font-mono tracking-widest w-52" value={settings.vleCode}
          onChange={e => set('vleCode', e.target.value)} placeholder="642198200013" />
      </div>

      <button onClick={handleSave} disabled={saving}
        className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60">
        {saving ? '⏳ Saving...' : <><FaSave /> Save Settings</>}
      </button>

      {/* Firebase Storage fix guide */}
      <div className="card p-5 bg-red-50 border-red-200 space-y-3">
        <h4 className="font-bold text-red-700 flex items-center gap-2 text-sm">
          <FaExclamationTriangle /> Logo not showing? Fix Firebase Storage Rules
        </h4>
        <div className="space-y-3 text-xs text-red-700">
          <div>
            <p className="font-bold mb-1">Step 1 — Go to Firebase Console → Storage → Rules tab and paste:</p>
            <pre className="bg-red-100 rounded-lg p-3 overflow-x-auto text-[11px] leading-relaxed whitespace-pre">{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}</pre>
          </div>
          <div>
            <p className="font-bold mb-1">Step 2 — Click Publish. Then refresh your website.</p>
          </div>
          <p className="font-bold">Step 3 — Open browser Console (F12) and check for any error messages.</p>
        </div>
      </div>
    </div>
  );
}
