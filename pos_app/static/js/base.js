// theme toggle between light and dark mode
document.addEventListener('DOMContentLoaded', function () {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    // Ensure theme defaults to light if not set
    let currentTheme = localStorage.getItem('theme') || 'light';
    root.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        // Update toggle button icon
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '🌞';

        themeToggle.addEventListener('click', function () {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            root.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            this.textContent = currentTheme === 'light' ? '🌙' : '🌞';
        });
    }
});

// local storage prevents theme from reseting on page refresh