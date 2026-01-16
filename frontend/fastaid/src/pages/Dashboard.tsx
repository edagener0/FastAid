import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  AlertTriangle,
  Activity,
  CheckCircle,
  XCircle,
  Users
} from "lucide-react";

type Ocorrencia = {
  id: number;
  estado: "ABERTA" | "EM_CURSO" | "RESOLVIDA" | "CANCELADA";
  operadores: { id: number }[];
};

type Operador = {
  id: number;
};

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);

  useEffect(() => {
    Promise.all([
      api.get("/incidents/"),
      api.get("/users/operadores/"),
    ])
      .then(([incRes, opRes]) => {
        setOcorrencias(incRes.data);
        setOperadores(opRes.data);
      })
      .catch(console.error);
  }, []);

  // Contagem de estados (normaliza maiúsculas)
  const countEstado = (estado: string) =>
    ocorrencias.filter(o => o.estado?.toUpperCase() === estado.toUpperCase()).length;

  // IDs de operadores ocupados
  const operadoresOcupados = new Set(
    ocorrencias.flatMap(o => o.operadores.map(op => (typeof op === "number" ? op : op.id)))
  );

  // Operadores que não estão em nenhuma ocorrência
  const operadoresDisponiveis = operadores.filter(op => !operadoresOcupados.has(op.id)).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Ocorrências Abertas"
          value={countEstado("ABERTA")}
          icon={<AlertTriangle className="text-white" />}
          color="bg-red-500"
        />

        <StatCard
          title="Em Curso"
          value={countEstado("EM_CURSO")}
          icon={<Activity className="text-white" />}
          color="bg-yellow-500"
        />

        <StatCard
          title="Resolvidas"
          value={countEstado("RESOLVIDA")}
          icon={<CheckCircle className="text-white" />}
          color="bg-green-500"
        />

        <StatCard
          title="Canceladas"
          value={countEstado("CANCELADA")}
          icon={<XCircle className="text-white" />}
          color="bg-gray-500"
        />

        <StatCard
          title="Operacionais Disponíveis"
          value={operadoresDisponiveis}
          icon={<Users className="text-white" />}
          color="bg-blue-600"
        />
      </div>
    </div>
  );
}
