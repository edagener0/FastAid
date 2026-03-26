import { AlertCircle, ArrowUpRight, Clock3, MapPin, RefreshCcw, Siren, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import Map from './Map.tsx';

import { useIncidents } from '../hooks/useIncidents';
import { formatRelativeTime, getIncidentCoordinates } from '../lib/incidents';
import type { RootOutletContext } from '../types/incidents';

function MapPage() {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext<RootOutletContext>();
  const { incidents, loading, error, refresh } = useIncidents();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const visibleIncidents = incidents.filter((incident) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return [incident.title, incident.description, incident.place ?? '', incident.status]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  const incidentsWithCoordinates = visibleIncidents.filter((incident) => getIncidentCoordinates(incident));
  const highlightedIncidents = visibleIncidents.slice(0, 4);

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-x-4 top-24 z-[900] mx-auto max-w-6xl">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/80 bg-[linear-gradient(145deg,_rgba(2,6,23,0.95)_0%,_rgba(8,47,73,0.92)_48%,_rgba(14,116,144,0.84)_100%)] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.3)] backdrop-blur-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                  <Siren className="size-4" />
                  Centro operacional
                </div>
                <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
                  Visao tática dos incidentes ativos com acesso imediato ao terreno.
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
                  O mapa recebe os incidentes do backend e destaca os casos mais recentes para despacho rápido.
                </p>
              </div>

              <button
                onClick={() => void refresh()}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/16"
              >
                <RefreshCcw className="size-4" />
                Atualizar
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">Total</p>
                <p className="mt-2 text-3xl font-semibold">{visibleIncidents.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">Com coordenadas</p>
                <p className="mt-2 text-3xl font-semibold">{incidentsWithCoordinates.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">Pesquisa</p>
                <p className="mt-2 text-sm text-slate-100">{searchQuery.trim() ? `Filtro: "${searchQuery}"` : 'Sem filtro ativo'}</p>
              </div>
            </div>
          </section>

          <section className="hidden rounded-[32px] border border-white/80 bg-white/78 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:block">
            <div className="flex items-center justify-between gap-3 px-1 pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Fila prioritaria</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">Incidentes recentes</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <Zap className="size-3.5" />
                Tempo real
              </div>
            </div>

            <div className="grid gap-3">
              {highlightedIncidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className="rounded-[26px] border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_18px_38px_rgba(14,116,144,0.12)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{incident.status}</p>
                      <h3 className="mt-1 text-base font-semibold text-slate-900">{incident.title}</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      {formatRelativeTime(incident.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{incident.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="size-4 text-cyan-600" />
                      {incident.place ?? 'Localizacao por confirmar'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-900">
                      Ver
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </button>
              ))}

              {!loading && highlightedIncidents.length === 0 && (
                <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  Nenhum incidente encontrado para o filtro atual.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="h-full w-full">
        <Map incidents={incidentsWithCoordinates} selectedIncidentId={selectedIncidentId} />
      </div>

      <div className="absolute inset-x-4 bottom-4 z-[900] mx-auto max-w-6xl">
        {loading && (
          <div className="rounded-[28px] border border-white/80 bg-white/82 px-5 py-4 text-sm text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            A carregar incidentes a partir do backend...
          </div>
        )}

        {error && (
          <div className="rounded-[28px] border border-red-200 bg-red-50/95 px-5 py-4 text-sm text-red-800 shadow-[0_18px_45px_rgba(127,29,29,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <AlertCircle className="size-4" />
                {error}
              </span>
              <button onClick={() => void refresh()} className="font-semibold text-red-700">
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {!loading && !error && visibleIncidents.length > 0 && (
          <div className="grid gap-3 md:hidden">
            {highlightedIncidents.map((incident) => (
              <button
                key={incident.id}
                onClick={() => navigate(`/${incident.id}`)}
                className="rounded-[26px] border border-white/85 bg-white/82 p-4 text-left shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">{incident.title}</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700">
                    <Clock3 className="size-3.5" />
                    {formatRelativeTime(incident.created_at)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{incident.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;
