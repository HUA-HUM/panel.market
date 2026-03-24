import {
  IGetPendingPublicationJobsRepository,
  PendingPublicationJob
} from '@/src/core/adapters/repository/apiProducts/progress/IGetPendingPublicationJobsRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

export class GetPendingPublicationJobsRepository
  implements IGetPendingPublicationJobsRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: '/api',
      });
  }

  execute(limit = 10): Promise<PendingPublicationJob[]> {
    return this.http.get<PendingPublicationJob[]>(
      `/products/publication-jobs/pending?limit=${limit}`
    );
  }
}
