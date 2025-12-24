// ========== CAROUSEL ==========
function createAutoCarousel() {
    const track = document.querySelector(".track");
    const items = document.querySelectorAll(".item");
    const dots = document.querySelectorAll(".dot");

    if (!track || items.length === 0) return null;

    let currentIndex = 0;
    let itemsPerView = 2;
    let totalItems = items.length;
    let autoSlideInterval = null;
    let isHovering = false;

    function checkResponsive() {
        itemsPerView = window.innerWidth <= 768 ? 1 : 2;
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateTrackPosition();
        updateDots();
    }

    function updateTrackPosition() {
        if (!items[0]) return;
        const itemWidth = items[0].offsetWidth + 30;
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }

    function updateDots() {
        const totalDots = Math.max(0, totalItems - itemsPerView + 1);
        dots.forEach((dot, index) => {
            if (index < totalDots) {
                dot.style.display = "inline-block";
                dot.classList.toggle("active", index === currentIndex);
            } else {
                dot.style.display = "none";
            }
        });
    }

    function slideToNext() {
        if (isHovering) return;
        const maxIndex = totalItems - itemsPerView;
        currentIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
        updateTrackPosition();
        updateDots();
    }

    function goToSlide(index) {
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        if (index >= 0 && index <= maxIndex) {
            currentIndex = index;
            updateTrackPosition();
            updateDots();
        }
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(slideToNext, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    function resetAutoSlide() {
        if (!isHovering) {
            stopAutoSlide();
            startAutoSlide();
        }
    }

    function initEvents() {
        dots.forEach((dot) => {
            dot.addEventListener("click", (e) => {
                goToSlide(parseInt(e.target.dataset.index));
                resetAutoSlide();
            });
        });

        items.forEach((item) => {
            item.addEventListener("mouseenter", () => {
                isHovering = true;
                stopAutoSlide();
            });
            item.addEventListener("mouseleave", () => {
                isHovering = false;
                startAutoSlide();
            });
        });

        window.addEventListener("resize", () => {
            checkResponsive();
            resetAutoSlide();
        });

        document.addEventListener("visibilitychange", () => {
            document.hidden ? stopAutoSlide() : startAutoSlide();
        });
    }

    function start() {
        checkResponsive();
        initEvents();
        startAutoSlide();
    }

    return { start, next: slideToNext, goTo: goToSlide };
}

// ========== ACTIVE NAV LINK (USING DATA ATTRIBUTE) ==========
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop().toLowerCase();

    if (navLinks.length === 0) return;

    // Reset all
    navLinks.forEach(link => link.classList.remove('active'));

    // Map page names
    const pageMap = {
        '': 'home',
        'index.html': 'home',
        'index.htm': 'home',
        'gioi_thieu.html': 'gioi-thieu',
        'gioi-thieu.html': 'gioi-thieu',
        'xe_ghep_vinh_yen.html': 'xe-ghep',
        'xe-ghep-vinh-yen.html': 'xe-ghep'
    };

    const currentPageKey = pageMap[currentPage] || currentPage.replace('.html', '').replace(/_/g, '-');

    navLinks.forEach(link => {
        const pageAttr = link.getAttribute('data-page');
        const linkHref = link.getAttribute('href');

        // Method 1: Check data-page attribute
        if (pageAttr && pageAttr === currentPageKey) {
            link.classList.add('active');
            return;
        }

        // Method 2: Check href
        if (linkHref) {
            const linkPage = linkHref.split('/').pop().toLowerCase();
            const linkPageKey = pageMap[linkPage] || linkPage.replace('.html', '').replace(/_/g, '-');

            if (linkPageKey === currentPageKey) {
                link.classList.add('active');
                return;
            }

            // Home page special case
            if ((linkHref === '/' || linkPage === '' || linkPage === 'index.html') &&
                (currentPage === '' || currentPage === 'index.html')) {
                link.classList.add('active');
            }
        }
    });
}

// ========== MENU TOGGLE ==========
function initMenuToggle() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mainNav");

    if (toggle && nav) {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            toggle.classList.toggle("active");
            nav.classList.toggle("show");
            document.body.style.overflow = nav.classList.contains("show") ? "hidden" : "";
        });

        // Đóng khi click ra ngoài
        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 768 && nav.classList.contains("show")) {
                if (!nav.contains(e.target) && e.target !== toggle) {
                    toggle.classList.remove("active");
                    nav.classList.remove("show");
                    document.body.style.overflow = "";
                }
            }
        });

        // Đóng khi click vào link (trên mobile)
        nav.addEventListener("click", (e) => {
            if (e.target.tagName === 'A' && window.innerWidth <= 768) {
                setTimeout(() => {
                    toggle.classList.remove("active");
                    nav.classList.remove("show");
                    document.body.style.overflow = "";
                }, 300);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                toggle.classList.remove("active");
                nav.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
    }
}

// ========== FIXED HEADER ==========
function handleFixedHeader() {
    const header = document.querySelector(".site-header");
    const banner = document.querySelector(".banner");

    if (!header) return;

    let ticking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        const isMobile = window.innerWidth <= 768;

        // Ngưỡng scroll khác nhau cho mobile/desktop
        const scrollThreshold = isMobile ? 40 : 80;

        if (currentScrollY > scrollThreshold) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Điều chỉnh margin-top banner
        if (banner) {
            const maxMargin = isMobile ? 83 : 133;
            const minMargin = isMobile ? 40 : 70;
            const bannerOffset = Math.max(minMargin, maxMargin - currentScrollY * 0.5);
            banner.style.marginTop = `${bannerOffset}px`;
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateHeader(); // Khởi tạo lần đầu
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    // Xử lý smooth scroll cho anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Chỉ xử lý nếu là anchor link
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ========== BACK TO TOP ==========
function initBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 25px;
        width: 50px;
        height: 50px;
        background: #0068ff;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 9998;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(backToTopButton);

    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    }

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Khởi tạo
}

// ========== KHỞI ĐỘNG TẤT CẢ ==========
document.addEventListener("DOMContentLoaded", () => {
    // 1. Khởi tạo carousel
    const carousel = createAutoCarousel();
    if (carousel) carousel.start();

    // 2. Khởi tạo menu toggle
    initMenuToggle();

    // 3. Set active nav link
    setActiveNavLink();

    // 4. Khởi tạo fixed header
    handleFixedHeader();

    // 5. Khởi tạo smooth scroll
    initSmoothScroll();

    // 6. Khởi tạo back to top button
    initBackToTop();

    // Xử lý resize
    window.addEventListener("resize", () => {
        setTimeout(() => {
            handleFixedHeader();
            if (carousel) carousel.start();
            setActiveNavLink();
        }, 100);
    });
});

// Xử lý khi trang load hoàn toàn
window.addEventListener("load", () => {
    setTimeout(() => {
        handleFixedHeader();
        setActiveNavLink();
    }, 100);
});

// Xử lý khi hash thay đổi (cho single page navigation)
window.addEventListener('hashchange', setActiveNavLink);