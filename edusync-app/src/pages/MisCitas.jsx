import { useEffect, useState } from 'react';
import axios from '../api/axios.js';

const MisCitas = () => {
    const [citas, setCitas] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchCitas = async () => {
            const res = await axios.get(`/monitorias/estudiante/${user.id}`);
            setCitas(res.data);
        };
        fetchCitas();
    }, []);

    const cancelarCita = async (id_monitoria) => {
        if(window.confirm("¿Seguro que deseas cancelar esta monitoría?")) {
            await axios.delete(`/monitorias/cancelar/${id_monitoria}`);
            setCitas(citas.filter(c => c.id_monitoria !== id_monitoria));
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-black text-slate-800 mb-8">Mis Monitorías Agendadas</h1>
            <div className="space-y-4">
                {citas.length === 0 ? (
                    <p className="text-slate-400 italic">Aún no tienes monitorías agendadas.</p>
                ) : (
                    citas.map(cita => (
                        <div key={cita.id_monitoria} className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
                            <div className="flex gap-4 items-center">
                                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl">📖</div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{cita.Materia}</h3>
                                    <p className="text-sm text-slate-500">Monitor: {cita.NombreMonitor}</p>
                                    <p className="text-xs font-bold text-blue-600">{cita.Fecha} | {cita.Hora}</p>
                                </div>
                            </div>
                            <button onClick={() => cancelarCita(cita.id_monitoria)} className="text-xs font-bold text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition">
                                Cancelar
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MisCitas;