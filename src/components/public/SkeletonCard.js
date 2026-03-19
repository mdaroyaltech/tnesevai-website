// src/components/public/SkeletonCard.js
// Shows while Firebase data is loading
import React from 'react';

export default function SkeletonCard() {
  return (
    <div style={{
      background: 'white', borderRadius: 22, padding: 22,
      border: '2px solid #f0fdf4', height: '100%',
    }}>
      <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
        {/* Icon placeholder */}
        <div className="skeleton" style={{ width: 54, height: 54, borderRadius: 16, flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton" style={{ height: 14, borderRadius: 8, width: '80%' }} />
          <div className="skeleton" style={{ height: 12, borderRadius: 8, width: '60%' }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 1, borderRadius: 4, marginBottom: 12 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 99 }} />
        <div className="skeleton" style={{ height: 24, width: 70, borderRadius: 99 }} />
      </div>
      <div className="skeleton" style={{ height: 36, borderRadius: 12, marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 40, borderRadius: 14 }} />
    </div>
  );
}
