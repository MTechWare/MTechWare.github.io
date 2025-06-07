document.addEventListener("DOMContentLoaded", function() {
    fetch("nav.html")
        .then(response => response.text())
        .then(data => {
            const navPlaceholder = document.getElementById("nav-placeholder");
            if (navPlaceholder) {
                navPlaceholder.innerHTML = data;
                // After loading the nav, re-initialize menu toggle functionality if needed
                const menuToggle = navPlaceholder.querySelector('.menu-toggle');
                const mobileNav = navPlaceholder.querySelector('.mobile-nav');
                if (menuToggle && mobileNav) {
                    menuToggle.addEventListener('click', () => {
                        mobileNav.classList.toggle('active');
                        const isExpanded = mobileNav.classList.contains('active');
                        menuToggle.setAttribute('aria-expanded', isExpanded);
                    });
                }

                // Set active class based on current page
                const currentPage = window.location.pathname.split('/').pop();
                const navLinks = navPlaceholder.querySelectorAll('.main-nav a, .mobile-nav a');
                navLinks.forEach(link => {
                    const linkPage = link.getAttribute('href').split('/').pop();
                    if (linkPage === currentPage) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

            }
        })
        .catch(error => console.error('Error loading navigation:', error));
});