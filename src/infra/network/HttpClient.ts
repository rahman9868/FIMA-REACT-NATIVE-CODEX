export type RequestOptions = {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: string;
  accessToken?: string;
};

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  async request<T>(path: string, options: RequestOptions): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers ?? {}),
    };

    if (options.accessToken) {
      headers.Authorization = `Bearer ${options.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Request failed');
    }

    return (await response.json()) as T;
  }
}
