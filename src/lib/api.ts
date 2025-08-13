// src/lib/api.ts

const API_BASE_URL = 'http://localhost:3001/api';

export interface CacheResponse {
  message: string;
  error?: string;
}

export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      console.log(`Making request to: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`Response data:`, data);
      return data;
    } catch (error) {
      console.error('API Service Error:', error);
      throw error;
    }
  }

  static async fetchAndCache(type: 'prompts' | 'llm_links'): Promise<CacheResponse> {
    try {
      return await this.request<CacheResponse>(`/fetch-and-cache?type=${type}`);
    } catch (error) {
      console.error('fetchAndCache error:', error);
      throw error;
    }
  }
} 