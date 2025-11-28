import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AdminAuthProvider } from './auth/AdminAuthContext';
import { AdminRouteGuard } from './auth/AdminRouteGuard';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/public/HomePage';
import AgendaPage from './pages/public/AgendaPage';
import ServiciosPage from './pages/public/ServiciosPage';
import TrabajosRealizadosPage from './pages/public/TrabajosRealizadosPage';
import TrabajoPublicPage from './pages/public/TrabajoPublicPage';
import DashboardPage from './pages/admin/DashboardPage';
import TrabajosListPage from './pages/admin/TrabajosListPage';
import TrabajadoresListPage from './pages/admin/TrabajadoresListPage';
import ServiceAreasDebugPage from './pages/admin/ServiceAreasDebugPage';
import NuevoTrabajoWizardPage from './pages/admin/NuevoTrabajoWizardPage';
import TrabajoDetailPage from './pages/admin/TrabajoDetailPage';
import TrabajadorDetailPage from './pages/admin/TrabajadorDetailPage';
import NuevoTrabajadorPage from './pages/admin/NuevoTrabajadorPage';
import InventarioListPage from './pages/admin/InventarioListPage';
import NuevoInventarioItemPage from './pages/admin/NuevoInventarioItemPage';
import InventarioDetailPage from './pages/admin/InventarioDetailPage';
import NominaOverviewPage from './pages/admin/NominaOverviewPage';
import GenerarNominaPage from './pages/admin/GenerarNominaPage';
import NominaDetailPage from './pages/admin/NominaDetailPage';
import LoginPage from './pages/admin/LoginPage';
import ClientesListPage from './pages/admin/ClientesListPage';
import NuevoClientePage from './pages/admin/NuevoClientePage';
import ClienteDetailPage from './pages/admin/ClienteDetailPage';
import ComoFuncionaPage from './pages/public/ComoFuncionaPage';
import ContactoPage from './pages/public/ContactoPage';

function App() {
  return (
    <LanguageProvider>
      <AdminAuthProvider>
        <HashRouter>
          <div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
          <Routes>
            {/* Admin Login - Public */}
            <Route path="/admin/login" element={<LoginPage />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <AdminRouteGuard>
                <AdminLayout />
              </AdminRouteGuard>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="trabajos" element={<TrabajosListPage />} />
              <Route path="trabajos/nuevo" element={<NuevoTrabajoWizardPage />} />
              <Route path="trabajos/:id" element={<TrabajoDetailPage />} />
              <Route path="trabajadores" element={<TrabajadoresListPage />} />
              <Route path="trabajadores/nuevo" element={<NuevoTrabajadorPage />} />
              <Route path="trabajadores/:id" element={<TrabajadorDetailPage />} />
              <Route path="clientes" element={<ClientesListPage />} />
              <Route path="clientes/nuevo" element={<NuevoClientePage />} />
              <Route path="clientes/:id" element={<ClienteDetailPage />} />
              <Route path="inventario" element={<InventarioListPage />} />
              <Route path="inventario/nuevo" element={<NuevoInventarioItemPage />} />
              <Route path="inventario/:id" element={<InventarioDetailPage />} />
              <Route path="nomina" element={<NominaOverviewPage />} />
              <Route path="nomina/nueva" element={<GenerarNominaPage />} />
              <Route path="nomina/:id" element={<NominaDetailPage />} />
              <Route path="service-areas-debug" element={<ServiceAreasDebugPage />} />
            </Route>
            
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="servicios" element={<ServiciosPage />} />
              <Route path="trabajos-realizados" element={<TrabajosRealizadosPage />} />
              <Route path="trabajos/:id/public" element={<TrabajoPublicPage />} />
              <Route path="como-funciona" element={<ComoFuncionaPage />} />
              <Route path="agenda" element={<AgendaPage />} />
              <Route path="contacto" element={<ContactoPage />} />
            </Route>
          </Routes>
          </div>
        </HashRouter>
      </AdminAuthProvider>
    </LanguageProvider>
  );
}

export default App;