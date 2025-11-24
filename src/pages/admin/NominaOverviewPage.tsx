import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { payrollService } from '../../services/payrollService';
import type { PayrollPeriod, PayrollPeriodType } from '../../types/payroll';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';
import AdminStatusBadge from '../../components/admin/ui/AdminStatusBadge';

export default function NominaOverviewPage() {
  const navigate = useNavigate();
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
      <AdminPageLayout title="Nómina" subtitle="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando nóminas...</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Nómina"
      subtitle="Gestiona los períodos de pago de tus trabajadores"
      primaryAction={{
        label: "Generar Nómina",
        onClick: () => navigate('/admin/nomina/nueva'),
        icon: "🧾"
      }}
    >
      <AdminSectionCard title={`Períodos de nómina (${periods.length})`}>
        {periods.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧾</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No hay períodos de nómina
            </h3>
            <p className="text-slate-600 mb-6">
              Comienza generando tu primer período de nómina
            </p>
            <button
              onClick={() => navigate('/admin/nomina/nueva')}
              className="inline-flex items-center gap-3 h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm transition-colors text-base"
            >
              <span>🧾</span> Generar Nómina
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full table-auto text-base">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left min-w-[120px]">Tipo</th>
                  <th className="px-4 py-3 text-left min-w-[140px]">Fechas</th>
                  <th className="px-4 py-3 text-left min-w-[100px]">Estado</th>
                  <th className="px-4 py-3 text-right min-w-[100px]">Total</th>
                  <th className="px-4 py-3 text-center min-w-[120px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {periods.map((period) => (
                  <tr key={period.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {getPeriodTypeLabel(period.period_type)}
                    </td>
                    <td className="px-4 py-3 text-slate-700 text-sm">
                      {formatDateRange(period.start_date, period.end_date)}
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={period.status} variant="payroll" />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                      ${period.total_amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/admin/nomina/${period.id}`}
                        className="inline-flex items-center gap-1 h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        👁 Ver
                      </Link>
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