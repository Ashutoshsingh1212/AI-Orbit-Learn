import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useAuth();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#121216]/95 px-4 py-3 shadow-2xl backdrop-blur-md">
        {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />}
        {toast.type === 'info' && <Info className="h-5 w-5 text-[#6E56CF] shrink-0" />}

        <p className="text-sm font-medium text-white">{toast.message}</p>

        <button
          onClick={hideToast}
          className="ml-auto rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
