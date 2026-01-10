<!-- src/client/views/AddWord.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Language } from '../types';

const route = useRoute();
const router = useRouter();

const wordData = ref({
    word: {
        bpy: '',
        bn: '',
        en: ''
    },
    pronunciation: '',
    partOfSpeech: '',
    definitions: [''],
    examples: [''],
    synonyms: [''],
    antonyms: ['']
});

const selectedLanguage = ref<Language>('bpy');
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(() => {
    // Pre-fill the word from query params
    const term = route.query.term as string;
    const lang = route.query.lang as Language;
    
    if (term && lang) {
        wordData.value.word[lang] = term;
        selectedLanguage.value = lang;
    }
});

const addDefinition = () => {
    wordData.value.definitions.push('');
};

const removeDefinition = (index: number) => {
    if (wordData.value.definitions.length > 1) {
        wordData.value.definitions.splice(index, 1);
    }
};

const addExample = () => {
    wordData.value.examples.push('');
};

const removeExample = (index: number) => {
    if (wordData.value.examples.length > 1) {
        wordData.value.examples.splice(index, 1);
    }
};

const addSynonym = () => {
    wordData.value.synonyms.push('');
};

const removeSynonym = (index: number) => {
    wordData.value.synonyms.splice(index, 1);
};

const addAntonym = () => {
    wordData.value.antonyms.push('');
};

const removeAntonym = (index: number) => {
    wordData.value.antonyms.splice(index, 1);
};

const handleSubmit = async () => {
    // Validate required fields
    if (!wordData.value.word.bpy && !wordData.value.word.bn && !wordData.value.word.en) {
        errorMessage.value = 'Please enter the word in at least one language';
        return;
    }

    if (!wordData.value.definitions.some(def => def.trim())) {
        errorMessage.value = 'Please provide at least one definition';
        return;
    }

    isSubmitting.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        // TODO: Implement API call to save the word
        // const response = await axios.post('/api/dictionary/words', wordData.value);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        successMessage.value = 'Word added successfully!';
        
        // Redirect after 2 seconds
        setTimeout(() => {
            router.push({ name: 'Home' });
        }, 2000);
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
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <!-- Header -->
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            <i class="fas fa-plus-circle text-blue-600 dark:text-blue-400 mr-2"></i>
                            Add New Word
                        </h1>
                        <p class="text-gray-600 dark:text-gray-400">Contribute to the dictionary by adding a new word</p>
                    </div>
                    <button @click="goBack"
                        class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>Back
                    </button>
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
                <form @submit.prevent="handleSubmit" class="space-y-8">
                    <!-- Word Section -->
                    <div class="space-y-4">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <i class="fas fa-language text-blue-600 dark:text-blue-400"></i>
                            Word (in different languages)
                        </h2>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    বিষ্ণুপ্রিয়া মণিপুরী
                                </label>
                                <input v-model="wordData.word.bpy" type="text"
                                    class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    placeholder="শব্দ লিখিক">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    বাংলা
                                </label>
                                <input v-model="wordData.word.bn" type="text"
                                    class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    placeholder="শব্দ লিখুন">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    English
                                </label>
                                <input v-model="wordData.word.en" type="text"
                                    class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    placeholder="Write word">
                            </div>
                        </div>
                    </div>

                    <!-- Pronunciation & Part of Speech -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <i class="fas fa-volume-up mr-2"></i>Pronunciation
                            </label>
                            <input v-model="wordData.pronunciation" type="text"
                                class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                placeholder="e.g., /ʃəbdə/">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <i class="fas fa-tag mr-2"></i>Part of Speech
                            </label>
                            <select v-model="wordData.partOfSpeech"
                                class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors">
                                <option value="">Select...</option>
                                <option value="noun">Noun (বিশেষ্য)</option>
                                <option value="verb">Verb (ক্রিয়া)</option>
                                <option value="adjective">Adjective (বিশেষণ)</option>
                                <option value="adverb">Adverb (ক্রিয়া বিশেষণ)</option>
                                <option value="pronoun">Pronoun (সর্বনাম)</option>
                                <option value="preposition">Preposition (সম্বন্ধসূচক)</option>
                                <option value="conjunction">Conjunction (সংযোজক)</option>
                                <option value="interjection">Interjection (আবেগসূচক)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Definitions -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <i class="fas fa-book-open text-blue-600 dark:text-blue-400"></i>
                                Definitions
                            </h2>
                            <button type="button" @click="addDefinition"
                                class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                <i class="fas fa-plus mr-1"></i>Add
                            </button>
                        </div>
                        
                        <div v-for="(def, index) in wordData.definitions" :key="`def-${index}`" class="flex gap-2">
                            <input v-model="wordData.definitions[index]" type="text"
                                class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                :placeholder="`Definition ${index + 1}`">
                            <button v-if="wordData.definitions.length > 1" type="button" @click="removeDefinition(index)"
                                class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Examples -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <i class="fas fa-quote-left text-blue-600 dark:text-blue-400"></i>
                                Examples
                            </h2>
                            <button type="button" @click="addExample"
                                class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                                <i class="fas fa-plus mr-1"></i>Add
                            </button>
                        </div>
                        
                        <div v-for="(example, index) in wordData.examples" :key="`ex-${index}`" class="flex gap-2">
                            <input v-model="wordData.examples[index]" type="text"
                                class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                :placeholder="`Example ${index + 1}`">
                            <button v-if="wordData.examples.length > 1" type="button" @click="removeExample(index)"
                                class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Synonyms & Antonyms -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Synonyms -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="fas fa-equals text-green-600 dark:text-green-400"></i>
                                    Synonyms
                                </h3>
                                <button type="button" @click="addSynonym"
                                    class="px-2 py-1 bg-green-600 dark:bg-green-500 text-white text-xs rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            
                            <div v-for="(syn, index) in wordData.synonyms" :key="`syn-${index}`" class="flex gap-2">
                                <input v-model="wordData.synonyms[index]" type="text"
                                    class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors text-sm"
                                    placeholder="Synonym">
                                <button type="button" @click="removeSynonym(index)"
                                    class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                    <i class="fas fa-trash text-sm"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Antonyms -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <i class="fas fa-not-equal text-red-600 dark:text-red-400"></i>
                                    Antonyms
                                </h3>
                                <button type="button" @click="addAntonym"
                                    class="px-2 py-1 bg-red-600 dark:bg-red-500 text-white text-xs rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            
                            <div v-for="(ant, index) in wordData.antonyms" :key="`ant-${index}`" class="flex gap-2">
                                <input v-model="wordData.antonyms[index]" type="text"
                                    class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-red-400 transition-colors text-sm"
                                    placeholder="Antonym">
                                <button type="button" @click="removeAntonym(index)"
                                    class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                                    <i class="fas fa-trash text-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button type="submit" :disabled="isSubmitting"
                            class="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
                            <i v-else class="fas fa-save mr-2"></i>
                            {{ isSubmitting ? 'Submitting...' : 'Submit Word' }}
                        </button>
                        <button type="button" @click="goBack"
                            class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
