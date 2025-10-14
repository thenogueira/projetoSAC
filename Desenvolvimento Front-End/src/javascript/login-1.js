


// Elementos do modal


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
                'Complete o cadastro primeiro', 
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
        // Garante que o objeto salvo tem nome e profileImage
        const usuario = {
            ...data.usuario,
            nome: data.usuario.nome || data.usuario.email || '',
            profileImage: data.usuario.profileImage || '../img/default-profile.png'
        };
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario)); senha
        
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

    /**
     * Objeto que armazena referências aos elementos do modal de mensagem
     * @type {Object}
     * @property {HTMLElement} modal - Elemento do modal principal
     * @property {HTMLElement} content - Elemento do conteúdo da mensagem
     * @property {HTMLElement} title - Elemento do título do modal
     * @property {HTMLElement} icon - Elemento do ícone do modal
     * @property {HTMLElement} closeBtn - Botão de fechar o modal
     */
    const modalElements = {
        modal: document.getElementById('modalMensagem'),
        content: document.getElementById('modalContent'),
        title: document.getElementById('modalTitle'),
        icon: document.getElementById('modalIcon'),
        closeBtn: document.getElementById('modalCloseBtn')
    };

    /**
     * Exibe uma mensagem no modal personalizado
     * @function mostrarMensagem
     * @param {string} titulo - Título da mensagem
     * @param {string} texto - Corpo da mensagem
     * @param {string} [tipo='erro'] - Tipo da mensagem ('erro' ou outro valor para sucesso)
     */
    
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

    let entrarBtn = document.querySelector('#entrarBtn')

    entrarBtn.addEventListener("mousedown", function (){
        entrarBtn.classList.add('text-[16px]')
    })

    entrarBtn.addEventListener("mouseup", function (){
        entrarBtn.classList.remove('text-[16px]')
    })
});


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
