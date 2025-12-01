// ===================================
// WEBSITE ANIMATION & INTERACTION SCRIPT
// Tố Hữu - Nhà Thơ Cách Mạng
// ===================================

// Page Loader - MỚI MƯỢT MÀ HƠN
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
// BOOK SLIDER - SWIPE & KÉO NGANG
// ===================================

let currentSlideIndex = 0;
let startX = 0;
let isDragging = false;
let currentTranslate = 0;
let prevTranslate = 0;

function initBookSlider() {
    const slider = document.querySelector('.book-slider');
    if (!slider) return;

    const slides = document.querySelectorAll('.book-slide');
    if (slides.length === 0) return;

    // Tạo container cho slides
    const container = document.createElement('div');
    container.className = 'book-slider-container';
    
    // Di chuyển tất cả slides vào container
    slides.forEach(slide => {
        container.appendChild(slide);
    });
    
    slider.appendChild(container);

    // Tạo navigation buttons
    const navDiv = document.createElement('div');
    navDiv.className = 'slider-nav';
    navDiv.innerHTML = `
        <button class="nav-btn" id="prevBtn">← Trước</button>
        <button class="nav-btn" id="nextBtn">Tiếp →</button>
    `;
    slider.appendChild(navDiv);

    // Tạo dots
    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'slider-dots';
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        dotsDiv.appendChild(dot);
    });
    slider.appendChild(dotsDiv);

    function updateSlider() {
        const slideWidth = slides[0].offsetWidth;
        currentTranslate = -currentSlideIndex * slideWidth;
        container.style.transform = `translateX(${currentTranslate}px)`;
        
        // Update active slide
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlideIndex);
        });
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
        });
        
        // Update button states
        document.getElementById('prevBtn').disabled = currentSlideIndex === 0;
        document.getElementById('nextBtn').disabled = currentSlideIndex === slides.length - 1;
    }

    function nextSlide() {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            updateSlider();
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlider();
        }
    }

    function goToSlide(index) {
        currentSlideIndex = index;
        updateSlider();
    }

    // Button events
    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);

    // Touch/Swipe support
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        container.style.transition = 'none';
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const slideWidth = slides[0].offsetWidth;
        currentTranslate = -currentSlideIndex * slideWidth + diff;
        container.style.transform = `translateX(${currentTranslate}px)`;
    });

    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        container.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const movedBy = currentTranslate - prevTranslate;
        const slideWidth = slides[0].offsetWidth;
        
        if (Math.abs(movedBy) > slideWidth / 4) {
            if (movedBy < 0 && currentSlideIndex < slides.length - 1) {
                currentSlideIndex++;
            } else if (movedBy > 0 && currentSlideIndex > 0) {
                currentSlideIndex--;
            }
        }
        
        updateSlider();
        prevTranslate = currentTranslate;
    });

    // Mouse drag support for desktop
    container.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        container.style.cursor = 'grabbing';
        container.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = currentX - startX;
        const slideWidth = slides[0].offsetWidth;
        currentTranslate = -currentSlideIndex * slideWidth + diff;
        container.style.transform = `translateX(${currentTranslate}px)`;
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = 'grab';
        container.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const movedBy = currentTranslate - prevTranslate;
        const slideWidth = slides[0].offsetWidth;
        
        if (Math.abs(movedBy) > slideWidth / 4) {
            if (movedBy < 0 && currentSlideIndex < slides.length - 1) {
                currentSlideIndex++;
            } else if (movedBy > 0 && currentSlideIndex > 0) {
                currentSlideIndex--;
            }
        }
        
        updateSlider();
        prevTranslate = currentTranslate;
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Initial setup
    updateSlider();
    
    // Update on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlider();
        }, 250);
    });

    // Make functions global for old button compatibility
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
}

// Initialize slider when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookSlider);
} else {
    initBookSlider();
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
    const animatedElements = document.querySelectorAll('.card-value, .book-info');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===================================
// SỬA LỖI: BỎ PARALLAX CHO ẢNH
// ===================================

// BỎ parallax effect vì gây lỗi ảnh bị bay lên
// Chỉ giữ hover effect trong CSS

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
// LOG
// ===================================

console.log('%c🎨 Website Tố Hữu - Phiên bản cải tiến', 'color: #d4af37; font-size: 16px; font-weight: bold;');
console.log('%c✨ Đã sửa lỗi parallax, thêm swipe, cải thiện UX', 'color: #8b0000; font-size: 12px;');
