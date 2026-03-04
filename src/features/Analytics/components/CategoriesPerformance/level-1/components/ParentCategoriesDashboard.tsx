'use client';

import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from 'recharts';

import CategoryDrilldown from '../../CategoryDrilldown';
import { useParentCategoriesPerformance } from '../hooks/useParentCategoriesPerformance';

export default function ParentCategoriesDashboard() {
  const { data, loading } = useParentCategoriesPerformance();

  const [metric, setMetric] = useState<'visits' | 'orders'>('visits');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      index: index + 1,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      totalProducts: item.totalProducts,
      visits: item.visits,
      orders: item.orders,
      revenue: item.revenue,
    }));
  }, [data]);

  return (
    <div className="space-y-10">

      <div className="rounded-2xl p-8 bg-zinc-950 border border-zinc-800 text-white shadow-xl space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Categorías Padre
            </h2>

            <p className="text-xs text-zinc-500 mt-1">
              Performance por categoría raíz
            </p>
          </div>

          <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">

            <ToggleButton
              active={metric === 'visits'}
              onClick={() => setMetric('visits')}
            >
              Visitas
            </ToggleButton>

            <ToggleButton
              active={metric === 'orders'}
              onClick={() => setMetric('orders')}
            >
              Órdenes
            </ToggleButton>

          </div>

        </div>

        {/* CHART */}
        <div className="h-[320px]">

          {loading ? (
            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
              Cargando métricas...
            </div>
          ) : (

            <ResponsiveContainer width="100%" height="100%">

             <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
                style={{ outline: 'none' }}
                tabIndex={-1}
              >

                {/* GRADIENTES */}
                <defs>

                  <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa"/>
                    <stop offset="100%" stopColor="#2563eb"/>
                  </linearGradient>

                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399"/>
                    <stop offset="100%" stopColor="#059669"/>
                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#27272a"
                  vertical={false}
                />

                <XAxis
                  dataKey="index"
                  stroke="#71717a"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  stroke="#71717a"
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.toLocaleString()}
                />

                {/* TOOLTIP */}
                <Tooltip
                  cursor={false}
                  content={({ payload }) => {
                    if (!payload?.length) return null;
                    const d = payload[0].payload;

                    return (
                      <div className="bg-zinc-900/95 backdrop-blur p-4 rounded-xl text-xs border border-zinc-800 shadow-2xl">

                        <div className="font-semibold text-white mb-3 text-sm">
                          {d.categoryName}
                        </div>

                        <div className="space-y-1 text-zinc-300">

                          <div className="flex justify-between">
                            <span>Productos</span>
                            <span>{d.totalProducts.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between">
                            <span>Visitas</span>
                            <span>{d.visits.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between">
                            <span>Órdenes</span>
                            <span>{d.orders.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between text-emerald-400">
                            <span>Revenue</span>
                            <span>${d.revenue.toLocaleString()}</span>
                          </div>

                        </div>

                      </div>
                    );
                  }}
                />

                <Bar
                  dataKey={metric}
                  barSize={24}
                  radius={[6, 6, 0, 0]}
                  animationDuration={500}
                  activeBar={false}
                  onClick={(data: any, index: number) => {
                    setSelectedCategory(data.categoryId);
                    setActiveIndex(index);
                  }}
                >

                  <LabelList
                    dataKey={metric}
                    position="top"
                    content={(props: any) => {
                      const { x, y, width, value, index } = props;

                      if (activeIndex !== index) return null;

                      return (
                        <text
                          x={x + width / 2}
                          y={y - 8}
                          fill="#9ca3af"
                          fontSize={11}
                          textAnchor="middle"
                        >
                          {value.toLocaleString()}
                        </text>
                      );
                    }}
                  />

                  {chartData.map((_, i) => {

                    const isActive = activeIndex === i;

                    return (
                      <Cell
                        key={i}
                        fill={
                          metric === 'visits'
                            ? 'url(#visitsGradient)'
                            : 'url(#ordersGradient)'
                        }
                        opacity={activeIndex === null || isActive ? 1 : 0.2}
                        style={{
                          transform: isActive ? 'scaleY(1.15)' : 'scaleY(1)',
                          transformOrigin: 'bottom',
                          filter: isActive
                            ? 'drop-shadow(0 0 16px rgba(59,130,246,0.9))'
                            : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.35s cubic-bezier(.4,0,.2,1)'
                        }}
                      />
                    );

                  })}

                </Bar>

              </BarChart>

            </ResponsiveContainer>
          )}

        </div>

      </div>

      {/* DRILLDOWN */}
      {selectedCategory && (
        <CategoryDrilldown rootCategoryId={selectedCategory} />
      )}

    </div>
  );
}

function ToggleButton({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-xs rounded-md transition-all duration-200 ${
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
      }`}
    >
      {children}
    </button>
  );
}