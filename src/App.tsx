import { HashRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/public/HomePage';
import AgendaPage from './pages/public/AgendaPage';
import ServiciosPage from './pages/public/ServiciosPage';
import DashboardPage from './pages/admin/DashboardPage';
import TrabajosListPage from './pages/admin/TrabajosListPage';
import LoginPage from './pages/admin/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder components
const TrabajosRealizadosPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Trabajos Realizados</h1><p>Página en construcción...</p></div>;
const ComoFuncionaPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Cómo Funciona</h1><p>Página en construcción...</p></div>;
const ContactoPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Contacto</h1><p>Página en construcción...</p></div>;
const TrabajoDetailPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Detalle del Trabajo</h1><p>Página en construcción...</p></div>;
const NuevoTrabajoPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Nuevo Trabajo</h1><p>Página en construcción...</p></div>;
const ClientesListPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Lista de Clientes</h1><p>Página en construcción...</p></div>;

function App() {
  return (
    <HashRouter>
      <div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        <Routes>
          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="trabajos" element={<TrabajosListPage />} />
            <Route path="trabajos/nuevo" element={<NuevoTrabajoPage />} />
            <Route path="trabajos/:id" element={<TrabajoDetailPage />} />
            <Route path="clientes" element={<ClientesListPage />} />
          </Route>
          
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="servicios" element={<ServiciosPage />} />
            <Route path="trabajos-realizados" element={<TrabajosRealizadosPage />} />
            <Route path="como-funciona" element={<ComoFuncionaPage />} />
            <Route path="agenda" element={<AgendaPage />} />
            <Route path="contacto" element={<ContactoPage />} />
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;