export type PublicationRunProgress = {
  run_id: string;
  total: string;
  pending: string;
  processing: string;
  success: string;
  failed: string;
  skipped?: string;
  cancelled?: string;
};

export interface IGetPublicationRunProgressRepository {
  execute(runId: string): Promise<PublicationRunProgress>;
}
