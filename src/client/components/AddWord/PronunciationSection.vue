<template>
    <section class="space-y-4">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <i class="fas fa-volume-up text-blue-600 dark:text-blue-400"></i>
            উচ্চারণ / Pronunciation
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div class="w-full">
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IPA
                </label>
                <input 
                    :value="modelValue.IPA"
                    @input="updateField('IPA', ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="/d͡ʒɑkɑ/">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phonetic (BPY)
                </label>
                <input 
                    :value="modelValue.phonetic.bpy"
                    @input="updatePhonetic('bpy', ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="jaka">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phonetic (BN)
                </label>
                <input 
                    :value="modelValue.phonetic.bn"
                    @input="updatePhonetic('bn', ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="jhuri">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phonetic (EN)
                </label>
                <input 
                    :value="modelValue.phonetic.en"
                    @input="updatePhonetic('en', ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="basket">
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: {
        IPA: string;
        phonetic: {
            bpy: string;
            bn: string;
            en: string;
        }
    }
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const updateField = (field: string, value: string) => {
    emit('update:modelValue', { [field]: value });
};

const updatePhonetic = (lang: string, value: string) => {
    emit('update:modelValue', { 
        phonetic: { [lang]: value }
    });
};
</script>
