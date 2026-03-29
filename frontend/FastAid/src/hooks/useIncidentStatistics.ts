import { useEffect, useState } from 'react';

import { fetchIncidentStatistics, fetchIncidentStatisticsAI } from '../lib/incidents';
import type { AIStatisticsInsights, IncidentStatisticsResponse, Language } from '../types/incidents';

interface UseIncidentStatisticsResult {
  statistics: IncidentStatisticsResponse | null;
  aiEnabled: boolean;
  aiInsights: AIStatisticsInsights | null;
  aiLoading: boolean;
  aiError: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useIncidentStatistics(language: Language): UseIncidentStatisticsResult {
  const [statistics, setStatistics] = useState<IncidentStatisticsResponse | null>(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIStatisticsInsights | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = async (requestLanguage: Language = language) => {
    try {
      setLoading(true);
      setError(null);
      const nextStatistics = await fetchIncidentStatistics(requestLanguage);
      setStatistics(nextStatistics);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar as estatisticas.');
    } finally {
      setLoading(false);
    }
  };

  const loadAIStatistics = async (requestLanguage: Language = language) => {
    try {
      setAiLoading(true);
      setAiError(null);
      setAiEnabled(false);
      setAiInsights(null);
      const nextAI = await fetchIncidentStatisticsAI(requestLanguage);
      setAiEnabled(nextAI.ai_enabled);
      setAiInsights(nextAI.ai_insights);
      setAiError(nextAI.ai_error);
    } catch (loadError) {
      setAiError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o relatorio de IA.');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    void loadStatistics(language);
    void loadAIStatistics(language);
  }, [language]);

  return {
    statistics,
    aiEnabled,
    aiInsights,
    aiLoading,
    aiError,
    loading,
    error,
    refresh: async () => {
      await Promise.all([loadStatistics(), loadAIStatistics()]);
    },
  };
}
