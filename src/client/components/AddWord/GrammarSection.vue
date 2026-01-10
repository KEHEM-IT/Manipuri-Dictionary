<template>
    <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <i class="fas fa-book text-blue-600 dark:text-blue-400"></i>
            ব্যাকরণ / Grammar
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Part of Speech -->
            <div>
                <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        পদ / Part of Speech
                    </label>
                    <button 
                        type="button" 
                        @click="addPartOfSpeech"
                        class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div v-for="(item, index) in modelValue.partOfSpeech" :key="`pos-${index}`" class="flex gap-2 mb-2">
                    <select
                        :value="item"
                        @change="updatePartOfSpeech(index, ($event.target as HTMLSelectElement).value)"
                        class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm">
                        <option value="">Select Part of Speech</option>
                        <option value="বিশেষ্য">বিশেষ্য (Noun)</option>
                        <option value="সর্বনাম">সর্বনাম (Pronoun)</option>
                        <option value="বিশেষণ">বিশেষণ (Adjective)</option>
                        <option value="ক্রিয়া">ক্রিয়া (Verb)</option>
                        <option value="ক্রিয়া বিশেষণ">ক্রিয়া বিশেষণ (Adverb)</option>
                        <option value="অব্যয়">অব্যয় (Particle/Indeclinable)</option>
                        <option value="যোজক">যোজক (Conjunction)</option>
                        <option value="আবেগ শব্দ">আবেগ শব্দ (Interjection)</option>
                        <option value="অনুসর্গ">অনুসর্গ (Postposition)</option>
                    </select>
                    <button 
                        v-if="modelValue.partOfSpeech.length > 1" 
                        type="button"
                        @click="removePartOfSpeech(index)"
                        class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            </div>

            <!-- Gender -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    লিঙ্গ / Gender
                </label>
                <select 
                    :value="modelValue.gender"
                    @change="updateGender(($event.target as HTMLSelectElement).value)"
                    class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors">
                    <option value="">Select Gender</option>
                    <option value="পুংলিঙ্গ">পুংলিঙ্গ (Masculine)</option>
                    <option value="স্ত্রী">স্ত্রী (Feminine)</option>
                    <option value="ক্লীব">ক্লীব (Neuter)</option>
                </select>
            </div>

            <!-- Sandhi -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    সন্ধি / Sandhi
                </label>
                <input 
                    :value="modelValue.sandhi"
                    @input="updateSandhi(($event.target as HTMLInputElement).value)"
                    type="text"
                    class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="জা+কা">
            </div>

            <!-- Number (Singular & Plural) -->
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    সংখ্যা / Number
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Singular -->
                    <div class="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3">
                        <div class="flex items-center gap-2 mb-2">
                            <input 
                                type="checkbox"
                                :checked="modelValue.number.singular"
                                @change="updateSingularCheckbox(($event.target as HTMLInputElement).checked)"
                                class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                একবচন / Singular
                            </label>
                        </div>
                        <input 
                            :value="typeof modelValue.number.singular === 'string' ? modelValue.number.singular : ''"
                            @input="updateSingular(($event.target as HTMLInputElement).value)"
                            :disabled="modelValue.number.singular === true"
                            type="text"
                            class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="জাকা">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Check if word is already in singular form, or enter custom form
                        </p>
                    </div>

                    <!-- Plural -->
                    <div class="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3">
                        <div class="flex items-center gap-2 mb-2">
                            <input 
                                type="checkbox"
                                :checked="modelValue.number.plural === true"
                                @change="updatePluralCheckbox(($event.target as HTMLInputElement).checked)"
                                class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                বহুবচন / Plural
                            </label>
                        </div>
                        <input 
                            :value="typeof modelValue.number.plural === 'string' ? modelValue.number.plural : ''"
                            @input="updatePlural(($event.target as HTMLInputElement).value)"
                            :disabled="modelValue.number.plural === true"
                            type="text"
                            class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="জাকাগি">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Check if word is already in plural form, or enter custom form
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: {
        partOfSpeech: string[];
        gender: string;
        sandhi: string;
        number: {
            singular: boolean | string;
            plural: boolean | string;
        }
    }
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const addPartOfSpeech = () => {
    emit('update:modelValue', {
        partOfSpeech: [...props.modelValue.partOfSpeech, '']
    });
};

const removePartOfSpeech = (index: number) => {
    if (props.modelValue.partOfSpeech.length > 1) {
        const newPartOfSpeech = [...props.modelValue.partOfSpeech];
        newPartOfSpeech.splice(index, 1);
        emit('update:modelValue', { partOfSpeech: newPartOfSpeech });
    }
};

const updatePartOfSpeech = (index: number, value: string) => {
    const newPartOfSpeech = [...props.modelValue.partOfSpeech];
    newPartOfSpeech[index] = value;
    emit('update:modelValue', { partOfSpeech: newPartOfSpeech });
};

const updateGender = (value: string) => {
    emit('update:modelValue', { gender: value });
};

const updateSandhi = (value: string) => {
    emit('update:modelValue', { sandhi: value });
};

const updateSingularCheckbox = (checked: boolean) => {
    if (checked) {
        emit('update:modelValue', {
            number: { singular: true }
        });
    } else {
        emit('update:modelValue', {
            number: { singular: '' }
        });
    }
};

const updateSingular = (value: string) => {
    if (value) {
        emit('update:modelValue', {
            number: { singular: value }
        });
    } else {
        emit('update:modelValue', {
            number: { singular: '' }
        });
    }
};

const updatePluralCheckbox = (checked: boolean) => {
    if (checked) {
        emit('update:modelValue', {
            number: { plural: true }
        });
    } else {
        emit('update:modelValue', {
            number: { plural: '' }
        });
    }
};

const updatePlural = (value: string) => {
    if (value) {
        emit('update:modelValue', {
            number: { plural: value }
        });
    } else {
        emit('update:modelValue', {
            number: { plural: '' }
        });
    }
};
</script>
