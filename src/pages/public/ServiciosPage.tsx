import { Link } from 'react-router-dom';

export default function ServiciosPage() {
  const services = [
    {
      name: 'Plomería',
      icon: 'plumbing',
      desc: 'Reparaciones e instalaciones de plomería',
      details: [
        'Reparación de fugas',
        'Instalación de grifos y lavabos',
        'Destapado de drenajes',
        'Reparación de inodoros',
        'Instalación de regaderas'
      ]
    },
    {
      name: 'Electricidad',
      icon: 'electrical_services',
      desc: 'Instalaciones y reparaciones eléctricas',
      details: [
        'Instalación de contactos y apagadores',
        'Reparación de cableado',
        'Instalación de lámparas',
        'Tableros eléctricos',
        'Diagnóstico de fallas'
      ]
    },
    {
      name: 'Drywall y Pintura',
      icon: 'format_paint',
      desc: 'Pintura interior y exterior, drywall',
      details: [
        'Pintura de interiores',
        'Pintura de exteriores',
        'Instalación de drywall',
        'Reparación de paredes',
        'Texturizado'
      ]
    },
    {
      name: 'Carpintería',
      icon: 'handyman',
      desc: 'Trabajos en madera y muebles',
      details: [
        'Instalación de puertas',
        'Reparación de muebles',
        'Instalación de repisas',
        'Marcos y molduras',
        'Trabajos personalizados'
      ]
    },
    {
      name: 'Pisos',
      icon: 'floor',
      desc: 'Instalación y reparación de pisos',
      details: [
        'Instalación de laminado',
        'Reparación de pisos',
        'Instalación de azulejo',
        'Pulido y acabados',
        'Alfombras'
      ]
    },
    {
      name: 'Mantenimiento General',
      icon: 'construction',
      desc: 'Servicios diversos de mantenimiento',
      details: [
        'Reparaciones menores',
        'Mantenimiento preventivo',
        'Instalación de accesorios',
        'Limpieza de canaletas',
        'Servicios personalizados'
      ]
    }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-lg text-text-light/80 dark:text-text-dark/80 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios de mantenimiento y reparación para tu hogar. 
            Todos nuestros trabajos incluyen garantía de satisfacción.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map(service => (
            <div key={service.name} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <span className="material-symbols-outlined text-primary text-5xl mb-4 block">{service.icon}</span>
                <h3 className="text-xl font-semibold mb-2 text-text-light dark:text-text-dark">{service.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.desc}</p>
              </div>
              <ul className="space-y-2 mb-6">
                {service.details.map((detail, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-primary/5 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-text-light dark:text-text-dark">
            ¿Por qué elegir nuestros servicios?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">verified</span>
              <h3 className="text-lg font-semibold mb-2">Trabajo garantizado</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Todos nuestros servicios incluyen garantía de satisfacción
              </p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">schedule</span>
              <h3 className="text-lg font-semibold mb-2">Servicio rápido</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Respuesta en menos de 2 horas y citas flexibles
              </p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">payments</span>
              <h3 className="text-lg font-semibold mb-2">Precios justos</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Evaluación gratuita y precios competitivos sin sorpresas
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
            ¿Necesitas alguno de estos servicios?
          </h2>
          <p className="text-text-light/80 dark:text-text-dark/80 mb-6">
            Agenda tu evaluación gratuita y obtén un presupuesto sin compromiso
          </p>
          <Link
            to="/agenda"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined">calendar_month</span>
            Agenda tu cita gratuita
          </Link>
        </div>
      </div>
    </div>
  );
}