export type PendingPublicationJob = {
  id: string;
  run_id: string;
  sku: string;
  status: string;
  marketplace: string;
  attempts: number;
  result?: string | null;
  error_message?: string | null;
  request_payload?: Record<string, unknown> | null;
  response_payload?: Record<string, unknown> | null;
  marketplace_item_id?: string | null;
  locked_at: string | null;
  created_at?: string;
  updated_at?: string;
};

export interface IGetPendingPublicationJobsRepository {
  execute(limit?: number): Promise<PendingPublicationJob[]>;
}
