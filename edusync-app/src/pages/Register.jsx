import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '', correo: '', contrasena: '', tipo_usuario: 'Estudiante', programa: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/register', formData);
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrarse');
        }
    };

    // Reemplaza el return de tu Register.jsx con esto
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-6">
            <div className="w-full max-w-[500px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Crear Cuenta</h1>
                    <p className="text-slate-400 mt-2 font-medium">Únete a la red de monitorías UAM</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Nombre Completo</label>
                            <input type="text" required className="w-full mt-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Correo Institucional</label>
                            <input type="email" required className="w-full mt-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                onChange={e => setFormData({ ...formData, correo: e.target.value })} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-slate-700 ml-1">Rol</label>
                                <select className="w-full mt-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none"
                                    onChange={e => setFormData({ ...formData, tipo_usuario: e.target.value })}>
                                    <option value="Estudiante">Estudiante</option>
                                    <option value="Monitor">Monitor</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-700 ml-1">Programa</label>
                                <input type="text" className="w-full mt-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none"
                                    onChange={e => setFormData({ ...formData, programa: e.target.value })} required />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 ml-1">Contraseña</label>
                            <input type="password" required className="w-full mt-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none"
                                onChange={e => setFormData({ ...formData, contrasena: e.target.value })} required />
                        </div>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all mt-4">
                        Completar Registro
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    ¿Ya eres parte? <Link to="/login" className="text-blue-600 font-bold hover:underline">Inicia sesión aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;