import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkers } from '../../services/workersService';
import type { Worker } from '../../types/workers';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';
import AdminStatusBadge from '../../components/admin/ui/AdminStatusBadge';

export default function TrabajadoresListPage() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      setLoading(true);
      const data = await getWorkers();
      setWorkers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading workers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminPageLayout title="Trabajadores" subtitle="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando trabajadores...</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  if (error) {
    return (
      <AdminPageLayout title="Trabajadores" subtitle="Error al cargar">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          Error: {error}
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Trabajadores"
      subtitle="Gestiona tu equipo de trabajo"
      primaryAction={{
        label: "Nuevo Trabajador",
        onClick: () => navigate('/admin/trabajadores/nuevo'),
        icon: "👷"
      }}
    >
      <AdminSectionCard title={`Lista de trabajadores (${workers.length})`}>
        {workers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No hay trabajadores registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm md:text-base">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Rol</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Teléfono</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Estado</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Tipo de pago</th>
                  <th className="px-4 py-3 text-right text-xs md:text-sm font-semibold text-slate-600">Tarifa/hora</th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {workers.map((worker) => (
                  <tr key={worker.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 align-top font-medium text-slate-900">
                      {worker.first_name} {worker.last_name}
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">{worker.role}</td>
                    <td className="px-4 py-3 align-top text-slate-700">{worker.phone || '-'}</td>
                    <td className="px-4 py-3 align-top">
                      <AdminStatusBadge status={worker.status} variant="worker" />
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700 capitalize">
                      {worker.pay_type.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 align-top text-right font-medium text-slate-900">
                      {worker.hourly_rate ? `$${worker.hourly_rate.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-3 align-top text-center">
                      <button
                        onClick={() => navigate(`/admin/trabajadores/${worker.id}`)}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        👁 Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminSectionCard>
    </AdminPageLayout>
  );
}