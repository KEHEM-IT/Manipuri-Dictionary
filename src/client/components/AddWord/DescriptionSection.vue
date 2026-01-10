<template>
    <section class="space-y-4">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <i class="fas fa-align-left text-blue-600 dark:text-blue-400"></i>
            বর্ণনা / Description
        </h3>
        <textarea 
            :value="modelValue"
            @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
            rows="4"
            class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
            placeholder="শব্দর বিস্তারিত বর্ণনা লিখিক..."></textarea>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped>
textarea {
    max-width: 100%;
    box-sizing: border-box;
}
</style>
