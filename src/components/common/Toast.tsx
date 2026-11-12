import React from 'react';
import { useVisitor } from '../../context/VisitorContext';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useVisitor();

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-emerald-600',
          bg: 'bg-emerald-950',
          text: 'text-emerald-200',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        };
      case 'danger':
        return {
          border: 'border-red-600',
          bg: 'bg-red-950',
          text: 'text-red-200',
          icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        };
      case 'warning':
        return {
          border: 'border-amber-600',
          bg: 'bg-amber-950',
          text: 'text-amber-200',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        };
      default:
        return {
          border: 'border-brand-600',
          bg: 'bg-slate-900',
          text: 'text-slate-200',
          icon: <Info className="w-5 h-5 text-brand-400 shrink-0" />
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full">
      <div 
        className={`flex items-start gap-3 p-4 bg-slate-900 border-l-4 ${style.border} border-t border-r border-b border-slate-800 rounded-md shadow-2xl`}
      >
        {style.icon}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100">{toast.title}</p>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-100 p-1 rounded-sm transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

