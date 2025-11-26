import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById, updateJob } from '../../services/jobsService';
import { getJobWorkersByJob } from '../../services/jobWorkersService';
import { getWorkers } from '../../services/workersService';
import { getServiceAreas } from '../../services/serviceAreasService';
import { clientsService } from '../../services/clientsService';

import { getPhotosByJob, createJobPhoto, deleteJobPhoto } from '../../services/jobPhotosService';
import { uploadJobPhoto, deleteJobPhotoFromStorage } from '../../services/storageService';
import type { Job, JobStatus } from '../../types/job';
import type { JobWorker } from '../../types/jobWorkers';
import type { Worker } from '../../types/workers';
import type { ServiceArea } from '../../types/serviceAreas';

import type { JobPhoto, JobPhotoTag } from '../../types/jobPhotos';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';

export default function TrabajoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  const [jobWorkers, setJobWorkers] = useState<JobWorker[]>([]);
  const [, setWorkers] = useState<Worker[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);

  const [jobPhotos, setJobPhotos] = useState<JobPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [availableWorkers, setAvailableWorkers] = useState<Worker[]>([]);
  const [workerForm, setWorkerForm] = useState({
    worker_id: ''
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [photoForm, setPhotoForm] = useState({
    file: null as File | null,
    tag: null as JobPhotoTag,
    description: ''
  });

  useEffect(() => {
    if (id) {
      loadJobData(id);
    }
  }, [id]);

  const loadJobData = async (jobId: string) => {
    try {
      setLoading(true);
      const [jobData, jobWorkersData, workersData, serviceAreasData, photosData] = await Promise.all([
        getJobById(jobId),
        getJobWorkersByJob(jobId),
        getWorkers(),
        getServiceAreas(),
        getPhotosByJob(jobId)
      ]);

      if (!jobData) {
        setError('Trabajo no encontrado');
        return;
      }

      setJob(jobData);
      setJobWorkers(jobWorkersData);
      setWorkers(workersData);
      setAvailableWorkers(workersData);
      setServiceAreas(serviceAreasData);
      setJobPhotos(photosData);

      // Try to get client email if not in job data
      if (!jobData.customer_email && jobData.customer_name) {
        try {
          const clients = await clientsService.searchByName(jobData.customer_name);
          const matchingClient = clients.find(c => 
            c.fullName === jobData.customer_name || 
            c.phone === jobData.customer_phone
          );
          if (matchingClient?.email) {
            setClientEmail(matchingClient.email);
          }
        } catch (err) {
          console.error('Error fetching client email:', err);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading job');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !photoForm.file) return;

    try {
      setUploadingPhoto(true);
      const { url, path } = await uploadJobPhoto(photoForm.file, job.id);
      
      const newPhoto = await createJobPhoto({
        job_id: job.id,
        url,
        storage_path: path,
        tag: photoForm.tag,
        description: photoForm.description || null
      });

      setJobPhotos(prev => [newPhoto, ...prev]);
      setPhotoForm({ file: null, tag: null, description: '' });
      setShowAddPhoto(false);
    } catch (err) {
      console.error('Error adding photo:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photo: JobPhoto) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta foto?')) return;

    try {
      await deleteJobPhoto(photo.id);
      await deleteJobPhotoFromStorage(photo.storage_path);
      setJobPhotos(prev => prev.filter(p => p.id !== photo.id));
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  const getTagLabel = (tag: JobPhotoTag) => {
    const labels = {
      'before': 'Antes',
      'during': 'Durante', 
      'after': 'Después'
    };
    return tag ? labels[tag] : null;
  };

  const getTagColor = (tag: JobPhotoTag) => {
    const colors = {
      'before': 'bg-red-100 text-red-800',
      'during': 'bg-yellow-100 text-yellow-800',
      'after': 'bg-green-100 text-green-800'
    };
    return tag ? colors[tag] : 'bg-gray-100 text-gray-800';
  };





  const handleStatusUpdate = async (newStatus: JobStatus) => {
    if (!job) return;
    
    try {
      await updateJob(job.id, { status: newStatus });
      setJob({ ...job, status: newStatus });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handlePriceUpdate = async (newPrice: number) => {
    if (!job) return;
    
    try {
      await updateJob(job.id, { total_amount: newPrice });
      setJob({ ...job, total_amount: newPrice });
    } catch (err) {
      console.error('Error updating price:', err);
    }
  };



  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !workerForm.worker_id) return;

    try {
      const { assignWorkerToJob } = await import('../../services/jobWorkersService');
      
      await assignWorkerToJob({
        job_id: job.id,
        worker_id: workerForm.worker_id
      });

      // Reload job workers
      const updatedJobWorkers = await getJobWorkersByJob(job.id);
      setJobWorkers(updatedJobWorkers);

      setWorkerForm({ worker_id: '' });
      setShowAddWorker(false);
    } catch (err) {
      console.error('Error adding worker:', err);
    }
  };

  const handleGenerateReport = async (method: 'whatsapp' | 'email' | 'pdf') => {
    if (!job) return;

    try {
      const serviceArea = serviceAreas.find(sa => sa.id === job.service_area_id);
      const address = [
        job.address_street + (job.address_unit ? `, ${job.address_unit}` : ''),
        `${job.city}, ${job.state} ${job.zip}`,
        serviceArea ? `Zona: ${serviceArea.name}` : ''
      ].filter(Boolean).join('\n');

      if (method === 'pdf') {
        const { generateJobReportPDF } = await import('../../utils/pdfGenerator');
        
        const jobReportData = {
          customerName: job.customer_name,
          serviceName: job.title,
          date: new Date().toLocaleDateString(),
          status: 'Completado',
          description: job.description || 'No especificada',
          address,
          workers: jobWorkers.map((jw: any) => 
            `${jw.worker?.first_name} ${jw.worker?.last_name} (${jw.worker?.role})`
          ),
          totalAmount: job.total_amount || 0,
          photos: jobPhotos.map(photo => ({
            url: photo.url,
            tag: photo.tag || undefined,
            description: photo.description || undefined
          }))
        };

        const jobReportDataWithId = {
          ...jobReportData,
          id: job.id
        };
        
        const pdfBlob = await generateJobReportPDF(jobReportDataWithId);
        const { generateJobReportFilename } = await import('../../utils/filename');
        
        const filename = generateJobReportFilename(
          job.customer_name,
          job.scheduled_date || new Date().toISOString(),
          job.id
        );
        
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      } else if (method === 'whatsapp') {
        const { buildJobReportWhatsAppUrl } = await import('../../utils/whatsapp');
        
        const jobSummary = {
          phone: job.customer_phone || '',
          customerName: job.customer_name,
          serviceName: job.title,
          date: new Date().toLocaleDateString(),
          status: 'Completado',
          description: job.description || 'No especificada',
          address,
          workers: jobWorkers.map((jw: any) => 
            `${jw.worker?.first_name} ${jw.worker?.last_name} (${jw.worker?.role})`
          ),
          totalAmount: job.total_amount || 0,
          photosCount: jobPhotos.length
        };

        const whatsappUrl = buildJobReportWhatsAppUrl(jobSummary);
        
        if (!whatsappUrl) {
          alert('Número de teléfono inválido para WhatsApp. Por favor verifica el formato.');
          return;
        }
        
        window.open(whatsappUrl, '_blank');
      } else {
        // Email logic remains the same
        const reportContent = `
REPORTE DE TRABAJO COMPLETADO

Cliente: ${job.customer_name}
Trabajo: ${job.title}
Fecha: ${new Date().toLocaleDateString()}
Estado: Completado

Descripción:
${job.description || 'No especificada'}

Dirección:
${job.address_street}${job.address_unit ? `, ${job.address_unit}` : ''}
${job.city}, ${job.state} ${job.zip}

Trabajadores asignados:
${jobWorkers.map((jw: any) => `- ${jw.worker?.first_name} ${jw.worker?.last_name} (${jw.worker?.role})`).join('\n')}

Precio total: $${job.total_amount?.toFixed(2) || '0.00'}

Fotos del trabajo: ${jobPhotos.length} foto(s) adjunta(s)

Gracias por confiar en nuestros servicios.
        `.trim();
        
        const emailToUse = job.customer_email || clientEmail;
        if (!emailToUse) {
          alert('No hay correo electrónico registrado para este cliente.');
          return;
        }
        
        const subject = `Reporte de trabajo completado - ${job.title}`;
        const emailUrl = `mailto:${emailToUse}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportContent)}`;
        const link = document.createElement('a');
        link.href = emailUrl;
        link.click();
      }
    } catch (err) {
      console.error('Error generating report:', err);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando trabajo...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block">
          {error || 'Trabajo no encontrado'}
        </div>
        <div className="mt-4">
          <Link to="/admin/trabajos" className="text-primary hover:text-primary/80">
            ← Volver a la lista de trabajos
          </Link>
        </div>
      </div>
    );
  }

  const serviceArea = serviceAreas.find(sa => sa.id === job.service_area_id);

  return (
    <AdminPageLayout
      title={job.title}
      backButton={{
        label: "Volver a trabajos",
        href: "/admin/trabajos"
      }}
    >
      {/* Status and Public Links */}
      {/* Status change buttons */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleStatusUpdate('scheduled')}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              job.status === 'scheduled' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-slate-300 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold">Programado</div>
          </button>
          <button
            onClick={() => handleStatusUpdate('in_progress')}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              job.status === 'in_progress' 
                ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                : 'border-slate-300 hover:border-yellow-300 hover:bg-yellow-50'
            }`}
          >
            <div className="text-2xl mb-2">🔧</div>
            <div className="font-semibold">En Progreso</div>
          </button>
          <button
            onClick={() => handleStatusUpdate('completed')}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              job.status === 'completed' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-slate-300 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold">Completado</div>
          </button>
          <button
            onClick={() => handleStatusUpdate('paid')}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              job.status === 'paid' 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-slate-300 hover:border-primary hover:bg-primary/10'
            }`}
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="font-semibold">Pagado</div>
          </button>
        </div>
      </div>



      {/* Client info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">📋 Información del Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-lg font-semibold text-slate-900">{job.customer_name}</p>
            </div>
            {job.customer_phone && (
              <a href={`tel:${job.customer_phone}`} className="block p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <span className="text-lg font-semibold text-blue-700">{job.customer_phone}</span>
                </div>
              </a>
            )}
            {(job.customer_email || clientEmail) && (
              <a href={`mailto:${job.customer_email || clientEmail}`} className="block p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✉️</span>
                  <span className="text-lg font-semibold text-blue-700">{job.customer_email || clientEmail}</span>
                </div>
              </a>
            )}
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {job.address_street}
                  {job.address_unit && `, ${job.address_unit}`}
                </p>
                <p className="text-slate-700">{job.city}, {job.state} {job.zip}</p>
                {serviceArea && (
                  <p className="text-primary font-semibold mt-2">Zona: {serviceArea.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {job.description && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Descripción del trabajo:</h4>
            <p className="text-slate-700 leading-relaxed">{job.description}</p>
          </div>
        )}
        
        {job.status === 'completed' && (
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleGenerateReport('pdf')}
              className="flex items-center justify-center gap-3 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-lg font-semibold"
            >
              <span className="text-xl">📝</span>
              Descargar PDF
            </button>
            <button
              onClick={() => handleGenerateReport('whatsapp')}
              className="flex items-center justify-center gap-3 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-lg font-semibold"
            >
              <span className="text-xl">📱</span>
              Enviar por WhatsApp
            </button>
            {(() => {
              const emailToUse = job.customer_email || clientEmail;
              if (!emailToUse) return null;
              
              const reportContent = `REPORTE DE TRABAJO COMPLETADO\n\nCliente: ${job.customer_name}\nTrabajo: ${job.title}\nFecha: ${new Date().toLocaleDateString()}\nEstado: Completado\n\nDescripción:\n${job.description || 'No especificada'}\n\nDirección:\n${job.address_street}${job.address_unit ? `, ${job.address_unit}` : ''}\n${job.city}, ${job.state} ${job.zip}\n\nTrabajadores asignados:\n${jobWorkers.map((jw: any) => `- ${jw.worker?.first_name} ${jw.worker?.last_name} (${jw.worker?.role})`).join('\n')}\n\nPrecio total: $${job.total_amount?.toFixed(2) || '0.00'}\n\nFotos del trabajo: ${jobPhotos.length} foto(s) adjunta(s)\n\nGracias por confiar en nuestros servicios.`;
              const subject = `Reporte de trabajo completado - ${job.title}`;
              const emailUrl = `mailto:${emailToUse}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportContent)}`;
              
              return (
                <a
                  href={emailUrl}
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold"
                >
                  <span className="text-xl">📧</span>
                  Enviar por Email
                </a>
              );
            })()}
          </div>
        )}
      </div>

      {/* Workers section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">👷 Trabajadores</h3>
          <button
            onClick={() => setShowAddWorker(!showAddWorker)}
            className="flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-base md:text-lg font-semibold"
          >
            <span className="text-lg md:text-xl">➕</span>
            <span className="whitespace-nowrap">Agregar</span>
          </button>
        </div>

        {showAddWorker && (
          <form onSubmit={handleAddWorker} className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Trabajador</label>
                <select
                  value={workerForm.worker_id}
                  onChange={(e) => setWorkerForm(prev => ({ ...prev, worker_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Seleccionar trabajador</option>
                  {availableWorkers
                    .filter(worker => !jobWorkers.some(jw => jw.worker_id === worker.id))
                    .map(worker => (
                    <option key={worker.id} value={worker.id}>
                      {worker.first_name} {worker.last_name} - {worker.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddWorker(false);
                  setWorkerForm({ worker_id: '' });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Agregar
              </button>
            </div>
          </form>
        )}

        {jobWorkers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👷</div>
            <p className="text-xl text-slate-600">No hay trabajadores asignados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobWorkers.map((jw: any) => (
              <div key={jw.id} className="p-6 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">👤</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-900">
                      {jw.worker?.first_name} {jw.worker?.last_name}
                    </h4>
                    <p className="text-slate-600">{jw.worker?.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evidence/Photos */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">📸 Fotos del Trabajo</h3>
          <button
            onClick={() => setShowAddPhoto(!showAddPhoto)}
            className="flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-lg font-semibold"
          >
            <span className="text-xl">📷</span>
            Agregar Foto
          </button>
        </div>

        {showAddPhoto && (
          <form onSubmit={handleAddPhoto} className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Etiqueta</label>
                <select
                  value={photoForm.tag || ''}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, tag: (e.target.value as JobPhotoTag) || null }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Sin etiqueta</option>
                  <option value="before">Antes</option>
                  <option value="during">Durante</option>
                  <option value="after">Después</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descripción (opcional)</label>
                <input
                  type="text"
                  value={photoForm.description}
                  onChange={(e) => setPhotoForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Descripción de la foto"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddPhoto(false);
                  setPhotoForm({ file: null, tag: null, description: '' });
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={uploadingPhoto}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {uploadingPhoto ? 'Subiendo...' : 'Agregar foto'}
              </button>
            </div>
          </form>
        )}

        {jobPhotos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-xl text-slate-600">No hay fotos del trabajo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.description || 'Foto del trabajo'}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(photo.url, '_blank')}
                  />
                </div>
                {photo.tag && (
                  <span className={`absolute top-3 left-3 px-3 py-1 text-sm font-semibold rounded-full ${getTagColor(photo.tag)}`}>
                    {getTagLabel(photo.tag)}
                  </span>
                )}
                <button
                  onClick={() => handleDeletePhoto(photo)}
                  className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <span className="text-lg">🗑️</span>
                </button>
                {photo.description && (
                  <p className="mt-3 text-base text-slate-700 font-medium" title={photo.description}>
                    {photo.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>



      {/* Pricing */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">💰 Precio del Trabajo</h3>
        
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl p-8 border-2 border-primary/20">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💰</div>
              <p className="text-xl font-semibold text-slate-700 mb-2">Precio Total</p>
            </div>
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-3xl font-bold text-primary">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={job.total_amount || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    handlePriceUpdate(value);
                  } else if (e.target.value === '') {
                    handlePriceUpdate(0);
                  }
                }}
                placeholder="0.00"
                className="w-full text-4xl md:text-5xl font-bold text-primary bg-white border-2 border-primary/30 rounded-2xl pl-16 pr-6 py-4 text-center focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                {job.total_amount && job.total_amount > 0 
                  ? `Precio: $${job.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : 'Ingresa el precio del trabajo'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}