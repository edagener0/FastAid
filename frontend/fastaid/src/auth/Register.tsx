import { useState, type FormEvent } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface RegisterForm {
  username: string;
  email: string;
  telefone: string;
  profissao: string;
  area_preferencia: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    telefone: "",
    profissao: "BOMBEIROS",
    area_preferencia: "Lisboa",
    password: "",
  });

  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/users/register/", form);
      navigate("/login");
    } catch {
      setError("Erro ao criar conta.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">
          Registo de Operador
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <input
            type="email"
            className="border p-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded"
            placeholder="Telefone"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />

          <label className="text-sm font-semibold text-gray-700 -mb-2">Profissão</label>
          <select
            className="border p-2 rounded"
            value={form.profissao}
            onChange={(e) => setForm({ ...form, profissao: e.target.value })}
          >
            <option value="POLICIA">Polícia</option>
            <option value="BOMBEIROS">Bombeiros</option>
            <option value="INEM">INEM</option>
            <option value="PROTECAO_CIVIL">Proteção Civil</option>
          </select>

          <label className="text-sm font-semibold text-gray-700 -mb-2">Distrito / Área de Preferência</label>
          <select
            className="border p-2 rounded"
            value={form.area_preferencia}
            onChange={(e) => setForm({ ...form, area_preferencia: e.target.value })}
          >
            <option value="Aveiro">Aveiro</option>
            <option value="Beja">Beja</option>
            <option value="Braga">Braga</option>
            <option value="Bragança">Bragança</option>
            <option value="Castelo Branco">Castelo Branco</option>
            <option value="Coimbra">Coimbra</option>
            <option value="Évora">Évora</option>
            <option value="Faro">Faro</option>
            <option value="Guarda">Guarda</option>
            <option value="Leiria">Leiria</option>
            <option value="Lisboa">Lisboa</option>
            <option value="Portalegre">Portalegre</option>
            <option value="Porto">Porto</option>
            <option value="Santarém">Santarém</option>
            <option value="Setúbal">Setúbal</option>
            <option value="Viana do Castelo">Viana do Castelo</option>
            <option value="Vila Real">Vila Real</option>
            <option value="Viseu">Viseu</option>
            <option value="Açores">Açores</option>
            <option value="Madeira">Madeira</option>
          </select>

          <input
            type="password"
            className="border p-2 rounded"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            className="bg-green-700 text-white py-2 rounded mt-2 hover:bg-green-800 transition-colors"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
}