<!-- frontend/src/views/Home.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SearchBox from '../components/SearchBox.vue';
import WordCardMini from '../components/WordCardMini.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import Footer from '../components/Footer.vue';
import { Word } from '../types';
import axios from 'axios';

const featuredWords = ref<Word[]>([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const response = await axios.get('/api/dictionary/words');
        // Handle new API response format
        if (response.data.success) {
            featuredWords.value = response.data.data.slice(0, 6);
        } else {
            featuredWords.value = response.data.slice(0, 6);
        }
    } catch (error) {
        console.error('Failed to load words:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
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

        <!-- Hero Section -->
        <section class="h-screen flex items-center justify-center text-center">
            <div class="container mx-auto text-center -mt-[4.2rem]">
                <div class="mb-8">
                    <h2 style="line-height: normal;"
                        class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        বিষ্ণুপ্রিয়া মণিপুরী অভিধান
                    </h2>
                    <p class="text-xl text-gray-600 dark:text-gray-400">
                        Bishnupriya Manipuri Advanced Dictionary
                    </p>
                </div>
                <SearchBox />
            </div>
        </section>

        <!-- Featured Words Section -->
        <section class="py-12 px-4 bg-white dark:bg-gray-800">
            <div class="container mx-auto">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    📚 Today's Featured Words
                </h3>

                <div v-if="loading" class="text-center py-12">
                    <div
                        class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent">
                    </div>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <WordCardMini v-for="word in featuredWords" :key="word.id" :word="word" />
                </div>
            </div>
        </section>

        <Footer />
    </div>
</template>
