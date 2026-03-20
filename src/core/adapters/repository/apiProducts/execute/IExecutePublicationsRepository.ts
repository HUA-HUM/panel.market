export interface IExecutePublicationsRepository {
  execute(data: {
    marketplaces: string[];
    folderId: number;
  }): Promise<{
    message: string;
    runId: string;
    totalSkus: number;
    totalJobs: number;
  }>;
}