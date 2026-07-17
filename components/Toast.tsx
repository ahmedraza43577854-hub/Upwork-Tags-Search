'use client';

import { Check, Info, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'info';
}

export default function Toast({ message, type }: ToastProps) {
  const isSuccess = type === 'success';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-sm ${
        isSuccess
          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400/30'
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400/30'
      }`}
    >
      <div className={`flex-shrink-0 p-1 rounded-full ${isSuccess ? 'bg-white/20' : 'bg-white/20'}`}>
        {isSuccess ? (
          <Sparkles size={18} />
        ) : (
          <Info size={18} />
        )}
      </div>
      <span className="text-sm font-medium leading-snug">{message}</span>
      {isSuccess && <Check size={16} className="flex-shrink-0 opacity-80" />}
    </div>
  );
}
