import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { monitorias } from '../services/api.service.js';
import { useAuth } from '../hooks/useAuth.js';

const MisMonitorias = () => {
  const { user } = useAuth();
  const [citasEstudiante, setCitasEstudiante] = useState([]);
  const [citasMonitor, setCitasMonitor] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMonitor = user?.rol === 'Monitor';

  useEffect(() => {
    if (user?.id) {
      loadCitas();
    }
  }, [user]);

  const loadCitas = async () => {
    try {
      const resEst = await monitorias.getCitasEstudiante(user.id);
      setCitasEstudiante(resEst.data);
      if (isMonitor) {
        const resMon = await monitorias.getCitasMonitor(user.id);
        setCitasMonitor(resMon.data);
      }
    } catch (error) {
      console.error('Error cargando citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelarMonitoria = async (id_monitoria) => {
    if (confirm('¿Estás seguro de cancelar esta monitoría?')) {
      try {
        await monitorias.cancelar(id_monitoria);
        alert('Monitoría cancelada con éxito');
        loadCitas();
      } catch (error) {
        alert('Error al cancelar monitoría');
      }
    }
  };

  const finalizarMonitoria = async (id_monitoria) => {
    if (confirm('¿Marcar esta monitoría como finalizada?')) {
      try {
        await monitorias.updateEstado(id_monitoria, { Estado: 'Finalizada' });
        alert('Monitoría finalizada');
        loadCitas();
      } catch (error) {
        alert('Error al finalizar monitoría');
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Confirmada': return 'bg-green-100 text-green-800';
      case 'Finalizada': return 'bg-blue-100 text-blue-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Monitorías como Monitor */}
      {isMonitor && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Mis Estudiantes</h1>
            <p className="text-slate-600">Monitorías donde eres el monitor asignado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {citasMonitor.map((cita) => (
              <div key={cita.id_monitoria} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-slate-800">{cita.NombreEstudiante} {cita.ApellidosEstudiante}</h3>
                      <p className="text-sm text-slate-600">{cita.Materia}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.Estado)}`}>
                    {cita.Estado}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(cita.Fecha).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {cita.Hora} - {cita.Hora_fin}
                  </div>
                </div>

                {cita.Estado === 'Confirmada' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => finalizarMonitoria(cita.id_monitoria)}
                      className="btn btn-primary flex-1 text-sm"
                    >
                      Finalizar
                    </button>
                    <button
                      onClick={() => cancelarMonitoria(cita.id_monitoria)}
                      className="btn btn-secondary flex-1 text-sm text-red-600"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
            {citasMonitor.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-slate-500">No tienes estudiantes agendados aún</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Monitorías como Estudiante */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {isMonitor ? 'Monitorías Agendadas' : 'Mis Monitorías'}
        </h1>
        <p className="text-slate-600">Gestiona tus sesiones agendadas como estudiante</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {citasEstudiante.map((cita) => (
          <div key={cita.id_monitoria} className="card p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-slate-800">{cita.NombreMonitor}</h3>
                <p className="text-sm text-slate-600">{cita.Materia}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-slate-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(cita.Fecha).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {cita.Hora}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => cancelarMonitoria(cita.id_monitoria)}
                className="btn btn-secondary flex-1 text-sm text-red-600 hover:text-red-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>

      {citasEstudiante.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No tienes monitorías agendadas</h3>
          <p className="text-slate-600 mb-4">Agenda tu primera sesión de monitoría</p>
          <Link to="/monitorias" className="btn btn-primary">
            Ver Monitorías Disponibles
          </Link>
        </div>
      )}
    </div>
  );
};

export default MisMonitorias;
