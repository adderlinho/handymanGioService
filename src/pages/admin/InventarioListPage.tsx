import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';
import type { InventoryItem } from '../../types/inventory';

export default function InventarioListPage() {
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventario</h1>
        <Link
          to="/admin/inventario/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Nuevo artículo
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
            className="rounded border-slate-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">Mostrar solo bajo stock</span>
        </label>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Stock mínimo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-slate-900">{item.name}</div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {item.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${isLowStock(item) ? 'text-red-600' : 'text-slate-900'}`}>
                      {item.quantity || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {item.unit || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {item.location || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {item.min_quantity || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/inventario/${item.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">inventory_2</span>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {showLowStockOnly ? 'No hay artículos con bajo stock' : 'No hay artículos en inventario'}
            </h3>
            <p className="text-slate-500 mb-4">
              {showLowStockOnly 
                ? 'Todos los artículos tienen stock suficiente'
                : 'Comienza agregando tu primer artículo al inventario'
              }
            </p>
            {!showLowStockOnly && (
              <Link
                to="/admin/inventario/nuevo"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Nuevo artículo
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}