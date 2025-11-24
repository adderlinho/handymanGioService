import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      {/* TopNavBar */}
      <header className="sticky top-0 z-10 w-full bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center rounded-lg h-10 w-10 hover:bg-slate-100 transition-colors"
              >
                <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
              </button>
              
              <Link to="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span className="text-2xl">🔨</span>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Manitas Pro</h1>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                className={`text-sm md:text-base font-medium py-2.5 px-3 rounded-xl transition-colors flex items-center gap-3 ${
                  isActive('/admin') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin"
              >
                <span>📊</span> Dashboard
              </Link>
              <Link 
                className={`text-sm md:text-base font-medium py-2.5 px-3 rounded-xl transition-colors flex items-center gap-3 ${
                  location.pathname.startsWith('/admin/trabajos') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin/trabajos"
              >
                <span>🛠️</span> Trabajos
              </Link>
              <Link 
                className={`text-sm md:text-base font-medium py-2.5 px-3 rounded-xl transition-colors flex items-center gap-3 ${
                  location.pathname.startsWith('/admin/trabajadores') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin/trabajadores"
              >
                <span>👷</span> Trabajadores
              </Link>
              <Link 
                className={`text-sm md:text-base font-medium py-2.5 px-3 rounded-xl transition-colors flex items-center gap-3 ${
                  location.pathname.startsWith('/admin/clientes') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin/clientes"
              >
                <span>👥</span> Clientes
              </Link>
              <Link 
                className={`text-sm md:text-base font-medium py-2.5 px-3 rounded-xl transition-colors flex items-center gap-3 ${
                  location.pathname.startsWith('/admin/inventario') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin/inventario"
              >
                <span>📦</span> Inventario
              </Link>
              <Link 
                className={`text-sm md:text-base font-medium py-2.5 px-3 rounded-xl transition-colors flex items-center gap-3 ${
                  location.pathname.startsWith('/admin/nomina') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin/nomina"
              >
                <span>🧾</span> Nómina
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                <span>🌐</span>
                <span className="hidden sm:inline">Sitio Público</span>
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminAuth');
                  localStorage.removeItem('adminAuthExpiry');
                  navigate('/admin/login');
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                title="Cerrar sesión"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <nav className="px-4 py-4 space-y-2">
              <Link 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-colors ${
                  isActive('/admin') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>📊</span> Dashboard
              </Link>
              <Link 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-colors ${
                  location.pathname.startsWith('/admin/trabajos') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin/trabajos"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>🛠️</span> Trabajos
              </Link>
              <Link 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-colors ${
                  location.pathname.startsWith('/admin/trabajadores') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin/trabajadores"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>👷</span> Trabajadores
              </Link>
              <Link 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-colors ${
                  location.pathname.startsWith('/admin/clientes') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin/clientes"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>👥</span> Clientes
              </Link>
              <Link 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-colors ${
                  location.pathname.startsWith('/admin/inventario') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin/inventario"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>📦</span> Inventario
              </Link>
              <Link 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-colors ${
                  location.pathname.startsWith('/admin/nomina') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`} 
                to="/admin/nomina"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>🧾</span> Nómina
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}