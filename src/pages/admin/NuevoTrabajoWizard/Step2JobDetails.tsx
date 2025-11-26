import type { WizardJobData } from './types';

interface Step2Props {
  data: WizardJobData;
  updateData: (updates: Partial<WizardJobData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SERVICE_TYPES = [
  { 
    value: 'plumbing', 
    label: 'Plomería',
    title: 'Trabajo de plomería',
    templates: ['Fuga de agua', 'Destape de drenaje', 'Cambio de llave', 'Reparación de tubería']
  },
  { 
    value: 'electrical', 
    label: 'Electricidad',
    title: 'Trabajo eléctrico',
    templates: ['Luz no funciona', 'Instalar tomacorriente', 'Cambiar switch', 'Problema eléctrico']
  },
  { 
    value: 'drywall_paint', 
    label: 'Drywall y Pintura',
    title: 'Trabajo de drywall y pintura',
    templates: ['Pintar habitación', 'Reparar pared', 'Parchar agujero', 'Trabajo de pintura']
  },
  { 
    value: 'carpentry', 
    label: 'Carpintería',
    title: 'Trabajo de carpintería',
    templates: ['Instalar puerta', 'Reparar ventana', 'Hacer estante', 'Trabajo de madera']
  },
  { 
    value: 'flooring', 
    label: 'Pisos',
    title: 'Trabajo de pisos',
    templates: ['Instalar piso', 'Reparar piso', 'Cambiar baldosas', 'Trabajo de pisos']
  },
  { 
    value: 'handyman', 
    label: 'Handyman',
    title: 'Reparaciones del hogar',
    templates: ['Reparaciones varias', 'Mantenimiento general', 'Arreglos menores', 'Remodelación completa']
  },
  { 
    value: 'other', 
    label: 'Otro',
    title: 'Trabajo especializado',
    templates: ['Trabajo personalizado', 'Servicio especial', 'Consultoría técnica']
  }
];



export default function Step2JobDetails({ data, updateData, onNext, onBack }: Step2Props) {
  const selectedServiceType = SERVICE_TYPES.find(type => type.value === data.service_type);

  const handleServiceTypeChange = (serviceType: string) => {
    const selectedType = SERVICE_TYPES.find(type => type.value === serviceType);
    updateData({ 
      service_type: serviceType,
      title: selectedType?.title || '',
      description: '' // Reset description when service type changes
    });
  };

  const handleDescriptionTemplate = (template: string) => {
    updateData({ description: template });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.service_type || !data.scheduled_date) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Paso 2: Detalles del trabajo</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm md:text-base font-medium text-slate-800 mb-3">
            ¿Qué tipo de trabajo es? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICE_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleServiceTypeChange(type.value)}
                className={`p-4 text-left border-2 rounded-xl transition-all ${
                  data.service_type === type.value
                    ? 'border-primary bg-primary/5 text-primary font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-base font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {data.service_type && (
          <div>
            <label className="block text-sm md:text-base font-medium text-slate-800 mb-3">
              Título del trabajo
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
              className="w-full px-4 py-3 text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-slate-50"
              placeholder="Se generará automáticamente"
            />
          </div>
        )}

        {selectedServiceType && (
          <div>
            <label className="block text-sm md:text-base font-medium text-slate-800 mb-3">
              ¿Qué problema hay?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {selectedServiceType.templates.map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDescriptionTemplate(template)}
                  className={`p-3 text-left text-sm border rounded-lg transition-colors ${
                    data.description === template
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {template}
                </button>
              ))}
            </div>
            <textarea
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="O describe el problema con tus propias palabras..."
            />
          </div>
        )}

        {data.service_type && (
          <div>
            <label className="block text-sm md:text-base font-medium text-slate-800 mb-2">
              ¿Cuándo empezar?
            </label>
            <input
              type="date"
              value={data.scheduled_date}
              onChange={(e) => updateData({ scheduled_date: e.target.value })}
              className="w-full px-4 py-3 text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary max-w-sm"
              required
            />
          </div>
        )}
      </div>

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
          disabled={!data.service_type || !data.scheduled_date}
          className="px-6 py-3 text-base bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Siguiente →
        </button>
      </div>
    </form>
  );
}