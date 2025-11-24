import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById, updateJob } from '../../services/jobsService';
import { getJobWorkersByJob, updateJobWorker, assignWorkerToJob, removeJobWorker } from '../../services/jobWorkersService';
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

export default function TrabajoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [jobWorkers, setJobWorkers] = useState<JobWorker[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [jobMaterials, setJobMaterials] = useState<JobMaterialWithItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [jobPhotos, setJobPhotos] = useState<JobPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingPricing, setEditingPricing] = useState(false);
  const [editingWorkers, setEditingWorkers] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
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

  const getStatusBadge = (status: JobStatus) => {
    const statusConfig = {
      'lead': 'bg-gray-100 text-gray-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-amber-100 text-amber-800',
      'completed': 'bg-green-100 text-green-800',
      'invoiced': 'bg-cyan-100 text-cyan-800',
      'paid': 'bg-emerald-100 text-emerald-800'
    };

    const statusLabels = {
      'lead': 'Lead',
      'scheduled': 'Programado',
      'in_progress': 'En Progreso',
      'completed': 'Completado',
      'invoiced': 'Facturado',
      'paid': 'Pagado'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {statusLabels[status]}
      </span>
    );
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
      setEditingStatus(false);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handlePricingUpdate = async (pricing: {
    travel_fee: number;
    labor_total: number;
    materials_total: number;
    other_fees: number;
  }) => {
    if (!job) return;
    
    const total_amount = pricing.travel_fee + pricing.labor_total + pricing.materials_total + pricing.other_fees;
    
    try {
      await updateJob(job.id, { ...pricing, total_amount });
      setJob({ ...job, ...pricing, total_amount });
      setEditingPricing(false);
    } catch (err) {
      console.error('Error updating pricing:', err);
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/trabajos" className="text-sm text-slate-600 hover:text-primary mb-2 inline-block">
            ← Volver a trabajos
          </Link>
          <h1 className="text-3xl font-bold">Detalle del trabajo</h1>
        </div>
        {job.status === 'completed' && (
          <div className="flex gap-2">
            <a
              href={`/trabajos/${job.id}/public`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Ver vista pública
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/trabajos/${job.id}/public`)}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Copiar enlace público
            </button>
          </div>
        )}
      </div>

      {/* Job Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
            <div className="flex items-center gap-4">
              {getStatusBadge(job.status)}
              {job.scheduled_date && (
                <span className="text-sm text-slate-600">
                  📅 {new Date(job.scheduled_date).toLocaleDateString()}
                </span>
              )}
              {job.time_window && (
                <span className="text-sm text-slate-600">
                  🕐 {job.time_window}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setEditingStatus(!editingStatus)}
            className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Editar estado
          </button>
        </div>

        {editingStatus && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center gap-4">
              <select
                value={job.status}
                onChange={(e) => handleStatusUpdate(e.target.value as JobStatus)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="lead">Lead</option>
                <option value="scheduled">Programado</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completado</option>
                <option value="invoiced">Facturado</option>
                <option value="paid">Pagado</option>
              </select>
              <button
                onClick={() => setEditingStatus(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer & Address */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Datos del cliente</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Nombre</p>
              <p className="font-medium">{job.customer_name}</p>
            </div>
            {job.customer_phone && (
              <div>
                <p className="text-sm text-slate-600">Teléfono</p>
                <a href={`tel:${job.customer_phone}`} className="font-medium text-primary hover:text-primary/80">
                  {job.customer_phone}
                </a>
              </div>
            )}
            {job.customer_email && (
              <div>
                <p className="text-sm text-slate-600">Correo</p>
                <a href={`mailto:${job.customer_email}`} className="font-medium text-primary hover:text-primary/80">
                  {job.customer_email}
                </a>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-600">Dirección</p>
              <div className="font-medium">
                {job.address_street}
                {job.address_unit && `, ${job.address_unit}`}
                <br />
                {job.city}, {job.state} {job.zip}
                {serviceArea && (
                  <div className="text-sm text-primary mt-1">
                    Zona: {serviceArea.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Detalles del trabajo</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Tipo de servicio</p>
              <p className="font-medium">{getServiceTypeLabel(job.service_type)}</p>
            </div>
            {job.description && (
              <div>
                <p className="text-sm text-slate-600">Descripción</p>
                <p className="font-medium">{job.description}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-slate-600">Creado</p>
              <p className="font-medium">{new Date(job.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Última actualización</p>
              <p className="font-medium">{new Date(job.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workers */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Trabajadores asignados</h3>
          <button
            onClick={() => setEditingWorkers(!editingWorkers)}
            className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Editar trabajadores
          </button>
        </div>

        {jobWorkers.length === 0 ? (
          <p className="text-slate-600">No hay trabajadores asignados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Trabajador</th>
                  <th className="px-4 py-3 text-left">Rol</th>
                  <th className="px-4 py-3 text-right">Horas normales</th>
                  <th className="px-4 py-3 text-right">Horas extra</th>
                  <th className="px-4 py-3 text-right">Tarifa</th>
                  <th className="px-4 py-3 text-right">Costo</th>
                </tr>
              </thead>
              <tbody>
                {jobWorkers.map((jw: any) => (
                  <tr key={jw.id} className="border-b border-slate-200">
                    <td className="px-4 py-3 font-medium">
                      <Link 
                        to={`/admin/trabajadores/${jw.worker_id}`}
                        className="text-primary hover:text-primary/80"
                      >
                        {jw.worker?.first_name} {jw.worker?.last_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{jw.worker?.role}</td>
                    <td className="px-4 py-3 text-right">{jw.hours_regular || 0}</td>
                    <td className="px-4 py-3 text-right">{jw.hours_overtime || 0}</td>
                    <td className="px-4 py-3 text-right">
                      {jw.labor_rate ? `$${jw.labor_rate}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {jw.labor_cost ? `$${jw.labor_cost}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Evidence/Photos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Evidencia del trabajo</h3>
          <button
            onClick={() => setShowAddPhoto(!showAddPhoto)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add_a_photo</span>
            Agregar foto
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
          <p className="text-slate-600 text-center py-8">No se han agregado fotos a este trabajo</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {jobPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.description || 'Foto del trabajo'}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(photo.url, '_blank')}
                  />
                </div>
                {photo.tag && (
                  <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full ${getTagColor(photo.tag)}`}>
                    {getTagLabel(photo.tag)}
                  </span>
                )}
                <button
                  onClick={() => handleDeletePhoto(photo)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                {photo.description && (
                  <p className="mt-2 text-sm text-slate-600 truncate" title={photo.description}>
                    {photo.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Materials */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Materiales utilizados</h3>
          <button
            onClick={() => setShowAddMaterial(!showAddMaterial)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Agregar material
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
          <p className="text-slate-600 text-center py-8">No se han agregado materiales a este trabajo</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Artículo</th>
                  <th className="px-4 py-3 text-right">Cantidad</th>
                  <th className="px-4 py-3 text-right">Costo unitario</th>
                  <th className="px-4 py-3 text-right">Costo total</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jobMaterials.map((material) => (
                  <tr key={material.id} className="border-b border-slate-200">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/inventario/${material.item_id}`}
                        className="font-medium text-primary hover:text-primary/80"
                      >
                        {material.item_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {material.quantity} {material.item_unit}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${material.unit_cost?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ${material.total_cost?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemoveMaterial(material.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4 pt-4 border-t">
              <div className="text-right">
                <p className="text-sm text-slate-600">Subtotal de materiales</p>
                <p className="text-lg font-semibold">
                  ${jobMaterials.reduce((sum, m) => sum + (m.total_cost || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Precios</h3>
          <button
            onClick={() => setEditingPricing(!editingPricing)}
            className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Editar precios
          </button>
        </div>

        {editingPricing ? (
          <PricingEditor
            job={job}
            onSave={handlePricingUpdate}
            onCancel={() => setEditingPricing(false)}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600">Desplazamiento</p>
              <p className="text-lg font-semibold">${job.travel_fee?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Mano de obra</p>
              <p className="text-lg font-semibold">${job.labor_total?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Materiales</p>
              <p className="text-lg font-semibold">${job.materials_total?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Otros</p>
              <p className="text-lg font-semibold">${job.other_fees?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        )}

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${job.total_amount?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pricing Editor Component
interface PricingEditorProps {
  job: Job;
  onSave: (pricing: {
    travel_fee: number;
    labor_total: number;
    materials_total: number;
    other_fees: number;
  }) => void;
  onCancel: () => void;
}

function PricingEditor({ job, onSave, onCancel }: PricingEditorProps) {
  const [pricing, setPricing] = useState({
    travel_fee: job.travel_fee || 0,
    labor_total: job.labor_total || 0,
    materials_total: job.materials_total || 0,
    other_fees: job.other_fees || 0
  });

  const total = pricing.travel_fee + pricing.labor_total + pricing.materials_total + pricing.other_fees;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(pricing);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Desplazamiento</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={pricing.travel_fee}
              onChange={(e) => setPricing(prev => ({ ...prev, travel_fee: parseFloat(e.target.value) || 0 }))}
              className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mano de obra</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={pricing.labor_total}
              onChange={(e) => setPricing(prev => ({ ...prev, labor_total: parseFloat(e.target.value) || 0 }))}
              className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Materiales</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={pricing.materials_total}
              onChange={(e) => setPricing(prev => ({ ...prev, materials_total: parseFloat(e.target.value) || 0 }))}
              className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Otros</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={pricing.other_fees}
              onChange={(e) => setPricing(prev => ({ ...prev, other_fees: parseFloat(e.target.value) || 0 }))}
              className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <span className="text-lg font-semibold">Total: ${total.toFixed(2)}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Guardar
          </button>
        </div>
      </div>
    </form>
  );
}