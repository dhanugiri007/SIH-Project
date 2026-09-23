import { useState } from 'react';
import { useNotificationContext } from '../notificationContext';

export default function NotificationBell() {
  const ctx = useNotificationContext();
  const [open, setOpen] = useState(false);

  if (!ctx) return null;
  const { notifications, unreadCount, markRead, markAllRead } = ctx;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2.5 rounded-xl border border-[#E8E5DE] bg-white hover:bg-[#F8F5EE] text-[#101010] transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <svg className="w-4 h-4 text-[#596174]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#B8861B] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-[#E8E5DE] rounded-2xl shadow-sahyog-card z-50">
          <div className="flex items-center justify-between p-3.5 border-b border-[#F0EDE6] bg-[#FAF9F6] rounded-t-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#101010]">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#B8861B] hover:text-[#A57412] font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 && (
            <div className="p-6 text-center text-xs text-[#8A909F]">
              No notifications yet
            </div>
          )}

          <div className="divide-y divide-[#F0EDE6]">
            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => markRead(n._id)}
                className={`w-full text-left p-3.5 hover:bg-[#FAF9F6] transition-colors cursor-pointer ${
                  !n.read ? 'bg-[#FFF9E8]/40' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-[#0A0A0D]">{n.title}</p>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#B8861B] mt-1" />}
                </div>
                <p className="text-xs text-[#596174] mt-1 leading-snug">{n.message}</p>
                <p className="text-[10px] text-[#8A909F] mt-1.5">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}