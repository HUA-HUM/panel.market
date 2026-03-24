import { HttpClient } from '@/src/core/driver/repository/http/httpClient';

function getOrdersApiBaseUrl(): string {
  return '/api';
}

export function createOrdersApiClient(httpClient?: HttpClient): HttpClient {
  return (
    httpClient ??
    new HttpClient({
      baseUrl: getOrdersApiBaseUrl(),
    })
  );
}

export function buildOrdersRangeQuery(from: string, to: string): string {
  const params = new URLSearchParams({
    from,
    to,
    fechaDesde: from,
    fechaHasta: to,
  });

  return params.toString();
}
