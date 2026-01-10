<!-- src/client/views/AddWord.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ThemeToggle from '../components/ThemeToggle.vue';
import Footer from '../components/Footer.vue';
import BasicInfoSection from '../components/AddWord/BasicInfoSection.vue';
import PronunciationSection from '../components/AddWord/PronunciationSection.vue';
import ArrayFieldSection from '../components/AddWord/ArrayFieldSection.vue';
import DescriptionSection from '../components/AddWord/DescriptionSection.vue';
import SynonymsAntonymsSection from '../components/AddWord/SynonymsAntonymsSection.vue';
import MadoiRajarSection from '../components/AddWord/MadoiRajarSection.vue';
import OriginSection from '../components/AddWord/OriginSection.vue';
import BpyDifferencesSection from '../components/AddWord/BpyDifferencesSection.vue';
import GrammarSection from '../components/AddWord/GrammarSection.vue';
import UsageSection from '../components/AddWord/UsageSection.vue';
import SimilarWordsSection from '../components/AddWord/SimilarWordsSection.vue';
import DiscoverySection from '../components/AddWord/DiscoverySection.vue';
import CategoriesSection from '../components/AddWord/CategoriesSection.vue';
import { Language } from '../types';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const wordData = ref({
    // Basic fields
    bpy: '',
    bn: '',
    en: '',
    sankrit: '',

    // Arrays
    romanization: [''],
    'similar-prons': [''],
    meaning: [''],
    discovered: '',
    exampleSentences: [''],
    synonyms: [''],
    antonyms: [''],
    cat: [''],
    references: [''],
    similarBn: [''],
    similarEn: [''],
    similarSangkrit: [['', '']],

    // Text fields
    description: '',
    IPA: '',

    // Phonetic object
    phonetic: {
        bpy: '',
        bn: '',
        en: ''
    },

    // Origin object
    origin: {
        সংস্কৃত: [''],
        meaning: ''
    },

    // Boolean fields with checkboxes
    madoi: false,
    rajar: false,

    // bpyDifferences object (dynamic key-value pairs)
    bpyDifferences: {} as Record<string, string[]>,

    // Grammar object
    grammar: {
        partOfSpeech: [''],
        gender: '',
        sandhi: '',
        number: {
            singular: '',
            plural: ''
        }
    },

    // Usage object
    usage: {
        commonness: '',
        usageMean: '',
        region: ['']
    }
});

const selectedLanguage = ref<Language>('bpy');
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const draftLoadedMessage = ref(false);
const lastSavedTime = ref<Date | null>(null);
const showSaveIndicator = ref(false);

// LocalStorage key
const STORAGE_KEY = 'dictionary_add_word_draft';

// Load data from localStorage
const loadFromLocalStorage = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsedData = JSON.parse(saved);
            Object.assign(wordData.value, parsedData);
            console.log('Loaded draft from localStorage');
            draftLoadedMessage.value = true;
            setTimeout(() => {
                draftLoadedMessage.value = false;
            }, 5000);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
};

// Save data to localStorage
const saveToLocalStorage = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wordData.value));
        lastSavedTime.value = new Date();
        
        showSaveIndicator.value = true;
        setTimeout(() => {
            showSaveIndicator.value = false;
        }, 1500);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// Clear localStorage
const clearLocalStorage = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Cleared draft from localStorage');
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};

onMounted(() => {
    loadFromLocalStorage();
    
    const term = route.query.term as string;
    const lang = route.query.lang as Language;

    if (term && lang) {
        wordData.value[lang] = term;
        selectedLanguage.value = lang;
        saveToLocalStorage();
    }
});

// Watch for changes and auto-save to localStorage with debounce
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
watch(wordData, () => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
        saveToLocalStorage();
    }, 500); // Debounce for 500ms
}, { deep: true });

// Update handlers for nested objects
const updateWordData = (updates: any) => {
    // Deep merge instead of shallow assign
    Object.keys(updates).forEach(key => {
        const typedKey = key as keyof typeof wordData.value;
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key]) && updates[key] !== null) {
            // For nested objects, merge properties
            (wordData.value as any)[typedKey] = {
                ...(wordData.value[typedKey] as any),
                ...updates[key]
            };
        } else {
            // For primitives and arrays, direct assignment
            (wordData.value as any)[typedKey] = updates[key];
        }
    });
};

const handleSubmit = async () => {
    if (!wordData.value.bpy && !wordData.value.bn && !wordData.value.en) {
        errorMessage.value = 'Please enter the word in at least one language';
        return;
    }

    isSubmitting.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        const submissionData = {
            ...wordData.value
        };

        // Clean up empty arrays and nested arrays
        Object.keys(submissionData).forEach(key => {
            if (Array.isArray(submissionData[key as keyof typeof submissionData])) {
                const arr = submissionData[key as keyof typeof submissionData] as any[];
                submissionData[key as keyof typeof submissionData] = arr.filter(item => {
                    if (Array.isArray(item)) {
                        return item.some(subItem => subItem && subItem.trim());
                    }
                    return item && item.trim && item.trim();
                }) as any;
            }
        });

        const firstLetter = wordData.value.bpy.charAt(0) || wordData.value.bn.charAt(0) || wordData.value.en.charAt(0);

        const response = await axios.post('/api/dictionary/add-word', {
            letter: firstLetter,
            wordData: submissionData
        });

        if (response.data.success) {
            successMessage.value = 'Word added successfully! It will be reviewed before being published.';
            clearLocalStorage();
            setTimeout(() => {
                router.push({ name: 'Home' });
            }, 2000);
        } else {
            errorMessage.value = response.data.error || 'Failed to add word';
        }
    } catch (error) {
        errorMessage.value = 'Failed to add word. Please try again.';
        console.error(error);
    } finally {
        isSubmitting.value = false;
    }
};

const goBack = () => {
    router.back();
};

const clearForm = () => {
    if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
        Object.assign(wordData.value, {
            bpy: '', bn: '', en: '', sankrit: '',
            romanization: [''], 'similar-prons': [''], meaning: [''],
            discovered: '', exampleSentences: [''], synonyms: [''],
            antonyms: [''], cat: [''], references: [''],
            similarBn: [''], similarEn: [''], similarSangkrit: [['', '']],
            description: '', IPA: '',
            phonetic: { bpy: '', bn: '', en: '' },
            origin: { সংস্কৃত: [''], meaning: '' },
            madoi: false, rajar: false,
            bpyDifferences: {},
            grammar: {
                partOfSpeech: [''], gender: '', sandhi: '',
                number: { singular: '', plural: '' }
            },
            usage: { commonness: '', usageMean: '', region: [''] }
        });
        
        clearLocalStorage();
        successMessage.value = 'Form cleared successfully!';
        setTimeout(() => { successMessage.value = ''; }, 2000);
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <!-- Header -->
        <header class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
            <div class="container mx-auto px-4 py-2">
                <div class="flex justify-between items-center">
                    <router-link to="/" class="flex items-center gap-3">
                        <div class="w-10 h-10 flex items-center justify-center">
                            <img src="../assets/logo.svg" alt="logo">
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-gray-900 dark:text-white">বিষ্ণুপ্রিয়া মণিপুরি</h1>
                            <p class="text-xs text-gray-600 dark:text-gray-400">অভিধান</p>
                        </div>
                    </router-link>
                    <ThemeToggle />
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <div class="flex-1 py-4 sm:py-8 px-3 sm:px-4">
            <div class="max-w-6xl mx-auto">
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                    <!-- Header -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-6 gap-4">
                        <div class="w-full sm:w-auto">
                            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                <i class="fas fa-plus-circle text-blue-600 dark:text-blue-400 mr-2"></i>
                                নতুন শব্দ যোগ করিক
                            </h1>
                            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Contribute to the dictionary by adding a new word</p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <button @click="goBack" type="button" class="w-full sm:w-auto px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-center">
                                <i class="fas fa-arrow-left mr-2"></i>পিছুগা
                            </button>
                            <button @click="clearForm" type="button" class="w-full sm:w-auto px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg transition-colors text-center">
                                <i class="fas fa-trash-alt mr-2"></i>Clear Form
                            </button>
                            <div v-if="showSaveIndicator" class="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs animate-fade-in">
                                <i class="fas fa-check-circle"></i>
                                <span>Auto-saved</span>
                            </div>
                        </div>
                    </div>

                    <!-- Draft Loaded Message -->
                    <div v-if="draftLoadedMessage" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p class="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <i class="fas fa-info-circle"></i>
                            Draft loaded from previous session. Your work has been restored!
                            <button @click="draftLoadedMessage = false" class="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                <i class="fas fa-times"></i>
                            </button>
                        </p>
                    </div>

                    <!-- Success/Error Messages -->
                    <div v-if="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                        <p class="text-green-700 dark:text-green-400 flex items-center gap-2">
                            <i class="fas fa-check-circle"></i>
                            {{ successMessage }}
                        </p>
                    </div>

                    <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                        <p class="text-red-700 dark:text-red-400 flex items-center gap-2">
                            <i class="fas fa-exclamation-circle"></i>
                            {{ errorMessage }}
                        </p>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
                        <!-- Basic Word Information -->
                        <BasicInfoSection 
                            :bpy="wordData.bpy"
                            :bn="wordData.bn"
                            :en="wordData.en"
                            :sankrit="wordData.sankrit"
                            @update:bpy="wordData.bpy = $event"
                            @update:bn="wordData.bn = $event"
                            @update:en="wordData.en = $event"
                            @update:sankrit="wordData.sankrit = $event" />

                        <!-- Phonetic & IPA -->
                        <PronunciationSection 
                            v-model="wordData" 
                            @update:modelValue="updateWordData" />

                        <!-- Romanization -->
                        <ArrayFieldSection
                            v-model="wordData.romanization"
                            title="Romanization"
                            icon="fa-font"
                            placeholder="Jaka"
                            field-name="romanization" />

                        <!-- Similar Pronunciations -->
                        <ArrayFieldSection
                            v-model="wordData['similar-prons']"
                            title="একই উচ্চারণ / Similar Pronunciations"
                            icon="fa-microphone"
                            placeholder="ঝাকা"
                            field-name="similar-prons" />

                        <!-- Meanings -->
                        <ArrayFieldSection
                            v-model="wordData.meaning"
                            title="অর্থ / Meanings"
                            icon="fa-book-open"
                            placeholder="হুরকা পাত্রগো"
                            field-name="meaning" />

                        <!-- Description -->
                        <DescriptionSection v-model="wordData.description" />

                        <!-- Example Sentences -->
                        <ArrayFieldSection
                            v-model="wordData.exampleSentences"
                            title="উদাহরণ / Example Sentences"
                            icon="fa-quote-left"
                            placeholder="জাকাগো মুরগত দে"
                            field-name="exampleSentences" />

                        <!-- Synonyms & Antonyms -->
                        <SynonymsAntonymsSection 
                            v-model="wordData" 
                            @update:modelValue="updateWordData" />

                        <!-- Categories -->
                        <CategoriesSection v-model="wordData.cat" />

                        <!-- Discovery Information -->
                        <DiscoverySection v-model="wordData.discovered" />

                        <!-- Madoi & Rajar -->
                        <MadoiRajarSection 
                            v-model="wordData" 
                            @update:modelValue="updateWordData" />

                        <!-- Origin -->
                        <OriginSection 
                            v-model="wordData.origin" 
                            @update:modelValue="(val) => wordData.origin = { ...wordData.origin, ...val }" />

                        <!-- BPY Differences -->
                        <BpyDifferencesSection 
                            v-model="wordData.bpyDifferences" />

                        <!-- Grammar -->
                        <GrammarSection 
                            v-model="wordData.grammar" 
                            @update:modelValue="(val) => wordData.grammar = { ...wordData.grammar, ...val }" />

                        <!-- Usage -->
                        <UsageSection 
                            v-model="wordData.usage" 
                            @update:modelValue="(val) => wordData.usage = { ...wordData.usage, ...val }" />

                        <!-- Similar Words -->
                        <SimilarWordsSection 
                            :similar-bn="wordData.similarBn"
                            :similar-en="wordData.similarEn"
                            :similar-sangkrit="wordData.similarSangkrit"
                            @update:similarBn="wordData.similarBn = $event"
                            @update:similarEn="wordData.similarEn = $event"
                            @update:similarSangkrit="wordData.similarSangkrit = $event" />

                        <!-- References -->
                        <ArrayFieldSection
                            v-model="wordData.references"
                            title="তথ্যসূত্র / References"
                            icon="fa-external-link-alt"
                            placeholder="https://example.com"
                            field-name="references"
                            input-type="url" />

                        <!-- Submit Button -->
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button type="button" @click="goBack" class="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base">
                                <i class="fas fa-arrow-left mr-2"></i>পিছুগা
                            </button>

                            <button type="submit" :disabled="isSubmitting" class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                                <i class="fas fa-save mr-2"></i>
                                <span v-if="!isSubmitting">সংরক্ষণ করিক / Save Word</span>
                                <span v-else>
                                    <i class="fas fa-spinner fa-spin mr-2"></i>সংরক্ষণ করা হচ্ছে...
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <Footer />
    </div>
</template>

<style scoped>
@keyframes fadeIn {
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
    animation: fadeIn 0.3s ease-out;
}

@media (max-width: 640px) {
    .container {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }
}
</style>
