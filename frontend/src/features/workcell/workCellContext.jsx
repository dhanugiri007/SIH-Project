import { createContext, useContext } from 'react';
import { useWorkCell } from './hooks/useWorkCell';

const WorkCellContext = createContext(null);

export function WorkCellProvider({ jobId, children }) {
  const value = useWorkCell(jobId);
  return <WorkCellContext.Provider value={value}>{children}</WorkCellContext.Provider>;
}

export const useWorkCellContext = () => useContext(WorkCellContext);