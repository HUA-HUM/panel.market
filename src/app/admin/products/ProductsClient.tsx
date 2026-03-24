'use client';

import { OrdersOverviewPanel } from '@/src/features/products/components/OrdersOverviewPanel';

export default function ProductsClient() {
  return (
    <div className="min-h-screen w-full px-6 py-10">
      <div className="mx-auto max-w-[1600px]">
        <OrdersOverviewPanel />
      </div>
    </div>
  );
}
