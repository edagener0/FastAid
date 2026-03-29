import { AlertCircle, BarChart3, Clock3, MapPinned, Radar, ShieldAlert, Sparkles } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

import { useIncidentStatistics } from '../hooks/useIncidentStatistics';
import { getIncidentStatusLabel, getLocalizedWeekdayLabel, translateRequestError, translations } from '../lib/i18n';
import type { CountBucket, RootOutletContext } from '../types/incidents';

function StatisticsPage() {
  const { language } = useOutletContext<RootOutletContext>();
  const { statistics, aiEnabled, aiInsights, aiLoading, aiError, loading, error, refresh } = useIncidentStatistics(language);
  const copy = translations[language];
  const localizedError = error ? translateRequestError(language, error) : null;
  const localizedAiError = aiError ? translateRequestError(language, aiError) : null;
  const localizedStatusBuckets = (statistics?.by_status ?? []).map((bucket) => ({
    ...bucket,
    label:
      bucket.label === 'aberto' || bucket.label === 'fechado'
        ? getIncidentStatusLabel(language, bucket.label)
        : bucket.label,
  }));
  const localizedWeekdayBuckets = (statistics?.by_weekday ?? []).map((bucket) => ({
    ...bucket,
    label: getLocalizedWeekdayLabel(language, bucket.label),
  }));

  const topDistricts = statistics?.by_district.slice(0, 5) ?? [];
  const peakHours = [...(statistics?.by_hour ?? [])]
    .sort((left, right) => right.count - left.count)
    .slice(0, 3);

  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto px-3 pb-6 pt-3 max-[450px]:px-2 max-[450px]:pb-4 max-[450px]:pt-2.5 max-[400px]:px-1.5 max-[400px]:pb-3 max-[400px]:pt-2 max-[760px]:pb-4 max-[700px]:pb-3 sm:px-4 sm:pb-10 sm:pt-4 md:pt-6">
      <div className="mx-auto w-full max-w-6xl min-w-0">
        <section className="mb-4 overflow-hidden rounded-[24px] border border-[#f5d6b6] bg-[linear-gradient(145deg,_rgba(105,11,8,0.92)_0%,_rgba(129,28,22,0.88)_44%,_rgba(196,106,13,0.82)_100%)] p-4 text-white shadow-[0_26px_80px_rgba(105,11,8,0.2)] max-[450px]:mb-3 max-[450px]:rounded-[18px] max-[450px]:p-2.5 max-[400px]:rounded-[14px] max-[400px]:p-2 sm:mb-6 sm:rounded-[32px] sm:p-6 max-[760px]:mb-3 max-[760px]:p-3 max-[700px]:mb-2.5 max-[700px]:p-2.5">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr] max-[700px]:gap-3">
            <div>
              <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-[#f3c989] bg-[rgba(255,248,234,0.14)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#fff8ea] shadow-[0_8px_24px_rgba(105,11,8,0.12)] max-[450px]:mb-2 max-[450px]:gap-1.5 max-[450px]:px-2 max-[450px]:text-[10px] max-[450px]:tracking-[0.12em] max-[400px]:gap-1 max-[400px]:px-1.5 max-[400px]:py-0.5 max-[400px]:text-[9px] max-[400px]:tracking-[0.06em] sm:mb-4 sm:px-3 sm:text-xs sm:tracking-[0.22em]">
                <BarChart3 className="size-4" />
                {copy.statisticsEyebrow}
              </div>
              <h1 className="max-w-3xl break-words text-[clamp(1.05rem,3.8vw,2.25rem)] font-semibold leading-tight max-[450px]:text-xl max-[400px]:text-lg">{copy.statisticsTitle}</h1>
              <p className="mt-2 max-w-3xl break-words text-sm text-[#fff2e8] max-[450px]:mt-1.5 max-[450px]:text-xs max-[400px]:text-[11px] sm:mt-3 md:text-base">{copy.statisticsDescription}</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm max-[450px]:rounded-[16px] max-[450px]:p-3 max-[400px]:rounded-[12px] max-[400px]:p-2.5 sm:rounded-[28px] sm:p-5">
              <div className="inline-flex max-w-full items-center gap-2 text-sm font-semibold text-[#fff6d7] max-[450px]:text-xs">
                <Sparkles className="size-4" />
                {copy.aiExecutiveSummary}
              </div>
              <p className="mt-2 break-words text-sm leading-6 text-[#fff8ea] max-[450px]:text-xs max-[450px]:leading-5 max-[400px]:text-[11px] max-[400px]:leading-4 sm:mt-3 sm:leading-7">
                {aiLoading
                  ? copy.loadingAIReport
                  : aiInsights?.executive_summary?.trim() || copy.aiExecutiveSummaryFallback}
              </p>
            </div>
          </div>
        </section>

        {loading && (
          <div className="rounded-[28px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.88)] p-5 text-sm text-[#7d3f32] shadow-[0_18px_55px_rgba(105,11,8,0.08)] max-[520px]:rounded-[16px] max-[520px]:p-3 max-[400px]:rounded-[12px] max-[400px]:p-2">
            {copy.loadingStatistics}
          </div>
        )}

        {localizedError && (
          <div className="mb-6 flex flex-col items-start gap-3 rounded-3xl border border-red-200 bg-red-50/90 p-4 text-red-900 shadow-sm sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-semibold">{copy.statisticsLoadError}</p>
                <p className="mt-1 text-sm text-red-800">{localizedError}</p>
              </div>
            </div>
            <button onClick={() => void refresh()} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-700 sm:self-auto">
              {copy.retry}
            </button>
          </div>
        )}

        {statistics && (
          <div className="grid gap-4 sm:gap-5 max-[760px]:gap-3.5 max-[700px]:gap-3 max-[640px]:gap-2.5">
            {aiLoading && (
              <div className="rounded-[28px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.88)] p-5 text-sm text-[#7d3f32] shadow-[0_18px_55px_rgba(105,11,8,0.08)] max-[520px]:rounded-[16px] max-[520px]:p-3 max-[400px]:rounded-[12px] max-[400px]:p-2">
                {copy.loadingAIReport}
              </div>
            )}

            {!aiLoading && !aiEnabled && (
              <div className="rounded-[28px] border border-amber-200 bg-[#fff2df] p-5 text-[#7a300d] shadow-sm max-[520px]:rounded-[16px] max-[520px]:p-3 max-[400px]:rounded-[12px] max-[400px]:p-2">
                <div className="inline-flex items-center gap-2 text-sm font-semibold">
                  <AlertCircle className="size-4 text-[#c46a0d]" />
                  {copy.aiUnavailableTitle}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#9a4e1a]">
                  {copy.aiUnavailableDescription}
                  {localizedAiError ? ` ${localizedAiError}` : ''}
                </p>
              </div>
            )}

            <section className="grid gap-3 max-[450px]:gap-2.5 max-[700px]:gap-2 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatisticCard icon={<Radar className="size-5 text-[#ab0000]" />} label={copy.totalIncidents} value={statistics.summary.total_incidents} />
              <StatisticCard icon={<ShieldAlert className="size-5 text-[#ab0000]" />} label={copy.openIncidents} value={statistics.summary.open_incidents} />
              <StatisticCard icon={<AlertCircle className="size-5 text-[#ab0000]" />} label={copy.urgentIncidents} value={statistics.summary.urgent_incidents} />
              <StatisticCard icon={<MapPinned className="size-5 text-[#ab0000]" />} label={copy.topDistrict} value={statistics.summary.top_district ?? copy.notAvailableShort} caption={statistics.summary.top_district ? copy.topDistrictCount(statistics.summary.top_district_incidents) : undefined} />
            </section>

            <section className="grid gap-4 max-[450px]:gap-3 max-[700px]:gap-2.5 sm:gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <Panel title={copy.enterpriseOverview}>
                <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                  <MiniMetric label={copy.closedIncidents} value={statistics.summary.closed_incidents} />
                  <MiniMetric label={copy.incidentsLast24h} value={statistics.summary.incidents_last_24h} />
                  <MiniMetric label={copy.incidentsLast7d} value={statistics.summary.incidents_last_7d} />
                  <MiniMetric label={copy.roadRelatedIncidents} value={statistics.summary.road_related_incidents} />
                  <MiniMetric label={copy.motorwaySignals} value={statistics.summary.motorway_signal_incidents} />
                  <MiniMetric label={copy.locationCoverage} value={`${statistics.summary.incidents_with_coordinates}/${statistics.summary.total_incidents}`} />
                </div>
              </Panel>

              <Panel title={copy.topDistrictsTitle}>
                <RankedList buckets={topDistricts} emptyLabel={copy.notAvailable} />
              </Panel>
            </section>

            <section className="grid gap-4 max-[450px]:gap-3 max-[700px]:gap-2.5 sm:gap-5 lg:grid-cols-[1fr_1fr]">
              <Panel title={copy.statusDistribution}>
                <DistributionList buckets={localizedStatusBuckets} />
              </Panel>

              <Panel title={copy.peakHoursTitle}>
                <DistributionList buckets={peakHours} />
              </Panel>
            </section>

            {aiInsights && (
              <section className="grid gap-4 max-[450px]:gap-3 max-[700px]:gap-2.5 sm:gap-5 lg:grid-cols-[1fr_1fr]">
                <Panel title={copy.aiNetworkImpact}>
                  <div className="rounded-2xl bg-[#fff1dc] px-4 py-4 text-sm leading-7 text-[#6b2a1e] max-[520px]:rounded-[14px] max-[520px]:px-2.5 max-[520px]:py-2.5 max-[520px]:text-xs max-[520px]:leading-5 max-[400px]:rounded-[10px] max-[400px]:px-2 max-[400px]:py-2">
                    {aiInsights.network_impact_summary}
                  </div>
                </Panel>
                <Panel title={copy.aiExecutiveActions}>
                  <BulletList items={aiInsights.executive_actions} emptyLabel={copy.notAvailable} />
                </Panel>
                <Panel title={copy.aiPriorityDistricts}>
                  <SimpleTagList items={aiInsights.priority_districts} emptyLabel={copy.notAvailable} />
                </Panel>
                <Panel title={copy.riskAlertsTitle}>
                  <BulletList items={aiInsights.risk_alerts} emptyLabel={copy.notAvailable} />
                </Panel>
                <Panel title={copy.operationalRecommendationsTitle}>
                  <BulletList items={aiInsights.operational_recommendations} emptyLabel={copy.notAvailable} />
                </Panel>
                <Panel title={copy.emergingPatternsTitle}>
                  <BulletList items={aiInsights.emerging_patterns} emptyLabel={copy.notAvailable} />
                </Panel>
                <Panel title={copy.dataQualityNotesTitle}>
                  <BulletList items={aiInsights.data_quality_notes} emptyLabel={copy.notAvailable} />
                </Panel>
              </section>
            )}

            <section className="grid gap-4 max-[450px]:gap-3 max-[700px]:gap-2.5 sm:gap-5 lg:grid-cols-[1fr_1fr]">
              <Panel title={copy.weekdayDistributionTitle}>
                <DistributionList buckets={localizedWeekdayBuckets} />
              </Panel>
              <Panel title={copy.lastUpdatedTitle}>
                <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#fff1dc] px-4 py-2 text-sm font-medium text-[#7d3f32] max-[450px]:w-full max-[450px]:justify-center max-[450px]:px-3 max-[450px]:py-1.5 max-[450px]:text-xs max-[400px]:px-2 max-[400px]:text-[11px]">
                  <Clock3 className="size-4 text-[#ab0000]" />
                  <span className="truncate">{new Date(statistics.generated_at).toLocaleString(language === 'pt' ? 'pt-PT' : 'en-GB')}</span>
                </div>
              </Panel>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function StatisticCard({
  icon,
  label,
  value,
  caption,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  caption?: string;
}) {
  return (
    <div className="min-w-0 rounded-[22px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.9)] p-4 shadow-[0_18px_55px_rgba(105,11,8,0.08)] max-[760px]:rounded-[18px] max-[760px]:p-3 max-[700px]:rounded-[16px] max-[700px]:p-2.5 max-[520px]:rounded-[14px] max-[520px]:p-2.5 max-[450px]:rounded-[16px] max-[450px]:p-2.5 max-[400px]:rounded-[12px] max-[400px]:p-2 sm:rounded-[28px] sm:p-5">
      <div className="mb-3 inline-flex rounded-full bg-[#fff1dc] p-2.5 sm:mb-4 sm:p-3">{icon}</div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b07c57] max-[450px]:text-[10px] max-[450px]:tracking-[0.12em] max-[400px]:text-[9px] max-[400px]:tracking-[0.05em] sm:text-xs sm:tracking-[0.22em]">{label}</div>
      <div className="mt-2 break-words text-[clamp(1rem,4.4vw,1.9rem)] font-semibold text-[#5c1b16] max-[450px]:text-xl max-[400px]:text-lg sm:mt-3">{value}</div>
      {caption ? <div className="mt-1.5 break-words text-sm text-[#7d3f32] max-[450px]:text-xs max-[400px]:text-[11px] sm:mt-2">{caption}</div> : null}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-0 rounded-2xl bg-[#fff1dc] p-3 max-[760px]:p-2.5 max-[700px]:p-2 max-[520px]:rounded-[12px] max-[520px]:p-2 max-[450px]:rounded-[14px] max-[450px]:p-2 max-[400px]:rounded-[10px] max-[400px]:p-1.5 sm:rounded-3xl sm:p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-[#b07c57] max-[450px]:text-[10px] max-[450px]:tracking-[0.08em] max-[400px]:text-[9px] max-[400px]:tracking-[0.04em] sm:text-xs sm:tracking-[0.18em]">{label}</div>
      <div className="mt-1.5 break-words text-[clamp(0.95rem,4vw,1.5rem)] font-semibold text-[#5c1b16] max-[450px]:text-lg max-[400px]:text-base sm:mt-2">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-[24px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.9)] p-4 shadow-[0_18px_55px_rgba(105,11,8,0.08)] max-[760px]:rounded-[20px] max-[760px]:p-3 max-[700px]:rounded-[16px] max-[700px]:p-2.5 max-[520px]:rounded-[14px] max-[520px]:p-2.5 max-[450px]:rounded-[18px] max-[450px]:p-2.5 max-[400px]:rounded-[14px] max-[400px]:p-2 sm:rounded-[32px] sm:p-5">
      <div className="mb-3 break-words text-base font-semibold text-[#5c1b16] max-[450px]:mb-2 max-[450px]:text-sm max-[400px]:text-[13px] sm:mb-4 sm:text-lg">{title}</div>
      {children}
    </div>
  );
}

function DistributionList({ buckets }: { buckets: CountBucket[] }) {
  const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1);

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {buckets.map((bucket) => (
        <div key={bucket.label}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm text-[#7d3f32] max-[450px]:text-xs">
            <span className="min-w-0 flex-1 break-words">{bucket.label}</span>
            <span className="font-semibold text-[#5c1b16]">{bucket.count}</span>
          </div>
          <div className="h-2 rounded-full bg-[#f6e6d9]">
            <div
              className="h-2 rounded-full bg-[linear-gradient(90deg,_#ab0000_0%,_#fdd604_100%)]"
              style={{ width: `${(bucket.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RankedList({ buckets, emptyLabel }: { buckets: CountBucket[]; emptyLabel: string }) {
  if (buckets.length === 0) {
    return <p className="text-sm text-[#7d3f32]">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {buckets.map((bucket, index) => (
        <div key={bucket.label} className="flex items-center justify-between gap-2 rounded-2xl bg-[#fff1dc] px-3 py-2.5 max-[520px]:rounded-[12px] max-[520px]:px-2.5 max-[520px]:py-2 max-[450px]:rounded-[14px] max-[450px]:px-2.5 max-[450px]:py-2 max-[400px]:flex-col max-[400px]:items-start sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="grid size-7 shrink-0 place-items-center rounded-full bg-[#690b08] text-xs font-semibold text-white sm:size-8 sm:text-sm">{index + 1}</div>
            <span className="min-w-0 break-words text-sm font-medium text-[#5c1b16] max-[450px]:text-xs">{bucket.label}</span>
          </div>
          <span className="shrink-0 text-sm font-semibold text-[#7d3f32] max-[450px]:text-xs">{bucket.count}</span>
        </div>
      ))}
    </div>
  );
}

function BulletList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-[#7d3f32]">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {items.map((item) => (
        <div key={item} className="flex gap-2.5 rounded-2xl bg-[#fff1dc] px-3 py-2.5 text-sm leading-6 text-[#6b2a1e] max-[450px]:rounded-[14px] max-[450px]:px-2.5 max-[450px]:py-2 max-[450px]:text-xs max-[450px]:leading-5 sm:gap-3 sm:px-4 sm:py-3">
          <span className="mt-2 size-2 shrink-0 rounded-full bg-[#ab0000]" />
          <span className="break-words">{item}</span>
        </div>
      ))}
    </div>
  );
}

function SimpleTagList({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-[#7d3f32]">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-[#fff1dc] px-3 py-1.5 text-sm font-medium text-[#690b08] max-[450px]:px-2.5 max-[450px]:py-1 max-[450px]:text-xs sm:px-4 sm:py-2">
          {item}
        </span>
      ))}
    </div>
  );
}

export default StatisticsPage;
