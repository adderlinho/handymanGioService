import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../../services/jobsService';
import { getPhotosByJob } from '../../services/jobPhotosService';
import { getServiceAreas } from '../../services/serviceAreasService';
import { useTranslation } from '../../i18n/LanguageContext';
import type { Job } from '../../types/job';
import type { JobPhoto } from '../../types/jobPhotos';
import type { ServiceArea } from '../../types/serviceAreas';

interface JobWithPhoto extends Job {
  mainPhoto?: JobPhoto;
}

export default function TrabajosRealizadosPage() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<JobWithPhoto[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  useEffect(() => {
    loadCompletedJobs();
  }, []);

  const loadCompletedJobs = async () => {
    try {
      setLoading(true);
      const [allJobs, areas] = await Promise.all([
        getJobs(),
        getServiceAreas()
      ]);

      const completedJobs = allJobs.filter(job => 
        job.status === 'completed' || job.status === 'paid'
      );

      // Load main photo for each job
      const jobsWithPhotos = await Promise.all(
        completedJobs.map(async (job) => {
          try {
            const photos = await getPhotosByJob(job.id);
            const mainPhoto = photos.find(p => p.tag === 'after') || photos[0];
            return { ...job, mainPhoto };
          } catch {
            return job;
          }
        })
      );

      setJobs(jobsWithPhotos);
      setServiceAreas(areas);
    } catch (err) {
      console.error('Error loading completed jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getServiceTypeLabel = (serviceType: string) => {
    return t(`service.${serviceType}`) || serviceType;
  };

  const filteredJobs = selectedServiceType 
    ? jobs.filter(job => job.service_type === selectedServiceType)
    : jobs;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">{t('public.portfolio.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{t('public.portfolio.title')}</h1>
          <p className="text-xl text-primary-100">
            {t('public.portfolio.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">{t('public.portfolio.filter.allServices')}</option>
              <option value="plumbing">{t('service.plumbing')}</option>
              <option value="electrical">{t('service.electrical')}</option>
              <option value="drywall_paint">{t('service.drywall_paint')}</option>
              <option value="carpentry">{t('service.carpentry')}</option>
              <option value="flooring">{t('service.flooring')}</option>
              <option value="other">{t('service.other')}</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">
              {selectedServiceType 
                ? t('public.portfolio.noResults')
                : t('public.portfolio.empty')
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const serviceArea = serviceAreas.find(sa => sa.id === job.service_area_id);
              
              return (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Photo */}
                  <div className="aspect-video bg-slate-100">
                    {job.mainPhoto ? (
                      <img
                        src={job.mainPhoto.url}
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl">image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
                        {job.title}
                      </h3>
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        {getServiceTypeLabel(job.service_type)}
                      </span>
                    </div>

                    {serviceArea && (
                      <p className="text-sm text-slate-600 mb-3 flex items-center">
                        <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                        {serviceArea.name}
                      </p>
                    )}

                    {job.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    <Link
                      to={`/trabajos/${job.id}/public`}
                      className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      {t('public.portfolio.card.viewDetail')}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {t('public.portfolio.cta.title')}
          </h2>
          <p className="text-slate-600 mb-6">
            {t('public.portfolio.cta.subtitle')}
          </p>
          <Link
            to="/agenda"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            {t('public.portfolio.cta.button')}
            <span className="material-symbols-outlined">calendar_today</span>
          </Link>
        </div>
      </div>
    </div>
  );
}