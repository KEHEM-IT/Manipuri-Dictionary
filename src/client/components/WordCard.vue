<!-- Location: frontend/src/components/WordCard.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Word } from '../types';

const props = defineProps<{
    word: Word;
}>();

const router = useRouter();

const viewDetails = () => {
    router.push(`/word/${encodeURIComponent(props.word.bpy)}?lang=bpy`);
};
</script>

<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
        @click="viewDetails">
        <div class="flex justify-between items-start mb-3">
            <div class="flex gap-2 flex-wrap">
                <span v-if="word.cat?.length" v-for="category in word.cat.slice(0, 2)" :key="category"
                    class="px-3 py-1 bg-purple-600 dark:bg-purple-500 text-white text-xs rounded-full">
                    {{ category }}
                </span>
                <span v-if="word.grammar?.partOfSpeech?.length"
                    class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                    {{ word.grammar.partOfSpeech[0] }}
                </span>
                <span v-if="word.madoi"
                    class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                    মাদৈ
                </span>
                <span v-if="word.rajar"
                    class="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs rounded-full">
                    রাজার
                </span>
            </div>
            <button class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>

        <div class="space-y-3">
            <div class="border-l-4 border-blue-500 pl-4">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bishnupriya</p>
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ word.bpy }}</p>
                <p v-if="word.phonetic?.bpy" class="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                    /{{ word.phonetic.bpy }}/
                </p>
                <p v-else-if="word.IPA" class="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                    {{ word.IPA }}
                </p>
            </div>

            <div class="border-l-4 border-green-500 pl-4">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bengali</p>
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ word.bn }}</p>
                <p v-if="word.phonetic?.bn" class="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                    /{{ word.phonetic.bn }}/
                </p>
            </div>

            <div class="border-l-4 border-purple-500 pl-4">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">English</p>
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ word.en }}</p>
                <p v-if="word.phonetic?.en" class="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
                    /{{ word.phonetic.en }}/
                </p>
            </div>
        </div>

        <!-- Romanization -->
        <div v-if="word.romanization?.length" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Romanization:</p>
            <div class="flex flex-wrap gap-2">
                <span v-for="rom in word.romanization" :key="rom"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                    {{ rom }}
                </span>
            </div>
        </div>

        <!-- Example Sentence -->
        <div v-if="word.exampleSentences?.length" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Example:</p>
            <p class="text-sm text-gray-700 dark:text-gray-300 italic">{{ word.exampleSentences[0] }}</p>
        </div>

        <div class="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Click for details</span>
            <div class="flex gap-1">
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
        </div>
    </div>
</template>