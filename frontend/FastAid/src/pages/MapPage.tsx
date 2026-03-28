import { AlertCircle, MapPinned, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import simplemapsDistricts from '../data/simplemapsDistricts.json';
import { useIncidents } from '../hooks/useIncidents';
import { useUserLocation } from '../hooks/useUserLocation';
import { getIncidentCoordinates } from '../lib/incidents';
import { inferDistrictFromCoordinates, inferIncidentDistrict, normalizeText } from '../lib/districts';
import { translations } from '../lib/i18n';
import type { RootOutletContext } from '../types/incidents';
import IncidentMap from './Map.tsx';

function MapPage() {
  const { incidents, loading, error, refresh } = useIncidents();
  const { language, selectedDistricts, setSelectedDistricts } = useOutletContext<RootOutletContext>();
  const { userLocation, locationPermission } = useUserLocation();
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isDistrictMenuOpen, setIsDistrictMenuOpen] = useState(false);
  const districtMenuRef = useRef<HTMLDivElement | null>(null);
  const currentDistrict = inferDistrictFromCoordinates(userLocation);
  const activeDistricts = selectedDistricts.length > 0 ? selectedDistricts : currentDistrict ? [currentDistrict] : [];
  const copy = translations[language];

  const selectedDistrictKeys = useMemo(
    () => new Set(activeDistricts.map((district) => normalizeText(district))),
    [activeDistricts],
  );

  useEffect(() => {
    if (!isDistrictMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!districtMenuRef.current?.contains(event.target as Node)) {
        setIsDistrictMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isDistrictMenuOpen]);

  const toggleDistrict = (districtName: string) => {
    const districtKey = normalizeText(districtName);

    setSelectedDistricts((current) =>
      current.some((value) => normalizeText(value) === districtKey)
        ? current.filter((value) => normalizeText(value) !== districtKey)
        : [...current, districtName],
    );
    setSelectedIncidentId(null);
  };

  const selectAllDistricts = () => {
    setSelectedDistricts(simplemapsDistricts.map((district) => district.name));
    setSelectedIncidentId(null);
  };

  const visibleIncidents = incidents.filter((incident) => {
    if (activeDistricts.length === 0) {
      return true;
    }

    const incidentDistrict = inferIncidentDistrict(incident);
    return incidentDistrict ? selectedDistrictKeys.has(normalizeText(incidentDistrict)) : false;
  });

  const incidentsWithCoordinates = visibleIncidents.filter((incident) => getIncidentCoordinates(incident));

  return (
    <div className="relative h-full w-full">
      <div className="h-full w-full">
        <IncidentMap incidents={incidentsWithCoordinates} language={language} selectedIncidentId={selectedIncidentId} />
      </div>

      <div className="absolute bottom-[7.1rem] right-[0.9rem] z-[950]" ref={districtMenuRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDistrictMenuOpen((current) => !current)}
            className="grid size-14 place-items-center rounded-2xl border border-white/80 bg-white/92 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.15)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
            aria-label={copy.districtFilterAria}
          >
            <MapPinned className="size-5 text-cyan-700" />
          </button>

          <div
            className={`absolute bottom-[calc(100%+0.75rem)] right-0 w-[20rem] overflow-hidden rounded-[26px] border border-white/90 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] transition-all duration-300 ${
              isDistrictMenuOpen
                ? 'pointer-events-auto translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-8 opacity-0'
            }`}
          >
            <div className="border-b border-slate-200/80 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {copy.districtPanelEyebrow}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{copy.districtPanelDescription}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDistrictMenuOpen(false)}
                  className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                  aria-label={copy.districtPanelCloseAria}
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="rounded-[22px] border border-slate-200 bg-white p-3">
                <div className="mx-auto aspect-[760/1180] w-full max-w-[13rem]">
                  <svg
                    viewBox="0 0 104 265"
                    className="h-full w-full"
                    role="img"
                    aria-label={copy.portugalDistrictMapAria}
                  >
                    <defs>
                      <filter id="district-map-shadow" x="-20%" y="-10%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#111827" floodOpacity="0.22" />
                      </filter>
                    </defs>
                    <g filter="url(#district-map-shadow)" transform="translate(-838 -18)">
                      {simplemapsDistricts.map((district) => {
                        const districtKey = normalizeText(district.name);
                        const isSelected = selectedDistrictKeys.has(districtKey);

                        return (
                          <path
                            key={district.id}
                            d={district.path}
                            role="button"
                            tabIndex={0}
                            aria-label={copy.districtFilterAriaLabel(district.name)}
                            aria-pressed={isSelected}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => toggleDistrict(district.name)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                toggleDistrict(district.name);
                              }
                            }}
                            className="cursor-pointer transition-colors duration-200"
                            fill={isSelected ? '#bfdbfe' : '#ffffff'}
                            fillOpacity={1}
                            stroke={isSelected ? '#2563eb' : '#3f3f46'}
                            strokeWidth={isSelected ? 5 : 3.2}
                            strokeLinejoin="round"
                            pointerEvents="all"
                          >
                            <title>{district.name}</title>
                          </path>
                        );
                      })}
                    </g>
                  </svg>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">{copy.visibleIncidents(incidentsWithCoordinates.length, activeDistricts.length)}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllDistricts}
                    className="rounded-full bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
                  >
                    {copy.selectAll}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDistricts([]);
                      setSelectedIncidentId(null);
                    }}
                    className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    {copy.clear}
                  </button>
                </div>
              </div>
              {locationPermission === 'granted' && currentDistrict && (
                <p className="mt-3 text-xs font-medium text-cyan-700">
                  {selectedDistricts.length > 0
                    ? copy.locationUsesSelection(currentDistrict)
                    : copy.locationAutoDistrict(currentDistrict)}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="absolute inset-x-4 bottom-4 z-[900] mx-auto max-w-6xl">
        {loading && (
          <div className="rounded-[28px] border border-white/80 bg-white/82 px-5 py-4 text-sm text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            {copy.loadingIncidents}
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
                {copy.retry}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;
