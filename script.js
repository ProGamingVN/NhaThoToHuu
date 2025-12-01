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
// 3D CAROUSEL FOR BOOKS
// ===================================

let currentIndex = 0;
let isAnimating = false;

function init3DCarousel() {
    const carousel = document.getElementById('carousel3d');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.carousel-item');
    const bookDetails = document.querySelectorAll('.book-detail');
    const prevBtn = document.getElementById('prevBtn3D');
    const nextBtn = document.getElementById('nextBtn3D');

    if (items.length === 0) return;

    // Set initial active state
    items[0].classList.add('active');
    if (bookDetails[0]) bookDetails[0].classList.add('active');

    function updateCarousel(direction) {
        if (isAnimating) return;
        isAnimating = true;

        // Remove active from all
        items.forEach(item => item.classList.remove('active'));
        bookDetails.forEach(detail => detail.classList.remove('active'));

        // Update positions with animation
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % items.length;
            carousel.classList.add('rotate-right');
            
            setTimeout(() => {
                // Rearrange items
                const firstItem = items[0];
                carousel.appendChild(firstItem);
                carousel.classList.remove('rotate-right');
                
                // Set new active
                items[0].classList.add('active');
                if (bookDetails[currentIndex]) {
                    bookDetails[currentIndex].classList.add('active');
                }
                
                isAnimating = false;
            }, 800);
            
        } else if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            carousel.classList.add('rotate-left');
            
            setTimeout(() => {
                // Rearrange items
                const lastItem = items[items.length - 1];
                carousel.insertBefore(lastItem, items[0]);
                carousel.classList.remove('rotate-left');
                
                // Set new active
                items[0].classList.add('active');
                if (bookDetails[currentIndex]) {
                    bookDetails[currentIndex].classList.add('active');
                }
                
                isAnimating = false;
            }, 800);
        }
    }

    // Button events
    if (nextBtn) {
        nextBtn.addEventListener('click', () => updateCarousel('next'));
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => updateCarousel('prev'));
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            updateCarousel('next');
        } else if (e.key === 'ArrowLeft') {
            updateCarousel('prev');
        }
    });

    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                updateCarousel('next');
            } else {
                updateCarousel('prev');
            }
        }
    }

    // Auto rotate (optional - comment out if not needed)
    // setInterval(() => {
    //     updateCarousel('next');
    // }, 5000);
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
console.log('%c✨ 3D Carousel, Smooth Animations, Enhanced UX', 'color: #8b0000; font-size: 12px;');
