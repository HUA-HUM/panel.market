'use client';

import { useState, useMemo } from 'react';
import { ProductsFilters } from '@/src/core/entitis/madre/analitics/products-analitycs/ProductsFilters';

import { GetCategoriesRepository } from '@/src/core/driver/repository/madre/analitics/products-analitycs/categories/GetCategoriesRepository';
import { SearchCategoriesRepository } from '@/src/core/driver/repository/madre/analitics/products-analitycs/categories/SearchCategoriesRepository';
import { GetBrandsRepository } from '@/src/core/driver/repository/madre/analitics/brand-analitycs/GetBrandsRepository';
import { GetFoldersRepository } from '@/src/core/driver/repository/madre/analitics/favorites/folders/get/GetFoldersRepository';
import { SaveSelectionRepository } from '@/src/core/driver/repository/madre/analitics/products-analitycs/saveProducts/SaveSelectionRepository';
import { SaveSegmentRepository } from '@/src/core/driver/repository/madre/analitics/products-analitycs/segments/SaveSegmentRepository';
import { CreateMarketplaceRepository } from '@/src/core/driver/repository/madre/analitics/favorites/folders/create/CreateMarketplaceRepository';

import { useGetCategories } from './hooks/useCategories';
import { useSearchCategories } from './hooks/useSearchCategories';
import { useProductsOverview } from './hooks/useProductsOverview';
import { useBrands } from './hooks/useBrands';
import { useFolders } from './hooks/useFolders';
import { useSaveProductsFlow } from './hooks/useSaveProductsFlow';
import { useCreateFolder } from './actions/useCreateFolder';

import { CategorySelect } from './category-select/CategorySelect';
import { BrandSelect } from './brand-select/BrandSelect';
import { FolderSelect } from './folder-select/FolderSelect';
import { SaveToFolderBar } from './SaveToFolderBar';

export default function ProductsAnalyticsPanel() {

  /* ================= REPOSITORIES ================= */

  const brandsRepo = useMemo(() => new GetBrandsRepository(), []);
  const getCategoriesRepo = useMemo(() => new GetCategoriesRepository(), []);
  const searchCategoriesRepo = useMemo(() => new SearchCategoriesRepository(), []);
  const foldersRepo = useMemo(() => new GetFoldersRepository(), []);
  const saveSelectionRepo = useMemo(() => new SaveSelectionRepository(), []);
  const saveSegmentRepo = useMemo(() => new SaveSegmentRepository(), []);
  const createFolderRepo = useMemo(() => new CreateMarketplaceRepository(), []);

  /* ================= HOOKS ================= */

  const {
    brands,
    loading: brandsLoading,
    hasMore,
    loadMore,
    search: searchBrand,
  } = useBrands(brandsRepo);

const {
  categories,
  loading: categoriesLoading
} = useGetCategories(getCategoriesRepo)

  const {
    results: searchedCategories,
    search: searchCategory,
    loading: categoriesSearching,
  } = useSearchCategories(searchCategoriesRepo);

  const { folders, loading: foldersLoading, reload } = useFolders(foldersRepo);

  const {
    data: overview,
    loading: overviewLoading,
    execute,
  } = useProductsOverview();

  const { execute: saveProductsFlow, loading: savingFlow } =
    useSaveProductsFlow(saveSelectionRepo, saveSegmentRepo);

  const { execute: createFolder, loading: creatingFolder } =
    useCreateFolder(createFolderRepo);

  /* ================= STATE ================= */

  const [filters, setFilters] = useState<ProductsFilters>({});
  const [categorySearch, setCategorySearch] = useState('');

  const updateFilter = <K extends keyof ProductsFilters>(
    key: K,
    value: ProductsFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({});
    setCategorySearch('');
  };

  const categoriesToRender =
    categorySearch.length > 0 ? searchedCategories : categories;

  /* ================= HANDLERS ================= */

  const handleApplyFilters = async () => {
    await execute(filters);
  };

  const handleCreateFolder = async (name: string) => {
    await createFolder(name);
    await reload();
  };

  /* ================= UI ================= */

return (
  <div className="space-y-12">

    {/* ================= FILTER PANEL ================= */}

    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Filtros de productos
        </h2>

        <span className="text-xs text-zinc-500">
          Analiza tu catálogo y crea segmentos
        </span>
      </div>

      <div
        className="
        bg-zinc-900/60 backdrop-blur-lg
        p-10 rounded-3xl
        border border-zinc-800/60
        shadow-2xl shadow-black/30
        grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3
        gap-8
      "
      >
        {/* BRAND */}
        <BrandSelect
          brands={brands}
          loading={brandsLoading}
          hasMore={hasMore}
          search={searchBrand}
          onLoadMore={loadMore}
          onSelect={(brand) => updateFilter('brand', brand)}
        />

        {/* CATEGORY */}
        <CategorySelect
          categories={categories}
          categoriesLoading={categoriesLoading}
          searchResults={searchedCategories}
          searchLoading={categoriesSearching}
          onSearch={searchCategory}
          onSelect={(id) => updateFilter('categoryId', id)}
        />

        {/* FOLDER */}
        <FolderSelect
          folders={folders}
          loading={foldersLoading}
          value={filters.inMarketplace}
          onSelect={(id) => updateFilter('inMarketplace', id)}
        />

        <MatchedMarketplaceSelector
  value={filters.matchedMarketplace}
  onChange={(v) => updateFilter('matchedMarketplace', v)}
/>

        {/* PRICE */}
        <NumberInput
          label="Precio mínimo"
          value={filters.minPrice}
          onChange={(v) => updateFilter('minPrice', v)}
        />

        <NumberInput
          label="Precio máximo"
          value={filters.maxPrice}
          onChange={(v) => updateFilter('maxPrice', v)}
        />

        {/* VISITS */}
        <VisitsRange
          min={filters.minVisits}
          max={filters.maxVisits}
          onChange={({ min, max }) => {
            updateFilter('minVisits', min)
            updateFilter('maxVisits', max)
          }}
        />

        {/* ORDERS */}
        <NumberInput
          label="Órdenes mínimas"
          value={filters.minOrders}
          onChange={(v) => updateFilter('minOrders', v)}
        />

        <NumberInput
          label="Órdenes máximas"
          value={filters.maxOrders}
          onChange={(v) => updateFilter('maxOrders', v)}
        />

        {/* MARKETPLACE STATUS */}
        <MarketplaceStatusSelector
          value={filters.marketplaceStatus}
          onChange={(v) => updateFilter('marketplaceStatus', v)}
        />

        {/* PRODUCT STATUS */}
        <ProductStatusSelector
          value={filters.status}
          onChange={(v) => updateFilter('status', v)}
        />

        {/* EXCLUDE MARKETPLACES */}
        <TextInput
          label="Excluir marketplaces"
          value={filters.excludeMarketplace?.join(',')}
          placeholder="megatone,oncity"
          onChange={(v) =>
            updateFilter(
              'excludeMarketplace',
              v ? v.split(',').map((x) => x.trim()) : undefined
            )
          }
        />
      </div>
    </div>

    {/* ================= ACTIVE FILTERS ================= */}

    <ActiveFilters
      filters={filters}
      onRemove={(key) =>
        setFilters((prev) => ({
          ...prev,
          [key]: undefined,
        }))
      }
    />
    

    {/* ================= ACTION BUTTONS ================= */}

    <div className="flex items-center gap-4">
      <button
        onClick={handleApplyFilters}
        className="
        px-8 py-3 rounded-2xl
        bg-blue-600 hover:bg-blue-500
        text-white font-semibold
        shadow-lg shadow-blue-600/20
        transition-all duration-200
      "
      >
        Aplicar filtros
      </button>

      <button
        onClick={clearAllFilters}
        className="
        px-8 py-3 rounded-2xl
        bg-zinc-800 hover:bg-zinc-700
        text-zinc-300
        border border-zinc-700
        transition-all duration-200
      "
      >
        Limpiar filtros
      </button>
    </div>

    {/* ================= OVERVIEW ================= */}

    {overviewLoading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )}

    {overview && (
      <div className="space-y-8">

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard label="Productos" value={overview.totalProducts} />
          <StatCard label="Órdenes" value={overview.totalOrders} />
          <StatCard label="Visitas" value={overview.totalVisits} />
          <StatCard
            label="Revenue"
            value={`$${overview.totalRevenue.toLocaleString()}`}
          />
          <StatCard
            label="Precio Promedio"
            value={`$${overview.avgPrice.toFixed(2)}`}
          />
          <StatCard
            label="Ticket Promedio"
            value={`$${overview.avgTicket.toFixed(2)}`}
          />
        </div>

        {/* SAVE TO FOLDER */}
        {overview.totalProducts > 0 && (
          <div
            className="
            p-6
            bg-zinc-900/60
            border border-zinc-800
            rounded-2xl
            shadow-lg
            flex flex-col gap-4
          "
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Guardar productos
              </h3>

              <span className="text-xs text-zinc-500">
                {overview.totalProducts} productos encontrados
              </span>
            </div>

            <SaveToFolderBar
              folders={folders}
              filters={filters}
              onSaveFlow={saveProductsFlow}
              onCreateFolder={handleCreateFolder}
              loading={savingFlow || creatingFolder}
            />
          </div>
        )}
      </div>
    )}
  </div>
)
}

type ProductStatus =
  | 'active'
  | 'paused'
  | 'under_review'
  | 'closed';

type ProductStatusSelectorProps = {
  value?: ProductStatus;
  onChange: (value?: ProductStatus) => void;
};

function ProductStatusSelector({
  value,
  onChange,
}: {
  value?: 'active' | 'paused' | 'closed' | 'under_review';
  onChange: (value?: any) => void;
}) {
  const options = [
    { label: 'Activo', value: 'active' },
    { label: 'Pausado', value: 'paused' },
    { label: 'En revisión', value: 'under_review' },
    { label: 'Cerrado', value: 'closed' },
  ] as const;

  return (
    <div className="flex flex-col justify-end h-[88px]">
      <label className="text-sm text-zinc-400 mb-2">
        Estado del producto
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() =>
              onChange(value === item.value ? undefined : item.value)
            }
            className={`px-4 py-2 rounded-xl text-sm transition-all
              ${
                value === item.value
                  ? 'bg-white text-black shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-zinc-900/70 backdrop-blur
                    p-8 rounded-2xl
                    border border-zinc-800
                    shadow-lg hover:shadow-xl
                    transition-all duration-200">
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="text-2xl font-semibold text-white mt-3">
        {value}
      </div>
    </div>
  );
}


type NumberInputProps = {
  label: string;
  value?: number;
  onChange: (value?: number) => void;
};

function NumberInput({ label, value, onChange }: NumberInputProps) {
  return (
    <div className="flex flex-col justify-end h-[88px]">
      <label className="text-sm text-zinc-400 mb-2">{label}</label>

      <div className="relative">
        <input
          type="number"
          value={value ?? ''}
          className="w-full h-10 px-3 pr-8 bg-zinc-800 rounded-lg 
                     border border-zinc-700 
                     focus:ring-2 focus:ring-blue-600 
                     focus:outline-none transition"
          onChange={(e) =>
            onChange(e.target.value ? Number(e.target.value) : undefined)
          }
        />

        {value !== undefined && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute right-2 top-1/2 -translate-y-1/2 
                       text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

type TextInputProps = {
  label: string;
  value?: string;
  placeholder?: string;
  onChange: (value?: string) => void;
};

function TextInput({ label, value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="relative">
      <label className="text-sm text-zinc-400">{label}</label>

      <input
        type="search"
        value={value ?? ''}
        placeholder={placeholder}
        className="w-full mt-2 p-2 pr-8 bg-zinc-800 rounded focus:ring-2 focus:ring-blue-600"
        onChange={(e) =>
          onChange(e.target.value || undefined)
        }
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="absolute right-2 top-[38px] text-zinc-400 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}

type MarketplaceStatus = 'published' | 'not_published';

type MarketplaceStatusSelectorProps = {
  value?: MarketplaceStatus;
  onChange: (value?: MarketplaceStatus) => void;
};

function MarketplaceStatusSelector({
  value,
  onChange,
}: {
  value?: 'published' | 'not_published';
  onChange: (value?: 'published' | 'not_published') => void;
}) {
  const options = [
    { label: 'Publicado', value: 'published' },
    { label: 'No publicado', value: 'not_published' },
  ] as const;

  return (
    <div className="flex flex-col justify-end h-[88px]">
      <label className="text-sm text-zinc-400 mb-2">
        Estado en marketplace
      </label>

      <div className="flex gap-2">
        {options.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() =>
              onChange(value === item.value ? undefined : item.value)
            }
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all
              ${
                value === item.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type VisitsRangeProps = {
  min?: number;
  max?: number;
  onChange: (values: { min?: number; max?: number }) => void;
};

function VisitsRange({ min, max, onChange }: VisitsRangeProps) {
  return (
    <div className="flex flex-col justify-end h-[88px]">
      <label className="text-sm text-zinc-400 mb-2">
        Rango de visitas
      </label>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={min ?? ''}
          className="w-full h-10 px-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:ring-2 focus:ring-blue-600"
          onChange={(e) =>
            onChange({
              min: e.target.value ? Number(e.target.value) : undefined,
              max,
            })
          }
        />

        <input
          type="number"
          placeholder="Max"
          value={max ?? ''}
          className="w-full h-10 px-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:ring-2 focus:ring-blue-600"
          onChange={(e) =>
            onChange({
              min,
              max: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>
    </div>
  );
}

type ActiveFiltersProps = {
  filters: ProductsFilters;
  onRemove: (key: keyof ProductsFilters) => void;
};

function ActiveFilters({ filters, onRemove }: ActiveFiltersProps) {
  const items: { label: string; key: keyof ProductsFilters }[] = [];

  if (filters.brand) items.push({ label: `Marca: ${filters.brand}`, key: 'brand' });

  if (filters.categoryId)
    items.push({ label: `Categoría: ${filters.categoryId}`, key: 'categoryId' });

  if (filters.marketplaceStatus)
    items.push({
      label:
        filters.marketplaceStatus === 'published'
          ? 'Marketplace: Publicado'
          : 'Marketplace: No publicado',
      key: 'marketplaceStatus',
    });

  if (filters.minPrice || filters.maxPrice)
    items.push({
      label: `Precio: ${filters.minPrice ?? 0} - ${filters.maxPrice ?? '∞'}`,
      key: 'minPrice',
    });

  if (filters.minVisits || filters.maxVisits)
    items.push({
      label: `Visitas: ${filters.minVisits ?? 0} - ${filters.maxVisits ?? '∞'}`,
      key: 'minVisits',
    });

  if (filters.status)
    items.push({
      label: `Estado: ${filters.status}`,
      key: 'status',
    });

  if (filters.excludeMarketplace?.length)
    items.push({
      label: `Excluye: ${filters.excludeMarketplace.join(', ')}`,
      key: 'excludeMarketplace',
    });
    if (filters.matchedMarketplace)
  items.push({
    label: `Disponible en: ${filters.matchedMarketplace}`,
    key: 'matchedMarketplace',
  });

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-sm text-zinc-300 border border-zinc-700"
        >
          {item.label}

          <button
            onClick={() => onRemove(item.key)}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function MatchedMarketplaceSelector({
  value,
  onChange,
}: {
  value?: 'megatone' | 'fravega';
  onChange: (value?: 'megatone' | 'fravega') => void;
}) {
  const options = [
    { label: 'Megatone', value: 'megatone' },
    { label: 'Frávega', value: 'fravega' },
  ] as const;

  return (
    <div className="flex flex-col justify-end h-[88px]">
      <label className="text-sm text-zinc-400 mb-2">
               Filtrar para ver Productos aptos para publicar en un marketplace

      </label>

      <div className="flex gap-2">
        {options.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() =>
              onChange(value === item.value ? undefined : item.value)
            }
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all
              ${
                value === item.value
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}