export type ProductImportRunStatus =
  | 'QUEUED'
  | 'STARTED'
  | 'RUNNING'
  | 'SUCCESS'
  | 'FAILED';

export type ProductImportRun = {
  id: string;
  marketplace: string;
  status: ProductImportRunStatus;

  batches_processed: number;
  items_processed: number;
  items_failed: number;

  started_at: string;
  finished_at?: string | null;

  error_message?: string | null;
};
