document.addEventListener('DOMContentLoaded', function() {
    const userMenu = document.getElementById('expandir');
    const userProfileLink = document.querySelector('#logado .flex.gap-3');

    // Toggle menu visibility
    userProfileLink.addEventListener('click', function(e) {
        e.preventDefault();
        userMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!userProfileLink.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });

    // Handle logout
    document.querySelector('.menu a[href="#"]').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    });
});
