import {
  IGetPublicationRunProgressRepository,
  PublicationRunProgress
} from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunProgressRepository';
import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

export class GetPublicationRunProgressRepository
  implements IGetPublicationRunProgressRepository
{
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: '/api',
      });
  }

  execute(runId: string): Promise<PublicationRunProgress> {
    return this.http.get<PublicationRunProgress>(
      `/products/api/publication-jobs/${runId}/progress`
    );
  }
}
