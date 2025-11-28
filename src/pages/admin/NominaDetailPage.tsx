import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { payrollService } from '../../services/payrollService';
import { useTranslation } from '../../i18n/LanguageContext';
import type { PayrollPeriod, PayrollEntryWithWorker, PayrollPeriodStatus } from '../../types/payroll';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';

interface PayStubModalProps {
  entry: PayrollEntryWithWorker;
  period: PayrollPeriod;
  onClose: () => void;
}

function PayStubModal({ entry, period, onClose }: PayStubModalProps) {
  const { t } = useTranslation();
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('es-GT');
    const end = new Date(endDate).toLocaleDateString('es-GT');
    return `${start} - ${end}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">{t('admin.payroll.detail.payStub')}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-center border-b pb-4">
              <h4 className="font-bold text-lg">{entry.worker_name}</h4>
              <p className="text-sm text-slate-600">{entry.worker_role}</p>
              <p className="text-sm text-slate-600">
                {t('admin.payroll.detail.period')}: {formatDateRange(period.start_date, period.end_date)}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">{t('admin.payroll.entries.hoursRegular')}:</span>
                <span className="text-sm font-medium">{entry.hours_regular || 0} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('admin.payroll.entries.rateRegular')}:</span>
                <span className="text-sm font-medium">${entry.rate_regular || 0}/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('admin.payroll.entries.hoursOvertime')}:</span>
                <span className="text-sm font-medium">{entry.hours_overtime || 0} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{t('admin.payroll.entries.rateOvertime')}:</span>
                <span className="text-sm font-medium">${entry.rate_overtime || 0}/hr</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-sm">{t('admin.payroll.entries.grossPay')}:</span>
                  <span className="text-sm font-medium">${entry.gross_pay?.toFixed(2) || '0.00'}</span>
                </div>
                {(entry.bonuses || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">{t('admin.payroll.entries.bonuses')}:</span>
                    <span className="text-sm font-medium">+${entry.bonuses?.toFixed(2)}</span>
                  </div>
                )}
                {(entry.deductions || 0) > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span className="text-sm">{t('admin.payroll.entries.deductions')}:</span>
                    <span className="text-sm font-medium">-${entry.deductions?.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('admin.payroll.entries.netPay')}:</span>
                  <span className="text-primary">${entry.net_pay?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {t('common.close')}
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                {t('admin.payroll.detail.print')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NominaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<PayrollPeriod | null>(null);
  const [entries, setEntries] = useState<PayrollEntryWithWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntryWithWorker | null>(null);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ bonuses: number; deductions: number }>({ bonuses: 0, deductions: 0 });

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [periodData, entriesData] = await Promise.all([
        payrollService.getPayrollPeriodById(id),
        payrollService.getPayrollEntriesByPeriod(id)
      ]);
      
      setPeriod(periodData);
      setEntries(entriesData);
    } catch (error) {
      console.error('Error loading payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: PayrollPeriodStatus) => {
    if (!period) return;
    
    try {
      const updated = await payrollService.updatePayrollPeriod(period.id, { status: newStatus });
      setPeriod(updated);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEditEntry = (entry: PayrollEntryWithWorker) => {
    setEditingEntry(entry.id);
    setEditValues({
      bonuses: entry.bonuses || 0,
      deductions: entry.deductions || 0
    });
  };

  const handleSaveEntry = async (entryId: number) => {
    try {
      const entry = entries.find(e => e.id === entryId);
      if (!entry) return;

      const grossPay = ((entry.hours_regular || 0) * (entry.rate_regular || 0)) + 
                      ((entry.hours_overtime || 0) * (entry.rate_overtime || 0));
      const netPay = grossPay + editValues.bonuses - editValues.deductions;

      await payrollService.updatePayrollEntry(entryId, {
        bonuses: editValues.bonuses,
        deductions: editValues.deductions,
        net_pay: netPay
      });

      // Reload data
      loadData();
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const getPeriodTypeLabel = (type: string) => {
    const labels = {
      'weekly': t('admin.payroll.periodType.weekly'),
      'biweekly': t('admin.payroll.periodType.biweekly'),
      'monthly': t('admin.payroll.periodType.monthly')
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status: PayrollPeriodStatus) => {
    const statusConfig = {
      'draft': 'bg-gray-100 text-gray-800',
      'finalized': 'bg-blue-100 text-blue-800',
      'paid': 'bg-green-100 text-green-800'
    };

    const statusLabels = {
      'draft': t('status.draft'),
      'finalized': t('status.finalized'),
      'paid': t('status.paid')
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('es-GT');
    const end = new Date(endDate).toLocaleDateString('es-GT');
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!period) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 mb-2">{t('admin.payroll.detail.notFound')}</h3>
        <button
          onClick={() => navigate('/admin/nomina')}
          className="text-primary hover:text-primary/80"
        >
          {t('admin.payroll.detail.backToPayroll')}
        </button>
      </div>
    );
  }

  return (
    <AdminPageLayout
      title={t('admin.payroll.detail.title')}
      subtitle={period ? `${t('admin.payroll.detail.period')} ${formatDateRange(period.start_date, period.end_date)}` : ''}
      backButton={{
        label: t('admin.payroll.detail.backToPayroll'),
        href: "/admin/nomina"
      }}
    >

      <AdminSectionCard 
        title={t('admin.payroll.detail.section.periodSummary')}
        action={period.status === 'draft' ? {
          label: t('admin.payroll.detail.action.markFinalized'),
          onClick: () => handleStatusUpdate('finalized')
        } : period.status === 'finalized' ? {
          label: t('admin.payroll.detail.action.markPaid'),
          onClick: () => handleStatusUpdate('paid')
        } : undefined}
      >

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-slate-600">{t('admin.payroll.form.periodType')}</p>
            <p className="font-medium">{getPeriodTypeLabel(period.period_type)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">{t('admin.payroll.detail.field.dateRange')}</p>
            <p className="font-medium">{formatDateRange(period.start_date, period.end_date)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">{t('common.status')}</p>
            <div className="mt-1">{getStatusBadge(period.status)}</div>
          </div>
          <div>
            <p className="text-sm text-slate-600">{t('admin.payroll.detail.field.totalAmount')}</p>
            <p className="text-lg font-bold text-primary">${period.total_amount?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title={t('admin.payroll.detail.section.workerDetail')}>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-700">{t('admin.payroll.entries.worker')}</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">{t('admin.payroll.entries.hoursRegular')}</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">{t('admin.payroll.entries.hoursOvertime')}</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">{t('admin.payroll.entries.rateRegular')}</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">{t('admin.payroll.entries.rateOvertime')}</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">{t('admin.payroll.entries.bonuses')}</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">{t('admin.payroll.entries.deductions')}</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">{t('admin.payroll.entries.grossPay')}</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">{t('admin.payroll.entries.netPay')}</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{entry.worker_name}</div>
                      <div className="text-xs text-slate-500">{entry.worker_role}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{entry.hours_regular || 0}</td>
                  <td className="px-4 py-3 text-right">{entry.hours_overtime || 0}</td>
                  <td className="px-4 py-3 text-right">${entry.rate_regular || 0}</td>
                  <td className="px-4 py-3 text-right">${entry.rate_overtime || 0}</td>
                  <td className="px-4 py-3 text-right">
                    {editingEntry === entry.id ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editValues.bonuses}
                        onChange={(e) => setEditValues(prev => ({ ...prev, bonuses: parseFloat(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 text-right border border-slate-300 rounded text-sm"
                      />
                    ) : (
                      `$${entry.bonuses?.toFixed(2) || '0.00'}`
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingEntry === entry.id ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editValues.deductions}
                        onChange={(e) => setEditValues(prev => ({ ...prev, deductions: parseFloat(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 text-right border border-slate-300 rounded text-sm"
                      />
                    ) : (
                      `$${entry.deductions?.toFixed(2) || '0.00'}`
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">${entry.gross_pay?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-3 text-right font-bold text-primary">${entry.net_pay?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {editingEntry === entry.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEntry(entry.id)}
                            className="text-green-600 hover:text-green-800 text-xs"
                          >
                            {t('common.save')}
                          </button>
                          <button
                            onClick={() => setEditingEntry(null)}
                            className="text-slate-600 hover:text-slate-800 text-xs"
                          >
                            {t('common.cancel')}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditEntry(entry)}
                            className="text-primary hover:text-primary/80 text-xs"
                          >
                            {t('common.edit')}
                          </button>
                          <button
                            onClick={() => setSelectedEntry(entry)}
                            className="text-slate-600 hover:text-slate-800 text-xs"
                          >
                            {t('admin.payroll.detail.action.viewPayStub')}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {entries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">{t('admin.payroll.detail.noEntries')}</p>
          </div>
        )}
      </AdminSectionCard>

      {/* Pay Stub Modal */}
      {selectedEntry && (
        <PayStubModal
          entry={selectedEntry}
          period={period}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </AdminPageLayout>
  );
}