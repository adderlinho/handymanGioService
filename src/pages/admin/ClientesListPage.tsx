import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clientsService } from '../../services/clientsService';
import type { Client } from '../../types/client';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';

export default function ClientesListPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsService.getAll();
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await clientsService.searchByName(query);
        setClients(results);
      } catch (err) {
        console.error('Error searching clients:', err);
      }
    } else {
      loadClients();
    }
  };

  if (loading) {
    return (
      <AdminPageLayout title="Clientes" subtitle="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando clientes...</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Clientes"
      subtitle="Gestiona la información de tus clientes"
      primaryAction={{
        label: "Nuevo Cliente",
        onClick: () => navigate('/admin/clientes/nuevo'),
        icon: "👥"
      }}
    >
      <AdminSectionCard title="Buscar clientes">
        <div>
          <label className="block text-sm md:text-base font-medium text-slate-800 mb-2">
            Buscar por nombre
          </label>
          <input
            type="text"
            placeholder="Escribe el nombre del cliente..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full max-w-md h-11 md:h-12 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm md:text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title={`Lista de clientes (${clients.length})`}>
        {clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">
              {searchQuery ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm md:text-base">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Teléfono</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Email</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Dirección</th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-slate-600">Trabajos</th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold text-slate-900">
                        {client.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <a href={`tel:${client.phone}`} className="text-blue-600 hover:text-blue-800 font-medium">
                        📞 {client.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {client.email ? (
                        <a href={`mailto:${client.email}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          ✉️ {client.email}
                        </a>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">
                      {client.mainAddress || '-'}
                    </td>
                    <td className="px-4 py-3 align-top text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs md:text-sm font-medium bg-blue-100 text-blue-800">
                        {client.jobsCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-center">
                      <Link
                        to={`/admin/clientes/${client.id}`}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        👁 Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminSectionCard>
    </AdminPageLayout>
  );
}