// src/client/composables/useAutocomplete.ts
import { ref, Ref } from 'vue';
import axios from 'axios';
import { Word, Language } from '../types';

export function useAutocomplete() {
    const suggestions: Ref<Word[]> = ref([]);
    const loading: Ref<boolean> = ref(false);
    const error: Ref<string | null> = ref(null);

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const fetchSuggestions = async (term: string, language: Language, limit: number = 10) => {
        // Clear previous timer
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // If term is empty, clear suggestions
        if (!term.trim()) {
            suggestions.value = [];
            return;
        }

        // Debounce the API call
        return new Promise<void>((resolve) => {
            debounceTimer = setTimeout(async () => {
                loading.value = true;
                error.value = null;
                
                try {
                    const response = await axios.get('/api/dictionary/autocomplete', {
                        params: { term, language, limit }
                    });
                    
                    if (response.data.success) {
                        suggestions.value = response.data.data;
                    } else {
                        suggestions.value = [];
                    }
                } catch (err) {
                    error.value = 'Failed to fetch suggestions';
                    suggestions.value = [];
                    console.error(err);
                } finally {
                    loading.value = false;
                    resolve();
                }
            }, 300); // 300ms debounce
        });
    };

    const clearSuggestions = () => {
        suggestions.value = [];
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
    };

    return {
        suggestions,
        loading,
        error,
        fetchSuggestions,
        clearSuggestions
    };
}
