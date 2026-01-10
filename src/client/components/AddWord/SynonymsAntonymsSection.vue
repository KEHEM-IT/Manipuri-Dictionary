<template>
    <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Synonyms -->
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <i class="fas fa-equals text-green-600 dark:text-green-400"></i>
                    সমার্থক / Synonyms
                </h3>
                <button 
                    type="button" 
                    @click="addSynonym"
                    class="px-2 py-1 bg-green-600 dark:bg-green-500 text-white text-xs rounded hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
                    <i class="fas fa-plus"></i>
                </button>
            </div>

            <div v-for="(item, index) in modelValue.synonyms" :key="`syn-${index}`" class="flex gap-2">
                <input 
                    :value="item"
                    @input="updateSynonym(index, ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors text-sm"
                    placeholder="পেনি">
                <button 
                    v-if="modelValue.synonyms.length > 1" 
                    type="button"
                    @click="removeSynonym(index)"
                    class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        </div>

        <!-- Antonyms -->
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <i class="fas fa-not-equal text-red-600 dark:text-red-400"></i>
                    বিপরীত / Antonyms
                </h3>
                <button 
                    type="button" 
                    @click="addAntonym"
                    class="px-2 py-1 bg-red-600 dark:bg-red-500 text-white text-xs rounded hover:bg-red-700 dark:hover:bg-red-600 transition-colors">
                    <i class="fas fa-plus"></i>
                </button>
            </div>

            <div v-for="(item, index) in modelValue.antonyms" :key="`ant-${index}`" class="flex gap-2">
                <input 
                    :value="item"
                    @input="updateAntonym(index, ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-red-400 transition-colors text-sm"
                    placeholder="বিপরীত শব্দ">
                <button 
                    v-if="modelValue.antonyms.length > 1" 
                    type="button"
                    @click="removeAntonym(index)"
                    class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: {
        synonyms: string[];
        antonyms: string[];
    }
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const addSynonym = () => {
    emit('update:modelValue', {
        synonyms: [...props.modelValue.synonyms, '']
    });
};

const removeSynonym = (index: number) => {
    if (props.modelValue.synonyms.length > 1) {
        const newSynonyms = [...props.modelValue.synonyms];
        newSynonyms.splice(index, 1);
        emit('update:modelValue', { synonyms: newSynonyms });
    }
};

const updateSynonym = (index: number, value: string) => {
    const newSynonyms = [...props.modelValue.synonyms];
    newSynonyms[index] = value;
    emit('update:modelValue', { synonyms: newSynonyms });
};

const addAntonym = () => {
    emit('update:modelValue', {
        antonyms: [...props.modelValue.antonyms, '']
    });
};

const removeAntonym = (index: number) => {
    if (props.modelValue.antonyms.length > 1) {
        const newAntonyms = [...props.modelValue.antonyms];
        newAntonyms.splice(index, 1);
        emit('update:modelValue', { antonyms: newAntonyms });
    }
};

const updateAntonym = (index: number, value: string) => {
    const newAntonyms = [...props.modelValue.antonyms];
    newAntonyms[index] = value;
    emit('update:modelValue', { antonyms: newAntonyms });
};
</script>
