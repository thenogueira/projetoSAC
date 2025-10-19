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
        closeBtn: document.getElementById('modalCloseBtn')
    };

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

        modalElements.closeBtn.onclick = () => {
            modalElements.modal.classList.add('hidden');
            if (callback) callback();
        };
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

        // ======== PREENCHER TIPO =========
        const tipoSelect = form.tipo;
        if (post.tipo) {
            const tipoLower = post.tipo.toLowerCase().trim();
            const option = Array.from(tipoSelect.options).find(opt => opt.value.toLowerCase() === tipoLower);
            tipoSelect.value = option ? option.value : tipoSelect.options[0].value;
        }

        // ======== PREENCHER CATEGORIA =========
        const categoriaSelect = form.categoria;
        if (post.categoria) {
            const catLower = post.categoria.toLowerCase().trim();
            const option = Array.from(categoriaSelect.options).find(opt => opt.value.toLowerCase() === catLower);
            categoriaSelect.value = option ? option.value : categoriaSelect.options[0].value;
        }

        // ======== PREENCHER URGÊNCIA =========
        const urgenciaSelect = form.urgencia;
        if (post.urgencia) {
            const option = Array.from(urgenciaSelect.options).find(opt => opt.value === post.urgencia);
            urgenciaSelect.value = option ? option.value : urgenciaSelect.options[0].value;
        }

        // ======== PREENCHER LOCALIZAÇÃO =========
        const estadoSelect = document.getElementById('estado');
        const casaInput = document.getElementById('casa');
        const localizacaoContainer = document.getElementById('localizacaoContainer');

        let estado = '';
        let lugar = '';

        if (post.localizacao) {
            // O backend salva como string: "Estado, Lugar"
            if (typeof post.localizacao === 'string') {
                const parts = post.localizacao.split(',');
                estado = parts[0]?.trim() || '';
                lugar = parts[1]?.trim() || '';
            } else if (typeof post.localizacao === 'object') {
                estado = post.localizacao.estado ?? '';
                lugar = post.localizacao.casa ?? post.localizacao.lugar ?? '';
            }
        }

        if (estado && Array.from(estadoSelect.options).some(opt => opt.value === estado)) {
            estadoSelect.value = estado;
        } else {
            estadoSelect.selectedIndex = 0;
        }

        casaInput.value = lugar;
        if (estado || lugar) localizacaoContainer.classList.remove('hidden');

    } catch (error) {
        mostrarMensagem('Erro', 'Erro ao carregar post: ' + error.message, 'erro', () => {
            window.location.href = 'postagens.html';
        });
        return;
    }

    // ======== SUBMISSÃO DO FORMULÁRIO =========
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const estado = document.getElementById('estado').value;
        const casa = document.getElementById('casa').value;
        const localizacao = `${estado}, ${casa}`; // 🔥 Corrigido: string, não objeto

        const updatedPost = {
            titulo: form.titulo.value.trim(),
            descricao: form.descricao.value.trim(),
            categoria: form.categoria.value,
            tipo: form.tipo.value,
            urgencia: form.urgencia.value,
            localizacao // ✅ formato correto
        };

        mostrarMensagem('Confirmação', 'Deseja salvar as alterações?', 'erro', async () => {
            try {
                const putResponse = await fetch(`http://localhost:8080/ocorrencias/editar/${postId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedPost)
                });

                if (!putResponse.ok) throw new Error(`Erro ao atualizar post: ${putResponse.status}`);

                mostrarMensagem('Sucesso', 'Post atualizado com sucesso!', 'sucesso', () => {
                    window.location.href = 'postagens.html';
                });
            } catch (err) {
                console.error('Erro ao atualizar post:', err);
                mostrarMensagem('Erro', 'Erro ao atualizar post: ' + err.message, 'erro');
            }
        });
    });

    // Cancelar alterações
    document.querySelector('button[onclick="history.back()"]').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarMensagem('Confirmação', 'Deseja cancelar as alterações? Nenhuma mudança será salva.', 'erro', () => {
            history.back();
        });
    });

    // Excluir postagem
    document.getElementById('excluirButton')?.addEventListener('click', () => {
        mostrarMensagem('Atenção', 'Deseja mesmo excluir sua postagem?', 'erro', async () => {
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
    toggleLocalizacaoBtn.addEventListener('click', () => {
        const localizacaoContainer = document.getElementById('localizacaoContainer');
        localizacaoContainer.classList.toggle('hidden');
    });
}); 
