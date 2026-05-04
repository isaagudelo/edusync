import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import useNotifications from '../hooks/useNotifications';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notificaciones, noLeidasCount, marcarComoLeida, marcarTodasComoLeidas } = useNotifications();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id_notificacion) => {
    marcarComoLeida(id_notificacion);
  };

  const handleMarkAllAsRead = () => {
    marcarTodasComoLeidas();
  };

  const getFechaFormateada = (fecha) => {
    const fechaObj = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora - fechaObj;
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `Hace ${minutos}m`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias < 7) return `Hace ${dias}d`;
    return fechaObj.toLocaleDateString('es-ES');
  };

  return (
    <div className="relative">
      {/* Botón de campana */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
        title="Notificaciones"
      >
        {noLeidasCount > 0 ? (
          <FaBell className="text-xl" />
        ) : (
          <FaBellSlash className="text-xl opacity-50" />
        )}
        
        {/* Badge de notificaciones no leídas */}
        {noLeidasCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {noLeidasCount > 9 ? '9+' : noLeidasCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Notificaciones</h3>
              {noLeidasCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>

            {/* Lista de notificaciones */}
            <div className="max-h-64 overflow-y-auto">
              {notificaciones.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <FaBellSlash className="mx-auto text-2xl mb-2 opacity-50" />
                  <p className="text-sm">No tienes notificaciones</p>
                </div>
              ) : (
                notificaciones.slice(0, 5).map((notificacion) => (
                  <div
                    key={notificacion.id_notificacion}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notificacion.Leida ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium text-gray-800 ${
                          !notificacion.Leida ? 'font-bold' : ''
                        }`}>
                          {notificacion.Titulo}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notificacion.Mensaje}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {getFechaFormateada(notificacion.Fecha_Envio)}
                        </p>
                      </div>
                      {!notificacion.Leida && (
                        <button
                          onClick={() => handleMarkAsRead(notificacion.id_notificacion)}
                          className="ml-2 p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Marcar como leída"
                        >
                          <span className="text-xs">✓</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notificaciones.length > 5 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <Link to="/notificaciones" onClick={() => setIsOpen(false)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Ver todas las notificaciones
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
