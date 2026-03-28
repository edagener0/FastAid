import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

import { languageLabels, translations } from '../lib/i18n';
import type { Language } from '../types/incidents';

const emergencyPhone = import.meta.env.VITE_EMERGENCY_PHONE?.trim() || '+17657895548';
const getDocumentLanguage = (): Language =>
  document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt';

function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState<Language>(getDocumentLanguage);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const isNearbyPage = location.pathname === '/perto-de-si';
  const isMapPage = location.pathname === '/';
  const copy = translations[language];

  useEffect(() => {
    const syncLanguage = () => {
      setLanguage((current) => {
        const nextLanguage = getDocumentLanguage();
        return current === nextLanguage ? current : nextLanguage;
      });
    };

    const observer = new MutationObserver(syncLanguage);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });

    window.addEventListener('focus', syncLanguage);
    document.addEventListener('visibilitychange', syncLanguage);

    return () => {
      observer.disconnect();
      window.removeEventListener('focus', syncLanguage);
      document.removeEventListener('visibilitychange', syncLanguage);
    };
  }, []);

  const handleLanguageChange = (nextLanguage: Language) => {
    document.documentElement.lang = nextLanguage;
    setLanguage(nextLanguage);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(253,214,4,0.2),_transparent_30%),radial-gradient(circle_at_18%_18%,_rgba(171,0,0,0.15),_transparent_22%),linear-gradient(180deg,_#fff8ea_0%,_#fff1dc_100%)]">
      <nav className="fixed left-1/2 top-3 z-[1000] w-[95%] max-w-6xl -translate-x-1/2 md:top-5">
        <div className="flex items-center gap-3 rounded-[28px] border border-[#f2d6bf] bg-[rgba(255,250,242,0.84)] px-3 py-3 shadow-[0_22px_70px_rgba(105,11,8,0.16)] backdrop-blur-xl md:px-5">
          <div className="flex min-w-0 flex-1 items-center justify-center md:justify-start md:max-w-sm">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 rounded-2xl px-2 py-1 text-center md:text-left"
            >
              <span className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl px-2 py-1 md:h-18 md:w-28">
                <img src="/fastaid.svg" alt="FastAid" className="h-full w-full scale-110 object-contain" />
              </span>
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.28em] text-[#811c16]">FastAid</span>
              </span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 md:flex-1">
            <button
              onClick={() => navigate('/')}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isMapPage ? 'bg-[#690b08] text-white shadow-lg shadow-[#690b08]/20' : 'text-[#7d3f32] hover:bg-[#fff1dc]'
              }`}
            >
              {copy.navMap}
            </button>
            <button
              onClick={() => navigate('/perto-de-si')}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isNearbyPage ? 'bg-[#fdd604] text-[#690b08] shadow-lg shadow-[#fdd604]/30' : 'text-[#7d3f32] hover:bg-[#fff1dc]'
              }`}
            >
              {copy.navNearby}
            </button>
            <a
              href={`tel:${emergencyPhone}`}
              className="inline-flex items-center gap-3 rounded-[20px] border border-[#f2d6bf] bg-[rgba(255,252,247,0.92)] px-3 py-2 text-left text-[#6b2a1e] shadow-[0_16px_35px_rgba(105,11,8,0.1)] backdrop-blur-xl transition hover:bg-white"
              aria-label={`${copy.emergencyLine} ${emergencyPhone}`}
            >
              <span className="grid size-9 place-items-center rounded-full bg-[#fff1dc] text-[#ab0000]">
                <Phone className="size-4" />
              </span>
              <span className="hidden sm:block">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b07c57]">
                  {copy.emergencyLine}
                </span>
                <span className="block text-sm font-semibold text-[#690b08]">{emergencyPhone}</span>
              </span>
              <span className="text-sm font-semibold text-[#690b08] sm:hidden">{emergencyPhone}</span>
            </a>
          </div>

          <div className="ml-auto flex items-center rounded-full border border-[#f2d6bf] bg-[rgba(255,248,234,0.92)] p-1 shadow-sm backdrop-blur-xl">
            {(Object.keys(languageLabels) as Language[]).map((nextLanguage) => (
              <button
                key={nextLanguage}
                type="button"
                onClick={() => handleLanguageChange(nextLanguage)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  language === nextLanguage ? 'bg-[#690b08] text-white shadow-sm' : 'text-[#7d3f32] hover:text-[#690b08]'
                }`}
                aria-pressed={language === nextLanguage}
              >
                {languageLabels[nextLanguage]}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <Outlet context={{ searchQuery: '', language, selectedDistricts, setSelectedDistricts }} />
    </div>
  );
}

export default Root;
