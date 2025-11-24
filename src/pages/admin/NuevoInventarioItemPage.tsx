import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';
import type { InventoryItemInput } from '../../types/inventory';

export default function NuevoInventarioItemPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InventoryItemInput>({
    name: '',
    sku: '',
    category: '',
    description: '',
    unit: '',
    quantity: 0,
    min_quantity: 0,
    location: '',
    cost_per_unit: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setLoading(true);
      const item = await inventoryService.createInventoryItem(formData);
      navigate(`/admin/inventario/${item.id}`);
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof InventoryItemInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/inventario')}
          className="flex items-center justify-center rounded-lg h-10 w-10 hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold">Nuevo artículo</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => updateField('sku', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Unidad
              </label>
              <select
                value={formData.unit}
                onChange={(e) => updateField('unit', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Seleccionar unidad</option>
                <option value="pieza">Pieza</option>
                <option value="caja">Caja</option>
                <option value="galón">Galón</option>
                <option value="metro">Metro</option>
                <option value="pie">Pie</option>
                <option value="libra">Libra</option>
                <option value="rollo">Rollo</option>
                <option value="paquete">Paquete</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cantidad inicial
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => updateField('quantity', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Stock mínimo
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.min_quantity}
                onChange={(e) => updateField('min_quantity', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ubicación
              </label>
              <select
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Seleccionar ubicación</option>
                <option value="Camión 1">Camión 1</option>
                <option value="Camión 2">Camión 2</option>
                <option value="Bodega">Bodega</option>
                <option value="Oficina">Oficina</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Costo por unidad ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.cost_per_unit}
                onChange={(e) => updateField('cost_per_unit', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/inventario')}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear artículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}