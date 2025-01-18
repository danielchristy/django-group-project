document.addEventListener('DOMContentLoaded', function() {
    // PIN configuration
    const MANAGER_PIN = '1234'; // This should be stored securely in production
    let currentPin = '';
    
    // Create and append PIN modal to body
    const pinModal = document.createElement('div');
    pinModal.className = 'pin-modal';
    pinModal.innerHTML = `
        <div class="pin-modal-content">
            <h2 class="pin-modal-title">Enter Manager PIN</h2>
            <div class="pin-dots">
                <div class="pin-dot"></div>
                <div class="pin-dot"></div>
                <div class="pin-dot"></div>
                <div class="pin-dot"></div>
            </div>
            <div class="pin-error"></div>
            <div class="pin-pad">
                <button class="pin-button">1</button>
                <button class="pin-button">2</button>
                <button class="pin-button">3</button>
                <button class="pin-button">4</button>
                <button class="pin-button">5</button>
                <button class="pin-button">6</button>
                <button class="pin-button">7</button>
                <button class="pin-button">8</button>
                <button class="pin-button">9</button>
                <button class="pin-button"></button>
                <button class="pin-button">0</button>
                <button class="pin-button"></button>
            </div>
            <div class="pin-action-buttons">
                <button class="pin-button pin-clear">Clear</button>
                <button class="pin-button pin-enter">Enter</button>
            </div>
        </div>
    `;
    document.body.appendChild(pinModal);

    // PIN pad functionality
    function updatePinDisplay() {
        const dots = document.querySelectorAll('.pin-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('filled', index < currentPin.length);
        });
    }

    function clearPin() {
        currentPin = '';
        updatePinDisplay();
        document.querySelector('.pin-error').textContent = '';
    }

    function showPinError(message) {
        document.querySelector('.pin-error').textContent = message;
    }

    // Event listeners for PIN pad
    document.querySelectorAll('.pin-button').forEach(button => {
        if (button.textContent.match(/[0-9]/)) {
            button.addEventListener('click', () => {
                if (currentPin.length < 4) {
                    currentPin += button.textContent;
                    updatePinDisplay();
                }
            });
        }
    });

    document.querySelector('.pin-clear').addEventListener('click', clearPin);

    document.querySelector('.pin-enter').addEventListener('click', () => {
        if (currentPin === MANAGER_PIN) {
            pinModal.style.display = 'none';
            clearPin();
            // Trigger the discount after successful PIN entry
            if (window.pendingDiscountCallback) {
                window.pendingDiscountCallback();
                window.pendingDiscountCallback = null;
            }
        } else {
            showPinError('Invalid PIN. Please try again.');
            clearPin();
        }
    });

    // Function to show PIN modal
    window.showPinModal = function(callback) {
        currentPin = '';
        updatePinDisplay();
        document.querySelector('.pin-error').textContent = '';
        pinModal.style.display = 'flex';
        window.pendingDiscountCallback = callback;
    };

    // Close modal if clicking outside
    pinModal.addEventListener('click', (e) => {
        if (e.target === pinModal) {
            pinModal.style.display = 'none';
            clearPin();
            window.pendingDiscountCallback = null;
        }
    });

    // Define which discounts need manager approval and their rates
    const discountConfig = {
        'discount-single-item': {
            rate: 0.15,  // 15% discount
            requiresAuth: true
        },
        'discount-rewards-member': {
            rate: 0.10,  // 10% discount
            requiresAuth: false
        },
        'discount-employee': {
            rate: 0.15,  // 15% discount
            requiresAuth: true
        },
        'discount-manager': {
            rate: 1.00,  // 100% discount
            requiresAuth: true
        }
    };

    // Add event listeners for all discount buttons
    Object.keys(discountConfig).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const config = discountConfig[buttonId];
                
                if (config.requiresAuth) {
                    // Show PIN modal for protected discounts
                    showPinModal(() => {
                        applyDiscount(config.rate);
                    });
                } else {
                    // Apply discount immediately for non-protected discounts
                    applyDiscount(config.rate);
                }
            });
        }
    });

    // Function to apply discount
    function applyDiscount(rate) {
        const subtotal = parseFloat(document.getElementById('subtotal').innerText.replace('$', ''));
        const discount = subtotal * rate;
        document.getElementById('discount').innerText = `$${discount.toFixed(2)}`;
        // Update the transaction totals
        if (typeof updateTransaction === 'function') {
            updateTransaction();
        }
    }
}); 