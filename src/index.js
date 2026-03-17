// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './locales/i18n';
import App from './App';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .catch(err => console.error('SW registration failed:', err));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
