import { useState } from 'react';
import { useNotificationContext } from '../notificationContext';

export default function NotificationBell() {
  const ctx = useNotificationContext();
  const [open, setOpen] = useState(false);

  if (!ctx) return null;
  const { notifications, unreadCount, markRead, markAllRead } = ctx;

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative p-2 rounded-full hover:bg-gray-100">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline">Mark all read</button>
            )}
          </div>

          {notifications.length === 0 && <p className="text-sm text-gray-400 p-4 text-center">No notifications yet</p>}

          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => markRead(n._id)}
                className={`w-full text-left p-3 hover:bg-gray-50 ${!n.read ? 'bg-indigo-50/40' : ''}`}
              >
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}