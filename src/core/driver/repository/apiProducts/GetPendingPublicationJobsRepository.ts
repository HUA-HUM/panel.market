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
    const baseUrl = process.env.NEXT_PUBLIC_MADRE_API_URL?.replace(/\/$/, '');

    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: baseUrl ?? '',
      });
  }

  execute(limit = 10): Promise<PendingPublicationJob[]> {
    return this.http.get<PendingPublicationJob[]>(
      `/api/publication-jobs/pending?limit=${limit}`
    );
  }
}
