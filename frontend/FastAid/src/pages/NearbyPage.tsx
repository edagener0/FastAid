import { AlertCircle, ArrowUpRight, Clock3, MapPin, Navigation, Radar, ShieldAlert } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import React from 'react';

import { useIncidents } from '../hooks/useIncidents';
import { useUserLocation } from '../hooks/useUserLocation';
import { inferDistrictFromCoordinates, inferIncidentDistrict, normalizeText } from '../lib/districts';
import { getPriorityLabel, translateRequestError, translations } from '../lib/i18n';
import {
  calculateDistanceKm,
  formatRelativeTime,
  getIncidentCoordinates,
  getIncidentPriority,
} from '../lib/incidents';
import type { RootOutletContext } from '../types/incidents';

function NearbyPage() {
  const navigate = useNavigate();
  const { language, searchQuery, selectedDistricts } = useOutletContext<RootOutletContext>();
  const { incidents, loading, error, refresh } = useIncidents();
  const { userLocation, locationPermission } = useUserLocation();
  const currentDistrict = inferDistrictFromCoordinates(userLocation);
  const activeDistricts = selectedDistricts.length > 0 ? selectedDistricts : currentDistrict ? [currentDistrict] : [];
  const activeDistrictKeys = new Set(activeDistricts.map((district) => normalizeText(district)));
  const copy = translations[language];
  const localizedError = error ? translateRequestError(language, error) : null;

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

  const enrichedIncidents = incidents
    .filter((incident) => {
      const query = searchQuery.trim().toLowerCase();
      const incidentDistrict = inferIncidentDistrict(incident);

      if (activeDistrictKeys.size > 0 && (!incidentDistrict || !activeDistrictKeys.has(normalizeText(incidentDistrict)))) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [incident.title, incident.description, incident.place ?? '', incident.status]
        .join(' ')
        .toLowerCase()
        .includes(query);
    })
    .map((incident) => {
      const coordinates = getIncidentCoordinates(incident);
      const distance = userLocation && coordinates ? calculateDistanceKm(userLocation, coordinates) : null;

      return {
        incident,
        coordinates,
        distance,
        priority: getIncidentPriority(incident),
      };
    })
    .sort((left, right) => {
      if (left.distance === null && right.distance === null) {
        return right.incident.created_at.localeCompare(left.incident.created_at);
      }

      if (left.distance === null) {
        return 1;
      }

      if (right.distance === null) {
        return -1;
      }

      return left.distance - right.distance;
    });

  return (
    <div className="h-full w-full overflow-auto px-4 pb-10 pt-4 md:pt-6">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 overflow-hidden rounded-[32px] border border-[#f5d6b6] bg-[linear-gradient(145deg,_rgba(105,11,8,0.92)_0%,_rgba(129,28,22,0.88)_44%,_rgba(196,106,13,0.82)_100%)] p-6 text-white shadow-[0_26px_80px_rgba(105,11,8,0.2)]">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f3c989] bg-[rgba(255,248,234,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#fff8ea] shadow-[0_8px_24px_rgba(105,11,8,0.12)]">
                <Radar className="size-4" />
                {copy.localMonitoring}
              </div>
              <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
                {copy.nearbyTitle}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[#fff2e8] md:text-base">{copy.nearbyDescription}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <div className="rounded-full border border-white/15 bg-white/8 px-4 py-2">{copy.monitoredIncidents(enrichedIncidents.length)}</div>
                <div className="rounded-full border border-white/15 bg-white/8 px-4 py-2">
                  {copy.urgentPriorityCount(enrichedIncidents.filter((item) => item.priority === 'high').length)}
                </div>
              </div>
            </div>
          </div>
        </section>


        {locationPermission === 'denied' && (
          <div className="mb-6 flex items-start gap-3 rounded-3xl border border-[#f5d6b6] bg-[#fff2df] p-4 text-[#7a300d] shadow-sm">
            <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-[#c46a0d]" />
            <div>
              <p className="font-semibold">{copy.locationDenied}</p>
              <p className="mt-1 text-sm text-[#9a4e1a]">{copy.locationDeniedDescription}</p>
            </div>
          </div>
        )}

        {localizedError && (
          <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-red-200 bg-red-50/90 p-4 text-red-900 shadow-sm sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-semibold">{copy.loadingIncidentsError}</p>
                <p className="mt-1 text-sm text-red-800">{localizedError}</p>
              </div>
            </div>
            <button onClick={() => void refresh()} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-700">
              {copy.retry}
            </button>
          </div>
        )}

        <div className="grid gap-4">
          {loading && (
            <div className="rounded-[28px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.88)] p-5 text-sm text-[#7d3f32] shadow-[0_18px_55px_rgba(105,11,8,0.08)]">
              {copy.loadingLiveIncidents}
            </div>
          )}

          {enrichedIncidents.map(({ incident, coordinates, distance, priority }) => (
            <div
              key={incident.id}
              className="group overflow-hidden rounded-[28px] border border-[#f0d0b6] bg-[rgba(255,251,244,0.88)] shadow-[0_18px_55px_rgba(105,11,8,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(171,0,0,0.14)]"
            >
              <div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#fff1dc] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#9b5c47]">
                        <ShieldAlert className="size-3.5" />
                        {copy.incidentLabel(incident.id.slice(0, 8))}
                      </div>
                      <h3 className="text-xl font-semibold text-[#5c1b16]">{incident.title}</h3>
                      <p className="mt-1 text-sm text-[#7d3f32]">{incident.description}</p>
                    </div>
                    <span className={`self-start whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium sm:ml-3 ${getPriorityColor(priority)}`}>
                      {getPriorityLabel(language, priority)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#7d3f32]">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#fff1dc] px-3 py-2">
                      <MapPin className="size-4 text-[#ab0000]" />
                      <span>{incident.place ?? copy.unknownLocation}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#fff1dc] px-3 py-2">
                      <Clock3 className="size-4 text-[#9b5c47]" />
                      <span>{formatRelativeTime(incident.created_at, language)}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#fdd604]/20 px-3 py-2 text-[#8a320c]">
                      <Navigation className="size-4" />
                      <span>{distance !== null ? copy.distanceAway(distance) : copy.unavailableDistance}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:min-w-52 lg:justify-end">
                  <button
                    onClick={() => navigate(`/${incident.id}`)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#e7b77d] bg-[linear-gradient(180deg,_#fffaf0_0%,_#ffe9cf_100%)] px-5 py-3 text-sm font-semibold text-[#690b08] shadow-[0_14px_30px_rgba(171,0,0,0.12)] transition duration-200 hover:-translate-y-0.5 hover:border-[#d89a52] hover:bg-[linear-gradient(180deg,_#fff6e6_0%,_#ffdfba_100%)] hover:shadow-[0_20px_38px_rgba(171,0,0,0.16)] sm:w-auto lg:max-w-[220px]"
                  >
                    {copy.viewDetails}
                    <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && enrichedIncidents.length === 0 && (
          <div className="py-12 text-center">
            <AlertCircle className="mx-auto mb-3 size-12 text-slate-400" />
            <p className="text-slate-600">{copy.noNearbyIncidents}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NearbyPage;
