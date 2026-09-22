import { createContext, useContext } from 'react';
import { useJobRequest } from './hooks/useJobRequest';

const JobRequestContext = createContext(null);

export function JobRequestProvider({ children }) {
  const value = useJobRequest();
  return <JobRequestContext.Provider value={value}>{children}</JobRequestContext.Provider>;
}

export const useJobRequestContext = () => useContext(JobRequestContext);