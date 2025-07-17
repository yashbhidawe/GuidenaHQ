// tokenManager.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

class TokenManager {
  private token: string | null;
  private requestInterceptor: number | null;
  private responseInterceptor: number | null;

  constructor() {
    this.token = localStorage.getItem("token");
    this.requestInterceptor = null;
    this.responseInterceptor = null;
    this.setupAxiosInterceptors();
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", token);
    // Force axios to use the new token immediately
    this.setupAxiosInterceptors();
  }

  getToken(): string | null {
    return this.token || localStorage.getItem("token");
  }

  removeToken(): void {
    this.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
  }

  private setupAxiosInterceptors(): void {
    if (this.requestInterceptor !== null) {
      axios.interceptors.request.eject(this.requestInterceptor);
    }
    if (this.responseInterceptor !== null) {
      axios.interceptors.response.eject(this.responseInterceptor);
    }

    this.requestInterceptor = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.responseInterceptor = axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.removeToken();
        }
        return Promise.reject(error);
      }
    );
  }
}

export const tokenManager = new TokenManager();
