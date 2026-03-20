export type PendingPublicationJob = {
  id: string;
  run_id: string;
  sku: string;
  status: string;
  marketplace: string;
  attempts: number;
  locked_at: string | null;
};

export interface IGetPendingPublicationJobsRepository {
  execute(limit?: number): Promise<PendingPublicationJob[]>;
}
