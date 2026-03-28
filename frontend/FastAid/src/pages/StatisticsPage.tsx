import { AlertCircle, BarChart3, Clock3, MapPinned, Radar, ShieldAlert, Sparkles } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

import { useIncidentStatistics } from '../hooks/useIncidentStatistics';
import { translations } from '../lib/i18n';
import type { CountBucket, RootOutletContext } from '../types/incidents';

function StatisticsPage() {
  const { language } = useOutletContext<RootOutletContext>();
  const { statistics, aiEnabled, aiInsights, aiLoading, aiError, loading, error, refresh } = useIncidentStatistics();
  const copy = translations[language];

  const topDistricts = statistics?.by_district.slice(0, 5) ?? [];
  const peakHours = [...(statistics?.by_hour ?? [])]
    .sort((left, right) => right.count - left.count)
    .slice(0, 3);

  return (
    <div className="h-full w-full overflow-auto px-4 pb-10 pt-28 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 overflow-hidden rounded-[32px] border border-[#f5d6b6] bg-[linear-gradient(145deg,_rgba(105,11,8,0.92)_0%,_rgba(129,28,22,0.88)_44%,_rgba(196,106,13,0.82)_100%)] p-6 text-white shadow-[0_26px_80px_rgba(105,11,8,0.2)]">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f3c989] bg-[rgba(255,248,234,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#fff8ea] shadow-[0_8px_24px_rgba(105,11,8,0.12)]">
                <BarChart3 className="size-4" />
                {copy.statisticsEyebrow}
              </div>
              <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">{copy.statisticsTitle}</h1>
              <p className="mt-3 max-w-3xl text-sm text-[#fff2e8] md:text-base">{copy.statisticsDescription}</p>
            </div>

            {aiInsights && (
              <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#fff6d7]">
                  <Sparkles className="size-4" />
                  {copy.aiExecutiveSummary}
                </div>
                <p className="mt-3 text-sm leading-7 text-[#fff8ea]">{aiInsights.executive_summary}</p>
              </div>
            )}
          </div>
        </section>

        {loading && (
          <div className="rounded-[28px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.88)] p-5 text-sm text-[#7d3f32] shadow-[0_18px_55px_rgba(105,11,8,0.08)]">
            {copy.loadingStatistics}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-3 rounded-3xl border border-red-200 bg-red-50/90 p-4 text-red-900 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-semibold">{copy.statisticsLoadError}</p>
                <p className="mt-1 text-sm text-red-800">{error}</p>
              </div>
            </div>
            <button onClick={() => void refresh()} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-700">
              {copy.retry}
            </button>
          </div>
        )}

        {statistics && (
          <div className="grid gap-5">
            {aiLoading && (
              <div className="rounded-[28px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.88)] p-5 text-sm text-[#7d3f32] shadow-[0_18px_55px_rgba(105,11,8,0.08)]">
                {copy.loadingAIReport}
              </div>
            )}

            {!aiLoading && !aiEnabled && (
              <div className="rounded-[28px] border border-amber-200 bg-[#fff2df] p-5 text-[#7a300d] shadow-sm">
                <div className="inline-flex items-center gap-2 text-sm font-semibold">
                  <AlertCircle className="size-4 text-[#c46a0d]" />
                  {copy.aiUnavailableTitle}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#9a4e1a]">
                  {copy.aiUnavailableDescription}
                  {aiError ? ` ${aiError}` : ''}
                </p>
              </div>
            )}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatisticCard icon={<Radar className="size-5 text-[#ab0000]" />} label={copy.totalIncidents} value={statistics.summary.total_incidents} />
              <StatisticCard icon={<ShieldAlert className="size-5 text-[#ab0000]" />} label={copy.openIncidents} value={statistics.summary.open_incidents} />
              <StatisticCard icon={<AlertCircle className="size-5 text-[#ab0000]" />} label={copy.urgentIncidents} value={statistics.summary.urgent_incidents} />
              <StatisticCard icon={<MapPinned className="size-5 text-[#ab0000]" />} label={copy.topDistrict} value={statistics.summary.top_district ?? copy.notAvailableShort} caption={statistics.summary.top_district ? copy.topDistrictCount(statistics.summary.top_district_incidents) : undefined} />
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <Panel title={copy.enterpriseOverview}>
                <div className="grid gap-3 sm:grid-cols-2">
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

            <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <Panel title={copy.statusDistribution}>
                <DistributionList buckets={statistics.by_status} />
              </Panel>

              <Panel title={copy.peakHoursTitle}>
                <DistributionList buckets={peakHours} />
              </Panel>
            </section>

            {aiInsights && (
              <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
                <Panel title={copy.aiNetworkImpact}>
                  <div className="rounded-2xl bg-[#fff1dc] px-4 py-4 text-sm leading-7 text-[#6b2a1e]">
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

            <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <Panel title={copy.weekdayDistributionTitle}>
                <DistributionList buckets={statistics.by_weekday} />
              </Panel>
              <Panel title={copy.lastUpdatedTitle}>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#fff1dc] px-4 py-2 text-sm font-medium text-[#7d3f32]">
                  <Clock3 className="size-4 text-[#ab0000]" />
                  {new Date(statistics.generated_at).toLocaleString(language === 'pt' ? 'pt-PT' : 'en-GB')}
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
    <div className="rounded-[28px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.9)] p-5 shadow-[0_18px_55px_rgba(105,11,8,0.08)]">
      <div className="mb-4 inline-flex rounded-full bg-[#fff1dc] p-3">{icon}</div>
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b07c57]">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-[#5c1b16]">{value}</div>
      {caption ? <div className="mt-2 text-sm text-[#7d3f32]">{caption}</div> : null}
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl bg-[#fff1dc] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-[#b07c57]">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[#5c1b16]">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[32px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.9)] p-5 shadow-[0_18px_55px_rgba(105,11,8,0.08)]">
      <div className="mb-4 text-lg font-semibold text-[#5c1b16]">{title}</div>
      {children}
    </div>
  );
}

function DistributionList({ buckets }: { buckets: CountBucket[] }) {
  const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1);

  return (
    <div className="space-y-3">
      {buckets.map((bucket) => (
        <div key={bucket.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm text-[#7d3f32]">
            <span>{bucket.label}</span>
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
    <div className="space-y-3">
      {buckets.map((bucket, index) => (
        <div key={bucket.label} className="flex items-center justify-between rounded-2xl bg-[#fff1dc] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-full bg-[#690b08] text-sm font-semibold text-white">{index + 1}</div>
            <span className="font-medium text-[#5c1b16]">{bucket.label}</span>
          </div>
          <span className="text-sm font-semibold text-[#7d3f32]">{bucket.count}</span>
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
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="flex gap-3 rounded-2xl bg-[#fff1dc] px-4 py-3 text-sm leading-6 text-[#6b2a1e]">
          <span className="mt-2 size-2 shrink-0 rounded-full bg-[#ab0000]" />
          <span>{item}</span>
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
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-[#fff1dc] px-4 py-2 text-sm font-medium text-[#690b08]">
          {item}
        </span>
      ))}
    </div>
  );
}

export default StatisticsPage;
