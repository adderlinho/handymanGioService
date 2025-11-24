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
        <h2 className="text-xl font-semibold mb-4">Paso 3: Técnicos asignados</h2>
        <p className="text-slate-600 mb-6">Selecciona los técnicos que trabajarán en este proyecto</p>
      </div>

      <div className="space-y-3">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <input
              type="checkbox"
              id={`worker-${worker.id}`}
              checked={data.selectedWorkers.includes(worker.id)}
              onChange={() => handleWorkerToggle(worker.id)}
              className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
            />
            <label htmlFor={`worker-${worker.id}`} className="ml-3 flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    {worker.first_name} {worker.last_name}
                  </p>
                  <p className="text-sm text-slate-600">{worker.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">{worker.phone}</p>
                  {worker.hourly_rate && (
                    <p className="text-sm font-medium text-slate-900">
                      ${worker.hourly_rate}/hr
                    </p>
                  )}
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {workers.length === 0 && (
        <div className="text-center py-8 text-slate-600">
          No hay técnicos activos disponibles
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Atrás
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}