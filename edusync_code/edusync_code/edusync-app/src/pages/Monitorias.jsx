import { useState, useEffect } from 'react';
import { monitorias } from '../services/api.service.js';
import { useAuth } from '../hooks/useAuth.js';

const Monitorias = () => {
  const { user } = useAuth();
  const [disponibles, setDisponibles] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMateria, setSelectedMateria] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [disponiblesRes, materiasRes] = await Promise.all([
        monitorias.getDisponibles(),
        monitorias.getMaterias()
      ]);
      setDisponibles(disponiblesRes.data);
      setMaterias(materiasRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const agendarMonitoria = async (id_disponibilidad, id_asignacion) => {
    try {
      await monitorias.agendar({
        id_estudiante: user.id,
        id_disponibilidad,
        id_asignacion
      });
      alert('Monitoría agendada con éxito');
      loadData();
    } catch (error) {
      alert('Error al agendar monitoría');
    }
  };

  const filteredDisponibles = selectedMateria
    ? disponibles.filter(d => d.Materia === selectedMateria)
    : disponibles;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Monitorías Disponibles</h1>
        <p className="text-slate-600">Encuentra y agenda sesiones con nuestros monitores</p>
      </div>

      <div className="mb-6">
        <select
          className="input max-w-xs"
          value={selectedMateria}
          onChange={(e) => setSelectedMateria(e.target.value)}
        >
          <option value="">Todas las materias</option>
          {materias.map(materia => (
            <option key={materia.id_materia} value={materia.Nombre}>
              {materia.Nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDisponibles.map((disponible) => (
          <div key={disponible.id_disponibilidad} className="card p-6 hover-lift">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-slate-800">{disponible.Monitor}</h3>
                <p className="text-sm text-slate-600">{disponible.Materia}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-slate-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(disponible.Fecha).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {disponible.Hora_inicio} - {disponible.Hora_fin}
              </div>
            </div>

            <button
              onClick={() => agendarMonitoria(disponible.id_disponibilidad, disponible.id_asignacion)}
              className="btn btn-primary w-full"
            >
              Agendar Monitoría
            </button>
          </div>
        ))}
      </div>

      {filteredDisponibles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No hay monitorías disponibles</h3>
          <p className="text-slate-600">No se encontraron monitorías para los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};

export default Monitorias;
