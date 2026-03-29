import { useEffect, useRef, useState } from 'react';
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
  const navRef = useRef<HTMLElement | null>(null);
  const [contentOffset, setContentOffset] = useState(0);
  const isNearbyPage = location.pathname === '/perto-de-si';
  const isMapPage = location.pathname === '/';
  const isStatisticsPage = location.pathname === '/statistics';
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

  useEffect(() => {
    const updateOffset = () => {
      const navHeight = navRef.current?.offsetHeight ?? 0;
      setContentOffset(navHeight + 16);
    };

    updateOffset();

    const resizeObserver = new ResizeObserver(updateOffset);
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    window.addEventListener('resize', updateOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateOffset);
    };
  }, [language]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(253,214,4,0.2),_transparent_30%),radial-gradient(circle_at_18%_18%,_rgba(171,0,0,0.15),_transparent_22%),linear-gradient(180deg,_#fff8ea_0%,_#fff1dc_100%)]">
      <nav ref={navRef} className="app-navbar fixed left-1/2 top-2 z-[1000] w-[95%] max-w-6xl -translate-x-1/2 md:top-4">
        <div
          className={`app-navbar-inner flex flex-col gap-3 rounded-[28px] px-3 py-3 backdrop-blur-xl md:px-5 lg:flex-row lg:items-center ${
            isMapPage
              ? 'border-transparent bg-transparent shadow-none'
              : 'border border-[#f2d6bf] bg-transparent shadow-[0_22px_70px_rgba(105,11,8,0.16)]'
          }`}
        >
          <div className="app-navbar-brand-row flex min-w-0 items-center justify-between gap-3 lg:flex-1 lg:justify-start lg:max-w-sm">
            <button
              onClick={() => navigate('/')}
              className="app-navbar-brand flex min-w-0 items-center gap-3 rounded-2xl px-2 py-1 text-left"
            >
              <span className="app-navbar-logo grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl px-2 py-1 sm:h-16 sm:w-24 md:h-18 md:w-28">
                <img src="/fastaid.svg" alt="FastAid" className="h-full w-full scale-110 object-contain" />
              </span>
              <span className="min-w-0">
                <span className="app-navbar-title block truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[#811c16] sm:text-sm sm:tracking-[0.28em]">
                  FastAid
                </span>
              </span>
            </button>

            <div className="app-navbar-lang-mobile flex items-center rounded-full border border-[#f2d6bf] bg-[rgba(255,248,234,0.92)] p-1 shadow-sm backdrop-blur-xl lg:hidden">
              {(Object.keys(languageLabels) as Language[]).map((nextLanguage) => (
                <button
                  key={nextLanguage}
                  type="button"
                  onClick={() => handleLanguageChange(nextLanguage)}
                  className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
                    language === nextLanguage ? 'bg-[#690b08] text-white shadow-sm' : 'text-[#7d3f32] hover:text-[#690b08]'
                  }`}
                  aria-pressed={language === nextLanguage}
                >
                  {languageLabels[nextLanguage]}
                </button>
              ))}
            </div>
          </div>

          <div className="app-navbar-actions grid gap-2 lg:flex lg:flex-1 lg:items-center lg:justify-end">
            <div className="app-navbar-links grid grid-cols-3 gap-2 lg:flex lg:items-center lg:justify-end">
              <button
                onClick={() => navigate('/')}
                className={`rounded-full px-2 py-2 text-center text-[11px] font-medium transition sm:px-4 sm:text-sm ${
                  isMapPage ? 'bg-[#690b08] text-white shadow-lg shadow-[#690b08]/20' : 'text-[#7d3f32] hover:bg-[#fff1dc]'
                }`}
              >
                {copy.navMap}
              </button>
            <button
              onClick={() => navigate('/perto-de-si')}
              className={`rounded-full px-2 py-2 text-center text-[11px] font-medium transition sm:px-4 sm:text-sm ${
                isNearbyPage ? 'bg-[#690b08] text-white shadow-lg shadow-[#690b08]/20' : 'text-[#7d3f32] hover:bg-[#fff1dc]'
              }`}
            >
              {copy.navNearby}
              </button>
              <button
                onClick={() => navigate('/statistics')}
                className={`rounded-full px-2 py-2 text-center text-[11px] font-medium transition sm:px-4 sm:text-sm ${
                  isStatisticsPage ? 'bg-[#811c16] text-white shadow-lg shadow-[#811c16]/25' : 'text-[#7d3f32] hover:bg-[#fff1dc]'
                }`}
              >
                {copy.navStatistics}
              </button>
            </div>

            <a
              href={`tel:${emergencyPhone}`}
              className="app-navbar-phone inline-flex w-full items-center justify-center gap-3 rounded-[20px] border border-[#f2d6bf] bg-[rgba(255,252,247,0.92)] px-3 py-2 text-left text-[#6b2a1e] shadow-[0_16px_35px_rgba(105,11,8,0.1)] backdrop-blur-xl transition hover:bg-white lg:w-auto"
              aria-label={`${copy.emergencyLine} ${emergencyPhone}`}
            >
              <span className="grid size-8 place-items-center rounded-full bg-[#fff1dc] text-[#ab0000] sm:size-9">
                <Phone className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b07c57] sm:text-[10px] sm:tracking-[0.22em]">
                  {copy.emergencyLine}
                </span>
                <span className="block truncate text-xs font-semibold text-[#690b08] sm:text-sm">{emergencyPhone}</span>
              </span>
            </a>
          </div>

          <div className="app-navbar-lang-desktop ml-auto hidden items-center rounded-full border border-[#f2d6bf] bg-[rgba(255,248,234,0.92)] p-1 shadow-sm backdrop-blur-xl lg:flex">
            {(Object.keys(languageLabels) as Language[]).map((nextLanguage) => (
              <button
                key={nextLanguage}
                type="button"
                onClick={() => handleLanguageChange(nextLanguage)}
                className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
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
      <div className="h-full" style={isMapPage ? undefined : { paddingTop: `${contentOffset}px` }}>
        <Outlet context={{ searchQuery: '', language, selectedDistricts, setSelectedDistricts, contentOffset }} />
      </div>
    </div>
  );
}

export default Root;
