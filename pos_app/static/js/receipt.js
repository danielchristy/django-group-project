
document.addEventListener('DOMContentLoaded', function() {
    console.log('Receipt.js loaded');
    
    const searchBtn = document.getElementById('search-btn');
    const barcodeInput = document.getElementById('barcode');
    
    if (searchBtn) {
        console.log('Search button found');
        searchBtn.addEventListener('click', searchItem);
    } else {
        console.error('Search button not found');
    }
    
    if (barcodeInput) {
        console.log('Barcode input found');
        barcodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchItem();
            }
        });
    } else {
        console.error('Barcode input not found');
    }
});


document.getElementById('search-btn').addEventListener('click', searchItem);
document.getElementById('barcode').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchItem();
    }
});

function searchItem() {
    const barcode = document.getElementById('barcode').value;
    console.log('Searching for barcode:', barcode);
    
    fetch(`/api/item/search/?barcode=${barcode}`)
        .then(response => {
            console.log('Search response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Search data:', data);
            if (data.error) {
                alert('Item not found');
            } else {
                addItemToCheckout(data);
                document.getElementById('barcode').value = '';
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            alert('Error searching for item');
        });
}

function addItemToCheckout(item) {
    const tbody = document.getElementById('checkout-items');
  
    const existingRow = tbody.querySelector(`tr[data-item-id="${item.id}"]`);
    if (existingRow) {
       
        const quantityInput = existingRow.querySelector('.quantity-input');
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateRowTotal(existingRow);
    } else {
       
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


function showReceipt() {
    const modal = document.getElementById('receiptModal');
    const receiptItems = document.getElementById('receipt-items');
    const datetime = new Date().toLocaleString();
   
    receiptItems.innerHTML = '';
    
    /
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
    

    document.getElementById('receipt-subtotal').textContent = document.getElementById('subtotal').textContent;
    document.getElementById('receipt-tax').textContent = document.getElementById('tax').textContent;
    document.getElementById('receipt-total').textContent = document.getElementById('grand-total').textContent;
    

    document.querySelector('.receipt-datetime').textContent = datetime;
    
    modal.style.display = 'block';
}

function closeReceiptModal() {
 
    document.getElementById('receiptModal').style.display = 'none';
    
   
    document.getElementById('checkout-items').innerHTML = '';
    
   
    document.getElementById('subtotal').textContent = '$0.00';
    document.getElementById('tax').textContent = '$0.00';
    document.getElementById('grand-total').textContent = '$0.00';
    document.getElementById('discount').textContent = '$0.00';
    
   
    document.getElementById('barcode').value = '';
}

function printReceipt() {
    window.print();
}


document.addEventListener('DOMContentLoaded', function() {
    const payBtn = document.getElementById('pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', showReceipt);
    }

    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeReceiptModal);
    }
});

function showReceiptModal() {
    const modal = document.getElementById('receiptModal');
    const items = document.getElementById('checkout-items').getElementsByTagName('tr');
    const receiptItems = document.getElementById('receiptItems');
    
  
    document.getElementById('receiptDate').textContent = new Date().toLocaleString();
    
   
    receiptItems.innerHTML = '';
    
  
    let html = '<table style="width: 100%;">';
    for (let row of items) {
        const name = row.cells[0].textContent;
        const price = row.cells[1].textContent;
        const quantity = row.querySelector('.quantity-input').value;
        const total = row.cells[3].textContent;
        
        html += `
            <tr>
                <td>${name}</td>
                <td>${quantity}x</td>
                <td style="text-align: right;">${total}</td>
            </tr>
        `;
    }
    html += '</table>';
    receiptItems.innerHTML = html;
   
    document.getElementById('receiptSubtotal').textContent = 
        document.getElementById('subtotal').textContent.replace('$', '');
    document.getElementById('receiptTax').textContent = 
        document.getElementById('tax').textContent.replace('$', '');
    document.getElementById('receiptTotal').textContent = 
        document.getElementById('grand-total').textContent.replace('$', '');
    
    modal.style.display = 'block';
}

function closeReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
}


document.getElementById('pay-btn').addEventListener('click', function() {
    if (document.getElementById('checkout-items').children.length > 0) {
        showReceiptModal();
    } else {
        alert('No items in checkout');
    }
});
