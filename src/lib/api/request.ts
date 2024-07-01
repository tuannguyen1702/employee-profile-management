import { environments } from "@/config";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  headers?: HeadersInit;
  queryParams?: Record<string, string>;
  body?: Record<string, any>;
}

const buildQueryString = (params: Record<string, string>): string => {
  const query = new URLSearchParams(params);
  return query.toString() ? `?${query.toString()}` : '';
};

const request = async (
  url: string,
  method: RequestMethod,
  options: RequestOptions = {}
): Promise<any> => {
  const { headers, queryParams, body } = options;

  const queryString = queryParams ? buildQueryString(queryParams) : '';
  const fullUrl = `${environments.apiURL}${url}${queryString}`;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(fullUrl, config);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};

export const get = (url: string, options?: RequestOptions) =>
  request(url, 'GET', options);

export const post = (url: string, body: Record<string, any>, options?: RequestOptions) =>
  request(url, 'POST', { ...options, body });

export const put = (url: string, body: Record<string, any>, options?: RequestOptions) =>
  request(url, 'PUT', { ...options, body });

export const del = (url: string, options?: RequestOptions) =>
  request(url, 'DELETE', options);
