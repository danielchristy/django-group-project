
function showAddModal() {
    document.getElementById('addModal').style.display = 'block';
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('addForm').reset();
}

function showEditModal() {
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editForm').reset();
}

document.getElementById('addForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('addName').value,
        cost: document.getElementById('addCost').value,
        department: document.getElementById('addDepartment').value,
        amount: document.getElementById('addAmount').value,
        barcode: document.getElementById('addBarcode').value
    };

    fetch('/api/item/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            closeAddModal();
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding item');
    });
});


function editItem(itemId) {
    fetch(`/api/item/${itemId}/`)
        .then(response => response.json())
        .then(item => {
            document.getElementById('editItemId').value = item.id;
            document.getElementById('editName').value = item.name;
            document.getElementById('editCost').value = item.cost;
            document.getElementById('editDepartment').value = item.department;
            document.getElementById('editAmount').value = item.amount;
            document.getElementById('editBarcode').value = item.barcode;
            showEditModal();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching item details');
        });
}

document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('editItemId').value;
    const formData = {
        name: document.getElementById('editName').value,
        cost: document.getElementById('editCost').value,
        department: document.getElementById('editDepartment').value,
        amount: document.getElementById('editAmount').value,
        barcode: document.getElementById('editBarcode').value
    };

    fetch(`/api/item/${itemId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            closeEditModal();
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating item');
    });
});


function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/api/item/${itemId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                throw new Error('Failed to delete item');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting item');
        });
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function searchItems() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('itemTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;

        if (cells.length === 1 && cells[0].className === 'no-items') {
            continue;
        }

        for (let j = 0; j < cells.length - 1; j++) {
            const text = cells[j].textContent || cells[j].innerText;
            if (text.toLowerCase().indexOf(filter) > -1) {
                found = true;
                break;
            }
        }

        row.style.display = found ? '' : 'none';
    }
} 