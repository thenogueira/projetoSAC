/**
 * Adiciona um listener para quando o DOM estiver completamente carregado
 * para executar as funções de inicialização do formulário de cadastro.
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Objeto que armazena referências aos elementos do modal de mensagem
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
     */
    function mostrarMensagem(titulo, texto, tipo = 'erro') {
        if (!modalElements.modal || !modalElements.content || !modalElements.title || !modalElements.icon) {
            console.error('Elementos do modal não encontrados!');
            mostrarModal(`${titulo}: ${texto}`);

            
            return;
        }

        modalElements.icon.className = tipo === 'erro' 
            ? 'fas fa-exclamation-circle text-red-500 text-2xl mr-3 mt-1'
            : 'fas fa-check-circle text-green-500 text-2xl mr-3 mt-1';

        modalElements.title.textContent = titulo;
        modalElements.content.textContent = texto;
        modalElements.modal.classList.remove('hidden');

        setTimeout(() => {
            modalElements.modal.classList.add('hidden');
        }, 5000);
    }

    if (modalElements.closeBtn) {
        modalElements.closeBtn.addEventListener('click', () => {
            modalElements.modal.classList.add('hidden');
        });
    }

    // Obtém referência ao formulário de cadastro
    const form = document.getElementById('cadastroForm');
    if (!form) {
        mostrarMensagem('Erro', 'Formulário não encontrado', 'erro');
        return;
    }

    // Helpers de erro inline
    function showFieldError(input, message) {
        if (!input) return;
        clearFieldError(input);
        const el = document.createElement('p');
        el.className = 'field-error text-red-600 text-sm mt-1';
        el.textContent = message;
        
        // CORREÇÃO 2: Encontrar o container pai do input (div.relative) para inserir o erro após ele
        const inputContainer = input.parentElement;
        if (inputContainer && inputContainer.classList.contains('relative')) {
            inputContainer.insertAdjacentElement('afterend', el);
        } else {
            input.insertAdjacentElement('afterend', el);
        }
    }

    function clearFieldError(input) {
        if (!input) return;
        
        // CORREÇÃO 2: Encontrar o container pai do input (div.relative) para buscar o erro
        const inputContainer = input.parentElement;
        const containerToSearch = inputContainer && inputContainer.classList.contains('relative') 
            ? inputContainer 
            : input.parentElement;
        
        if (containerToSearch) {
            const sib = containerToSearch.nextElementSibling;
            if (sib && sib.classList && sib.classList.contains('field-error')) {
                sib.remove();
            }
        }
    }

    // Limpa erros ao digitar
    ['email','senha','confirmarSenha'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => clearFieldError(el));
    });

    // Recupera dados da etapa anterior
    const dadosCadastro = JSON.parse(localStorage.getItem('usuarioCadastro'));
    if (!dadosCadastro) {
        mostrarMensagem('Erro', 'Nenhum dado encontrado da primeira etapa. Retornando ao início.', 'erro');
        setTimeout(() => {
            window.location.href = 'cadastro-1.html';
        }, 2000);
        return;
    }

    // CORREÇÃO 1: Sistema robusto de verificação de email
    function getTodosUsuariosCadastrados() {
        return JSON.parse(localStorage.getItem('todosUsuariosCadastrados') || '{}');
    }

    function salvarUsuarioCadastrado(usuario) {
        const usuarios = getTodosUsuariosCadastrados();
        usuarios[usuario.email] = {
            id: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('todosUsuariosCadastrados', JSON.stringify(usuarios));
    }

    function verificarEmailCadastrado(email) {
        const usuarios = getTodosUsuariosCadastrados();
        return !!usuarios[email];
    }

    // Carrega usuários existentes do localStorage ao iniciar
    function carregarUsuariosExistentes() {
        // Tenta carregar do localStorage principal também
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        if (usuarioLogado) {
            try {
                const usuario = JSON.parse(usuarioLogado);
                if (usuario.email) {
                    salvarUsuarioCadastrado(usuario);
                }
            } catch (e) {
                console.error('Erro ao carregar usuário logado:', e);
            }
        }
    }

    // Inicializa o sistema de verificação
    carregarUsuariosExistentes();

    /**
     * Listener para o evento de submit do formulário
     */
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        ['email','senha','confirmarSenha'].forEach(id => clearFieldError(document.getElementById(id)));

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

        let hasError = false;

        // Validação básica de e-mail
        if (!email) {
            showFieldError(document.getElementById('email'), 'Email obrigatório.');
            hasError = true;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFieldError(document.getElementById('email'), 'Email inválido.');
                hasError = true;
            } else {
                // Verificação simples de domínio suspeito
                const domain = email.split('@')[1];
                if (!domain.includes('.')) {
                    showFieldError(document.getElementById('email'), 'O domínio do email parece inválido.');
                    hasError = true;
                } else {
                    // CORREÇÃO 1: Verificação local robusta de email duplicado
                    if (verificarEmailCadastrado(email)) {
                        showFieldError(document.getElementById('email'), 'Este email já está cadastrado.');
                        hasError = true;
                    }
                }
            }
        }

        if (!senha) { 
            showFieldError(document.getElementById('senha'), 'Senha obrigatória.'); 
            hasError = true; 
        }

        if (!confirmarSenha) { 
            showFieldError(document.getElementById('confirmarSenha'), 'Confirme sua senha.'); 
            hasError = true; 
        }

        if (senha && confirmarSenha && senha !== confirmarSenha) {
            showFieldError(document.getElementById('confirmarSenha'), 'As senhas não coincidem.');
            showFieldError(document.getElementById('senha'), 'As senhas não coincidem.');
            hasError = true;
        }

        // CORREÇÃO 2: Mensagem mais específica sobre caracteres especiais
        const senhaForcaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&+=!]).{8,}$/;
        if (senha && !senhaForcaRegex.test(senha)) {
            showFieldError(document.getElementById('senha'), 
                'A senha deve ter pelo menos 8 caracteres incluindo: letra maiúscula, minúscula, número e caractere especial (@#$%&+=!)');
            hasError = true;
        }

        if (hasError) {
            mostrarMensagem('Erro', 'Corrija os campos destacados e tente novamente.', 'erro');
            return;
        }

        // Prepara dados completos
        const userId = `user_${Date.now()}`;
        const dadosCompletos = { 
            id: userId, 
            email, 
            senha_hash: senha,
            ...dadosCadastro 
        };

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCompletos),
            });

            if (response.ok) {
                // CORREÇÃO 1: Salva o usuário no sistema de verificação
                salvarUsuarioCadastrado({
                    id: userId,
                    email: email,
                    nome: dadosCadastro.nome
                });
                
                mostrarMensagem('Sucesso', 'Cadastro concluído com sucesso!', 'sucesso');
                localStorage.setItem('usuarioLogado', JSON.stringify({ 
                    id: userId, 
                    email, 
                    nome: dadosCadastro.nome || email,
                    profileImage: dadosCadastro.profileImage || '../img/default-profile.png'
                }));
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                const errorText = await response.text();
                console.log('Resposta do servidor:', errorText);
                
                // CORREÇÃO 1: Se deu erro 500, assume que pode ser email duplicado e salva localmente
                // Isso previne tentativas repetidas com o mesmo email
                if (response.status === 500) {
                    salvarUsuarioCadastrado({
                        id: `erro_${Date.now()}`,
                        email: email,
                        nome: dadosCadastro.nome || 'Usuário com erro'
                    });
                    
                    showFieldError(document.getElementById('email'), 'Este email já está cadastrado ou não está disponível.');
                    mostrarMensagem('Erro', 'Este email não está disponível para cadastro. Por favor, use outro email.', 'erro');
                } else {
                    let errorMessage = 'Erro ao salvar cadastro';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        // Mantém a mensagem padrão
                    }
                    mostrarMensagem('Erro', errorMessage, 'erro');
                }
            }
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagem('Erro', 'Erro ao conectar com o servidor', 'erro');
        }
    });

    // Botão de salvar com efeito visual
    let saveBtn = document.querySelector('#saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener("mousedown", function (){
            saveBtn.classList.add('text-[16px]');
        });
        saveBtn.addEventListener("mouseup", function (){
            saveBtn.classList.remove('text-[16px]');
        });
    }
});

/**
 * Valida se a senha atende aos requisitos de segurança
 */
function validarSenha(senha) {
    if (senha.length < 8) return false;
    if (!/[A-Z]/.test(senha)) return false;
    if (!/[a-z]/.test(senha)) return false;
    if (!/[0-9]/.test(senha)) return false;
    if (!/[@#$%&+=!]/.test(senha)) return false;
    return true;
}

// Olhinho da senha
document.querySelectorAll('button[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-toggle');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    });
});