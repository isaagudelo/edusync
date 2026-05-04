import { useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';

const CalificacionModal = ({ isOpen, onClose, onSubmit, monitoriaInfo }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [hover, setHover] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (puntuacion === 0) {
      alert('Por favor selecciona una puntuación');
      return;
    }
    onSubmit({ puntuacion, comentario });
    onClose();
    setPuntuacion(0);
    setComentario('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Calificar Monitoría</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {monitoriaInfo && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Monitor:</span> {monitoriaInfo.monitor}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Materia:</span> {monitoriaInfo.materia}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Fecha:</span> {monitoriaInfo.fecha}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              Puntuación
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setPuntuacion(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-all transform hover:scale-110"
                >
                  <FaStar
                    className={`text-3xl ${
                      star <= (hover || puntuacion)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {puntuacion === 1 && 'Mala'}
              {puntuacion === 2 && 'Regular'}
              {puntuacion === 3 && 'Buena'}
              {puntuacion === 4 && 'Muy buena'}
              {puntuacion === 5 && 'Excelente'}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              placeholder="Comparte tu experiencia sobre la monitoría..."
            ></textarea>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Enviar Calificación
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalificacionModal;
