document.addEventListener('DOMContentLoaded', function() {

    // =========================
    // Modal de mensagem
    // =========================
    const modalElements = {
        modal: document.getElementById('modalMensagem'),
        content: document.getElementById('modalContent'),
        title: document.getElementById('modalTitle'),
        icon: document.getElementById('modalIcon'),
        closeBtn: document.getElementById('modalCloseBtn')
    };

    function mostrarMensagem(titulo, texto, tipo = 'erro') {
        if (!modalElements.modal || !modalElements.content || !modalElements.title || !modalElements.icon) {
            console.error('Elementos do modal não encontrados!');
            alert(`${titulo}: ${texto}`);
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

    if (modalElements.closeBtn && modalElements.modal) {
        modalElements.closeBtn.addEventListener('click', () => {
            modalElements.modal.classList.add('hidden');
        });
    }

    // =========================
    // Formulário de post
    // =========================
    const form = document.getElementById('postForm');

    if (form) {

        // Localização
        const toggleLocalizacaoBtn = document.getElementById('toggleLocalizacaoBtn');
        const localizacaoContainer = document.getElementById('localizacaoContainer');

        if (toggleLocalizacaoBtn && localizacaoContainer) {
            toggleLocalizacaoBtn.addEventListener('click', function () {
                if (localizacaoContainer.classList.contains('hidden')) {
                    localizacaoContainer.classList.remove('hidden');
                    toggleLocalizacaoBtn.textContent = 'Fechar Localização';
                } else {
                    localizacaoContainer.classList.add('hidden');
                    toggleLocalizacaoBtn.textContent = 'Inserir Localização';
                }
            });
        }

        // Submit do form
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const usuarioDataRaw = localStorage.getItem('usuarioLogado');
            let usuarioData;
            try {
                usuarioData = JSON.parse(usuarioDataRaw);
            } catch (error) {
                console.error('Erro ao analisar os dados do usuário:', error);
                mostrarMensagem('Erro', `Erro ao analisar os dados do usuário: ${error.message}`, 'erro');
                window.location.href = 'login.html';
                return;
            }

            if (!usuarioData || !usuarioData.id) {
                mostrarMensagem('Erro', 'Usuário não identificado. Faça login ou cadastre-se.', 'erro');
                window.location.href = 'login.html';
                return;
            }

            if (!usuarioData.nome) {
                usuarioData.nome = usuarioData.email || '';
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioData));
            }
            if (!usuarioData.profileImage) {
                usuarioData.profileImage = '../img/default-profile.png';
                localStorage.setItem('usuarioLogado', JSON.stringify(usuarioData));
            }

            const token = localStorage.getItem('authToken');
            if (!token) {
                mostrarMensagem('Erro', 'Usuário não autenticado. Faça login novamente.', 'erro');
                window.location.href = 'login.html';
                return;
            }

            let usuarioId = usuarioData.id;
            if (typeof usuarioId === 'string' && usuarioId.startsWith('user_')) {
                usuarioId = parseInt(usuarioId.replace('user_', ''), 10);
            }

            console.log('ID do usuário logado (convertido):', usuarioId);

            // =========================
            // Valores do formulário
            // =========================
            const titulo = document.getElementById('titulo')?.value.trim() || '';
            const categoria = document.getElementById('categoria')?.value.trim() || '';
            const tipo = document.getElementById('tipo')?.value.trim() || '';
            const estado = document.getElementById('estado')?.value.trim() || '';
            const lugar = document.getElementById('casa')?.value.trim() || '';
            const descricao = document.getElementById('descricao')?.value.trim() || '';
            const estado_doacao = "DISPONIVEL";

            // Input de imagem seguro
            const imagemInput = document.getElementById('imagem2');
            let imagem = null;
            if (imagemInput && imagemInput.files) {
                imagem = imagemInput.files.length > 0 ? imagemInput.files[0] : null;
            }

            if (!titulo || !categoria || !tipo || !estado || !lugar || !descricao) {
                mostrarMensagem('Erro', 'Preencha todos os campos!', 'erro');
                return;
            }

            // =========================
            // Função de envio do post
            // =========================
            async function saveAndSendPost(imagemBase64 = null) {
                const post = {
                    usuario: { id: usuarioId },
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

                console.log('Dados do post:', post);

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
                        mostrarMensagem('Sucesso', 'Postagem criada com sucesso!', 'sucesso');
                        form.reset();
                        window.location.href = 'postagens.html';
                    } else {
                        // Proteção contra JSON vazio
                        let error = { message: 'Erro desconhecido do servidor' };
                        try {
                            error = await response.json();
                        } catch(e) {
                            console.warn('Resposta JSON vazia ou inválida do servidor');
                        }
                        mostrarMensagem('Erro', `Erro ao criar postagem: ${error.message}`, 'erro');
                    }
                } catch (error) {
                    console.error('Erro ao enviar os dados:', error);
                    mostrarMensagem('Erro', 'Erro ao criar postagem. Tente novamente mais tarde.', 'erro');
                }
            }

            if (imagem) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    saveAndSendPost(e.target.result);
                };
                reader.readAsDataURL(imagem);
            } else {
                saveAndSendPost();
            }

        });
    }

    // =========================
    // Botão criar - efeito clique
    // =========================
    const criarBtn = document.querySelector('#criarBtn');
    if (criarBtn) {
        criarBtn.addEventListener("mousedown", function() {
            criarBtn.classList.remove('text-[18px]');
            criarBtn.classList.add('text-[16px]');
        });
        criarBtn.addEventListener("mouseup", function() {
            criarBtn.classList.remove('text-[16px]');
            criarBtn.classList.add('text-[18px]');
        });
    }

});