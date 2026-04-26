import { useState } from 'react';
import axios from '../api/axios';

const MonitorAvailability = () => {
    const [formData, setFormData] = useState({ fecha: '', hora_inicio: '', hora_fin: '' });
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await axios.post('/monitorias/disponibilidad', { ...formData, id_monitor: user.id });
            setMensaje('✅ Horario publicado exitosamente');
        } catch (error) {
            setMensaje('❌ Error al publicar horario');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
                <h2 className="text-2xl font-black text-slate-800 mb-6 tracking-tight text-center">Publicar Horario</h2>

                {mensaje && <p className="mb-4 text-center font-medium text-sm text-blue-600">{mensaje}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Fecha</label>
                        <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all"
                            onChange={e => setFormData({ ...formData, fecha: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Desde</label>
                            <input type="time" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all"
                                onChange={e => setFormData({ ...formData, hora_inicio: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Hasta</label>
                            <input type="time" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all"
                                onChange={e => setFormData({ ...formData, hora_fin: e.target.value })} required />
                        </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all">
                        Publicar Disponibilidad
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MonitorAvailability;