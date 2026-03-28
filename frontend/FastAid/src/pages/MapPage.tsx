import { AlertCircle, Clock3 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';

import Map from './Map.tsx';

import { useIncidents } from '../hooks/useIncidents';
import { formatRelativeTime, getIncidentCoordinates } from '../lib/incidents';

function MapPage() {
  const navigate = useNavigate();
  const { incidents, loading, error, refresh } = useIncidents();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const visibleIncidents = incidents.filter((incident) => {

    return [incident.title, incident.description, incident.place ?? '', incident.status]
      .join(' ')
      .toLowerCase()
  });

  const incidentsWithCoordinates = visibleIncidents.filter((incident) => getIncidentCoordinates(incident));
  const highlightedIncidents = visibleIncidents.slice(0, 4);

  return (
    <div className="relative h-full w-full">
  

      <div className="h-full w-full">
        <Map incidents={incidentsWithCoordinates} selectedIncidentId={selectedIncidentId} />
      </div>

      <div className="absolute inset-x-4 bottom-4 z-[900] mx-auto max-w-6xl">
        {loading && (
          <div className="rounded-[28px] border border-white/80 bg-white/82 px-5 py-4 text-sm text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            A carregar incidentes...
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
