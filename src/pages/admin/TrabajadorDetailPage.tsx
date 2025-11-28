import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWorkerById, updateWorker } from '../../services/workersService';
import { getJobWorkersByWorker } from '../../services/jobWorkersService';
import { getJobsByIds } from '../../services/jobsService';
import { formatPhoneNumber } from '../../utils/phoneFormat';
import { useTranslation } from '../../i18n/LanguageContext';
import type { Worker, WorkerStatus, WorkerPayType } from '../../types/workers';
import type { Job, JobStatus } from '../../types/job';
import type { JobWorker } from '../../types/jobWorkers';

export default function TrabajadorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [workerJobs, setWorkerJobs] = useState<(JobWorker & { job: Job })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id) {
      loadWorkerData(id);
    }
  }, [id]);

  const loadWorkerData = async (workerId: string) => {
    try {
      setLoading(true);
      const [workerData, jobWorkersData] = await Promise.all([
        getWorkerById(workerId),
        getJobWorkersByWorker(workerId)
      ]);

      if (!workerData) {
        setError(t('admin.workers.detail.notFound'));
        return;
      }

      setWorker(workerData);

      // Get jobs for this worker
      if (jobWorkersData.length > 0) {
        const jobIds = jobWorkersData.map(jw => jw.job_id);
        const jobs = await getJobsByIds(jobIds);
        
        const enrichedWorkerJobs = jobWorkersData.map(jw => ({
          ...jw,
          job: jobs.find(j => j.id === jw.job_id)!
        })).filter(jw => jw.job);

        setWorkerJobs(enrichedWorkerJobs);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.workers.detail.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: WorkerStatus) => {
    const config = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };
    const labels = {
      'active': t('status.active'),
      'inactive': t('status.inactive')
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getJobStatusBadge = (status: JobStatus) => {
    const statusConfig = {
      'lead': 'bg-gray-100 text-gray-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-amber-100 text-amber-800',
      'completed': 'bg-green-100 text-green-800',
      'invoiced': 'bg-cyan-100 text-cyan-800',
      'paid': 'bg-emerald-100 text-emerald-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    const statusLabels = {
      'lead': t('status.lead'),
      'scheduled': t('status.scheduled'),
      'in_progress': t('status.in_progress'),
      'completed': t('status.completed'),
      'invoiced': t('status.invoiced'),
      'paid': t('status.paid'),
      'cancelled': t('status.cancelled')
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const getServiceTypeLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      'plumbing': t('service.plumbing'),
      'electrical': t('service.electrical'),
      'drywall_paint': t('service.drywall_paint'),
      'carpentry': t('service.carpentry'),
      'flooring': t('service.flooring'),
      'other': t('service.other')
    };
    return labels[serviceType] || serviceType;
  };

  const getPayTypeLabel = (payType: WorkerPayType) => {
    const labels = {
      'hourly': t('admin.workers.form.payType.hourly'),
      'per_job': t('admin.workers.form.payType.perJob'),
      'salary': t('admin.workers.form.payType.salary')
    };
    return labels[payType];
  };

  // Calculate summary stats
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const recentJobs = workerJobs.filter(wj => {
    const jobDate = new Date(wj.job.scheduled_date || wj.job.created_at);
    return jobDate >= thirtyDaysAgo;
  });

  const totalRegularHours = recentJobs.reduce((sum, wj) => sum + (wj.hours_regular || 0), 0);
  const totalOvertimeHours = recentJobs.reduce((sum, wj) => sum + (wj.hours_overtime || 0), 0);
  const completedJobs = workerJobs.filter(wj => wj.job.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">{t('admin.workers.detail.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block">
          {error || t('admin.workers.detail.notFound')}
        </div>
        <div className="mt-4">
          <Link to="/admin/trabajadores" className="text-primary hover:text-primary/80">
            ← {t('admin.workers.detail.backToList')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/trabajadores" className="text-sm text-slate-600 hover:text-primary mb-2 inline-block">
            ← {t('admin.workers.detail.backToList')}
          </Link>
          <h1 className="text-3xl font-bold">{t('admin.workers.detail.title')}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Worker Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('admin.workers.detail.section.summary')}</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50"
              >
                {editing ? t('common.cancel') : t('common.edit')}
              </button>
            </div>

            {editing ? (
              <WorkerEditForm
                worker={worker}
                onSave={async (updatedData) => {
                  try {
                    const updated = await updateWorker(worker.id, updatedData);
                    setWorker(updated);
                    setEditing(false);
                  } catch (err) {
                    console.error('Error updating worker:', err);
                  }
                }}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {worker.first_name} {worker.last_name}
                  </h3>
                  <p className="text-slate-600">{worker.role}</p>
                  <div className="mt-2">{getStatusBadge(worker.status)}</div>
                </div>

                {worker.phone && (
                  <div>
                    <p className="text-sm text-slate-600">{t('common.phone')}</p>
                    <a href={`tel:${worker.phone}`} className="font-medium text-primary hover:text-primary/80">
                      {worker.phone}
                    </a>
                  </div>
                )}

                {worker.email && (
                  <div>
                    <p className="text-sm text-slate-600">{t('common.email')}</p>
                    <a href={`mailto:${worker.email}`} className="font-medium text-primary hover:text-primary/80">
                      {worker.email}
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-sm text-slate-600">{t('admin.workers.form.payType')}</p>
                  <p className="font-medium">{getPayTypeLabel(worker.pay_type)}</p>
                </div>

                {worker.hourly_rate && (
                  <div>
                    <p className="text-sm text-slate-600">{t('admin.workers.form.hourlyRate')}</p>
                    <p className="font-medium">${worker.hourly_rate}/hr</p>
                  </div>
                )}

                {worker.overtime_rate && (
                  <div>
                    <p className="text-sm text-slate-600">{t('admin.workers.form.overtimeRate')}</p>
                    <p className="font-medium">${worker.overtime_rate}/hr</p>
                  </div>
                )}

                {worker.start_date && (
                  <div>
                    <p className="text-sm text-slate-600">{t('admin.workers.form.startDate')}</p>
                    <p className="font-medium">{new Date(worker.start_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hours Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">{t('admin.workers.detail.section.summary30Days')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">{t('admin.workers.detail.field.regularHours')}:</span>
                <span className="font-medium">{totalRegularHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{t('admin.workers.detail.field.overtimeHours')}:</span>
                <span className="font-medium">{totalOvertimeHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{t('admin.workers.detail.field.completedJobs')}:</span>
                <span className="font-medium">{completedJobs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Jobs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4">{t('admin.workers.detail.section.workerJobs')}</h3>
            
            {workerJobs.length === 0 ? (
              <p className="text-slate-600">{t('admin.workers.detail.noJobsAssigned')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-600 uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">{t('common.date')}</th>
                      <th className="px-4 py-3 text-left">{t('admin.workers.detail.table.title')}</th>
                      <th className="px-4 py-3 text-left">{t('admin.workers.detail.table.type')}</th>
                      <th className="px-4 py-3 text-left">{t('common.status')}</th>
                      <th className="px-4 py-3 text-right">{t('admin.workers.detail.table.regularHours')}</th>
                      <th className="px-4 py-3 text-right">{t('admin.workers.detail.table.overtimeHours')}</th>
                      <th className="px-4 py-3 text-right">{t('admin.workers.detail.table.cost')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workerJobs.map((wj) => (
                      <tr key={wj.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          {wj.job.scheduled_date 
                            ? new Date(wj.job.scheduled_date).toLocaleDateString()
                            : new Date(wj.job.created_at).toLocaleDateString()
                          }
                        </td>
                        <td className="px-4 py-3">
                          <Link 
                            to={`/admin/trabajos/${wj.job.id}`}
                            className="font-medium text-primary hover:text-primary/80"
                          >
                            {wj.job.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{getServiceTypeLabel(wj.job.service_type)}</td>
                        <td className="px-4 py-3">{getJobStatusBadge(wj.job.status)}</td>
                        <td className="px-4 py-3 text-right">{wj.hours_regular || 0}h</td>
                        <td className="px-4 py-3 text-right">{wj.hours_overtime || 0}h</td>
                        <td className="px-4 py-3 text-right">
                          {wj.labor_cost ? `$${wj.labor_cost}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Worker Edit Form Component
interface WorkerEditFormProps {
  worker: Worker;
  onSave: (data: Partial<Worker>) => void;
  onCancel: () => void;
}

function WorkerEditForm({ worker, onSave, onCancel }: WorkerEditFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    phone: worker.phone || '',
    email: worker.email || '',
    role: worker.role,
    pay_type: worker.pay_type,
    hourly_rate: worker.hourly_rate?.toString() || '',
    overtime_rate: worker.overtime_rate?.toString() || '',
    status: worker.status,
    start_date: worker.start_date || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      phone: formData.phone.trim() || null,
      email: formData.email.trim() || null,
      role: formData.role,
      pay_type: formData.pay_type as WorkerPayType,
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      overtime_rate: formData.overtime_rate ? parseFloat(formData.overtime_rate) : null,
      status: formData.status as WorkerStatus,
      start_date: formData.start_date || null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t('common.phone')}</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))}
          className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary text-sm"
          placeholder="(312) 555-0123"
          maxLength={17}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('common.email')}</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('common.status')}</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as WorkerStatus }))}
          className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="active">{t('status.active')}</option>
          <option value="inactive">{t('status.inactive')}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('admin.workers.form.hourlyRate')}</label>
        <input
          type="number"
          step="0.01"
          value={formData.hourly_rate}
          onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-primary/90"
        >
          {t('admin.workers.detail.saveChanges')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50"
        >
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );
}