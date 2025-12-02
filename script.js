// ===================================
// WEBSITE ANIMATION & INTERACTION SCRIPT
// Tố Hữu - Nhà Thơ Cách Mạng
// ===================================

// Page Loader
window.addEventListener('load', function() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }, 1200);
    }
});

// ===================================
// HAMBURGER MENU FOR MOBILE
// ===================================

function createHamburgerMenu() {
    const nav = document.querySelector('nav');
    const navUl = document.querySelector('nav ul');
    
    if (!nav || !navUl) return;
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'nav-toggle';
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    
    // Insert hamburger at the beginning of nav
    nav.insertBefore(hamburger, nav.firstChild);
    
    // Toggle menu
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navUl.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = navUl.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navUl.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) {
            hamburger.classList.remove('active');
            navUl.classList.remove('active');
        }
    });
}

// Initialize hamburger menu on mobile
if (window.innerWidth <= 768) {
    createHamburgerMenu();
}

// Recreate on resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const existingToggle = document.querySelector('.nav-toggle');
        if (window.innerWidth <= 768 && !existingToggle) {
            createHamburgerMenu();
        } else if (window.innerWidth > 768 && existingToggle) {
            existingToggle.remove();
            document.querySelector('nav ul').classList.remove('active');
        }
    }, 250);
});

// ===================================
// NAVIGATION EFFECTS
// ===================================

let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active Page Highlighting
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
        link.classList.add('active');
    }
});

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

function createScrollTopButton() {
    const scrollBtn = document.createElement('div');
    scrollBtn.className = 'scroll-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('title', 'Về đầu trang');
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

createScrollTopButton();

// ===================================
// 3D CAROUSEL FOR BOOKS - FIXED VERSION
// ===================================

let currentBookIndex = 0;
let isAnimating = false;
let totalBooks = 0;
let books = [];

function init3DCarousel() {
    const carousel = document.getElementById('carousel3d');
    if (!carousel) return;

    books = Array.from(carousel.querySelectorAll('.carousel-item'));
    const bookDetails = document.querySelectorAll('.book-detail');
    const prevBtn = document.getElementById('prevBtn3D');
    const nextBtn = document.getElementById('nextBtn3D');

    if (books.length === 0) return;
    
    totalBooks = books.length;
    currentBookIndex = 0;

    // Set initial active state
    books[0].classList.add('active');
    if (bookDetails[0]) bookDetails[0].classList.add('active');

    function updateCarousel() {
        if (isAnimating) return;
        
        // Remove active from all
        books.forEach(item => item.classList.remove('active'));
        bookDetails.forEach(detail => detail.classList.remove('active'));
        
        // Add active to current
        books[currentBookIndex].classList.add('active');
        if (bookDetails[currentBookIndex]) {
            bookDetails[currentBookIndex].classList.add('active');
        }
    }

    function rotateNext() {
        if (isAnimating) return;
        isAnimating = true;

        // Move current book to end of array
        const firstBook = books.shift();
        books.push(firstBook);
        carousel.appendChild(firstBook);
        
        // Update index (wraps around)
        currentBookIndex = (currentBookIndex + 1) % totalBooks;
        
        setTimeout(() => {
            updateCarousel();
            isAnimating = false;
        }, 100);
    }

    function rotatePrev() {
        if (isAnimating) return;
        isAnimating = true;

        // Move last book to beginning of array
        const lastBook = books.pop();
        books.unshift(lastBook);
        carousel.insertBefore(lastBook, books[1]);
        
        // Update index (wraps around)
        currentBookIndex = (currentBookIndex - 1 + totalBooks) % totalBooks;
        
        setTimeout(() => {
            updateCarousel();
            isAnimating = false;
        }, 100);
    }

    // Button events
    if (nextBtn) {
        nextBtn.addEventListener('click', rotateNext);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', rotatePrev);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            rotateNext();
        } else if (e.key === 'ArrowLeft') {
            rotatePrev();
        }
    });

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                rotateNext();
            } else {
                rotatePrev();
            }
        }
    }
}

// Initialize 3D Carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DCarousel);
} else {
    init3DCarousel();
}

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.card-value');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===================================
// SMOOTH REVEAL FOR TIMELINE ITEMS
// ===================================

function revealTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

revealTimeline();

// ===================================
// HOVER EFFECTS FOR CARDS
// ===================================

document.querySelectorAll('.card-value').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===================================
// DYNAMIC COPYRIGHT YEAR
// ===================================

const footer = document.querySelector('footer p');
if (footer) {
    const currentYear = new Date().getFullYear();
    footer.innerHTML = footer.innerHTML.replace('2024', currentYear);
}

// ===================================
// ADD READING PROGRESS BAR
// ===================================

function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--gold), var(--primary-red));
        width: 0%;
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

createProgressBar();

// ===================================
// ENHANCED NAVIGATION
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// PARALLAX EFFECT FOR IMAGES (SUBTLE)
// ===================================

function addParallaxEffect() {
    const images = document.querySelectorAll('.img-box img');
    
    window.addEventListener('scroll', () => {
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.05;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                img.style.transform = `translateY(${rate}px) scale(1.05)`;
            }
        });
    });
}

// Only add parallax on desktop
if (window.innerWidth > 768) {
    addParallaxEffect();
}

// ===================================
// BOOK COVER HOVER 3D EFFECT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const bookCovers = document.querySelectorAll('.book-cover');
    
    bookCovers.forEach(cover => {
        cover.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        cover.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
});

// ===================================
// LOADING ANIMATION FOR IMAGES
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });
});

// ===================================
// LOG
// ===================================

console.log('%c🎨 Website Tố Hữu - Phiên bản nâng cấp 3D', 'color: #d4af37; font-size: 16px; font-weight: bold;');
console.log('%c✨ 3D Carousel, Smooth Animations, Enhanced UX, Mobile Menu', 'color: #8b0000; font-size: 12px;');
