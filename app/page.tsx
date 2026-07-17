'use client';

import { useState, useEffect } from 'react';
import JobTagTracker from '@/components/JobTagTracker';

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <main className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <JobTagTracker isDark={isDark} />
    </main>
  );
}
