import { useNavigate } from 'react-router-dom';
import { clientsService } from '../../services/clientsService';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';
import AdminButton from '../../components/admin/ui/AdminButton';
import { useFormValidation } from '../../hooks/useFormValidation';
import { commonRules } from '../../utils/validation';
import { formatPhoneNumber } from '../../utils/phoneFormat';
import { useState } from 'react';

export default function NuevoClientePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const validationRules = {
    fullName: commonRules.name,
    phone: commonRules.phone,
    email: { ...commonRules.email, required: false },
    mainAddress: { ...commonRules.address, required: false }
  };
  
  const { data: formData, errors, touched, handleChange, handleBlur, validateAll, isValid } = useFormValidation({
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    mainAddress: '',
    notes: ''
  }, validationRules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) return;

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
                  onBlur={() => handleBlur('fullName')}
                  className={`block w-full h-12 rounded-xl border bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 ${
                    errors.fullName && touched.fullName
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Ej: Juan Pérez"
                />
                {errors.fullName && touched.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-base font-medium text-slate-800 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', formatPhoneNumber(e.target.value))}
                  onBlur={() => handleBlur('phone')}
                  className={`block w-full h-12 rounded-xl border bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 ${
                    errors.phone && touched.phone
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="(312) 555-0123"
                  maxLength={17}
                />
                {errors.phone && touched.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
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
                  onChange={(e) => handleChange('whatsapp', formatPhoneNumber(e.target.value))}
                  className="block w-full h-12 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(312) 555-0123"
                  maxLength={17}
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
                  onBlur={() => handleBlur('email')}
                  className={`block w-full h-12 rounded-xl border bg-white px-4 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 ${
                    errors.email && touched.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Ej: juan@ejemplo.com"
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
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
              disabled={loading || !isValid}
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