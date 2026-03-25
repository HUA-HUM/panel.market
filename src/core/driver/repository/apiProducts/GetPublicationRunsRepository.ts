import { IGetPublicationRunsRepository } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunsRepository';
import { PublicationRun } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

export class GetPublicationRunsRepository
  implements IGetPublicationRunsRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: '/api',
      });
  }

  execute(): Promise<PublicationRun[]> {
    return this.http.get<PublicationRun[]>(`/madre/publication-runs`);
  }
}
