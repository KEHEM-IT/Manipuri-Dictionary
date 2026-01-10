// src/client/composables/useVoiceSearch.ts
import { ref } from 'vue';

export function useVoiceSearch() {
    const isListening = ref(false);
    const transcript = ref('');
    const isSupported = ref(false);

    let recognition: any = null;

    const initVoiceRecognition = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'bn-BD'; // Default to Bengali
            isSupported.value = true;

            recognition.onresult = (event: any) => {
                const result = event.results[0][0].transcript;
                transcript.value = result;
                // Don't auto-search, just update transcript
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                isListening.value = false;
            };

            recognition.onend = () => {
                isListening.value = false;
            };
        }
    };

    const setLanguage = (lang: string) => {
        if (recognition) {
            recognition.lang = lang;
        }
    };

    const startListening = () => {
        if (recognition && !isListening.value) {
            transcript.value = '';
            isListening.value = true;
            try {
                recognition.start();
            } catch (error) {
                console.error('Failed to start recognition:', error);
                isListening.value = false;
            }
        }
    };

    const stopListening = () => {
        if (recognition && isListening.value) {
            recognition.stop();
            isListening.value = false;
        }
    };

    return {
        isListening,
        transcript,
        isSupported,
        initVoiceRecognition,
        startListening,
        stopListening,
        setLanguage
    };
}
