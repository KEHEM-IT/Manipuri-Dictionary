<template>
    <section class="space-y-4">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <i class="fas fa-language text-blue-600 dark:text-blue-400"></i>
            শব্দর তথ্য / Basic Information
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div class="w-full">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    বিষ্ণুপ্রিয়া মণিপুরী *
                </label>
                <input 
                    :value="bpy"
                    @input="emit('update:bpy', ($event.target as HTMLInputElement).value)"
                    type="text" 
                    required
                    class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="শব্দ লিখিক">
            </div>
            <div class="w-full">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    বাংলা
                </label>
                <input 
                    :value="bn"
                    @input="emit('update:bn', ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="শব্দ লিখুন">
            </div>
            <div class="w-full">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    English
                </label>
                <input 
                    :value="en"
                    @input="emit('update:en', ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="Write word">
            </div>
            <div class="w-full">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sanskrit / সংস্কৃত
                </label>
                <input 
                    :value="sankrit"
                    @input="emit('update:sankrit', ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="जान्का (Jānka)">
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    bpy: string;
    bn: string;
    en: string;
    sankrit: string;
}>();

const emit = defineEmits<{
    (e: 'update:bpy', value: string): void;
    (e: 'update:bn', value: string): void;
    (e: 'update:en', value: string): void;
    (e: 'update:sankrit', value: string): void;
}>();
</script>
