export type PublicationRunProgress = {
  run_id: string;
  total: string;
  pending: string;
  processing: string;
  success: string;
  failed: string;
};

export interface IGetPublicationRunProgressRepository {
  execute(runId: string): Promise<PublicationRunProgress>;
}
