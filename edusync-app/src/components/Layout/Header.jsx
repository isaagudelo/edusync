import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from '../NotificationBell';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-soft border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="Edusync" className="h-8 w-8" />
              <span className="text-xl font-bold text-slate-800">Edusync</span>
            </Link>
          </div>

          {user && (
            <nav className="hidden md:flex space-x-6">
              <Link to="/monitorias" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Monitorías</Link>
              <Link to="/mis-monitorias" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Mis Monitorías</Link>
              <Link to="/historial" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Historial</Link>
              {user?.rol === 'Monitor' && (
                <Link to="/disponibilidad" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Mi Disponibilidad</Link>
              )}
              {user?.rol === 'Administrador' && (
                <>
                  <Link to="/admin/materias" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Materias</Link>
                  <Link to="/admin/panel" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Panel Admin</Link>
                </>
              )}
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationBell />
                <Link to="/perfil" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">
                  Mi Perfil
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-secondary text-sm"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary text-sm">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary text-sm">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
