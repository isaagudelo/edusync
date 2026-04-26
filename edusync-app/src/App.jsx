import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Agendar from './pages/Agendar';
import MonitorAvailability from './pages/MonitorAvailability';
import AdminMaterias from './pages/AdminMateria';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas: NO llevan Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas: TODAS dentro del Layout para que tengan Navbar */}
        <Route path="/" element={<Layout />}>
          {/* Al entrar a la raíz, te manda al perfil */}
          <Route index element={<Navigate to="/perfil" />} />
          <Route path="/admin/materias" element={<AdminMaterias />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="agendar" element={<Agendar />} />
          <Route path="mis-horarios" element={<MonitorAvailability />} />
        </Route>

        {/* Ruta para capturar cualquier error 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;