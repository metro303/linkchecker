'use client';

import './globals.css';
import { useEffect } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KHAB555 Redirect Monitor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ✅ Register Service Worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('✅ Service Worker registered'))
        .catch((err) => console.error('❌ SW registration failed:', err));
    }

    // ✅ Trigger internal CRON (safe fallback if backend didn’t start it)
    if (typeof window !== 'undefined') {
      fetch('/api/start-cron')
        .then(() => console.log('🔁 CRON triggered from client'))
        .catch((err) => console.error('❌ Failed to trigger CRON:', err.message));
    }
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {children}
      </body>
    </html>
  );
}
