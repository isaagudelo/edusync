import { useState } from 'react';
import axios from '../api/axios.js';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/auth/profile/${user.id}`, formData);
            localStorage.setItem('user', JSON.stringify(formData));
            setUser(formData);
            setIsEditing(false);
            setStatus({ type: 'success', msg: '¡Perfil actualizado con éxito!' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Error al conectar con el servidor.' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header del Perfil */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="h-24 w-24 bg-white rounded-2xl shadow-md flex items-center justify-center border-4 border-white">
                                <span className="text-4xl">👤</span>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-5 py-2 rounded-xl font-medium transition-all ${isEditing ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                                    }`}
                            >
                                {isEditing ? 'Cancelar' : 'Editar Perfil'}
                            </button>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">{user.nombre}</h1>
                            <p className="text-slate-500 font-medium">{user.rol} • {user.programa || 'Programa no definido'}</p>
                        </div>
                    </div>
                </div>

                {/* Grid de Información */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                📝 Información Personal
                            </h2>

                            {status.msg && (
                                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                                    }`}>
                                    {status.msg}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-5">
                                <div className="grid grid-cols-1 gap-5">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre Completo</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correo Institucional</label>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60"
                                            value={formData.correo}
                                            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-all mt-4">
                                        Actualizar Datos
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Sidebar de Estadísticas (Simulado para el Sprint) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase">Resumen</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-sm">Monitorías</span>
                                    <span className="font-bold text-blue-600">0</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-sm">Horas</span>
                                    <span className="font-bold text-indigo-600">0h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;