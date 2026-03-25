import {
  IGetPublicationRunJobsRepository,
  PublicationRunJob,
} from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunJobsRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

export class GetPublicationRunJobsRepository
  implements IGetPublicationRunJobsRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: '/api',
      });
  }

  execute(params: {
    runId: string;
    limit?: number;
    offset?: number;
  }): Promise<PublicationRunJob[]> {
    const { runId, limit = 50, offset = 0 } = params;

    return this.http.get<PublicationRunJob[]>(
      `/madre/publication-jobs/${runId}/jobs?limit=${limit}&offset=${offset}`
    );
  }
}
