import { useState, useEffect } from 'react';
import { admin, monitorias } from '../services/api.service.js';

const AdminMaterias = () => {
    const [materias, setMaterias] = useState([]);
    const [nuevaMateria, setNuevaMateria] = useState({ Nombre: '', Codigo: '' });
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchMaterias = async () => {
            const res = await monitorias.getMaterias();
            setMaterias(res.data);
        };
        fetchMaterias();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await admin.createMateria(nuevaMateria);
            setStatus('✅ Materia creada con éxito');
            setNuevaMateria({ Nombre: '', Codigo: '' });
            // Recargar lista
            const res = await monitorias.getMaterias();
            setMaterias(res.data);
        } catch (err) {
            setStatus('❌ Error al crear materia');
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-black text-slate-800 mb-8">Gestión de Materias</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Formulario */}
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-fit">
                    <h2 className="text-xl font-bold mb-6">Añadir Materia</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nombre (ej: Física II)"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500"
                            value={nuevaMateria.Nombre}
                            onChange={e => setNuevaMateria({ ...nuevaMateria, Nombre: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Código (ej: FIS102)"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500"
                            value={nuevaMateria.Codigo}
                            onChange={e => setNuevaMateria({ ...nuevaMateria, Codigo: e.target.value })}
                            required
                        />
                        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition">
                            Guardar Materia
                        </button>
                    </form>
                    {status && <p className="mt-4 text-center text-sm font-bold text-blue-600">{status}</p>}
                </div>

                {/* Lista de Materias */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-700">Materias en el Sistema</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {materias.map(m => (
                            <div key={m.id_materia} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-lg">📚</div>
                                <div>
                                    <p className="font-bold text-slate-800">{m.Nombre}</p>
                                    <p className="text-xs text-slate-400">{m.Codigo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMaterias;