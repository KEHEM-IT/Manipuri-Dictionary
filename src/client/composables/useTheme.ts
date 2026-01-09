import { ref, watch, onMounted } from 'vue';
import { Theme } from '../types';

const theme = ref<Theme>('dark');

export function useTheme() {
    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', theme.value);
        applyTheme();
    };

    const applyTheme = () => {
        if (theme.value === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            theme.value = savedTheme;
        } else {
            theme.value = 'dark';
        }
        applyTheme();
    };

    watch(theme, applyTheme);

    return {
        theme,
        toggleTheme,
        initTheme
    };
}