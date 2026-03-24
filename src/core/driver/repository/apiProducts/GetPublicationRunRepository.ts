import {
  IGetPublicationRunRepository,
  PublicationRun
} from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

export class GetPublicationRunRepository
  implements IGetPublicationRunRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: '/api',
      });
  }

  execute(runId: string): Promise<PublicationRun> {
    return this.http.get<PublicationRun>(`/products/api/publication-runs/${runId}`);
  }
}
