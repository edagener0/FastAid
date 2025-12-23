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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />

          <input
            type="email"
            className="border p-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            className="border p-2 rounded"
            placeholder="Telefone"
            value={form.telefone}
            onChange={(e) =>
              setForm({ ...form, telefone: e.target.value })
            }
          />

          <select
            className="border p-2 rounded"
            value={form.profissao}
            onChange={(e) =>
              setForm({ ...form, profissao: e.target.value })
            }
          >
            <option value="POLICIA">Polícia</option>
            <option value="BOMBEIROS">Bombeiros</option>
            <option value="INEM">INEM</option>
            <option value="PROTECAO_CIVIL">Proteção Civil</option>
          </select>

          <select
            className="border p-2 rounded"
            value={form.area_preferencia}
            onChange={(e) =>
              setForm({ ...form, area_preferencia: e.target.value })
            }
          >
            <option>Lisboa</option>
            <option>Porto</option>
            <option>Braga</option>
            <option>Aveiro</option>
          </select>

          <input
            type="password"
            className="border p-2 rounded"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="bg-green-700 text-white py-2 rounded hover:bg-green-800"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
}