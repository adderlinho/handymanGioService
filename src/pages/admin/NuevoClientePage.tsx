import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientsService, type ClientInput } from '../../services/clientsService';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';
import AdminButton from '../../components/admin/ui/AdminButton';

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
    <AdminPageLayout
      title="Nuevo Cliente"
      subtitle="Agrega un nuevo cliente al sistema"
      backButton={{
        label: "Volver a clientes",
        href: "/admin/clientes"
      }}
    >
      <AdminSectionCard title="Información del cliente">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-base font-medium text-slate-800 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="block w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-slate-800 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="block w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: (312) 555-0123"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-base font-medium text-slate-800 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="block w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: (312) 555-0123"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-slate-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="block w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: juan@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-slate-800 mb-2">
                Dirección principal
              </label>
              <input
                type="text"
                value={formData.mainAddress}
                onChange={(e) => handleChange('mainAddress', e.target.value)}
                className="block w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 123 Main St, Chicago, IL"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-slate-800 mb-2">
                Notas adicionales
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Información adicional..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:gap-4">
            <AdminButton
              variant="secondary"
              onClick={() => navigate('/admin/clientes')}
              icon="←"
            >
              Cancelar
            </AdminButton>
            <AdminButton
              variant="primary"
              type="submit"
              disabled={loading || !formData.fullName || !formData.phone}
              icon="✓"
            >
              {loading ? 'Guardando...' : 'Crear Cliente'}
            </AdminButton>
          </div>
        </form>
      </AdminSectionCard>
    </AdminPageLayout>
  );
}