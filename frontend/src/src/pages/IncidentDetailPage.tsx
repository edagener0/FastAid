import { AlertCircle, ArrowLeft, Clock3, MapPin, Navigation, Phone, ScrollText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { buildIncidentRouteUrl, fetchIncident, formatAbsoluteDate, getIncidentCoordinates } from '../lib/incidents';
import type { Incident } from '../types/incidents';
import Map from './Map';

function IncidentDetailPage() {
  const navigate = useNavigate();
  const { incidentId = '' } = useParams();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIncident = async () => {
      try {
        setLoading(true);
        setError(null);
        const nextIncident = await fetchIncident(incidentId);
        setIncident(nextIncident);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Nao foi possivel carregar o incidente.');
      } finally {
        setLoading(false);
      }
    };

    void loadIncident();
  }, [incidentId]);

  const coordinates = incident ? getIncidentCoordinates(incident) : null;

  return (
    <div className="h-full w-full overflow-auto px-4 pb-10 pt-24">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </button>

        {loading && (
          <div className="rounded-[30px] border border-white/80 bg-white/85 p-6 text-sm text-slate-600 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
            A carregar os detalhes do incidente...
          </div>
        )}

        {error && (
          <div className="rounded-[30px] border border-red-200 bg-red-50/90 p-6 text-red-900 shadow-[0_18px_55px_rgba(127,29,29,0.08)]">
            <div className="inline-flex items-center gap-2 font-semibold">
              <AlertCircle className="size-5 text-red-600" />
              Erro ao abrir o incidente
            </div>
            <p className="mt-2 text-sm text-red-800">{error}</p>
          </div>
        )}

        {incident && (
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[32px] border border-white/80 bg-[linear-gradient(140deg,_rgba(2,6,23,0.96)_0%,_rgba(15,23,42,0.94)_38%,_rgba(8,47,73,0.88)_100%)] p-6 text-white shadow-[0_26px_80px_rgba(15,23,42,0.26)]">
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Estado {incident.status}
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight">{incident.title}</h1>
              <p className="mt-3 text-sm text-slate-200 md:text-base">{incident.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Registado</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-100">
                    <Clock3 className="size-4" />
                    {formatAbsoluteDate(incident.created_at)}
                  </p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Contacto</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-100">
                    <Phone className="size-4" />
                    {incident.phone || 'Indisponivel'}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Local</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-100">
                  <MapPin className="size-4" />
                  {incident.place ?? 'Localizacao por confirmar'}
                </p>
              </div>

              <div className="mt-4 rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Relatorio operacional</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-100">{incident.report}</p>
              </div>

              {coordinates && (
                <a
                  href={buildIncidentRouteUrl(coordinates)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  <Navigation className="size-4" />
                  Abrir rota externa
                </a>
              )}
            </section>

            <section className="grid gap-5">
              <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/85 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
                <div className="border-b border-slate-200/80 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-950">Mapa do incidente</h2>
                </div>
                <div className="h-[420px]">
                  <Map incidents={[incident]} selectedIncidentId={incident.id} />
                </div>
              </div>

              <div className="rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ScrollText className="size-4" />
                  Transcricao recebida
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {incident.transcription || 'Sem transcricao disponivel.'}
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
