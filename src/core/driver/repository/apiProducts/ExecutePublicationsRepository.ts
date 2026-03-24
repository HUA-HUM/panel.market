import { IExecutePublicationsRepository } from '@/src/core/adapters/repository/apiProducts/execute/IExecutePublicationsRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

export class ExecutePublicationsRepository
  implements IExecutePublicationsRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: '/api',
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
      `/products/publications/execute/run`,
      data
    );
  }
}
