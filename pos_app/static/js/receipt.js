console.log('Receipt.js is loading...');

document.addEventListener('DOMContentLoaded', function() {
    //for the pay button
    const payBtn = document.getElementById('pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', function() {
            if (document.getElementById('checkout-items').children.length === 0) {
                alert('No items in checkout');
                return;
            }

            //lets us get all the stuff from checkout
            const items = [];
            document.querySelectorAll('#checkout-items tr').forEach(row => {
                items.push({
                    name: row.querySelector('td:nth-child(1)').textContent,
                    price: parseFloat(row.querySelector('td:nth-child(2)').textContent.replace('$', '')),
                    quantity: parseInt(row.querySelector('.item-quantity').value),
                    total: parseFloat(row.querySelector('.item-total').textContent.replace('$', ''))
                });
            });

            
            const subtotalAmount = parseFloat(document.getElementById('subtotal').textContent.replace('$', ''));
            const taxAmount = parseFloat(document.getElementById('tax').textContent.replace('$', ''));
            const discountAmount = parseFloat(document.getElementById('discount').textContent.replace('$', ''));
            const grandTotal = parseFloat(document.getElementById('grand-total').textContent.replace('$', ''));

            showReceipt({
                items: items,
                subtotal: subtotalAmount,
                tax: taxAmount,
                discount: discountAmount,
                total: grandTotal,
                date: new Date()
            });

           
            document.getElementById('checkout-items').innerHTML = '';
            // Trigger update of totals
            if (typeof updateSubtotal === 'function') {
                updateSubtotal();
            }
        });
    }
});
//the css for the recipt 
function createReceiptModal() {
    const modal = document.createElement('div');
    modal.id = 'receiptModal';
    modal.className = 'modal';
    modal.style.display = 'none';
    
  
    modal.style.position = 'fixed';
    modal.style.zIndex = '1000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.4)';
    modal.style.display = 'none';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    
   
    const modalContent = `
        <div class="modal-content receipt-paper" style="
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            max-width: 500px;
            width: 90%;
            margin: 20px auto;
            position: relative;
        ">
            <span class="close" onclick="closeReceiptModal()">&times;</span>
            <div class="receipt">
                <div class="receipt-header">
                    <h2>STORE NAME</h2>
                    <p>123 Store Street</p>
                    <p>City, State 12345</p>
                    <p>Tel: (123) 456-7890</p>
                </div>

                <div class="receipt-divider">================================</div>

                <div class="receipt-datetime">
                    Date: <span id="receiptDate"></span>
                </div>

                <div class="receipt-items" id="receiptItems">
                    <!-- Items will be populated by JavaScript -->
                </div>

                <div class="receipt-divider">================================</div>

                <div class="summary-line">
                    <span>Subtotal:</span>
                    <span>$<span id="receiptSubtotal">0.00</span></span>
                </div>
                <div class="summary-line">
                    <span>Tax:</span>
                    <span>$<span id="receiptTax">0.00</span></span>
                </div>
                <div id="discountRow" class="summary-line">
                    <span>Discount:</span>
                    <span>$<span id="receiptDiscount">0.00</span></span>
                </div>
                <div class="summary-line total">
                    <span>Total:</span>
                    <span>$<span id="receiptTotal">0.00</span></span>
                </div>

                <div class="receipt-divider">================================</div>

                <div class="receipt-footer">
                    <p>Thank you for shopping with us!</p>
                    <p>Please come again</p>
                </div>
            </div>
            <button class="print-btn" onclick="window.print()">Print Receipt</button>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    
    //with this they can click anywher and it closes the recipt 
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeReceiptModal();
        }
    });
    
    return modal;
}

function showReceipt(data) {
   
    let existingModal = document.getElementById('receiptModal');
    if (existingModal) {
        existingModal.remove();
    }

   
    const modal = createReceiptModal();
    document.body.appendChild(modal);

   
    modal.offsetHeight;

    // Get references to elements
    const receiptDate = document.getElementById('receiptDate');
    const receiptItems = document.getElementById('receiptItems');
    const receiptSubtotal = document.getElementById('receiptSubtotal');
    const receiptTax = document.getElementById('receiptTax');
    const receiptTotal = document.getElementById('receiptTotal');

    //for date
    receiptDate.textContent = data.date.toLocaleString();

    //Set items
    receiptItems.innerHTML = `
        <table style="width: 100%; margin-bottom: 10px;">
            <tr>
                <th style="text-align: left;">Item</th>
                <th style="text-align: right;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
            </tr>
            ${data.items.map(item => `
                <tr>
                    <td style="text-align: left;">${item.name}</td>
                    <td style="text-align: right;">${item.quantity}</td>
                    <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                    <td style="text-align: right;">$${item.total.toFixed(2)}</td>
                </tr>
            `).join('')}
        </table>
    `;

    //for total
    receiptSubtotal.textContent = data.subtotal.toFixed(2);
    receiptTax.textContent = data.tax.toFixed(2);
    if (data.discount > 0) {
        document.getElementById('receiptDiscount').textContent = data.discount.toFixed(2);
        document.getElementById('discountRow').style.display = 'block';
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
    receiptTotal.textContent = data.total.toFixed(2);

    //delay to show the modal
    requestAnimationFrame(() => {
        modal.style.display = 'flex';
    });
}

//Update close function to use proper display style
function closeReceiptModal() {
    const modal = document.getElementById('receiptModal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300); 
        
       
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('tax').textContent = '$0.00';
        document.getElementById('discount').textContent = '$0.00';
        document.getElementById('grand-total').textContent = '$0.00';
        
        //clears the checkout items
        document.getElementById('checkout-items').innerHTML = '';
    }
}

// Make closeReceiptModal globally available
window.closeReceiptModal = closeReceiptModal;
