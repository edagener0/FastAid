import { useState, useContext, useEffect, type FormEvent } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 🔹 Redireciona para dashboard se já estiver logado
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
      navigate("/"); // redireciona após login
    } catch {
      setError("Credenciais inválidas.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
