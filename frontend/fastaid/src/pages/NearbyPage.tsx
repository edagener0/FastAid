import { useEffect, useState } from 'react';
import { AlertCircle, ArrowUpRight, Clock3, MapPin, Navigation, Radar, ShieldAlert } from 'lucide-react';
import { mockOccurrences, type Occurrence } from '../data/mockOccurrences';
import React from 'react';

function NearbyPage() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [occurrences] = useState<Occurrence[]>(mockOccurrences);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setLocationPermission('granted');
      },
      (error) => {
        console.log('Erro ao obter localizacao:', error);
        setLocationPermission('denied');
      }
    );
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Urgente';
      case 'medium':
        return 'Moderado';
      case 'low':
        return 'Baixa prioridade';
      default:
        return '';
    }
  };

  const openInMaps = (coordinates: [number, number]) => {
    const [lat, lng] = coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full w-full overflow-auto px-4 pb-10 pt-24">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,_rgba(15,23,42,0.97)_0%,_rgba(8,47,73,0.94)_52%,_rgba(6,95,70,0.9)_100%)] p-6 text-white shadow-[0_25px_80px_rgba(15,23,42,0.22)]">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                <Radar className="size-4" />
                Vigilancia local
              </div>
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
                Ocorrencias perto de si, organizadas por distancia, urgencia e contexto.
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
                Use esta vista para identificar rapidamente pedidos de apoio nas proximidades e abrir rotas imediatas para resposta.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <div className="rounded-full border border-white/15 bg-white/8 px-4 py-2">5 ocorrencias monitorizadas</div>
                <div className="rounded-full border border-white/15 bg-white/8 px-4 py-2">2 com prioridade urgente</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-100">Estado</p>
                <p className="mt-2 text-2xl font-semibold">Monitorizacao ativa</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-100">Localizacao</p>
                <p className="mt-2 text-sm text-slate-100">
                  {userLocation ? `${userLocation[0].toFixed(3)}, ${userLocation[1].toFixed(3)}` : 'A aguardar permissao do navegador'}
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-100">Resposta</p>
                <p className="mt-2 text-sm text-slate-100">Rotas externas prontas a abrir a partir de cada cartao.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-6 flex items-center gap-2 text-slate-600">
          <MapPin className="size-4" />
          <p className="text-sm md:text-base">
            {locationPermission === 'granted' ? (
              <span>Mostrando ocorrencias proximas da sua localizacao atual.</span>
            ) : (
              <span className="text-amber-700">Ative a localizacao para ver resultados mais relevantes.</span>
            )}
          </p>
        </div>

        {locationPermission === 'denied' && (
          <div className="mb-6 flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 shadow-sm">
            <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold">Permissao de localizacao negada</p>
              <p className="mt-1 text-sm text-amber-800">
                Permita o acesso nas definicoes do navegador para recalcular automaticamente a distancia ate cada ocorrencia.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {occurrences.map((occurrence) => (
            <div
              key={occurrence.id}
              className="group overflow-hidden rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(14,116,144,0.14)]"
            >
              <div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        <ShieldAlert className="size-3.5" />
                        Incidente #{occurrence.id}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">{occurrence.type}</h3>
                      <p className="mt-1 text-sm text-slate-600">{occurrence.description}</p>
                    </div>
                    <span className={`ml-3 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${getPriorityColor(occurrence.priority)}`}>
                      {getPriorityLabel(occurrence.priority)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                      <MapPin className="size-4 text-cyan-700" />
                      <span>{occurrence.location}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                      <Clock3 className="size-4 text-slate-500" />
                      <span>{occurrence.time}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-2 text-cyan-700">
                      <Navigation className="size-4" />
                      <span>{occurrence.distance} km de distancia</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center lg:min-w-52 lg:justify-end">
                  <button
                    onClick={() => openInMaps(occurrence.coordinates)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(15,23,42,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_22px_42px_rgba(15,23,42,0.32)] focus:outline-none focus:ring-4 focus:ring-slate-300 active:translate-y-0 lg:max-w-[220px]"
                  >
                    <Navigation className="size-4" />
                    Ver rota
                    <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {occurrences.length === 0 && (
          <div className="py-12 text-center">
            <AlertCircle className="mx-auto mb-3 size-12 text-slate-400" />
            <p className="text-slate-600">Nenhuma ocorrencia proxima neste momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NearbyPage;
