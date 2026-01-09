<!-- Location: frontend/src/components/SearchBar.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    modelValue: string;
    placeholder?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'search'): void;
}>();

const localValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    localValue.value = newValue;
});

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    localValue.value = target.value;
    emit('update:modelValue', target.value);
};

const handleSearch = () => {
    emit('search');
};
</script>

<template>
    <div class="relative w-full">
        <input type="text" :value="localValue" @input="handleInput" @keyup.enter="handleSearch" autofocus
            :placeholder="placeholder || 'Search words...'"
            class="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors text-lg" />
        <button @click="handleSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-secondary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </button>
    </div>
</template>