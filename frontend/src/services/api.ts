import { useAuthStore } from "@/store/authStore";

// ---------------------------------------------------------------------------
// API Base URL Resolution
// ---------------------------------------------------------------------------
// - LOCAL DEV: If VITE_API_URL is not set, use "/api" which gets proxied by
//   Vite dev server to http://localhost:8000/api (see vite.config.ts).
//   This avoids CORS entirely since both frontend and API share the same origin.
//
// - PRODUCTION: Set VITE_API_URL to the full backend URL including /api/v1
//   e.g. "https://your-backend.onrender.com/api/v1"
// ---------------------------------------------------------------------------
const rawApiUrl = import.meta.env.VITE_API_URL || "";

let API_BASE_URL: string;
if (rawApiUrl) {
  // Production: use the explicitly configured URL
  // Ensure it ends with /api if it doesn't already
  API_BASE_URL = rawApiUrl.replace(/\/$/, "");
  if (API_BASE_URL.startsWith("http") && !API_BASE_URL.endsWith("/api") && !API_BASE_URL.includes("/api/")) {
    API_BASE_URL = `${API_BASE_URL}/api`;
  }
} else {
  // Local dev: relative path gets handled by Vite proxy
  API_BASE_URL = "/api";
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Custom fetch client that injects active Supabase session tokens
 * and resolves common API response envelopes.
 */
class ApiClient {
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...restOptions } = options;

    // 1. Construct URL with Search Query Parameters
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        searchParams.append(key, String(val));
      });
      url += `?${searchParams.toString()}`;
    }

    // 2. Fetch JWT from Auth Store
    const token = useAuthStore.getState().session?.access_token;

    // 3. Assemble Request Headers
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    };

    // 4. Trigger fetch call
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    // 5. Parse and handle HTTP status errors
    if (!response.ok) {
      let errorMessage = "An error occurred during API execution.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
        // Fallback for non-JSON responses
      }
      throw new Error(errorMessage);
    }

    // Return empty payload if no content returned
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  public get<T>(endpoint: string, options?: Omit<RequestOptions, "body" | "method">): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "body" | "method">): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  public put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, "body" | "method">): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string, options?: Omit<RequestOptions, "body" | "method">): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const api = new ApiClient();
export default api;
