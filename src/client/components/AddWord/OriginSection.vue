<template>
    <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <i class="fas fa-landmark text-blue-600 dark:text-blue-400"></i>
            উৎপত্তি / Origin
        </h2>

        <div class="space-y-4">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        সংস্কৃত শব্দ / Sanskrit Words
                    </label>
                    <button 
                        type="button" 
                        @click="addSanskrit"
                        class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                        <i class="fas fa-plus mr-1"></i>যোগ করিক
                    </button>
                </div>
                <div v-for="(item, index) in modelValue.সংস্কৃত" :key="`origin-${index}`" class="flex gap-2 mb-2">
                    <input 
                        :value="item"
                        @input="updateSanskrit(index, ($event.target as HTMLInputElement).value)"
                        type="text"
                        class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                        placeholder="জান্‌কা">
                    <button 
                        v-if="modelValue.সংস্কৃত.length > 1" 
                        type="button"
                        @click="removeSanskrit(index)"
                        class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    মূল অর্থ / Original Meaning
                </label>
                <input 
                    :value="modelValue.meaning"
                    @input="updateMeaning(($event.target as HTMLInputElement).value)"
                    type="text"
                    class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="ছোট থলে">
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: {
        সংস্কৃত: string[];
        meaning: string;
    }
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const addSanskrit = () => {
    emit('update:modelValue', {
        সংস্কৃত: [...props.modelValue.সংস্কৃত, '']
    });
};

const removeSanskrit = (index: number) => {
    if (props.modelValue.সংস্কৃত.length > 1) {
        const newSanskrit = [...props.modelValue.সংস্কৃত];
        newSanskrit.splice(index, 1);
        emit('update:modelValue', { সংস্কৃত: newSanskrit });
    }
};

const updateSanskrit = (index: number, value: string) => {
    const newSanskrit = [...props.modelValue.সংস্কৃত];
    newSanskrit[index] = value;
    emit('update:modelValue', { সংস্কৃত: newSanskrit });
};

const updateMeaning = (value: string) => {
    emit('update:modelValue', { meaning: value });
};
</script>
