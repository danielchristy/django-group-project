document.addEventListener('DOMContentLoaded', function() {
    // Function to open the popup
    function openPopup() {
        const popup = document.querySelector('.popup-overlay');
        popup.style.display = 'flex'; // Directly manipulate the style for now
    }

    // Function to close the popup
    function closePopup() {
        const popup = document.querySelector('.popup-overlay');
        popup.style.display = 'none'; // Directly manipulate the style for now
    }

    // Event listener to open popup when button is clicked
    const openButton = document.getElementById('open-popup-btn');
    if (openButton) {
        openButton.addEventListener('click', openPopup); // Show the popup
    }

    // Event listener to close the popup when close button is clicked
    const closeButtons = document.querySelectorAll('.popup-close, .popup-body button');
    closeButtons.forEach(button => {
        button.addEventListener('click', closePopup); // Hide the popup
    });
});