import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';

export default function ServiciosPage() {
  const { t } = useTranslation();
  
  const services = [
    {
      name: t('service.plumbing'),
      icon: 'plumbing',
      desc: t('service.plumbing'),
      details: [
        t('services.plumbing.details.1'),
        t('services.plumbing.details.2'),
        t('services.plumbing.details.3'),
        t('services.plumbing.details.4'),
        t('services.plumbing.details.5')
      ]
    },
    {
      name: t('service.electrical'),
      icon: 'electrical_services',
      desc: t('service.electrical'),
      details: [
        t('services.electrical.details.1'),
        t('services.electrical.details.2'),
        t('services.electrical.details.3'),
        t('services.electrical.details.4'),
        t('services.electrical.details.5')
      ]
    },
    {
      name: t('service.drywall_paint'),
      icon: 'format_paint',
      desc: t('service.drywall_paint'),
      details: [
        t('services.drywall_paint.details.1'),
        t('services.drywall_paint.details.2'),
        t('services.drywall_paint.details.3'),
        t('services.drywall_paint.details.4'),
        t('services.drywall_paint.details.5')
      ]
    },
    {
      name: t('service.carpentry'),
      icon: 'handyman',
      desc: t('service.carpentry'),
      details: [
        t('services.carpentry.details.1'),
        t('services.carpentry.details.2'),
        t('services.carpentry.details.3'),
        t('services.carpentry.details.4'),
        t('services.carpentry.details.5')
      ]
    },
    {
      name: t('service.flooring'),
      icon: 'floor',
      desc: t('service.flooring'),
      details: [
        t('services.flooring.details.1'),
        t('services.flooring.details.2'),
        t('services.flooring.details.3'),
        t('services.flooring.details.4'),
        t('services.flooring.details.5')
      ]
    },
    {
      name: t('service.other'),
      icon: 'construction',
      desc: t('service.other'),
      details: [
        t('services.other.details.1'),
        t('services.other.details.2'),
        t('services.other.details.3'),
        t('services.other.details.4'),
        t('services.other.details.5')
      ]
    }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">
            {t('public.services.title')}
          </h1>
          <p className="text-lg text-text-light/80 dark:text-text-dark/80 max-w-2xl mx-auto">
            {t('public.services.subtitle')}
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
            {t('public.services.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">verified</span>
              <h3 className="text-lg font-semibold mb-2">{t('public.services.features.guaranteed.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('public.services.features.guaranteed.desc')}
              </p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">schedule</span>
              <h3 className="text-lg font-semibold mb-2">{t('public.services.features.fast.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('public.services.features.fast.desc')}
              </p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-4 block">payments</span>
              <h3 className="text-lg font-semibold mb-2">{t('public.services.features.fair.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('public.services.features.fair.desc')}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">
            {t('public.services.cta.title')}
          </h2>
          <p className="text-text-light/80 dark:text-text-dark/80 mb-6">
            {t('public.services.cta.subtitle')}
          </p>
          <Link
            to="/agenda"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined">calendar_month</span>
            {t('public.services.cta.button')}
          </Link>
        </div>
      </div>
    </div>
  );
}