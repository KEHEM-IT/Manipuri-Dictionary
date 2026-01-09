<!-- Location: frontend/src/components/LanguageToggle.vue -->
<script setup lang="ts">
import { Language, LanguageOption } from '../types';

defineProps<{
    modelValue: Language;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: Language): void;
}>();

const languages: LanguageOption[] = [
    { value: 'bishnupriya', label: 'Bishnupriya', nativeLabel: 'বিষ্ণুপ্রিয়া' },
    { value: 'bengali', label: 'Bengali', nativeLabel: 'বাংলা' },
    { value: 'english', label: 'English', nativeLabel: 'English' }
];

const handleChange = (value: Language) => {
    emit('update:modelValue', value);
};
</script>

<template>
    <div class="flex gap-2 flex-wrap">
        <button v-for="lang in languages" :key="lang.value" @click="handleChange(lang.value)" :class="[
            'px-4 py-2 rounded-lg font-medium transition-all',
            modelValue === lang.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]">
            {{ lang.nativeLabel }}
        </button>
    </div>
</template>