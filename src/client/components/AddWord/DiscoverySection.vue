<template>
    <section class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <i class="fas fa-user-astronaut text-blue-600 dark:text-blue-400"></i>
            আবিষ্কার তথ্য / Discovery Information
        </h3>

        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                আবিষ্কারক / Discovered By
            </label>
            <textarea 
                :value="modelValue"
                @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
                rows="4"
                class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-vertical"
                placeholder="আবিষ্কারকর নাম আর তথ্য লিখিক...
Example: জন ডো, ২০২৩ সালে আবিষ্কার করা হয়েছে"></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the name(s) of the discoverer(s) and any relevant discovery information
            </p>
        </div>
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
