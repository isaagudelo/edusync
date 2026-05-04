import { useNavigate, Link } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-3 flex justify-between items-center sticky top-0 z-50">
            <Link to="/perfil" className="flex items-center gap-3 group">
                <img src="/logo.png" alt="Edusync Logo" className="h-20 w-auto" />
            </Link>

            <div className="flex items-center gap-8">
                <div className="hidden md:flex gap-6">
                    <Link to="/agendar" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition flex items-center gap-1">
                        <FaHistory className="text-xs" />
                        Monitorías
                    </Link>
                    <Link to="/historial" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition flex items-center gap-1">
                        <FaHistory className="text-xs" />
                        Historial
                    </Link>
                    <div className="flex items-center gap-2">
                        <NotificationBell />
                        <Link to="/notificaciones" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">
                            Notificaciones
                        </Link>
                    </div>
                    {user?.rol === 'Monitor' && (
                        <Link to="/mis-horarios" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">Mi Disponibilidad</Link>
                    )}
                    {user?.rol === 'Administrador' && (
                        <Link to="/admin/usuarios" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">Panel Admin</Link>
                    )}
                </div>

                <div className="flex items-center gap-4 bg-slate-50 pl-4 pr-2 py-1.5 rounded-2xl border border-slate-100">
                    <div className="text-right">
                        <p className="text-[11px] font-black text-slate-800 leading-none">{user?.nombre.split(' ')[0]}</p>
                        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">{user?.rol}</p>
                    </div>
                    <button onClick={handleLogout} className="bg-white shadow-sm h-8 w-8 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all text-sm">
                        🚪
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;