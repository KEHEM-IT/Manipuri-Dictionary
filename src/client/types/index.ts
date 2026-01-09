// Location: frontend/src/types/index.ts
export type Language = 'bpy' | 'bn' | 'en';

// Legacy type aliases for compatibility
export type LanguageOld = 'bishnupriya' | 'bengali' | 'english';

export interface Word {
    id: string;
    bpy: string;
    bn: string;
    en: string;
    sankrit?: string;
    romanization?: string[];
    'similar-prons'?: string[];
    meaning?: string[];
    discovered?: string[];
    description?: string;
    exampleSentences?: string[];
    phonetic?: {
        bpy?: string;
        bn?: string;
        en?: string;
    };
    synonyms?: string[];
    antonyms?: string[];
    IPA?: string;
    origin?: {
        [key: string]: string[] | string;
    };
    madoi?: boolean;
    rajar?: boolean;
    img?: string[];
    voice?: string[];
    cat?: string[];
    bpyDifferences?: {
        [key: string]: string[];
    };
    grammar?: {
        partOfSpeech?: string[];
        gender?: string;
        sandhi?: string;
        number?: {
            singular?: boolean;
            plural?: string;
        };
    };
    usage?: {
        commonness?: string;
        usageMean?: string;
        region?: string[];
    };
    references?: string[];
    similarBn?: string[];
    similarEn?: string[];
    similarSangkrit?: string[][];
}