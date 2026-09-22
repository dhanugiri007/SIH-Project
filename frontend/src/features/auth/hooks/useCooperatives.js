import { useEffect, useState } from 'react';
import { authService } from '../service/authService';

export function useCooperatives() {
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .listCooperatives()
      .then(setCooperatives)
      .finally(() => setLoading(false));
  }, []);

  return { cooperatives, loading };
}