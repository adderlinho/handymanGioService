export type SupportedLanguage = 'es' | 'en';

type TranslationValue = string | ((params?: Record<string, any>) => string);

export type TranslationDict = Record<string, TranslationValue>;

export const translations: Record<SupportedLanguage, TranslationDict> = {
  es: {
    // General
    'app.brand': 'GioService',
    'app.language.es': 'Español',
    'app.language.en': 'Inglés',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.actions': 'Acciones',
    'common.date': 'Fecha',
    'common.status': 'Estado',
    'common.total': 'Total',
    'common.phone': 'Teléfono',
    'common.email': 'Correo electrónico',
    'common.address': 'Dirección',
    'common.description': 'Descripción',
    'common.name': 'Nombre',

    // Navigation - Admin
    'nav.admin.dashboard': 'Panel',
    'nav.admin.jobs': 'Trabajos',
    'nav.admin.workers': 'Trabajadores',
    'nav.admin.clients': 'Clientes',
    'nav.admin.inventory': 'Inventario',
    'nav.admin.payroll': 'Nómina',
    'nav.admin.settings': 'Configuración',

    // Navigation - Public
    'nav.public.home': 'Inicio',
    'nav.public.services': 'Servicios',
    'nav.public.portfolio': 'Trabajos realizados',
    'nav.public.howItWorks': 'Cómo funciona',
    'nav.public.contact': 'Contacto',
    'nav.public.booking': 'Agenda tu visita',

    // Jobs
    'jobs.title': 'Trabajos',
    'jobs.new': 'Nuevo trabajo',
    'jobs.list': 'Lista de trabajos',
    'jobs.detail': 'Detalle del trabajo',
    'jobs.edit': 'Editar trabajo',
    'jobs.delete': 'Eliminar trabajo',
    'jobs.noJobs': 'No hay trabajos disponibles',
    'jobs.customer': 'Cliente',
    'jobs.service': 'Servicio',
    'jobs.scheduledDate': 'Fecha programada',
    'jobs.totalPrice': 'Precio total',

    // Workers
    'workers.title': 'Trabajadores',
    'workers.new': 'Nuevo trabajador',
    'workers.list': 'Lista de trabajadores',
    'workers.detail': 'Detalle del trabajador',
    'workers.noWorkers': 'No hay trabajadores disponibles',

    // Clients
    'clients.title': 'Clientes',
    'clients.new': 'Nuevo cliente',
    'clients.list': 'Lista de clientes',
    'clients.detail': 'Detalle del cliente',
    'clients.noClients': 'No hay clientes disponibles',

    // Inventory
    'inventory.title': 'Inventario',
    'inventory.new': 'Nuevo artículo',
    'inventory.list': 'Lista de inventario',
    'inventory.detail': 'Detalle del artículo',
    'inventory.noItems': 'No hay artículos disponibles',

    // Payroll
    'payroll.title': 'Nómina',
    'payroll.new': 'Generar nómina',
    'payroll.overview': 'Resumen de nómina',
    'payroll.detail': 'Detalle de nómina',

    // Status labels
    'status.lead': 'Lead',
    'status.scheduled': 'Programado',
    'status.in_progress': 'En progreso',
    'status.completed': 'Completado',
    'status.invoiced': 'Facturado',
    'status.paid': 'Pagado',

    // Service types
    'service.plumbing': 'Plomería',
    'service.electrical': 'Electricidad',
    'service.drywall_paint': 'Drywall y Pintura',
    'service.carpentry': 'Carpintería',
    'service.flooring': 'Pisos',
    'service.other': 'Otro',

    // Job Report PDF
    'job.report.title': 'Informe del servicio',
    'job.report.status': 'Estado',
    'job.report.client': 'Cliente',
    'job.report.service': 'Servicio',
    'job.report.date': 'Fecha del servicio',
    'job.report.description': 'Descripción del trabajo',
    'job.report.address': 'Dirección del servicio',
    'job.report.assignedWorkers': 'Trabajadores asignados',
    'job.report.costSummary': 'Resumen de costos',
    'job.report.totalPrice': 'Precio total del servicio',
    'job.report.photos.title': 'Registro fotográfico',
    'job.report.photos.total': (params) => `Total de fotografías: ${params?.count || 0}`,
    'job.report.photos.caption.before': (params) => `Fotografía ${params?.index || 0} – ANTES`,
    'job.report.photos.caption.during': (params) => `Fotografía ${params?.index || 0} – DURANTE`,
    'job.report.photos.caption.after': (params) => `Fotografía ${params?.index || 0} – DESPUÉS`,

    // WhatsApp Messages
    'job.whatsapp.title': '📋 RESUMEN DEL SERVICIO',
    'job.whatsapp.client': '👤 Cliente:',
    'job.whatsapp.service': '🔧 Servicio:',
    'job.whatsapp.date': '📅 Fecha:',
    'job.whatsapp.status': '✅ Estado:',
    'job.whatsapp.description': '📝 Descripción:',
    'job.whatsapp.address': '📍 Dirección:',
    'job.whatsapp.workers': '👷 Trabajadores:',
    'job.whatsapp.total': '💰 Total:',
    'job.whatsapp.photos': '📸 Fotografías:',
    'job.whatsapp.photosSuffix': 'fotos adjuntas',
    'job.whatsapp.noWorkers': 'Sin asignar',
    'job.whatsapp.thankYou': '¡Gracias por confiar en GioService! 🙏',

    // Public Pages
    'public.home.title': 'Reparaciones confiables para tu hogar',
    'public.home.subtitle': 'Electricidad, plomería, pintura y mantenimiento general para hogares y pequeños negocios. Soluciones rápidas y profesionales a tu alcance.',
    'public.services.title': 'Nuestros Servicios',
    'public.portfolio.title': 'Trabajos Realizados',
    'public.contact.title': 'Contáctanos',
    'public.booking.title': 'Agenda tu cita',
    'public.howItWorks.title': '¿Cómo funciona?',

    // Booking Form
    'booking.form.name': 'Nombre completo',
    'booking.form.phone': 'Teléfono / WhatsApp',
    'booking.form.email': 'Correo electrónico',
    'booking.form.address': 'Dirección',
    'booking.form.serviceType': 'Tipo de servicio',
    'booking.form.description': 'Descripción del trabajo',
    'booking.form.submit': 'Enviar solicitud',
    'booking.form.success': '¡Gracias por tu solicitud!',
  },
  en: {
    // General
    'app.brand': 'GioService',
    'app.language.es': 'Spanish',
    'app.language.en': 'English',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.actions': 'Actions',
    'common.date': 'Date',
    'common.status': 'Status',
    'common.total': 'Total',
    'common.phone': 'Phone',
    'common.email': 'Email',
    'common.address': 'Address',
    'common.description': 'Description',
    'common.name': 'Name',

    // Navigation - Admin
    'nav.admin.dashboard': 'Dashboard',
    'nav.admin.jobs': 'Jobs',
    'nav.admin.workers': 'Workers',
    'nav.admin.clients': 'Clients',
    'nav.admin.inventory': 'Inventory',
    'nav.admin.payroll': 'Payroll',
    'nav.admin.settings': 'Settings',

    // Navigation - Public
    'nav.public.home': 'Home',
    'nav.public.services': 'Services',
    'nav.public.portfolio': 'Portfolio',
    'nav.public.howItWorks': 'How it works',
    'nav.public.contact': 'Contact',
    'nav.public.booking': 'Book your visit',

    // Jobs
    'jobs.title': 'Jobs',
    'jobs.new': 'New job',
    'jobs.list': 'Jobs list',
    'jobs.detail': 'Job detail',
    'jobs.edit': 'Edit job',
    'jobs.delete': 'Delete job',
    'jobs.noJobs': 'No jobs available',
    'jobs.customer': 'Customer',
    'jobs.service': 'Service',
    'jobs.scheduledDate': 'Scheduled date',
    'jobs.totalPrice': 'Total price',

    // Workers
    'workers.title': 'Workers',
    'workers.new': 'New worker',
    'workers.list': 'Workers list',
    'workers.detail': 'Worker detail',
    'workers.noWorkers': 'No workers available',

    // Clients
    'clients.title': 'Clients',
    'clients.new': 'New client',
    'clients.list': 'Clients list',
    'clients.detail': 'Client detail',
    'clients.noClients': 'No clients available',

    // Inventory
    'inventory.title': 'Inventory',
    'inventory.new': 'New item',
    'inventory.list': 'Inventory list',
    'inventory.detail': 'Item detail',
    'inventory.noItems': 'No items available',

    // Payroll
    'payroll.title': 'Payroll',
    'payroll.new': 'Generate payroll',
    'payroll.overview': 'Payroll overview',
    'payroll.detail': 'Payroll detail',

    // Status labels
    'status.lead': 'Lead',
    'status.scheduled': 'Scheduled',
    'status.in_progress': 'In progress',
    'status.completed': 'Completed',
    'status.invoiced': 'Invoiced',
    'status.paid': 'Paid',

    // Service types
    'service.plumbing': 'Plumbing',
    'service.electrical': 'Electrical',
    'service.drywall_paint': 'Drywall & Paint',
    'service.carpentry': 'Carpentry',
    'service.flooring': 'Flooring',
    'service.other': 'Other',

    // Job Report PDF
    'job.report.title': 'Service Report',
    'job.report.status': 'Status',
    'job.report.client': 'Client',
    'job.report.service': 'Service',
    'job.report.date': 'Service date',
    'job.report.description': 'Job description',
    'job.report.address': 'Service address',
    'job.report.assignedWorkers': 'Assigned workers',
    'job.report.costSummary': 'Cost summary',
    'job.report.totalPrice': 'Total service price',
    'job.report.photos.title': 'Photo record',
    'job.report.photos.total': (params) => `Total photos: ${params?.count || 0}`,
    'job.report.photos.caption.before': (params) => `Photo ${params?.index || 0} – BEFORE`,
    'job.report.photos.caption.during': (params) => `Photo ${params?.index || 0} – DURING`,
    'job.report.photos.caption.after': (params) => `Photo ${params?.index || 0} – AFTER`,

    // WhatsApp Messages
    'job.whatsapp.title': '📋 SERVICE SUMMARY',
    'job.whatsapp.client': '👤 Client:',
    'job.whatsapp.service': '🔧 Service:',
    'job.whatsapp.date': '📅 Date:',
    'job.whatsapp.status': '✅ Status:',
    'job.whatsapp.description': '📝 Description:',
    'job.whatsapp.address': '📍 Address:',
    'job.whatsapp.workers': '👷 Workers:',
    'job.whatsapp.total': '💰 Total:',
    'job.whatsapp.photos': '📸 Photos:',
    'job.whatsapp.photosSuffix': 'photos attached',
    'job.whatsapp.noWorkers': 'Unassigned',
    'job.whatsapp.thankYou': 'Thank you for trusting GioService! 🙏',

    // Public Pages
    'public.home.title': 'Reliable repairs for your home',
    'public.home.subtitle': 'Electrical, plumbing, painting and general maintenance for homes and small businesses. Fast and professional solutions at your fingertips.',
    'public.services.title': 'Our Services',
    'public.portfolio.title': 'Completed Work',
    'public.contact.title': 'Contact Us',
    'public.booking.title': 'Book your appointment',
    'public.howItWorks.title': 'How it works?',

    // Booking Form
    'booking.form.name': 'Full name',
    'booking.form.phone': 'Phone / WhatsApp',
    'booking.form.email': 'Email',
    'booking.form.address': 'Address',
    'booking.form.serviceType': 'Service type',
    'booking.form.description': 'Job description',
    'booking.form.submit': 'Submit request',
    'booking.form.success': 'Thank you for your request!',
  },
};