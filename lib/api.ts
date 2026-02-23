import axios from 'axios';
import toast from 'react-hot-toast';

// Next.js proxy üzerinden API'ye bağlanılır
// Auth istekleri: Route Handler (app/api/website/auth/[...path]) → client IP forward eder
// Diğer istekler: next.config.js rewrites → doğrudan proxy
const API_BASE_URL = '/api/website';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const data = response.data;
    // @ts-ignore - custom config flag
    const silent = response.config?._silent === true;

    if (data && data.status === false) {
      if (!silent) {
        toast.error(data.message || 'Bir hata oluştu.');
      }
      return Promise.reject(new ApiError(data.message, response.status, data));
    }

    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // @ts-ignore - custom config flag
    const silent = error.config?._silent === true;

    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        if (!silent) {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          }
          toast.error(data?.message || 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
        }
      } else if (!silent) {
        toast.error(data?.message || 'Bir hata oluştu.');
      }

      return Promise.reject(new ApiError(data?.message || 'Bir hata oluştu.', status, data));
    }

    if (!silent) {
      toast.error('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
    }

    return Promise.reject(error);
  }
);

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export default api;
