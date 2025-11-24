import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { payrollService } from '../../services/payrollService';
import type { PayrollPeriod, PayrollPeriodStatus, PayrollPeriodType } from '../../types/payroll';

export default function NominaOverviewPage() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPeriods();
  }, []);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const data = await payrollService.getPayrollPeriods();
      setPeriods(data);
    } catch (error) {
      console.error('Error loading payroll periods:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodTypeLabel = (type: PayrollPeriodType) => {
    const labels = {
      'weekly': 'Semanal',
      'biweekly': 'Quincenal',
      'monthly': 'Mensual'
    };
    return labels[type];
  };

  const getStatusBadge = (status: PayrollPeriodStatus) => {
    const statusConfig = {
      'draft': 'bg-gray-100 text-gray-800',
      'finalized': 'bg-blue-100 text-blue-800',
      'paid': 'bg-green-100 text-green-800'
    };

    const statusLabels = {
      'draft': 'Borrador',
      'finalized': 'Finalizado',
      'paid': 'Pagado'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('es-GT', { 
      day: 'numeric', 
      month: 'short' 
    });
    const end = new Date(endDate).toLocaleDateString('es-GT', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    return `${start} - ${end}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nómina</h1>
        <Link
          to="/admin/nomina/nueva"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Generar nómina
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tipo de periodo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rango de fechas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Monto total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {periods.map((period) => (
                <tr key={period.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {getPeriodTypeLabel(period.period_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {formatDateRange(period.start_date, period.end_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(period.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    ${period.total_amount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/nomina/${period.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {periods.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">payments</span>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No hay períodos de nómina
            </h3>
            <p className="text-slate-500 mb-4">
              Comienza generando tu primer período de nómina
            </p>
            <Link
              to="/admin/nomina/nueva"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              Generar nómina
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}