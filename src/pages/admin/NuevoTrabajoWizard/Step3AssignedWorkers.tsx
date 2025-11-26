import { useState, useEffect } from 'react';
import { getWorkers } from '../../../services/workersService';
import type { Worker } from '../../../types/workers';
import type { WizardJobData } from './types';

interface Step3Props {
  data: WizardJobData;
  updateData: (updates: Partial<WizardJobData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3AssignedWorkers({ data, updateData, onNext, onBack }: Step3Props) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const workersData = await getWorkers();
      setWorkers(workersData.filter(w => w.status === 'active'));
    } catch (error) {
      console.error('Error loading workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerToggle = (workerId: string) => {
    const currentSelected = data.selectedWorkers;
    const isSelected = currentSelected.includes(workerId);
    
    if (isSelected) {
      updateData({
        selectedWorkers: currentSelected.filter(id => id !== workerId)
      });
    } else {
      updateData({
        selectedWorkers: [...currentSelected, workerId]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.selectedWorkers.length === 0) return;
    onNext();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Paso 3: ¿Quién va a trabajar?</h2>
        <p className="text-slate-600 mb-6">Selecciona los técnicos para este trabajo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workers.map((worker) => {
          const isSelected = data.selectedWorkers.includes(worker.id);
          return (
            <div
              key={worker.id}
              className={`p-6 border-2 rounded-xl transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-slate-600">
                    {worker.first_name[0]}{worker.last_name[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {worker.first_name} {worker.last_name}
                </h3>
                <p className="text-slate-600">{worker.role}</p>
                {worker.hourly_rate && (
                  <p className="text-sm text-slate-500 mt-1">
                    ${worker.hourly_rate}/hora
                  </p>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => handleWorkerToggle(worker.id)}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
                  isSelected
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isSelected ? '✓ Asignado' : 'Asignar'}
              </button>
            </div>
          );
        })}
      </div>

      {workers.length === 0 && (
        <div className="text-center py-8 text-slate-600">
          No hay técnicos activos disponibles
        </div>
      )}

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-base border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
        >
          ← Atrás
        </button>
        <button
          type="submit"
          disabled={data.selectedWorkers.length === 0}
          className="px-6 py-3 text-base bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Siguiente →
        </button>
      </div>
    </form>
  );
}