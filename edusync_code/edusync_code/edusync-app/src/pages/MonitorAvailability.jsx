import { useState, useEffect } from 'react';
import { monitorias } from '../services/api.service.js';
import { useAuth } from '../hooks/useAuth.js';

const MonitorAvailability = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ fecha: '', hora_inicio: '', hora_fin: '' });
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);
    const [availabilitySlots, setAvailabilitySlots] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await monitorias.createAvailability({ ...formData, id_monitor: user.id });
            setMensaje('Horario publicado exitosamente');
            setFormData({ fecha: '', hora_inicio: '', hora_fin: '' });
            loadSlots();
        } catch (error) {
            setMensaje('Error al publicar horario');
        } finally {
            setLoading(false);
            setTimeout(() => setMensaje(''), 3000);
        }
    };

    const loadSlots = async () => {
        try {
            const response = await monitorias.getDisponibilidadMonitor(user.id);
            setAvailabilitySlots(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user?.id) loadSlots();
    }, [user]);

    return (
        <div className="max-w-lg mx-auto py-10 px-4">
            <div className="card p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Publicar Disponibilidad</h2>
                <p className="text-slate-600 text-center mb-6 text-sm">
                    Define los horarios en los que estás disponible para dar monitorías
                </p>

                {mensaje && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-medium text-center ${
                        mensaje.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>{mensaje}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Fecha</label>
                        <input
                            type="date"
                            className="input"
                            value={formData.fecha}
                            onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Hora Inicio</label>
                            <input
                                type="time"
                                className="input"
                                value={formData.hora_inicio}
                                onChange={e => setFormData({ ...formData, hora_inicio: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Hora Fin</label>
                            <input
                                type="time"
                                className="input"
                                value={formData.hora_fin}
                                onChange={e => setFormData({ ...formData, hora_fin: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full py-3"
                        disabled={loading}
                    >
                        {loading ? 'Publicando...' : 'Publicar Disponibilidad'}
                    </button>
                </form>

                {availabilitySlots.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Mis Horarios</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {availabilitySlots.map((slot) => (
                                <div key={slot.id_disponibilidad} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="text-sm">
                                        <span className="font-medium text-slate-800">{new Date(slot.Fecha).toLocaleDateString()}</span>
                                        <span className="text-slate-500 mx-2">|</span>
                                        <span className="text-slate-600">{slot.Hora_inicio} - {slot.Hora_fin}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        slot.Estado === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>{slot.Estado}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonitorAvailability;