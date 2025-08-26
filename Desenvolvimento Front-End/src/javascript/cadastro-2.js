/**
 * Adiciona um listener para quando o DOM estiver completamente carregado
 * para executar as funções de inicialização do formulário de cadastro.
 */
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
    function mostrarMensagem(titulo, texto, tipo = 'erro') {
        // Verifica se todos os elementos do modal existem
        if (!modalElements.modal || !modalElements.content || !modalElements.title || !modalElements.icon) {
            console.error('Elementos do modal não encontrados!');
            alert(`${titulo}: ${texto}`); // Fallback básico
            return;
        }

        // Configura o ícone e cores baseado no tipo de mensagem
        modalElements.icon.className = tipo === 'erro' 
            ? 'fas fa-exclamation-circle text-red-500 text-2xl mr-3 mt-1'
            : 'fas fa-check-circle text-green-500 text-2xl mr-3 mt-1';

        // Define o conteúdo do modal
        modalElements.title.textContent = titulo;
        modalElements.content.textContent = texto;

        // Exibe o modal
        modalElements.modal.classList.remove('hidden');

        // Fecha automaticamente após 5 segundos
        setTimeout(() => {
            modalElements.modal.classList.add('hidden');
        }, 5000);
    }

    // Configura o botão de fechar o modal se existir
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

    // Recupera dados da etapa anterior do cadastro
    const dadosCadastro = JSON.parse(localStorage.getItem('usuarioCadastro'));
    if (!dadosCadastro) {
        mostrarMensagem('Erro', 'Nenhum dado encontrado da primeira etapa. Retornando ao início.', 'erro');
        setTimeout(() => {
            window.location.href = 'cadastro-1.html';
        }, 2000);
        return;
    }

    /**
     * Listener para o evento de submit do formulário
     * @async
     */
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Obtém valores dos campos
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

        // Validações dos campos
        if (!email || !senha || !confirmarSenha) {
            mostrarMensagem('Erro', 'Preencha todos os campos!', 'erro');
            return;
        }

        if (senha !== confirmarSenha) {
            mostrarMensagem('Erro', 'As senhas não coincidem!', 'erro');
            return;
        }

        if (!validarSenha(senha)) {
            mostrarMensagem('Erro', 'A senha deve conter: 8+ caracteres, 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@#$%^&+=!)', 'erro');
            return;
        }

        // Prepara dados completos para cadastro
        const userId = `user_${Date.now()}`;
        const dadosCompletos = { 
            id: userId, 
            email, 
            senha_hash: senha, // Observação: Na prática deve-se usar hash da senha
            ...dadosCadastro 
        };

        try {
            // Envia requisição para a API de cadastro
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosCompletos),
            });

            if (response.ok) {
                // Cadastro bem-sucedido
                mostrarMensagem('Sucesso', 'Cadastro concluído com sucesso!', 'sucesso');
                localStorage.setItem('usuarioLogado', JSON.stringify({ 
                    id: userId, 
                    email, 
                    nome: dadosCadastro.nome || email,
                    profileImage: dadosCadastro.profileImage || '../img/default-profile.png'
                }));
                
                // Redireciona para página de login após 1.5 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                // Trata erros da API
                const error = await response.json();
                mostrarMensagem('Erro', error.message || 'Erro ao salvar cadastro', 'erro');
            }
        } catch (error) {
            // Trata erros de conexão
            console.error('Erro:', error);
            mostrarMensagem('Erro', 'Erro ao conectar com o servidor', 'erro');
        }
    });

    let saveBtn = document.querySelector('#saveBtn')

    saveBtn.addEventListener("mousedown", function (){
        saveBtn.classList.add('text-[16px]')
    })

    saveBtn.addEventListener("mouseup", function (){
        saveBtn.classList.remove('text-[16px]')
    })
});

/**
 * Valida se a senha atende aos requisitos de segurança
 * @function validarSenha
 * @param {string} senha - Senha a ser validada
 * @returns {boolean} Retorna true se a senha é válida
 */
function validarSenha(senha) {
    if (senha.length < 8) return false;
    if (!/[A-Z]/.test(senha)) return false;
    if (!/[a-z]/.test(senha)) return false;
    if (!/[0-9]/.test(senha)) return false;
    if (!/[@#$%^&+=!]/.test(senha)) return false;
    return true;

}