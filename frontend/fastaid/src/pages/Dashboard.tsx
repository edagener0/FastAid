function Card({ title, value }: { title: string; value: string }) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-gray-600">{title}</h3>
        <p className="text-3xl font-bold text-blue-700">{value}</p>
      </div>
    );
  }
  
  export default function Dashboard() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Ocorrências Ativas" value="12" />
        <Card title="Alta Prioridade" value="4" />
        <Card title="Operacionais Disponíveis" value="27" />
      </div>
    );
  }
  