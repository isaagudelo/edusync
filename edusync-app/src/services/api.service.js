import axiosInstance from './axios.instance.js';

export const auth = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  getStats: (id) => axiosInstance.get(`/auth/stats/${id}`),
};

export const admin = {
  createMateria: (data) => axiosInstance.post('/admin/materias', data),
  getAllUsers: () => axiosInstance.get('/admin/usuarios'),
  asignarMateria: (data) => axiosInstance.post('/admin/asignar-materia', data),
  getAsignaciones: () => axiosInstance.get('/admin/asignaciones'),
  deleteAsignacion: (id) => axiosInstance.delete(`/admin/asignaciones/${id}`),
  updateUserStatus: (id, data) => axiosInstance.put(`/admin/usuarios/${id}/estado`, data),
};

export const monitorias = {
  getDisponibles: () => axiosInstance.get('/monitorias/disponibles'),
  getMaterias: () => axiosInstance.get('/monitorias/materias'),
  agendar: (data) => axiosInstance.post('/monitorias/agendar', data),
  getCitasEstudiante: (id) => axiosInstance.get(`/monitorias/estudiante/${id}`),
  getCitasMonitor: (id) => axiosInstance.get(`/monitorias/monitor/${id}`),
  cancelar: (id) => axiosInstance.delete(`/monitorias/cancelar/${id}`),
  createAvailability: (data) => axiosInstance.post('/monitorias/disponibilidad', data),
  getDisponibilidadMonitor: (id) => axiosInstance.get(`/monitorias/disponibilidad/${id}`),
  updateEstado: (id, data) => axiosInstance.put(`/monitorias/${id}/estado`, data),
};

export const notificaciones = {
  getAll: (soloNoLeidas = false) => axiosInstance.get(`/notificaciones?no_leidas=${soloNoLeidas}`),
  marcarLeida: (id) => axiosInstance.put(`/notificaciones/${id}/leida`),
  marcarTodasLeidas: () => axiosInstance.put('/notificaciones/marcar-todas-leidas'),
  crear: (data) => axiosInstance.post('/notificaciones', data),
};

export const calificaciones = {
  crear: (data) => axiosInstance.post('/calificaciones', data),
  getByMonitor: (id) => axiosInstance.get(`/calificaciones/monitor/${id}`),
  getByEstudiante: (id) => axiosInstance.get(`/calificaciones/estudiante/${id}`),
  getByMonitoria: (id) => axiosInstance.get(`/calificaciones/monitoria/${id}`),
};

export const historial = {
  getByMonitoria: (id) => axiosInstance.get(`/historial/monitoria/${id}`),
  getByEstudiante: (id) => axiosInstance.get(`/historial/estudiante/${id}`),
  modificarFecha: (id, data) => axiosInstance.put(`/historial/monitoria/${id}/fecha`, data),
};

export const comentarios = {
  crear: (data) => axiosInstance.post('/comentarios', data),
  getByMonitoria: (id) => axiosInstance.get(`/comentarios/monitoria/${id}`),
  eliminar: (id) => axiosInstance.delete(`/comentarios/${id}`),
};

export const asistencia = {
  marcar: (data) => axiosInstance.post('/asistencia', data),
  getByMonitoria: (id) => axiosInstance.get(`/asistencia/monitoria/${id}`),
  getByEstudiante: (id) => axiosInstance.get(`/asistencia/estudiante/${id}`),
};

export const sesiones = {
  crear: (data) => axiosInstance.post('/sesiones', data),
  getByMonitoria: (id) => axiosInstance.get(`/sesiones/monitoria/${id}`),
  validarToken: (data) => axiosInstance.post('/sesiones/validate', data),
};
