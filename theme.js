(function() {
    // Apply theme as soon as possible to prevent flash of unstyled content
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            // Update button text/icon on load
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                themeToggle.innerHTML = '<span>☀️</span>';
            } else {
                themeToggle.innerHTML = '<span>🌙</span>';
            }

            themeToggle.addEventListener('click', () => {
                let theme = document.documentElement.getAttribute('data-theme');
                if (theme === 'dark') {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                    themeToggle.innerHTML = '<span>🌙</span>';
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                    themeToggle.innerHTML = '<span>☀️</span>';
                }
            });
        }
    });
})();
