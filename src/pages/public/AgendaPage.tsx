import { useState } from 'react';

export default function AgendaPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    jobType: '',
    preferredDate: '',
    preferredTime: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Nombre completo
                  </p>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    placeholder="Ingresa tu nombre completo"
                    type="text"
                    required
                  />
                </label>
              </div>

              {/* Phone */}
              <div>
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Teléfono / WhatsApp
                  </p>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    placeholder="Ej. 55 1234 5678"
                    type="tel"
                    required
                  />
                </label>
              </div>

              {/* Email */}
              <div>
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Correo electrónico
                  </p>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    placeholder="tucorreo@ejemplo.com"
                    type="email"
                    required
                  />
                </label>
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Dirección del inmueble
                  </p>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    placeholder="Calle, número, colonia, ciudad"
                    type="text"
                    required
                  />
                </label>
              </div>

              {/* Job Type */}
              <div className="sm:col-span-2">
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Tipo de trabajo
                  </p>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="form-select flex w-full min-w-0 flex-1 overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 px-4 text-base font-normal leading-normal"
                    required
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="plomeria">Plomería</option>
                    <option value="electricidad">Electricidad</option>
                    <option value="pintura">Pintura</option>
                    <option value="carpinteria">Carpintería</option>
                    <option value="albanileria">Albañilería</option>
                    <option value="otro">Otro</option>
                  </select>
                </label>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Fecha preferida
                  </p>
                  <input
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    type="date"
                    required
                  />
                </label>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Hora preferida
                  </p>
                  <input
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary h-12 placeholder:text-slate-500 dark:placeholder:text-gray-500 px-4 text-base font-normal leading-normal"
                    type="time"
                    required
                  />
                </label>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="flex flex-col">
                  <p className="text-slate-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2">
                    Descripción del trabajo
                  </p>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-900 focus:border-primary placeholder:text-slate-500 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
                    placeholder="Describe brevemente el problema o lo que necesitas."
                    rows={4}
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Enviar solicitud
              </button>
            </div>
          </form>

          {/* Secondary Contact Section */}
          <div className="mt-8 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">¿Prefieres contactarnos directamente?</p>
            <a
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors"
              href="https://wa.me/5551234567"
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