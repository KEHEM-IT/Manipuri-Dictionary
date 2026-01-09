<!-- frontend/src/views/SearchResults.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import SearchBox from '../components/SearchBox.vue';
import WordCardMini from '../components/WordCardMini.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import Footer from '../components/Footer.vue';
import { Word, Language } from '../types';
import axios from 'axios';

const route = useRoute();
const words = ref<Word[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const searchLanguage = ref<Language>('en');

const searchWords = async () => {
    const query = route.query.q as string;
    const lang = route.query.lang as string;

    if (!query) return;

    searchQuery.value = query;
    searchLanguage.value = (lang || 'en') as Language;
    loading.value = true;

    try {
        const response = await axios.get('/api/dictionary/search', {
            params: {
                term: query,
                language: searchLanguage.value
            }
        });

        // Handle new API response format
        if (response.data.success) {
            words.value = response.data.data || [];
        } else {
            words.value = response.data || [];
        }
    } catch (error) {
        console.error('Search failed:', error);
        words.value = [];
    } finally {
        loading.value = false;
    }
};

watch(() => route.query, searchWords);

onMounted(searchWords);
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <header
            class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <router-link to="/" class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold text-gray-900 dark:text-white">বিষ্ণুপ্রিয়া</h1>
                            <p class="text-xs text-gray-600 dark:text-gray-400">Dictionary</p>
                        </div>
                    </router-link>

                    <ThemeToggle />
                </div>
            </div>
        </header>

        <div class="container mx-auto px-4 py-8">
            <div class="mb-8">
                <SearchBox />
            </div>

            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Search Results
                    <span v-if="!loading" class="text-base font-normal text-gray-600 dark:text-gray-400">
                        ({{ words.length }} found)
                    </span>
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    Searching for "<span class="font-semibold">{{ searchQuery }}</span>"
                    in {{ searchLanguage === 'bpy' ? 'Bishnupriya' : searchLanguage === 'bn' ? 'Bengali' : 'English' }}
                </p>
            </div>

            <div v-if="loading" class="text-center py-20">
                <div
                    class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent">
                </div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">Searching...</p>
            </div>

            <div v-else-if="words.length === 0" class="text-center py-20">
                <div class="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <svg class="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                <p class="text-gray-600 dark:text-gray-400">Try searching with different keywords or language</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <WordCardMini v-for="word in words" :key="word.id" :word="word" />
            </div>
        </div>

        <Footer />
    </div>
</template>
