import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkers } from '../../services/workersService';
import type { Worker, WorkerStatus } from '../../types/workers';

export default function TrabajadoresListPage() {
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

  const getStatusBadge = (status: WorkerStatus) => {
    const statusConfig = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };

    const statusLabels = {
      'active': 'Activo',
      'inactive': 'Inactivo'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando trabajadores...</p>
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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Trabajadores</h1>
        <Link
          to="/admin/trabajadores/nuevo"
          className="flex w-full md:w-auto items-center justify-center gap-2 rounded-lg bg-primary h-11 px-5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined !text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          <span className="truncate">Nuevo Trabajador</span>
        </Link>
      </div>

      {/* Workers Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium" scope="col">Nombre</th>
                <th className="px-6 py-4 font-medium" scope="col">Rol</th>
                <th className="px-6 py-4 font-medium" scope="col">Teléfono</th>
                <th className="px-6 py-4 font-medium" scope="col">Estado</th>
                <th className="px-6 py-4 font-medium" scope="col">Tipo de pago</th>
                <th className="px-6 py-4 font-medium text-right" scope="col">Tarifa/hora</th>
                <th className="px-6 py-4 font-medium text-center" scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium">{worker.first_name} {worker.last_name}</td>
                  <td className="px-6 py-4">{worker.role}</td>
                  <td className="px-6 py-4">{worker.phone || '-'}</td>
                  <td className="px-6 py-4">{getStatusBadge(worker.status)}</td>
                  <td className="px-6 py-4 capitalize">{worker.pay_type.replace('_', ' ')}</td>
                  <td className="px-6 py-4 text-right font-medium">
                    {worker.hourly_rate ? `$${worker.hourly_rate.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/trabajadores/${worker.id}`}
                        className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <span className="material-symbols-outlined !text-xl text-slate-600 dark:text-slate-400">visibility</span>
                      </Link>
                      <Link
                        to={`/admin/trabajadores/${worker.id}`}
                        className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <span className="material-symbols-outlined !text-xl text-slate-600 dark:text-slate-400">edit</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {workers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">No hay trabajadores registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}