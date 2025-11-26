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
 * Build WhatsApp URL for job completion report
 */
export function buildJobReportWhatsAppUrl(job: JobSummaryForWhatsApp): string | null {
  const workersList = job.workers.length
    ? job.workers.map(w => `- ${w}`).join('\n')
    : '- Sin trabajadores asignados';

  const message =
    `*REPORTE DE TRABAJO COMPLETADO*\n\n` +
    `*Cliente:* ${job.customerName}\n` +
    `*Trabajo:* ${job.serviceName}\n` +
    `*Fecha:* ${job.date}\n` +
    `*Estado:* ${job.status}\n\n` +
    `*Descripción:*\n${job.description}\n\n` +
    `*Dirección:*\n${job.address}\n\n` +
    `*Trabajadores asignados:*\n${workersList}\n\n` +
    `*Precio total:* $${job.totalAmount.toFixed(2)}\n\n` +
    `*Fotos del trabajo:* ${job.photosCount} foto(s) adjunta(s)\n\n` +
    `Gracias por confiar en nuestros servicios.`;

  return buildWhatsAppLink(job.phone, message);
}