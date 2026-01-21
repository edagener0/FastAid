import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
const phoneNumber = import.meta.env.VITE_PHONE_NUMBER;

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const linkClass = "hover:text-blue-400 transition-colors";
  const activeClass = "text-blue-400 font-semibold";

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow">
      <span className="text-xl font-bold tracking-wide">
        FastAid
      </span>

      <div className="text-white">
        <span>{phoneNumber}</span>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <>
            <NavLink to="/" className={({ isActive }) => isActive ? activeClass : linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/mapa" className={({ isActive }) => isActive ? activeClass : linkClass}>
              Mapa
            </NavLink>
            <NavLink to="/ocorrencias" className={({ isActive }) => isActive ? activeClass : linkClass}>
              Ocorrências
            </NavLink>
            <NavLink to="/perfil" className={({ isActive }) => isActive ? activeClass : linkClass}>
              Perfil
            </NavLink>
          </>
        )}

        {user ? (
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded transition"
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink
              to="/registo"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition"
            >
              Registo
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
