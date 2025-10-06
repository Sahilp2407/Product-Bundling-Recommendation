document.addEventListener('DOMContentLoaded', function () {
    // Banner carousel arrow functionality
    const carousel = document.querySelector('.carousel-wrapper');
    const banners = document.querySelectorAll('.carousel-banner');
    const leftArrow = document.querySelector('.carousel-arrow.left');
    const rightArrow = document.querySelector('.carousel-arrow.right');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentIndex = 0;
    let autoSlideInterval;

    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }



    function scrollToBanner(index) {
        if (!carousel || !banners.length) return;
        carousel.style.transform = `translateX(-${index * 100}%)`;
        updateDots(index);
    }

    function nextBanner() {
        currentIndex = (currentIndex + 1) % banners.length;
        scrollToBanner(currentIndex);
    }

    function prevBanner() {
        currentIndex = (currentIndex - 1 + banners.length) % banners.length;
        scrollToBanner(currentIndex);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextBanner, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    leftArrow && leftArrow.addEventListener('click', function (e) {
        e.preventDefault();
        prevBanner();
        stopAutoSlide();
        startAutoSlide();
    });

    rightArrow && rightArrow.addEventListener('click', function (e) {
        e.preventDefault();
        nextBanner();
        stopAutoSlide();
        startAutoSlide();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', function() {
            currentIndex = i;
            scrollToBanner(currentIndex);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Optional: update currentIndex on manual scroll (for better UX)
    carousel && carousel.addEventListener('scroll', function () {
        let closest = 0;
        let minDiff = Infinity;
        banners.forEach((banner, i) => {
            const diff = Math.abs(banner.getBoundingClientRect().left - carousel.getBoundingClientRect().left);
            if (diff < minDiff) {
                minDiff = diff;
                closest = i;
            }
        });
        currentIndex = closest;
        updateDots(currentIndex);
    });

    // Initialize
    scrollToBanner(currentIndex);
    startAutoSlide();
});

// Sample product data
const products = [
    {
        id: 1,
        name: "Airdopes 311 PRO",
        category: "True Wireless",
        price: 899,
        originalPrice: 4990,
        rating: 4.6,
        reviews: 83,
        image: "/boat/ad 311 pro 1.png",
        features: ["50 Hours Playback", "New Launch", "noise-cancelling", "fast-charging"]
    },
    {
        id: 2,
        name: "Rockerz 235 Pro",
        category: "Neckbands",
        price: 899,
        originalPrice: 1990,
        rating: 4.9,
        reviews: 133,
        image: "//www.boat-lifestyle.com/cdn/shop/products/main_2_53c3483e-38d0-4a88-a8e0-b75fe5b23584_600x.png",
        features: ["20 Hours Playback", "Trending", "waterproof", "bluetooth"]
    },
    {
        id: 3,
        name: "Storm Call 3 Plus",
        category: "Smartwatches",
        price: 1449,
        originalPrice: 7499,
        rating: 5.0,
        reviews: 7,
        image: "//www.boat-lifestyle.com/cdn/shop/files/Artboard_12_copy_5_1800x.png",
        features: ["BT Calling", "New Launch", "waterproof"]
    },
    {
        id: 4,
        name: "Airdopes 161 Pro",
        category: "True Wireless",
        price: 1199,
        originalPrice: 4490,
        rating: 4.8,
        reviews: 45,
        image: "//www.boat-lifestyle.com/cdn/shop/files/A161Pro_BLACK_600x.png",
        features: ["40 Hours Playback", "fast-charging", "bluetooth"]
    },
    {
        id: 5,
        name: "Stone 1500F",
        category: "Speakers",
        price: 3499,
        originalPrice: 6990,
        rating: 4.9,
        reviews: 92,
        image: "//www.boat-lifestyle.com/cdn/shop/files/STONE350PRO_Blue_08_1500x.jpg",
        features: ["14 Hours Playback", "waterproof", "bluetooth"]
    },
    {
        id: 6,
        name: "Wave Flex Connect",
        category: "Smartwatches",
        price: 1499,
        originalPrice: 7990,
        rating: 4.7,
        reviews: 156,
        image: "//www.boat-lifestyle.com/cdn/shop/products/WaveFlexConnectPackaging1.2_1800x.png",
        features: ["HD Display", "BT Calling", "health-tracking", "waterproof"]
    },
    {
        id: 7,
        name: "Immortal 700",
        category: "Gaming",
        price: 2499,
        originalPrice: 5990,
        rating: 4.8,
        reviews: 67,
        image: "//www.boat-lifestyle.com/cdn/shop/products/main1_65ff249b-c4f8-4dad-ae88-2aae76723ce2_600x.png",
        features: ["7.1 Channel", "RGB Lights", "noise-cancelling", "low-latency"]
    },
    {
        id: 8,
        name: "Airdopes Max",
        category: "True Wireless",
        price: 1999,
        originalPrice: 5990,
        rating: 4.5,
        reviews: 234,
        image: "//www.boat-lifestyle.com/cdn/shop/files/AD_Max_Packaging_1.3-removebg-preview_500x.png",
        features: ["100 Hours Playback", "noise-cancelling", "fast-charging", "bluetooth"]
    },
    {
        id: 9,
        name: "Stone 350",
        category: "Speakers",
        price: 1699,
        originalPrice: 3490,
        rating: 4.3,
        reviews: 189,
        image: "//www.boat-lifestyle.com/cdn/shop/products/74a6b20d-9842-49da-b279-022812b81e1f_600x.png",
        features: ["12 Hours Playback", "waterproof", "bluetooth"]
    },
    {
        id: 10,
        name: "Rockerz 550",
        category: "Wireless Headphones",
        price: 1999,
        originalPrice: 4999,
        rating: 4.6,
        reviews: 445,
        image: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Rockerz-550.png",
        features: ["20 Hours Playback", "bluetooth", "fast-charging"]
    },
    {
        id: 11,
        name: "Wave Style",
        category: "Smartwatches",
        price: 999,
        originalPrice: 4999,
        rating: 4.4,
        reviews: 321,
        image: "//www.boat-lifestyle.com/cdn/shop/products/black_17fefa7c-3b62-403b-ab33-6e2949597e59_600x.png",
        features: ["health-tracking", "waterproof"]
    },
    {
        id: 12,
        name: "Stone 1200F",
        category: "Speakers",
        price: 3999,
        originalPrice: 7990,
        rating: 4.7,
        reviews: 167,
        image: "//www.boat-lifestyle.com/cdn/shop/products/e57bbbe7-5e99-4c43-8cf8-0ddd42caf3d3_600x.png",
        features: ["100W RMS", "RGB Lights", "waterproof", "bluetooth"]
    },
    {
        id: 13,
        name: "Immortal 300",
        category: "Gaming",
        price: 1499,
        originalPrice: 3990,
        rating: 4.2,
        reviews: 89,
        image: "//www.boat-lifestyle.com/cdn/shop/products/2_5b22314d-3d06-41ee-8ff8-6dbc83e27ab1_800x.png",
        features: ["low-latency", "noise-cancelling"]
    },
    {
        id: 14,
        name: "Airdopes Atom 81",
        category: "True Wireless",
        price: 899,
        originalPrice: 3499,
        rating: 4.1,
        reviews: 278,
        image: "//www.boat-lifestyle.com/cdn/shop/products/3_743027d7-94ca-43e1-9c04-72ad6483c226_800x.png",
        features: ["30 Hours Playback", "fast-charging", "bluetooth"]
    },
    {
        id: 15,
        name: "Rockerz 450 Pro",
        category: "Wireless Headphones",
        price: 1499,
        originalPrice: 3990,
        rating: 4.8,
        reviews: 512,
        image: "//www.boat-lifestyle.com/cdn/shop/files/Rockerz_450_Pro_14_1800x.png",
        features: ["70 Hours Playback", "bluetooth", "fast-charging"]
    },
    {
        id: 16,
        name: "Party Pal 200",
        category: "Speakers",
        price: 8999,
        originalPrice: 17990,
        rating: 4.9,
        reviews: 45,
        image: "//www.boat-lifestyle.com/cdn/shop/products/main-im_1800x.png",
        features: ["150W RMS", "RGB Lights", "karaoke", "bluetooth"]
    },
    {
        id: 17,
        name: "Wave Call 2",
        category: "Smartwatches",
        price: 1799,
        originalPrice: 6990,
        rating: 4.7,
        reviews: 123,
        image: "//www.boat-lifestyle.com/cdn/shop/files/SC2_WC2_Astra_SilverMetalMesh__2_-removebg-preview_500x.png",
        features: ["BT Calling", "health-tracking", "waterproof"]
    },
    {
        id: 18,
        name: "Airdopes 441 Pro",
        category: "True Wireless",
        price: 2499,
        originalPrice: 5999,
        rating: 4.6,
        reviews: 345,
        image: "//www.boat-lifestyle.com/cdn/shop/products/main2_41abf7ad-3d7f-4189-a93a-08fefd02ba45_600x.png",
        features: ["150 Hours Playback", "noise-cancelling", "fast-charging", "bluetooth"]
    },
    {
        id: 19,
        name: "Immortal 1000D",
        category: "Gaming",
        price: 5999,
        originalPrice: 14990,
        rating: 4.8,
        reviews: 78,
        image: "//www.boat-lifestyle.com/cdn/shop/products/2_f3aa2756-01f3-4e39-80bc-7b4f6551c7aa_600x.png",
        features: ["7.1 Channel", "RGB Lights", "noise-cancelling", "low-latency"]
    },
    {
        id: 20,
        name: "Stone 2000",
        category: "Speakers",
        price: 5999,
        originalPrice: 11990,
        rating: 4.7,
        reviews: 234,
        image: "//www.boat-lifestyle.com/cdn/shop/products/e57bbbe7-5e99-4c43-8cf8-0ddd42caf3d3_600x.png",
        features: ["200W RMS", "RGB Lights", "waterproof", "bluetooth", "karaoke"]
    },
    // Phones (NEW)
    {
        id: 21,
        name: "iPhone 15",
        category: "Phones",
        price: 69999,
        originalPrice: 79990,
        rating: 4.9,
        reviews: 1234,
        image: "https://images.unsplash.com/photo-1695048132329-iphone15?auto=format&fit=crop&w=800&q=60",
        features: ["A16 Bionic", "fast-charging", "bluetooth"]
    },
    {
        id: 22,
        name: "Samsung Galaxy S23",
        category: "Phones",
        price: 64999,
        originalPrice: 74999,
        rating: 4.8,
        reviews: 980,
        image: "https://images.unsplash.com/photo-1682687220063-galaxy?auto=format&fit=crop&w=800&q=60",
        features: ["120Hz AMOLED", "fast-charging", "bluetooth"]
    },
    {
        id: 23,
        name: "OnePlus 12",
        category: "Phones",
        price: 59999,
        originalPrice: 69999,
        rating: 4.7,
        reviews: 750,
        image: "https://images.unsplash.com/photo-1600697395543-oneplus?auto=format&fit=crop&w=800&q=60",
        features: ["Snapdragon 8 Gen", "fast-charging", "bluetooth"]
    }
];

// Function to create product cards
function createProductCard(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    return ` 
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="product-info">
                <div class="product-rating">
                    <span class="stars">★</span>
                    <span class="rating">${product.rating}</span>
                    <span class="reviews">${product.reviews} verified reviews</span>
                </div>
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                    <span class="discount">${discount}% off</span>
                </div>
            </div>
        </div>
    `;
}

// Function to initialize the product grid
function initializeProductGrid() {
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        // Exclude Phones here so they only appear in the Latest Phones section
        const nonPhoneProducts = products.filter(p => (p.category || '').toLowerCase() !== 'phones');
        productGrid.innerHTML = nonPhoneProducts.map(product => createProductCard(product)).join('');
    }
}

// Handle newsletter form submission
function initializeNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            if (email) {
                alert('Thank you for subscribing to our newsletter!');
                form.reset();
            }
        });
    }
}

// Handle search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            
            const productGrid = document.querySelector('.product-grid');
            if (productGrid) {
                productGrid.innerHTML = filteredProducts
                    .filter(p => (p.category || '').toLowerCase() !== 'phones')
                    .map(product => createProductCard(product)).join('');
            }
        });
    }
}

// Mobile menu toggle
function initializeMobileMenu() {
    const menuButton = document.createElement('button');
    menuButton.classList.add('mobile-menu-toggle');
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('.main-nav');
    if (nav) {
        nav.insertBefore(menuButton, nav.firstChild);
        
        menuButton.addEventListener('click', () => {
            nav.classList.toggle('mobile-menu-open');
        });
    }
}

// Add smooth scrolling to all links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href') || '';
            // Ignore bare '#' or invalid selectors
            if (href === '#' || href.trim() === '') return;
            e.preventDefault();
            let target = null;
            try {
                target = document.querySelector(href);
            } catch (_) {
                // invalid CSS selector like '#'
                return;
            }
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Login Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginButtons = document.querySelectorAll('.user-icon');
    const modalOverlay = document.querySelector('.login-modal-overlay');
    const closeButton = document.querySelector('.login-modal .close-btn');
    const loginForm = document.querySelector('.login-form');
    const mobileInput = document.querySelector('#login-mobile');
    const errorText = document.querySelector('.login-form .error-text');
    const tabs = document.querySelectorAll('.login-tabs .tab-btn');
    const mobileGroup = document.querySelectorAll('.login-form .mobile-group');
    const emailGroups = document.querySelectorAll('.login-form .email-group');
    const whatsappCheckbox = document.querySelector('#notify-updates');
    const emailInput = document.querySelector('#login-email');
    const passwordInput = document.querySelector('#login-password');
    let loginMode = 'mobile';

    // Wire up modal only if elements exist
    if (modalOverlay && closeButton && loginButtons.length) {
        // Open modal when clicking login button
        loginButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close modal when clicking close button
        closeButton.addEventListener('click', function() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });

        // Close modal when clicking outside
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }

    // Live sanitize input
    if (mobileInput) {
        mobileInput.addEventListener('input', () => {
            const digits = mobileInput.value.replace(/\D/g, '').slice(0, 15);
            if (mobileInput.value !== digits) mobileInput.value = digits;
            if (digits.length > 0 && (digits.length < 8 || digits.length > 15)) {
                if (errorText) { errorText.textContent = 'Please enter a valid mobile number (8–15 digits)'; }
            } else {
                if (errorText) { errorText.textContent = ''; }
            }
        });
    }

    // Handle form submission safely
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('.primary-btn, button[type="submit"]');
            if (loginMode === 'mobile') {
                const digits = (mobileInput?.value || '').replace(/\D/g, '');
                const notifyUpdates = this.querySelector('#notify-updates')?.checked ?? false;
                if (digits.length < 8 || digits.length > 15) {
                    if (errorText) { errorText.textContent = 'Please enter a valid mobile number (8–15 digits)'; }
                    mobileInput?.focus();
                    return;
                }
                // Simulate success UI (no OTP flow implemented)
                submitBtn?.setAttribute('disabled', 'true');
                submitBtn?.classList.add('loading');
                if (errorText) { errorText.textContent = ''; }
                console.log('Mobile:', digits, 'Notify:', notifyUpdates);
                const success = document.createElement('div');
                success.style.textAlign = 'center';
                success.style.padding = '8px 0';
                success.innerHTML = '<span style="color:#0b8a00;font-weight:600;">Login successful</span>';
                this.appendChild(success);
                // Close immediately for responsiveness
                if (modalOverlay) {
                    modalOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                if (submitBtn) {
                    submitBtn.removeAttribute('disabled');
                    submitBtn.classList.remove('loading');
                }
                // persist simple logged-in state
                try {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userMobile', digits);
                    document.querySelectorAll('.user-icon').forEach(icon => {
                        icon.innerHTML = '<i class="fas fa-user-check"></i>';
                    });
                } catch(_) {}
                // remove success banner after close
                setTimeout(() => { try { success.remove(); } catch(_) {} }, 500);
            } else {
                // Email mode using Firebase Auth (requires enabled Email/Password sign-in in Console)
                const email = (emailInput?.value || '').trim();
                const password = (passwordInput?.value || '').trim();
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    if (errorText) errorText.textContent = 'Enter a valid email';
                    emailInput?.focus();
                    return;
                }
                if (!password || password.length < 6) {
                    if (errorText) errorText.textContent = 'Password must be at least 6 characters';
                    passwordInput?.focus();
                    return;
                }
                submitBtn?.setAttribute('disabled', 'true');
                submitBtn.textContent = 'Signing in...';
                const { signInWithEmailAndPassword, createUserWithEmailAndPassword, auth } = window.__fb || {};
                const finish = (ok, msg) => {
                    submitBtn?.removeAttribute('disabled');
                    submitBtn.textContent = 'Continue';
                    if (!ok) { if (errorText) errorText.textContent = msg || 'Login failed'; return; }
                    if (errorText) errorText.textContent = '';
                    modalOverlay?.classList.remove('active');
                    document.body.style.overflow = '';
                };
                if (signInWithEmailAndPassword && createUserWithEmailAndPassword && auth) {
                    signInWithEmailAndPassword(auth, email, password)
                        .then(() => finish(true))
                        .catch(err => {
                            if (err && err.code === 'auth/user-not-found') {
                                // Create account then sign-in
                                createUserWithEmailAndPassword(auth, email, password)
                                  .then(() => finish(true))
                                  .catch(e => finish(false, e.message));
                            } else {
                                finish(false, err?.message);
                            }
                        });
                } else {
                    finish(false, 'Auth not initialized');
                }
            }
        });
    }
});

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProductGrid();
    initializeNewsletterForm();
    initializeSearch();
    initializeMobileMenu();
    initializeSmoothScroll();
    // Render phones row directly under Big Deals
    renderPhonesRow();
    
    // Big Deals tabs filtering (robust to missing wrappers)
    const tabButtons = document.querySelectorAll('.big-deals-tabs .tab');
    const dealCards = document.querySelectorAll('.big-deals .deal-card');
    if (tabButtons.length && dealCards.length) {
        const applyFilter = (category) => {
            dealCards.forEach(card => {
                const matches = category === 'all' || card.dataset.category === category;
                card.style.display = matches ? '' : 'none';
            });
        };

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.dataset.category || 'all';
                applyFilter(cat);
            });
        });

        // Initialize with active tab
        const activeBtn = document.querySelector('.big-deals-tabs .tab.active');
        applyFilter(activeBtn?.dataset.category || 'all');
    }
    
    // Add additional CSS for product cards
    const style = document.createElement('style');
    style.textContent = `
        .product-card {
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.3s;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
        }
        
        .product-image {
            position: relative;
            padding-top: 100%;
        }
        
        .product-image img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .feature-tag {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #ff0000;
            color: #fff;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            margin-right: 5px;
        }
        
        .product-info {
            padding: 15px;
        }
        
        .product-rating {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 10px;
        }
        
        .stars {
            color: #ffd700;
        }
        
        .reviews {
            color: #666;
            font-size: 12px;
        }
        
        .product-price {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }
        
        .current-price {
            font-size: 20px;
            font-weight: bold;
        }
        
        .original-price {
            text-decoration: line-through;
            color: #666;
        }
        
        .discount {
            color: #ff0000;
            font-weight: bold;
        }
        
        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block;
            }
            
            .nav-links {
                display: none;
            }
            
            .mobile-menu-open .nav-links {
                display: flex;
            }
        }
    `;
    document.head.appendChild(style);
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the product display
    displayProducts(products);

    // Add event listeners to all filter checkboxes
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // Add event listener to sort select
    document.getElementById('sort-select').addEventListener('change', filterProducts);

    // Add event listener to clear filters button
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
});

function clearFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset sort select
    document.getElementById('sort-select').value = 'featured';

    // Show all products
    displayProducts(products);
}

function filterProducts() {
    let filteredProducts = [...products];
    const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .filter(cb => ['true-wireless', 'speakers', 'smartwatches', 'gaming', 'wireless-headphones', 'neckbands', 'phones'].includes(cb.value))
        .map(cb => cb.value);

    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category.toLowerCase().replace(/\s+/g, '-'))
        );
    }

    // Price Range Filter
    const selectedPriceRanges = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .filter(cb => ['under-1000', '1000-2000', '2000-5000', '5000-10000', 'above-10000'].includes(cb.value))
        .map(cb => cb.value);

    if (selectedPriceRanges.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return selectedPriceRanges.some(range => {
                switch(range) {
                    case 'under-1000': return product.price < 1000;
                    case '1000-2000': return product.price >= 1000 && product.price <= 2000;
                    case '2000-5000': return product.price > 2000 && product.price <= 5000;
                    case '5000-10000': return product.price > 5000 && product.price <= 10000;
                    case 'above-10000': return product.price > 10000;
                    default: return true;
                }
            });
        });
    }

    // Features Filter
    const selectedFeatures = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .filter(cb => [
            'noise-cancelling', 'waterproof', 'bluetooth', 'fast-charging',
            'rgb-lights', 'health-tracking', 'bt-calling', 'low-latency'
        ].includes(cb.value))
        .map(cb => cb.value);

    if (selectedFeatures.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedFeatures.every(feature => 
                product.features.some(f => f.toLowerCase().replace(/\s+/g, '-') === feature)
            )
        );
    }

    // Rating Filter
    const selectedRatings = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .filter(cb => ['4.5-plus', '4-plus', '3.5-plus'].includes(cb.value))
        .map(cb => cb.value);

    if (selectedRatings.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return selectedRatings.some(rating => {
                switch(rating) {
                    case '4.5-plus': return product.rating >= 4.5;
                    case '4-plus': return product.rating >= 4.0;
                    case '3.5-plus': return product.rating >= 3.5;
                    default: return true;
                }
            });
        });
    }

    // Sort Products
    const sortBy = document.getElementById('sort-select').value;
    switch(sortBy) {
        case 'price-low-high':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high-low':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'reviews':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'newest':
            // Assuming higher IDs are newer products
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default: // 'featured'
            // Keep original order
            break;
    }

    // Display filtered and sorted products
    displayProducts(filteredProducts);
}