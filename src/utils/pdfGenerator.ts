import jsPDF from 'jspdf';

export interface JobReportData {
  customerName: string;
  serviceName: string;
  date: string;
  status: string;
  description: string;
  address: string;
  workers: string[];
  totalAmount: number;
  photos: Array<{
    url: string;
    tag?: string;
    description?: string;
  }>;
  id?: string;
}

export async function generateJobReportPDF(jobData: JobReportData): Promise<Blob> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Set PDF metadata
  const formattedDate = new Date(jobData.date).toLocaleDateString('es-GT');
  pdf.setProperties({
    title: `GioService – Informe del servicio – ${jobData.customerName} – ${formattedDate}`,
    subject: 'Informe del servicio completado',
    author: 'GioService',
    creator: 'GioService'
  });
  
  // Colors
  const primaryBlue: [number, number, number] = [37, 99, 235];
  const darkGray: [number, number, number] = [17, 24, 39];
  const lightGray: [number, number, number] = [249, 250, 251];
  const borderGray: [number, number, number] = [229, 231, 235];

  let yPosition = drawHeader(pdf, pageWidth, primaryBlue);
  yPosition = drawMainTitle(pdf, yPosition, darkGray);
  yPosition = drawJobSummary(pdf, yPosition, jobData, primaryBlue, darkGray, lightGray, borderGray, pageWidth);
  yPosition = drawDescriptionAndAddress(pdf, yPosition, jobData, primaryBlue, darkGray, pageWidth);
  yPosition = drawWorkers(pdf, yPosition, jobData.workers, primaryBlue, darkGray);
  yPosition = drawPricing(pdf, yPosition, jobData, primaryBlue, darkGray, lightGray, pageWidth);
  
  if (jobData.photos.length > 0) {
    await drawPhotoRecord(pdf, jobData.photos, primaryBlue, darkGray, pageHeight);
  }

  drawFooter(pdf, pageHeight, darkGray);

  return pdf.output('blob');
}

function drawHeader(pdf: jsPDF, pageWidth: number, primaryBlue: [number, number, number]): number {
  // Header background
  pdf.setFillColor(...primaryBlue);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  // Brand name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('GioService – Servicios de mantenimiento', 20, 15);
  
  // Report date box
  const currentDate = new Date().toLocaleDateString('es-GT');
  const currentTime = new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Fecha de reporte:', pageWidth - 70, 15);
  pdf.text(`${currentDate} ${currentTime}`, pageWidth - 70, 22);
  
  return 45;
}

function drawMainTitle(pdf: jsPDF, yPosition: number, darkGray: [number, number, number]): number {
  pdf.setTextColor(...darkGray);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORME DEL SERVICIO', 20, yPosition);
  
  // Underline
  pdf.setDrawColor(...darkGray);
  pdf.setLineWidth(0.5);
  pdf.line(20, yPosition + 3, 120, yPosition + 3);
  
  return yPosition + 20;
}

function drawJobSummary(pdf: jsPDF, yPosition: number, jobData: JobReportData, primaryBlue: [number, number, number], darkGray: [number, number, number], lightGray: [number, number, number], borderGray: [number, number, number], pageWidth: number): number {
  // Section title
  pdf.setTextColor(...primaryBlue);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMACIÓN DEL SERVICIO', 20, yPosition);
  yPosition += 10;
  
  // Info box background
  pdf.setFillColor(...lightGray);
  pdf.setDrawColor(...borderGray);
  pdf.setLineWidth(0.5);
  pdf.rect(20, yPosition, pageWidth - 40, 45, 'FD');
  
  // Info grid
  pdf.setTextColor(...darkGray);
  pdf.setFontSize(10);
  
  const infoItems = [
    ['Cliente:', jobData.customerName],
    ['Servicio:', jobData.serviceName],
    ['Fecha del servicio:', jobData.date],
    ['Estado:', jobData.status.toUpperCase()]
  ];
  
  let infoY = yPosition + 10;
  infoItems.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, 25, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, 80, infoY);
    infoY += 8;
  });
  

  
  return yPosition + 55;
}

function drawDescriptionAndAddress(pdf: jsPDF, yPosition: number, jobData: JobReportData, primaryBlue: [number, number, number], darkGray: [number, number, number], pageWidth: number): number {
  // Description section
  pdf.setTextColor(...primaryBlue);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DESCRIPCIÓN DEL TRABAJO', 20, yPosition);
  yPosition += 8;
  
  pdf.setTextColor(...darkGray);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const descLines = pdf.splitTextToSize(jobData.description, pageWidth - 50);
  pdf.text(descLines, 25, yPosition);
  yPosition += (descLines.length * 5) + 15;
  
  // Address section
  pdf.setTextColor(...primaryBlue);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DIRECCIÓN DEL SERVICIO', 20, yPosition);
  yPosition += 8;
  
  pdf.setTextColor(...darkGray);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const addressLines = pdf.splitTextToSize(jobData.address, pageWidth - 50);
  pdf.text(addressLines, 25, yPosition);
  yPosition += (addressLines.length * 5) + 15;
  
  return yPosition;
}

function drawWorkers(pdf: jsPDF, yPosition: number, workers: string[], primaryBlue: [number, number, number], darkGray: [number, number, number]): number {
  if (workers.length === 0) return yPosition;
  
  pdf.setTextColor(...primaryBlue);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TRABAJADORES ASIGNADOS', 20, yPosition);
  yPosition += 10;
  
  pdf.setTextColor(...darkGray);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  workers.forEach(worker => {
    pdf.text(`• ${worker}`, 25, yPosition);
    yPosition += 6;
  });
  
  return yPosition + 10;
}

function drawPricing(pdf: jsPDF, yPosition: number, jobData: JobReportData, primaryBlue: [number, number, number], darkGray: [number, number, number], lightGray: [number, number, number], pageWidth: number): number {
  // Section title
  pdf.setTextColor(...primaryBlue);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RESUMEN DE COSTOS', 20, yPosition);
  yPosition += 10;
  
  // Check if we have pricing breakdown (assuming it might be added to JobReportData later)
  const hasBreakdown = false; // For now, only show total
  
  if (hasBreakdown) {
    // Future: Cost breakdown table
    // This section can be expanded when pricing breakdown is available
  } else {
    // Simple total display
    pdf.setFillColor(...lightGray);
    pdf.setDrawColor(...primaryBlue);
    pdf.setLineWidth(1);
    pdf.rect(20, yPosition, pageWidth - 40, 30, 'FD');
    
    // Label
    pdf.setTextColor(...darkGray);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PRECIO TOTAL DEL SERVICIO', 25, yPosition + 12);
    
    // Amount - more prominent and right-aligned
    const formattedAmount = `Q ${jobData.totalAmount.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`;
    pdf.setTextColor(...primaryBlue);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text(formattedAmount, pageWidth - 30, yPosition + 22, { align: 'right' });
  }
  
  return yPosition + 40;
}

async function drawPhotoRecord(pdf: jsPDF, photos: Array<{url: string, tag?: string}>, primaryBlue: [number, number, number], darkGray: [number, number, number], pageHeight: number): Promise<void> {
  pdf.addPage();
  let yPosition = 30;
  
  // Section title
  pdf.setTextColor(...primaryBlue);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('REGISTRO FOTOGRÁFICO', 20, yPosition);
  yPosition += 10;
  
  pdf.setTextColor(...darkGray);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total de fotografías: ${photos.length}`, 20, yPosition);
  yPosition += 20;
  
  // Photo grid (2 per row)
  const photosPerRow = 2;
  const photoWidth = 80;
  const photoHeight = 60;
  const photoSpacing = 15;
  
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const col = i % photosPerRow;
    const xPosition = 20 + col * (photoWidth + photoSpacing);
    
    // Check if we need a new page
    if (yPosition + photoHeight + 30 > pageHeight - 30) {
      pdf.addPage();
      yPosition = 30;
    }
    
    try {
      const img = await loadImage(photo.url);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const ratio = Math.min(photoWidth / img.width, photoHeight / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Photo with margin and border
      const photoMargin = 3;
      const photoX = xPosition + photoMargin;
      const photoY = yPosition + photoMargin;
      const photoDisplayWidth = canvas.width - (photoMargin * 2);
      const photoDisplayHeight = canvas.height - (photoMargin * 2);
      
      // Light gray border around photo
      pdf.setFillColor(245, 245, 245);
      pdf.rect(xPosition, yPosition, canvas.width, canvas.height, 'F');
      
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(1);
      pdf.rect(xPosition, yPosition, canvas.width, canvas.height, 'D');
      
      pdf.addImage(imgData, 'JPEG', photoX, photoY, photoDisplayWidth, photoDisplayHeight);
      
      // Photo caption - bolder and slightly larger
      const tagText = photo.tag === 'before' ? 'ANTES' : photo.tag === 'during' ? 'DURANTE' : photo.tag === 'after' ? 'DESPUÉS' : 'TRABAJO';
      pdf.setTextColor(...darkGray);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Fotografía ${i + 1} – ${tagText}`, xPosition, yPosition + canvas.height + 12);
      
    } catch (error) {
      pdf.setTextColor(220, 38, 38);
      pdf.setFontSize(8);
      pdf.text('Error al cargar imagen', xPosition, yPosition + 20);
    }
    
    // Move to next row after 2 photos
    if (col === photosPerRow - 1) {
      yPosition += photoHeight + 30;
    }
  }
}

function drawFooter(pdf: jsPDF, pageHeight: number, darkGray: [number, number, number]): void {
  const pageCount = pdf.getNumberOfPages();
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    
    // Footer line
    pdf.setDrawColor(...darkGray);
    pdf.setLineWidth(0.3);
    pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    // Footer text
    pdf.setTextColor(...darkGray);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('GioService – Servicios de mantenimiento', 20, pageHeight - 12);
    pdf.text(`Página ${i} de ${pageCount}`, pageWidth - 20, pageHeight - 12, { align: 'right' });
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}