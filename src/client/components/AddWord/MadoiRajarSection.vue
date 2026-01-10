<template>
    <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <i class="fas fa-check-square text-blue-600 dark:text-blue-400"></i>
            অতিরিক্ত তথ্য / Additional Info
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Madoi -->
            <div class="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                    <input 
                        type="checkbox"
                        :checked="modelValue.madoi === true"
                        @change="updateMadoiCheckbox(($event.target as HTMLInputElement).checked)"
                        class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Madoi (মাদৈ) - Same as BPY word
                    </label>
                </div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Different Madoi word (if not same)
                </label>
                <input 
                    :value="typeof modelValue.madoi === 'string' ? modelValue.madoi : ''"
                    @input="updateMadoi(($event.target as HTMLInputElement).value)"
                    :disabled="modelValue.madoi === true"
                    type="text"
                    class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    placeholder="মাদৈ শব্দ">
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Check box if Madoi word is same as BPY word, otherwise enter different word
                </p>
            </div>

            <!-- Rajar -->
            <div class="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                    <input 
                        type="checkbox"
                        :checked="modelValue.rajar === true"
                        @change="updateRajarCheckbox(($event.target as HTMLInputElement).checked)"
                        class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rajar (রাজার) - Same as BPY word
                    </label>
                </div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Different Rajar word (if not same)
                </label>
                <input 
                    :value="typeof modelValue.rajar === 'string' ? modelValue.rajar : ''"
                    @input="updateRajar(($event.target as HTMLInputElement).value)"
                    :disabled="modelValue.rajar === true"
                    type="text"
                    class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    placeholder="রাজার শব্দ">
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Check box if Rajar word is same as BPY word, otherwise enter different word
                </p>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: {
        madoi: boolean | string;
        rajar: boolean | string;
    }
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const updateMadoiCheckbox = (checked: boolean) => {
    if (checked) {
        emit('update:modelValue', { madoi: true });
    } else {
        emit('update:modelValue', { madoi: false });
    }
};

const updateMadoi = (value: string) => {
    if (value) {
        emit('update:modelValue', { madoi: value });
    } else {
        emit('update:modelValue', { madoi: false });
    }
};

const updateRajarCheckbox = (checked: boolean) => {
    if (checked) {
        emit('update:modelValue', { rajar: true });
    } else {
        emit('update:modelValue', { rajar: false });
    }
};

const updateRajar = (value: string) => {
    if (value) {
        emit('update:modelValue', { rajar: value });
    } else {
        emit('update:modelValue', { rajar: false });
    }
};
</script>
