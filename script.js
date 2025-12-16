// Theme Toggle Logic
const html = document.documentElement;
const modeLightBtn = document.getElementById('modeLight');
const modeDarkBtn = document.getElementById('modeDark');

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';

function setTheme(theme) {
    if (theme === 'dark') {
        html.classList.add('dark');
        modeDarkBtn.classList.add('active');
        modeLightBtn.classList.remove('active');
    } else {
        html.classList.remove('dark');
        modeLightBtn.classList.add('active');
        modeDarkBtn.classList.remove('active');
    }
    localStorage.setItem('theme', theme);
}

// Initial Set
setTheme(currentTheme);

// Event Listeners
modeLightBtn.addEventListener('click', () => setTheme('light'));
modeDarkBtn.addEventListener('click', () => setTheme('dark'));

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Navbar background on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effect to stat items
document.querySelectorAll('.stat-item').forEach(stat => {
    stat.addEventListener('mouseenter', () => {
        stat.style.transform = 'scale(1.05)';
        stat.style.transition = 'transform 0.3s ease';
    });

    stat.addEventListener('mouseleave', () => {
        stat.style.transform = 'scale(1)';
    });
});

// Animate numbers in stats
const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Observe stats section for number animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('.stat-value');
            if (statValue && statValue.textContent.includes('+')) {
                const targetValue = parseInt(statValue.textContent);
                if (!isNaN(targetValue)) {
                    animateValue(statValue, 0, targetValue, 2000);
                }
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Cursor trail effect (subtle)
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Activate special effect
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Log a welcome message
console.log('%cMTech Toolkit', 'font-size: 2rem; font-weight: bold; background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cWelcome to the MTech Toolkit website!', 'font-size: 1rem; color: #3b82f6;');
console.log('Built with ❤️ for Windows power users');


// Theme Customization Logic
const customizeToggle = document.getElementById('customizeToggle');
const themePanel = document.getElementById('themePanel');
const closePanel = document.getElementById('closePanel');
const primaryColorPicker = document.getElementById('primaryColorPicker');
const secondaryColorPicker = document.getElementById('secondaryColorPicker');
const singleColorModeCheckbox = document.getElementById('singleColorMode');
const resetThemeButton = document.getElementById('resetTheme');
const root = document.documentElement;

// Theme State
let themeState = {
    primary: '#3b82f6',
    secondary: '#ffa500',
    singleMode: false
};

// Utils
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : null;
}

function adjustColorBrightness(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function updateThemeColors() {
    const primaryRgb = hexToRgb(themeState.primary);
    const secondaryRgb = hexToRgb(themeState.secondary);

    // Calculate dark variants
    const primaryDark = adjustColorBrightness(themeState.primary, -20);
    const secondaryDark = adjustColorBrightness(themeState.secondary, -20);

    const primaryDarkRgb = hexToRgb(primaryDark);
    const secondaryDarkRgb = hexToRgb(secondaryDark);

    // Apply colors
    root.style.setProperty('--color-primary', primaryRgb);
    root.style.setProperty('--color-primary-dark', primaryDarkRgb);
    root.style.setProperty('--color-secondary', secondaryRgb);
    root.style.setProperty('--color-secondary-dark', secondaryDarkRgb);

    // Persist
    localStorage.setItem('themeCustomization', JSON.stringify(themeState));
}

// Event Listeners
customizeToggle.addEventListener('click', () => {
    themePanel.classList.add('active');
});

closePanel.addEventListener('click', () => {
    themePanel.classList.remove('active');
});

// Click outside to close
document.addEventListener('click', (e) => {
    if (themePanel.classList.contains('active') &&
        !themePanel.contains(e.target) &&
        !customizeToggle.contains(e.target)) {
        themePanel.classList.remove('active');
    }
});

primaryColorPicker.addEventListener('input', (e) => {
    themeState.primary = e.target.value;
    if (themeState.singleMode) {
        themeState.secondary = themeState.primary;
        secondaryColorPicker.value = themeState.primary;
        secondaryColorPicker.disabled = true;
    }
    updateThemeColors();
});

secondaryColorPicker.addEventListener('input', (e) => {
    themeState.secondary = e.target.value;
    if (themeState.singleMode) {
        // If user manually changes secondary while in single mode, disable single mode
        themeState.singleMode = false;
        singleColorModeCheckbox.checked = false;
        secondaryColorPicker.disabled = false;
    }
    updateThemeColors();
});

singleColorModeCheckbox.addEventListener('change', (e) => {
    themeState.singleMode = e.target.checked;
    if (themeState.singleMode) {
        themeState.secondary = themeState.primary;
        secondaryColorPicker.value = themeState.primary;
        secondaryColorPicker.disabled = true;
    } else {
        secondaryColorPicker.disabled = false;
        // Optional: restore default secondary or last known? 
        // For now, let it stay as is until user changes it or resets.
    }
    updateThemeColors();
});

resetThemeButton.addEventListener('click', () => {
    themeState = {
        primary: '#3b82f6',
        secondary: '#ffa500',
        singleMode: false
    };
    primaryColorPicker.value = themeState.primary;
    secondaryColorPicker.value = themeState.secondary;
    singleColorModeCheckbox.checked = false;
    secondaryColorPicker.disabled = false;
    updateThemeColors();
});

// Load Saved Customization
function loadSavedTheme() {
    const saved = localStorage.getItem('themeCustomization');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            themeState = { ...themeState, ...parsed }; // Merge to ensure fields exist

            // Update Inputs
            primaryColorPicker.value = themeState.primary;
            secondaryColorPicker.value = themeState.secondary;
            singleColorModeCheckbox.checked = themeState.singleMode;

            if (themeState.singleMode) {
                secondaryColorPicker.disabled = true;
            }

            updateThemeColors();
        } catch (e) {
            console.error('Failed to load theme customization', e);
        }
    }
}

// Init
loadSavedTheme();
