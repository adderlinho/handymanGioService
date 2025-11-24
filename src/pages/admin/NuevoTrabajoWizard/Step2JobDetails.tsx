import type { WizardJobData } from './types';

interface Step2Props {
  data: WizardJobData;
  updateData: (updates: Partial<WizardJobData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SERVICE_TYPES = [
  { value: 'plumbing', label: 'Plomería' },
  { value: 'electrical', label: 'Electricidad' },
  { value: 'drywall_paint', label: 'Drywall y Pintura' },
  { value: 'carpentry', label: 'Carpintería' },
  { value: 'flooring', label: 'Pisos' },
  { value: 'other', label: 'Otro' }
];

const TIME_WINDOWS = [
  { value: 'Morning', label: 'Mañana (8:00 AM - 12:00 PM)' },
  { value: 'Afternoon', label: 'Tarde (12:00 PM - 5:00 PM)' },
  { value: 'Evening', label: 'Noche (5:00 PM - 8:00 PM)' }
];

export default function Step2JobDetails({ data, updateData, onNext, onBack }: Step2Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.title.trim() || !data.service_type) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Paso 2: Detalles del trabajo</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Título del trabajo *
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Ej. Reparación de tubería en cocina"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tipo de servicio *
          </label>
          <select
            value={data.service_type}
            onChange={(e) => updateData({ service_type: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            required
          >
            <option value="">Selecciona un tipo de servicio</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Descripción detallada
          </label>
          <textarea
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Describe el trabajo a realizar..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Fecha programada
            </label>
            <input
              type="date"
              value={data.scheduled_date}
              onChange={(e) => updateData({ scheduled_date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Franja horaria
            </label>
            <select
              value={data.time_window}
              onChange={(e) => updateData({ time_window: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Selecciona una franja</option>
              {TIME_WINDOWS.map((window) => (
                <option key={window.value} value={window.value}>
                  {window.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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