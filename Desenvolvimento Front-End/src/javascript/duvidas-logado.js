document.addEventListener('DOMContentLoaded', function() {
    // VERIFICAÇÃO DE LOGIN - MODIFICADA
    const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (!user) {
        alert('Você precisa estar logado para interagir');
        window.location.href = 'login.html';
        return;
    }

    // Update user profile display
    document.getElementById('profileName').textContent = user.nome || 'Usuário';
    document.getElementById('profileImage').src = user.profileImage || '../img/default-profile.png';

    // Handle FAQ accordion functionality
    const details = document.querySelectorAll('details');
    details.forEach(detail => {
        detail.addEventListener('click', () => {
            // Close other open details when one is clicked
            details.forEach(d => {
                if (d !== detail) d.removeAttribute('open');
            });
        });
    });
});