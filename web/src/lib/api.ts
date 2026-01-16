import { supabase } from './supabase';

const API_BASE_URL = '/api/v1';

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No active session');
  return { Authorization: `Bearer ${session.access_token}` };
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...await getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  async searchPeople(params: any) {
    return apiRequest('/apollo/search-people', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async searchCompanies(params: any) {
    return apiRequest('/apollo/search-companies', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async enrichPerson(params: any) {
    return apiRequest('/apollo/enrich-person', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async enrichCompany(params: any) {
    return apiRequest('/apollo/enrich-company', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async bulkEnrichPeople(params: any) {
    return apiRequest('/apollo/bulk-enrich-people', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async bulkEnrichOrganizations(params: any) {
    return apiRequest('/apollo/bulk-enrich-organizations', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getOrganizationJobs(orgId: string) {
    return apiRequest(`/apollo/organization/${orgId}/jobs`);
  },

  async getOrganizationInfo(orgId: string) {
    return apiRequest(`/apollo/organization/${orgId}`);
  },

  async searchNews(params: any) {
    return apiRequest('/apollo/search-news', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getApiKeyStatus() {
    return apiRequest('/api-keys/status');
  },

  async saveApiKey(apiKey: string) {
    return apiRequest('/api-keys', {
      method: 'POST',
      body: JSON.stringify({ apiKey }),
    });
  },

  async getSearchHistory(page = 1, limit = 20) {
    return apiRequest(`/history?page=${page}&limit=${limit}`);
  },

  async deleteHistoryItem(id: string) {
    return apiRequest(`/history/${id}`, { method: 'DELETE' });
  },

  async getSavedResults(type?: 'person' | 'company') {
    const query = type ? `?type=${type}` : '';
    return apiRequest(`/saved${query}`);
  },

  async saveResult(resultType: 'person' | 'company', resultData: any, tags?: string[], notes?: string) {
    return apiRequest('/saved', {
      method: 'POST',
      body: JSON.stringify({ resultType, resultData, tags, notes }),
    });
  },

  async deleteSavedResult(id: string) {
    return apiRequest(`/saved/${id}`, { method: 'DELETE' });
  },

  async updateSavedResult(id: string, tags: string[], notes: string) {
    return apiRequest(`/saved/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ tags, notes }),
    });
  },
};
