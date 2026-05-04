import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/api.service.js';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    tipo_usuario: 'Estudiante',
    programa: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await auth.register(formData);
      navigate('/login?message=Registro exitoso. Ahora puedes iniciar sesión.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Edusync" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-800">Crear Cuenta</h1>
          <p className="text-slate-600 mt-2">Únete a la red de monitorías</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre</label>
                <input
                  type="text"
                  className="input"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Apellidos</label>
                <input
                  type="text"
                  className="input"
                  value={formData.apellidos}
                  onChange={e => setFormData({ ...formData, apellidos: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Correo Institucional</label>
              <input
                type="email"
                className="input"
                placeholder="correo@universidad.edu"
                value={formData.correo}
                onChange={e => setFormData({ ...formData, correo: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Rol</label>
                <select
                  className="input"
                  value={formData.tipo_usuario}
                  onChange={e => setFormData({ ...formData, tipo_usuario: e.target.value })}
                >
                  <option value="Estudiante">Estudiante</option>
                  <option value="Monitor">Monitor</option>
                </select>
              </div>
              <div>
                <label className="label">Programa</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ej: Ingeniería de Sistemas"
                  value={formData.programa}
                  onChange={e => setFormData({ ...formData, programa: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Contraseña</label>
              <input
                type="password"
                className="input"
                placeholder="Mínimo 6 caracteres"
                value={formData.contrasena}
                onChange={e => setFormData({ ...formData, contrasena: e.target.value })}
                required
                minLength="6"
              />
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                'Completar Registro'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
