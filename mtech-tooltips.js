/**
 * MTech Tooltips & Popovers JavaScript
 * Advanced tooltip and popover functionality
 */

class MTechTooltips {
    constructor() {
        this.tooltips = new Map();
        this.popovers = new Map();
        this.init();
    }

    init() {
        this.initTooltips();
        this.initPopovers();
        this.bindEvents();
    }

    // Initialize tooltips
    initTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            this.createTooltip(element);
        });
    }

    // Initialize popovers
    initPopovers() {
        document.querySelectorAll('[data-popover]').forEach(element => {
            this.createPopover(element);
        });
    }

    // Create tooltip
    createTooltip(element) {
        const text = element.getAttribute('data-tooltip');
        const position = element.getAttribute('data-tooltip-position') || 'top';
        const variant = element.getAttribute('data-tooltip-variant') || 'default';
        const interactive = element.hasAttribute('data-tooltip-interactive');
        const rich = element.hasAttribute('data-tooltip-rich');

        // Create tooltip wrapper if not exists
        if (!element.classList.contains('mtech-tooltip')) {
            element.classList.add('mtech-tooltip');
            
            if (variant !== 'default') {
                element.classList.add(`mtech-tooltip-${variant}`);
            }
            
            if (interactive) {
                element.classList.add('mtech-tooltip-interactive');
            }
            
            if (rich) {
                element.classList.add('mtech-tooltip-rich');
            }
        }

        // Create tooltip content
        const tooltipContent = document.createElement('div');
        tooltipContent.className = `mtech-tooltip-content ${position}`;
        
        if (rich) {
            const title = element.getAttribute('data-tooltip-title');
            tooltipContent.innerHTML = `
                ${title ? `<div class="mtech-tooltip-title">${title}</div>` : ''}
                <div class="mtech-tooltip-text">${text}</div>
            `;
        } else {
            tooltipContent.textContent = text;
        }

        element.appendChild(tooltipContent);
        this.tooltips.set(element, tooltipContent);

        // Handle interactive tooltips
        if (interactive) {
            this.setupInteractiveTooltip(element, tooltipContent);
        }
    }

    // Create popover
    createPopover(element) {
        const title = element.getAttribute('data-popover-title') || '';
        const content = element.getAttribute('data-popover') || '';
        const position = element.getAttribute('data-popover-position') || 'bottom';
        const trigger = element.getAttribute('data-popover-trigger') || 'click';

        // Create popover wrapper
        if (!element.classList.contains('mtech-popover')) {
            element.classList.add('mtech-popover');
        }

        // Create popover content
        const popoverContent = document.createElement('div');
        popoverContent.className = `mtech-popover-content ${position}`;
        
        const popoverId = `popover-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        popoverContent.id = popoverId;

        popoverContent.innerHTML = `
            ${title ? `
                <div class="mtech-popover-header">
                    <h3 class="mtech-popover-title">${title}</h3>
                    <button class="mtech-popover-close" aria-label="Close popover">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            ` : ''}
            <div class="mtech-popover-body">
                ${content}
            </div>
        `;

        element.appendChild(popoverContent);
        this.popovers.set(element, popoverContent);

        // Setup popover triggers
        this.setupPopoverTriggers(element, popoverContent, trigger);
    }

    // Setup interactive tooltip
    setupInteractiveTooltip(element, tooltipContent) {
        let isVisible = false;

        const toggle = () => {
            isVisible = !isVisible;
            element.classList.toggle('show', isVisible);
        };

        const hide = () => {
            isVisible = false;
            element.classList.remove('show');
        };

        element.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!element.contains(e.target)) {
                hide();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isVisible) {
                hide();
            }
        });
    }

    // Setup popover triggers
    setupPopoverTriggers(element, popoverContent, trigger) {
        let isVisible = false;

        const show = () => {
            // Hide all other popovers
            this.hideAllPopovers();
            isVisible = true;
            element.classList.add('show');
            this.positionPopover(element, popoverContent);
        };

        const hide = () => {
            isVisible = false;
            element.classList.remove('show');
        };

        const toggle = () => {
            if (isVisible) {
                hide();
            } else {
                show();
            }
        };

        // Setup close button
        const closeBtn = popoverContent.querySelector('.mtech-popover-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hide);
        }

        if (trigger === 'click') {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                toggle();
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!element.contains(e.target)) {
                    hide();
                }
            });
        } else if (trigger === 'hover') {
            element.addEventListener('mouseenter', show);
            element.addEventListener('mouseleave', hide);
            
            // Keep popover open when hovering over it
            popoverContent.addEventListener('mouseenter', () => {
                isVisible = true;
            });
            popoverContent.addEventListener('mouseleave', hide);
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isVisible) {
                hide();
            }
        });

        // Store reference for external control
        element._mtechPopover = { show, hide, toggle };
    }

    // Position popover to avoid viewport edges
    positionPopover(element, popoverContent) {
        const rect = element.getBoundingClientRect();
        const popoverRect = popoverContent.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        let position = popoverContent.classList.contains('top') ? 'top' :
                      popoverContent.classList.contains('bottom') ? 'bottom' :
                      popoverContent.classList.contains('left') ? 'left' : 'right';

        // Check if popover goes outside viewport and adjust
        if (position === 'top' && rect.top - popoverRect.height < 10) {
            this.changePopoverPosition(popoverContent, 'bottom');
        } else if (position === 'bottom' && rect.bottom + popoverRect.height > viewport.height - 10) {
            this.changePopoverPosition(popoverContent, 'top');
        } else if (position === 'left' && rect.left - popoverRect.width < 10) {
            this.changePopoverPosition(popoverContent, 'right');
        } else if (position === 'right' && rect.right + popoverRect.width > viewport.width - 10) {
            this.changePopoverPosition(popoverContent, 'left');
        }
    }

    // Change popover position
    changePopoverPosition(popoverContent, newPosition) {
        popoverContent.className = popoverContent.className.replace(/(top|bottom|left|right)/, newPosition);
    }

    // Hide all popovers
    hideAllPopovers() {
        this.popovers.forEach((popoverContent, element) => {
            element.classList.remove('show');
        });
    }

    // Public API methods
    showTooltip(element) {
        if (element.classList.contains('mtech-tooltip')) {
            element.classList.add('show');
        }
    }

    hideTooltip(element) {
        if (element.classList.contains('mtech-tooltip')) {
            element.classList.remove('show');
        }
    }

    showPopover(element) {
        if (element._mtechPopover) {
            element._mtechPopover.show();
        }
    }

    hidePopover(element) {
        if (element._mtechPopover) {
            element._mtechPopover.hide();
        }
    }

    togglePopover(element) {
        if (element._mtechPopover) {
            element._mtechPopover.toggle();
        }
    }

    // Dynamic tooltip creation
    createDynamicTooltip(element, options = {}) {
        const {
            text = '',
            position = 'top',
            variant = 'default',
            interactive = false,
            rich = false,
            title = ''
        } = options;

        element.setAttribute('data-tooltip', text);
        element.setAttribute('data-tooltip-position', position);
        
        if (variant !== 'default') {
            element.setAttribute('data-tooltip-variant', variant);
        }
        
        if (interactive) {
            element.setAttribute('data-tooltip-interactive', '');
        }
        
        if (rich && title) {
            element.setAttribute('data-tooltip-rich', '');
            element.setAttribute('data-tooltip-title', title);
        }

        this.createTooltip(element);
    }

    // Dynamic popover creation
    createDynamicPopover(element, options = {}) {
        const {
            title = '',
            content = '',
            position = 'bottom',
            trigger = 'click'
        } = options;

        element.setAttribute('data-popover', content);
        element.setAttribute('data-popover-title', title);
        element.setAttribute('data-popover-position', position);
        element.setAttribute('data-popover-trigger', trigger);

        this.createPopover(element);
    }

    // Destroy tooltip
    destroyTooltip(element) {
        const tooltipContent = this.tooltips.get(element);
        if (tooltipContent) {
            tooltipContent.remove();
            this.tooltips.delete(element);
            element.classList.remove('mtech-tooltip', 'mtech-tooltip-interactive', 'mtech-tooltip-rich');
            element.classList.remove('mtech-tooltip-success', 'mtech-tooltip-error', 'mtech-tooltip-warning');
        }
    }

    // Destroy popover
    destroyPopover(element) {
        const popoverContent = this.popovers.get(element);
        if (popoverContent) {
            popoverContent.remove();
            this.popovers.delete(element);
            element.classList.remove('mtech-popover', 'show');
            delete element._mtechPopover;
        }
    }

    // Bind global events
    bindEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.hideAllPopovers();
        });

        // Handle scroll
        window.addEventListener('scroll', () => {
            this.hideAllPopovers();
        });
    }

    // Refresh all tooltips and popovers
    refresh() {
        // Clear existing
        this.tooltips.clear();
        this.popovers.clear();
        
        // Remove all tooltip/popover content
        document.querySelectorAll('.mtech-tooltip-content, .mtech-popover-content').forEach(el => {
            el.remove();
        });
        
        // Reinitialize
        this.init();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mtechTooltips = new MTechTooltips();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MTechTooltips;
}