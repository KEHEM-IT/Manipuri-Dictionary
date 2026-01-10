<!-- src/client/components/SearchBox.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Language } from '../types';

// STATE
const router = useRouter();
const searchTerm = ref('');
const selectedLanguage = ref<Language>('bpy');
const isListening = ref(false);
const isAvroEnabled = ref(true);
const typedText = ref('');
const currentHintIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);
const hasError = ref(false);
const isSpeechRecognitionSupported = ref(typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window));

// CONSTANTS
const hintWords: Record<Language, string[]> = {
    bpy: ['বিষ্ণুপ্রিয়া মণিপুরী', 'ইতিহাস', 'সংস্কৃতি', 'ভাষা', 'লেখক'],
    bn: ['বাংলা সাহিত্য', 'রবীন্দ্রনাথ ঠাকুর', 'বাংলাদেশ', 'ইতিহাস', 'সংস্কৃতি'],
    en: ['History', 'Culture', 'Literature', 'Language', 'Writers']
};

let recognition: any = null;
let typingInterval: any = null;
let erasingTimeout: any = null;

// VOICE RECOGNITION
const initVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
        searchTerm.value = event.results[0][0].transcript;
        handleSearch();
    };
    recognition.onend = recognition.onerror = () => isListening.value = false;
};

const handleVoiceSearch = () => {
    if (!recognition) return;
    isListening.value ? recognition.stop() : recognition.start();
    isListening.value = !isListening.value;
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

// SEARCH
const handleSearch = () => {
    if (!searchTerm.value.trim()) {
        hasError.value = true;
        setTimeout(() => hasError.value = false, 2000);
        return;
    }
    hasError.value = false;
    router.push({ name: 'SearchResults', query: { q: searchTerm.value, lang: selectedLanguage.value } });
};

const handleKeyDown = (event: KeyboardEvent) => {
    const hasSuggestions = document.querySelector('.avro-suggest ul li');
    if (hasSuggestions && (event.key === 'Tab' || event.key === ' ')) {
        event.preventDefault();
        return;
    }
    if (event.key === 'Enter') handleSearch();
};

// WATCHERS
watch(selectedLanguage, () => {
    currentHintIndex.value = 0;
    typedText.value = '';
    clearInterval(typingInterval);
    clearTimeout(erasingTimeout);
    startTypingAnimation();

    const enableAvro = selectedLanguage.value !== 'en';
    isAvroEnabled.value = enableAvro;
    toggleBanglaInput(enableAvro);
});

watch(searchTerm, (newVal) => {
    if (newVal.length > 0) {
        hasError.value = false;
        typedText.value = '';
        clearInterval(typingInterval);
        clearTimeout(erasingTimeout);
    } else {
        startTypingAnimation();
    }
});

// LIFECYCLE
onMounted(() => {
    initVoiceRecognition();
    startTypingAnimation();

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

        <div class="relative">
            <input ref="inputRef" v-model="searchTerm" type="text" autofocus
                :placeholder="searchTerm.length === 0 ? typedText : ''" @keydown="handleKeyDown" :class="[
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

                <button v-if="isSpeechRecognitionSupported" @click="handleVoiceSearch" :class="[
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
</style>