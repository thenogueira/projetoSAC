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

    // Handle contact form if exists
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add contact form submission logic here
            alert('Mensagem enviada com sucesso!');
            contactForm.reset();
        });
    }
});