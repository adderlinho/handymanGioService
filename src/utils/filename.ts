export function slugifyForFilename(text: string, maxLength = 30): string {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, maxLength);
}

export function generateJobReportFilename(customerName: string, jobDate: string, jobId?: string): string {
  const datePart = new Date(jobDate).toISOString().split('T')[0]; // yyyy-MM-dd format
  const clientSlug = slugifyForFilename(customerName);
  const shortId = jobId?.slice(0, 8) ?? 'job';
  
  return `GioService_Reporte_Servicio_${datePart}_${clientSlug}_${shortId}.pdf`;
}