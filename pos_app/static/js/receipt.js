// Search and checkout functionality
document.getElementById('search-btn').addEventListener('click', searchItem);
document.getElementById('barcode').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchItem();
    }
});

function searchItem() {
    const barcode = document.getElementById('barcode').value;
    
    fetch(`/api/item/search/?barcode=${barcode}`)
        .then(response => response.json())
        .then(item => {
            if (item) {
                addItemToCheckout(item);
                document.getElementById('barcode').value = ''; // Clear input
            } else {
                alert('Item not found');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error searching for item');
        });
}

function addItemToCheckout(item) {
    const tbody = document.getElementById('checkout-items');
    
    // Check if item already exists in checkout
    const existingRow = tbody.querySelector(`tr[data-item-id="${item.id}"]`);
    if (existingRow) {
        // Increment quantity if item exists
        const quantityInput = existingRow.querySelector('.quantity-input');
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateRowTotal(existingRow);
    } else {
        // Add new row if item doesn't exist
        const row = document.createElement('tr');
        row.setAttribute('data-item-id', item.id);
        
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.cost}</td>
            <td>
                <input type="number" class="quantity-input" value="1" min="1" 
                       onchange="updateRowTotal(this.parentElement.parentElement)">
            </td>
            <td>$${item.cost}</td>
            <td>
                <button onclick="removeItem(this.parentElement.parentElement)">Remove</button>
            </td>
        `;
        
        tbody.appendChild(row);
    }
    
    updateTotals();
}

function updateRowTotal(row) {
    const price = parseFloat(row.cells[1].textContent.replace('$', ''));
    const quantity = parseInt(row.querySelector('.quantity-input').value);
    const total = price * quantity;
    row.cells[3].textContent = `$${total.toFixed(2)}`;
    updateTotals();
}

function removeItem(row) {
    row.remove();
    updateTotals();
}

function updateTotals() {
    let subtotal = 0;
    document.querySelectorAll('#checkout-items tr').forEach(row => {
        subtotal += parseFloat(row.cells[3].textContent.replace('$', ''));
    });
    
    const tax = subtotal * 0.07;
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('grand-total').textContent = `$${total.toFixed(2)}`;
}

// Receipt functionality
function showReceipt() {
    const modal = document.getElementById('receiptModal');
    const receiptItems = document.getElementById('receipt-items');
    const datetime = new Date().toLocaleString();
    
    // Clear previous items
    receiptItems.innerHTML = '';
    
    // Add items from checkout
    document.querySelectorAll('#checkout-items tr').forEach(row => {
        const name = row.cells[0].textContent;
        const price = row.cells[1].textContent;
        const quantity = row.querySelector('.quantity-input').value;
        const total = row.cells[3].textContent;
        
        const receiptRow = document.createElement('tr');
        receiptRow.innerHTML = `
            <td>${name}</td>
            <td>${quantity}</td>
            <td>${price}</td>
            <td>${total}</td>
        `;
        receiptItems.appendChild(receiptRow);
    });
    
    // Update totals
    document.getElementById('receipt-subtotal').textContent = document.getElementById('subtotal').textContent;
    document.getElementById('receipt-tax').textContent = document.getElementById('tax').textContent;
    document.getElementById('receipt-total').textContent = document.getElementById('grand-total').textContent;
    
    // Set datetime
    document.querySelector('.receipt-datetime').textContent = datetime;
    
    modal.style.display = 'block';
}

function closeReceiptModal() {
    // Close the modal
    document.getElementById('receiptModal').style.display = 'none';
    
    // Clear the checkout list
    document.getElementById('checkout-items').innerHTML = '';
    
    // Reset all totals to $0.00
    document.getElementById('subtotal').textContent = '$0.00';
    document.getElementById('tax').textContent = '$0.00';
    document.getElementById('grand-total').textContent = '$0.00';
    document.getElementById('discount').textContent = '$0.00';
    
    // Clear the barcode input
    document.getElementById('barcode').value = '';
}

function printReceipt() {
    window.print();
}

// Add event listener when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    const payBtn = document.getElementById('pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', showReceipt);
    }

    // Add close button listener
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeReceiptModal);
    }
});
