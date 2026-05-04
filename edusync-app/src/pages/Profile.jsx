import { useState, useEffect } from 'react';
import { FaUserEdit, FaTimes, FaSave } from 'react-icons/fa';
import { auth } from '../services/api.service.js';
import ProfileCard from '../components/ProfileCard';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await auth.getProfile();
            setUser(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            setStatus({ type: 'error', msg: 'Error al cargar el perfil.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await auth.updateProfile(formData);
            localStorage.setItem('user', JSON.stringify(formData));
            setUser(formData);
            setIsEditing(false);
            setStatus({ type: 'success', msg: '¡Perfil actualizado con éxito!' });
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Error al actualizar el perfil.' });
        }
    };

    const handleEdit = () => {
        setFormData({ ...user });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({ ...user });
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tarjeta de Perfil */}
                    <div className="lg:col-span-1">
                        <ProfileCard user={user} onEdit={handleEdit} isOwnProfile={true} />
                    </div>

                    {/* Formulario de Edición */}
                    <div className="lg:col-span-2">
                        {isEditing ? (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                        <FaUserEdit className="mr-3 text-blue-600" />
                                        Editar Perfil
                                    </h2>
                                    <button
                                        onClick={handleCancel}
                                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <FaTimes className="text-xl" />
                                    </button>
                                </div>

                                {status.msg && (
                                    <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                                        status.type === 'success' 
                                            ? 'bg-green-50 text-green-700 border border-green-100' 
                                            : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                        {status.msg}
                                    </div>
                                )}

                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={formData.Nombre || ''}
                                                onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Apellidos
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={formData.Apellidos || ''}
                                                onChange={(e) => setFormData({ ...formData, Apellidos: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={formData.Correo || ''}
                                            onChange={(e) => setFormData({ ...formData, Correo: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={formData.Telefono || ''}
                                            onChange={(e) => setFormData({ ...formData, Telefono: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Programa Académico
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={formData.Programa || ''}
                                            onChange={(e) => setFormData({ ...formData, Programa: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Biografía
                                        </label>
                                        <textarea
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            rows="4"
                                            value={formData.Biografia || ''}
                                            onChange={(e) => setFormData({ ...formData, Biografia: e.target.value })}
                                            placeholder="Cuéntanos sobre ti..."
                                        ></textarea>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                                        >
                                            <FaSave className="mr-2" />
                                            Guardar Cambios
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    Vista Previa del Perfil
                                </h2>
                                <div className="text-center py-8">
                                    <FaUserEdit className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <p className="text-gray-600">
                                        Haz clic en "Editar Perfil" para modificar tu información
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;