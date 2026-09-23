import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../../../shared/hooks/useSocket';
import { notificationApiService } from '../services/notificationService';

export function useNotifications() {
  const { socket, connected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await notificationApiService.list();
    setNotifications(data);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    if (!connected || !socket.current) return;
    const s = socket.current;
    const handleNew = (notif) => setNotifications((prev) => [notif, ...prev]);
    s.on('notification:new', handleNew);
    return () => s.off('notification:new', handleNew);
  }, [connected, socket]);

  const markRead = async (id) => {
    await notificationApiService.markRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = async () => {
    await notificationApiService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, loading, unreadCount, markRead, markAllRead };
}