import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function PublicLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '';
    return location.pathname === path;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 w-full border-b border-border-light/80 bg-background-light/90 backdrop-blur-sm dark:border-border-dark/80 dark:bg-background-dark/90">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-primary text-3xl">construction</span>
              <h2 className="text-xl font-bold tracking-tight text-text-light dark:text-text-dark">{t('app.brand')}</h2>
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              <Link 
                className={`text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary font-semibold border-b-2 border-primary pb-1' 
                    : 'text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary'
                }`} 
                to="/"
              >
                {t('nav.public.home')}
              </Link>
              <Link 
                className={`text-sm font-medium transition-colors ${
                  isActive('/servicios') 
                    ? 'text-primary font-semibold border-b-2 border-primary pb-1' 
                    : 'text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary'
                }`} 
                to="/servicios"
              >
                {t('nav.public.services')}
              </Link>
              <Link 
                className={`text-sm font-medium transition-colors ${
                  isActive('/trabajos-realizados') 
                    ? 'text-primary font-semibold border-b-2 border-primary pb-1' 
                    : 'text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary'
                }`} 
                to="/trabajos-realizados"
              >
                {t('nav.public.portfolio')}
              </Link>
              <Link 
                className={`text-sm font-medium transition-colors ${
                  isActive('/como-funciona') 
                    ? 'text-primary font-semibold border-b-2 border-primary pb-1' 
                    : 'text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary'
                }`} 
                to="/como-funciona"
              >
                {t('nav.public.howItWorks')}
              </Link>
              <Link 
                className={`text-sm font-medium transition-colors ${
                  isActive('/contacto') 
                    ? 'text-primary font-semibold border-b-2 border-primary pb-1' 
                    : 'text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary'
                }`} 
                to="/contacto"
              >
                {t('nav.public.contact')}
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link to="/agenda" className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-5 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95">
                <span className="material-symbols-outlined text-base">calendar_month</span>
                <span className="truncate">{t('nav.public.booking')}</span>
              </Link>
              <LanguageSwitcher variant="compact" />
              <Link to="/admin" className="hidden md:flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                <span>Admin</span>
              </Link>
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="material-symbols-outlined text-2xl">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
            <nav className="px-4 py-4 space-y-2">
              <Link 
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary font-semibold' 
                    : 'text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary'
                }`} 
                to="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.public.home')}
              </Link>
              <Link 
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive('/servicios') 
                    ? 'text-primary font-semibold' 
                    : 'text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary'
                }`} 
                to="/servicios"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.public.services')}
              </Link>
              <Link 
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive('/trabajos-realizados') 
                    ? 'text-primary font-semibold' 
                    : 'text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary'
                }`} 
                to="/trabajos-realizados"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.public.portfolio')}
              </Link>
              <Link 
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive('/como-funciona') 
                    ? 'text-primary font-semibold' 
                    : 'text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary'
                }`} 
                to="/como-funciona"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.public.howItWorks')}
              </Link>
              <Link 
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive('/contacto') 
                    ? 'text-primary font-semibold' 
                    : 'text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary'
                }`} 
                to="/contacto"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.public.contact')}
              </Link>
              <div className="border-t border-border-light dark:border-border-dark my-2 pt-2">
                <Link 
                  className="flex items-center gap-2 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  <span>Panel Admin</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-text-light dark:bg-text-dark text-text-dark dark:text-text-light py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined text-primary text-3xl">construction</span>
                <h3 className="text-xl font-bold">GioService</h3>
              </Link>
              <p className="text-sm opacity-80">Reparaciones confiables para tu hogar. Electricidad, plomería, pintura y mantenimiento general.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/servicios" className="hover:text-primary transition-colors">Plomería</Link></li>
                <li><Link to="/servicios" className="hover:text-primary transition-colors">Electricidad</Link></li>
                <li><Link to="/servicios" className="hover:text-primary transition-colors">Pintura</Link></li>
                <li><Link to="/servicios" className="hover:text-primary transition-colors">Carpintería</Link></li>
                <li><Link to="/servicios" className="hover:text-primary transition-colors">Albañilería</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-sm opacity-80">
                <p>📞 +1 (847) 505-5576</p>
                <p>📧 giosinay@gmail.com</p>
                <p>📍 Chicago, Illinois</p>
              </div>
            </div>
          </div>
          <div className="border-t border-opacity-20 mt-8 pt-8 text-center text-sm opacity-60">
            <p>&copy; 2024 GioService. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}