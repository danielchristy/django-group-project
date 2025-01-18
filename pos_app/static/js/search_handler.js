document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const barcodeInput = document.getElementById('barcode');

    if (searchBtn && barcodeInput) {
        async function searchByBarcode() {
            const barcode = barcodeInput.value.trim();
            if (!barcode) return;

            try {
                const response = await fetch(`/search-item/?barcode=${barcode}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        alert('Item not found');
                    } else {
                        throw new Error('Search failed');
                    }
                    return;
                }

                const item = await response.json();
                console.log('Found item:', item);
                
                if (typeof addItemToCheckout === 'function') {
                    addItemToCheckout(item);
                    barcodeInput.value = '';
                    barcodeInput.focus();
                } else {
                    console.error('addItemToCheckout function not found');
                }

            } catch (error) {
                console.error('Error searching for item:', error);
                alert('Error searching for item');
            }
        }

        searchBtn.addEventListener('click', searchByBarcode);
        barcodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchByBarcode();
            }
        });
    }
}); 