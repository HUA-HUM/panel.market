import { IExecutePublicationsRepository } from '@/src/core/adapters/repository/apiProducts/execute/IExecutePublicationsRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

export class ExecutePublicationsRepository
  implements IExecutePublicationsRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    const baseUrl = process.env.NEXT_PUBLIC_PRODUCTS_API_URL?.replace(/\/$/, '');

    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: baseUrl ?? '',
      });
  }

  async execute(data: {
    marketplaces: string[];
    folderId: number;
  }): Promise<{
    message: string;
    runId: string;
    totalSkus: number;
    totalJobs: number;
  }> {
    return this.http.post(
      `/api/publications/execute/run`,
      data
    );
  }
}
