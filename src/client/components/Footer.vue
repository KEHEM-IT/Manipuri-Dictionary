<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4 py-8">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="text-center md:text-left">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        বিষ্ণুপ্রিয়া মণিপুরী অভিধান
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Preserving and promoting Bishnupriya Manipuri language
                    </p>
                </div>

                <div class="flex flex-col items-center gap-2">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Developed by
                    </p>
                    <a href="https://kehem.it" target="_blank" rel="noopener noreferrer"
                        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                        KEHEM IT
                    </a>
                </div>

                <div class="text-center md:text-right">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        © {{ currentYear }} All rights reserved
                    </p>
                    <div class="flex gap-4 mt-2 justify-center md:justify-end">
                        <a href="#"
                            class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                            About
                        </a>
                        <a href="#"
                            class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                            Contact
                        </a>
                        <a href="#"
                            class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                            Privacy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>
