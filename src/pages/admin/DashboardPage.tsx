import { Link } from 'react-router-dom';
import { mockJobs } from '../../data/jobs';

export default function DashboardPage() {
  const todayJobs = mockJobs.filter(job => job.status === 'en-curso').length;
  const completedJobs = mockJobs.filter(job => job.status === 'completado').length;
  const pendingJobs = mockJobs.filter(job => job.status === 'pendiente').length;
  const totalRevenue = mockJobs.reduce((sum, job) => sum + job.totalAmount, 0);

  const upcomingJobs = mockJobs.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Resumen general de tu negocio</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Trabajos Hoy</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayJobs}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">today</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">En Progreso</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayJobs}</p>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-lg">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">construction</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completados</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedJobs}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check_circle</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Ingresos</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">€{totalRevenue.toFixed(0)}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Próximos Trabajos</h2>
            <Link 
              to="/admin/trabajos" 
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Ver todos
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary">handyman</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{job.clientName}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{job.jobType} • {job.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-white">€{job.totalAmount}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{job.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}