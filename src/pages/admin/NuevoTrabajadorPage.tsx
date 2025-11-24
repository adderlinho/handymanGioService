import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createWorker } from '../../services/workersService';
import type { Worker, WorkerPayType, WorkerStatus } from '../../types/workers';

const ROLES = [
  'Handyman',
  'Electricista',
  'Plomero',
  'Carpintero',
  'Pintor',
  'Ayudante',
  'Otro'
];

export default function NuevoTrabajadorPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    role: '',
    pay_type: 'hourly' as WorkerPayType,
    hourly_rate: '',
    overtime_rate: '',
    status: 'active' as WorkerStatus,
    start_date: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.role || !formData.pay_type) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const workerData: Partial<Worker> = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        role: formData.role,
        pay_type: formData.pay_type,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        overtime_rate: formData.overtime_rate ? parseFloat(formData.overtime_rate) : null,
        status: formData.status,
        start_date: formData.start_date || null,
        neighborhoods: null
      };

      const createdWorker = await createWorker(workerData);
      navigate(`/admin/trabajadores/${createdWorker.id}`);
    } catch (err) {
      console.error('Error creating worker:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el trabajador');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/admin/trabajadores" className="text-sm text-slate-600 hover:text-primary mb-2 inline-block">
          ← Volver a trabajadores
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Trabajador</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Información personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Información laboral</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rol *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Selecciona un rol</option>
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de pago *
                </label>
                <select
                  name="pay_type"
                  value={formData.pay_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="hourly">Por hora</option>
                  <option value="per_job">Por trabajo</option>
                  <option value="salary">Salario fijo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tarifa por hora
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tarifa horas extra
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="overtime_rate"
                    value={formData.overtime_rate}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              to="/admin/trabajadores"
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {saving ? 'Guardando...' : 'Guardar trabajador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}