// frontend/src/composables/useTooltip.ts
import { onMounted, onUnmounted } from 'vue';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipOptions {
    position?: TooltipPosition;
    offset?: number;
    delay?: number;
    html?: boolean;
    attribute?: string;
}

export function useTooltip(options: TooltipOptions = {}) {
    const defaultOptions = {
        position: 'top' as TooltipPosition,
        offset: 8,
        delay: 200,
        html: false,
        attribute: 'data-tooltip',
    };

    const mergedOptions = { ...defaultOptions, ...options };
    let tooltipElement: HTMLDivElement | null = null;
    let currentTarget: HTMLElement | null = null;
    let showTimeout: number | null = null;

    const isDarkMode = () => {
        return document.documentElement.classList.contains('dark');
    };

    const createTooltip = (content: string, position: TooltipPosition) => {
        const tooltip = document.createElement('div');

        const darkMode = isDarkMode();

        // Apply Tailwind classes with dark mode support
        tooltip.className = [
            'absolute',
            'z-[9999]',
            'px-3',
            'py-2',
            darkMode ? 'bg-gray-800' : 'bg-white',
            darkMode ? 'text-gray-100' : 'text-gray-800',
            'text-sm',
            'rounded-lg',
            'shadow-lg',
            darkMode ? 'shadow-gray-900/50' : 'shadow-gray-400/30',
            'max-w-xs',
            'break-words',
            'pointer-events-none',
            'opacity-0',
            'transition-opacity',
            'duration-200',
            'whitespace-normal',
            darkMode ? 'border border-gray-700' : 'border border-gray-200',
        ].join(' ');

        if (mergedOptions.html) {
            tooltip.innerHTML = content;
        } else {
            tooltip.textContent = content;
        }

        // Add arrow
        const arrow = document.createElement('div');
        arrow.className = [
            'absolute',
            'w-2',
            'h-2',
            darkMode ? 'bg-gray-800' : 'bg-white',
            'rotate-45',
            darkMode ? 'border-gray-700' : 'border-gray-200',
        ].join(' ');

        // Position arrow based on tooltip position with proper borders
        switch (position) {
            case 'top':
                arrow.className += ' -bottom-1 left-1/2 -translate-x-1/2 border-b border-r';
                break;
            case 'bottom':
                arrow.className += ' -top-1 left-1/2 -translate-x-1/2 border-t border-l';
                break;
            case 'left':
                arrow.className += ' -right-1 top-1/2 -translate-y-1/2 border-r border-t';
                break;
            case 'right':
                arrow.className += ' -left-1 top-1/2 -translate-y-1/2 border-l border-b';
                break;
        }

        tooltip.appendChild(arrow);
        document.body.appendChild(tooltip);
        tooltipElement = tooltip;
        return tooltip;
    };

    const calculatePosition = (target: HTMLElement, tooltip: HTMLDivElement, position: TooltipPosition) => {
        const targetRect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const offset = mergedOptions.offset;

        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = targetRect.top - tooltipRect.height - offset;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + offset;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.left - tooltipRect.width - offset;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.right + offset;
                break;
        }

        // Ensure tooltip stays within viewport
        const padding = 8;
        if (left < padding) left = padding;
        if (left + tooltipRect.width > window.innerWidth - padding) {
            left = window.innerWidth - tooltipRect.width - padding;
        }
        if (top < padding) top = padding;
        if (top + tooltipRect.height > window.innerHeight - padding) {
            top = window.innerHeight - tooltipRect.height - padding;
        }

        tooltip.style.top = `${top + window.scrollY}px`;
        tooltip.style.left = `${left + window.scrollX}px`;
    };

    const showTooltip = (target: HTMLElement) => {
        if (currentTarget === target && tooltipElement) return;

        hideTooltip();
        currentTarget = target;

        const content = target.getAttribute(mergedOptions.attribute) || target.getAttribute('title');
        if (!content) return;

        // Get position from data-position attribute or use default
        const positionAttr = target.getAttribute('data-position') as TooltipPosition | null;
        const position = positionAttr || mergedOptions.position;

        // Remove title to prevent default browser tooltip
        if (mergedOptions.attribute === 'title' || target.hasAttribute('title')) {
            target.setAttribute('data-original-title', content);
            target.removeAttribute('title');
        }

        showTimeout = window.setTimeout(() => {
            const tooltip = createTooltip(content, position);
            calculatePosition(target, tooltip, position);

            // Trigger reflow for transition
            requestAnimationFrame(() => {
                tooltip.classList.remove('opacity-0');
                tooltip.classList.add('opacity-100');
            });
        }, mergedOptions.delay);
    };

    const hideTooltip = () => {
        if (showTimeout) {
            clearTimeout(showTimeout);
            showTimeout = null;
        }

        if (tooltipElement) {
            tooltipElement.classList.remove('opacity-100');
            tooltipElement.classList.add('opacity-0');

            setTimeout(() => {
                tooltipElement?.remove();
                tooltipElement = null;
            }, 200);
        }

        // Restore title attribute
        if (currentTarget) {
            const originalTitle = currentTarget.getAttribute('data-original-title');
            if (originalTitle) {
                currentTarget.setAttribute('title', originalTitle);
                currentTarget.removeAttribute('data-original-title');
            }
            currentTarget = null;
        }
    };

    const handleMouseEnter = (e: Event) => {
        const target = e.target as HTMLElement;
        // Check if target is an HTMLElement before calling hasAttribute
        if (target instanceof HTMLElement && (target.hasAttribute(mergedOptions.attribute) || target.hasAttribute('title'))) {
            showTooltip(target);
        }
    };

    const handleMouseLeave = () => {
        hideTooltip();
    };

    const handleScroll = () => {
        if (tooltipElement && currentTarget) {
            const positionAttr = currentTarget.getAttribute('data-position') as TooltipPosition | null;
            const position = positionAttr || mergedOptions.position;
            calculatePosition(currentTarget, tooltipElement, position);
        }
    };

    // Re-render tooltip on theme change
    const handleThemeChange = () => {
        if (tooltipElement && currentTarget) {
            const content = currentTarget.getAttribute(mergedOptions.attribute) || currentTarget.getAttribute('data-original-title');
            if (content) {
                hideTooltip();
                showTooltip(currentTarget);
            }
        }
    };

    onMounted(() => {
        document.addEventListener('mouseenter', handleMouseEnter, true);
        document.addEventListener('mouseleave', handleMouseLeave, true);
        window.addEventListener('scroll', handleScroll, true);

        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    handleThemeChange();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    });

    onUnmounted(() => {
        hideTooltip();
        document.removeEventListener('mouseenter', handleMouseEnter, true);
        document.removeEventListener('mouseleave', handleMouseLeave, true);
        window.removeEventListener('scroll', handleScroll, true);
    });

    return {
        showTooltip,
        hideTooltip,
    };
}