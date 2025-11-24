import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';
import type { InventoryItem } from '../../types/inventory';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';

export default function InventarioListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  useEffect(() => {
    loadItems();
  }, [showLowStockOnly]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = showLowStockOnly 
        ? await inventoryService.getLowStockItems()
        : await inventoryService.getInventoryItems();
      setItems(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const isLowStock = (item: InventoryItem) => {
    return (item.quantity || 0) <= (item.min_quantity || 0);
  };

  if (loading) {
    return (
      <AdminPageLayout title="Inventario" subtitle="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando inventario...</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Inventario"
      subtitle="Gestiona materiales y herramientas"
      primaryAction={{
        label: "Nuevo Artículo",
        onClick: () => navigate('/admin/inventario/nuevo'),
        icon: "📦"
      }}
    >
      <AdminSectionCard title="Filtros">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm md:text-base font-medium text-slate-800">Mostrar solo bajo stock</span>
        </label>
      </AdminSectionCard>

      <AdminSectionCard title={`Artículos (${items.length})`}>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {showLowStockOnly ? 'No hay artículos con bajo stock' : 'No hay artículos en inventario'}
            </h3>
            <p className="text-slate-600 mb-4">
              {showLowStockOnly 
                ? 'Todos los artículos tienen stock suficiente'
                : 'Comienza agregando tu primer artículo al inventario'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm md:text-base">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Unidad</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Ubicación</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">Stock mín.</th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        {isLowStock(item) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Bajo stock
                          </span>
                        )}
                      </div>
                      {item.sku && (
                        <div className="text-sm text-slate-500">SKU: {item.sku}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">{item.category || '-'}</td>
                    <td className="px-4 py-3 align-top">
                      <span className={`font-medium ${isLowStock(item) ? 'text-red-600' : 'text-slate-900'}`}>
                        {item.quantity || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700">{item.unit || '-'}</td>
                    <td className="px-4 py-3 align-top text-slate-700">{item.location || '-'}</td>
                    <td className="px-4 py-3 align-top text-slate-700">{item.min_quantity || 0}</td>
                    <td className="px-4 py-3 align-top text-center">
                      <button
                        onClick={() => navigate(`/admin/inventario/${item.id}`)}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        👁 Ver
                      </button>
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