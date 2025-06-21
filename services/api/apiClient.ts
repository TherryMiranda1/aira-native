import { API_CONFIG } from "./config";
import { getClerkSessionToken } from "./utils";

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body } = config;

    try {
      const sessionToken = await getClerkSessionToken();

      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
      };

      if (sessionToken) {
        requestHeaders.Authorization = `Bearer ${sessionToken}`;
      }

      const requestConfig: RequestInit = {
        method,
        headers: requestHeaders,
        ...(body && { body: JSON.stringify(body) }),
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, requestConfig);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      console.error(
        `API request failed for ${method} ${this.baseURL}${endpoint}:`,
        error
      );
      throw error;
    }
  }

  async get<T = any>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "GET", headers });
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "POST", body, headers });
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "PUT", body, headers });
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "PATCH", body, headers });
  }

  async delete<T = any>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "DELETE", headers });
  }
}

export const apiClient = new ApiClient();
