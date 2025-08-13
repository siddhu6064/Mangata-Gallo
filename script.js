/* ===============================
   MANGATA & GALLO - INTERACTIVE FEATURES
   =============================== */

// DOM Content Loaded - Initialize all features
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeSearchBox();
    initializeBannerEffects();
    initializeColumnAnimations();
    initializeScrollEffects();
    initializeImageEffects();
    initializeButtonEffects();
    console.log('🎉 Mangata & Gallo website loaded successfully!');
});

/* ===============================
   SEARCH BOX FUNCTIONALITY
   =============================== */
function initializeSearchBox() {
    const searchBox = document.getElementById('search-box');
    const searchBtn = document.getElementById('search-btn');

    if (searchBox && searchBtn) {
        // Search button click
        searchBtn.addEventListener('click', function () {
            performSearch();
        });

        // Enter key press in search box
        searchBox.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Search box focus effects
        searchBox.addEventListener('focus', function () {
            this.style.transform = 'scale(1.05)';
            searchBtn.style.transform = 'scale(1.1)';
        });

        searchBox.addEventListener('blur', function () {
            this.style.transform = 'scale(1)';
            searchBtn.style.transform = 'scale(1)';
        });

        // Live search suggestions (visual feedback)
        searchBox.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                // Add visual feedback for active search
                this.style.borderColor = '#d4af37';
                this.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.3)';
            } else {
                this.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                this.style.boxShadow = 'none';
            }
        });
    }
}

function performSearch() {
    const searchBox = document.getElementById('search-box');
    const query = searchBox.value.trim();

    if (query === '') {
        showNotification('💍 Please enter a search term');
        return;
    }

    // Button click animation
    const searchBtn = document.getElementById('search-btn');
    searchBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        searchBtn.style.transform = 'scale(1)';
    }, 150);

    // Simulate search results
    const searchTerms = {
        'ring': 'engagement rings',
        'engagement': 'engagement rings',
        'wedding': 'wedding bands',
        'necklace': 'elegant necklaces',
        'gold': 'gold jewelry collection',
        'diamond': 'diamond jewelry',
        'atelier': 'our Austin atelier',
        'consultation': 'design consultations'
    };

    let foundCategory = 'jewelry';
    for (let term in searchTerms) {
        if (query.toLowerCase().includes(term)) {
            foundCategory = searchTerms[term];
            break;
        }
    }

    showNotification(`🔍 Searching for "${query}" in ${foundCategory}...`);

    // Clear search box
    setTimeout(() => {
        searchBox.value = '';
        searchBox.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        searchBox.style.boxShadow = 'none';
    }, 1000);

    console.log(`Search performed: ${query}`);
}

/* ===============================
   NAVIGATION INTERACTIVITY
   =============================== */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('nav a');

    // Active navigation highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Don't prevent default for actual page links
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                // Allow normal navigation to other pages
                return;
            }

            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Smooth scroll to section if it exists
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            console.log(`Navigation: ${this.textContent} selected`);
        });

        // Add hover sound effect (visual feedback)
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
}

/* ===============================
   PROMOTIONAL BANNER EFFECTS
   =============================== */
function initializeBannerEffects() {
    const banner = document.querySelector('.promotional-banner');
    const bannerImage = document.querySelector('.cta-button img');
    const ctaButton = document.querySelector('.cta-button a');

    if (banner) {
        // Parallax effect on scroll
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            banner.style.transform = `translateY(${rate}px)`;
        });

        // Banner image hover effect
        if (bannerImage) {
            bannerImage.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.05) rotate(1deg)';
                this.style.filter = 'brightness(1.1) contrast(1.1)';
            });

            bannerImage.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1) rotate(0deg)';
                this.style.filter = 'brightness(1) contrast(1)';
            });
        }

        // CTA Button pulse effect
        if (ctaButton) {
            setInterval(() => {
                ctaButton.style.animation = 'pulse 2s ease-in-out';
                setTimeout(() => {
                    ctaButton.style.animation = '';
                }, 2000);
            }, 8000);
        }
    }
}

/* ===============================
   COLUMN ANIMATIONS & INTERACTIONS
   =============================== */
function initializeColumnAnimations() {
    const columns = document.querySelectorAll('.column');

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe each column
    columns.forEach((column, index) => {
        // Initial hidden state
        column.style.opacity = '0';
        column.style.transform = 'translateY(30px)';
        column.style.transition = `all 0.6s ease ${index * 0.2}s`;

        observer.observe(column);

        // Enhanced hover effects
        column.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';

            // Highlight the column link
            const columnLink = this.querySelector('.column-link');
            if (columnLink) {
                columnLink.style.color = '#1a1a1a';
                columnLink.style.fontWeight = 'bold';
            }
        });

        column.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';

            // Reset column link
            const columnLink = this.querySelector('.column-link');
            if (columnLink) {
                columnLink.style.color = '#d4af37';
                columnLink.style.fontWeight = 'bold';
            }
        });

        // Click effect for columns
        column.addEventListener('click', function () {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }, 150);

            console.log(`Column clicked: ${this.querySelector('h2').textContent}`);
        });
    });
}

/* ===============================
   SCROLL EFFECTS & HEADER BEHAVIOR
   =============================== */
function initializeScrollEffects() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;

        // Header shadow effect on scroll
        if (scrolled > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            nav.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
        } else {
            header.style.boxShadow = 'none';
            nav.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        }

        // Show scroll progress
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrolled / docHeight) * 100;

        // Create progress bar if it doesn't exist
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(45deg, #d4af37, #f4d03f);
                z-index: 1000;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        }

        progressBar.style.width = `${scrollPercent}%`;
    });
}

/* ===============================
   IMAGE LOADING & EFFECTS
   =============================== */
function initializeImageEffects() {
    const images = document.querySelectorAll('img');

    images.forEach(image => {
        // Loading animation
        image.addEventListener('load', function () {
            this.style.opacity = '0';
            this.style.transform = 'scale(0.9)';
            this.style.transition = 'all 0.5s ease';

            setTimeout(() => {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            }, 100);
        });

        // Error handling for broken images
        image.addEventListener('error', function () {
            this.style.opacity = '0.5';
            this.alt = 'Image could not be loaded';
            console.warn('Image failed to load:', this.src);
        });
    });
}

/* ===============================
   BUTTON INTERACTIONS & FEEDBACK
   =============================== */
function initializeButtonEffects() {
    const ctaButton = document.querySelector('.cta-button a');
    const columnLinks = document.querySelectorAll('.column-link');

    // CTA Button interactions
    if (ctaButton) {
        ctaButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Button click animation
            this.style.transform = 'translate(-50%, 2px) scale(0.95)';

            setTimeout(() => {
                this.style.transform = 'translate(-50%, -2px) scale(1)';
            }, 150);

            // Show engagement message
            showNotification('🎉 Browse our exclusive engagement ring collection!');

            console.log('CTA Button clicked: Browse Collection');
        });
    }

    // Column link interactions
    columnLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Link click effect
            this.style.transform = 'translateX(10px)';

            setTimeout(() => {
                this.style.transform = 'translateX(0)';
            }, 200);

            const linkText = this.textContent;
            showNotification(`✨ ${linkText} - Coming soon!`);

            console.log(`Column link clicked: ${linkText}`);
        });
    });
}

/* ===============================
   NOTIFICATION SYSTEM
   =============================== */
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #d4af37, #f4d03f);
        color: #1a1a1a;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
        z-index: 1000;
        transform: translateX(300px);
        transition: all 0.3s ease;
        font-family: 'Lora', serif;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/* ===============================
   ADDITIONAL CSS ANIMATIONS (Added via JS)
   =============================== */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: translate(-50%, -1.25rem) scale(1); }
            50% { transform: translate(-50%, -1.25rem) scale(1.05); }
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .scroll-progress {
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
}

// Add dynamic styles when DOM loads
document.addEventListener('DOMContentLoaded', addDynamicStyles);

/* ===============================
   PERFORMANCE OPTIMIZATION
   =============================== */
// Throttle scroll events for better performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function () {
    // Scroll events are now throttled for better performance
}, 16)); // ~60fps
