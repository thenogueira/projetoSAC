
// Elementos do modal
const modalElements = {
    modal: null,
    icon: null,
    title: null,
    content: null,
    closeBtn: null
};

// Inicializa os elementos do modal
function initModal() {
    modalElements.modal = document.getElementById('modalMensagem');
    modalElements.icon = document.getElementById('modalIcon');
    modalElements.title = document.getElementById('modalTitle');
    modalElements.content = document.getElementById('modalContent');
    modalElements.closeBtn = document.getElementById('modalCloseBtn');

    if (!modalElements.modal) {
        console.error('Modal container não encontrado!');
        return false;
    }
    return true;
}

// Mostra mensagem personalizada
function mostrarMensagem(titulo, conteudo, tipo = 'erro') {
    if (!initModal()) {
        console.error('Não foi possível mostrar a mensagem - elementos não encontrados');
        return;
    }

    // Configura ícone e cores
    modalElements.icon.className = `fas ${tipo === 'erro' ? 'fa-exclamation-circle text-red-500' : 'fa-check-circle text-green-500'} text-2xl mr-3`;
    
    // Configura conteúdo
    modalElements.title.textContent = titulo;
    modalElements.content.textContent = conteudo;
    
    // Mostra modal
    modalElements.modal.classList.remove('hidden');
    
    // Configura timeout para fechar automaticamente
    setTimeout(fecharModal, 5000);
}

function fecharModal() {
    if (modalElements.modal) {
        modalElements.modal.classList.add('hidden');
    }
}

// Tratamento de login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email')?.value.trim();
    const senha = document.getElementById('senha_hash')?.value.trim();
    const emailField = document.getElementById('email');
    const senhaField = document.getElementById('senha_hash');

    // Validação básica
    if (!email || !senha) {
        mostrarMensagem('Campos obrigatórios', 'Por favor, preencha todos os campos.', 'erro');
        if (emailField) emailField.classList.add('border-red-500', 'shake');
        if (senhaField) senhaField.classList.add('border-red-500', 'shake');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                senha_hash: senha 
            }),
        });

        // Tratamento específico para erro 401
        if (response.status === 401) {
            mostrarMensagem(
                'Credenciais inválidas', 
                'E-mail ou senha incorretos. Por favor, tente novamente.', 
                'erro'
            );
            if (senhaField) {
                senhaField.value = '';
                senhaField.classList.add('border-red-500', 'shake');
            }
            if (emailField) emailField.classList.add('border-red-500');
            return;
        }

        // Tratamento de outros erros HTTP
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            mostrarMensagem(
                'Erro no login', 
                errorData.message || `Erro ${response.status}: ${response.statusText}`,
                'erro'
            );
            return;
        }

        // Sucesso
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
        
        mostrarMensagem('Sucesso', 'Login realizado com sucesso!', 'sucesso');
        setTimeout(() => {
            window.location.href = 'postagens.html';
        }, 1500);

    } catch (error) {
        console.error('Erro na requisição:', error);
        mostrarMensagem(
            'Erro de conexão', 
            'Não foi possível conectar ao servidor. Verifique sua conexão.', 
            'erro'
        );
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configura listeners
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }

    // Limpa erros ao digitar
    const emailField = document.getElementById('email');
    const senhaField = document.getElementById('senha_hash');
    
    if (emailField) {
        emailField.addEventListener('input', function() {
            this.classList.remove('border-red-500', 'shake');
        });
    }
    
    if (senhaField) {
        senhaField.addEventListener('input', function() {
            this.classList.remove('border-red-500', 'shake');
        });
    }

    // Configura botão de fechar modal
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', fecharModal);
    }
});