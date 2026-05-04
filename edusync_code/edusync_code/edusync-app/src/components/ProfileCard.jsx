import { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaStar, FaBook, FaPhone, FaEnvelope, FaCamera } from 'react-icons/fa';
import { auth } from '../services/api.service.js';

const ProfileCard = ({ user, onEdit, isOwnProfile = false }) => {
  const [imageError, setImageError] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.id_usuario) {
      auth.getStats(user.id_usuario).then(res => {
        setStats(res.data);
      }).catch(() => {});
    }
  }, [user?.id_usuario]);

  const renderStars = (rating) => {
    const r = parseFloat(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-sm ${
          i < Math.floor(r) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header con foto de perfil */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            {user.Foto_Perfil && !imageError ? (
              <img
                src={user.Foto_Perfil}
                alt={`${user.Nombre} ${user.Apellidos}`}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                <FaUser className="text-3xl text-gray-400" />
              </div>
            )}
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <FaCamera className="text-xs" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Información del perfil */}
      <div className="pt-14 px-6 pb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user.Nombre} {user.Apellidos}
            </h2>
            <p className="text-gray-600 capitalize">{user.Tipo_Usuario}</p>
            {user.Programa && (
              <p className="text-sm text-gray-500 mt-1">{user.Programa}</p>
            )}
          </div>
          {isOwnProfile && (
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar perfil"
            >
              <FaEdit />
            </button>
          )}
        </div>

        {/* Calificación (solo para monitores) */}
        {user.Tipo_Usuario === 'Monitor' && stats && (
          <div className="flex items-center space-x-2 mb-4 p-3 bg-yellow-50 rounded-lg">
            <span className="font-semibold text-gray-700">Calificación:</span>
            <div className="flex items-center space-x-1">
              {renderStars(stats.promedioCalificacion)}
              <span className="text-sm text-gray-600 ml-1">
                ({stats.promedioCalificacion}/5.0)
              </span>
            </div>
          </div>
        )}

        {/* Biografía */}
        {user.Biografia && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
              <FaBook className="mr-2 text-blue-600" />
              Biografía
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {user.Biografia}
            </p>
          </div>
        )}

        {/* Información de contacto */}
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <FaEnvelope className="mr-3 text-blue-600" />
            <span className="text-sm">{user.Correo}</span>
          </div>
          {user.Telefono && (
            <div className="flex items-center text-gray-600">
              <FaPhone className="mr-3 text-blue-600" />
              <span className="text-sm">{user.Telefono}</span>
            </div>
          )}
        </div>

        {/* Estadísticas dinámicas */}
        {stats && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.totalMonitorias}</p>
                <p className="text-xs text-gray-600">Monitorías</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.porcentajeAsistencia}%</p>
                <p className="text-xs text-gray-600">Asistencia</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.promedioCalificacion}</p>
                <p className="text-xs text-gray-600">Promedio</p>
              </div>
            </div>
          </div>
        )}

        {/* Fecha de registro */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Miembro desde {new Date(user.Fecha_Creacion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
