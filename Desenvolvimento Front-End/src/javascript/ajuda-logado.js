// ====== Função de Modal Customizado ======
function mostrarModal(titulo, mensagem, tipo = 'info') {
    const modal = document.getElementById('modalMensagem');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalIcon = document.getElementById('modalIcon');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Define ícone e cor conforme tipo
    let iconClass = 'fa-info-circle text-blue-500';
    if (tipo === 'sucesso') iconClass = 'fa-check-circle text-green-500';
    else if (tipo === 'erro') iconClass = 'fa-times-circle text-red-500';
    else if (tipo === 'aviso') iconClass = 'fa-exclamation-circle text-yellow-500';

    modalIcon.className = `fas ${iconClass} text-2xl mr-3 mt-1`;
    modalTitle.textContent = titulo;
    modalContent.textContent = mensagem;

    modal.classList.remove('hidden');

    modalCloseBtn.onclick = () => modal.classList.add('hidden');
}


document.addEventListener('DOMContentLoaded', function() {
    // VERIFICAÇÃO DE LOGIN - MODIFICADA
   const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (!user) {
        mostrarModal('Erro', 'Você precisa estar logado para interagir', 'erro');
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
            mostrarModal('Sucesso!', 'Mensagem enviada com sucesso!', 'sucesso');
            contactForm.reset();
            
        });
    }
});