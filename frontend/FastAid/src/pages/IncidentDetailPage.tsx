import { AlertCircle, ArrowLeft, Clock3, MapPin, Navigation, Phone, ScrollText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { getIncidentStatusLabel, translateRequestError, translations } from '../lib/i18n';
import { buildIncidentRouteUrl, fetchIncident, formatAbsoluteDate, getIncidentCoordinates } from '../lib/incidents';
import type { Incident, RootOutletContext } from '../types/incidents';
import Map from './Map';

function IncidentDetailPage() {
  const navigate = useNavigate();
  const { language } = useOutletContext<RootOutletContext>();
  const { incidentId = '' } = useParams();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const copy = translations[language];
  const localizedError = error ? translateRequestError(language, error) : null;

  useEffect(() => {
    const loadIncident = async () => {
      try {
        setLoading(true);
        setError(null);
        const nextIncident = await fetchIncident(incidentId);
        setIncident(nextIncident);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : copy.incidentLoadFallback);
      } finally {
        setLoading(false);
      }
    };

    void loadIncident();
  }, [copy.incidentLoadFallback, incidentId]);

  const coordinates = incident ? getIncidentCoordinates(incident) : null;

  return (
    <div className="h-full w-full overflow-auto px-4 pb-10 pt-28 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f0d0b6] bg-[rgba(255,251,244,0.9)] px-4 py-2 text-sm font-semibold text-[#6b2a1e] shadow-sm backdrop-blur-sm transition hover:bg-white"
        >
          <ArrowLeft className="size-4" />
          {copy.back}
        </button>

        {loading && (
          <div className="rounded-[30px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.9)] p-6 text-sm text-[#7d3f32] shadow-[0_18px_55px_rgba(105,11,8,0.08)]">
            {copy.loadingIncidentDetails}
          </div>
        )}

        {localizedError && (
          <div className="rounded-[30px] border border-red-200 bg-red-50/90 p-6 text-red-900 shadow-[0_18px_55px_rgba(127,29,29,0.08)]">
            <div className="inline-flex items-center gap-2 font-semibold">
              <AlertCircle className="size-5 text-red-600" />
              {copy.openIncidentError}
            </div>
            <p className="mt-2 text-sm text-red-800">{localizedError}</p>
          </div>
        )}

        {incident && (
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[32px] border border-[#f5d6b6] bg-[linear-gradient(145deg,_rgba(105,11,8,0.92)_0%,_rgba(129,28,22,0.88)_44%,_rgba(196,106,13,0.82)_100%)] p-6 text-white shadow-[0_26px_80px_rgba(105,11,8,0.2)]">
              <div className="inline-flex rounded-full border border-[#f3c989] bg-[rgba(255,248,234,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#fff8ea] shadow-[0_8px_24px_rgba(105,11,8,0.12)]">
                {copy.statusLabel} {getIncidentStatusLabel(language, incident.status)}
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight">{incident.title}</h1>
              <p className="mt-3 text-sm text-[#fff2e8] md:text-base">{incident.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#fff2cf]">{copy.registeredAt}</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#fff7ef]">
                    <Clock3 className="size-4" />
                    {formatAbsoluteDate(incident.created_at, language)}
                  </p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#fff2cf]">{copy.contact}</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#fff7ef]">
                    <Phone className="size-4" />
                    {incident.phone || copy.unavailable}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#fff2cf]">{copy.place}</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#fff7ef]">
                  <MapPin className="size-4" />
                  {incident.place ?? copy.unknownLocation}
                </p>
              </div>

              <div className="mt-4 rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#fff2cf]">{copy.operationalReport}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#fff7ef]">{incident.report}</p>
              </div>

              {coordinates && (
                <a
                  href={buildIncidentRouteUrl(coordinates)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#fff8ea] px-5 py-3 text-sm font-semibold text-[#690b08] transition hover:bg-white"
                >
                  <Navigation className="size-4" />
                  {copy.openExternalRoute}
                </a>
              )}
            </section>

            <section className="grid gap-5">
              <div className="overflow-hidden rounded-[32px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.9)] shadow-[0_18px_55px_rgba(105,11,8,0.08)]">
                <div className="border-b border-[#f2dfcf] px-5 py-4">
                  <h2 className="text-lg font-semibold text-[#5c1b16]">{copy.incidentMap}</h2>
                </div>
                <div className="h-[420px]">
                  <Map incidents={[incident]} selectedIncidentId={incident.id} language={language} />
                </div>
              </div>

              <div className="rounded-[32px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.9)] p-5 shadow-[0_18px_55px_rgba(105,11,8,0.08)]">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#5c1b16]">
                  <ScrollText className="size-4" />
                  {copy.receivedTranscript}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#7d3f32]">
                  {incident.transcription || copy.noTranscript}
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncidentDetailPage;
