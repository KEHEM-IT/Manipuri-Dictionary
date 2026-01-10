<!-- src/client/views/AddWord.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ThemeToggle from '../components/ThemeToggle.vue';
import Footer from '../components/Footer.vue';
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
    discovered: [''],
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
    madoiText: '',
    rajar: false,
    rajarText: '',

    // bpyDifferences object (dynamic key-value pairs)
    bpyDifferences: {} as Record<string, string[]>,

    // Grammar object
    grammar: {
        partOfSpeech: [''],
        gender: '',
        sandhi: '',
        number: {
            singular: true,
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

// For bpyDifferences dynamic fields
const bpyDiffKey = ref('');
const bpyDiffValues = ref(['']);

// Load data from localStorage
const loadFromLocalStorage = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsedData = JSON.parse(saved);
            Object.assign(wordData.value, parsedData);
            console.log('Loaded draft from localStorage');
            draftLoadedMessage.value = true;
            // Auto-hide the message after 5 seconds
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
        
        // Show save indicator briefly
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
    // First, try to load from localStorage
    loadFromLocalStorage();
    
    // Then check if there's a query parameter (this will override localStorage)
    const term = route.query.term as string;
    const lang = route.query.lang as Language;

    if (term && lang) {
        wordData.value[lang] = term;
        selectedLanguage.value = lang;
        // Save immediately to localStorage
        saveToLocalStorage();
    }
});

// Watch for changes and auto-save to localStorage
watch(wordData, () => {
    saveToLocalStorage();
}, { deep: true });

// Also watch bpyDiffKey and bpyDiffValues
watch([bpyDiffKey, bpyDiffValues], () => {
    saveToLocalStorage();
}, { deep: true });

// Generic array field handlers with nested path support
const addArrayField = (fieldPath: string) => {
    const parts = fieldPath.split('.');
    let current: any = wordData.value;

    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }

    const fieldName = parts[parts.length - 1];
    if (Array.isArray(current[fieldName])) {
        current[fieldName].push('');
    }
};

const removeArrayField = (fieldPath: string, index: number) => {
    const parts = fieldPath.split('.');
    let current: any = wordData.value;

    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }

    const fieldName = parts[parts.length - 1];
    if (Array.isArray(current[fieldName]) && current[fieldName].length > 1) {
        current[fieldName].splice(index, 1);
    }
};

// Similar Sanskrit (nested array) handlers
const addSimilarSangkrit = () => {
    wordData.value.similarSangkrit.push(['', '']);
};

const removeSimilarSangkrit = (index: number) => {
    if (wordData.value.similarSangkrit.length > 1) {
        wordData.value.similarSangkrit.splice(index, 1);
    }
};

// bpyDifferences handlers
const addBpyDifference = () => {
    if (bpyDiffKey.value && bpyDiffValues.value.some(v => v.trim())) {
        wordData.value.bpyDifferences[bpyDiffKey.value] = [...bpyDiffValues.value];
        bpyDiffKey.value = '';
        bpyDiffValues.value = [''];
    }
};

const removeBpyDifference = (key: string) => {
    delete wordData.value.bpyDifferences[key];
};

const addBpyDiffValue = () => {
    bpyDiffValues.value.push('');
};

const removeBpyDiffValue = (index: number) => {
    if (bpyDiffValues.value.length > 1) {
        bpyDiffValues.value.splice(index, 1);
    }
};

// Origin Sanskrit array handlers
const addOriginSanskrit = () => {
    if (!Array.isArray(wordData.value.origin.সংস্কৃত)) {
        wordData.value.origin.সংস্কৃত = [''];
    } else {
        wordData.value.origin.সংস্কৃত.push('');
    }
};

const removeOriginSanskrit = (index: number) => {
    if (Array.isArray(wordData.value.origin.সংস্কৃত) && wordData.value.origin.সংস্কৃত.length > 1) {
        wordData.value.origin.সংস্কৃত.splice(index, 1);
    }
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
        // Process madoi and rajar based on checkbox state
        const submissionData = {
            ...wordData.value,
            madoi: wordData.value.madoi ? (wordData.value.madoiText || true) : false,
            rajar: wordData.value.rajar ? (wordData.value.rajarText || true) : false
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

        // Get first letter for determining which JSON file to update
        const firstLetter = wordData.value.bpy.charAt(0) || wordData.value.bn.charAt(0) || wordData.value.en.charAt(0);

        const response = await axios.post('/api/dictionary/add-word', {
            letter: firstLetter,
            wordData: submissionData
        });

        if (response.data.success) {
            successMessage.value = 'Word added successfully! It will be reviewed before being published.';
            
            // Clear localStorage on successful submission
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

// Clear form and localStorage
const clearForm = () => {
    if (confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
        // Reset wordData to initial state
        Object.assign(wordData.value, {
            bpy: '',
            bn: '',
            en: '',
            sankrit: '',
            romanization: [''],
            'similar-prons': [''],
            meaning: [''],
            discovered: [''],
            exampleSentences: [''],
            synonyms: [''],
            antonyms: [''],
            cat: [''],
            references: [''],
            similarBn: [''],
            similarEn: [''],
            similarSangkrit: [['', '']],
            description: '',
            IPA: '',
            phonetic: { bpy: '', bn: '', en: '' },
            origin: { সংস্কৃত: [''], meaning: '' },
            madoi: false,
            madoiText: '',
            rajar: false,
            rajarText: '',
            bpyDifferences: {},
            grammar: {
                partOfSpeech: [''],
                gender: '',
                sandhi: '',
                number: { singular: true, plural: '' }
            },
            usage: {
                commonness: '',
                usageMean: '',
                region: ['']
            }
        });
        
        // Reset dynamic fields
        bpyDiffKey.value = '';
        bpyDiffValues.value = [''];
        
        // Clear localStorage
        clearLocalStorage();
        
        successMessage.value = 'Form cleared successfully!';
        setTimeout(() => {
            successMessage.value = '';
        }, 2000);
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <!-- Header -->
        <header
            class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
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
                    <div
                        class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-6 gap-4">
                        <div class="w-full sm:w-auto">
                            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                <i class="fas fa-plus-circle text-blue-600 dark:text-blue-400 mr-2"></i>
                                নতুন শব্দ যোগ করিক
                            </h1>
                            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Contribute to the dictionary by adding a new
                                word</p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <button @click="goBack" type="button"
                                class="w-full sm:w-auto px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-center">
                                <i class="fas fa-arrow-left mr-2"></i>পিছুগা
                            </button>
                            <button @click="clearForm" type="button"
                                class="w-full sm:w-auto px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg transition-colors text-center">
                                <i class="fas fa-trash-alt mr-2"></i>Clear Form
                            </button>
                            <!-- Auto-save indicator -->
                            <div v-if="showSaveIndicator" 
                                class="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs animate-fade-in">
                                <i class="fas fa-check-circle"></i>
                                <span>Auto-saved</span>
                            </div>
                        </div>
                    </div>

                    <!-- Draft Loaded Message -->
                    <div v-if="draftLoadedMessage"
                        class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p class="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <i class="fas fa-info-circle"></i>
                            Draft loaded from previous session. Your work has been restored!
                            <button @click="draftLoadedMessage = false" class="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                <i class="fas fa-times"></i>
                            </button>
                        </p>
                    </div>

                    <!-- Success/Error Messages -->
                    <div v-if="successMessage"
                        class="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                        <p class="text-green-700 dark:text-green-400 flex items-center gap-2">
                            <i class="fas fa-check-circle"></i>
                            {{ successMessage }}
                        </p>
                    </div>

                    <div v-if="errorMessage"
                        class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                        <p class="text-red-700 dark:text-red-400 flex items-center gap-2">
                            <i class="fas fa-exclamation-circle"></i>
                            {{ errorMessage }}
                        </p>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
                        <!-- Basic Word Information -->
                        <section class="space-y-4">
                            <h2
                                class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <i class="fas fa-language text-blue-600 dark:text-blue-400"></i>
                                শব্দর তথ্য / Basic Information
                            </h2>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div class="w-full">
                                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        বিষ্ণুপ্রিয়া মণিপুরী *
                                    </label>
                                    <input v-model="wordData.bpy" type="text" required
                                        class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="শব্দ লিখিক">
                                </div>
                                <div class="w-full">
                                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        বাংলা
                                    </label>
                                    <input v-model="wordData.bn" type="text"
                                        class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="শব্দ লিখুন">
                                </div>
                                <div class="w-full">
                                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        English
                                    </label>
                                    <input v-model="wordData.en" type="text"
                                        class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="Write word">
                                </div>
                                <div class="w-full">
                                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Sanskrit / সংস্কৃত
                                    </label>
                                    <input v-model="wordData.sankrit" type="text"
                                        class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="जान्का (Jānka)">
                                </div>
                            </div>
                        </section>

                        <!-- Phonetic & IPA -->
                        <section class="space-y-4">
                            <h2
                                class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <i class="fas fa-volume-up text-blue-600 dark:text-blue-400"></i>
                                উচ্চারণ / Pronunciation
                            </h2>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div class="w-full">
                                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        IPA
                                    </label>
                                    <input v-model="wordData.IPA" type="text"
                                        class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="/d͡ʒɑkɑ/">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phonetic (BPY)
                                    </label>
                                    <input v-model="wordData.phonetic.bpy" type="text"
                                        class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="jaka">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phonetic (BN)
                                    </label>
                                    <input v-model="wordData.phonetic.bn" type="text"
                                        class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="jhuri">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phonetic (EN)
                                    </label>
                                    <input v-model="wordData.phonetic.en" type="text"
                                        class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="basket">
                                </div>
                            </div>
                        </section>

                        <!-- Romanization -->
                        <section class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="fas fa-font text-blue-600 dark:text-blue-400"></i>
                                    Romanization
                                </h3>
                                <button type="button" @click="addArrayField('romanization')"
                                    class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                    <i class="fas fa-plus mr-1"></i>যোগ করিক
                                </button>
                            </div>

                            <div v-for="(item, index) in wordData.romanization" :key="`rom-${index}`"
                                class="flex gap-2">
                                <input v-model="wordData.romanization[index]" type="text"
                                    class="flex-1 min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    placeholder="Jaka">
                                <button v-if="wordData.romanization.length > 1" type="button"
                                    @click="removeArrayField('romanization', index)"
                                    class="flex-shrink-0 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </section>

                        <!-- Similar Pronunciations -->
                        <section class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="fas fa-microphone text-blue-600 dark:text-blue-400"></i>
                                    একই উচ্চারণ / Similar Pronunciations
                                </h3>
                                <button type="button" @click="addArrayField('similar-prons')"
                                    class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                    <i class="fas fa-plus mr-1"></i>যোগ করিক
                                </button>
                            </div>

                            <div v-for="(item, index) in wordData['similar-prons']" :key="`sim-${index}`"
                                class="flex gap-2">
                                <input v-model="wordData['similar-prons'][index]" type="text"
                                    class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    placeholder="ঝাকা">
                                <button v-if="wordData['similar-prons'].length > 1" type="button"
                                    @click="removeArrayField('similar-prons', index)"
                                    class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </section>

                        <!-- Meanings -->
                        <section class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="fas fa-book-open text-blue-600 dark:text-blue-400"></i>
                                    অর্থ / Meanings
                                </h3>
                                <button type="button" @click="addArrayField('meaning')"
                                    class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                    <i class="fas fa-plus mr-1"></i>যোগ করিক
                                </button>
                            </div>

                            <div v-for="(item, index) in wordData.meaning" :key="`mean-${index}`" class="flex gap-2">
                                <input v-model="wordData.meaning[index]" type="text"
                                    class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    placeholder="হুরকা পাত্রগো">
                                <button v-if="wordData.meaning.length > 1" type="button"
                                    @click="removeArrayField('meaning', index)"
                                    class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </section>

                        <!-- Description -->
                        <section class="space-y-4">
                            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <i class="fas fa-align-left text-blue-600 dark:text-blue-400"></i>
                                বর্ণনা / Description
                            </h3>
                            <textarea v-model="wordData.description" rows="4"
                                class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                placeholder="শব্দর বিস্তারিত বর্ণনা লিখিক..."></textarea>
                        </section>

                        <!-- Example Sentences -->
                        <section class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="fas fa-quote-left text-blue-600 dark:text-blue-400"></i>
                                    উদাহরণ / Example Sentences
                                </h3>
                                <button type="button" @click="addArrayField('exampleSentences')"
                                    class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                    <i class="fas fa-plus mr-1"></i>যোগ করিক
                                </button>
                            </div>

                            <div v-for="(item, index) in wordData.exampleSentences" :key="`ex-${index}`"
                                class="flex gap-2">
                                <input v-model="wordData.exampleSentences[index]" type="text"
                                    class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    placeholder="জাকাগো মুরগত দে">
                                <button v-if="wordData.exampleSentences.length > 1" type="button"
                                    @click="removeArrayField('exampleSentences', index)"
                                    class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </section>

                        <!-- Synonyms & Antonyms -->
                        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Synonyms -->
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <h3
                                        class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <i class="fas fa-equals text-green-600 dark:text-green-400"></i>
                                        সমার্থক / Synonyms
                                    </h3>
                                    <button type="button" @click="addArrayField('synonyms')"
                                        class="px-2 py-1 bg-green-600 dark:bg-green-500 text-white text-xs rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>

                                <div v-for="(item, index) in wordData.synonyms" :key="`syn-${index}`"
                                    class="flex gap-2">
                                    <input v-model="wordData.synonyms[index]" type="text"
                                        class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors text-sm"
                                        placeholder="পেনি">
                                    <button v-if="wordData.synonyms.length > 1" type="button"
                                        @click="removeArrayField('synonyms', index)"
                                        class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                        <i class="fas fa-trash text-sm"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Antonyms -->
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <h3
                                        class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <i class="fas fa-not-equal text-red-600 dark:text-red-400"></i>
                                        বিপরীত / Antonyms
                                    </h3>
                                    <button type="button" @click="addArrayField('antonyms')"
                                        class="px-2 py-1 bg-red-600 dark:bg-red-500 text-white text-xs rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>

                                <div v-for="(item, index) in wordData.antonyms" :key="`ant-${index}`"
                                    class="flex gap-2">
                                    <input v-model="wordData.antonyms[index]" type="text"
                                        class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-red-400 transition-colors text-sm"
                                        placeholder="বিপরীত শব্দ">
                                    <button v-if="wordData.antonyms.length > 1" type="button"
                                        @click="removeArrayField('antonyms', index)"
                                        class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                        <i class="fas fa-trash text-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </section>

                        <!-- Categories -->
                        <section class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="fas fa-tags text-blue-600 dark:text-blue-400"></i>
                                    শ্রেণী / Categories
                                </h3>
                                <button type="button" @click="addArrayField('cat')"
                                    class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                    <i class="fas fa-plus mr-1"></i>যোগ করিক
                                </button>
                            </div>

                            <div v-for="(item, index) in wordData.cat" :key="`cat-${index}`" class="flex gap-2">
                                <input v-model="wordData.cat[index]" type="text"
                                    class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    placeholder="পাত্র">
                                <button v-if="wordData.cat.length > 1" type="button"
                                    @click="removeArrayField('cat', index)"
                                    class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </section>

                        <!-- Discovered By -->
                        <section class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="fas fa-user-astronaut text-blue-600 dark:text-blue-400"></i>
                                    আবিষ্কারক / Discovered By
                                </h3>
                                <button type="button" @click="addArrayField('discovered')"
                                    class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                    <i class="fas fa-plus mr-1"></i>যোগ করিক
                                </button>
                            </div>

                            <div v-for="(item, index) in wordData.discovered" :key="`disc-${index}`" class="flex gap-2">
                                <input v-model="wordData.discovered[index]" type="text"
                                    class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    placeholder="নাম লিখিক">
                                <button v-if="wordData.discovered.length > 1" type="button"
                                    @click="removeArrayField('discovered', index)"
                                    class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </section>

                        <!-- Madoi & Rajar (Checkboxes) -->
                        <section class="space-y-4">
                            <h2
                                class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <i class="fas fa-check-square text-blue-600 dark:text-blue-400"></i>
                                অতিরিক্ত তথ্য / Additional Info
                            </h2>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Madoi -->
                                <div class="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" v-model="wordData.madoi"
                                            class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2">
                                        <span class="text-lg font-medium text-gray-900 dark:text-white">Madoi
                                            (মাদৈ)</span>
                                    </label>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-8">মাদৈ বৈণ বুলিগা - Same
                                        as BPY word</p>
                                    <input v-if="wordData.madoi" v-model="wordData.madoiText" type="text"
                                        class="mt-3 ml-8 w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                                        placeholder="Optional: মাদৈ শব্দ লিখিক">
                                </div>

                                <!-- Rajar -->
                                <div class="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" v-model="wordData.rajar"
                                            class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2">
                                        <span class="text-lg font-medium text-gray-900 dark:text-white">Rajar
                                            (রাজার)</span>
                                    </label>
                                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-8">রাজার বৈণ বুলিগা -
                                        Same as BPY word</p>
                                    <input v-if="wordData.rajar" v-model="wordData.rajarText" type="text"
                                        class="mt-3 ml-8 w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                                        placeholder="Optional: রাজার শব্দ লিখিক">
                                </div>
                            </div>
                        </section>

                        <!-- Origin -->
                        <section class="space-y-4">
                            <h2
                                class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <i class="fas fa-landmark text-blue-600 dark:text-blue-400"></i>
                                উৎপত্তি / Origin
                            </h2>

                            <div class="space-y-4">
                                <div>
                                    <div class="flex items-center justify-between mb-2">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            সংস্কৃত শব্দ / Sanskrit Words
                                        </label>
                                        <button type="button" @click="addOriginSanskrit"
                                            class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                            <i class="fas fa-plus mr-1"></i>যোগ করিক
                                        </button>
                                    </div>
                                    <div v-for="(item, index) in wordData.origin.সংস্কৃত" :key="`origin-${index}`"
                                        class="flex gap-2 mb-2">
                                        <input v-model="wordData.origin.সংস্কৃত[index]" type="text"
                                            class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                            placeholder="জান্‌কা">
                                        <button v-if="wordData.origin.সংস্কৃত.length > 1" type="button"
                                            @click="removeOriginSanskrit(index)"
                                            class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        মূল অর্থ / Original Meaning
                                    </label>
                                    <input v-model="wordData.origin.meaning" type="text"
                                        class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="ছোট থলে">
                                </div>
                            </div>
                        </section>

                        <!-- BPY Differences -->
                        <section class="space-y-4">
                            <h2
                                class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <i class="fas fa-exchange-alt text-blue-600 dark:text-blue-400"></i>
                                আঞ্চলিক পার্থক্য / Regional Differences
                            </h2>

                            <!-- Add New Difference -->
                            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
                                <h4 class="font-medium text-gray-900 dark:text-white">নতুন পার্থক্য যোগ করিক</h4>
                                <div class="flex gap-2">
                                    <input v-model="bpyDiffKey" type="text" placeholder="Key (e.g., 1, 2)"
                                        class="w-32 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm">
                                    <div class="flex-1 space-y-2">
                                        <div v-for="(val, idx) in bpyDiffValues" :key="`diff-val-${idx}`"
                                            class="flex gap-2">
                                            <input v-model="bpyDiffValues[idx]" type="text" placeholder="আঞ্চলিক শব্দ"
                                                class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm">
                                            <button v-if="bpyDiffValues.length > 1" type="button"
                                                @click="removeBpyDiffValue(idx)"
                                                class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                                <i class="fas fa-trash text-sm"></i>
                                            </button>
                                        </div>
                                        <button type="button" @click="addBpyDiffValue"
                                            class="px-2 py-1 bg-gray-600 dark:bg-gray-500 text-white text-xs rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                                            <i class="fas fa-plus mr-1"></i>Add Value
                                        </button>
                                    </div>
                                    <button type="button" @click="addBpyDifference"
                                        class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                        <i class="fas fa-plus mr-1"></i>যোগ করিক
                                    </button>
                                </div>
                            </div>

                            <!-- Display Added Differences -->
                            <div v-if="Object.keys(wordData.bpyDifferences).length > 0" class="space-y-2">
                                <h4 class="font-medium text-gray-900 dark:text-white">Added Differences:</h4>
                                <div v-for="(values, key) in wordData.bpyDifferences" :key="`diff-${key}`"
                                    class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                    <span class="font-medium text-gray-900 dark:text-white">{{ key }}:</span>
                                    <span class="flex-1 text-gray-700 dark:text-gray-300">{{ values.join(', ') }}</span>
                                    <button type="button" @click="removeBpyDifference(key)"
                                        class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </section>

                        <!-- Grammar -->
                        <section class="space-y-4">
                            <h2
                                class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <i class="fas fa-book text-blue-600 dark:text-blue-400"></i>
                                ব্যাকরণ / Grammar
                            </h2>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Part of Speech -->
                                <div>
                                    <div class="flex items-center justify-between mb-2">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            পদ / Part of Speech
                                        </label>
                                        <button type="button" @click="addArrayField('grammar.partOfSpeech')"
                                            class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div v-for="(item, index) in wordData.grammar.partOfSpeech" :key="`pos-${index}`"
                                        class="flex gap-2 mb-2">
                                        <input v-model="wordData.grammar.partOfSpeech[index]" type="text"
                                            class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                                            placeholder="বিশেষ্য">
                                        <button v-if="wordData.grammar.partOfSpeech.length > 1" type="button"
                                            @click="removeArrayField('grammar.partOfSpeech', index)"
                                            class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                            <i class="fas fa-trash text-sm"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Gender -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        লিঙ্গ / Gender
                                    </label>
                                    <select v-model="wordData.grammar.gender"
                                        class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors">
                                        <option value="">Select Gender</option>
                                        <option value="পুংলিঙ্গ">পুংলিঙ্গ (Masculine)</option>
                                        <option value="স্ত্রী">স্ত্রী (Feminine)</option>
                                        <option value="ক্লীব">ক্লীব (Neuter)</option>
                                    </select>
                                </div>

                                <!-- Sandhi -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        সন্ধি / Sandhi
                                    </label>
                                    <input v-model="wordData.grammar.sandhi" type="text"
                                        class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="জা+কা">
                                </div>

                                <!-- Number -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        বহুবচন / Plural Form
                                    </label>
                                    <input v-model="wordData.grammar.number.plural" type="text"
                                        class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="জাকাগি">
                                </div>
                            </div>
                        </section>

                        <!-- Usage -->
                        <section class="space-y-4">
                            <h2
                                class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <i class="fas fa-chart-line text-blue-600 dark:text-blue-400"></i>
                                ব্যবহার / Usage
                            </h2>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Commonness -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ব্যবহারের মাত্রা / Commonness
                                    </label>
                                    <select v-model="wordData.usage.commonness"
                                        class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors">
                                        <option value="">Select Commonness</option>
                                        <option value="high">High (অতি প্রচলিত)</option>
                                        <option value="medium">Medium (মাঝারি)</option>
                                        <option value="low">Low (কম প্রচলিত)</option>
                                        <option value="rare">Rare (বিরল)</option>
                                    </select>
                                </div>

                                <!-- Usage Mean -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ব্যবহারের অর্থ / Usage Meaning
                                    </label>
                                    <select v-model="wordData.usage.usageMean"
                                        class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors">
                                        <option value="">Select Usage Mean</option>
                                        <option value="positive">Positive (ইতিবাচক)</option>
                                        <option value="neutral">Neutral (নিরপেক্ষ)</option>
                                        <option value="negative">Negative (নেতিবাচক)</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Regions -->
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        অঞ্চল / Regions
                                    </label>
                                    <button type="button" @click="addArrayField('usage.region')"
                                        class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                        <i class="fas fa-plus mr-1"></i>যোগ করিক
                                    </button>
                                </div>
                                <div v-for="(item, index) in wordData.usage.region" :key="`region-${index}`"
                                    class="flex gap-2 mb-2">
                                    <input v-model="wordData.usage.region[index]" type="text"
                                        class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                        placeholder="Tripura / Assam / Bangladesh">
                                    <button v-if="wordData.usage.region.length > 1" type="button"
                                        @click="removeArrayField('usage.region', index)"
                                        class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                        <i class="fas fa-trash text-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </section>

                        <!-- Similar Words -->
                        <section class="space-y-4">
                            <h2
                                class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <i class="fas fa-link text-blue-600 dark:text-blue-400"></i>
                                সম্পর্কিত শব্দ / Similar Words
                            </h2>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <!-- Similar Bengali -->
                                <div>
                                    <div class="flex items-center justify-between mb-2">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            সম্পর্কিত বাংলা শব্দ
                                        </label>
                                        <button type="button" @click="addArrayField('similarBn')"
                                            class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div v-for="(item, index) in wordData.similarBn" :key="`simBn-${index}`"
                                        class="flex gap-2 mb-2">
                                        <input v-model="wordData.similarBn[index]" type="text"
                                            class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                                            placeholder="থলি">
                                        <button v-if="wordData.similarBn.length > 1" type="button"
                                            @click="removeArrayField('similarBn', index)"
                                            class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                            <i class="fas fa-trash text-sm"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Similar English -->
                                <div>
                                    <div class="flex items-center justify-between mb-2">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Similar English
                                        </label>
                                        <button type="button" @click="addArrayField('similarEn')"
                                            class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div v-for="(item, index) in wordData.similarEn" :key="`simEn-${index}`"
                                        class="flex gap-2 mb-2">
                                        <input v-model="wordData.similarEn[index]" type="text"
                                            class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                                            placeholder="bag">
                                        <button v-if="wordData.similarEn.length > 1" type="button"
                                            @click="removeArrayField('similarEn', index)"
                                            class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                            <i class="fas fa-trash text-sm"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Similar Sanskrit -->
                                <div>
                                    <div class="flex items-center justify-between mb-2">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            সম্পর্কিত সংস্কৃত শব্দ
                                        </label>
                                        <button type="button" @click="addSimilarSangkrit"
                                            class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                    <div v-for="(item, index) in wordData.similarSangkrit" :key="`simSan-${index}`"
                                        class="flex gap-2 mb-2">
                                        <input v-model="wordData.similarSangkrit[index][0]" type="text"
                                            class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                                            placeholder="जालिका">
                                        <input v-model="wordData.similarSangkrit[index][1]" type="text"
                                            class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                                            placeholder="Jālika">
                                        <button v-if="wordData.similarSangkrit.length > 1" type="button"
                                            @click="removeSimilarSangkrit(index)"
                                            class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                            <i class="fas fa-trash text-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- References -->
                        <section class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="fas fa-external-link-alt text-blue-600 dark:text-blue-400"></i>
                                    তথ্যসূত্র / References
                                </h3>
                                <button type="button" @click="addArrayField('references')"
                                    class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                    <i class="fas fa-plus mr-1"></i>যোগ করিক
                                </button>
                            </div>

                            <div v-for="(item, index) in wordData.references" :key="`ref-${index}`" class="flex gap-2">
                                <input v-model="wordData.references[index]" type="url"
                                    class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    placeholder="https://example.com">
                                <button v-if="wordData.references.length > 1" type="button"
                                    @click="removeArrayField('references', index)"
                                    class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </section>

                        <!-- Submit Button -->
                        <div
                            class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button type="button" @click="goBack"
                                class="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base">
                                <i class="fas fa-arrow-left mr-2"></i>পিছুগা
                            </button>

                            <button type="submit" :disabled="isSubmitting"
                                class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
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
/* Ensure all inputs and textareas are properly constrained */
input[type="text"],
input[type="url"],
textarea,
select {
    max-width: 100%;
    box-sizing: border-box;
}

/* Prevent flex items from overflowing */
.flex > input {
    min-width: 0;
}

/* Ensure proper spacing on mobile */
@media (max-width: 640px) {
    .container {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }
}

/* Fade-in animation for auto-save indicator */
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
</style>
