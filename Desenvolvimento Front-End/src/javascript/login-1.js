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

// Recuperação de senha (fallback local se backend não disponível)
function generateToken() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'tkn_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function saveLocalResetToken(token, email) {
    const key = 'pwResetTokens';
    const raw = localStorage.getItem(key);
    const map = raw ? JSON.parse(raw) : {};
    const expires = Date.now() + 60 * 60 * 1000; // 1 hora
    map[token] = { email, expires };
    localStorage.setItem(key, JSON.stringify(map));
}
function formatResetLink(token) {
    return `${window.location.origin}reset-senha.html?token=${encodeURIComponent(token)}`;
}

async function handleForgotSubmit(event) {
    event.preventDefault();
    const emailInput = document.getElementById('forgotEmail');
    const email = emailInput?.value?.trim();
    if (!email) {
        mostrarMensagem('Erro', 'Informe um e‑mail válido.', 'erro');
        return;
    }

    try {
        const resp = await fetch('http://localhost:8080/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (resp.ok) {
            mostrarMensagem('Enviado', 'Verifique seu e‑mail com as instruções para recuperar a senha.', 'sucesso');
            closeForgotModal();
            return;
        }
        console.warn('Resposta forgot-password não OK:', resp.status);
    } catch (err) {
        console.warn('Falha backend forgot-password, usando fallback local.', err);
    }

    const token = generateToken();
    saveLocalResetToken(token, email);
    const link = formatResetLink(token);
    closeForgotModal();
    mostrarMensagem('Token gerado (ambiente local)', `Link de redefinição (teste):\n${link}\n\nO token expira em 1 hora.`, 'sucesso');
}

function openForgotModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) modal.classList.remove('hidden');
}
function closeForgotModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) modal.classList.add('hidden');
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

    // forgot password
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) forgotLink.addEventListener('click', function(e) { e.preventDefault(); openForgotModal(); });

    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) forgotForm.addEventListener('submit', handleForgotSubmit);

    const forgotCancelBtn = document.getElementById('forgotCancelBtn');
    if (forgotCancelBtn) forgotCancelBtn.addEventListener('click', closeForgotModal);

    // fechar clicando fora do modal de forgot (seguro)
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('forgotPasswordModal');
        if (!modal || modal.classList.contains('hidden')) return;
        const dialog = modal.querySelector('.relative');
        if (!dialog) return;
        if (!dialog.contains(e.target)) closeForgotModal();
    });
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
  /**
   * @function mostrarMensagem
   * @param {string} titulo - Título da mensagem
   * @param {string} texto - Corpo da mensagem
   * @param {string} [tipo='erro'] - Tipo da mensagem ('erro' ou outro valor para sucesso)
   */
  function mostrarMensagem(titulo, texto, tipo = 'erro') {
    const modal = document.getElementById('mensagemModal');
    if (!modal) return;

    modal.querySelector('.modal-title').textContent = titulo;
    modal.querySelector('.modal-body').textContent = texto;
    modal.classList.remove('hidden');

    if (tipo === 'sucesso') {
      modal.classList.add('bg-green-100');
    } else {
      modal.classList.add('bg-red-100');
    }
  }

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
    usuario
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

    // eventos do modal forgot password
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            openForgotModal();
        });
    }

    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotSubmit);
    }

    const forgotCancelBtn = document.getElementById('forgotCancelBtn');
    if (forgotCancelBtn) forgotCancelBtn.addEventListener('click', closeForgotModal);

    // fechar clicando fora
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('forgotPasswordModal');
        if (!modal) return;
        const dialog = modal.querySelector('.relative');
        if (!dialog) return;
        if (!modal.classList.contains('hidden') && !dialog.contains(e.target)) {
            closeForgotModal();
        }
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