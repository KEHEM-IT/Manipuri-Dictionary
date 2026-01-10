<template>
    <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <i class="fas fa-link text-blue-600 dark:text-blue-400"></i>
            সম্পর্কিত শব্দ / Similar Words
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Similar Bengali -->
            <div>
                <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        সম্পর্কিত বাংলা শব্দ
                    </label>
                    <button 
                        type="button" 
                        @click="addSimilarBn"
                        class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div v-for="(item, index) in similarBn" :key="`simBn-${index}`" class="flex gap-2 mb-2">
                    <input 
                        :value="item"
                        @input="updateSimilarBn(index, ($event.target as HTMLInputElement).value)"
                        type="text"
                        class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                        placeholder="থলি">
                    <button 
                        v-if="similarBn.length > 1" 
                        type="button"
                        @click="removeSimilarBn(index)"
                        class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            </div>

            <!-- Similar English -->
            <div>
                <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Similar English
                    </label>
                    <button 
                        type="button" 
                        @click="addSimilarEn"
                        class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div v-for="(item, index) in similarEn" :key="`simEn-${index}`" class="flex gap-2 mb-2">
                    <input 
                        :value="item"
                        @input="updateSimilarEn(index, ($event.target as HTMLInputElement).value)"
                        type="text"
                        class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                        placeholder="bag">
                    <button 
                        v-if="similarEn.length > 1" 
                        type="button"
                        @click="removeSimilarEn(index)"
                        class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            </div>

            <!-- Similar Sanskrit -->
            <div>
                <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        সম্পর্কিত সংস্কৃত শব্দ
                    </label>
                    <button 
                        type="button" 
                        @click="addSimilarSangkrit"
                        class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div v-for="(item, index) in similarSangkrit" :key="`simSan-${index}`" class="flex flex-wrap gap-2 mb-2">
                    <input 
                        :value="item[0]"
                        @input="updateSimilarSangkrit(index, 0, ($event.target as HTMLInputElement).value)"
                        type="text"
                        class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                        placeholder="जालिका">
                    <input 
                        :value="item[1]"
                        @input="updateSimilarSangkrit(index, 1, ($event.target as HTMLInputElement).value)"
                        type="text"
                        class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                        placeholder="Jālika">
                    <button 
                        v-if="similarSangkrit.length > 1" 
                        type="button"
                        @click="removeSimilarSangkrit(index)"
                        class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    similarBn: string[];
    similarEn: string[];
    similarSangkrit: string[][];
}>();

const emit = defineEmits<{
    (e: 'update:similarBn', value: string[]): void;
    (e: 'update:similarEn', value: string[]): void;
    (e: 'update:similarSangkrit', value: string[][]): void;
}>();

// Similar Bengali
const addSimilarBn = () => {
    emit('update:similarBn', [...props.similarBn, '']);
};

const removeSimilarBn = (index: number) => {
    if (props.similarBn.length > 1) {
        const newSimilarBn = [...props.similarBn];
        newSimilarBn.splice(index, 1);
        emit('update:similarBn', newSimilarBn);
    }
};

const updateSimilarBn = (index: number, value: string) => {
    const newSimilarBn = [...props.similarBn];
    newSimilarBn[index] = value;
    emit('update:similarBn', newSimilarBn);
};

// Similar English
const addSimilarEn = () => {
    emit('update:similarEn', [...props.similarEn, '']);
};

const removeSimilarEn = (index: number) => {
    if (props.similarEn.length > 1) {
        const newSimilarEn = [...props.similarEn];
        newSimilarEn.splice(index, 1);
        emit('update:similarEn', newSimilarEn);
    }
};

const updateSimilarEn = (index: number, value: string) => {
    const newSimilarEn = [...props.similarEn];
    newSimilarEn[index] = value;
    emit('update:similarEn', newSimilarEn);
};

// Similar Sanskrit
const addSimilarSangkrit = () => {
    emit('update:similarSangkrit', [...props.similarSangkrit, ['', '']]);
};

const removeSimilarSangkrit = (index: number) => {
    if (props.similarSangkrit.length > 1) {
        const newSimilarSangkrit = [...props.similarSangkrit];
        newSimilarSangkrit.splice(index, 1);
        emit('update:similarSangkrit', newSimilarSangkrit);
    }
};

const updateSimilarSangkrit = (index: number, subIndex: number, value: string) => {
    const newSimilarSangkrit = [...props.similarSangkrit];
    newSimilarSangkrit[index] = [...newSimilarSangkrit[index]];
    newSimilarSangkrit[index][subIndex] = value;
    emit('update:similarSangkrit', newSimilarSangkrit);
};
</script>
