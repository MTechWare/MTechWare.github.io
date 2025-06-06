document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS animations
    AOS.init({
        duration: 800, // Animation duration
        once: true,    // Animate only once
        offset: 50,    // Offset (in px) from the original trigger point
    });

    // --- Raindrops Effect ---
    const rainContainer = document.querySelector('.rain-container');
    if (rainContainer) {
        const numberOfDrops = 75; // Number of raindrops
        for (let i = 0; i < numberOfDrops; i++) {
            const drop = document.createElement('div');
            drop.classList.add('raindrop');
            // Randomize position and animation delay/duration
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDelay = `${Math.random() * 5}s`;
            drop.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
            rainContainer.appendChild(drop);
        }
    }

    // --- Mobile Menu Toggle Logic ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavUl = document.querySelector('nav ul.mobile-nav');
    if (menuToggle && mobileNavUl) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            mobileNavUl.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        mobileNavUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNavUl.classList.contains('active')) {
                    mobileNavUl.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }

    // --- Documentation Navigation ---
    const docNavLinks = document.querySelectorAll('.documentation-nav a');
    if (docNavLinks.length > 0) {
        // Hide all doc sections except the first one on page load
        const allDocSections = document.querySelectorAll('.doc-section');
        allDocSections.forEach((section, index) => {
            if (index > 0) {
                section.style.display = 'none';
            }
        });
        
        docNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                // Hide all doc sections
                document.querySelectorAll('.doc-section').forEach(section => {
                    section.style.display = 'none';
                });
                
                // Show only the target section
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.style.display = 'block';
                }
                
                // Remove active class from all links
                docNavLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Add active class to clicked link
                link.classList.add('active');
            });
        });
        
        // Set first nav item as active by default
        docNavLinks[0].classList.add('active');
    }

    // --- Smooth Scrolling for All Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if it's just "#"
            
            // Check if this is a documentation navigation link
            if (this.closest('.documentation-nav')) {
                e.preventDefault();
                return; // Skip scrolling for documentation navigation links
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active Navigation Highlighting ---
    const highlightActiveNav = () => {
        const currentPath = window.location.pathname;
        document.querySelectorAll('nav ul.main-nav a, nav ul.mobile-nav a').forEach(link => {
            if (link.getAttribute('href') === currentPath || 
                (currentPath.endsWith('/') && link.getAttribute('href') === currentPath + 'index.html') ||
                (currentPath.endsWith('/docs/') && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
    
    highlightActiveNav();
});
