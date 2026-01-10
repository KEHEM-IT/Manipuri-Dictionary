<template>
    <section class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            <i class="fas fa-tags text-blue-600 dark:text-blue-400"></i>
            শ্রেণী / Categories
        </h3>

        <!-- Predefined Categories with Checkboxes -->
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                প্রচলিত শ্রেণী / Common Categories
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <label v-for="category in predefinedCategories" :key="category" 
                    class="flex items-center gap-2 cursor-pointer p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input 
                        type="checkbox"
                        :checked="modelValue.includes(category)"
                        @change="toggleCategory(category)"
                        class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ category }}</span>
                </label>
            </div>
        </div>

        <!-- Custom Categories -->
        <div>
            <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    নতুন শ্রেণী যোগ করিক / Add Custom Categories
                </label>
                <button 
                    type="button" 
                    @click="addCustomCategory"
                    class="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    <i class="fas fa-plus mr-1"></i>যোগ করিক
                </button>
            </div>
            
            <div v-for="(customCat, index) in customCategories" :key="`custom-${index}`" class="flex gap-2 mb-2">
                <input 
                    :value="customCat"
                    @input="updateCustomCategory(index, ($event.target as HTMLInputElement).value)"
                    type="text"
                    class="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="নতুন শ্রেণী লিখিক">
                <button 
                    type="button"
                    @click="removeCustomCategory(index)"
                    class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    modelValue: string[];
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void;
}>();

// Predefined categories in Bishnupriya Manipuri and English
const predefinedCategories = [
    'পাত্র',           // Utensils/Containers
    'খাদ্য',          // Food
    'প্রাণী',         // Animals
    'গাছ',            // Trees/Plants
    'ফুল',            // Flowers
    'ফল',             // Fruits
    'সবজি',           // Vegetables
    'পরিবার',         // Family
    'শরীর',           // Body
    'রং',             // Colors
    'সংখ্যা',          // Numbers
    'সময়',            // Time
    'আবহাওয়া',        // Weather
    'ক্রীড়া',         // Sports
    'পোশাক',          // Clothing
    'গহনা',           // Jewelry
    'বাড়ি',           // House
    'আসবাবপত্র',       // Furniture
    'যানবাহন',         // Vehicles
    'পেশা',           // Profession/Occupation
    'শিক্ষা',          // Education
    'ধর্ম',            // Religion
    'উৎসব',           // Festival
    'সঙ্গীত',          // Music
    'যন্ত্র',          // Instruments/Tools
    'ভূগোল',          // Geography
    'দিক',            // Direction
    'প্রকৃতি',         // Nature
    'পাখি',           // Birds
    'মাছ',            // Fish
    'কীটপতঙ্গ',        // Insects
    'রান্না',          // Cooking
    'খেলা',           // Games
    'আবেগ',           // Emotions
    'রোগ',            // Disease
    'ঔষধ',            // Medicine
];

// Separate predefined and custom categories
const customCategories = computed(() => {
    return props.modelValue.filter(cat => !predefinedCategories.includes(cat));
});

const toggleCategory = (category: string) => {
    const currentCategories = [...props.modelValue];
    const index = currentCategories.indexOf(category);
    
    if (index > -1) {
        // Category exists, remove it
        currentCategories.splice(index, 1);
    } else {
        // Category doesn't exist, add it
        currentCategories.push(category);
    }
    
    emit('update:modelValue', currentCategories);
};

const addCustomCategory = () => {
    emit('update:modelValue', [...props.modelValue, '']);
};

const removeCustomCategory = (index: number) => {
    const customCats = customCategories.value;
    const categoryToRemove = customCats[index];
    const newCategories = props.modelValue.filter(cat => cat !== categoryToRemove);
    emit('update:modelValue', newCategories);
};

const updateCustomCategory = (index: number, value: string) => {
    const customCats = customCategories.value;
    const oldValue = customCats[index];
    const newCategories = props.modelValue.map(cat => cat === oldValue ? value : cat);
    emit('update:modelValue', newCategories);
};
</script>
