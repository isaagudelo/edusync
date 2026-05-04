import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaStar, FaComment, FaClock, FaUser } from 'react-icons/fa';
import { historial as historialService, calificaciones as calService, comentarios as comentService } from '../services/api.service.js';
import { useAuth } from '../hooks/useAuth';
import CalificacionModal from '../components/CalificacionModal';

const Historial = () => {
  const { user } = useAuth();
  const [monitoriasList, setMonitoriasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonitoria, setSelectedMonitoria] = useState(null);
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [comentarioModal, setComentarioModal] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchHistorial(user.id);
    }
  }, [user]);

  const fetchHistorial = async (id_usuario) => {
    try {
      const response = await historialService.getByEstudiante(id_usuario);
      setMonitoriasList(response.data);
    } catch (error) {
      console.error('Error al obtener historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const monitoriasFiltradas = monitoriasList.filter(monitoria => {
    if (filtro === 'todas') return true;
    return monitoria.Estado?.toLowerCase() === filtro;
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Confirmada': return 'bg-green-100 text-green-800';
      case 'Finalizada': return 'bg-blue-100 text-blue-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCalificar = (monitoria) => {
    setSelectedMonitoria(monitoria);
    setModalOpen(true);
  };

  const handleSubmitCalificacion = async ({ puntuacion, comentario }) => {
    try {
      await calService.crear({
        id_monitoria: selectedMonitoria.id_monitoria,
        id_calificado: selectedMonitoria.id_monitor || selectedMonitoria.id_usuario_modifico,
        Puntuacion: puntuacion,
        Comentario: comentario
      });
      alert('Calificación enviada con éxito');
    } catch (error) {
      alert(error.response?.data?.error || 'Error al enviar calificación');
    }
  };

  const handleComentar = (monitoria) => {
    setComentarioModal(monitoria.id_monitoria);
    setComentarioTexto('');
  };

  const handleSubmitComentario = async (id_monitoria) => {
    if (!comentarioTexto.trim()) return;
    try {
      await comentService.crear({ id_monitoria, Contenido: comentarioTexto });
      alert('Comentario enviado con éxito');
      setComentarioModal(null);
      setComentarioTexto('');
    } catch (error) {
      alert(error.response?.data?.error || 'Error al enviar comentario');
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FaCalendarAlt className="mr-3 text-blue-600" />
          Historial de Monitorías
        </h1>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['todas', 'confirmada', 'finalizada', 'cancelada', 'pendiente'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filtro === f
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Lista de Monitorías */}
        <div className="space-y-4">
          {monitoriasFiltradas.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No hay monitorías para mostrar</p>
            </div>
          ) : (
            monitoriasFiltradas.map((monitoria) => (
              <div key={monitoria.id_monitoria} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FaUser className="mr-2 text-gray-600" />
                      <span className="font-semibold text-gray-800">Monitor: {monitoria.NombreMonitor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FaClock className="mr-2" />
                      <span>{new Date(monitoria.Fecha).toLocaleDateString()} - {monitoria.Hora_inicio} a {monitoria.Hora_fin}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Materia: {monitoria.Materia}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(monitoria.Estado)}`}>
                    {monitoria.Estado}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {monitoria.Estado === 'Finalizada' && (
                    <>
                      <button
                        onClick={() => handleCalificar(monitoria)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <FaStar className="mr-1" />
                        Calificar
                      </button>
                      <button
                        onClick={() => handleComentar(monitoria)}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <FaComment className="mr-1" />
                        Comentar
                      </button>
                    </>
                  )}
                </div>

                {/* Inline comment form */}
                {comentarioModal === monitoria.id_monitoria && (
                  <div className="mt-3 p-3 bg-white rounded-lg border">
                    <textarea
                      value={comentarioTexto}
                      onChange={(e) => setComentarioTexto(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                      rows="3"
                      placeholder="Escribe tu comentario..."
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSubmitComentario(monitoria.id_monitoria)}
                        className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        Enviar
                      </button>
                      <button
                        onClick={() => setComentarioModal(null)}
                        className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <CalificacionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitCalificacion}
        monitoriaInfo={selectedMonitoria ? {
          monitor: selectedMonitoria.NombreMonitor,
          materia: selectedMonitoria.Materia,
          fecha: selectedMonitoria.Fecha ? new Date(selectedMonitoria.Fecha).toLocaleDateString() : ''
        } : null}
      />
    </div>
  );
};

export default Historial;
