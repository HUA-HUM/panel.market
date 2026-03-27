import { HttpClient } from '../../../../http/httpClient';

export type ImportProductsStatus =
  | 'QUEUED'
  | 'STARTED'
  | 'SUCCESS'
  | 'FAILED';

export type ImportProductsResponse = {
  status: ImportProductsStatus;
};

export class ImportProductsRepository {
  private readonly http: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.http =
      httpClient ??
      new HttpClient({
        baseUrl: process.env.NEXT_PUBLIC_PRODUCTS_API_URL!,
      });
  }

  async execute(params: {
    marketplace: 'megatone' | 'oncity' | 'fravega';
  }): Promise<ImportProductsResponse> {
    const { marketplace } = params;

    return this.http.post<ImportProductsResponse>(
      `/api/internal/import/${marketplace}/run`,
      undefined
    );
  }
}
