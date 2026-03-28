import { useEffect, useState } from 'react';

import { fetchIncidentStatistics } from '../lib/incidents';
import type { IncidentStatisticsResponse } from '../types/incidents';

interface UseIncidentStatisticsResult {
  statistics: IncidentStatisticsResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useIncidentStatistics(): UseIncidentStatisticsResult {
  const [statistics, setStatistics] = useState<IncidentStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const nextStatistics = await fetchIncidentStatistics();
      setStatistics(nextStatistics);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar as estatisticas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
    refresh: loadStatistics,
  };
}
