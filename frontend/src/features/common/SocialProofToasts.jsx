import React from 'react';
import { usePurchaseNotifications } from './useSocket';

export default function SocialProofToasts() {
  const notifications = usePurchaseNotifications();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto flex items-center gap-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl p-4 transition-all duration-500 transform translate-x-0 animate-bounce-subtle"
          style={{
            animation: 'slideIn 0.3s ease-out forwards',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-indigo-500 font-bold">
              Recent Activity 🔥
            </p>
            <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold truncate">
              Someone in <span className="text-indigo-600 font-bold">{n.city}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              just bought <span className="font-medium text-gray-700 dark:text-gray-300">{n.productTitle}</span>
            </p>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
