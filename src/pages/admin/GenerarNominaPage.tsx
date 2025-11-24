import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { payrollService } from '../../services/payrollService';
import { getWorkers } from '../../services/workersService';
import type { PayrollPeriodType, AggregatedHoursPerWorker } from '../../types/payroll';
import type { Worker } from '../../types/workers';

interface WorkerPayrollData {
  worker: Worker;
  hours_regular: number;
  hours_overtime: number;
  bonuses: number;
  deductions: number;
  gross_pay: number;
  net_pay: number;
}

export default function GenerarNominaPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1 data
  const [periodData, setPeriodData] = useState({
    period_type: 'biweekly' as PayrollPeriodType,
    start_date: '',
    end_date: ''
  });

  // Step 2 data
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [, setAggregatedHours] = useState<AggregatedHoursPerWorker[]>([]);
  const [payrollData, setPayrollData] = useState<WorkerPayrollData[]>([]);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const workersData = await getWorkers();
      setWorkers(workersData);
    } catch (error) {
      console.error('Error loading workers:', error);
    }
  };

  const handleCalculateHours = async () => {
    if (!periodData.start_date || !periodData.end_date) return;

    try {
      setLoading(true);
      const hours = await payrollService.aggregateHoursByWorkerForRange(
        periodData.start_date,
        periodData.end_date
      );
      setAggregatedHours(hours);

      // Merge with workers data
      const payrollDataArray: WorkerPayrollData[] = workers.map(worker => {
        const workerHours = hours.find(h => h.worker_id === worker.id);
        const regularHours = workerHours?.hours_regular || 0;
        const overtimeHours = workerHours?.hours_overtime || 0;
        const regularRate = worker.hourly_rate || 0;
        const overtimeRate = worker.overtime_rate || regularRate * 1.5;
        
        const grossPay = (regularHours * regularRate) + (overtimeHours * overtimeRate);
        
        return {
          worker,
          hours_regular: regularHours,
          hours_overtime: overtimeHours,
          bonuses: 0,
          deductions: 0,
          gross_pay: grossPay,
          net_pay: grossPay
        };
      });

      setPayrollData(payrollDataArray);
      setStep(2);
    } catch (error) {
      console.error('Error calculating hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateWorkerData = (index: number, field: keyof WorkerPayrollData, value: number) => {
    const updated = [...payrollData];
    updated[index] = { ...updated[index], [field]: value };
    
    // Recalculate net_pay
    if (field === 'hours_regular' || field === 'hours_overtime' || field === 'bonuses' || field === 'deductions') {
      const worker = updated[index];
      const regularRate = worker.worker.hourly_rate || 0;
      const overtimeRate = worker.worker.overtime_rate || regularRate * 1.5;
      const grossPay = (worker.hours_regular * regularRate) + (worker.hours_overtime * overtimeRate);
      updated[index].gross_pay = grossPay;
      updated[index].net_pay = grossPay + worker.bonuses - worker.deductions;
    }
    
    setPayrollData(updated);
  };

  const handleSavePayroll = async (finalize = false) => {
    try {
      setLoading(true);
      
      const totalAmount = payrollData.reduce((sum, data) => sum + data.net_pay, 0);
      
      // Create payroll period
      const period = await payrollService.createPayrollPeriod({
        period_type: periodData.period_type,
        start_date: periodData.start_date,
        end_date: periodData.end_date,
        status: finalize ? 'finalized' : 'draft',
        total_amount: totalAmount
      });

      // Create payroll entries
      for (const data of payrollData) {
        if (data.hours_regular > 0 || data.hours_overtime > 0 || data.bonuses > 0) {
          await payrollService.createPayrollEntry({
            period_id: period.id,
            worker_id: data.worker.id,
            hours_regular: data.hours_regular,
            hours_overtime: data.hours_overtime,
            rate_regular: data.worker.hourly_rate || 0,
            rate_overtime: data.worker.overtime_rate || (data.worker.hourly_rate || 0) * 1.5,
            bonuses: data.bonuses,
            deductions: data.deductions,
            gross_pay: data.gross_pay,
            net_pay: data.net_pay
          });
        }
      }

      navigate(`/admin/nomina/${period.id}`);
    } catch (error) {
      console.error('Error saving payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalToPay = payrollData.reduce((sum, data) => sum + data.net_pay, 0);
  const workersIncluded = payrollData.filter(data => data.hours_regular > 0 || data.hours_overtime > 0 || data.bonuses > 0).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/nomina')}
          className="flex items-center justify-center rounded-lg h-10 w-10 hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold">Generar nómina</h1>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-6">Paso 1: Seleccionar período</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipo de período
              </label>
              <select
                value={periodData.period_type}
                onChange={(e) => setPeriodData(prev => ({ ...prev, period_type: e.target.value as PayrollPeriodType }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quincenal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Fecha de inicio
              </label>
              <input
                type="date"
                value={periodData.start_date}
                onChange={(e) => setPeriodData(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Fecha de fin
              </label>
              <input
                type="date"
                value={periodData.end_date}
                onChange={(e) => setPeriodData(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleCalculateHours}
              disabled={loading || !periodData.start_date || !periodData.end_date}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Calculando...' : 'Calcular horas'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6">Paso 2: Revisar y ajustar nómina</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-700">Trabajador</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-700">H. Normales</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-700">H. Extra</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-700">Tarifa Normal</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-700">Tarifa Extra</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-700">Bonos</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-700">Deducciones</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-700">Pago Bruto</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-700">Pago Neto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {payrollData.map((data, index) => (
                    <tr key={data.worker.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{data.worker.first_name} {data.worker.last_name}</div>
                          <div className="text-xs text-slate-500">{data.worker.role}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={data.hours_regular}
                          onChange={(e) => updateWorkerData(index, 'hours_regular', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-right border border-slate-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={data.hours_overtime}
                          onChange={(e) => updateWorkerData(index, 'hours_overtime', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-right border border-slate-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">${data.worker.hourly_rate || 0}</td>
                      <td className="px-4 py-3 text-right">${data.worker.overtime_rate || (data.worker.hourly_rate || 0) * 1.5}</td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={data.bonuses}
                          onChange={(e) => updateWorkerData(index, 'bonuses', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-right border border-slate-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={data.deductions}
                          onChange={(e) => updateWorkerData(index, 'deductions', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-right border border-slate-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">${data.gross_pay.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-bold text-primary">${data.net_pay.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Resumen</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600">Total a pagar en el período</p>
                <p className="text-2xl font-bold text-primary">${totalToPay.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Trabajadores incluidos</p>
                <p className="text-2xl font-bold">{workersIncluded}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={() => handleSavePayroll(false)}
                disabled={loading}
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar borrador'}
              </button>
              <button
                onClick={() => handleSavePayroll(true)}
                disabled={loading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar y finalizar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}