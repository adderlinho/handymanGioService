import { useState, useEffect } from 'react';
import { getServiceAreas } from '../../services/serviceAreasService';
import type { ServiceArea } from '../../types/serviceAreas';

export default function ServiceAreasDebugPage() {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServiceAreas();
  }, []);

  const loadServiceAreas = async () => {
    try {
      setLoading(true);
      const data = await getServiceAreas();
      setServiceAreas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading service areas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando áreas de servicio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Áreas de Servicio (Debug)</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Conexión a Supabase: ✅ Exitosa</h2>
        
        {serviceAreas.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">No hay áreas de servicio configuradas</p>
        ) : (
          <ul className="space-y-3">
            {serviceAreas.map((area) => (
              <li key={area.id} className="border-l-4 border-primary pl-4">
                <h3 className="font-medium">{area.name}</h3>
                {area.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">{area.description}</p>
                )}
                <p className="text-xs text-slate-500">ID: {area.id}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}