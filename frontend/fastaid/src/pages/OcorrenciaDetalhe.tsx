import { useParams } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import api from "../api/axios"
import { type Ocorrencia } from "../types/Ocorrencia"
import { AuthContext } from "../auth/AuthContext"

export default function OcorrenciaDetalhe() {
  const { id } = useParams()
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api.get(`/incidents/${id}/`)
      .then(res => setOcorrencia(res.data))
      .catch(err => console.error(err))
  }, [id])
  if (!ocorrencia) {
    return <p className="p-6">Ocorrência não encontrada.</p>
  }

  const isJoined = ocorrencia.operadores.some( 
    op => op.username === user?.username
  )

  const updateEstado = (estado: string) => {
    api.patch(`/incidents/${id}/update/`, { estado })
      .then(res => setOcorrencia(res.data))
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">{ocorrencia.titulo}</h1>

      <div className="bg-white shadow rounded p-4 space-y-3">
        <p><strong>Descrição:</strong> {ocorrencia.descricao}</p>
        <p><strong>Distrito:</strong> {ocorrencia.distrito}</p>
        <p><strong>Estado:</strong> {ocorrencia.estado}</p>

        <div>
          <strong>Operadores:</strong>
          <ul className="list-disc list-inside">
            {ocorrencia.operadores.map(op => (
              <li key={op.id}>
                {op.username} ({op.profissao})
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 pt-3">
          {!isJoined ? (
            <button
              onClick={() => api.post(`/incidents/${id}/join/`).then(() => window.location.reload())}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Juntar-me
            </button>
          ) : (
            <button
              onClick={() => api.post(`/incidents/${id}/leave/`).then(() => window.location.reload())}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Sair
            </button>
          )}

          <button
            onClick={() => updateEstado("EM_CURSO")}
            className="px-3 py-1 bg-yellow-600 text-white rounded"
          >
            Marcar em curso
          </button>

          <button
            onClick={() => updateEstado("RESOLVIDA")}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Resolver
          </button>
        </div>
      </div>
    </div>
  )
}
