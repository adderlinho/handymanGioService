import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientsService } from '../../services/clientsService';
import type { Client } from '../../types/client';

export default function ClientesListPage() {
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Link
          to="/admin/clientes/nuevo"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo cliente
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar clientes por nombre..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No hay clientes registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Teléfono</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Dirección</th>
                  <th className="px-4 py-3 text-center">Trabajos</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-200">
                    <td className="px-4 py-3 font-medium">
                      <Link
                        to={`/admin/clientes/${client.id}`}
                        className="text-primary hover:text-primary/80"
                      >
                        {client.fullName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`tel:${client.phone}`} className="text-primary hover:text-primary/80">
                        {client.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${client.email}`} className="text-primary hover:text-primary/80">
                        {client.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{client.mainAddress}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-full text-xs">
                        {client.jobsCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/clientes/${client.id}`}
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        Ver detalle
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