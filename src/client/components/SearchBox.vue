<!-- src/client/components/SearchBox.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Language } from '../types';
import { useVoiceSearch } from '../composables/useVoiceSearch';
import { useAutocomplete } from '../composables/useAutocomplete';

// STATE
const router = useRouter();
const searchTerm = ref('');
const selectedLanguage = ref<Language>('bpy');
const isAvroEnabled = ref(true);
const typedText = ref('');
const currentHintIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);
const hasError = ref(false);
const showSuggestions = ref(false);
const selectedSuggestionIndex = ref(-1);

// VOICE SEARCH
const { isListening, transcript, isSupported, initVoiceRecognition, startListening, stopListening, setLanguage } = useVoiceSearch();

// AUTOCOMPLETE
const { suggestions, loading: suggestionsLoading, fetchSuggestions, clearSuggestions } = useAutocomplete();

// CONSTANTS
const hintWords: Record<Language, string[]> = {
    bpy: ['বিষ্ণুপ্রিয়া মণিপুরী', 'ইতিহাস', 'সংস্কৃতি', 'ভাষা', 'লেখক'],
    bn: ['বাংলা সাহিত্য', 'রবীন্দ্রনাথ ঠাকুর', 'বাংলাদেশ', 'ইতিহাস', 'সংস্কৃতি'],
    en: ['History', 'Culture', 'Literature', 'Language', 'Writers']
};

let typingInterval: any = null;
let erasingTimeout: any = null;

// COMPUTED
const noSuggestionsFound = computed(() => {
    return searchTerm.value.trim().length > 0 && suggestions.value.length === 0 && !suggestionsLoading.value;
});

// VOICE RECOGNITION HANDLER
const handleVoiceSearch = () => {
    if (!isSupported.value) return;
    
    if (isListening.value) {
        stopListening();
    } else {
        // Set language before starting
        const langCode = selectedLanguage.value === 'en' ? 'en-US' : 'bn-BD';
        setLanguage(langCode);
        startListening();
    }
};

// BANGLA INPUT
const toggleBanglaInput = (enable: boolean) => {
    if (inputRef.value && (window as any).$?.fn?.bangla) {
        ((window as any).$(inputRef.value)).bangla('enable', enable);
    }
};

const initBanglaInput = () => {
    if (!inputRef.value || !(window as any).$?.fn?.bangla) return;

    const $input = (window as any).$(inputRef.value);
    $input.bangla({ enable: isAvroEnabled.value, maxSuggestions: 10, disableSuggestion: false });
    $input.on('input', function (this: HTMLInputElement) {
        const newValue = (window as any).$(this).val() as string;
        searchTerm.value = newValue;
        // Immediately stop animation when Avro updates the input
        if (newValue.length > 0) {
            typedText.value = '';
            clearInterval(typingInterval);
            clearTimeout(erasingTimeout);
        }
    });
};

const toggleAvro = () => {
    isAvroEnabled.value = !isAvroEnabled.value;
    toggleBanglaInput(isAvroEnabled.value);
};

// TYPING ANIMATION
const startTypingAnimation = () => {
    clearInterval(typingInterval);
    clearTimeout(erasingTimeout);
    if (searchTerm.value.length > 0) return;

    let charIndex = 0;
    let isTyping = true;

    const typeChar = () => {
        if (searchTerm.value.length > 0) {
            clearInterval(typingInterval);
            clearTimeout(erasingTimeout);
            typedText.value = '';
            return;
        }

        const currentWord = hintWords[selectedLanguage.value][currentHintIndex.value];

        if (isTyping) {
            if (charIndex < currentWord.length) {
                typedText.value += currentWord[charIndex++];
            } else {
                isTyping = false;
                clearInterval(typingInterval);
                erasingTimeout = setTimeout(() => {
                    clearInterval(typingInterval);
                    typingInterval = setInterval(typeChar, 50);
                }, 1000);
            }
        } else {
            if (typedText.value.length > 0) {
                typedText.value = typedText.value.slice(0, -1);
            } else {
                isTyping = true;
                charIndex = 0;
                currentHintIndex.value = (currentHintIndex.value + 1) % hintWords[selectedLanguage.value].length;
                clearInterval(typingInterval);
                setTimeout(() => {
                    clearInterval(typingInterval);
                    typingInterval = setInterval(typeChar, 100);
                }, 200);
            }
        }
    };

    typingInterval = setInterval(typeChar, 100);
};

// AUTOCOMPLETE FUNCTIONS
const handleInputChange = () => {
    selectedSuggestionIndex.value = -1;
    if (searchTerm.value.trim()) {
        showSuggestions.value = true;
        fetchSuggestions(searchTerm.value, selectedLanguage.value, 10);
    } else {
        showSuggestions.value = false;
        clearSuggestions();
    }
};

const selectSuggestion = (suggestion: any) => {
    const wordText = suggestion.word?.[selectedLanguage.value] || suggestion.word?.bpy || '';
    searchTerm.value = wordText;
    showSuggestions.value = false;
    clearSuggestions();
    
    // Navigate to word detail page
    router.push({
        name: 'WordDetail',
        params: { identifier: suggestion.id }
    });
};

const handleAddWord = () => {
    router.push({
        name: 'AddWord',
        query: { term: searchTerm.value, lang: selectedLanguage.value }
    });
};

// SEARCH
const handleSearch = () => {
    if (!searchTerm.value.trim()) {
        hasError.value = true;
        setTimeout(() => hasError.value = false, 2000);
        return;
    }
    hasError.value = false;
    showSuggestions.value = false;
    clearSuggestions();
    router.push({ name: 'SearchResults', query: { q: searchTerm.value, lang: selectedLanguage.value } });
};

const handleKeyDown = (event: KeyboardEvent) => {
    const hasSuggestions = document.querySelector('.avro-suggest ul li');
    if (hasSuggestions && (event.key === 'Tab' || event.key === ' ')) {
        event.preventDefault();
        return;
    }
    
    // Handle arrow keys for suggestion navigation
    if (showSuggestions.value && suggestions.value.length > 0) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            selectedSuggestionIndex.value = Math.min(
                selectedSuggestionIndex.value + 1,
                suggestions.value.length - 1
            );
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (selectedSuggestionIndex.value >= 0) {
                selectSuggestion(suggestions.value[selectedSuggestionIndex.value]);
            } else {
                handleSearch();
            }
        } else if (event.key === 'Escape') {
            showSuggestions.value = false;
            clearSuggestions();
        }
    } else if (event.key === 'Enter') {
        handleSearch();
    }
};

// Click outside to close suggestions
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
        showSuggestions.value = false;
    }
};

// WATCHERS
watch(selectedLanguage, () => {
    currentHintIndex.value = 0;
    typedText.value = '';
    clearInterval(typingInterval);
    clearTimeout(erasingTimeout);
    startTypingAnimation();
    clearSuggestions();
    showSuggestions.value = false;

    const enableAvro = selectedLanguage.value !== 'en';
    isAvroEnabled.value = enableAvro;
    toggleBanglaInput(enableAvro);
    
    // Update voice recognition language when language changes
    const langCode = selectedLanguage.value === 'en' ? 'en-US' : 'bn-BD';
    setLanguage(langCode);
});

watch(searchTerm, (newVal) => {
    if (newVal.length > 0) {
        hasError.value = false;
        typedText.value = '';
        clearInterval(typingInterval);
        clearTimeout(erasingTimeout);
    } else {
        startTypingAnimation();
        showSuggestions.value = false;
        clearSuggestions();
    }
});

// Watch for voice transcript and append to search box
watch(transcript, (newTranscript) => {
    if (newTranscript) {
        // Append new transcript to existing text with a space
        if (searchTerm.value.trim()) {
            searchTerm.value = searchTerm.value.trim() + ' ' + newTranscript;
        } else {
            searchTerm.value = newTranscript;
        }
        // Don't auto-search, just populate the input
    }
});

// LIFECYCLE
onMounted(() => {
    initVoiceRecognition();
    startTypingAnimation();
    document.addEventListener('click', handleClickOutside);

    const checkAndInit = () => {
        if ((window as any).$?.fn?.bangla) {
            initBanglaInput();
        } else {
            setTimeout(checkAndInit, 200);
        }
    };
    setTimeout(checkAndInit, 100);
});

onUnmounted(() => {
    clearInterval(typingInterval);
    clearTimeout(erasingTimeout);
    document.removeEventListener('click', handleClickOutside);
    if (inputRef.value && (window as any).$) {
        ((window as any).$(inputRef.value)).off('input');
    }
});
</script>

<template>
    <div class="w-full max-w-3xl mx-auto">
        <div class="mb-4 flex gap-2 justify-center flex-wrap">
            <button v-for="lang in [
                { value: 'bpy', label: 'বিষ্ণুপ্রিয়া', icon: 'fa-language' },
                { value: 'bn', label: 'বাংলা', icon: 'fa-book' },
                { value: 'en', label: 'English', icon: 'fa-globe' }
            ]" :key="lang.value" @click="selectedLanguage = lang.value as Language" :class="[
                'px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center gap-2',
                selectedLanguage === lang.value
                    ? 'bg-blue-600 text-white dark:bg-blue-500 shadow-lg'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ]">
                <i :class="`fas ${lang.icon}`"></i>
                {{ lang.label }}
            </button>
        </div>

        <div class="relative search-container">
            <input ref="inputRef" v-model="searchTerm" type="text" autofocus
                :placeholder="searchTerm.length === 0 ? typedText : ''" 
                @input="handleInputChange"
                @keydown="handleKeyDown" 
                @focus="searchTerm.trim() && (showSuggestions = true)"
                :class="[
                    'w-full px-6 py-4 pr-32 text-lg rounded-2xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500',
                    hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400'
                ]" />

            <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <button v-if="selectedLanguage !== 'en'" @click="toggleAvro" :class="[
                    'p-2 rounded-lg transition-all',
                    isAvroEnabled ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                ]" :title="isAvroEnabled ? 'Avro Phonetic: ON' : 'Avro Phonetic: OFF'">
                    <i class="fas fa-keyboard text-sm"></i>
                </button>

                <button v-if="isSupported" @click="handleVoiceSearch" :class="[
                    'p-2 rounded-lg transition-all',
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                ]" :title="isListening ? 'Stop listening' : 'Voice search'">
                    <i class="fas fa-microphone"></i>
                </button>

                <button @click="handleSearch"
                    class="p-2 rounded-lg bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    title="Search">
                    <i class="fas fa-search"></i>
                </button>
            </div>

            <!-- Suggestions Dropdown -->
            <div v-if="showSuggestions && (suggestions.length > 0 || noSuggestionsFound)" 
                class="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-xl max-h-96 overflow-y-auto">
                
                <!-- Loading State -->
                <div v-if="suggestionsLoading" class="p-4 text-center text-gray-500 dark:text-gray-400">
                    <i class="fas fa-spinner fa-spin mr-2"></i>Loading suggestions...
                </div>

                <!-- Suggestions List -->
                <ul v-else-if="suggestions.length > 0" class="py-2">
                    <li v-for="(suggestion, index) in suggestions" 
                        :key="suggestion.id"
                        @click="selectSuggestion(suggestion)"
                        @mouseenter="selectedSuggestionIndex = index"
                        :class="[
                            'px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0',
                            selectedSuggestionIndex === index 
                                ? 'bg-blue-50 dark:bg-blue-900/30' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        ]">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-book text-blue-500 dark:text-blue-400 mt-1"></i>
                            <div class="flex-1 min-w-0">
                                <div class="font-semibold text-gray-900 dark:text-white truncate">
                                    {{ suggestion.word?.[selectedLanguage] || suggestion.word?.bpy || 'N/A' }}
                                </div>
                                <div v-if="suggestion.pronunciation" class="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {{ suggestion.pronunciation }}
                                </div>
                                <div v-if="suggestion.partOfSpeech" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {{ suggestion.partOfSpeech }}
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>

                <!-- No Results -->
                <div v-else-if="noSuggestionsFound" class="p-6 text-center">
                    <i class="fas fa-search text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">No words found for "{{ searchTerm }}"</p>
                    <button @click="handleAddWord"
                        class="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-flex items-center gap-2">
                        <i class="fas fa-plus"></i>
                        Add this word
                    </button>
                </div>
            </div>
        </div>

        <div class="mt-3 flex items-center justify-center gap-4 text-sm">
            <p v-if="hasError" class="text-red-500 dark:text-red-400 flex items-center gap-2">
                <i class="fas fa-exclamation-circle"></i>
                Please enter a search term
            </p>
            <p v-else-if="isListening" class="text-red-500 dark:text-red-400 animate-pulse flex items-center gap-2">
                <i class="fas fa-microphone-lines"></i>
                Listening...
            </p>
            <span class="" v-else-if="isAvroEnabled && selectedLanguage !== 'en'">
                <p class="text-green-600 dark:text-green-400 text-center">
                    <i class="fas fa-keyboard"></i>
                    Avro Phonetic: ইংরেজিৎ লিখিক
                </p>
                <p
                    class="text-green-600 dark:text-green-400 text-center flex items-center justify-center gap-1 flex-wrap">
                    (কীবোর্ডহার
                    <kbd
                        class="px-3 py-1 bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-500 rounded shadow-sm text-gray-800 dark:text-gray-200 font-mono text-xs">Space</kbd>
                    স্পেস বাটনে চিপিলে ওয়াইগো হমিতই)
                </p>
            </span>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}

/* Custom scrollbar for suggestions */
.max-h-96::-webkit-scrollbar {
    width: 8px;
}

.max-h-96::-webkit-scrollbar-track {
    @apply bg-gray-100 dark:bg-gray-700 rounded-r-xl;
}

.max-h-96::-webkit-scrollbar-thumb {
    @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400 dark:bg-gray-500;
}
</style>
