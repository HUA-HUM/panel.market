import { HttpError } from "./error/errors";
import { fetchWithAuth } from '@/src/features/auth/lib/authSession';


type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type HttpClientConfig = {
  baseUrl: string;
  headers?: Record<string, string>;
};

export class HttpClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(config: HttpClientConfig) {
    if (!config.baseUrl) {
      throw new Error('HTTP Client: baseUrl no definida');
    }

    this.baseUrl = config.baseUrl;
    this.headers = config.headers ?? {};
  }

private async request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown
): Promise<T> {

  const url = `${this.baseUrl}${path}`;
  const headers: Record<string, string> = {
    ...this.headers,
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetchWithAuth(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });


  if (!res.ok) {

    const text = await res.text();

  

    throw new HttpError(res.status, text);
  }

  return res.json().catch(() => null as T);
}

  get<T>(path: string) {
    
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>('PUT', path, body);
  }

 delete<T>(path: string, body?: unknown) {
  return this.request<T>('DELETE', path, body);
}

 patch<T>(path: string, body?: unknown) {
  return this.request<T>('PATCH', path, body);
}
}
