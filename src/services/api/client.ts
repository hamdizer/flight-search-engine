import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { API_CONFIG } from "../../utils/contants";

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  client.interceptors.request.use(
    (config) => {
      if (config.params) {
        config.params._t = Date.now();
      } else {
        config.params = { _t: Date.now() };
      }

      if (import.meta.env.DEV) {
        console.log("🚀 API Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      console.error("❌ Request interceptor error:", error);
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      if (import.meta.env.DEV) {
        console.log("✅ API Response:", {
          url: response.config.url,
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        console.error("❌ Response error:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config?.url,
        });

        switch (error.response.status) {
          case 401:
            console.error("Unauthorized - please check API credentials");
            break;
          case 403:
            console.error("Forbidden - insufficient permissions");
            break;
          case 404:
            console.error("Not found - endpoint does not exist");
            break;
          case 429:
            console.error("Rate limit exceeded - please try again later");
            break;
          case 500:
            console.error("Internal server error");
            break;
        }
      } else if (error.request) {
        console.error("❌ No response received:", error.request);
        console.error("Network error - please check your internet connection");
      } else {
        console.error("❌ Request setup error:", error.message);
      }

      return Promise.reject(error);
    },
  );

  return client;
};

export const apiClient = createApiClient();

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        error.message ||
        "An error occurred while making the request";

      throw new Error(message);
    }
    throw error;
  }
}

export async function apiRequestWithRetry<T>(
  config: AxiosRequestConfig,
  retries: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      return await apiRequest<T>(config);
    } catch (error) {
      lastError = error as Error;

      if (i < retries - 1) {
        console.log(`⚠️ Request failed, retrying (${i + 1}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError || new Error("Request failed after retries");
}

export default apiClient;
