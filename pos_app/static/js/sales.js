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
            let price = parseFloat(row.querySelector('td:nth-child(4)').innerText.replace('$', ''));
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

    // event listeners for applyign discounts
    document.getElementById('discount-15').addEventListener('click', function () {
        discount = subtotal * 0.15;
        updateTransaction();
    });

    document.getElementById('discount-rewards').addEventListener('click', function () {
        discount = subtotal * 0.10;
        updateTransaction();
    });

    document.getElementById('discount-employee').addEventListener('click', function () {
        discount = subtotal * 0.15;
        updateTransaction();
    });

    document.getElementById('discount-manager').addEventListener('click', function () {
        discount = subtotal * 1;
        updateTransaction();
    });

    // need to add barcode search logic


    updateSubtotal();
});