// src/client/composables/admin/useAdminApi.ts
import { ref } from 'vue';
import { useAdminAuth } from './useAdminAuth';

const API_BASE_URL = 'http://localhost:3000/api/admin';

interface Stats {
  totalWords: number;
  totalAlphabets: number;
  pendingWords: number;
  approvedWords: number;
  activeUsers: number;
  dailySearches: number;
  weeklyGrowth: number;
  categories: Array<{ name: string; count: number }>;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  alphabet?: string;
  status?: string;
}

export function useAdminApi() {
  const { getToken } = useAdminAuth();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Helper to make authenticated requests
  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  };

  // Get dashboard statistics
  const getStats = async (): Promise<Stats | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await makeRequest('/stats');
      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch stats';
      console.error('Get stats error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Get words with pagination
  const getWords = async (params: PaginationParams = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.alphabet) queryParams.append('alphabet', params.alphabet);
      if (params.status) queryParams.append('status', params.status);

      const data = await makeRequest(`/words?${queryParams.toString()}`);
      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch words';
      console.error('Get words error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Get single word by ID
  const getWord = async (id: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await makeRequest(`/word/${id}`);
      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch word';
      console.error('Get word error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Update word
  const updateWord = async (id: string, wordData: any) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await makeRequest(`/word/${id}`, {
        method: 'PUT',
        body: JSON.stringify(wordData),
      });
      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update word';
      console.error('Update word error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete word
  const deleteWord = async (id: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await makeRequest(`/word/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete word';
      console.error('Delete word error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Add new word
  const addWord = async (wordData: any) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await makeRequest('/word', {
        method: 'POST',
        body: JSON.stringify(wordData),
      });
      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add word';
      console.error('Add word error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Get pending words
  const getPendingWords = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await makeRequest('/pending-words');
      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch pending words';
      console.error('Get pending words error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // Approve pending word
  const approveWord = async (id: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await makeRequest(`/approve-word/${id}`, {
        method: 'POST',
      });
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to approve word';
      console.error('Approve word error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Reject pending word
  const rejectWord = async (id: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await makeRequest(`/pending-word/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to reject word';
      console.error('Reject word error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Get alphabets with counts
  const getAlphabets = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await makeRequest('/alphabets');
      return data.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch alphabets';
      console.error('Get alphabets error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    getStats,
    getWords,
    getWord,
    updateWord,
    deleteWord,
    addWord,
    getPendingWords,
    approveWord,
    rejectWord,
    getAlphabets,
  };
}
