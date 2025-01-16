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
            document.getElementById('editName').value = item.name;
            document.getElementById('editCost').value = item.cost;
            document.getElementById('editDepartment').value = item.department;
            document.getElementById('editAmount').value = item.amount;
            document.getElementById('editBarcode').value = item.barcode;
        });
}

// for deltin
function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/api/item/${itemId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        }).then(response => {
            if (response.ok) {
                location.reload();
            }
        });
    }
}


function showAddModal() {
    document.getElementById('addModal').style.display = 'block';
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    // this for clsings buttons for the edit and add windwo or modial if yall trying to be fancy but its window 
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            document.getElementById('editModal').style.display = 'none';
            document.getElementById('addModal').style.display = 'none';
        }
    });

    // Closes window
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

    // submits the edit form
    document.getElementById('editForm').onsubmit = function(e) {
        e.preventDefault();
        const itemId = document.getElementById('editItemId').value;
        
        fetch(`/api/item/${itemId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                name: document.getElementById('editName').value,
                cost: document.getElementById('editCost').value,
                department: document.getElementById('editDepartment').value,
                amount: document.getElementById('editAmount').value,
                barcode: document.getElementById('editBarcode').value
            })
        }).then(response => {
            if (response.ok) {
                location.reload();
            }
        });
    }

    
    document.getElementById('addForm').onsubmit = function(e) {
        e.preventDefault();
        
        fetch('/api/item/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                name: document.getElementById('addName').value,
                cost: document.getElementById('addCost').value,
                department: document.getElementById('addDepartment').value,
                amount: document.getElementById('addAmount').value,
                barcode: document.getElementById('addBarcode').value
            })
        }).then(response => {
            if (response.ok) {
                location.reload();
            }
        });
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
