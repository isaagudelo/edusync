import { useState, useEffect } from 'react';
import { notificaciones as notifService } from '../services/api.service.js';

const useNotifications = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidasCount, setNoLeidasCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotificaciones = async (soloNoLeidas = false) => {
    setLoading(true);
    try {
      const response = await notifService.getAll(soloNoLeidas);
      setNotificaciones(response.data);
      setNoLeidasCount(response.data.filter(n => !n.Leida).length);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLeida = async (id_notificacion) => {
    try {
      await notifService.marcarLeida(id_notificacion);
      setNotificaciones(prev => prev.map(n => 
        n.id_notificacion === id_notificacion ? { ...n, Leida: true } : n
      ));
      setNoLeidasCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      await notifService.marcarTodasLeidas();
      setNotificaciones(prev => prev.map(n => ({ ...n, Leida: true })));
      setNoLeidasCount(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  return {
    notificaciones,
    noLeidasCount,
    loading,
    fetchNotificaciones,
    marcarComoLeida,
    marcarTodasComoLeidas
  };
};

export default useNotifications;
