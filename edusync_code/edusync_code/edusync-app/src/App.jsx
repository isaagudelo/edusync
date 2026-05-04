import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./pages/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminMaterias from "./pages/AdminMateria";
import Monitorias from "./pages/Monitorias";
import MisMonitorias from "./pages/MisMonitorias";
import Historial from "./pages/Historial";
import Notificaciones from "./pages/Notificaciones";
import MonitorAvailability from "./pages/MonitorAvailability";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="monitorias" element={<ProtectedRoute><Monitorias /></ProtectedRoute>} />
                        <Route path="mis-monitorias" element={<ProtectedRoute><MisMonitorias /></ProtectedRoute>} />
                        <Route path="historial" element={<ProtectedRoute><Historial /></ProtectedRoute>} />
                        <Route path="notificaciones" element={<ProtectedRoute><Notificaciones /></ProtectedRoute>} />
                        <Route path="disponibilidad" element={<ProtectedRoute><MonitorAvailability /></ProtectedRoute>} />
                        <Route path="admin/materias" element={<ProtectedRoute><AdminMaterias /></ProtectedRoute>} />
                        <Route path="admin/panel" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;