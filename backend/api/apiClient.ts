/**
 * Basis API Client für xrisk Frontend
 */

export class ApiClient {
  protected baseUrl: string;

  constructor(baseUrl: string = '') {
    // Wenn keine baseUrl angegeben, verwende relative URLs
    this.baseUrl = baseUrl || '';
  }

  /**
   * Führt einen Fetch-Request aus mit automatischem Error-Handling
   */
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      credentials: 'include', // Wichtig für Session-Cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config: RequestInit = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 204 || response.status === 302) {
        return {} as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new ApiError(
            data.error || data.message || 'Ein Fehler ist aufgetreten',
            response.status
          );
        }
        
        return data;
      }

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      return {} as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Netzwerkfehler',
        0
      );
    }
  }

  /**
   * GET Request
   */
  protected async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
  }

  /**
   * POST Request mit JSON
   */
  protected async post<T>(
    endpoint: string,
    data: Record<string, any>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT Request mit JSON
   */
  protected async put<T>(
    endpoint: string,
    data: Record<string, any>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE Request
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

/**
 * Custom Error-Klasse für API-Fehler
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 0
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

