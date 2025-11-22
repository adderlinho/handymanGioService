export default function ServiciosPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Nuestros Servicios</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Plomería', icon: 'plumbing', desc: 'Reparaciones e instalaciones' },
            { name: 'Electricidad', icon: 'electrical_services', desc: 'Instalaciones eléctricas' },
            { name: 'Pintura', icon: 'format_paint', desc: 'Pintura interior y exterior' },
            { name: 'Carpintería', icon: 'handyman', desc: 'Trabajos en madera' },
            { name: 'Albañilería', icon: 'construction', desc: 'Construcción y reparaciones' }
          ].map(service => (
            <div key={service.name} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">{service.icon}</span>
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}