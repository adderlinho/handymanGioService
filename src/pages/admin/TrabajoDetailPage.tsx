import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById, updateJob } from '../../services/jobsService';
import { getJobWorkersByJob } from '../../services/jobWorkersService';
import { getWorkers } from '../../services/workersService';
import { getServiceAreas } from '../../services/serviceAreasService';
import { jobMaterialsService } from '../../services/jobMaterialsService';
import { inventoryService } from '../../services/inventoryService';
import { getPhotosByJob, createJobPhoto, deleteJobPhoto } from '../../services/jobPhotosService';
import { uploadJobPhoto, deleteJobPhotoFromStorage } from '../../services/storageService';
import type { Job, JobStatus } from '../../types/job';
import type { JobWorker } from '../../types/jobWorkers';
import type { Worker } from '../../types/workers';
import type { ServiceArea } from '../../types/serviceAreas';
import type { JobMaterialWithItem } from '../../types/jobMaterials';
import type { InventoryItem } from '../../types/inventory';
import type { JobPhoto, JobPhotoTag } from '../../types/jobPhotos';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminButton from '../../components/admin/ui/AdminButton';
import AdminStatusBadge from '../../components/admin/ui/AdminStatusBadge';

export default function TrabajoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [jobWorkers, setJobWorkers] = useState<JobWorker[]>([]);
  const [, setWorkers] = useState<Worker[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [jobMaterials, setJobMaterials] = useState<JobMaterialWithItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [jobPhotos, setJobPhotos] = useState<JobPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [availableWorkers, setAvailableWorkers] = useState<Worker[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    item_id: '',
    quantity: 0,
    unit_cost: 0
  });
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
      const [jobData, jobWorkersData, workersData, serviceAreasData, materialsData, inventoryData, photosData] = await Promise.all([
        getJobById(jobId),
        getJobWorkersByJob(jobId),
        getWorkers(),
        getServiceAreas(),
        jobMaterialsService.getJobMaterials(jobId),
        inventoryService.getInventoryItems(),
        getPhotosByJob(jobId)
      ]);

      setAvailableWorkers(workersData);

      if (!jobData) {
        setError('Trabajo no encontrado');
        return;
      }

      setJob(jobData);
      setJobWorkers(jobWorkersData);
      setWorkers(workersData);
      setServiceAreas(serviceAreasData);
      setJobMaterials(materialsData);
      setInventoryItems(inventoryData);
      setJobPhotos(photosData);
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

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !materialForm.item_id || materialForm.quantity <= 0) return;

    try {
      await jobMaterialsService.addMaterialToJob({
        job_id: job.id,
        item_id: materialForm.item_id,
        quantity: materialForm.quantity,
        unit_cost: materialForm.unit_cost || undefined
      });

      // Reload materials and update job pricing
      const [updatedMaterials, materialsTotal] = await Promise.all([
        jobMaterialsService.getJobMaterials(job.id),
        jobMaterialsService.getJobMaterialsTotal(job.id)
      ]);

      setJobMaterials(updatedMaterials);
      
      // Update job with new materials total
      const newTotalAmount = (job.travel_fee || 0) + (job.labor_total || 0) + materialsTotal + (job.other_fees || 0);
      await updateJob(job.id, { materials_total: materialsTotal, total_amount: newTotalAmount });
      setJob({ ...job, materials_total: materialsTotal, total_amount: newTotalAmount });

      setMaterialForm({ item_id: '', quantity: 0, unit_cost: 0 });
      setShowAddMaterial(false);
    } catch (err) {
      console.error('Error adding material:', err);
    }
  };

  const handleRemoveMaterial = async (materialId: number) => {
    if (!job) return;

    try {
      await jobMaterialsService.removeJobMaterial(materialId);
      
      // Reload materials and update job pricing
      const [updatedMaterials, materialsTotal] = await Promise.all([
        jobMaterialsService.getJobMaterials(job.id),
        jobMaterialsService.getJobMaterialsTotal(job.id)
      ]);

      setJobMaterials(updatedMaterials);
      
      // Update job with new materials total
      const newTotalAmount = (job.travel_fee || 0) + (job.labor_total || 0) + materialsTotal + (job.other_fees || 0);
      await updateJob(job.id, { materials_total: materialsTotal, total_amount: newTotalAmount });
      setJob({ ...job, materials_total: materialsTotal, total_amount: newTotalAmount });
    } catch (err) {
      console.error('Error removing material:', err);
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
      {/* Header with status and key info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="text-center mb-6">
          <AdminStatusBadge status={job.status} variant="job" />
          <h2 className="text-2xl font-bold text-slate-900 mt-4">{job.customer_name}</h2>
          <p className="text-lg text-slate-600 mt-2">{getServiceTypeLabel(job.service_type)}</p>
          {job.scheduled_date && (
            <p className="text-lg text-slate-700 mt-2">
              📅 {new Date(job.scheduled_date).toLocaleDateString()}
            </p>
          )}
        </div>
        
        {/* Status change buttons */}
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
            {job.customer_email && (
              <a href={`mailto:${job.customer_email}`} className="block p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✉️</span>
                  <span className="text-lg font-semibold text-blue-700">{job.customer_email}</span>
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
      </div>

      {/* Workers section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">👷 Trabajadores</h3>
          <button
            onClick={() => setShowAddWorker(!showAddWorker)}
            className="flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-lg font-semibold"
          >
            <span className="text-xl">➕</span>
            Agregar Trabajador
          </button>
        </div>

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

      {/* Materials */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">🔧 Materiales</h3>
          <button
            onClick={() => setShowAddMaterial(!showAddMaterial)}
            className="flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-lg font-semibold"
          >
            <span className="text-xl">➕</span>
            Agregar Material
          </button>
        </div>

        {showAddMaterial && (
          <form onSubmit={handleAddMaterial} className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Artículo</label>
                <select
                  value={materialForm.item_id}
                  onChange={(e) => {
                    const selectedItem = inventoryItems.find(item => item.id === e.target.value);
                    setMaterialForm(prev => ({
                      ...prev,
                      item_id: e.target.value,
                      unit_cost: selectedItem?.cost_per_unit || 0
                    }));
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Seleccionar artículo</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.quantity || 0} {item.unit} disponibles)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cantidad</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={materialForm.quantity}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Costo unitario ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={materialForm.unit_cost}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, unit_cost: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddMaterial(false);
                  setMaterialForm({ item_id: '', quantity: 0, unit_cost: 0 });
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

        {jobMaterials.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <p className="text-xl text-slate-600">No hay materiales agregados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobMaterials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">📦</div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{material.item_name}</h4>
                    <p className="text-slate-600">
                      {material.quantity} {material.item_unit} × ${material.unit_cost?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      ${material.total_cost?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveMaterial(material.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="text-xl">🗑️</span>
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4 border-t-2 border-slate-200">
              <div className="text-right">
                <p className="text-lg text-slate-600">Total de materiales</p>
                <p className="text-2xl font-bold text-slate-900">
                  ${jobMaterials.reduce((sum, m) => sum + (m.total_cost || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">💰 Precio del Trabajo</h3>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-4 p-6 bg-primary/10 rounded-2xl">
            <span className="text-4xl">💰</span>
            <div>
              <p className="text-lg text-slate-600">Precio Total</p>
              <input
                type="number"
                step="0.01"
                min="0"
                value={job.total_amount || 0}
                onChange={(e) => handlePriceUpdate(parseFloat(e.target.value) || 0)}
                className="text-4xl font-bold text-primary bg-transparent border-none text-center focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2"
                style={{ width: 'auto', minWidth: '200px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}