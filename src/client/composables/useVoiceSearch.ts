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
            recognition.lang = 'en-US';
            isSupported.value = true;

            recognition.onresult = (event: any) => {
                const result = event.results[0][0].transcript;
                transcript.value = result;
                isListening.value = false;
            };

            recognition.onerror = () => {
                isListening.value = false;
            };

            recognition.onend = () => {
                isListening.value = false;
            };
        }
    };

    const startListening = () => {
        if (recognition && !isListening.value) {
            transcript.value = '';
            isListening.value = true;
            recognition.start();
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
        stopListening
    };
}