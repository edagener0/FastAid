import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between">
      <span className="font-bold text-lg">AI Emergency Operator</span>

      <div className="space-x-4">
        {user && (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/mapa">Mapa</Link>
            <Link to="/ocorrencias">Ocorrências</Link>
            <Link to="/perfil">Perfil</Link>
          </>
        )}

        {user ? (
          <button
            onClick={logout}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/registo"
              className="bg-white text-black px-3 py-1 rounded"
            >
              Registo
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
