import { Link } from 'react-router-dom';

export default function ComoFuncionaPage() {
  const steps = [
    {
      number: '1',
      title: 'Agenda tu cita',
      description: 'Completa nuestro formulario online o contáctanos por WhatsApp. Te responderemos en menos de 2 horas.',
      icon: 'calendar_month'
    },
    {
      number: '2',
      title: 'Evaluación gratuita',
      description: 'Visitamos tu hogar para evaluar el trabajo y proporcionarte un presupuesto sin compromiso.',
      icon: 'search'
    },
    {
      number: '3',
      title: 'Trabajo profesional',
      description: 'Nuestros técnicos certificados realizan el trabajo con materiales de calidad y garantía.',
      icon: 'handyman'
    },
    {
      number: '4',
      title: 'Satisfacción garantizada',
      description: 'Revisamos contigo el trabajo terminado y te proporcionamos garantía por nuestros servicios.',
      icon: 'verified'
    }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">
            ¿Cómo funciona?
          </h1>
          <p className="text-lg text-text-light/80 dark:text-text-dark/80 max-w-2xl mx-auto">
            Obtener ayuda profesional para tu hogar es más fácil de lo que piensas. 
            Sigue estos simples pasos para resolver tus problemas de mantenimiento.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-white text-3xl">{step.icon}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border-light/30 -translate-x-1/2"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text-light dark:text-text-dark">
                {step.title}
              </h3>
              <p className="text-text-light/70 dark:text-text-dark/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-text-light dark:text-text-dark">
            ¿Por qué elegir GioService?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">schedule</span>
              <h3 className="text-lg font-semibold mb-2">Respuesta rápida</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Te contactamos en menos de 2 horas durante horario laboral
              </p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">verified_user</span>
              <h3 className="text-lg font-semibold mb-2">Técnicos certificados</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Personal capacitado y con experiencia comprobada
              </p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">workspace_premium</span>
              <h3 className="text-lg font-semibold mb-2">Garantía incluida</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Todos nuestros trabajos incluyen garantía de satisfacción
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
            ¿Listo para comenzar?
          </h2>
          <p className="text-text-light/80 dark:text-text-dark/80 mb-6">
            Agenda tu evaluación gratuita hoy mismo
          </p>
          <Link
            to="/agenda"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined">calendar_month</span>
            Agenda tu visita gratuita
          </Link>
        </div>
      </div>
    </div>
  );
}