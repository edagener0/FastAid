import { useLocation, useNavigate, Outlet } from 'react-router-dom';

function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const isNearbyPage = location.pathname === '/perto-de-si';
  const isMapPage = location.pathname === '/';

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#eff4fb_100%)]">
      <nav className="fixed left-1/2 top-3 z-[1000] w-[95%] max-w-6xl -translate-x-1/2 md:top-5">
        <div className="flex items-center gap-3 rounded-[28px] border border-white/65 bg-white/72 px-3 py-3 shadow-[0_22px_70px_rgba(15,23,42,0.14)] backdrop-blur-xl md:px-5">
          <div className="flex min-w-0 flex-1 items-center justify-center md:justify-start md:max-w-xs">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 rounded-2xl px-2 py-1 text-center transition hover:bg-slate-100 md:text-left"
            >
              <span className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-cyan-500/20">
                <img src="/fastaid.svg" alt="icon" className="size-10" />
              </span>
              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">FastAid</span>
              </span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 md:flex-1">
            <button
              onClick={() => navigate('/')}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isMapPage ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/15' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Mapa
            </button>
            <button
              onClick={() => navigate('/perto-de-si')}
              className={`rounded-full px-4 py-2 text-sm transition ${
                isNearbyPage ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Perto de si
            </button>
          </div>
        </div>
      </nav>
      <Outlet context={{ searchQuery: '' }} />
    </div>
  );
}

export default Root;
