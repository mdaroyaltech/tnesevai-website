// src/hooks/useLogoSettings.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

const DEFAULTS = {
  logoUrl: '', faviconUrl: '', useCustom: false,
  showVleCode: true, vleCode: '642198200013',
  navLogoText: 'RC', shopNameEn: 'Royal Computers', shopNameTa: 'ராயல் கம்ப்யூட்டர்ஸ்',
};

export function useLogoSettings() {
  const [logo, setLogo] = useState(DEFAULTS);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'logo'),
      snap => { if (snap.exists()) setLogo({ ...DEFAULTS, ...snap.data() }); },
      err => console.error('Logo settings error:', err)
    );
    return unsub;
  }, []);

  // ✅ logoUrl exist = show karo, useCustom ki zaroorat nahi
  return { ...logo, showCustomLogo: !!logo.logoUrl };
}
