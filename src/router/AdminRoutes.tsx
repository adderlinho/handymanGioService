import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import TrabajosListPage from '../pages/admin/TrabajosListPage';
import DashboardPage from '../pages/admin/DashboardPage';

// Placeholder components for other admin pages
const TrabajoDetailPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Detalle del Trabajo</h1><p>Página en construcción...</p></div>;
const NuevoTrabajoPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Nuevo Trabajo</h1><p>Página en construcción...</p></div>;
const ClientesListPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Lista de Clientes</h1><p>Página en construcción...</p></div>;

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="trabajos" element={<TrabajosListPage />} />
        <Route path="trabajos/nuevo" element={<NuevoTrabajoPage />} />
        <Route path="trabajos/:id" element={<TrabajoDetailPage />} />
        <Route path="clientes" element={<ClientesListPage />} />
      </Route>
    </Routes>
  );
}