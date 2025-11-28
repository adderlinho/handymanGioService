import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clientsService, type ClientInput } from '../../services/clientsService';
import { getJobs } from '../../services/jobsService';
import { formatPhoneNumber } from '../../utils/phoneFormat';
import { useTranslation } from '../../i18n/LanguageContext';
import type { Client } from '../../types/client';
import type { Job } from '../../types/job';

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [client, setClient] = useState<Client | null>(null);
  const [clientJobs, setClientJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ClientInput>({
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    mainAddress: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      loadClientData(id);
    }
  }, [id]);

  const loadClientData = async (clientId: string) => {
    try {
      setLoading(true);
      const [clientData, allJobs] = await Promise.all([
        clientsService.getById(clientId),
        getJobs()
      ]);

      if (!clientData) return;

      setClient(clientData);
      setFormData({
        fullName: clientData.fullName,
        phone: clientData.phone,
        whatsapp: clientData.whatsapp,
        email: clientData.email,
        mainAddress: clientData.mainAddress,
        notes: clientData.notes
      });

      // Filter jobs by client name/phone (since jobs don't have client_id)
      const jobs = allJobs.filter(job => 
        job.customer_name === clientData.fullName || 
        job.customer_phone === clientData.phone
      );
      setClientJobs(jobs);
    } catch (err) {
      console.error('Error loading client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!client || !id) return;

    try {
      const updatedClient = await clientsService.update(id, formData);
      setClient(updatedClient);
      setEditing(false);
    } catch (err) {
      console.error('Error updating client:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'lead': 'bg-gray-100 text-gray-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-amber-100 text-amber-800',
      'completed': 'bg-green-100 text-green-800',
      'invoiced': 'bg-cyan-100 text-cyan-800',
      'paid': 'bg-emerald-100 text-emerald-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">{t('admin.clients.detail.notFound')}</p>
        <Link to="/admin/clientes" className="text-primary hover:text-primary/80">
          ← {t('admin.clients.detail.backToList')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link to="/admin/clientes" className="text-sm text-slate-600 hover:text-primary mb-2 inline-block">
          ← {t('admin.clients.detail.backToList')}
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{client.fullName}</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            {editing ? t('common.cancel') : t('common.edit')}
          </button>
        </div>
      </div>

      {/* Client Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-4">{t('admin.clients.detail.section.clientInfo')}</h2>
        
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.clients.form.fullName')}</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('common.phone')}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="(312) 555-0123"
                  maxLength={17}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.clients.form.whatsapp')}</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: formatPhoneNumber(e.target.value) }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="(312) 555-0123"
                  maxLength={17}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('common.email')}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.clients.form.mainAddress')}</label>
              <input
                type="text"
                value={formData.mainAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, mainAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.clients.form.notes')}</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">{t('common.phone')}</p>
                <a href={`tel:${client.phone}`} className="font-medium text-primary hover:text-primary/80">
                  {client.phone}
                </a>
              </div>
              <div>
                <p className="text-sm text-slate-600">{t('admin.clients.form.whatsapp')}</p>
                <p className="font-medium">{client.whatsapp || t('admin.clients.detail.notSpecified')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">{t('common.email')}</p>
                <a href={`mailto:${client.email}`} className="font-medium text-primary hover:text-primary/80">
                  {client.email || t('admin.clients.detail.notSpecified')}
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">{t('admin.clients.form.mainAddress')}</p>
                <p className="font-medium">{client.mainAddress || t('admin.clients.detail.notSpecified')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">{t('admin.clients.form.notes')}</p>
                <p className="font-medium">{client.notes || t('admin.clients.detail.noNotes')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client Jobs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-4">{t('admin.clients.detail.section.jobs')} ({clientJobs.length})</h2>
        
        {clientJobs.length === 0 ? (
          <p className="text-slate-600 text-center py-8">{t('admin.clients.detail.noJobs')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">{t('admin.clients.detail.table.job')}</th>
                  <th className="px-4 py-3 text-left">{t('common.status')}</th>
                  <th className="px-4 py-3 text-left">{t('common.date')}</th>
                  <th className="px-4 py-3 text-right">{t('common.total')}</th>
                  <th className="px-4 py-3 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {clientJobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-200">
                    <td className="px-4 py-3 font-medium">{job.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {job.total_amount ? `$${job.total_amount.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/trabajos/${job.id}`}
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        {t('common.view')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}