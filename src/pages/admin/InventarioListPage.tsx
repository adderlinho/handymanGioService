import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';
import { useTranslation } from '../../i18n/LanguageContext';
import type { InventoryItem } from '../../types/inventory';
import AdminPageLayout from '../../components/admin/ui/AdminPageLayout';
import AdminSectionCard from '../../components/admin/ui/AdminSectionCard';

export default function InventarioListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      <AdminPageLayout title={t('admin.inventory.title')} subtitle={t('admin.inventory.loading')}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">{t('admin.inventory.loading')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('admin.inventory.title')}
      subtitle={t('admin.inventory.subtitle')}
      primaryAction={{
        label: t('admin.inventory.new'),
        onClick: () => navigate('/admin/inventario/nuevo'),
        icon: "📦"
      }}
    >
      <AdminSectionCard title={t('admin.inventory.filters')}>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm md:text-base font-medium text-slate-800">{t('admin.inventory.showLowStock')}</span>
        </label>
      </AdminSectionCard>

      <AdminSectionCard title={t('admin.inventory.itemsTitle', { count: items.length })}>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {showLowStockOnly ? t('admin.inventory.noLowStock') : t('admin.inventory.noItems')}
            </h3>
            <p className="text-slate-600 mb-4">
              {showLowStockOnly 
                ? t('admin.inventory.noLowStockDesc')
                : t('admin.inventory.noItemsDesc')
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm md:text-base">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.inventory.table.name')}</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.inventory.table.category')}</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.inventory.table.quantity')}</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.inventory.table.unit')}</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.inventory.table.location')}</th>
                  <th className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-600">{t('admin.inventory.table.minStock')}</th>
                  <th className="px-4 py-3 text-center text-xs md:text-sm font-semibold text-slate-600">{t('admin.inventory.table.actions')}</th>
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
                            {t('admin.inventory.lowStock')}
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
                        👁 {t('admin.inventory.table.view')}
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