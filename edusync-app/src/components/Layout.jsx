import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* El Navbar siempre estará visible aquí */}
            <Navbar />

            {/* Aquí es donde se renderizarán las páginas (Perfil, Agendar, etc.) */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;