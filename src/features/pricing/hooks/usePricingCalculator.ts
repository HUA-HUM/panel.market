'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  PricingBulkItemInput,
  PricingBulkResponse,
  PricingSalesChannel,
} from '@/src/core/adapters/repository/apiPricing/shared/pricing.types';
import { GetProfitChannelDetailsBulkRepository } from '@/src/core/driver/repository/apiPricing/profit/GetProfitChannelDetailsBulkRepository';

export type PricingDraftRow = {
  id: string;
  sku: string;
  salePrice: string;
  salesChannel: PricingSalesChannel;
};

const INITIAL_ROWS: PricingDraftRow[] = [
  {
    id: crypto.randomUUID(),
    sku: '',
    salePrice: '',
    salesChannel: 'megatone',
  },
];

export function usePricingCalculator() {
  const [rows, setRows] = useState<PricingDraftRow[]>(INITIAL_ROWS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricingBulkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () =>
      rows.some(
        row => row.sku.trim() && Number(row.salePrice) > 0 && row.salesChannel
      ),
    [rows]
  );

  const addRow = useCallback(() => {
    setRows(current => [
      ...current,
      {
        id: crypto.randomUUID(),
        sku: '',
        salePrice: '',
        salesChannel: 'megatone',
      },
    ]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows(current =>
      current.length === 1
        ? current
        : current.filter(row => row.id !== id)
    );
  }, []);

  const updateRow = useCallback(
    <K extends keyof PricingDraftRow>(
      id: string,
      key: K,
      value: PricingDraftRow[K]
    ) => {
      setRows(current =>
        current.map(row =>
          row.id === id
            ? { ...row, [key]: value }
            : row
        )
      );
    },
    []
  );

  const submit = useCallback(async () => {
    const items: PricingBulkItemInput[] = rows
      .map(row => ({
        sku: row.sku.trim(),
        salePrice: Number(row.salePrice),
        salesChannel: row.salesChannel,
      }))
      .filter(row => row.sku && row.salePrice > 0);

    if (items.length === 0) {
      const message = 'Add at least one SKU with price and sales channel.';
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const repository = new GetProfitChannelDetailsBulkRepository();
      const response = await repository.execute({
        items,
        page: 1,
        perPage: Math.max(items.length, 10),
      });

      setResult(response);
      toast.success('Pricing calculation completed.');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to calculate pricing.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [rows]);

  const summary = useMemo(() => {
    const items = result?.items ?? [];

    return {
      profitable: items.filter(item => item.status.profitable).length,
      shouldPause: items.filter(item => item.status.shouldPause).length,
      averageMargin:
        items.length > 0
          ? Math.round(
              items.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.resultados.operatingProfitPercent.replace('%', '')
                  ),
                0
              ) / items.length
            )
          : 0,
    };
  }, [result]);

  return {
    rows,
    result,
    loading,
    error,
    canSubmit,
    summary,
    addRow,
    removeRow,
    updateRow,
    submit,
  };
}
