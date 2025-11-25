import { useState, useEffect } from 'react';
import { getJobs } from '../../services/jobsService';
import { getWorkers } from '../../services/workersService';
import { clientsService } from '../../services/clientsService';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';
import type { Job } from '../../types/job';

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [workersCount, setWorkersCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, workersData, clientsData] = await Promise.all([
        getJobs(),
        getWorkers(),
        clientsService.getAll()
      ]);
      
      setJobs(jobsData);
      setWorkersCount(workersData.length);
      setClientsCount(clientsData.length);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayJobs = jobs.filter(job => job.status === 'in_progress').length;
  const upcomingJobs = jobs.slice(0, 3);

  if (loading) {
    return (
      <AdminPageLayout title="Dashboard" subtitle="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminPageLayout>
    );
  }

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
              <p className="text-sm font-medium text-slate-600">Total Trabajos</p>
              <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-2xl">📋</span>
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
              <p className="text-sm font-medium text-slate-600">Trabajadores</p>
              <p className="text-2xl font-bold text-slate-900">{workersCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-2xl">👷</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Clientes</p>
              <p className="text-2xl font-bold text-slate-900">{clientsCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-2xl">👥</span>
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