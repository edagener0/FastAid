import { useEffect, useState, useContext, type ChangeEvent } from "react";
import api from "../api/axios";
import { type Ocorrencia as OcorrenciaType, type Operador } from "../types/Ocorrencia";
import { AuthContext } from "../auth/AuthContext";

export default function Ocorrencias() {
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaType[]>([]);
  const [selected, setSelected] = useState<OcorrenciaType | null>(null);
  const [editModal, setEditModal] = useState<OcorrenciaType | null>(null);
  const [editForm, setEditForm] = useState<OcorrenciaType | null>(null);
  const { user } = useContext(AuthContext);

  // Carregar ocorrências do backend
  const fetchOcorrencias = () => {
    api.get("/incidents/")
      .then(res => setOcorrencias(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchOcorrencias();
  }, []);

  // Join / Leave
  const handleJoin = (id: number) => {
    api.post(`/incidents/${id}/join/`)
      .then(res => {
        const updated = res.data;
        setOcorrencias(prev => prev.map(o => o.id === id ? updated : o));
        if (selected?.id === id) setSelected(updated);
      })
      .catch(err => console.error(err));
  };

  const handleLeave = (id: number) => {
    api.post(`/incidents/${id}/leave/`)
      .then(res => {
        const updated = res.data;
        setOcorrencias(prev => prev.map(o => o.id === id ? updated : o));
        if (selected?.id === id) setSelected(updated);
      })
      .catch(err => console.error(err));
};


  // Edição de incidente
  const handleEditarClick = (o: OcorrenciaType) => {
    setEditForm({ ...o });
    setEditModal(o);
  };

  const handleChange = (field: keyof OcorrenciaType, value: string | number | Operador[]) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
  };

  const handleSave = () => {
    if (!editForm) return;
    api.patch(`/incidents/${editForm.id}/update/`, {
      titulo: editForm.titulo,
      descricao: editForm.descricao,
      tipo: editForm.tipo,
      estado: editForm.estado,
      distrito: editForm.distrito,
      latitude: editForm.latitude,
      longitude: editForm.longitude
    }).then(res => {
      const updated = res.data;
      setOcorrencias(prev => prev.map(o => o.id === updated.id ? updated : o));
      if (selected?.id === updated.id) setSelected(updated);
      setEditModal(null);
      setEditForm(null);
    }).catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ocorrências</h1>

      <div className="space-y-4">
        {ocorrencias.map(o => {
          console.log(user)
          console.log(o.operadores)
          const isJoined = o.operadores.some(op => op.id === Number(user?.user_id));

          return (
            <div
              key={o.id}
              onClick={() => setSelected(o)}
              className="cursor-pointer bg-white shadow rounded p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <span className="font-semibold">{o.titulo}</span>
                <span className="text-sm text-gray-500">{o.estado}</span>
              </div>
              <p className="text-sm text-gray-600">{o.distrito} • {new Date(o.criado_em).toLocaleString()}</p>

              <div className="flex gap-2 pt-2">
                {!isJoined ? (
                  <button
                    onClick={e => { e.stopPropagation(); handleJoin(o.id); }}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Juntar-me
                  </button>
                ) : (
                  <button
                    onClick={e => { e.stopPropagation(); handleLeave(o.id); }}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Sair
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de detalhes */}
      {selected && !editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">{selected.titulo}</h2>
            <p><strong>Tipo:</strong> {selected.tipo}</p>
            <p><strong>Distrito:</strong> {selected.distrito}</p>
            <p><strong>Estado:</strong> {selected.estado}</p>
            <p><strong>Latitude:</strong> {selected.latitude}</p>
            <p><strong>Longitude:</strong> {selected.longitude}</p>
            <p><strong>Descrição:</strong> {selected.descricao}</p>

            <div>
              <strong>Operadores:</strong>
              <ul className="list-disc list-inside">
                {selected.operadores.map(op => (
                  <li key={op.id}>{op.username} ({op.profissao})</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Fechar
              </button>
              <button
                onClick={() => handleEditarClick(selected)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {editModal && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-16 z-50 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Editar Ocorrência</h2>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold">Tipo:</label>
                <input
                  type="text"
                  value={editForm.tipo}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("tipo", e.target.value)}
                  className="w-full border rounded px-3 py-1"
                />
              </div>

              <div>
                <label className="block font-semibold">Distrito:</label>
                <input
                  type="text"
                  value={editForm.distrito}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("distrito", e.target.value)}
                  className="w-full border rounded px-3 py-1"
                />
              </div>

              <div>
                <label className="block font-semibold">Estado:</label>
                <select
                  value={editForm.estado}
                  onChange={(e) => handleChange("estado", e.target.value)}
                  className="w-full border rounded px-3 py-1"
                >
                  <option>ABERTA</option>
                  <option>EM_CURSO</option>
                  <option>RESOLVIDA</option>
                  <option>CANCELADA</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold">Descrição:</label>
                <textarea
                  value={editForm.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                  className="w-full border rounded px-3 py-1"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => { setEditModal(null); setEditForm(null); }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
