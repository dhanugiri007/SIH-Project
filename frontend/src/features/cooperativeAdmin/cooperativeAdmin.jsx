import { createContext, useContext } from 'react';
import { useAdminData } from './hooks/useAdminData';

const CooperativeAdminContext = createContext(null);

export function CooperativeAdminProvider({ children }) {
  const value = useAdminData();
  return <CooperativeAdminContext.Provider value={value}>{children}</CooperativeAdminContext.Provider>;
}

export const useCooperativeAdminContext = () => useContext(CooperativeAdminContext);