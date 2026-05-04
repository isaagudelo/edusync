import { useState, useEffect } from 'react';
import { admin, monitorias as monitoriasService } from '../services/api.service.js';
import { FaUsers, FaBook, FaLink, FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [asignForm, setAsignForm] = useState({ id_monitor: '', id_materia: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersRes, matsRes, asigRes] = await Promise.all([
                admin.getAllUsers(),
                monitoriasService.getMaterias(),
                admin.getAsignaciones()
            ]);
            setUsuarios(usersRes.data);
            setMaterias(matsRes.data);
            setAsignaciones(asigRes.data);
        } catch (error) {
            console.error('Error cargando datos admin:', error);
        } finally {
            setLoading(false);
        }
    };

    const monitores = usuarios.filter(u => u.Tipo_Usuario === 'Monitor');

    const handleAsignar = async (e) => {
        e.preventDefault();
        try {
            await admin.asignarMateria(asignForm);
            setStatus({ type: 'success', msg: 'Materia asignada al monitor' });
            setAsignForm({ id_monitor: '', id_materia: '' });
            const res = await admin.getAsignaciones();
            setAsignaciones(res.data);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.error || 'Error al asignar' });
        }
        setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
    };

    const handleDeleteAsignacion = async (id) => {
        if (!confirm('¿Desactivar esta asignación?')) return;
        try {
            await admin.deleteAsignacion(id);
            const res = await admin.getAsignaciones();
            setAsignaciones(res.data);
        } catch (err) {
            alert('Error al desactivar asignación');
        }
    };

    const handleToggleUserStatus = async (id_usuario, estadoActual) => {
        const nuevoEstado = estadoActual === 'Activo' ? 'Suspendido' : 'Activo';
        try {
            await admin.updateUserStatus(id_usuario, { Estado_Cuenta: nuevoEstado });
            setUsuarios(prev => prev.map(u =>
                u.id_usuario === id_usuario ? { ...u, Estado_Cuenta: nuevoEstado } : u
            ));
        } catch (err) {
            alert('Error al actualizar estado');
        }
    };

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'Activo': return 'bg-green-100 text-green-800';
            case 'Suspendido': return 'bg-red-100 text-red-800';
            case 'Inactivo': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Panel de Administración</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="card p-5 text-center">
                    <p className="text-3xl font-bold text-blue-600">{usuarios.length}</p>
                    <p className="text-sm text-slate-500">Usuarios</p>
                </div>
                <div className="card p-5 text-center">
                    <p className="text-3xl font-bold text-green-600">{monitores.length}</p>
                    <p className="text-sm text-slate-500">Monitores</p>
                </div>
                <div className="card p-5 text-center">
                    <p className="text-3xl font-bold text-purple-600">{materias.length}</p>
                    <p className="text-sm text-slate-500">Materias</p>
                </div>
                <div className="card p-5 text-center">
                    <p className="text-3xl font-bold text-amber-600">{asignaciones.filter(a => a.estado === 'Activo').length}</p>
                    <p className="text-sm text-slate-500">Asignaciones Activas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Asignar Materia a Monitor */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <FaLink className="mr-2 text-blue-600" /> Asignar Materia a Monitor
                    </h2>

                    {status.msg && (
                        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>{status.msg}</div>
                    )}

                    <form onSubmit={handleAsignar} className="space-y-4">
                        <div>
                            <label className="label">Monitor</label>
                            <select
                                className="input"
                                value={asignForm.id_monitor}
                                onChange={e => setAsignForm({ ...asignForm, id_monitor: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar monitor...</option>
                                {monitores.map(m => (
                                    <option key={m.id_usuario} value={m.id_usuario}>
                                        {m.Nombre} {m.Apellidos}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">Materia</label>
                            <select
                                className="input"
                                value={asignForm.id_materia}
                                onChange={e => setAsignForm({ ...asignForm, id_materia: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar materia...</option>
                                {materias.map(m => (
                                    <option key={m.id_materia} value={m.id_materia}>
                                        {m.Nombre} ({m.Codigo})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-full">
                            Vincular Monitor con Materia
                        </button>
                    </form>

                    {/* Asignaciones activas */}
                    <div className="mt-6">
                        <h3 className="font-semibold text-slate-700 mb-3">Asignaciones Activas</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {asignaciones.filter(a => a.estado === 'Activo').map(a => (
                                <div key={a.id_asignacion} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{a.NombreMonitor} {a.ApellidosMonitor}</p>
                                        <p className="text-xs text-slate-500">{a.NombreMateria} ({a.CodigoMateria})</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteAsignacion(a.id_asignacion)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title="Desactivar"
                                    >
                                        <FaTrash className="text-xs" />
                                    </button>
                                </div>
                            ))}
                            {asignaciones.filter(a => a.estado === 'Activo').length === 0 && (
                                <p className="text-sm text-slate-400 text-center py-4">Sin asignaciones activas</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lista de Usuarios */}
                <div className="lg:col-span-2 card p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <FaUsers className="mr-2 text-blue-600" /> Gestión de Usuarios
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-2 text-slate-600 font-semibold">Nombre</th>
                                    <th className="text-left py-3 px-2 text-slate-600 font-semibold">Correo</th>
                                    <th className="text-left py-3 px-2 text-slate-600 font-semibold">Rol</th>
                                    <th className="text-left py-3 px-2 text-slate-600 font-semibold">Programa</th>
                                    <th className="text-left py-3 px-2 text-slate-600 font-semibold">Estado</th>
                                    <th className="text-left py-3 px-2 text-slate-600 font-semibold">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(u => (
                                    <tr key={u.id_usuario} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-2 font-medium text-slate-800">{u.Nombre} {u.Apellidos}</td>
                                        <td className="py-3 px-2 text-slate-600">{u.Correo}</td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                u.Tipo_Usuario === 'Administrador' ? 'bg-purple-100 text-purple-800' :
                                                u.Tipo_Usuario === 'Monitor' ? 'bg-blue-100 text-blue-800' :
                                                'bg-slate-100 text-slate-800'
                                            }`}>{u.Tipo_Usuario}</span>
                                        </td>
                                        <td className="py-3 px-2 text-slate-600">{u.Programa || '-'}</td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(u.Estado_Cuenta)}`}>
                                                {u.Estado_Cuenta}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2">
                                            <button
                                                onClick={() => handleToggleUserStatus(u.id_usuario, u.Estado_Cuenta)}
                                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    u.Estado_Cuenta === 'Activo'
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                            >
                                                {u.Estado_Cuenta === 'Activo' ? 'Suspender' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;