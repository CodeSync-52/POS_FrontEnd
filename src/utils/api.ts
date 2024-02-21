import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CanceledError,
} from 'axios';

import { useAuthStore } from 'src/stores';
interface basicParams extends AxiosRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  noAuth?: true;
}
interface paramsWithConfig extends basicParams {
  sendConfig: true;
}

interface paramsWithoutConfig extends basicParams {
  sendConfig?: never;
}

class PosError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    // Set the prototype explicitly to avoid issues with inheritance in ES5
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
function makeApiCall<T>(
  params: paramsWithConfig
): Promise<AxiosResponse<T, any>>;

function makeApiCall<T>(params: paramsWithoutConfig): Promise<T>;

async function makeApiCall<T>({
  url,
  method = 'GET',
  data,
  noAuth,
  sendConfig,
  ...config
}: paramsWithConfig | paramsWithoutConfig) {
  const headers: Record<string, string> = {};
  const authStore = useAuthStore();
  const token = authStore.loggedInUser?.loginTokenResponseDTO.access_Token;

  if (token && !noAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios<T>({
      method,
      data,
      url: `${import.meta.env.VITE_API_URL}/${url}`,
      headers,
      ...config,
    }).then((res) => res);
    if (sendConfig) {
      return response;
    }
    return response.data;
  } catch (e) {
    if (e instanceof AxiosError && e.response?.status === 401) {
      localStorage.removeItem('storeData');
      authStore.logoutUser();
      return;
    }
    if (e instanceof CanceledError) {
      throw e;
    }
    if (axios.isAxiosError(e)) {
      throw new PosError(
        e.response?.data.message || 'Unexpected Error Fetching Data',
        e.response?.status || 500
      );
    }

    throw e;
  }
}

export interface errType {
  message: string;
  code: number | string;
  err?: any;
}

// Type guard for CustomError
function isPosError(error: any): error is PosError {
  return error instanceof PosError;
}

export { makeApiCall, isPosError };
