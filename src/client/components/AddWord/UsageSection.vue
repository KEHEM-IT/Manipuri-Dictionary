<template>
    <section class="space-y-4">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <i class="fas fa-chart-line text-blue-600 dark:text-blue-400"></i>
            ব্যবহার / Usage
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Commonness -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ব্যবহারের মাত্রা / Commonness
                </label>
                <select 
                    :value="modelValue.commonness"
                    @change="updateCommonness(($event.target as HTMLSelectElement).value)"
                    class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors">
                    <option value="">Select Commonness</option>
                    <option value="high">High (অতি প্রচলিত)</option>
                    <option value="medium">Medium (মাঝারি)</option>
                    <option value="low">Low (কম প্রচলিত)</option>
                    <option value="rare">Rare (বিরল)</option>
                </select>
            </div>

            <!-- Usage Mean -->
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ব্যবহারের অর্থ / Usage Meaning
                </label>
                <select 
                    :value="modelValue.usageMean"
                    @change="updateUsageMean(($event.target as HTMLSelectElement).value)"
                    class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors">
                    <option value="">Select Usage Mean</option>
                    <option value="positive">Positive (ইতিবাচক)</option>
                    <option value="neutral">Neutral (নিরপেক্ষ)</option>
                    <option value="negative">Negative (নেতিবাচক)</option>
                </select>
            </div>
        </div>

        <!-- Regions -->
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                অঞ্চল / Regions
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <label class="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                        type="checkbox"
                        :checked="modelValue.region.includes('Assam')"
                        @change="toggleRegion('Assam')"
                        class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Assam</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                        type="checkbox"
                        :checked="modelValue.region.includes('Tripura')"
                        @change="toggleRegion('Tripura')"
                        class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Tripura</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                        type="checkbox"
                        :checked="modelValue.region.includes('Manipur')"
                        @change="toggleRegion('Manipur')"
                        class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Manipur</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                        type="checkbox"
                        :checked="modelValue.region.includes('Bangladesh')"
                        @change="toggleRegion('Bangladesh')"
                        class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Bangladesh</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                        type="checkbox"
                        :checked="modelValue.region.includes('Meghalaya')"
                        @change="toggleRegion('Meghalaya')"
                        class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Meghalaya</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                        type="checkbox"
                        :checked="modelValue.region.includes('Mizoram')"
                        @change="toggleRegion('Mizoram')"
                        class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Mizoram</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                        type="checkbox"
                        :checked="modelValue.region.includes('Myanmar')"
                        @change="toggleRegion('Myanmar')"
                        class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Myanmar</span>
                </label>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: {
        commonness: string;
        usageMean: string;
        region: string[];
    }
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
}>();

const updateCommonness = (value: string) => {
    emit('update:modelValue', { commonness: value });
};

const updateUsageMean = (value: string) => {
    emit('update:modelValue', { usageMean: value });
};

const toggleRegion = (regionName: string) => {
    const currentRegions = [...props.modelValue.region];
    const index = currentRegions.indexOf(regionName);
    
    if (index > -1) {
        // Region exists, remove it
        currentRegions.splice(index, 1);
    } else {
        // Region doesn't exist, add it
        currentRegions.push(regionName);
    }
    
    emit('update:modelValue', { region: currentRegions });
};
</script>
