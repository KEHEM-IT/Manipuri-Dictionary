<!-- Location: frontend/src/components/WordCardMini.vue -->
<script setup lang="ts">
import { Word } from '../types';

defineProps<{
    word: Word;
}>();
</script>

<template>
    <router-link :to="`/word/${encodeURIComponent(word.bpy)}?lang=bpy`"
        class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-transparent hover:border-blue-500 dark:hover:border-blue-400 block">

        <!-- Word Header -->
        <div class="flex items-start justify-between mb-4">
            <h3
                class="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {{ word.bpy }}
            </h3>
            <svg class="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition transform group-hover:translate-x-1"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </div>

        <!-- Translations -->
        <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500 dark:text-gray-400 w-16">Bengali:</span>
                <span class="text-gray-700 dark:text-gray-300">{{ word.bn }}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500 dark:text-gray-400 w-16">English:</span>
                <span class="text-gray-700 dark:text-gray-300">{{ word.en }}</span>
            </div>
        </div>

        <!-- Tags/Categories -->
        <div class="flex flex-wrap gap-2 mb-3">
            <span v-if="word.grammar?.partOfSpeech?.length"
                class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                {{ word.grammar.partOfSpeech[0] }}
            </span>
            <span v-if="word.cat?.length"
                class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs">
                {{ word.cat[0] }}
            </span>
            <span v-if="word.madoi"
                class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded text-xs">
                মাদৈ
            </span>
            <span v-if="word.rajar"
                class="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded text-xs">
                রাজার
            </span>
        </div>

        <!-- Romanization -->
        <div v-if="word.romanization?.length" class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ word.romanization.join(', ') }}
            </p>
        </div>

        <!-- Example Sentence Preview -->
        <div v-if="word.exampleSentences?.length" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Example:</p>
            <p class="text-sm text-gray-700 dark:text-gray-300 italic line-clamp-2">
                {{ word.exampleSentences[0] }}
            </p>
        </div>

        <!-- Icons -->
        <div class="mt-4 flex gap-2 text-gray-400">
            <svg v-if="word.phonetic || word.IPA" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                    d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
            <svg v-if="word.exampleSentences?.length" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clip-rule="evenodd" />
            </svg>
            <svg v-if="word.synonyms?.length || word.antonyms?.length" class="w-4 h-4" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clip-rule="evenodd" />
            </svg>
        </div>
    </router-link>
</template>