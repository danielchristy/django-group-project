// the toggle on top right for changeing them 
document.addEventListener('DOMContentLoaded', function () {
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    //this is the main defaul
    let currentTheme = localStorage.getItem('theme') || 'light';
    root.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        // for udating the tiny icon depeinding on theme
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '🌞';

        themeToggle.addEventListener('click', function () {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            root.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            this.textContent = currentTheme === 'light' ? '🌙' : '🌞';
        });
    }
});
