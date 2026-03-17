// src/pages/admin/LogoSettingsPage.js
import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { FaUpload, FaSave, FaUndo, FaImage, FaInfoCircle, FaCheck } from 'react-icons/fa';

const DEFAULT_LOGO_SETTINGS = {
  logoUrl: '',        // uploaded custom logo URL
  faviconUrl: '',        // uploaded custom favicon URL
  useCustom: false,     // toggle between default SVG and uploaded
  showVleCode: true,      // show VLE code on logo/header
  vleCode: '642198200013',
  navLogoText: 'RC',      // text in nav circle if no logo
  shopNameEn: 'Royal Computers',
  shopNameTa: 'ராயல் கம்ப்யூட்டர்ஸ்',
};

export default function LogoSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_LOGO_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ logo: false, favicon: false });
  const [logoPreview, setLogoPreview] = useState(null);
  const logoInputRef = useRef();
  const faviconInputRef = useRef();

  useEffect(() => {
    getDoc(doc(db, 'settings', 'logo')).then(snap => {
      if (snap.exists()) setSettings({ ...DEFAULT_LOGO_SETTINGS, ...snap.data() });
    });
  }, []);

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('File too large. Max 2MB allowed.'); return; }

    // Preview
    const reader = new FileReader();
    reader.onload = ev => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(u => ({ ...u, logo: true }));
    try {
      const storageRef = ref(storage, `logos/logo_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      set('logoUrl', url);
      set('useCustom', true);
      toast.success('Logo uploaded! Click Save to apply.');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    }
    setUploading(u => ({ ...u, logo: false }));
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) { toast.error('Favicon too large. Max 500KB.'); return; }
    setUploading(u => ({ ...u, favicon: true }));
    try {
      const storageRef = ref(storage, `logos/favicon_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      set('faviconUrl', url);
      toast.success('Favicon uploaded! Click Save to apply.');
    } catch (err) {
      toast.error('Favicon upload failed: ' + err.message);
    }
    setUploading(u => ({ ...u, favicon: false }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'logo'), settings, { merge: true });
      toast.success('✅ Logo settings saved! Refresh the website to see changes.');
    } catch { toast.error('Save failed'); }
    setSaving(false);
  };

  const handleReset = () => {
    setSettings(DEFAULT_LOGO_SETTINGS);
    setLogoPreview(null);
    toast('Reset to defaults. Click Save to apply.');
  };

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="font-display font-extrabold text-gray-800 text-xl">Logo & Icon Settings</h1>
        <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5">
          <FaInfoCircle className="text-primary-500" />
          Upload your own logo or use the default RC logo. Changes apply to Navbar, Footer & Browser tab.
        </p>
      </div>

      {/* Current logo preview */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-gray-700 mb-4">Current Logo Preview</h3>
        <div className="bg-primary-800 rounded-2xl p-4 flex items-center gap-3">
          {/* Nav icon simulation */}
          {(settings.useCustom && (logoPreview || settings.logoUrl)) ? (
            <img
              src={logoPreview || settings.logoUrl}
              alt="Custom Logo"
              className="h-10 object-contain"
            />
          ) : (
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center font-black text-primary-700 text-sm flex-shrink-0">
              {settings.navLogoText || 'RC'}
            </div>
          )}
          <div>
            <p className="text-white font-display font-bold text-base leading-tight">
              {settings.shopNameEn || 'Royal Computers'}
            </p>
            <p className="text-primary-200 text-xs font-tamil">
              {settings.shopNameTa || 'ராயல் கம்ப்யூட்டர்ஸ்'} · TNeSevai & Digital Seva
            </p>
          </div>
        </div>

        {/* Default SVG logo preview */}
        <div className="mt-3 bg-gray-900 rounded-xl p-4 flex items-center justify-center">
          <img src="/logo.svg" alt="Default Logo" className="h-16 object-contain" onError={e => e.target.style.display = 'none'} />
          <p className="text-gray-500 text-xs text-center" id="logo-fallback">Default RC Logo (logo.svg)</p>
        </div>
      </div>

      {/* Shop name settings */}
      <div className="card p-5 space-y-4">
        <h3 className="font-display font-bold text-gray-700 border-b border-gray-100 pb-2">🏪 Shop Name (Navbar Display)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Shop Name (English)</label>
            <input className="input-field" value={settings.shopNameEn}
              onChange={e => set('shopNameEn', e.target.value)} placeholder="Royal Computers" />
          </div>
          <div>
            <label className="label">Shop Name (Tamil)</label>
            <input className="input-field font-tamil" value={settings.shopNameTa}
              onChange={e => set('shopNameTa', e.target.value)} placeholder="ராயல் கம்ப்யூட்டர்ஸ்" />
          </div>
        </div>
        <div>
          <label className="label">Nav Circle Text (when no custom logo)</label>
          <input className="input-field w-24 font-bold text-center" maxLength={3}
            value={settings.navLogoText} onChange={e => set('navLogoText', e.target.value.toUpperCase())}
            placeholder="RC" />
          <p className="text-xs text-gray-400 mt-1">2–3 letters shown in the green circle in navbar</p>
        </div>
      </div>

      {/* VLE Code in logo */}
      <div className="card p-5 space-y-4">
        <h3 className="font-display font-bold text-gray-700 border-b border-gray-100 pb-2">🔢 VLE Code Display  </h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={settings.showVleCode}
              onChange={e => set('showVleCode', e.target.checked)}
              className="w-4 h-4 accent-primary-600 rounded" />
            <span className="text-sm font-medium text-gray-700">Show VLE Code in logo / footer badge</span>
          </label>
        </div>
        <div>
          <label className="label">VLE Code</label>
          <input className="input-field font-mono tracking-widest w-48" value={settings.vleCode}
            onChange={e => set('vleCode', e.target.value)} placeholder="642198200013" />
        </div>
        {settings.showVleCode && settings.vleCode && (
          <div className="inline-flex items-center gap-2 bg-gov-dark border border-gold-500 rounded-xl px-3 py-2">
            <span className="text-xs text-gold-400 font-semibold tracking-wider">VLE CODE</span>
            <span className="text-white font-mono font-bold tracking-widest">{settings.vleCode}</span>
          </div>
        )}
      </div>

      {/* Upload custom logo */}
      <div className="card p-5 space-y-4">
        <h3 className="font-display font-bold text-gray-700 border-b border-gray-100 pb-2">📁 Upload Custom Logo</h3>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
          <FaInfoCircle className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-700">
            <p><strong>Recommended formats:</strong> PNG (transparent background), SVG, WebP</p>
            <p className="mt-0.5"><strong>Recommended size:</strong> 400×120px for navbar logo, 512×512px for app icon</p>
            <p className="mt-0.5"><strong>Max file size:</strong> 2MB for logo, 500KB for favicon</p>
          </div>
        </div>

        {/* Logo upload */}
        <div>
          <label className="label">Main Logo (Navbar & Footer)</label>
          <div
            onClick={() => logoInputRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all
              ${settings.useCustom && settings.logoUrl
                ? 'border-primary-400 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
          >
            {(logoPreview || settings.logoUrl) ? (
              <div>
                <img src={logoPreview || settings.logoUrl} alt="Logo" className="h-14 mx-auto object-contain mb-2" />
                <p className="text-xs text-primary-600 font-semibold flex items-center justify-center gap-1">
                  <FaCheck /> Custom logo uploaded
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Click to change</p>
              </div>
            ) : (
              <div>
                <FaImage className="text-3xl text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Click to upload your logo</p>
                <p className="text-xs text-gray-400 mt-1">PNG / SVG / WebP · Max 2MB</p>
              </div>
            )}
            {uploading.logo && (
              <p className="text-xs text-primary-600 mt-2 animate-pulse">⏳ Uploading...</p>
            )}
          </div>
          <input ref={logoInputRef} type="file" accept="image/*,.svg"
            onChange={handleLogoUpload} className="hidden" />
        </div>

        {/* Toggle: use custom or default */}
        {settings.logoUrl && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={settings.useCustom}
                onChange={e => set('useCustom', e.target.checked)}
                className="w-4 h-4 accent-primary-600 rounded" />
              <span className="text-sm font-medium text-gray-700">Use uploaded logo (uncheck to use default RC logo)</span>
            </label>
          </div>
        )}

        {/* Favicon upload */}
        <div>
          <label className="label">Favicon (Browser Tab Icon)</label>
          <div
            onClick={() => faviconInputRef.current.click()}
            className="border-2 border-dashed border-gray-200 hover:border-primary-300 rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-gray-50"
          >
            {settings.faviconUrl ? (
              <div className="flex items-center justify-center gap-3">
                <img src={settings.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                <p className="text-xs text-primary-600 font-semibold flex items-center gap-1">
                  <FaCheck /> Favicon uploaded · Click to change
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-600">Upload favicon (browser tab icon)</p>
                <p className="text-xs text-gray-400 mt-0.5">ICO / PNG · 32×32px or 64×64px recommended · Max 500KB</p>
              </div>
            )}
            {uploading.favicon && <p className="text-xs text-primary-600 mt-1 animate-pulse">⏳ Uploading...</p>}
          </div>
          <input ref={faviconInputRef} type="file" accept="image/*,.ico"
            onChange={handleFaviconUpload} className="hidden" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving}
          className="btn-primary flex-1 justify-center py-3.5 text-sm disabled:opacity-60"
        >
          {saving ? '⏳ Saving...' : <><FaSave /> Save Logo Settings</>}
        </button>
        <button onClick={handleReset}
          className="btn-secondary px-5 py-3.5 text-sm"
        >
          <FaUndo /> Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="card p-4 bg-amber-50 border-amber-200">
        <h4 className="font-semibold text-amber-800 text-sm mb-2">📋 How to use custom logo in Navbar</h4>
        <ol className="text-xs text-amber-700 space-y-1.5 list-decimal list-inside">
          <li>Upload your logo image above (PNG with transparent background works best)</li>
          <li>Enable "Use uploaded logo" toggle</li>
          <li>Click Save Logo Settings</li>
          <li>Open <code className="bg-amber-100 px-1 rounded">src/components/public/PublicLayout.js</code></li>
          <li>The navbar automatically reads logo settings from Firebase — no code change needed if using useLogoSettings hook (see below)</li>
        </ol>
        <p className="text-xs text-amber-600 mt-2 font-medium">
          ⚡ Quick tip: For best results, use a PNG logo with transparent background, 400×100px size.
        </p>
      </div>
    </div>
  );
}
