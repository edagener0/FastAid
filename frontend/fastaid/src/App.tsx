import {BrowserRouter,Routes,Route} from "react-router-dom";
import {AuthProvider} from "./auth/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./auth/Login";
import Register from "./auth/Register";

import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import Ocorrencias from "./pages/Ocorrencias";
import OcorrenciaDetalhe from "./pages/OcorrenciaDetalhe";
import Perfil from "./pages/Perfil";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar/>
        <main className="min-h-screen bg-gray-100 p-6">
          <Routes>

            {/* Rotas Públicas */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/registo" element={<Register/>}/>

            {/* Rotas Protegidas */}
            <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
            <Route path="/mapa" element={<ProtectedRoute><MapView/></ProtectedRoute>}/>
            <Route path="/ocorrencias" element={<ProtectedRoute><Ocorrencias/></ProtectedRoute>}/>
            <Route path="/ocorrencias/:id" element={<ProtectedRoute><OcorrenciaDetalhe/></ProtectedRoute>}/>
            <Route path="/perfil" element={<ProtectedRoute><Perfil/></ProtectedRoute>}/>

          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

