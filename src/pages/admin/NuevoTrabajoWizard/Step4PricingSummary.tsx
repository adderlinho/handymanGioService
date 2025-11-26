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

  // Remove auto-calculation since we only have one field now

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
        <h2 className="text-xl font-semibold mb-2">Paso 4: ¿Cuánto vas a cobrar?</h2>
        <p className="text-slate-600 mb-8">Ingresa el precio total por este trabajo</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Simple Price Input */}
        <div className="text-center">
          <label className="block text-lg font-medium text-slate-800 mb-4">
            Precio total del trabajo
          </label>
          <div className="relative max-w-sm mx-auto">
            <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-2xl text-slate-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data.total_amount || ''}
              onChange={(e) => updateData({ total_amount: parseFloat(e.target.value) || 0 })}
              className="w-full pl-12 pr-6 py-4 text-2xl font-bold text-center border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Simple Summary */}
        <div className="bg-slate-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-center">Resumen del trabajo</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="font-medium">Cliente:</span>
              <span>{data.customer_name}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="font-medium">Trabajo:</span>
              <span>{data.title}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="font-medium">Problema:</span>
              <span>{data.description || 'No especificado'}</span>
            </div>
            
            {data.scheduled_date && (
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="font-medium">Fecha:</span>
                <span>{new Date(data.scheduled_date).toLocaleDateString()}</span>
              </div>
            )}
            
            {selectedWorkersList.length > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="font-medium">Técnicos:</span>
                <span>{selectedWorkersList.map(w => w.first_name).join(', ')}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4 mt-4">
              <span className="text-lg font-bold">Total a cobrar:</span>
              <span className="text-2xl font-bold text-primary">
                ${data.total_amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="px-6 py-3 text-base border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          ← Atrás
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || data.total_amount <= 0}
          className="px-8 py-3 text-base bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold"
        >
          {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          {saving ? 'Guardando trabajo...' : '✓ Crear trabajo'}
        </button>
      </div>
    </div>
  );
}