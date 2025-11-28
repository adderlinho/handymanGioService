import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkers } from '../../services/workersService';
import { useTranslation } from '../../i18n/LanguageContext';
import type { Worker } from '../../types/workers';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';
import AdminStatusBadge from '../../components/admin/ui/AdminStatusBadge';

export default function TrabajadoresListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      <AdminPageLayout title={t('admin.workers.title')} subtitle={t('admin.workers.loading')}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">{t('admin.workers.loading')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  if (error) {
    return (
      <AdminPageLayout title={t('admin.workers.title')} subtitle={t('admin.workers.loadError')}>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          {t('messages.error')}: {error}
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('admin.workers.title')}
      subtitle={t('admin.workers.subtitle')}
      primaryAction={{
        label: t('admin.workers.new'),
        onClick: () => navigate('/admin/trabajadores/nuevo'),
        icon: "👷"
      }}
    >
      <AdminSectionCard title={t('admin.workers.listTitle', { count: workers.length })}>
        {workers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">{t('admin.workers.noWorkers')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm md:text-base">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.workers.table.name')}</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.workers.table.role')}</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.workers.table.phone')}</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.workers.table.status')}</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.workers.table.payType')}</th>
                  <th className="px-4 py-3 text-right text-xs md:text-sm font-semibold text-slate-600">{t('admin.workers.table.hourlyRate')}</th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-slate-600">{t('admin.workers.table.actions')}</th>
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
                        👁 {t('admin.workers.table.view')}
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