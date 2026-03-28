import { useEffect, useState } from 'react';

import { fetchIncidents } from '../lib/incidents';
import type { Incident } from '../types/incidents';

interface UseIncidentsResult {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useIncidents(): UseIncidentsResult {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const nextIncidents = await fetchIncidents();
      setIncidents(nextIncidents);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar os incidentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadIncidents();
  }, []);

  return {
    incidents,
    loading,
    error,
    refresh: loadIncidents,
  };
}
