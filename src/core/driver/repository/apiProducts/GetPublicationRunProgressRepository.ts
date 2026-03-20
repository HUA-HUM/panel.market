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
    const baseUrl = process.env.NEXT_PUBLIC_MADRE_API_URL?.replace(/\/$/, '');

    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: baseUrl ?? '',
      });
  }

  execute(runId: string): Promise<PublicationRunProgress> {
    return this.http.get<PublicationRunProgress>(
      `/api/publication-jobs/${runId}/progress`
    );
  }
}
