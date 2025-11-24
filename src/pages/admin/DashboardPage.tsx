import { mockJobs } from '../../data/jobs';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';

export default function DashboardPage() {
  const todayJobs = mockJobs.filter(job => job.status === 'in_progress').length;
  const completedJobs = mockJobs.filter(job => job.status === 'completed').length;
  const totalRevenue = mockJobs.reduce((sum, job) => sum + (job.total_amount || 0), 0);
  const upcomingJobs = mockJobs.slice(0, 3);

  return (
    <AdminPageLayout
      title="Dashboard"
      subtitle="Resumen general de tu negocio"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Trabajos Hoy</p>
              <p className="text-2xl font-bold text-slate-900">{todayJobs}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Progreso</p>
              <p className="text-2xl font-bold text-slate-900">{todayJobs}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <span className="text-2xl">🔨</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completados</p>
              <p className="text-2xl font-bold text-slate-900">{completedJobs}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Ingresos</p>
              <p className="text-2xl font-bold text-slate-900">${totalRevenue.toFixed(0)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <AdminSectionCard 
        title="Próximos Trabajos"
        action={{
          label: "Ver todos",
          onClick: () => window.location.href = "/admin/trabajos"
        }}
      >
        <div className="space-y-4">
          {upcomingJobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <span className="text-lg">🔧</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{job.customer_name}</p>
                  <p className="text-sm text-slate-600">{job.service_type} • {job.address_street}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-900">${job.total_amount || 0}</p>
                <p className="text-sm text-slate-600">{job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : '-'}</p>
              </div>
            </div>
          ))}
        </div>
      </AdminSectionCard>
    </AdminPageLayout>
  );
}