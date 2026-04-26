import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';

const Login = () => { // <--- 1. ASEGÚRATE DE QUE ESTO ESTÉ AQUÍ
    const [formData, setFormData] = useState({ correo: '', contrasena: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.usuario));
            navigate('/perfil');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        }
    };

    return ( // <--- 2. EL RETURN DEBE ESTAR DENTRO DE LA FUNCIÓN
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
            <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-10">
                {/* ... todo el resto del código de estilo que pegamos antes ... */}
                <img src="/logo.png" alt="Logo Edusync" className="text-3xl font-black text-slate-800 tracking-tight text-center mb-10" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Correo UAM"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                        onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                        required
                    />
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all mt-4">
                        Acceder
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    ¿No tienes cuenta? <Link to="/register" className="text-blue-600 font-bold hover:underline">Registrate aquí</Link>
                </p>
            </div>
        </div>
    );
}; // <--- 3. NO OLVIDES CERRAR LA FUNCIÓN AQUÍ

export default Login;