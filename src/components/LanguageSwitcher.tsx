import { useTranslation } from '../i18n/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
}

export default function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { lang, setLang } = useTranslation();

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 p-1 text-xs">
        <button
          type="button"
          onClick={() => setLang('es')}
          className={`px-3 py-1 rounded-full transition-colors ${
            lang === 'es' ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          ES
        </button>
        <button
          type="button"
          onClick={() => setLang('en')}
          className={`px-3 py-1 rounded-full transition-colors ${
            lang === 'en' ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white p-1 text-sm">
      <button
        type="button"
        onClick={() => setLang('es')}
        className={`px-4 py-2 rounded-md transition-colors ${
          lang === 'es' ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'
        }`}
      >
        Español
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-4 py-2 rounded-md transition-colors ${
          lang === 'en' ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'
        }`}
      >
        English
      </button>
    </div>
  );
}