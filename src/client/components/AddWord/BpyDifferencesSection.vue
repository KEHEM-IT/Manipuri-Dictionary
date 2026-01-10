<template>
    <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <i class="fas fa-exchange-alt text-blue-600 dark:text-blue-400"></i>
            আঞ্চলিক পার্থক্য / Regional Differences
        </h2>

        <!-- Add New Difference -->
        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <h4 class="font-medium text-gray-900 dark:text-white">নতুন পার্থক্য যোগ করিক</h4>
            <div class="flex gap-2">
                <input 
                    v-model="localKey" 
                    type="text" 
                    placeholder="Key (e.g., 1, 2)"
                    class="w-32 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm">
                <div class="flex-1 space-y-2">
                    <div v-for="(val, idx) in localValues" :key="`diff-val-${idx}`" class="flex gap-2">
                        <input 
                            v-model="localValues[idx]" 
                            type="text" 
                            placeholder="আঞ্চলিক শব্দ"
                            class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm">
                        <button 
                            v-if="localValues.length > 1" 
                            type="button"
                            @click="removeLocalValue(idx)"
                            class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                    <button 
                        type="button" 
                        @click="addLocalValue"
                        class="px-2 py-1 bg-gray-600 dark:bg-gray-500 text-white text-xs rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                        <i class="fas fa-plus mr-1"></i>Add Value
                    </button>
                </div>
                <button 
                    type="button" 
                    @click="addDifference"
                    class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    <i class="fas fa-plus mr-1"></i>যোগ করিক
                </button>
            </div>
        </div>

        <!-- Display Added Differences -->
        <div v-if="Object.keys(modelValue).length > 0" class="space-y-2">
            <h4 class="font-medium text-gray-900 dark:text-white">Added Differences:</h4>
            <div v-for="(values, key) in modelValue" :key="`diff-${key}`" class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <span class="font-medium text-gray-900 dark:text-white">{{ key }}:</span>
                <span class="flex-1 text-gray-700 dark:text-gray-300">{{ values.join(', ') }}</span>
                <button 
                    type="button" 
                    @click="removeDifference(key)"
                    class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    modelValue: Record<string, string[]>;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: Record<string, string[]>): void;
    (e: 'update:localKey', value: string): void;
    (e: 'update:localValues', value: string[]): void;
}>();

const localKey = ref('');
const localValues = ref(['']);

const addLocalValue = () => {
    localValues.value.push('');
};

const removeLocalValue = (index: number) => {
    if (localValues.value.length > 1) {
        localValues.value.splice(index, 1);
    }
};

const addDifference = () => {
    if (localKey.value && localValues.value.some(v => v.trim())) {
        const newDifferences = { ...props.modelValue };
        newDifferences[localKey.value] = [...localValues.value];
        emit('update:modelValue', newDifferences);
        localKey.value = '';
        localValues.value = [''];
    }
};

const removeDifference = (key: string) => {
    const newDifferences = { ...props.modelValue };
    delete newDifferences[key];
    emit('update:modelValue', newDifferences);
};
</script>
