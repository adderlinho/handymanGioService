import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Temporary hardcoded authentication
    if (credentials.password === 'Gi0S5055576') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError('Contraseña incorrecta');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">construction</span>
            <h1 className="text-2xl font-bold">Manitas Pro</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Acceso al Panel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">


          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !credentials.password}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}