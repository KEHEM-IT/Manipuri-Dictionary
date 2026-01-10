<!-- src/client/components/SearchBox.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Language, Word } from '../types';
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

const selectSuggestion = (suggestion: Word) => {
    const wordText = suggestion[selectedLanguage.value] || suggestion.bpy || '';
    searchTerm.value = wordText;
    showSuggestions.value = false;
    clearSuggestions();

    // Navigate to word detail page using word text instead of ID
    router.push({
        name: 'WordDetail',
        params: { identifier: encodeURIComponent(wordText) },
        query: { lang: selectedLanguage.value }
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
                :placeholder="searchTerm.length === 0 ? typedText : ''" @input="handleInputChange"
                @keydown="handleKeyDown" @focus="searchTerm.trim() && (showSuggestions = true)" :class="[
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
            <div v-if="showSuggestions && (suggestionsLoading || suggestions.length > 0 || noSuggestionsFound)"
                class="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-xl max-h-96 overflow-y-auto animate-slide-down">

                <!-- Loading State -->
                <div v-if="suggestionsLoading" class="p-8">
                    <div class="flex flex-col items-center justify-center gap-4">
                        <!-- Animated spinner -->
                        <div class="relative w-16 h-16">
                            <div
                                class="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900 rounded-full">
                            </div>
                            <div
                                class="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin">
                            </div>
                        </div>
                        <!-- Loading text -->
                        <div class="text-center">
                            <p class="text-gray-600 dark:text-gray-400 font-medium">Searching...</p>
                            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Finding words for "{{ searchTerm
                                }}"</p>
                        </div>
                        <!-- Animated dots -->
                        <div class="flex gap-1">
                            <span class="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
                                style="animation-delay: 0ms"></span>
                            <span class="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
                                style="animation-delay: 150ms"></span>
                            <span class="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
                                style="animation-delay: 300ms"></span>
                        </div>
                    </div>
                </div>

                <!-- Suggestions List -->
                <ul v-else-if="suggestions.length > 0" class="py-2">
                    <li v-for="(suggestion, index) in suggestions" :key="suggestion.id"
                        @click="selectSuggestion(suggestion)" @mouseenter="selectedSuggestionIndex = index" :class="[
                            'px-5 py-4 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0',
                            selectedSuggestionIndex === index
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-sm'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        ]">
                        <div class="flex items-center gap-3">
                            <!-- Icon -->
                            <div :class="[
                                'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200',
                                selectedSuggestionIndex === index
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                            ]">
                                <i class="fas fa-book text-sm"></i>
                            </div>

                            <!-- Word Information in Single Line -->
                            <div class="flex-1 min-w-0 flex items-center gap-3 flex-wrap">

                                <!-- BPY Word (Prominent) -->
                                <span class="text-2xl text-gray-900 dark:text-white tracking-wide text-left">
                                    {{ suggestion.bpy || 'N/A' }}
                                </span>

                                <!-- Grammar Part of Speech -->
                                <span v-if="suggestion.grammar?.partOfSpeech?.length" class="px-3 py-1 text-xs font-medium rounded-full text-left
                                    bg-gradient-to-r from-sky-100 to-teal-100
                                    dark:from-sky-500/20 dark:to-teal-500/20
                                    text-sky-700 dark:text-sky-300
                                    border border-sky-200/60 dark:border-sky-800/60">
                                    {{ suggestion.grammar.partOfSpeech.join(", ") }}
                                </span>

                                <!-- Bengali Word -->
                                <span v-if="suggestion.bn"
                                    class="text-lg font-medium text-green-700 dark:text-green-400 text-left">
                                    বাংলা: {{ suggestion.bn }}
                                </span>

                                <!-- English Word -->
                                <span v-if="suggestion.en"
                                    class="text-base font-medium text-blue-600 dark:text-blue-400 italic text-left">
                                    English: {{ suggestion.en }}
                                </span>

                            </div>


                            <!-- Arrow Icon -->
                            <i :class="[
                                'fas fa-chevron-right text-sm transition-all duration-200',
                                selectedSuggestionIndex === index
                                    ? 'text-blue-500 dark:text-blue-400 transform translate-x-1'
                                    : 'text-gray-300 dark:text-gray-600'
                            ]"></i>
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

@keyframes pulse-subtle {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

@keyframes slide-down {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}

.animate-slide-down {
    animation: slide-down 0.3s ease-out;
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

/* Loading spinner glow effect */
@keyframes glow {

    0%,
    100% {
        box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
    }

    50% {
        box-shadow: 0 0 20px rgba(37, 99, 235, 0.8);
    }
}

.animate-spin {
    animation: spin 1s linear infinite, glow 2s ease-in-out infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
