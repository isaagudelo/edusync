import { useEffect, useState } from 'react';
import { monitorias } from '../services/api.service.js';
import { useAuth } from '../hooks/useAuth.js';

const Agendar = () => {
    const { user } = useAuth();
    const [monitores, setMonitores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMonitores = async () => {
            try {
                const res = await monitorias.getDisponibles();
                setMonitores(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchMonitores();
    }, []);

    const handleAgendar = async (id_disponibilidad, id_asignacion) => {
        try {
            await monitorias.agendar({
                id_estudiante: user.id,
                id_disponibilidad,
                id_asignacion
            });
            alert("¡Monitoría agendada con éxito!");
            setMonitores(monitores.filter(m => m.id_disponibilidad !== id_disponibilidad));
        } catch (err) { alert("Error al agendar"); }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Buscar Monitoría</h1>
                <p className="text-slate-500 font-medium">Encuentra apoyo académico en tus materias</p>
            </header>

            {loading ? (
                <div className="text-center py-20 text-slate-400 font-medium">Cargando monitores disponibles...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monitores.map((m) => (
                        <div key={m.id_disponibilidad} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    👨‍🏫
                                </div>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-lg">Disponible</span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">{m.Nombre}</h3>
                            <p className="text-blue-600 text-sm font-semibold mb-4">{m.Materia}</p>

                            <div className="space-y-2 mb-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2">📅 <span>{new Date(m.Fecha).toLocaleDateString()}</span></div>
                                <div className="flex items-center gap-2">⏰ <span>{m.Hora_inicio.slice(0, 5)} - {m.Hora_fin?.slice(0, 5)}</span></div>
                            </div>

                            <button
                                onClick={() => handleAgendar(m.id_disponibilidad, m.id_asignacion)}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all active:scale-95"
                            >
                                Agendar Cupo
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Agendar;