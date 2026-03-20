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
    const baseUrl = process.env.NEXT_PUBLIC_MADRE_API_URL?.replace(/\/$/, '');

    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: baseUrl ?? '',
      });
  }

  execute(runId: string): Promise<PublicationRun> {
    return this.http.get<PublicationRun>(`/api/publication-runs/${runId}`);
  }
}
