// src/hooks/useScrollReveal.js
import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    // Scroll progress bar
    const bar = document.getElementById('scroll-bar');
    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (bar) bar.style.width = Math.min(100, pct) + '%';

      // Reveal elements
      document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) el.classList.add('visible');
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount
    setTimeout(onScroll, 100);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
