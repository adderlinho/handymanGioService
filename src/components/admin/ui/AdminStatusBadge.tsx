interface AdminStatusBadgeProps {
  status: string;
  variant?: 'job' | 'worker' | 'payroll';
}

export default function AdminStatusBadge({ status, variant = 'job' }: AdminStatusBadgeProps) {
  const getStatusConfig = () => {
    if (variant === 'job') {
      const configs = {
        'lead': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Lead' },
        'scheduled': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Programado' },
        'in_progress': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'En Progreso' },
        'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completado' },
        'invoiced': { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Facturado' },
        'paid': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Pagado' },
        'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' }
      };
      return configs[status as keyof typeof configs] || configs.lead;
    }
    
    if (variant === 'worker') {
      const configs = {
        'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
        'inactive': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactivo' }
      };
      return configs[status as keyof typeof configs] || configs.active;
    }
    
    if (variant === 'payroll') {
      const configs = {
        'draft': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Borrador' },
        'finalized': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Finalizado' },
        'paid': { bg: 'bg-green-100', text: 'text-green-800', label: 'Pagado' }
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