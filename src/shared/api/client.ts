export interface ApiOptions extends RequestInit {
  params?: Record<string, string | number>;
  baseUrl?: string;
}

export const DEFAULT_API_BASE_URL = 'https://shopboard-api.vercel.app';

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const sim = params.get('sim') || params.get('apiSim');
    if (sim) {
      // Supports ?sim=delay/3000, ?sim=fail/500, ?sim=empty
      return `${DEFAULT_API_BASE_URL}/${sim.replace(/^\//, '')}`;
    }
    const customBase = params.get('apiBase');
    if (customBase) return customBase;
  }
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof envUrl === 'string' && envUrl.length > 0) {
    return envUrl;
  }
  return DEFAULT_API_BASE_URL;
}

export const API_BASE_URL = DEFAULT_API_BASE_URL;

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data: T = await response.json();
  return data;
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const isAbsolute = endpoint.startsWith('http://') || endpoint.startsWith('https://');
  const base = options.baseUrl ?? (isAbsolute ? '' : getBaseUrl());
  let url = base ? `${base.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}` : endpoint;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      searchParams.append(key, String(val));
    });
    url += (url.includes('?') ? '&' : '?') + searchParams.toString();
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `كود استجابة الخادم: ${response.status} (${response.statusText || 'Error'})`;
    try {
      const errData = (await response.json()) as { error?: string; message?: string };
      if (errData && (errData.error || errData.message)) {
        errorMessage = errData.error || errData.message || errorMessage;
      }
    } catch {
      // Keep status text if body is not JSON
    }
    throw new Error(errorMessage);
  }

  return parseJsonResponse<T>(response);
}
