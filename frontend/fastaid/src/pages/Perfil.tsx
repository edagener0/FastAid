import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

type PerfilType = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  telefone: string;
  profissao: string;
  area_preferencia: string;
};

export default function Perfil() {
  const { user } = useContext(AuthContext);
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    api.get(`/users/operadores/${user.user_id}/`)
      .then(res => setPerfil(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <p className="p-6 text-gray-500">Carregando perfil...</p>;
  }

  if (!perfil) {
    return <p className="p-6 text-red-500">Não foi possível carregar o perfil.</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {/* Header com avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {perfil.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{perfil.username}</h2>
          <p className="text-gray-500">{perfil.profissao} – {perfil.area_preferencia}</p>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="space-y-2">
        {perfil.first_name && <p><strong>Nome:</strong> {perfil.first_name} {perfil.last_name}</p>}
        {perfil.telefone && <p><strong>Telefone:</strong> {perfil.telefone}</p>}
        <p><strong>Profissão:</strong> {perfil.profissao}</p>
        <p><strong>Área de preferência:</strong> {perfil.area_preferencia}</p>
      </div>
    </div>
  );
}
