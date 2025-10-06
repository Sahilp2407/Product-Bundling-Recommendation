    // Helpers for UPI link based on total
    function getPayAmount() {
        const txt = document.querySelector('.final-price')?.textContent || '';
        const n = Number(String(txt).replace(/[^0-9.]/g, ''));
        return isNaN(n) || n <= 0 ? 0 : n;
    }
    function buildUPILink({ vpa, name, amount, note }) {
        const params = [
            `pa=${encodeURIComponent(vpa)}`,
            `pn=${name || 'TechnoGen'}`,
            amount ? `am=${amount}` : '',
            'cu=INR',
            note ? `tn=${encodeURIComponent(note)}` : ''
        ].filter(Boolean).join('&');
        return `upi://pay?${params}`;
    }
// Product Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab Functionality for Big Deals
    const tabButtons = document.querySelectorAll('.big-deals-tabs button');
    const productCards = document.querySelectorAll('.deal-card');

    function filterProducts(category) {
        productCards.forEach(card => {
            if (category === 'All Deals' || card.dataset.category === category.toLowerCase()) {
                card.closest('.product-link').style.display = 'block';
            } else {
                card.closest('.product-link').style.display = 'none';
            }
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter products based on selected category
            filterProducts(button.textContent.trim());
        });
    });

    // Initialize with "All Deals" category
    // Gallery Navigation
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail-list img');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    let currentImageIndex = 0;

    // Initialize thumbnail click handlers
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            mainImage.src = thumbnail.src;
            currentImageIndex = index;
            updateActiveThumbnail();
        });
    });

    // Previous button click handler
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
        mainImage.src = thumbnails[currentImageIndex].src;
        updateActiveThumbnail();
    });

    // Next button click handler
    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
        mainImage.src = thumbnails[currentImageIndex].src;
        updateActiveThumbnail();
    });

    function updateActiveThumbnail() {
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[currentImageIndex].classList.add('active');
    }

    // Color Selection Functionality
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            colorButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update main image
            const colorImage = button.querySelector('img').src;
            mainImage.src = colorImage;
            // Update current index based on the new color
            currentImageIndex = 0;
            updateActiveThumbnail();
        });
    });

    // Sale Timer Functionality
    function updateTimer() {
        const timerElement = document.querySelector('.timer');
        if (!timerElement) return;

        let time = {
            hours: 11,
            minutes: 50,
            seconds: 13
        };

        setInterval(() => {
            time.seconds--;
            if (time.seconds < 0) {
                time.seconds = 59;
                time.minutes--;
                if (time.minutes < 0) {
                    time.minutes = 59;
                    time.hours--;
                    if (time.hours < 0) {
                        time = { hours: 11, minutes: 50, seconds: 13 }; // Reset timer
                    }
                }
            }
            timerElement.textContent = `${String(time.hours).padStart(2, '0')}h : ${String(time.minutes).padStart(2, '0')}m : ${String(time.seconds).padStart(2, '0')}s`;
        }, 1000);
    }
    updateTimer();

    // Pincode Check Functionality
    const pincodeInput = document.querySelector('.pincode-input input');
    const changeBtn = document.querySelector('.change-btn');
    
    if (changeBtn) {
        changeBtn.addEventListener('click', () => {
            pincodeInput.removeAttribute('readonly');
            pincodeInput.focus();
        });
    }

    if (pincodeInput) {
        pincodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                pincodeInput.setAttribute('readonly', true);
                // Here you can add API call to check delivery availability
                // For now, we'll just show a static message
                const deliveryInfo = document.querySelector('.delivery-info span');
                if (deliveryInfo) {
                    deliveryInfo.textContent = 'Free delivery | By tomorrow';
                }
            }
        });
    }

    // FAQ Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const icon = question.querySelector('i');
            
            // Toggle active class
            faqItem.classList.toggle('active');
            
            // Update icon
            if (faqItem.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });

    // Product Deal Cards Click Handler
    const dealCards = document.querySelectorAll('.deal-card');
    dealCards.forEach(card => {
        card.addEventListener('click', () => {
            const productTitle = card.querySelector('.deal-title').textContent;
            const productSlug = productTitle.toLowerCase().replace(/\s+/g, '-');
            window.location.href = `product.html?product=${encodeURIComponent(productSlug)}`;
        });
    });
});

// Login Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginButtons = document.querySelectorAll('.user-icon');
    const modalOverlay = document.querySelector('.login-modal-overlay');
    const closeButton = document.querySelector('.login-modal .close-btn');
    const loginForm = document.querySelector('.login-form');
    const mobileInput = loginForm.querySelector('input[type="tel"]');
    const notifyCheckbox = document.querySelector('#notify-updates');

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

    // Mobile number validation
    mobileInput.addEventListener('input', function(e) {
        // Remove any non-digit characters
        let value = this.value.replace(/\D/g, '');
        
        // Limit to 10 digits
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        this.value = value;
        
        // Show/hide error message
        const errorMessage = this.parentElement.querySelector('.error-message');
        if (value.length > 0 && value.length < 10) {
            errorMessage.textContent = 'Please enter a valid 10-digit mobile number';
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const mobileNumber = mobileInput.value;
        const notifyUpdates = notifyCheckbox.checked;
        
        // Validate mobile number
        if (mobileNumber.length !== 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';

        // Simulate login process
        setTimeout(() => {
            // Successful login
            loginForm.innerHTML = `
                <div class="success-message">
                    <img src="https://cdn.shopify.com/s/files/1/0057/8938/4802/files/check-circle.png" alt="Success">
                    <h3>Login Successful!</h3>
                    <p>Welcome to boAt Lifestyle</p>
                </div>
            `;

            // Update UI to show logged in state
            document.querySelectorAll('.user-icon').forEach(icon => {
                icon.innerHTML = '<i class="fas fa-user-check"></i>';
            });

            // Store login state in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userMobile', mobileNumber);

            // Close modal after success
            setTimeout(() => {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }, 2000);
        }, 1500);
    });

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        document.querySelectorAll('.user-icon').forEach(icon => {
            icon.innerHTML = '<i class="fas fa-user-check"></i>';
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Product data
    const productData = {
        name: 'Techno‑Gen Sonic Pro',
        basePrice: 1499,
        originalPrice: 4999,
        images: {
            'Mocha Elegance': 'https://www.boat-lifestyle.com/cdn/shop/files/Scene_05_Brown_1300x.png',
            'Mint': 'https://www.boat-lifestyle.com/cdn/shop/files/Scene_05_Teal_1300x.png',
            'Beige': 'https://www.boat-lifestyle.com/cdn/shop/files/Scene_05_CherryBlossom_1300x.png',
            'Purple': 'https://www.boat-lifestyle.com/cdn/shop/files/Scene_05_Purple_1300x.png'
        }
    };

    // Get DOM elements
    const buyNowBtn = document.querySelector('.buy-now');
    const addToCartBtn = document.querySelector('.add-to-cart');
    const checkoutOverlay = document.querySelector('.checkout-popup-overlay');
    const closeCheckout = document.querySelector('.close-checkout');
    const checkoutSteps = document.querySelectorAll('.checkout-steps .step');
    const checkoutSections = document.querySelectorAll('.checkout-section');
    const continueBtns = document.querySelectorAll('.continue-btn');
    const placeOrderBtn = document.querySelector('.place-order-btn');
    // QR payment elements
    const qrSection = document.getElementById('qrSection');
    const qrInput = document.getElementById('qrDataInput');
    const qrBtn = document.getElementById('generateQRBtn');
    const qrContainer = document.getElementById('qrContainer');
    const qrLabel = document.getElementById('qrLabel');
    const qrHint = document.getElementById('qrHint');
    const DEFAULT_UPI_VPA = 'sahilpandeyy@fam';
    const DEFAULT_UPI_NAME = 'Sahil%20Pandey';

    // Cart elements
    const cartItemImage = document.querySelector('.cart-item-image');
    const cartItemName = document.querySelector('.cart-item-name');
    const cartItemColor = document.querySelector('.cart-item-color');
    const quantityBtns = document.querySelectorAll('.qty-btn');
    const quantityDisplay = document.querySelector('.quantity');
    const currentPrice = document.querySelector('.current-price');
    const originalPrice = document.querySelector('.original-price');
    const discount = document.querySelector('.discount');
    const totalMRP = document.querySelector('.total-mrp');
    const totalDiscount = document.querySelector('.total-discount');
    const finalPrice = document.querySelector('.final-price');

    // Cart data
    let cartData = {
        quantity: 1,
        color: 'Mocha Elegance'
    };

    // Bundle extras helpers (reads items added by product-bundles.js via localStorage)
    const CART_KEY = 'shop_cart_v1';
    const BASE_PRODUCT_ID = 'airdopes-181-pro';
    function readBundleExtras() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            const cart = raw ? JSON.parse(raw) : { items: [] };
            const items = Array.isArray(cart.items) ? cart.items : [];
            const extras = items.filter(i => i && i.id && i.id !== BASE_PRODUCT_ID);
            const extrasTotal = extras.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 1), 0);
            return { extras, extrasTotal };
        } catch { return { extras: [], extrasTotal: 0 }; }
    }

    // Handle Buy Now button
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCheckout();
        });
    }

    // Handle Add to Cart button
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
            this.style.backgroundColor = '#00b894';
            
            setTimeout(() => {
                this.innerHTML = 'Add To Cart';
                this.style.backgroundColor = '#000';
                openCheckout();
            }, 1500);
        });
    }

    // Open checkout popup
    function openCheckout() {
        // Ensure single unit by default when opening checkout
        cartData.quantity = 1;
        checkoutOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
        // Reset to first step
        goToStep('cart');
    }

    // Close checkout popup
    if (closeCheckout) {
        closeCheckout.addEventListener('click', function() {
            checkoutOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Handle quantity changes
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const isPlus = this.classList.contains('plus');
            updateQuantity(isPlus);
        });
    });

    function updateQuantity(increase) {
        if (increase && cartData.quantity < 10) {
            cartData.quantity++;
        } else if (!increase && cartData.quantity > 1) {
            cartData.quantity--;
        }
        updateCartDisplay();
    }

    // Update cart display
    function updateCartDisplay() {
        // Base product only in big price row (keep under 1500)
        const baseSubtotal = productData.basePrice * cartData.quantity;
        const baseOriginal = productData.originalPrice * cartData.quantity;
        const baseDiscountAmount = baseOriginal - baseSubtotal;

        // Include bundle extras in totals but cap payable under 2500
        const { extrasTotal } = readBundleExtras();
        const rawSubtotal = baseSubtotal + extrasTotal;
        const rawOriginal = baseOriginal + extrasTotal; // assume no extra discount tag
        const cap = 2499; // keep below 2500 as requested
        const capDiscount = Math.max(0, rawSubtotal - cap);
        const finalSubtotal = Math.max(0, rawSubtotal - capDiscount);
        const finalOriginal = rawOriginal;

        cartItemImage.src = productData.images[cartData.color];
        cartItemName.textContent = productData.name;
        cartItemColor.textContent = `Color: ${cartData.color}`;
        quantityDisplay.textContent = cartData.quantity;

        // Show only base prices in the prominent price row
        currentPrice.textContent = `₹${baseSubtotal}`;
        originalPrice.textContent = `₹${baseOriginal}`;
        discount.textContent = '78% off';

        // Totals (include extras and cap discount)
        totalMRP.textContent = `₹${finalOriginal}`;
        totalDiscount.textContent = `-₹${(baseDiscountAmount + capDiscount)}`;
        finalPrice.textContent = `₹${finalSubtotal}`;

        // Render bundle extras visually under the cart item
        const extrasWrap = document.querySelector('.cart-extras-list');
        const extrasList = document.querySelector('.cart-extras-list .extras-items');
        if (extrasWrap && extrasList) {
            const { extras } = readBundleExtras();
            if (extras.length) {
                extrasWrap.style.display = 'block';
                extrasList.innerHTML = extras.map(x => `
                  <div class="extra-item" style="display:flex;align-items:center;gap:10px;">
                    <img src="${x.image || ''}" alt="${x.name}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;">
                    <div style="flex:1;display:flex;justify-content:space-between;align-items:center;">
                      <span style="font-size:13px;color:#333;">${x.name}</span>
                      <span style="font-weight:600;">₹${(Number(x.price)||0).toLocaleString()}</span>
                    </div>
                  </div>
                `).join('');
            } else {
                extrasWrap.style.display = 'none';
                extrasList.innerHTML = '';
            }
        }
    }

    // Refresh totals if cart (extras) change from the bundle modal
    window.addEventListener('cart:changed', updateCartDisplay);

    // Handle checkout steps (save address when moving to payment)
    continueBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            const nextStep = this.dataset.next;
            if (nextStep === 'payment') {
                try {
                    // Ensure we have a signed-in user (anonymous if needed)
                    await waitForUser();
                    const addr = collectAddressFromForm();
                    if (addr) {
                        // Attach identity fields
                        try { addr.uid = __fb.auth.currentUser?.uid || null; } catch {}
                        addr.fullName = [addr.firstName, addr.lastName].filter(Boolean).join(' ').trim();
                        if (window.DATA) {
                            await window.DATA.addAddress(addr); // Firestore
                        }
                        if (window.RTDB && typeof window.RTDB.addAddress === 'function') {
                            await window.RTDB.addAddress(addr); // Realtime DB
                        }
                        showToast('Address saved');
                    }
                } catch (e) {
                    console.warn('Address save skipped:', e?.message || e);
                }
            }
            goToStep(nextStep);
        });
    });

    function goToStep(step) {
        checkoutSteps.forEach(s => s.classList.remove('active'));
        checkoutSections.forEach(s => s.classList.remove('active'));

        const currentStep = document.querySelector(`[data-step="${step}"]`);
        const currentSection = document.querySelector(`.${step}-section`);

        if (currentStep && currentSection) {
            currentStep.classList.add('active');
            currentSection.classList.add('active');
        }
    }

    // Handle color selection
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            colorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            cartData.color = this.dataset.color;
            updateCartDisplay();
        });
    });

    // Handle form validation
    const deliveryForm = document.querySelector('.delivery-form');
    if (deliveryForm) {
        deliveryForm.addEventListener('input', validateForm);
    }

    // Save Address button
    const saveAddressBtn = document.querySelector('.save-address-btn');
    const saveAddressStatus = document.getElementById('saveAddressStatus');
    if (saveAddressBtn) {
        saveAddressBtn.addEventListener('click', async () => {
            try {
                await waitForUser();
                const addr = collectAddressFromForm();
                if (!addr) { showToast('Fill required fields'); return; }
                try { addr.uid = __fb.auth.currentUser?.uid || null; } catch {}
                addr.fullName = [addr.firstName, addr.lastName].filter(Boolean).join(' ').trim();
                if (window.DATA) await window.DATA.addAddress(addr);
                if (window.RTDB?.addAddress) await window.RTDB.addAddress(addr);
                if (saveAddressStatus) { saveAddressStatus.style.display = 'inline'; }
                showToast('Address saved');
            } catch (e) {
                console.warn('Save address error:', e?.message || e);
                showToast('Could not save address');
            }
        });
    }

    function validateForm() {
        const requiredFields = deliveryForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
            }
        });

        const continueBtn = deliveryForm.nextElementSibling;
        if (continueBtn) {
            continueBtn.disabled = !isValid;
            continueBtn.style.opacity = isValid ? '1' : '0.5';
        }
    }

    // Handle payment selection
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            updatePlaceOrderButton(this.value);
        });
    });

    // QR generation logic
    function clearQR() {
        if (!qrContainer) return;
        qrContainer.innerHTML = '';
    }
    function generateQR(text) {
        clearQR();
        if (!text) return;
        try {
            new QRCode(qrContainer, { text, width: 200, height: 200 });
        } catch (e) { console.warn('QR lib not loaded or error:', e); }
    }
    function renderQRImage(src) {
        clearQR();
        if (!src) return;
        const img = new Image();
        img.src = src;
        img.alt = 'Payment QR';
        img.style.maxWidth = '220px';
        img.style.borderRadius = '12px';
        img.style.boxShadow = '0 10px 24px rgba(0,0,0,.12)';
        qrContainer.appendChild(img);
    }
    qrBtn?.addEventListener('click', (e)=>{
        e.preventDefault();
        const v = (qrInput?.value || '').trim();
        const imgUrl = v && /^https?:\/\//i.test(v) && /(png|jpg|jpeg|webp|gif)(\?.*)?$/i.test(v) ? v : '';
        if (imgUrl) {
            renderQRImage(imgUrl);
            return;
        }
        const data = v || (window.CUSTOM_QR_DATA || '');
        if (!data && !window.CUSTOM_QR_IMAGE_URL) { alert('Paste a UPI/payment link, image URL, or set window.CUSTOM_QR_DATA / CUSTOM_QR_IMAGE_URL'); return; }
        if (window.CUSTOM_QR_IMAGE_URL) renderQRImage(window.CUSTOM_QR_IMAGE_URL); else generateQR(data);
    });

    function updatePlaceOrderButton(paymentMethod) {
        if (placeOrderBtn) {
            const buttonText = {
                'upi': 'Pay with UPI',
                'qr': 'Pay by Scanning QR',
                'card': 'Pay with Card',
                'netbanking': 'Pay with Net Banking',
                'cod': 'Place Order (Cash on Delivery)'
            };
            placeOrderBtn.textContent = buttonText[paymentMethod] || 'Place Order';
        }
        // Toggle QR section visibility
        if (qrSection) {
            const on = paymentMethod === 'qr';
            qrSection.style.display = on ? 'block' : 'none';
            if (on) {
                // Hide controls from end users; only show the QR
                if (qrInput) qrInput.style.display = 'none';
                if (qrBtn) qrBtn.style.display = 'none';
                if (qrLabel) qrLabel.style.display = 'none';
                if (qrHint) qrHint.style.display = 'none';

                // Auto-render preference: custom image -> else deep link QR from VPA
                if (window.CUSTOM_QR_IMAGE_URL) {
                    renderQRImage(window.CUSTOM_QR_IMAGE_URL);
                } else {
                    const amt = getPayAmount();
                    const link = buildUPILink({ vpa: DEFAULT_UPI_VPA, name: DEFAULT_UPI_NAME, amount: amt, note: 'TechnoGen Order' });
                    generateQR(link);
                }
            } else {
                // If switching away, restore controls (optional, hidden by default)
                if (qrInput) qrInput.style.display = '';
                if (qrBtn) qrBtn.style.display = '';
                if (qrLabel) qrLabel.style.display = '';
                if (qrHint) qrHint.style.display = '';
            }
        }
    }

    // Handle order placement
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', async function() {
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            
            if (!selectedPayment) {
                showToast('Please select a payment method');
                return;
            }

            this.textContent = 'Processing...';
            this.disabled = true;

            try {
                // Build order payload
                const amount = getPayAmount();
                const items = buildOrderItems();
                const address = collectAddressFromForm();
                if (window.DATA) {
                    await window.DATA.addOrder({
                        items,
                        amount,
                        paymentMethod: selectedPayment.value,
                        address,
                        status: 'pending'
                    });
                }
                showToast('Order placed successfully!');
            } catch (e) {
                console.warn('Order save failed (continuing UX):', e?.message || e);
                showToast('Order placed! (sync later)');
            } finally {
                setTimeout(() => {
                    checkoutOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                    this.textContent = 'Place Order';
                    this.disabled = false;
                }, 1200);
            }
        });
    }

    // ---- Helpers: collect address and items ----
    function collectAddressFromForm() {
        const form = document.querySelector('.delivery-form');
        if (!form) return null;
        const v = sel => (form.querySelector(sel)?.value || '').trim();
        return {
            firstName: v('input[type="text"]:nth-of-type(1)') || v('input:nth-of-type(1)'),
            lastName: v('input[type="text"]:nth-of-type(2)') || v('input:nth-of-type(2)'),
            email: v('input[type="email"]'),
            phone: v('input[type="tel"]'),
            address: v('textarea'),
            pincode: v('input[type="text"]:nth-of-type(3)') || v('input:nth-of-type(3)'),
            city: v('input[type="text"]:nth-of-type(4)') || v('input:nth-of-type(4)'),
            state: v('select')
        };
    }

    function buildOrderItems() {
        const items = [];
        // Base product
        items.push({ id: BASE_PRODUCT_ID, name: productData.name, price: productData.basePrice, qty: cartData.quantity });
        // Extras
        const { extras } = readBundleExtras();
        extras.forEach(x => items.push({ id: x.id, name: x.name, price: Number(x.price) || 0, qty: Number(x.qty) || 1 }));
        return items;
    }

    // Wait for Firebase auth user (handles anonymous sign-in too)
    function waitForUser(timeoutMs = 4000) {
        return new Promise((resolve) => {
            try {
                if (__fb?.auth?.currentUser) return resolve(__fb.auth.currentUser);
                let done = false;
                const to = setTimeout(()=>{ if (!done) { done = true; resolve(null); } }, timeoutMs);
                __fb.auth.onAuthStateChanged((u)=>{ if (!done) { done = true; clearTimeout(to); resolve(u||null); } });
            } catch {
                resolve(null);
            }
        });
    }

    // Toast notification system
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Open checkout when bundle modal requests it
    window.addEventListener('checkout:open', openCheckout);
    // Re-render if cart changes
    window.addEventListener('cart:changed', updateCartDisplay);
});