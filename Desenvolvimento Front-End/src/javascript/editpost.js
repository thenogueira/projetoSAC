document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const form = document.getElementById('editPostForm');
    const userLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Elementos do modal
    const modalElements = {
        modal: document.getElementById('modalMensagem'),
        content: document.getElementById('modalContent'),
        title: document.getElementById('modalTitle'),
        icon: document.getElementById('modalIcon'),
        closeBtn: document.getElementById('modalCloseBtn'),
        confirmBtn: document.getElementById('modalConfirmBtn'),
        cancelBtn: document.getElementById('modalCancelBtn')
    };

    let currentCallback = null;

    // Função para mostrar mensagem no modal
    function mostrarMensagem(titulo, texto, tipo = 'erro', callback = null) {
        if (!modalElements.modal || !modalElements.content || !modalElements.title || !modalElements.icon) {
            console.error('Elementos do modal não encontrados!');
            alert(`${titulo}: ${texto}`);
            if (callback) callback();
            return;
        }

        modalElements.icon.className = tipo === 'erro'
            ? 'fas fa-exclamation-circle text-red-500 text-2xl mr-3 mt-1'
            : 'fas fa-check-circle text-green-500 text-2xl mr-3 mt-1';

        modalElements.title.textContent = titulo;
        modalElements.content.textContent = texto;
        modalElements.modal.classList.remove('hidden');

        // Configurar botões - SEMPRE mostrar apenas OK para mensagens simples
        if (modalElements.cancelBtn) modalElements.cancelBtn.classList.add('hidden');
        modalElements.confirmBtn.textContent = 'OK';
        modalElements.confirmBtn.className = 'btn-success';

        currentCallback = callback;
    }

    // Função para mostrar confirmação (com OK e Cancelar)
    function mostrarConfirmacao(titulo, texto, callbackConfirm, callbackCancel = null) {
        if (!modalElements.modal || !modalElements.content || !modalElements.title || !modalElements.icon) {
            console.error('Elementos do modal não encontrados!');
            if (confirm(`${titulo}: ${texto}`)) {
                callbackConfirm();
            } else if (callbackCancel) {
                callbackCancel();
            }
            return;
        }

        modalElements.icon.className = 'fas fa-question-circle text-yellow-500 text-2xl mr-3 mt-1';
        modalElements.title.textContent = titulo;
        modalElements.content.textContent = texto;
        modalElements.modal.classList.remove('hidden');

        // Mostrar ambos os botões para confirmação
        if (modalElements.cancelBtn) modalElements.cancelBtn.classList.remove('hidden');
        modalElements.confirmBtn.textContent = 'Sim';
        modalElements.confirmBtn.className = 'btn-success';

        currentCallback = callbackConfirm;
    }

    // Função para mostrar confirmação de exclusão
    function mostrarConfirmacaoExclusao(titulo, texto, callbackConfirm, callbackCancel = null) {
        if (!modalElements.modal || !modalElements.content || !modalElements.title || !modalElements.icon) {
            console.error('Elementos do modal não encontrados!');
            if (confirm(`${titulo}: ${texto}`)) {
                callbackConfirm();
            } else if (callbackCancel) {
                callbackCancel();
            }
            return;
        }

        modalElements.icon.className = 'fas fa-trash-alt text-red-500 text-2xl mr-3 mt-1';
        modalElements.title.textContent = titulo;
        modalElements.content.textContent = texto;
        modalElements.modal.classList.remove('hidden');

        // Mostrar ambos os botões com textos específicos
        if (modalElements.cancelBtn) modalElements.cancelBtn.classList.remove('hidden');
        modalElements.confirmBtn.textContent = 'Excluir';
        modalElements.confirmBtn.className = 'btn-danger';

        currentCallback = callbackConfirm;
    }

    // Event listeners para os botões do modal
    if (modalElements.confirmBtn) {
        modalElements.confirmBtn.onclick = () => {
            modalElements.modal.classList.add('hidden');
            if (currentCallback) {
                currentCallback();
                currentCallback = null;
            }
            // Resetar estilo do botão confirmar
            modalElements.confirmBtn.className = 'btn-success';
        };
    }

    if (modalElements.cancelBtn) {
        modalElements.cancelBtn.onclick = () => {
            modalElements.modal.classList.add('hidden');
            currentCallback = null;
            // Resetar estilo do botão confirmar
            modalElements.confirmBtn.className = 'btn-success';
        };
    }

    // =========================
    // AUTOCOMPLETE DE CEP
    // =========================
    function initCEPAutocomplete() {
        const cepInput = document.getElementById('cep');
        
        if (!cepInput) return;

        // Formatar CEP enquanto digita
        cepInput.addEventListener('input', function() {
            this.value = formatarCEP(this.value);
        });

        // Buscar CEP quando perder foco
        cepInput.addEventListener('blur', buscarCEP);

        // Buscar CEP com Enter
        cepInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarCEP();
            }
        });
    }

    function formatarCEP(cep) {
        cep = cep.replace(/\D/g, '');
        if (cep.length > 5) {
            cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
        }
        if (cep.length > 9) {
            cep = cep.substring(0, 9);
        }
        return cep;
    }

    async function buscarCEP() {
        const cepInput = document.getElementById('cep');
        const cep = cepInput.value.replace(/\D/g, '');

        // Validação básica
        if (cep.length !== 8) {
            mostrarMensagemCEP('CEP deve ter 8 dígitos', 'erro');
            return;
        }

        try {
            mostrarLoadingCEP(true);
            
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            
            const data = await response.json();
            
            if (data.erro) {
                throw new Error('CEP não encontrado');
            }
            
            preencherCamposCEP(data);
            mostrarMensagemCEP('Endereço preenchido automaticamente!', 'sucesso');
            
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            mostrarMensagemCEP('CEP não encontrado. Preencha manualmente.', 'erro');
        } finally {
            mostrarLoadingCEP(false);
        }
    }

    function preencherCamposCEP(data) {
        const campos = {
            'estado': data.uf,
            'bairro': data.bairro,
            'casa': data.logradouro
        };
        
        for (const [id, valor] of Object.entries(campos)) {
            const campo = document.getElementById(id);
            if (campo && valor) {
                campo.value = valor;
                campo.classList.add('auto-filled');
                
                // Remove a classe após 3 segundos
                setTimeout(() => {
                    campo.classList.remove('auto-filled');
                }, 3000);
            }
        }
    }

    function mostrarLoadingCEP(mostrar) {
        const cepInput = document.getElementById('cep');
        
        if (mostrar) {
            cepInput.classList.add('loading');
        } else {
            cepInput.classList.remove('loading');
        }
    }

    function mostrarMensagemCEP(mensagem, tipo) {
        // Remove mensagem anterior
        const mensagemAnterior = document.querySelector('.cep-mensagem');
        if (mensagemAnterior) {
            mensagemAnterior.remove();
        }
        
        // Cria nova mensagem
        const divMensagem = document.createElement('div');
        divMensagem.className = `cep-mensagem text-sm mt-1 p-2 rounded ${
            tipo === 'erro' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`;
        divMensagem.textContent = mensagem;
        
        // Adiciona após o campo CEP
        const cepContainer = document.getElementById('cep').parentNode;
        cepContainer.appendChild(divMensagem);
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            if (divMensagem.parentNode) {
                divMensagem.remove();
            }
        }, 5000);
    }

    // Nenhum post selecionado
    if (!postId) {
        mostrarMensagem('Erro', 'Nenhum post selecionado!', 'erro', () => {
            window.location.href = 'postagens.html';
        });
        return;
    }

    // Buscar post
    let post;
    try {
        const response = await fetch(`http://localhost:8080/ocorrencias/${postId}`);
        if (!response.ok) throw new Error(`Erro ao buscar post. Status: ${response.status}`);
        post = await response.json();

        // Verificar permissão
        if (!userLogado || userLogado.id !== post.usuarioId) {
            mostrarMensagem('Erro', 'Você não tem permissão para editar este post!', 'erro', () => {
                window.location.href = 'postagens.html';
            });
            return;
        }

        // ======== PREENCHER FORMULÁRIO =========
        form.titulo.value = post.titulo || '';
        form.descricao.value = post.descricao || '';

        // ======== PREENCHER TIPO ========= (AGORA EM MAIÚSCULO)
        const tipoSelect = form.tipo;
        if (post.tipo) {
            // Converter para maiúsculo para match com as opções
            const tipoUpper = post.tipo.toUpperCase().trim();
            const option = Array.from(tipoSelect.options).find(opt => opt.value === tipoUpper);
            tipoSelect.value = option ? option.value : tipoSelect.options[0].value;
        }

        // ======== PREENCHER CATEGORIA =========
        const categoriaSelect = form.categoria;
        if (post.categoria) {
            const catLower = post.categoria.toLowerCase().trim();
            const option = Array.from(categoriaSelect.options).find(opt => opt.value.toLowerCase() === catLower);
            categoriaSelect.value = option ? option.value : categoriaSelect.options[0].value;
        }

        // ======== PREENCHER LOCALIZAÇÃO =========
        const estadoSelect = document.getElementById('estado');
        const bairroInput = document.getElementById('bairro');
        const cepInput = document.getElementById('cep');
        const casaInput = document.getElementById('casa');
        const numeroInput = document.getElementById('numero');
        const localizacaoContainer = document.getElementById('localizacaoContainer');

        // Tentar parsear a localização se for string
        if (post.localizacao && typeof post.localizacao === 'string') {
            // Se for uma string simples, colocar no campo casa
            casaInput.value = post.localizacao;
        }

        // Se já tiver algum dado de localização, mostrar o container
        if (post.localizacao) {
            localizacaoContainer.classList.remove('hidden');
        }

    } catch (error) {
        mostrarMensagem('Erro', 'Erro ao carregar post: ' + error.message, 'erro', () => {
            window.location.href = 'postagens.html';
        });
        return;
    }

    // ======== SUBMISSÃO DO FORMULÁRIO =========
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Coletar dados do formulário no formato que o backend espera
        const updatedPost = {
            titulo: form.titulo.value.trim(),
            descricao: form.descricao.value.trim(),
            tipo: form.tipo.value, // Já está em maiúsculo (DOACAO/PEDIDO)
            categoria: form.categoria.value
        };

        // Adicionar localização apenas se o container estiver visível e preenchido
        const localizacaoContainer = document.getElementById('localizacaoContainer');
        if (!localizacaoContainer.classList.contains('hidden')) {
            const casa = document.getElementById('casa').value;
            const numero = document.getElementById('numero').value;
            const bairro = document.getElementById('bairro').value;
            const estado = document.getElementById('estado').value;
            const cep = document.getElementById('cep').value;
            
            // Construir string de localização completa
            let localizacaoParts = [];
            if (casa) localizacaoParts.push(casa);
            if (numero) localizacaoParts.push(numero);
            if (bairro) localizacaoParts.push(bairro);
            if (estado) localizacaoParts.push(estado);
            if (cep) localizacaoParts.push(cep);
            
            if (localizacaoParts.length > 0) {
                updatedPost.localizacao = localizacaoParts.join(', ');
            }
        }

        console.log('Dados enviados para atualização:', updatedPost);

        mostrarConfirmacao('Confirmação', 'Deseja salvar as alterações?', async () => {
            try {
                console.log('Enviando para o servidor:', updatedPost);
                
                const putResponse = await fetch(`http://localhost:8080/ocorrencias/editar/${postId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedPost)
                });

                console.log('Status da resposta:', putResponse.status);
                console.log('Resposta OK?', putResponse.ok);

                const responseText = await putResponse.text();
                console.log('Resposta do servidor:', responseText);

                if (!putResponse.ok) {
                    throw new Error(`Erro ${putResponse.status}: ${responseText}`);
                }

                // Tentar parsear como JSON se for possível
                let responseData;
                try {
                    responseData = JSON.parse(responseText);
                } catch {
                    responseData = responseText;
                }

                console.log('Dados retornados:', responseData);

                mostrarMensagem('Sucesso', 'Post atualizado com sucesso!', 'sucesso', () => {
                    window.location.href = 'postagens.html';
                });
            } catch (err) {
                console.error('Erro completo ao atualizar post:', err);
                mostrarMensagem('Erro', 'Erro ao atualizar post. Tente novamente.', 'erro');
            }
        });
    });

    // Cancelar edição - volta para o post original
    document.getElementById('cancelButton')?.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarConfirmacao('Cancelar Edição', 'Deseja cancelar a edição? Todas as alterações serão perdidas.', () => {
            window.location.href = 'postagens.html';
        });
    });

    // Excluir postagem
    document.getElementById('excluirButton')?.addEventListener('click', () => {
        mostrarConfirmacaoExclusao('Excluir Postagem', 'Tem certeza que deseja excluir esta postagem? Esta ação não pode ser desfeita.', async () => {
            try {
                const delResponse = await fetch(`http://localhost:8080/ocorrencias/deletar/${postId}`, {
                    method: 'DELETE'
                });
                if (!delResponse.ok) throw new Error(`Erro ao deletar post. Status: ${delResponse.status}`);
                mostrarMensagem('Sucesso', 'Post excluído com sucesso!', 'sucesso', () => {
                    window.location.href = 'postagens.html';
                });
            } catch (err) {
                mostrarMensagem('Erro', 'Erro ao deletar post: ' + err.message, 'erro');
            }
        });
    });

    // Toggle localização
    const toggleLocalizacaoBtn = document.getElementById('toggleLocalizacaoBtn');
    if (toggleLocalizacaoBtn) {
        toggleLocalizacaoBtn.addEventListener('click', () => {
            const localizacaoContainer = document.getElementById('localizacaoContainer');
            localizacaoContainer.classList.toggle('hidden');
        });
    }

    // =========================
    // INICIALIZAR AUTOCOMPLETE DE CEP
    // =========================
    initCEPAutocomplete();
});