import { createContext, useContext } from 'react';
import { useMyTasks } from './hooks/useMyTasks';
import { useAvailability } from './hooks/useAvailability';

const WorkerTasksContext = createContext(null);

export function WorkerTasksProvider({ children }) {
  const tasksState = useMyTasks();
  const availabilityState = useAvailability();
  return (
    <WorkerTasksContext.Provider value={{ ...tasksState, ...availabilityState }}>
      {children}
    </WorkerTasksContext.Provider>
  );
}

export const useWorkerTasksContext = () => useContext(WorkerTasksContext);