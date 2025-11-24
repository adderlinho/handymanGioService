import { useState, useEffect } from 'react';
import { getWorkers } from '../../../services/workersService';
import type { Worker } from '../../../types/workers';
import type { WizardJobData } from './types';

interface Step4Props {
  data: WizardJobData;
  updateData: (updates: Partial<WizardJobData>) => void;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}

export default function Step4PricingSummary({ data, updateData, onBack, onSave, saving }: Step4Props) {
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    // Auto-calculate total when pricing fields change
    const total = data.travel_fee + data.labor_total + data.materials_total + data.other_fees;
    if (total !== data.total_amount) {
      updateData({ total_amount: total });
    }
  }, [data.travel_fee, data.labor_total, data.materials_total, data.other_fees]);

  const loadWorkers = async () => {
    try {
      const workersData = await getWorkers();
      setWorkers(workersData);
    } catch (error) {
      console.error('Error loading workers:', error);
    }
  };

  const selectedWorkersList = workers.filter(w => data.selectedWorkers.includes(w.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Paso 4: Precios y resumen</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pricing Form */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Precios</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Cargo por desplazamiento
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.travel_fee}
                  onChange={(e) => updateData({ travel_fee: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Mano de obra
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.labor_total}
                  onChange={(e) => updateData({ labor_total: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Materiales
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.materials_total}
                  onChange={(e) => updateData({ materials_total: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Otros cargos
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.other_fees}
                  onChange={(e) => updateData({ other_fees: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total del trabajo</span>
                <span className="text-2xl font-bold text-primary">
                  ${data.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Resumen del trabajo</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-slate-900">Cliente</h4>
              <p className="text-slate-600">{data.customer_name}</p>
              {data.customer_phone && <p className="text-slate-600">{data.customer_phone}</p>}
            </div>

            <div>
              <h4 className="font-medium text-slate-900">Dirección</h4>
              <p className="text-slate-600">
                {data.address_street}
                {data.address_unit && `, ${data.address_unit}`}
              </p>
              <p className="text-slate-600">
                {data.city}, {data.state} {data.zip}
              </p>
              {data.service_area_name && (
                <p className="text-primary font-medium">Zona: {data.service_area_name}</p>
              )}
            </div>

            <div>
              <h4 className="font-medium text-slate-900">Trabajo</h4>
              <p className="text-slate-600">{data.title}</p>
              <p className="text-slate-600">Tipo: {data.service_type}</p>
              {data.scheduled_date && (
                <p className="text-slate-600">
                  Fecha: {new Date(data.scheduled_date).toLocaleDateString()}
                </p>
              )}
              {data.time_window && (
                <p className="text-slate-600">Horario: {data.time_window}</p>
              )}
            </div>

            {selectedWorkersList.length > 0 && (
              <div>
                <h4 className="font-medium text-slate-900">Técnicos asignados</h4>
                <ul className="text-slate-600">
                  {selectedWorkersList.map((worker) => (
                    <li key={worker.id}>
                      {worker.first_name} {worker.last_name} - {worker.role}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t">
              <h4 className="font-medium text-slate-900 mb-2">Desglose de precios</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Desplazamiento:</span>
                  <span>${data.travel_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mano de obra:</span>
                  <span>${data.labor_total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Materiales:</span>
                  <span>${data.materials_total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Otros:</span>
                  <span>${data.other_fees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total:</span>
                  <span>${data.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Atrás
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          {saving ? 'Guardando...' : 'Guardar trabajo'}
        </button>
      </div>
    </div>
  );
}