export default function Ocorrencias() {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Ocorrências</h2>
  
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th>Tipo</th>
              <th>Local</th>
              <th>Prioridade</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td>Incêndio</td>
              <td>Lisboa</td>
              <td className="text-red-600">Alta</td>
              <td>Em curso</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  