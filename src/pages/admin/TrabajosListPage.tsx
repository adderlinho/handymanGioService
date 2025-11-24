import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJobs } from '../../services/jobsService';
import type { Job } from '../../types/job';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';
import AdminStatusBadge from '../../components/admin/ui/AdminStatusBadge';

export default function TrabajosListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'leads' | 'no-leads'>('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  const getServiceTypeLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      'plumbing': 'Plomería',
      'electrical': 'Electricidad',
      'drywall_paint': 'Drywall y Pintura',
      'carpentry': 'Carpintería',
      'flooring': 'Pisos',
      'other': 'Otro'
    };
    return labels[serviceType] || serviceType;
  };

  let filteredJobs = jobs.filter(job =>
    job.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.address_street?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.city?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (job.zip?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  // Apply status filter
  if (statusFilter === 'leads') {
    filteredJobs = filteredJobs.filter(job => job.status === 'lead');
  } else if (statusFilter === 'no-leads') {
    filteredJobs = filteredJobs.filter(job => job.status !== 'lead');
  }

  if (loading) {
    return (
      <AdminPageLayout title="Trabajos" subtitle="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando trabajos...</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  if (error) {
    return (
      <AdminPageLayout title="Trabajos" subtitle="Error al cargar">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          Error: {error}
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Trabajos"
      subtitle="Gestiona trabajos, leads y trabajos completados"
      primaryAction={{
        label: "Nuevo Trabajo",
        onClick: () => navigate('/admin/trabajos/nuevo'),
        icon: "🛠️"
      }}
    >
      <AdminSectionCard title="Filtros y búsqueda">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-sm md:text-base font-medium text-slate-800 mb-2">
              Buscar trabajos
            </label>
            <input
              type="text"
              placeholder="Buscar por cliente, dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full h-11 md:h-12 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm md:text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium text-slate-800 mb-2">
              Filtrar por estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'leads' | 'no-leads')}
              className="block w-full h-11 md:h-12 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm md:text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="leads">Solo leads</option>
              <option value="no-leads">Sin leads</option>
            </select>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title={`Lista de trabajos (${filteredJobs.length})`}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm md:text-base">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Trabajo</th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Cliente</th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Ubicación</th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Servicio</th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Estado</th>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Fecha</th>
                <th className="px-4 py-3 text-right text-xs md:text-sm font-semibold text-slate-600">Total</th>
                <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-slate-900">
                      {job.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top font-medium text-slate-800">
                    {job.customer_name}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-700">
                    {job.city && job.zip ? `${job.city}, ${job.zip}` : job.city || job.zip || '-'}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-700">
                    {getServiceTypeLabel(job.service_type)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <AdminStatusBadge status={job.status} variant="job" />
                  </td>
                  <td className="px-4 py-3 align-top text-slate-700">
                    {job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 align-top text-right font-semibold text-slate-900">
                    ${job.total_amount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-4 py-3 align-top text-center">
                    <Link
                      to={`/admin/trabajos/${job.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      👁 Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No se encontraron trabajos</p>
          </div>
        )}
      </AdminSectionCard>
    </AdminPageLayout>
  );
}