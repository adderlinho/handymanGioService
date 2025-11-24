import { useState } from 'react';
import { createLeadFromPublicForm } from '../../services/jobsService';
import { getServiceAreaByZip } from '../../services/serviceAreasService';

export default function AgendaPage() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    address_street: '',
    address_unit: '',
    city: 'Chicago',
    state: 'IL',
    zip: '',
    service_type: '',
    scheduled_date: '',
    time_window: '',
    description: '',
    contact_preference: 'phone'
  });

  const [serviceArea, setServiceArea] = useState<{ id: string; name: string } | null>(null);
  const [zipWarning, setZipWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleZipCheck = async (zipCode: string) => {
    if (!zipCode || zipCode.length < 5) {
      setServiceArea(null);
      setZipWarning(false);
      return;
    }
    
    try {
      const area = await getServiceAreaByZip(zipCode);
      if (area) {
        setServiceArea({ id: area.id, name: area.name });
        setZipWarning(false);
      } else {
        setServiceArea(null);
        setZipWarning(true);
      }
    } catch (error) {
      console.error('Error checking ZIP:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name.trim() || !formData.customer_phone.trim() || 
        !formData.service_type || !formData.description.trim()) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    if (formData.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createLeadFromPublicForm({
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || undefined,
        address_street: formData.address_street.trim() || undefined,
        address_unit: formData.address_unit.trim() || undefined,
        city: formData.city,
        state: formData.state,
        zip: formData.zip.trim() || undefined,
        service_area_id: serviceArea?.id || null,
        service_type: formData.service_type,
        description: formData.description.trim(),
        scheduled_date: formData.scheduled_date || null,
        time_window: formData.time_window || null
      });

      setSuccess(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Hubo un error al enviar tu solicitud. Por favor inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'zip') {
      handleZipCheck(value);
    }
  };

  if (success) {
    return (
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-800 mb-4">¡Gracias por tu solicitud!</h1>
            <p className="text-green-700 mb-6">
              Hemos recibido tu solicitud de servicio. Nuestro equipo la revisará y te contactaremos pronto 
              para confirmar los detalles y programar tu cita.
            </p>
            <p className="text-sm text-green-600">
              Tiempo estimado de respuesta: 2-4 horas durante horario laboral
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 sm:p-10 lg:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl sm:text-4xl font-bold leading-tight">
              Agenda tu cita
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal mt-3">
              Completa el siguiente formulario para solicitar nuestros servicios. Nos pondremos en contacto contigo a la brevedad.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Nombre completo *
                  </p>
                  <input
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    placeholder="Ingresa tu nombre completo"
                    type="text"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Teléfono / WhatsApp *
                  </p>
                  <input
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    placeholder="Ej. (312) 555-0123"
                    type="tel"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Correo electrónico
                  </p>
                  <input
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    placeholder="tucorreo@ejemplo.com"
                    type="email"
                  />
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Calle y número
                  </p>
                  <input
                    name="address_street"
                    value={formData.address_street}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    placeholder="123 Main Street"
                    type="text"
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Apto / Unidad
                  </p>
                  <input
                    name="address_unit"
                    value={formData.address_unit}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    placeholder="Apt 2B"
                    type="text"
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Código postal *
                  </p>
                  <input
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    placeholder="60614"
                    type="text"
                    required
                  />
                </label>
                {serviceArea && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                    ✓ Zona de servicio: {serviceArea.name}
                  </div>
                )}
                {zipWarning && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
                    ⚠️ Este código postal puede estar fuera de nuestra área de servicio. Igualmente revisaremos tu solicitud.
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Tipo de servicio *
                  </p>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="form-select flex w-full min-w-0 flex-1 overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 px-4 text-base font-normal leading-normal"
                    required
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="plumbing">Plomería</option>
                    <option value="electrical">Electricidad</option>
                    <option value="drywall_paint">Drywall y Pintura</option>
                    <option value="carpentry">Carpintería</option>
                    <option value="flooring">Pisos</option>
                    <option value="other">Otro</option>
                  </select>
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Fecha preferida
                  </p>
                  <input
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    type="date"
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Franja horaria preferida
                  </p>
                  <select
                    name="time_window"
                    value={formData.time_window}
                    onChange={handleChange}
                    className="form-select flex w-full min-w-0 flex-1 overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 px-4 text-base font-normal leading-normal"
                  >
                    <option value="">Selecciona una franja</option>
                    <option value="Morning">Mañana (8:00 AM - 12:00 PM)</option>
                    <option value="Afternoon">Tarde (12:00 PM - 5:00 PM)</option>
                    <option value="Evening">Noche (5:00 PM - 8:00 PM)</option>
                  </select>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Descripción del trabajo *
                  </p>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary placeholder:text-slate-500 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
                    placeholder="Describe brevemente el problema o lo que necesitas."
                    rows={4}
                    required
                  />
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    ¿Cómo prefieres que te contactemos?
                  </p>
                  <select
                    name="contact_preference"
                    value={formData.contact_preference}
                    onChange={handleChange}
                    className="form-select flex w-full min-w-0 flex-1 overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 px-4 text-base font-normal leading-normal"
                  >
                    <option value="phone">Teléfono</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Correo electrónico</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
              >
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </form>

          {/* Secondary Contact Section */}
          <div className="mt-8 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">¿Prefieres contactarnos directamente?</p>
            <a
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
              href="https://wa.me/13125550123"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6 14.2c-.3-.2-1.1-.5-1.3-.6-.2-.1-.3-.1-.5.1-.2.2-.4.5-.5.6-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.7-1-.6-.6-1-1.3-1.2-1.5-.1-.2 0-.3.1-.4s.2-.2.3-.3c.1-.1.2-.2.2-.3.1-.1.1-.3 0-.4-.1-.1-.5-1.1-.6-1.5-.2-.4-.3-.3-.5-.3h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c.1.1 1.6 2.5 4 3.5.6.2.9.4 1.2.5.5.2 1 .2 1.3.1.4-.1 1.1-.5 1.3-.9s.2-.8.1-1c-.1-.1-.2-.2-.4-.3zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18.2c-4.5 0-8.2-3.7-8.2-8.2S7.5 3.8 12 3.8 20.2 7.5 20.2 12 16.5 20.2 12 20.2z" />
              </svg>
              <span>Chatea con nosotros</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}