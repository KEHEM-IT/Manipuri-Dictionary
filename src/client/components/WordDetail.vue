<!-- Location: frontend/src/components/WordDetail.vue -->
<script setup lang="ts">
import { Word } from '../types';

defineProps<{
    word: Word;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);

        if (lang === 'english') {
            utterance.lang = 'en-US';
        } else if (lang === 'bengali') {
            utterance.lang = 'bn-IN';
        } else {
            utterance.lang = 'bn-IN';
        }

        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }
};
</script>

<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="emit('close')">
        <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            @click.stop>
            <div class="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-3xl font-bold mb-2">{{ word.bpy }}</h2>
                        <p class="text-blue-100">{{ word.bn }} • {{ word.en }}</p>
                    </div>
                    <button @click="emit('close')"
                        class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="flex gap-2 mt-4 flex-wrap">
                    <span v-if="word.grammar?.partOfSpeech?.length" v-for="pos in word.grammar.partOfSpeech" :key="pos"
                        class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                        {{ pos }}
                    </span>
                    <span v-if="word.cat?.length" v-for="category in word.cat" :key="category"
                        class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                        {{ category }}
                    </span>
                    <span v-if="word.madoi" class="px-3 py-1 bg-green-400 bg-opacity-30 rounded-full text-sm">
                        মাদৈ
                    </span>
                    <span v-if="word.rajar" class="px-3 py-1 bg-purple-400 bg-opacity-30 rounded-full text-sm">
                        রাজার
                    </span>
                </div>
            </div>

            <div class="p-6 space-y-6">
                <!-- Description -->
                <div v-if="word.description" class="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
                        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Description
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ word.description }}</p>
                </div>

                <!-- Meaning -->
                <div v-if="word.meaning?.length" class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                    <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Meaning</h3>
                    <ul class="space-y-2">
                        <li v-for="(meaning, idx) in word.meaning" :key="idx"
                            class="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <span class="text-blue-600 dark:text-blue-400 font-bold">•</span>
                            <span>{{ meaning }}</span>
                        </li>
                    </ul>
                </div>

                <!-- Pronunciation Section -->
                <div v-if="word.phonetic || word.IPA"
                    class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                    <h3 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        Pronunciation
                    </h3>

                    <!-- IPA -->
                    <div v-if="word.IPA" class="bg-white dark:bg-gray-700 p-4 rounded-lg mb-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">IPA</p>
                        <p class="font-mono text-xl text-gray-800 dark:text-white">{{ word.IPA }}</p>
                    </div>

                    <!-- Phonetic -->
                    <div v-if="word.phonetic" class="grid md:grid-cols-3 gap-4">
                        <div v-if="word.phonetic.bpy" class="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Bishnupriya</p>
                            <div class="flex items-center justify-between">
                                <p class="font-mono text-lg text-gray-800 dark:text-white">{{ word.phonetic.bpy }}</p>
                                <button @click="speak(word.bpy, 'bishnupriya')"
                                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div v-if="word.phonetic.bn" class="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Bengali</p>
                            <div class="flex items-center justify-between">
                                <p class="font-mono text-lg text-gray-800 dark:text-white">{{ word.phonetic.bn }}</p>
                                <button @click="speak(word.bn, 'bengali')"
                                    class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div v-if="word.phonetic.en" class="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">English</p>
                            <div class="flex items-center justify-between">
                                <p class="font-mono text-lg text-gray-800 dark:text-white">{{ word.phonetic.en }}</p>
                                <button @click="speak(word.en, 'english')"
                                    class="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Similar Pronunciations -->
                    <div v-if="word['similar-prons']?.length"
                        class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Similar Pronunciations</p>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="pron in word['similar-prons']" :key="pron"
                                class="px-3 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm">
                                {{ pron }}
                            </span>
                        </div>
                    </div>

                    <!-- Romanization -->
                    <div v-if="word.romanization?.length"
                        class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Romanization</p>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="rom in word.romanization" :key="rom"
                                class="px-3 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm">
                                {{ rom }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Example Sentences -->
                <div v-if="word.exampleSentences?.length" class="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl">
                    <h3 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Example Sentences
                    </h3>
                    <div class="space-y-3">
                        <div v-for="(example, idx) in word.exampleSentences" :key="idx"
                            class="bg-white dark:bg-gray-700 p-4 rounded-lg border-l-4 border-amber-500">
                            <p class="text-lg font-medium text-gray-800 dark:text-white">{{ example }}</p>
                        </div>
                    </div>
                </div>

                <!-- Grammar Information -->
                <div v-if="word.grammar" class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                    <h3 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Grammar
                    </h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div v-if="word.grammar.gender" class="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Gender</p>
                            <p class="font-semibold text-gray-800 dark:text-white capitalize">{{ word.grammar.gender }}
                            </p>
                        </div>
                        <div v-if="word.grammar.number?.plural" class="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Plural Form</p>
                            <p class="font-semibold text-gray-800 dark:text-white">{{ word.grammar.number.plural }}</p>
                        </div>
                        <div v-if="word.grammar.sandhi" class="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Sandhi</p>
                            <p class="font-semibold text-gray-800 dark:text-white">{{ word.grammar.sandhi }}</p>
                        </div>
                    </div>
                </div>

                <!-- Origin -->
                <div v-if="word.origin || word.sankrit" class="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                        <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Origin
                    </h3>
                    <div v-if="word.sankrit" class="bg-white dark:bg-gray-700 p-4 rounded-lg mb-3">
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Sanskrit</p>
                        <p class="text-lg font-semibold text-gray-800 dark:text-white">{{ word.sankrit }}</p>
                    </div>
                    <div v-if="word.origin">
                        <div v-for="(value, key) in word.origin" :key="key"
                            class="bg-white dark:bg-gray-700 p-4 rounded-lg mb-2">
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ key }}</p>
                            <p class="text-gray-800 dark:text-white">
                                {{ Array.isArray(value) ? value.join(', ') : value }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Usage Information -->
                <div v-if="word.usage" class="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Usage Information</h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div v-if="word.usage.commonness" class="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Commonness</p>
                            <p class="font-semibold text-gray-800 dark:text-white capitalize">{{ word.usage.commonness
                                }}</p>
                        </div>
                        <div v-if="word.usage.usageMean" class="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Usage Mean</p>
                            <p class="font-semibold text-gray-800 dark:text-white capitalize">{{ word.usage.usageMean }}
                            </p>
                        </div>
                        <div v-if="word.usage.region?.length" class="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Regions</p>
                            <div class="flex flex-wrap gap-1">
                                <span v-for="region in word.usage.region" :key="region"
                                    class="px-2 py-1 bg-indigo-200 dark:bg-indigo-700 text-indigo-900 dark:text-indigo-100 rounded text-xs">
                                    {{ region }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Similar Words & Synonyms -->
                <div class="grid md:grid-cols-2 gap-6">
                    <div v-if="word.synonyms?.length" class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                        <h3 class="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-300">Synonyms</h3>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="syn in word.synonyms" :key="syn"
                                class="px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-100 rounded-full text-sm">
                                {{ syn }}
                            </span>
                        </div>
                    </div>

                    <div v-if="word.antonyms?.length" class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">
                        <h3 class="text-lg font-semibold mb-3 text-red-800 dark:text-red-300">Antonyms</h3>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="ant in word.antonyms" :key="ant"
                                class="px-3 py-1 bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100 rounded-full text-sm">
                                {{ ant }}
                            </span>
                        </div>
                    </div>

                    <div v-if="word.similarBn?.length" class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                        <h3 class="text-lg font-semibold mb-3 text-green-800 dark:text-green-300">Similar (Bengali)</h3>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="similar in word.similarBn" :key="similar"
                                class="px-3 py-1 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 rounded-full text-sm">
                                {{ similar }}
                            </span>
                        </div>
                    </div>

                    <div v-if="word.similarEn?.length" class="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                        <h3 class="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-300">Similar (English)
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="similar in word.similarEn" :key="similar"
                                class="px-3 py-1 bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-100 rounded-full text-sm">
                                {{ similar }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Sanskrit Similar Words -->
                <div v-if="word.similarSangkrit?.length" class="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                    <h3 class="text-lg font-semibold mb-3 text-orange-800 dark:text-orange-300">Similar (Sanskrit)</h3>
                    <div class="space-y-2">
                        <div v-for="(similar, idx) in word.similarSangkrit" :key="idx"
                            class="px-3 py-2 bg-white dark:bg-gray-700 text-orange-800 dark:text-orange-200 rounded-lg text-sm">
                            {{ similar[0] }} <span class="text-xs opacity-70">({{ similar[1] }})</span>
                        </div>
                    </div>
                </div>

                <!-- Bishnupriya Differences -->
                <div v-if="word.bpyDifferences" class="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Regional Differences</h3>
                    <div class="space-y-3">
                        <div v-for="(value, key) in word.bpyDifferences" :key="key"
                            class="bg-white dark:bg-gray-700 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Variant {{ key }}</p>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="variant in value" :key="variant"
                                    class="px-3 py-1 bg-indigo-200 dark:bg-indigo-700 text-indigo-900 dark:text-indigo-100 rounded-lg text-sm">
                                    {{ variant }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- References -->
                <div v-if="word.references?.length" class="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                    <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-white">References</h3>
                    <ul class="space-y-2">
                        <li v-for="ref in word.references" :key="ref">
                            <a :href="ref" target="_blank" rel="noopener noreferrer"
                                class="text-blue-600 dark:text-blue-400 hover:underline break-all text-sm">
                                {{ ref }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>