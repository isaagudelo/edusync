import { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaClock, FaCalendarAlt, FaExclamationTriangle, FaComment } from 'react-icons/fa';
import { notificaciones as notifService } from '../services/api.service.js';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soloNoLeidas, setSoloNoLeidas] = useState(false);

  useEffect(() => {
    fetchNotificaciones();
  }, [soloNoLeidas]);

  const fetchNotificaciones = async () => {
    try {
      const response = await notifService.getAll(soloNoLeidas);
      setNotificaciones(response.data);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLeida = async (id_notificacion) => {
    try {
      await notifService.marcarLeida(id_notificacion);
      setNotificaciones(notificaciones.map(n => 
        n.id_notificacion === id_notificacion ? { ...n, Leida: true } : n
      ));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      await notifService.marcarTodasLeidas();
      setNotificaciones(notificaciones.map(n => ({ ...n, Leida: true })));
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const getIconoNotificacion = (tipo) => {
    switch (tipo) {
      case 'Recordatorio': return <FaClock className="text-yellow-500" />;
      case 'Confirmacion': return <FaCheck className="text-green-500" />;
      case 'Cancelacion': return <FaExclamationTriangle className="text-red-500" />;
      case 'Calificacion': return <FaCalendarAlt className="text-blue-500" />;
      case 'General': return <FaBell className="text-purple-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
  };

  const getFechaFormateada = (fecha) => {
    const fechaObj = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora - fechaObj;
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    if (dias < 7) return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    return fechaObj.toLocaleDateString('es-ES');
  };

  const noLeidasCount = notificaciones.filter(n => !n.Leida).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaBell className="mr-3 text-blue-600" />
            Notificaciones
            {noLeidasCount > 0 && (
              <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {noLeidasCount}
              </span>
            )}
          </h1>
          {noLeidasCount > 0 && (
            <button
              onClick={marcarTodasComoLeidas}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Filtro */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={soloNoLeidas}
              onChange={(e) => setSoloNoLeidas(e.target.checked)}
              className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Mostrar solo no leídas</span>
          </label>
        </div>

        {/* Lista de Notificaciones */}
        <div className="space-y-3">
          {notificaciones.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaBell className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No tienes notificaciones</p>
            </div>
          ) : (
            notificaciones.map((notificacion) => (
              <div
                key={notificacion.id_notificacion}
                className={`p-4 rounded-lg border transition-all ${
                  !notificacion.Leida 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-gray-50 border-gray-200'
                } hover:shadow-md`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getIconoNotificacion(notificacion.Tipo_Notificacion)}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-gray-800 ${!notificacion.Leida ? 'font-bold' : ''}`}>
                        {notificacion.Titulo}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{notificacion.Mensaje}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {getFechaFormateada(notificacion.Fecha_Envio)}
                      </p>
                    </div>
                  </div>
                  {!notificacion.Leida && (
                    <button
                      onClick={() => marcarComoLeida(notificacion.id_notificacion)}
                      className="ml-3 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Marcar como leída"
                    >
                      <FaCheck />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notificaciones;
