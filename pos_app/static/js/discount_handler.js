document.addEventListener('DOMContentLoaded', function() {
    //for the window manager of pin
    const pinModal = document.createElement('div');
    pinModal.className = 'pin-modal';
    pinModal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000;';
    pinModal.innerHTML = `
        <div class="pin-modal-content">
            <span class="close">&times;</span>
            <h2 class="pin-modal-title">Enter Discount Details</h2>
            <div class="discount-input-group">
                <input type="number" class="discount-percent-input" min="0" max="100" placeholder="Enter discount percentage">
                <input type="password" class="pin-input" maxlength="4" placeholder="Enter PIN">
            </div>
            <div class="pin-error"></div>
            <div class="pin-action-buttons">
                <button class="pin-button pin-enter">Apply Discount</button>
            </div>
        </div>
    `;
    document.body.appendChild(pinModal);

    //all the event listenrs for the pin window thing
    const managerDiscountBtn = document.getElementById('discount-manager');
    if (managerDiscountBtn) {
        managerDiscountBtn.addEventListener('click', e => {
            e.preventDefault();
            pinModal.style.display = 'flex';
            document.querySelector('.discount-percent-input').focus();
        });
    }

    document.querySelector('.pin-enter').onclick = function() {
        const pin = document.querySelector('.pin-input').value;
        const discountPercent = parseFloat(document.querySelector('.discount-percent-input').value);

        if (!discountPercent || discountPercent <= 0 || discountPercent > 100) {
            document.querySelector('.pin-error').textContent = 'Please enter a valid discount percentage (1-100)';
            return;
        }

        if (pin === '1234') {
            const subtotal = parseFloat(document.getElementById('subtotal').innerText.replace('$', ''));
            const discount = subtotal * (discountPercent / 100);
            
            document.getElementById('discount').innerText = `$${discount.toFixed(2)}`;
            if (typeof window.discount !== 'undefined') window.discount = discount;
            if (typeof window.updateTransaction === 'function') window.updateTransaction();

            pinModal.style.display = 'none';
            clearInputs();
        } else {
            document.querySelector('.pin-error').textContent = 'Invalid PIN';
            document.querySelector('.pin-input').value = '';
        }
    };

    function clearInputs() {
        document.querySelector('.pin-input').value = '';
        document.querySelector('.discount-percent-input').value = '';
        document.querySelector('.pin-error').textContent = '';
    }

    
    document.querySelector('.close').onclick = () => {
        pinModal.style.display = 'none';
        clearInputs();
    };

    window.onclick = e => {
        if (e.target === pinModal) {
            pinModal.style.display = 'none';
            clearInputs();
        }
    };
}); 