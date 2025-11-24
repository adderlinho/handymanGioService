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
      <header className="sticky top-0 z-10 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-primary text-3xl">construction</span>
              <h1 className="text-xl font-bold tracking-tight">Manitas Pro</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin') 
                    ? 'text-primary border-b-2 border-primary font-bold' 
                    : 'hover:text-primary'
                }`} 
                to="/admin"
              >
                Dashboard
              </Link>
              <Link 
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin/trabajos') 
                    ? 'text-primary border-b-2 border-primary font-bold' 
                    : 'hover:text-primary'
                }`} 
                to="/admin/trabajos"
              >
                Trabajos
              </Link>
              <Link 
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin/trabajadores') 
                    ? 'text-primary border-b-2 border-primary font-bold' 
                    : 'hover:text-primary'
                }`} 
                to="/admin/trabajadores"
              >
                Trabajadores
              </Link>
              <Link 
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin/clientes') 
                    ? 'text-primary border-b-2 border-primary font-bold' 
                    : 'hover:text-primary'
                }`} 
                to="/admin/clientes"
              >
                Clientes
              </Link>
              <Link 
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin/inventario') 
                    ? 'text-primary border-b-2 border-primary font-bold' 
                    : 'hover:text-primary'
                }`} 
                to="/admin/inventario"
              >
                Inventario
              </Link>
              <Link 
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin/nomina') 
                    ? 'text-primary border-b-2 border-primary font-bold' 
                    : 'hover:text-primary'
                }`} 
                to="/admin/nomina"
              >
                Nómina
              </Link>
            </nav>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center rounded-lg h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">public</span>
                <span className="hidden sm:inline">Sitio Público</span>
              </Link>
              <button className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">notifications</span>
              </button>
              <button className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">settings</span>
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminAuth');
                  localStorage.removeItem('adminAuthExpiry');
                  navigate('/admin/login');
                }}
                className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Cerrar sesión"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">logout</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-slate-300"></div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <nav className="px-4 py-4 space-y-2">
              <Link 
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin') 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`} 
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin/trabajos') 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`} 
                to="/admin/trabajos"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trabajos
              </Link>
              <Link 
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin/trabajadores') 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`} 
                to="/admin/trabajadores"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trabajadores
              </Link>
              <Link 
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin/clientes') 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`} 
                to="/admin/clientes"
                onClick={() => setMobileMenuOpen(false)}
              >
                Clientes
              </Link>
              <Link 
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin/inventario') 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`} 
                to="/admin/inventario"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inventario
              </Link>
              <Link 
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin/nomina') 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`} 
                to="/admin/nomina"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nómina
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}