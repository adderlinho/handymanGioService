import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../../services/jobsService';
import { getPhotosByJob } from '../../services/jobPhotosService';
import { getServiceAreas } from '../../services/serviceAreasService';
import { buildWhatsAppShareLink } from '../../utils/whatsapp';
import type { Job } from '../../types/job';
import type { JobPhoto, JobPhotoTag } from '../../types/jobPhotos';
import type { ServiceArea } from '../../types/serviceAreas';

export default function TrabajoPublicPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [photos, setPhotos] = useState<JobPhoto[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<JobPhoto | null>(null);

  useEffect(() => {
    if (id) {
      loadJobData(id);
    }
  }, [id]);

  const loadJobData = async (jobId: string) => {
    try {
      setLoading(true);
      const [jobData, photosData, areasData] = await Promise.all([
        getJobById(jobId),
        getPhotosByJob(jobId),
        getServiceAreas()
      ]);

      if (!jobData || (jobData.status !== 'completed' && jobData.status !== 'paid')) {
        setError('Este trabajo no está disponible públicamente');
        return;
      }

      setJob(jobData);
      setPhotos(photosData);
      setServiceAreas(areasData);
    } catch (err) {
      setError('Error cargando el trabajo');
    } finally {
      setLoading(false);
    }
  };

  const getServiceTypeLabel = (serviceType: string) => {
    const labels: Record<string, string> = {
      'plumbing': 'Plomería',
      'electrical': 'Electricidad',
      'drywall_paint': 'Drywall y Pintura',
      'carpentry': 'Carpintería',
      'flooring': 'Pisos',
      'other': 'Otro'
    };
    return labels[serviceType] || serviceType;
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

  const shareUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
  const whatsappUrl = buildWhatsAppShareLink(`Mira este trabajo realizado por GioService: ${shareUrl}`);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block mb-4">
            {error || 'Trabajo no encontrado'}
          </div>
          <Link to="/trabajos-realizados" className="text-primary hover:text-primary/80">
            ← Ver todos los trabajos realizados
          </Link>
        </div>
      </div>
    );
  }

  const serviceArea = serviceAreas.find(sa => sa.id === job.service_area_id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/trabajos-realizados" className="text-primary-200 hover:text-white mb-4 inline-block">
            ← Volver a trabajos realizados
          </Link>
          <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="bg-primary-600 text-primary-100 px-3 py-1 rounded-full text-sm font-medium">
              {getServiceTypeLabel(job.service_type)}
            </span>
            {serviceArea && (
              <span className="flex items-center text-primary-100">
                <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                {serviceArea.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Job Description */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Descripción del trabajo</h2>
          {job.description ? (
            <p className="text-slate-700 leading-relaxed">{job.description}</p>
          ) : (
            <p className="text-slate-500 italic">No hay descripción disponible</p>
          )}
        </div>

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Galería del proyecto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.description || 'Foto del trabajo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  {photo.tag && (
                    <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full ${getTagColor(photo.tag)}`}>
                      {getTagLabel(photo.tag)}
                    </span>
                  )}
                  {photo.description && (
                    <p className="mt-2 text-sm text-slate-600 text-center">
                      {photo.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            ¿Quieres algo parecido en tu hogar?
          </h2>
          <p className="text-slate-600 mb-6">
            Agenda tu cita gratuita y cuéntanos sobre tu proyecto. Nuestro equipo estará encantado de ayudarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/agenda"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              Agendar cita gratuita
              <span className="material-symbols-outlined">calendar_today</span>
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Contactar ahora
              <span className="material-symbols-outlined">phone</span>
            </Link>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Compartir este trabajo</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">link</span>
              Copiar enlace
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              Compartir por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.description || 'Foto del trabajo'}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            {selectedPhoto.tag && (
              <span className={`absolute top-4 left-4 px-3 py-1 text-sm font-medium rounded-full ${getTagColor(selectedPhoto.tag)}`}>
                {getTagLabel(selectedPhoto.tag)}
              </span>
            )}
            {selectedPhoto.description && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                <p className="text-sm">{selectedPhoto.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}