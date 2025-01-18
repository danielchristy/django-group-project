// hadnling updates for transaction info

document.addEventListener('DOMContentLoaded', function () {
    let subtotal = 0;
    let taxRate = 0.07;
    let discount = 0;

    // updating payment interacfe 
    function updateTransaction() {
        let tax = subtotal * taxRate;
        let grandTotal = subtotal + tax - discount;

        document.getElementById('subtotal').innerText = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').innerText = `$${tax.toFixed(2)}`;
        document.getElementById('discount').innerText = `$${discount.toFixed(2)}`;
        document.getElementById('grand-total').innerText = `$${grandTotal.toFixed(2)}`;
    }

    function updateSubtotal() {
        subtotal = 0;
        let items = document.querySelectorAll('#checkout-items tr');
        items.forEach(function (row) {
            // this is where the bad econmy butg was 
            let price = parseFloat(row.querySelector('td:nth-child(2)').innerText.replace('$', ''));
            let quantity = parseInt(row.querySelector('.item-quantity').value, 10);
            let total = price * quantity;
            row.querySelector('.item-total').innerText = `$${total.toFixed(2)}`;
            subtotal += total;
        });
        updateTransaction();
    }

    // event listeners for changes in checkout list
    document.querySelectorAll('.item-quantity').forEach(function (input) {
        input.addEventListener('change', updateSubtotal);
    });

    document.querySelectorAll('.remove-item').forEach(function (button) {
        button.addEventListener('click', function () {
            let row = button.closest('tr');
            row.remove();
            updateSubtotal();
        });
    });

    // event listeners for applying discounts
    const discountButtons = {
        'discount-single-item': 0.15,
        'discount-rewards-member': 0.10,
        'discount-employee': 0.15,
        'discount-manager': 1.00
    };

    // Add event listeners for discount buttons that exist
    Object.keys(discountButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                discount = subtotal * discountButtons[buttonId];
                updateTransaction();
            });
        }
    });

    // Make addItemToCheckout available globally
    window.addItemToCheckout = function(item) {
        const checkoutItems = document.getElementById('checkout-items');
        
        // Check if item already exists in checkout
        const existingRow = Array.from(checkoutItems.getElementsByTagName('tr')).find(
            row => row.dataset.itemId === item.id.toString()
        );

        if (existingRow) {
            // If item exists, increment quantity
            const quantityInput = existingRow.querySelector('.item-quantity');
            quantityInput.value = parseInt(quantityInput.value) + 1;
            updateSubtotal();
            return;
        }

        // Create new row for item
        const row = document.createElement('tr');
        row.dataset.itemId = item.id;
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.cost.toFixed(2)}</td>
            <td>
                <input type="number" class="item-quantity" value="1" min="1" style="width: 60px;">
            </td>
            <td class="item-total">$${item.cost.toFixed(2)}</td>
            <td>
                <button class="remove-item">Remove</button>
            </td>
        `;

        // Add event listeners for the new row
        const quantityInput = row.querySelector('.item-quantity');
        quantityInput.addEventListener('change', updateSubtotal);

        const removeButton = row.querySelector('.remove-item');
        removeButton.addEventListener('click', function() {
            row.remove();
            updateSubtotal();
        });

        checkoutItems.appendChild(row);
        updateSubtotal();
    };

    updateSubtotal();
});