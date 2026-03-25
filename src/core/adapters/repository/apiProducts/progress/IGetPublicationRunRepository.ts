export type PublicationRun = {
  id: string;
  status: string;
  marketplaces: string[];
  total_jobs: number;
  success_jobs: number;
  failed_jobs: number;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  metadata: unknown;
  pending_jobs?: number;
  processing_jobs?: number;
  actual_success_jobs?: string | number;
  actual_failed_jobs?: string | number;
  skipped_jobs?: number;
  cancelled_jobs?: number;
  retry_jobs?: number;
};

export interface IGetPublicationRunRepository {
  execute(runId: string): Promise<PublicationRun>;
}
