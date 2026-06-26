import React from 'react';

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-xl text-white flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${
            toast.type === 'error'
              ? 'bg-rose-600'
              : 'bg-slate-900 border-l-4 border-indigo-500'
          }`}
        >
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
              {toast.type === 'error' ? 'System Notification' : 'Update Alert'}
            </p>
            <p className="text-sm font-medium mt-1">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white hover:opacity-100 opacity-60 text-lg leading-none"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

