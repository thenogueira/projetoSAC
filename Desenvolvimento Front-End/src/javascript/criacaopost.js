document.addEventListener('DOMContentLoaded', function(){

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
 
    const form = document.getElementById('postForm');
    const toggleLocalizacaoBtn = document.getElementById('toggleLocalizacaoBtn');
    const localizacaoContainer = document.getElementById('localizacaoContainer');

    // Alterna a visibilidade do contêiner de localização
    toggleLocalizacaoBtn.addEventListener('click', function () {
        if (localizacaoContainer.classList.contains('hidden')) {
            localizacaoContainer.classList.remove('hidden');
            toggleLocalizacaoBtn.textContent = 'Fechar Localização';
        } else {
            localizacaoContainer.classList.add('hidden');
            toggleLocalizacaoBtn.textContent = 'Inserir Localização';
        }
    });
    
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const usuarioDataRaw = localStorage.getItem('usuarioLogado');
        let usuarioData;
        try {
            usuarioData = JSON.parse(usuarioDataRaw);
        } catch (error) {
            console.error('Erro ao analisar os dados do usuário:', error);
            mostrarMensagem('Erro', 'Erro ao analisar os dados do usuário: ${error.message}', 'erro');
            window.location.href = 'login.html';
            return;
        }

        if (!usuarioData || !usuarioData.id) {
            mostrarMensagem('Erro', `Usuário não identificado. Faça login ou cadastre-se.`, 'erro');
            window.location.href = 'login.html';
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            mostrarMensagem('erro ', `Usuário não autenticado. Faça login novamente.`, 'erro');
            window.location.href = 'login.html';
            return;
        }

        // Extrai o número do ID se ele estiver no formato "user_1747312194400"
        let usuarioId = usuarioData.id;
        if (typeof usuarioId === 'string' && usuarioId.startsWith('user_')) {
            usuarioId = parseInt(usuarioId.replace('user_', ''), 10);
        }

        console.log('ID do usuário logado (convertido):', usuarioId); // Log para depuração

        const titulo = document.getElementById('titulo').value.trim();
        const categoria = document.getElementById('categoria').value.trim();
        const tipo = document.getElementById('tipo').value.trim();
        const estado = document.getElementById('estado').value.trim();
        const lugar = document.getElementById('casa').value.trim();
        const estado_doacao = "DISPONIVEL"; // Valor fixo para o estado da doação
        const descricao = document.getElementById('descricao').value.trim();
        const imagem = document.getElementById('imagem').files[0];

        if (!titulo || !categoria || !tipo || !estado || !lugar || !descricao) {
            mostrarMensagem('Erro', `Preencha todos os campos!`, 'erro');
            return;
        }

        let imagemBase64 = null;
        if (imagem) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagemBase64 = e.target.result;
                saveAndSendPost();
            };
            reader.readAsDataURL(imagem);
        } else {
            saveAndSendPost();
        }

        async function saveAndSendPost() {
            const post = {
                usuario: {
                    id: usuarioId
                },
                titulo,
                descricao,
                tipo,
                categoria,
                localizacao: `${estado}, ${lugar}`,
                estado_doacao,
                imagem: imagemBase64,
                data_criacao: new Date().toISOString(),
                data_atualizacao: new Date().toISOString(),
            };

            console.log('Dados do post:', post); // Log para depuração
            console.log('JSON enviado:', JSON.stringify(post, null, 2));

            try {
                const response = await fetch('http://localhost:8080/ocorrencias/criar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(post),
                });

                if (response.ok) {
                    mostrarMensagem('sucesso',`Postagem criada com sucesso!`, 'sucesso');
                    form.reset();
                    window.location.href = 'postagens.html';

                } else {
                    const error = await response.json();
                    mostrarMensagem(`Erro ao criar postagem: ${error.message}`, 'erro');
                }
            } catch (error) {
                console.error('Erro ao enviar os dados:', error);
                mostrarMensagem('erro', `Erro ao criar postagem. Tente novamente mais tarde.`, 'erro');
            }
        }

        
    });

    let criarBtn = document.querySelector('#criarBtn')

    criarBtn.addEventListener("mousedown", function (){
        criarBtn.classList.remove('text-[18px]')
        criarBtn.classList.add('text-[16px]')
    })

    criarBtn.addEventListener("mouseup", function (){
        criarBtn.classList.remove('text-[16px]')
        criarBtn.classList.add('text-[18px]')
    })
});
