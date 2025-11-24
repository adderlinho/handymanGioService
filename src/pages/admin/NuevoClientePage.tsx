import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clientsService, type ClientInput } from '../../services/clientsService';

export default function NuevoClientePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClientInput>({
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    mainAddress: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    try {
      setLoading(true);
      const client = await clientsService.create(formData);
      navigate(`/admin/clientes/${client.id}`);
    } catch (err) {
      console.error('Error creating client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ClientInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link to="/admin/clientes" className="text-sm text-slate-600 hover:text-primary mb-2 inline-block">
          ← Volver a clientes
        </Link>
        <h1 className="text-3xl font-bold">Nuevo Cliente</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre completo *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Teléfono *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dirección principal</label>
            <input
              type="text"
              value={formData.mainAddress}
              onChange={(e) => handleChange('mainAddress', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Link
              to="/admin/clientes"
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.fullName || !formData.phone}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}