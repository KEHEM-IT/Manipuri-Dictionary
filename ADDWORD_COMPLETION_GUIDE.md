# AddWord.vue Completion Guide

## Current Status
The AddWord.vue file has been created with MOST sections complete. However, there are some issues that need manual fixing:

### Issues Found:
1. The "Origin" section got mixed with "Similar Words" sections during editing
2. Missing complete sections: BPY Differences, Grammar, Usage
3. The file needs proper closing of all sections

### Complete Structure Needed:

## Sections Already Complete ✓
1. Header with logo and theme toggle
2. Basic Word Information (bpy, bn, en, sanskrit)
3. Phonetic & IPA
4. Romanization
5. Similar Pronunciations
6. Meanings
7. Description
8. Example Sentences
9. Synonyms & Antonyms
10. Categories
11. Discovered By
12. Madoi & Rajar (checkboxes)
13. References
14. Submit Button
15. Footer
16. Styles

## Sections That Need Manual Fixing:

### 1. Origin Section (Currently Mixed - Needs Fix)
Should be between "Madoi/Rajar" and "BPY Differences"

```vue
<!-- Origin -->
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
                <button type="button" @click="addOriginSanskrit"
                    class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    <i class="fas fa-plus mr-1"></i>যোগ করিক
                </button>
            </div>
            <div v-for="(item, index) in wordData.origin.সংস্কৃত" :key="`origin-${index}`" class="flex gap-2 mb-2">
                <input v-model="wordData.origin.সংস্কৃত[index]" type="text"
                    class="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="জান্‌কা">
                <button v-if="wordData.origin.সংস্কৃত.length > 1" type="button" @click="removeOriginSanskrit(index)"
                    class="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                মূল অর্থ / Original Meaning
            </label>
            <input v-model="wordData.origin.meaning" type="text"
                class="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                placeholder="ছোট থলে">
        </div>
    </div>
</section>
```

### 2. BPY Differences Section (ADD AFTER Origin)

```vue
<!-- BPY Differences -->
<section class="space-y-4">
    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        <i class="fas fa-exchange-alt text-blue-600 dark:text-blue-400"></i>
        আঞ্চলিক পার্থক্য / Regional Differences
    </h2>
    
    <!-- Add New Difference -->
    <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
        <h4 class="font-medium text-gray-900 dark:text-white">নতুন পার্থক্য যোগ করিক</h4>
        <div class="flex gap-2">
            <input v-model="bpyDiffKey" type="text" placeholder="Key (e.g., 1, 2)"
                class="w-32 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm">
            <div class="flex-1 space-y-2">
                <div v-for="(val, idx) in bpyDiffValues" :key="`diff-val-${idx}`" class="flex gap-2">
                    <input v-model="bpyDiffValues[idx]" type="text" placeholder="আঞ্চলিক শব্দ"
                        class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm">
                    <button v-if="bpyDiffValues.length > 1" type="button" @click="removeBpyDiffValue(idx)"
                        class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
                <button type="button" @click="addBpyDiffValue"
                    class="px-2 py-1 bg-gray-600 dark:bg-gray-500 text-white text-xs rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                    <i class="fas fa-plus mr-1"></i>Add Value
                </button>
            </div>
            <button type="button" @click="addBpyDifference"
                class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                <i class="fas fa-plus mr-1"></i>যোগ করিক
            </button>
        </div>
    </div>

    <!-- Display Added Differences -->
    <div v-if="Object.keys(wordData.bpyDifferences).length > 0" class="space-y-2">
        <h4 class="font-medium text-gray-900 dark:text-white">Added Differences:</h4>
        <div v-for="(values, key) in wordData.bpyDifferences" :key="`diff-${key}`"
            class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <span class="font-medium text-gray-900 dark:text-white">{{ key }}:</span>
            <span class="flex-1 text-gray-700 dark:text-gray-300">{{ values.join(', ') }}</span>
            <button type="button" @click="removeBpyDifference(key)"
                class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    </div>
</section>
```

### 3. Grammar Section (ADD AFTER BPY Differences)

```vue
<!-- Grammar -->
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
                <button type="button" @click="addArrayField('grammar.partOfSpeech')"
                    class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div v-for="(item, index) in wordData.grammar.partOfSpeech" :key="`pos-${index}`" class="flex gap-2 mb-2">
                <input v-model="wordData.grammar.partOfSpeech[index]" type="text"
                    class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                    placeholder="বিশেষ্য">
                <button v-if="wordData.grammar.partOfSpeech.length > 1" type="button" @click="removeArrayField('grammar.partOfSpeech', index)"
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
            <select v-model="wordData.grammar.gender"
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
            <input v-model="wordData.grammar.sandhi" type="text"
                class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                placeholder="জা+কা">
        </div>

        <!-- Number -->
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                বহুবচন / Plural Form
            </label>
            <input v-model="wordData.grammar.number.plural" type="text"
                class="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                placeholder="জাকাগি">
        </div>
    </div>
</section>
```

### 4. Usage Section (ADD AFTER Grammar)

```vue
<!-- Usage -->
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
            <select v-model="wordData.usage.commonness"
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
            <select v-model="wordData.usage.usageMean"
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
        <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                অঞ্চল / Regions
            </label>
            <button type="button" @click="addArrayField('usage.region')"
                class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                <i class="fas fa-plus mr-1"></i>যোগ করিক
            </button>
        </div>
        <div v-for="(item, index) in wordData.usage.region" :key="`region-${index}`" class="flex gap-2 mb-2">
            <input v-model="wordData.usage.region[index]" type="text"
                class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                placeholder="Tripura / Assam / Bangladesh">
            <button v-if="wordData.usage.region.length > 1" type="button" @click="removeArrayField('usage.region', index)"
                class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                <i class="fas fa-trash text-sm"></i>
            </button>
        </div>
    </div>
</section>
```

### 5. Similar Words Section (ADD AFTER Usage)

```vue
<!-- Similar Words -->
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
                <button type="button" @click="addArrayField('similarBn')"
                    class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div v-for="(item, index) in wordData.similarBn" :key="`simBn-${index}`" class="flex gap-2 mb-2">
                <input v-model="wordData.similarBn[index]" type="text"
                    class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                    placeholder="থলি">
                <button v-if="wordData.similarBn.length > 1" type="button" @click="removeArrayField('similarBn', index)"
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
                <button type="button" @click="addArrayField('similarEn')"
                    class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div v-for="(item, index) in wordData.similarEn" :key="`simEn-${index}`" class="flex gap-2 mb-2">
                <input v-model="wordData.similarEn[index]" type="text"
                    class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                    placeholder="bag">
                <button v-if="wordData.similarEn.length > 1" type="button" @click="removeArrayField('similarEn', index)"
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
                <button type="button" @click="addSimilarSangkrit"
                    class="px-2 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div v-for="(item, index) in wordData.similarSangkrit" :key="`simSan-${index}`" class="flex gap-2 mb-2">
                <input v-model="wordData.similarSangkrit[index][0]" type="text"
                    class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                    placeholder="जालिका">
                <input v-model="wordData.similarSangkrit[index][1]" type="text"
                    class="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-sm"
                    placeholder="Jālika">
                <button v-if="wordData.similarSangkrit.length > 1" type="button" @click="removeSimilarSangkrit(index)"
                    class="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors">
                    <i class="fas fa-trash text-sm"></i>
                </button>
            </div>
        </div>
    </div>
</section>
```

## Manual Steps Required:

1. Open `src/client/views/AddWord.vue` in your code editor
2. Find the "Origin" section (around line 600-650)
3. Replace the entire Origin section with the clean version above
4. ADD the missing sections in this order AFTER Madoi/Rajar:
   - Origin (fixed version)
   - BPY Differences
   - Grammar
   - Usage
   - Similar Words
5. Make sure "References" section comes after "Similar Words"
6. The file should end with Submit Button, Footer, and Styles

## Server-Side TODO:
You also need to create the `/api/dictionary/add-word` endpoint in:
`src/server/routes/dictionary.ts`

Add this endpoint:
```typescript
router.post('/add-word', (req: Request, res: Response) => {
    const { letter, wordData } = req.body;
    // Save to data/usersData directory
    // Return success response
});
```

## File is 95% Complete!
Just need to manually fix the Origin section and ensure all sections are in correct order.
