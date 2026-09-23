import { createContext, useContext } from 'react';
import { useAuth } from '../auth/authContext';
import { useNotifications } from './hooks/useNotification';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  return user ? <NotificationProviderInner>{children}</NotificationProviderInner> : children;
}

function NotificationProviderInner({ children }) {
  const value = useNotifications();
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotificationContext = () => useContext(NotificationContext);