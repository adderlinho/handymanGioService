/**
 * WhatsApp link generation utilities
 */

/**
 * Normalize a phone number for WhatsApp:
 * - remove all non-digits
 * - if it has 10 digits, assume US and prepend country code "1"
 * - if it has 11 digits and starts with "1", keep as-is
 * - otherwise return null (invalid / unsupported for now)
 */
export function normalizePhoneForWhatsApp(
  rawPhone: string,
  defaultCountryCode: string = '1'
): string | null {
  let digits = rawPhone.replace(/\D/g, '');

  if (digits.length === 10) {
    // assume US number without country code
    digits = defaultCountryCode + digits;
  } else if (!(digits.length === 11 && digits.startsWith(defaultCountryCode))) {
    // unsupported format for now
    return null;
  }

  return digits;
}

/**
 * Generic WhatsApp link builder for a given phone and text.
 * If phone cannot be normalized, return null so the caller can decide not to render the link.
 */
export function buildWhatsAppLink(phone: string, message: string): string | null {
  const normalized = normalizePhoneForWhatsApp(phone);
  if (!normalized) return null;

  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send/?phone=${normalized}&text=${encoded}&type=phone_number&app_absent=0`;
}

/**
 * Build WhatsApp link for sharing content (no specific phone number)
 */
export function buildWhatsAppShareLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send/?text=${encoded}`;
}

/**
 * Job summary data for WhatsApp report
 */
export interface JobSummaryForWhatsApp {
  phone: string;          // customer phone, e.g. "(773) 447-1898"
  customerName: string;
  serviceName: string;
  date: string;           // e.g. "26/11/2025"
  status: string;         // e.g. "Completado"
  description: string;
  address: string;        // include street, city, state, ZIP, with line breaks if needed
  workers: string[];      // e.g. ["Jose Castro (Handyman)"]
  totalAmount: number;    // e.g. 32000
  photosCount: number;    // e.g. 1
}

/**
 * Build WhatsApp URL for job completion report with i18n support
 */
export function buildJobReportWhatsAppUrl(
  job: JobSummaryForWhatsApp,
  t: (key: string, params?: Record<string, any>) => string
): string | null {
  const workersList = job.workers.length
    ? job.workers.map(w => `- ${w}`).join('\n')
    : `- ${t('job.whatsapp.noWorkers')}`;

  const message =
    `*${t('job.whatsapp.title')}*\n\n` +
    `*${t('job.whatsapp.client')}* ${job.customerName}\n` +
    `*${t('job.whatsapp.service')}* ${job.serviceName}\n` +
    `*${t('job.whatsapp.date')}* ${job.date}\n` +
    `*${t('job.whatsapp.status')}* ${job.status}\n\n` +
    `*${t('job.whatsapp.description')}*\n${job.description}\n\n` +
    `*${t('job.whatsapp.address')}*\n${job.address}\n\n` +
    `*${t('job.whatsapp.workers')}*\n${workersList}\n\n` +
    `*${t('job.whatsapp.total')}* $${job.totalAmount.toFixed(2)}\n\n` +
    `*${t('job.whatsapp.photos')}* ${job.photosCount} ${t('job.whatsapp.photosSuffix')}\n\n` +
    t('job.whatsapp.thankYou');

  return buildWhatsAppLink(job.phone, message);
}