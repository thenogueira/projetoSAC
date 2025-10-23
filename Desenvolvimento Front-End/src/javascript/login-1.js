// Elementos do modal
const modalElements = {
    modal: null,
    icon: null,
    title: null,
    content: null,
    closeBtn: null
};

function initModal() {
    modalElements.modal = document.getElementById('modalMensagem');
    modalElements.icon = document.getElementById('modalIcon');
    modalElements.title = document.getElementById('modalTitle');
    modalElements.content = document.getElementById('modalContent');
    modalElements.closeBtn = document.getElementById('modalCloseBtn');

    return !!modalElements.modal;
}

function mostrarMensagem(titulo, conteudo, tipo = 'erro') {
    if (!initModal()) {
        // fallback simples se modal não existir
        alert(`${titulo}\n\n${conteudo}`);
        return;
    }

    modalElements.icon.className = `fas ${tipo === 'erro' ? 'fa-exclamation-circle text-red-500' : 'fa-check-circle text-green-500'} text-2xl mr-3`;
    modalElements.title.textContent = titulo;
    modalElements.content.textContent = conteudo;
    modalElements.modal.classList.remove('hidden');

    setTimeout(fecharModal, 5000);
}

function fecharModal() {
    if (modalElements.modal) modalElements.modal.classList.add('hidden');
}

async function handleLogin(event) {
    event.preventDefault();
    const emailField = document.getElementById('email');
    const senhaField = document.getElementById('senha_hash');
    const email = emailField?.value?.trim();
    const senha = senhaField?.value?.trim();

    if (!email || !senha) {
        mostrarMensagem('Campos obrigatórios', 'Por favor, preencha todos os campos.', 'erro');
        if (emailField) emailField.classList.add('border-red-500', 'shake');
        if (senhaField) senhaField.classList.add('border-red-500', 'shake');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha_hash: senha })
        });

        if (response.status === 401) {
            mostrarMensagem('Credenciais inválidas', 'E-mail ou senha incorretos. Tente novamente.', 'erro');
            if (senhaField) { senhaField.value = ''; senhaField.classList.add('border-red-500', 'shake'); }
            if (emailField) emailField.classList.add('border-red-500');
            return;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            mostrarMensagem('Erro no login', errorData.message || `Erro ${response.status}`, 'erro');
            return;
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        const usuario = {
            ...data.usuario,
            nome: data.usuario.nome || data.usuario.email || '',
            profileImage: data.usuario.profileImage || '../img/default-profile.png'
        };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

        mostrarMensagem('Sucesso', 'Login realizado com sucesso!', 'sucesso');
        setTimeout(() => window.location.href = 'postagens.html', 1500);
    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarMensagem('Erro de conexão', 'Não foi possível conectar ao servidor.', 'erro');
    }
}

// Função simples para redirecionar para email de recuperação
function handleForgotPassword() {
    const email = 'sistemadeapoiocomunitario@gmail.com';
    const subject = 'Recuperação de Senha - Sistema de Apoio Comunitário';
    const body = 'Por favor, preciso redefinir minha senha. Meu email de cadastro é: [INFORME SEU EMAIL AQUI]';
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink, '_blank');
}

// Inicialização única e segura
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    if (form) form.addEventListener('submit', handleLogin);

    const emailField = document.getElementById('email');
    const senhaField = document.getElementById('senha_hash');
    if (emailField) emailField.addEventListener('input', function() { this.classList.remove('border-red-500', 'shake'); });
    if (senhaField) senhaField.addEventListener('input', function() { this.classList.remove('border-red-500', 'shake'); });

    // modal principal
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', fecharModal);

    // forgot password - agora redireciona diretamente para email
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) { 
            e.preventDefault(); 
            handleForgotPassword(); 
        });
    }

    // olhinho da senha
    document.querySelectorAll('button[data-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-toggle');
            const input = document.getElementById(targetId);
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            // alterna o ícone
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    });

    let entrarBtn = document.querySelector('#entrarBtn');
    if (entrarBtn) {
        entrarBtn.addEventListener("mousedown", function (){
            entrarBtn.classList.add('text-[16px]');
        });

        entrarBtn.addEventListener("mouseup", function (){
            entrarBtn.classList.remove('text-[16px]');
        });
    }
});