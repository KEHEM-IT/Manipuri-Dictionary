<template>
    <section class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <i :class="`fas ${icon} text-blue-600 dark:text-blue-400`"></i>
                {{ title }}
            </h3>
            <button 
                type="button" 
                @click="addField"
                class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                <i class="fas fa-plus mr-1"></i>যোগ করিক
            </button>
        </div>

        <div v-for="(item, index) in modelValue" :key="`${fieldName}-${index}`" class="flex gap-2">
            <input 
                :value="item"
                @input="updateItem(index, ($event.target as HTMLInputElement).value)"
                :type="inputType"
                class="flex-1 min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                :placeholder="placeholder">
            <button 
                v-if="modelValue.length > 1" 
                type="button"
                @click="removeField(index)"
                class="flex-shrink-0 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string[];
    title: string;
    icon: string;
    placeholder: string;
    fieldName: string;
    inputType?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void;
}>();

const inputType = props.inputType || 'text';

const addField = () => {
    emit('update:modelValue', [...props.modelValue, '']);
};

const removeField = (index: number) => {
    if (props.modelValue.length > 1) {
        const newValue = [...props.modelValue];
        newValue.splice(index, 1);
        emit('update:modelValue', newValue);
    }
};

const updateItem = (index: number, value: string) => {
    const newValue = [...props.modelValue];
    newValue[index] = value;
    emit('update:modelValue', newValue);
};
</script>

<style scoped>
input[type="text"],
input[type="url"] {
    max-width: 100%;
    box-sizing: border-box;
}

.flex > input {
    min-width: 0;
}
</style>
