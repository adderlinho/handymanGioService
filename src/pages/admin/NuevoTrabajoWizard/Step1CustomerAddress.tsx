import { useState, useEffect } from 'react';
import { getServiceAreaByZip } from '../../../services/serviceAreasService';
import { clientsService } from '../../../services/clientsService';
import { formatPhoneNumber } from '../../../utils/phoneFormat';
import { useTranslation } from '../../../i18n/LanguageContext';
import type { WizardJobData } from './types';
import type { Client } from '../../../types/client';

interface Step1Props {
  data: WizardJobData;
  updateData: (updates: Partial<WizardJobData>) => void;
  onNext: () => void;
}

export default function Step1CustomerAddress({ data, updateData, onNext }: Step1Props) {
  const { t } = useTranslation();
  const [zipLoading, setZipLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewClient, setIsNewClient] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const allClients = await clientsService.getAll();
      setClients(allClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleClientSearch = async (query: string) => {
    setClientSearch(query);
    if (query.length > 0) {
      setShowClientDropdown(true);
      try {
        const searchResults = await clientsService.searchByName(query);
        setClients(searchResults);
      } catch (error) {
        console.error('Error searching clients:', error);
      }
    } else {
      setShowClientDropdown(false);
      loadClients();
    }
  };

  const selectClient = (client: Client) => {
    setSelectedClient(client);
    setClientSearch(client.fullName);
    setShowClientDropdown(false);
    setIsNewClient(false);
    
    // Update form data with client info
    updateData({
      customer_name: client.fullName,
      customer_phone: client.phone,
      customer_email: client.email,
      address_street: client.mainAddress
    });
  };

  const clearClientSelection = () => {
    setSelectedClient(null);
    setClientSearch('');
    setIsNewClient(true);
    updateData({
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      address_street: ''
    });
  };

  const handleZipCheck = async (zipCode: string) => {
    if (!zipCode || zipCode.length < 5) return;
    
    setZipLoading(true);
    try {
      const serviceArea = await getServiceAreaByZip(zipCode);
      if (serviceArea) {
        updateData({
          service_area_id: serviceArea.id,
          service_area_name: serviceArea.name
        });
      } else {
        updateData({
          service_area_id: null,
          service_area_name: null
        });
      }
    } catch (error) {
      console.error('Error checking ZIP:', error);
    } finally {
      setZipLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.customer_name.trim()) return;
    if (!isNewClient && !selectedClient) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('admin.jobs.new.step1')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!isNewClient}
                onChange={() => setIsNewClient(false)}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">{t('admin.jobs.form.existingClient')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={isNewClient}
                onChange={() => {
                  setIsNewClient(true);
                  clearClientSelection();
                }}
                className="text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">{t('admin.jobs.form.newClient')}</span>
            </label>
          </div>

          {!isNewClient ? (
            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                {t('admin.jobs.form.searchClient')} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => handleClientSearch(e.target.value)}
                  onFocus={() => setShowClientDropdown(true)}
                  placeholder={t('admin.jobs.form.searchClientPlaceholder')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
                {selectedClient && (
                  <button
                    type="button"
                    onClick={clearClientSelection}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>
              
              {showClientDropdown && clients.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => selectClient(client)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                    >
                      <div className="font-medium">{client.fullName}</div>
                      <div className="text-sm text-slate-600">
                        {client.phone} • {client.email}
                      </div>
                      <div className="text-xs text-slate-500">{client.mainAddress}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('admin.jobs.form.customerName')} *
              </label>
              <input
                type="text"
                value={data.customer_name}
                onChange={(e) => updateData({ customer_name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('admin.jobs.form.customerPhone')}
          </label>
          <input
            type="tel"
            value={data.customer_phone}
            onChange={(e) => updateData({ customer_phone: formatPhoneNumber(e.target.value) })}
            disabled={!isNewClient && !!selectedClient}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="(312) 555-0123"
            maxLength={17}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('admin.jobs.form.customerEmail')}
          </label>
          <input
            type="email"
            value={data.customer_email}
            onChange={(e) => updateData({ customer_email: e.target.value })}
            disabled={!isNewClient && !!selectedClient}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {t('admin.jobs.form.street')}
          </label>
          <input
            type="text"
            value={data.address_street}
            onChange={(e) => updateData({ address_street: e.target.value })}
            disabled={!isNewClient && !!selectedClient}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('admin.jobs.form.unit')}
          </label>
          <input
            type="text"
            value={data.address_unit}
            onChange={(e) => updateData({ address_unit: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('admin.jobs.form.city')}
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('admin.jobs.form.state')}
          </label>
          <input
            type="text"
            value={data.state}
            onChange={(e) => updateData({ state: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('admin.jobs.form.zip')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={data.zip}
              onChange={(e) => updateData({ zip: e.target.value })}
              onBlur={(e) => handleZipCheck(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {zipLoading && (
              <div className="flex items-center px-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          
          {data.service_area_name && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              {t('admin.jobs.form.serviceAreaFound', { name: data.service_area_name })}
            </div>
          )}
          
          {data.zip && data.service_area_name === null && data.service_area_id === null && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
              {t('admin.jobs.form.serviceAreaWarning')}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t('admin.jobs.form.next')}
        </button>
      </div>
    </form>
  );
}