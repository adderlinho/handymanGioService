import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';

export default function ContactoPage() {
  const { t } = useTranslation();
  
  const contactMethods = [
    {
      title: 'WhatsApp',
      description: t('public.contact.whatsapp.description'),
      icon: 'chat',
      value: '+1 (847) 505-5576',
      action: 'https://wa.me/18475055576',
      actionText: t('public.contact.whatsapp.action')
    },
    {
      title: t('common.phone'),
      description: t('public.contact.phone.description'),
      icon: 'call',
      value: '+1 (847) 505-5576',
      action: 'tel:+18475055576',
      actionText: t('public.contact.phone.action')
    },
    {
      title: 'Email',
      description: t('public.contact.email.description'),
      icon: 'mail',
      value: 'giosinay@gmail.com',
      action: 'mailto:giosinay@gmail.com',
      actionText: t('public.contact.email.action')
    }
  ];

  const serviceAreas = [
    'Chicago Downtown',
    'Lincoln Park',
    'Wicker Park',
    'Logan Square',
    'Pilsen',
    'Little Village',
    'Bridgeport',
    'Chinatown'
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">
            {t('public.contact.title')}
          </h1>
          <p className="text-lg text-text-light/80 dark:text-text-dark/80 max-w-2xl mx-auto">
            {t('public.contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div>
            <h2 className="text-2xl font-bold mb-8 text-text-light dark:text-text-dark">
              {t('public.contact.methods.title')}
            </h2>
            <div className="space-y-6">
              {contactMethods.map((method) => (
                <div key={method.title} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-xl">{method.icon}</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{method.description}</p>
                      <p className="font-medium mb-3">{method.value}</p>
                      <a
                        href={method.action}
                        target={method.title === 'WhatsApp' ? '_blank' : undefined}
                        rel={method.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        {method.actionText}
                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Business Hours */}
            <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                {t('public.contact.hours.title')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('public.contact.hours.weekdays')}</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('public.contact.hours.saturday')}</span>
                  <span className="font-medium">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('public.contact.hours.sunday')}</span>
                  <span className="font-medium">{t('public.contact.hours.emergency')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Areas & Quick Contact */}
          <div>
            {/* Service Areas */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark">
                {t('public.contact.areas.title')}
              </h2>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <h3 className="text-lg font-semibold">{t('public.contact.areas.subtitle')}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {serviceAreas.map((area) => (
                    <div key={area} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      {area}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  {t('public.contact.areas.notListed')}
                </p>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
              <h3 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">
                {t('public.contact.quickHelp.title')}
              </h3>
              <p className="text-sm text-text-light/70 dark:text-text-dark/70 mb-6">
                {t('public.contact.quickHelp.subtitle')}
              </p>
              <Link
                to="/agenda"
                className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors font-medium w-full justify-center"
              >
                <span className="material-symbols-outlined">calendar_month</span>
                {t('public.contact.quickHelp.button')}
              </Link>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-red-600">emergency</span>
                <h4 className="font-semibold text-red-800">{t('public.contact.emergency.title')}</h4>
              </div>
              <p className="text-sm text-red-700 mb-3">
                {t('public.contact.emergency.description')}
              </p>
              <a
                href="https://wa.me/18475055576?text=🚨%20EMERGENCIA%20-%20"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <span className="material-symbols-outlined text-sm">emergency</span>
                {t('public.contact.emergency.button')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}