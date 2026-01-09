// Location: frontend/src/composables/useDictionary.ts
import { ref, Ref } from 'vue';
import axios from 'axios';
import { Word, Language } from '../types';

export function useDictionary() {
    const words: Ref<Word[]> = ref([]);
    const loading: Ref<boolean> = ref(false);
    const error: Ref<string | null> = ref(null);

    const fetchAllWords = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get('/api/dictionary/words');
            words.value = response.data;
        } catch (err) {
            error.value = 'Failed to fetch words';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const searchWords = async (term: string, language: Language) => {
        if (!term.trim()) {
            await fetchAllWords();
            return;
        }

        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get('/api/dictionary/search', {
                params: { term, language }
            });
            words.value = response.data;
        } catch (err) {
            error.value = 'Search failed';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    return {
        words,
        loading,
        error,
        fetchAllWords,
        searchWords
    };
}