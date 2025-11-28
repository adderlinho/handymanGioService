import { useTranslation } from '../../../i18n/LanguageContext';

interface AdminStatusBadgeProps {
  status: string;
  variant?: 'job' | 'worker' | 'payroll';
}

export default function AdminStatusBadge({ status, variant = 'job' }: AdminStatusBadgeProps) {
  const { t } = useTranslation();
  const getStatusConfig = () => {
    if (variant === 'job') {
      const configs = {
        'lead': { bg: 'bg-gray-100', text: 'text-gray-800', label: t('status.lead') },
        'scheduled': { bg: 'bg-blue-100', text: 'text-blue-800', label: t('status.scheduled') },
        'in_progress': { bg: 'bg-amber-100', text: 'text-amber-800', label: t('status.in_progress') },
        'completed': { bg: 'bg-green-100', text: 'text-green-800', label: t('status.completed') },
        'invoiced': { bg: 'bg-cyan-100', text: 'text-cyan-800', label: t('status.invoiced') },
        'paid': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: t('status.paid') },
        'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: t('status.cancelled') }
      };
      return configs[status as keyof typeof configs] || configs.lead;
    }
    
    if (variant === 'worker') {
      const configs = {
        'active': { bg: 'bg-green-100', text: 'text-green-800', label: t('status.active') },
        'inactive': { bg: 'bg-gray-100', text: 'text-gray-800', label: t('status.inactive') }
      };
      return configs[status as keyof typeof configs] || configs.active;
    }
    
    if (variant === 'payroll') {
      const configs = {
        'draft': { bg: 'bg-gray-100', text: 'text-gray-800', label: t('status.draft') },
        'finalized': { bg: 'bg-blue-100', text: 'text-blue-800', label: t('status.finalized') },
        'paid': { bg: 'bg-green-100', text: 'text-green-800', label: t('status.paid') }
      };
      return configs[status as keyof typeof configs] || configs.draft;
    }
    
    return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
  };
  
  const config = getStatusConfig();
  
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs md:text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}