import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';

export default function HomePage() {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:gap-8 lg:gap-16">
        <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-black tracking-tighter text-text-light dark:text-text-dark sm:text-5xl lg:text-6xl">
              {t('public.home.title')}
            </h1>
            <p className="max-w-xl text-lg text-text-light/80 dark:text-text-dark/80">
              {t('public.home.subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link 
              to="/agenda"
              className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-base font-bold text-white shadow-lg shadow-accent/20 transition-transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <span className="truncate">{t('nav.public.booking')}</span>
            </Link>
            <Link 
              to="/trabajos-realizados"
              className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border border-border-light bg-background-light px-8 py-4 text-base font-bold text-primary shadow-sm transition-colors hover:bg-primary/10 dark:border-border-dark dark:bg-background-dark dark:hover:bg-primary/20"
            >
              <span className="material-symbols-outlined">visibility</span>
              <span className="truncate">{t('nav.public.portfolio')}</span>
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <img 
            className="aspect-square w-full max-w-md rounded-xl object-cover shadow-2xl shadow-primary/10 lg:aspect-auto lg:max-w-none" 
            alt="Un técnico profesional y amigable trabajando en una reparación del hogar" 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=600&fit=crop&crop=center"
          />
        </div>
      </div>
    </section>
  );
}