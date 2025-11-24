import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';
import type { InventoryItem, InventoryMovement, InventoryMovementType } from '../../types/inventory';

export default function InventarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<InventoryItem>>({});
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [movementForm, setMovementForm] = useState({
    type: 'in' as InventoryMovementType,
    quantity: 0,
    reason: ''
  });

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [itemData, movementsData] = await Promise.all([
        inventoryService.getInventoryItemById(id),
        inventoryService.getMovementsByItem(id)
      ]);
      
      setItem(itemData);
      setMovements(movementsData);
      setEditData(itemData || {});
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !item) return;
    
    try {
      const cleanData = Object.fromEntries(
        Object.entries(editData).filter(([_, value]) => value !== null)
      );
      const updated = await inventoryService.updateInventoryItem(id, cleanData);
      setItem(updated);
      setEditing(false);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || movementForm.quantity === 0) return;

    try {
      await inventoryService.createMovement({
        item_id: id,
        type: movementForm.type,
        quantity: movementForm.quantity,
        reason: movementForm.reason || undefined
      });
      
      setMovementForm({ type: 'in', quantity: 0, reason: '' });
      setShowMovementForm(false);
      loadData(); // Reload to get updated data
    } catch (error) {
      console.error('Error adding movement:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMovementTypeLabel = (type: InventoryMovementType) => {
    switch (type) {
      case 'in': return 'Entrada';
      case 'out': return 'Salida';
      case 'adjust': return 'Ajuste';
    }
  };

  const getMovementTypeColor = (type: InventoryMovementType) => {
    switch (type) {
      case 'in': return 'text-green-600 bg-green-50';
      case 'out': return 'text-red-600 bg-red-50';
      case 'adjust': return 'text-blue-600 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Artículo no encontrado</h3>
        <button
          onClick={() => navigate('/admin/inventario')}
          className="text-primary hover:text-primary/80"
        >
          Volver al inventario
        </button>
      </div>
    );
  }

  const isLowStock = (item.quantity || 0) <= (item.min_quantity || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/inventario')}
          className="flex items-center justify-center rounded-lg h-10 w-10 hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold">{item.name}</h1>
        {isLowStock && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Bajo stock
          </span>
        )}
      </div>

      {/* Item Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Resumen del artículo</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              {editing ? 'close' : 'edit'}
            </span>
            {editing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            {editing ? (
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            ) : (
              <p className="text-slate-900">{item.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
            {editing ? (
              <input
                type="text"
                value={editData.sku || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, sku: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            ) : (
              <p className="text-slate-900">{item.sku || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            {editing ? (
              <select
                value={editData.category || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Seleccionar categoría</option>
                <option value="plomeria">Plomería</option>
                <option value="electricidad">Electricidad</option>
                <option value="drywall">Drywall</option>
                <option value="pintura">Pintura</option>
                <option value="herramientas">Herramientas</option>
                <option value="ferreteria">Ferretería</option>
                <option value="otros">Otros</option>
              </select>
            ) : (
              <p className="text-slate-900">{item.category || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad actual</label>
            <p className={`font-semibold ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>
              {item.quantity || 0} {item.unit}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stock mínimo</label>
            {editing ? (
              <input
                type="number"
                min="0"
                step="0.01"
                value={editData.min_quantity || 0}
                onChange={(e) => setEditData(prev => ({ ...prev, min_quantity: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            ) : (
              <p className="text-slate-900">{item.min_quantity || 0}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
            {editing ? (
              <select
                value={editData.location || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Seleccionar ubicación</option>
                <option value="Camión 1">Camión 1</option>
                <option value="Camión 2">Camión 2</option>
                <option value="Bodega">Bodega</option>
                <option value="Oficina">Oficina</option>
              </select>
            ) : (
              <p className="text-slate-900">{item.location || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Costo por unidad</label>
            {editing ? (
              <input
                type="number"
                min="0"
                step="0.01"
                value={editData.cost_per_unit || 0}
                onChange={(e) => setEditData(prev => ({ ...prev, cost_per_unit: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            ) : (
              <p className="text-slate-900">${item.cost_per_unit || 0}</p>
            )}
          </div>
        </div>

        {editing && (
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              onClick={() => {
                setEditing(false);
                setEditData(item);
              }}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        )}
      </div>

      {/* Movements */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Movimientos</h2>
          <button
            onClick={() => setShowMovementForm(!showMovementForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Agregar movimiento
          </button>
        </div>

        {showMovementForm && (
          <form onSubmit={handleAddMovement} className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={movementForm.type}
                  onChange={(e) => setMovementForm(prev => ({ ...prev, type: e.target.value as InventoryMovementType }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="in">Entrada</option>
                  <option value="out">Salida</option>
                  <option value="adjust">Ajuste</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cantidad</label>
                <input
                  type="number"
                  step="0.01"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Motivo</label>
                <input
                  type="text"
                  value={movementForm.reason}
                  onChange={(e) => setMovementForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Opcional"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowMovementForm(false)}
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trabajo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {formatDate(movement.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMovementTypeColor(movement.type)}`}>
                      {getMovementTypeLabel(movement.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {movement.type === 'out' ? '-' : '+'}{movement.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {movement.reason || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {movement.job_id ? (
                      <Link
                        to={`/admin/trabajos/${movement.job_id}`}
                        className="text-primary hover:text-primary/80"
                      >
                        Ver trabajo
                      </Link>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {movements.length === 0 && (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">history</span>
            <p className="text-slate-500">No hay movimientos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}