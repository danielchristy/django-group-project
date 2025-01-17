// lines 2 to 23 is what lets us search also refreses teh page row for items
function searchTable() {
    let input = document.getElementById("searchInput");
    let filter = input.value.toLowerCase();
    let table = document.getElementById("itemTable");
    let rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        let show = false;
        let cells = rows[i].getElementsByTagName("td");
        
        for (let cell of cells) {
            let text = cell.textContent || cell.innerText;
            if (text.toLowerCase().indexOf(filter) > -1) {
                show = true;
                break;
            }
        }
        
        rows[i].style.display = show ? "" : "none";
    }
}

// for editing a particualt item
function editItem(itemId) {
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';
    
   
    fetch(`/api/item/${itemId}/`)
        .then(response => response.json())
        .then(item => {
            document.getElementById('editItemId').value = item.id;
            document.getElementById('editItemName').textContent = item.name;
            document.getElementById('editCost').value = item.cost;
            document.getElementById('editAmount').value = item.amount;
        })
        .catch(error => console.error('Error:', error));
}

function closeEditModal() {
    if (confirm('Are you sure you want to cancel? Any changes will be lost.')) {
        const modal = document.getElementById('editModal');
        modal.style.display = 'none';
    }
}

// for deltin
function deleteItem(itemId) {
    const itemName = document.querySelector(`tr[data-id="${itemId}"] td:first-child`).textContent;
    if (confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
        fetch(`/api/item/${itemId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Item deleted successfully!');
                location.reload();
            } else {
                throw new Error('Failed to delete item');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete item');
        });
    }
}


function showAddModal() {
    const modal = document.getElementById('addModal');
    modal.style.display = 'block';
    //delted whole form /clear
    document.getElementById('addForm').reset();
}

function closeAddModal() {
    if (document.getElementById('addForm').checkValidity() && 
        confirm('Are you sure you want to cancel? All entered data will be lost.')) {
        const modal = document.getElementById('addModal');
        modal.style.display = 'none';
        document.getElementById('addForm').reset();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // this for clsings buttons for the edit and add windwo or modial if yall trying to be fancy but its window 
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            document.getElementById('editModal').style.display = 'none';
            document.getElementById('addModal').style.display = 'none';
        }
    });

    //closed teh widnows
    window.onclick = function(event) {
        const editModal = document.getElementById('editModal');
        const addModal = document.getElementById('addModal');
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
        if (event.target == addModal) {
            addModal.style.display = 'none';
        }
    }

    // for submittting
    document.getElementById('editForm').onsubmit = function(e) {
        e.preventDefault();
        const itemId = document.getElementById('editItemId').value;
        const newCost = document.getElementById('editCost').value;
        const newAmount = document.getElementById('editAmount').value;
        
        if (confirm('Are you sure you want to save these changes?')) {
            fetch(`/api/item/${itemId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    cost: newCost,
                    amount: newAmount
                })
            })
            .then(response => {
                if (response.ok) {
                    alert('Item updated successfully!');
                    location.reload();
                } else {
                    throw new Error('Failed to update item');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to update item');
            });
        }
    }

    
    document.getElementById('addForm').onsubmit = function(e) {
        e.preventDefault();
        
        const newItem = {
            name: document.getElementById('addName').value,
            cost: document.getElementById('addCost').value,
            department: document.getElementById('addDepartment').value,
            amount: document.getElementById('addAmount').value,
            barcode: document.getElementById('addBarcode').value
        };

        if (confirm('Are you sure you want to add this item?')) {
            fetch('/api/item/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(newItem)
            })
            .then(response => {
                if (response.ok) {
                    alert('Item added successfully!');
                    location.reload();
                } else {
                    throw new Error('Failed to add item');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to add item');
            });
        }
    };

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchTable);
    }
});


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
