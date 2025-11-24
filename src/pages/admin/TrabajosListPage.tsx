import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../../services/jobsService';
import type { Job, JobStatus } from '../../types/job';

export default function TrabajosListPage() {
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

  const getStatusBadge = (status: JobStatus) => {
    const statusConfig = {
      'lead': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'in_progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'invoiced': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'paid': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
    };

    const statusLabels = {
      'lead': 'Lead',
      'scheduled': 'Programado',
      'in_progress': 'En Progreso',
      'completed': 'Completado',
      'invoiced': 'Facturado',
      'paid': 'Pagado'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {statusLabels[status]}
      </span>
    );
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando trabajos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Heading and Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-3xl font-bold tracking-tight">Lista de Trabajos</p>
        <Link
          to="/admin/trabajos/nuevo"
          className="flex w-full md:w-auto items-center justify-center gap-2 rounded-lg bg-primary h-11 px-5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined !text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          <span className="truncate">Nuevo Trabajo</span>
        </Link>
      </div>

      {/* Controls: Search and Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div className="lg:col-span-2">
            <label className="flex flex-col min-w-40 h-11 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-slate-600 dark:text-slate-400 flex bg-slate-100 dark:bg-slate-800/50 items-center justify-center pl-4 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-600">
                  <span className="material-symbols-outlined !text-2xl">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-l-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 h-full placeholder:text-slate-600 dark:placeholder:text-slate-400 px-4 text-sm font-normal"
                  placeholder="Buscar por cliente, dirección o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </label>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'leads' | 'no-leads')}
            className="flex h-11 shrink-0 items-center rounded-lg bg-slate-100 dark:bg-slate-800/50 px-4 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            <option value="all">Todos los trabajos</option>
            <option value="leads">Solo leads</option>
            <option value="no-leads">Sin leads</option>
          </select>
          <button className="flex h-11 shrink-0 items-center justify-between gap-x-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 px-4 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <p className="text-sm font-medium">Tipo de trabajo</p>
            <span className="material-symbols-outlined !text-xl text-slate-600 dark:text-slate-400">expand_more</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium" scope="col">Título</th>
                <th className="px-6 py-4 font-medium" scope="col">Cliente</th>
                <th className="px-6 py-4 font-medium" scope="col">Ciudad/ZIP</th>
                <th className="px-6 py-4 font-medium" scope="col">Tipo de servicio</th>
                <th className="px-6 py-4 font-medium" scope="col">Estado</th>
                <th className="px-6 py-4 font-medium" scope="col">Fecha programada</th>
                <th className="px-6 py-4 font-medium text-right" scope="col">Total</th>
                <th className="px-6 py-4 font-medium text-center" scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4 font-medium">{job.customer_name}</td>
                  <td className="px-6 py-4">{job.city && job.zip ? `${job.city}, ${job.zip}` : job.city || job.zip || '-'}</td>
                  <td className="px-6 py-4">{job.service_type}</td>
                  <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                  <td className="px-6 py-4">{job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 text-right font-medium">${job.total_amount?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/trabajos/${job.id}`}
                        className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <span className="material-symbols-outlined !text-xl text-slate-600 dark:text-slate-400">visibility</span>
                      </Link>
                      <button className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
                        <span className="material-symbols-outlined !text-xl text-slate-600 dark:text-slate-400">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Mostrando <span className="font-semibold">1</span>-<span className="font-semibold">{filteredJobs.length}</span> de <span className="font-semibold">{jobs.length}</span> trabajos
          </span>
          <div className="inline-flex items-center gap-2">
            <button className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 h-9 px-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Anterior
            </button>
            <button className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 h-9 px-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}